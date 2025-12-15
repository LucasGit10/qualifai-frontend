import { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import socket from '../services/socket';

const deconstructComponentsForForm = (components = []) => {
  const header = components.find(c => c.type === 'HEADER');
  const body = components.find(c => c.type === 'BODY');
  const footer = components.find(c => c.type === 'FOOTER');
  const buttonsComp = components.find(c => c.type === 'BUTTONS');

  let buttonType = 'NONE';
  let quickReplyButtons = [];
  let urlButtonText = '';
  let urlButtonUrl = '';

  if (buttonsComp && buttonsComp.buttons && buttonsComp.buttons.length > 0) {
    if (buttonsComp.buttons[0].type === 'QUICK_REPLY') {
      buttonType = 'QUICK_REPLY';
      quickReplyButtons = buttonsComp.buttons.map(b => ({ text: b.text }));
    } else if (buttonsComp.buttons[0].type === 'URL') {
      buttonType = 'URL';
      urlButtonText = buttonsComp.buttons[0].text;
      urlButtonUrl = buttonsComp.buttons[0].url;
    }
  }

  return {
    headerType: header?.format || 'NONE',
    headerText: header?.format === 'TEXT' ? header.text : '',
    bodyText: body?.text || '',
    footerText: footer?.text || '',
    buttonType: buttonType,
    quickReplyButtons: quickReplyButtons,
    urlButtonText: urlButtonText,
    urlButtonUrl: urlButtonUrl
  };
};

const formatPayloadForAPI = (formData) => {
  const components = [];

  if (formData.headerType === 'TEXT') {
    components.push({
      type: 'HEADER',
      format: 'TEXT',
      text: formData.headerText
    });
  } else if (['IMAGE', 'VIDEO', 'DOCUMENT'].includes(formData.headerType)) {
    components.push({
      type: 'HEADER',
      format: formData.headerType
    });
  }

  components.push({
    type: 'BODY',
    text: formData.bodyText
  });

  if (formData.footerText && formData.footerText.trim() !== '') {
    components.push({
      type: 'FOOTER',
      text: formData.footerText
    });
  }

  if (formData.buttonType === 'QUICK_REPLY' && formData.quickReplyButtons) {
    const validButtons = formData.quickReplyButtons
      .filter(btn => btn.text && btn.text.trim() !== '')
      .map(btn => ({
        type: 'QUICK_REPLY',
        text: btn.text,
      }));

    if (validButtons.length > 0) {
      components.push({
        type: 'BUTTONS',
        buttons: validButtons
      });
    }
  } else if (formData.buttonType === 'URL' && formData.urlButtonText && formData.urlButtonUrl) {
    components.push({
      type: 'BUTTONS',
      buttons: [{
        type: 'URL',
        text: formData.urlButtonText,
        url: formData.urlButtonUrl
      }]
    });
  }

  return {
    name: formData.name,
    category: formData.category,
    language: formData.language,
    templateType: formData.templateType,
    whatsappInstanceId: formData.whatsappInstanceId,
    components: components,
  };
};

export const useMessageTemplates = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [dialogState, setDialogState] = useState({ create: false, edit: false, submit: false, delete: false });
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [correctedData, setCorrectedData] = useState(null); 
  const [currentTab, setCurrentTab] = useState(0);

  const { data: templates, isLoading: isLoadingTemplates } = useQuery(
    'messageTemplates',
    () => api.get('/template-message').then(res => res.data)
  );

  const { data: instances, isLoading: isLoadingInstances } = useQuery(
    'officialWhatsappInstances',
    () => api.get('/whatsapp/').then(res => res.data),
    {
      enabled: dialogState.submit || dialogState.create,
    }
  );

  const { conversationTemplates, followUpTemplates } = useMemo(() => {
    if (!templates) return { conversationTemplates: [], followUpTemplates: [] };
    const conversation = templates.filter(t => t.templateType !== 'follow_up');
    const followUp = templates.filter(t => t.templateType === 'follow_up');
    return { conversationTemplates: conversation, followUpTemplates: followUp };
  }, [templates]);

  useEffect(() => {
    const handleTemplateUpdate = (updatedTemplate) => {
      if (updatedTemplate.name && updatedTemplate.status) {
        toast.info(t('templatesPage.toasts.statusUpdate', { templateName: updatedTemplate.name }));
        queryClient.invalidateQueries('messageTemplates');
      }
    };
    socket.on('template_status_updated', handleTemplateUpdate);
    return () => {
      socket.off('template_status_updated', handleTemplateUpdate);
    };
  }, [queryClient, t]);

  const handleMutationSuccess = (toastMessage) => {
    queryClient.invalidateQueries('messageTemplates');
    toast.success(toastMessage);
    handleCloseDialogs();
  };

  const handleMutationError = (error, defaultMessage) => {
    toast.error(error.response?.data?.message || defaultMessage);
  };

  const uploadSampleMutation = useMutation(
    (file) => {
      const formData = new FormData();
      formData.append('sampleImage', file); 
      
      return api.post('/template-message/upload-sample', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    {
      onSuccess: (response) => {
        toast.success(t('templatesPage.toasts.sampleUploaded', 'Amostra enviada com sucesso!'));
        return response.data;
      },
      onError: (err) => handleMutationError(err, t('templatesPage.toasts.sampleUploadError', 'Erro ao enviar amostra.')),
    }
  );

  const createTemplateMutation = useMutation(
    (data) => api.post('/template-message', data),
    {
      onSuccess: () => handleMutationSuccess(t('templatesPage.toasts.templateSaved')),
      onError: (err) => handleMutationError(err, t('templatesPage.toasts.templateSaveError')),
    }
  );

  const updateTemplateMutation = useMutation(
    ({ templateId, data }) => api.put(`/template-message/${templateId}`, data),
    {
      onSuccess: () => handleMutationSuccess(t('templatesPage.toasts.templateUpdated')),
      onError: (err) => handleMutationError(err, t('templatesPage.toasts.templateUpdateError')),
    }
  );

  const deleteTemplateMutation = useMutation(
    (templateId) => api.delete(`/template-message/${templateId}`),
    {
      onSuccess: () => handleMutationSuccess(t('templatesPage.toasts.templateDeleted')),
      onError: (err) => handleMutationError(err, t('templatesPage.toasts.templateDeleteError')),
    }
  );

  const submitTemplateMutation = useMutation(
    ({ templateId, payload }) => api.post(`/template-message/${templateId}/submit`, payload),
    {
      onSuccess: () => handleMutationSuccess(t('templatesPage.toasts.templateSubmitted')),
      onError: (err) => handleMutationError(err, t('templatesPage.toasts.templateSubmitError')),
    }
  );

  const resubmitTemplateMutation = useMutation(
    ({ templateId, payload }) => api.post(`/template-message/${templateId}/resubmit`, payload),
    {
      onSuccess: (response) => handleMutationSuccess(response.data.message || t('templatesPage.toasts.templateResubmitted')),
      onError: (err) => handleMutationError(err, t('templatesPage.toasts.templateResubmitError')),
    }
  );

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleOpenDialog = (dialog, template = null) => {
    setSelectedTemplate(template);
    setDialogState(prev => ({ ...prev, [dialog]: true }));
  };

  const handleCloseDialogs = () => {
    setDialogState({ create: false, edit: false, submit: false, delete: false });
    setSelectedTemplate(null);
    setCorrectedData(null);
  };

  const handleCardAction = (action, template) => {
    if (['edit', 'submit', 'delete'].includes(action)) {
      handleOpenDialog(action, template);
    }
  };

  const handleFormSubmit = (formData) => {
    const payload = formatPayloadForAPI(formData);
    
    if (dialogState.create) {
      createTemplateMutation.mutate(payload);
    } else if (selectedTemplate?.status === 'draft') {
      updateTemplateMutation.mutate({ templateId: selectedTemplate._id, data: payload });
    } else if (selectedTemplate?.status === 'rejected') {
      setCorrectedData(payload);
      setDialogState({ create: false, edit: false, submit: true, delete: false });
    }
  };

  const onSubmitApproval = (whatsappInstanceId, sampleUrl) => {
    if (!selectedTemplate) return;

    if (selectedTemplate.status === 'rejected') {
      
      const dataToResubmit = correctedData || {
        name: selectedTemplate.name,
        category: selectedTemplate.category,
        language: selectedTemplate.language,
        templateType: selectedTemplate.templateType,
        components: selectedTemplate.components
      };

      const payload = {
        ...dataToResubmit,
        whatsappInstanceId,
        sampleUrl
      };
      
      resubmitTemplateMutation.mutate({
        templateId: selectedTemplate._id,
        payload: payload
      });

    } else if (selectedTemplate.status === 'draft') {
      const payload = {
        whatsappInstanceId,
        sampleUrl
      };
      submitTemplateMutation.mutate({
        templateId: selectedTemplate._id,
        payload: payload
      });
    } else {
      toast.error("Apenas templates em 'Rascunho' ou 'Rejeitado' podem ser enviados.");
    }
  };

  const onDeleteConfirm = () => {
    if (!selectedTemplate) return;
    deleteTemplateMutation.mutate(selectedTemplate._id);
  };

  const mutationIsLoading =
    createTemplateMutation.isLoading ||
    updateTemplateMutation.isLoading ||
    deleteTemplateMutation.isLoading ||
    submitTemplateMutation.isLoading ||
    resubmitTemplateMutation.isLoading ||
    uploadSampleMutation.isLoading;

  return {
    isLoadingTemplates,
    templates,
    conversationTemplates,
    followUpTemplates,
    instances,
    isLoadingInstances,
    currentTab,
    dialogState,
    selectedTemplate,
    correctedData, 
    mutationIsLoading,
    uploadSampleMutation,
    handleTabChange,
    handleOpenDialog,
    handleCloseDialogs,
    handleCardAction,
    handleFormSubmit,
    onSubmitApproval,
    onDeleteConfirm,
    deconstructComponentsForForm
  };
};