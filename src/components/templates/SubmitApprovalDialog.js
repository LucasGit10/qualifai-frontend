import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Button, DialogTitle, DialogContent, DialogActions,
  FormControl, InputLabel, Select, MenuItem, Stack, Typography,
  Alert, Box, TextField,
  InputAdornment,
  CircularProgress
} from '@mui/material';
import { 
  Send as SendIcon,
  Link as LinkIcon,
  UploadFile as UploadFileIcon
} from '@mui/icons-material';
import { useTranslation, Trans } from 'react-i18next';
import { toast } from 'react-toastify';
import { StyledDialog } from 'components/ui/StyledDialog';
import { GradientButton } from 'components/ui/GradientButton';
import { formatTemplateNameForDisplay } from 'utils/templateUtils';

export const SubmitApprovalDialog = ({ 
  open, 
  onClose, 
  onSubmit, 
  isLoading, 
  template, 
  correctedData,
  instances, 
  instancesLoading,
  onUploadSample,
  isUploading,
}) => {
  const { t } = useTranslation();
  const [instanceId, setInstanceId] = useState('');
  const [sampleUrl, setSampleUrl] = useState('');
  
  const hiddenFileInput = useRef(null); 

  const effectiveTemplateData = useMemo(() => {
    if (correctedData) {
      return correctedData; 
    }
    return template; 
  }, [template, correctedData]);

  const isMediaTemplate = useMemo(() => {
    if (!effectiveTemplateData) return false;
    const header = effectiveTemplateData.components.find(c => c.type === 'HEADER');
    return header && ['IMAGE', 'VIDEO', 'DOCUMENT'].includes(header.format);
  }, [effectiveTemplateData]);

  const headerFormat = useMemo(() => {
     if (!isMediaTemplate || !effectiveTemplateData) return null;
     return effectiveTemplateData.components.find(c => c.type === 'HEADER').format;
  }, [effectiveTemplateData, isMediaTemplate]);

  useEffect(() => {
    if (open) {
      if (template && template.wabaId && instances) {
        const matchingInstance = instances.find(inst => inst.wabaId === template.wabaId);
        if (matchingInstance) {
          setInstanceId(matchingInstance._id);
        }
      } else if (!template && instances && instances.length > 0) {
        setInstanceId(instances[0]?._id || '');
      }
    } else {
      setInstanceId('');
      setSampleUrl('');
    }
  }, [template, instances, open]);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) { // 5MB
      toast.error(t('templatesPage.toasts.fileTooLarge', 'Arquivo muito grande (Máx 5MB).'));
      return;
    }

    try {
      // 'onUploadSample' é o 'mutateAsync', que retorna o objeto axios completo
      const response = await onUploadSample(file); 
      
      // A CORREÇÃO ESTÁ AQUI:
      // Acessamos 'response.data.sampleUrl' em vez de 'response.sampleUrl'
      if (response && response.data && response.data.sampleUrl) {
        setSampleUrl(response.data.sampleUrl);
      } else {
        // Segurança caso a API mude ou a resposta venha vazia
        toast.error(t('templatesPage.toasts.sampleUploadError', 'Não foi possível obter a URL do upload.'));
      }
    } catch (error) {
      // O hook 'useMessageTemplates' já trata o toast de erro da chamada
      console.error("Falha na chamada de upload", error);
    }
  };

  const handleUploadClick = () => {
    hiddenFileInput.current?.click();
  };

  const handleSubmit = () => {
    if (!instanceId) {
      toast.error(t('templatesPage.toasts.selectInstance'));
      return;
    }
    
    if (isMediaTemplate) {
      if (!sampleUrl) {
         toast.error(t('templatesPage.toasts.sampleUrlRequired', 'Por favor, insira uma URL de exemplo.'));
         return;
      }
      try {
        const url = new URL(sampleUrl);
        if (url.protocol !== 'https:') {
          toast.error(t('templatesPage.toasts.httpsRequired', 'A URL deve começar com https://'));
          return;
        }
      } catch (e) {
        toast.error(t('templatesPage.toasts.invalidUrl', 'A URL de exemplo parece ser inválida.'));
        return;
      }
    }
    
    onSubmit(instanceId, sampleUrl);
  };

  const isSubmitDisabled = isLoading || isUploading || !instanceId || (isMediaTemplate && !sampleUrl);

  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <SendIcon />{t('templatesPage.submitDialog.title')}
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={3} sx={{ pt: 2 }}>
          <Typography>
            <Trans i18nKey="templatesPage.submitDialog.description" values={{ templateName: formatTemplateNameForDisplay(template?.name) }}>
              Selecione a instância para submeter o template <Typography component="span" fontWeight="bold">"{formatTemplateNameForDisplay(template?.name)}"</Typography> à Meta.
            </Trans>
          </Typography>
          
          <FormControl fullWidth>
            <InputLabel>{t('templatesPage.submitDialog.instanceLabel')}</InputLabel>
            <Select
              value={instanceId}
              label={t('templatesPage.submitDialog.instanceLabel')}
              onChange={(e) => setInstanceId(e.target.value)}
              disabled={instancesLoading || (!!template?.wabaId)}
            >
              {instances?.map((instance) => (
                <MenuItem key={instance._id} value={instance._id}>
                  {instance.instanceName} ({instance.phoneNumber})
                </MenuItem>
              ))}
            </Select>
            {instancesLoading && <Typography variant="caption" sx={{ mt: 1 }}>{t('templatesPage.submitDialog.loadingInstances')}</Typography>}
          </FormControl>

          {isMediaTemplate && (
            <Box>
              <Alert severity="info" sx={{ mb: 2 }}>
                {t('templatesPage.submitDialog.sampleUrlRequiredInfo', 
                  'A Meta exige uma URL de exemplo. Cole o link (HTTPS) abaixo ou faça o upload de um arquivo para gerar o link.'
                )}
              </Alert>
              
              <input
                type="file"
                ref={hiddenFileInput}
                onChange={handleFileChange}
                style={{ display: 'none' }}
                accept="image/*,video/*,application/pdf"
              />
              
              <TextField
                fullWidth
                label={t('templatesPage.submitDialog.sampleUrlLabel', 'URL Pública do Exemplo (HTTPS)')}
                placeholder="https://... ou faça upload"
                value={sampleUrl}
                onChange={(e) => setSampleUrl(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LinkIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button
                        variant="contained"
                        size="small"
                        onClick={handleUploadClick}
                        disabled={isUploading}
                        startIcon={isUploading ? <CircularProgress size={20} color="inherit" /> : <UploadFileIcon />}
                        sx={{ mr: -1 }}
                      >
                        {isUploading ? t('common.uploading') : t('common.upload')}
                      </Button>
                    </InputAdornment>
                  )
                }}
              />
            </Box>
          )}

        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: '16px 24px' }}>
        <Button onClick={onClose} color="inherit" disabled={isLoading || isUploading}>{t('common.cancel')}</Button>
        <GradientButton onClick={handleSubmit} loading={isLoading} disabled={isSubmitDisabled}>
          {t('templatesPage.submitDialog.sendButton')}
        </GradientButton>
      </DialogActions>
    </StyledDialog>
  );
};