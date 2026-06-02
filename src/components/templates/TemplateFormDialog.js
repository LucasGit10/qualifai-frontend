import React, { useEffect, useState } from 'react';
import {
  DialogTitle, DialogContent, DialogActions, TextField, Alert,
  Grid, FormControl, InputLabel, Select, MenuItem,
  IconButton, Stack, useTheme, Typography, Box, Paper, Button,
  Divider,
  InputAdornment,
  alpha,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@mui/material';
import {
  Close as CloseIcon,
  Add as AddIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { useQuery } from 'react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import { StyledDialog } from 'components/ui/StyledDialog';
import { GradientButton } from 'components/ui/GradientButton';
import MetaPricingTable from 'components/templates/MetaPricingTable';
import { applyNameMask, formatTemplateNameForDisplay } from 'utils/templateUtils';
import api from 'services/api';

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

export const TemplateFormDialog = ({ open, onClose, onSubmit, template, isLoading }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const [activeStep, setActiveStep] = useState(0);
  const steps = [
    { key: 'configTitle', fields: ['whatsappInstanceId', 'name', 'templateType', 'category', 'language'] },
    { key: 'contentTitle', fields: ['headerText', 'bodyText'] },
    { key: 'buttonsTitle', fields: ['urlButtonText', 'urlButtonUrl', 'quickReplyButtons'] }
  ];

  const { control, handleSubmit, reset, watch, trigger, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      category: 'MARKETING',
      language: 'pt_BR',
      templateType: 'conversation',
      whatsappInstanceId: '',
      headerType: 'NONE',
      headerText: '',
      bodyText: '',
      footerText: '',
      buttonType: 'NONE',
      quickReplyButtons: [],
      urlButtonText: '',
      urlButtonUrl: ''
    },
    mode: 'onChange'
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'quickReplyButtons'
  });

  const selectedCategory = watch('category');
  const headerType = watch('headerType');
  const buttonType = watch('buttonType');

  const isEditMode = !!template;

  const { data: instances, isLoading: instancesLoading } = useQuery(
    'officialWhatsappInstances',
    () => api.get('/whatsapp/').then(res => res.data),
    {
      enabled: open,
    }
  );

  const [defaultInstanceId, setDefaultInstanceId] = useState('');

  useEffect(() => {
    if (instances && instances.length > 0) {
      const validInstance = instances.find(inst => inst.wabaId && inst.status === 'connected');
      if (validInstance) {
        setDefaultInstanceId(validInstance._id);
      }
    }
  }, [instances]);

  useEffect(() => {
    if (open) {
      if (template) {
        const deconstructed = deconstructComponentsForForm(template.components);
        reset({
          name: formatTemplateNameForDisplay(template.name),
          category: template.category,
          language: template.language,
          templateType: template.templateType || 'conversation',
          whatsappInstanceId: template.wabaId || '',
          headerType: deconstructed.headerType,
          headerText: deconstructed.headerText,
          bodyText: deconstructed.bodyText,
          footerText: deconstructed.footerText,
          buttonType: deconstructed.buttonType,
          quickReplyButtons: deconstructed.quickReplyButtons,
          urlButtonText: deconstructed.urlButtonText,
          urlButtonUrl: deconstructed.urlButtonUrl
        });
      } else {
        reset({
          name: '',
          category: 'MARKETING',
          language: 'pt_BR',
          templateType: 'conversation',
          whatsappInstanceId: defaultInstanceId,
          headerType: 'NONE',
          headerText: '',
          bodyText: '',
          footerText: '',
          buttonType: 'NONE',
          quickReplyButtons: [],
          urlButtonText: '',
          urlButtonUrl: ''
        });
      }
      setActiveStep(0);
    }
  }, [template, open, reset, defaultInstanceId]);

  useEffect(() => {
    if (open && !isEditMode && defaultInstanceId) {
      reset(formValues => ({
        ...formValues,
        whatsappInstanceId: defaultInstanceId
      }));
    }
  }, [open, isEditMode, defaultInstanceId, reset]);

  const submitButtonText = isEditMode && template?.status === 'rejected'
    ? t('templatesPage.formDialog.correctAndResubmit')
    : (isEditMode ? t('templatesPage.formDialog.saveChanges') : t('templatesPage.formDialog.createTemplate'));

  const handleAddQuickReplyButton = () => {
    if (fields.length < 3) {
      append({ text: '' });
    }
  };

  const handleNext = async () => {
    const fieldsToValidate = steps[activeStep].fields;
    const isValid = await trigger(fieldsToValidate);

    if (isValid) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else {
      toast.error(t('templatesPage.toasts.validationError') || 'Por favor, preencha os campos obrigatórios.');
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleFormSubmitWithValidation = (formData) => {
    onSubmit(formData);
  };

  const glassStyle = {
    backgroundColor: alpha(theme.palette.background.paper, 0.4),
    backdropFilter: 'blur(10px)',
    border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
    borderRadius: 2,
  };

  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="lg" fullWidth component="form" onSubmit={handleSubmit(handleFormSubmitWithValidation)}>
      <DialogTitle sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: 'text.primary',
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}>
        {isEditMode ? t('templatesPage.formDialog.editTitle') : t('templatesPage.formDialog.newTitle')}
        <IconButton aria-label="close" onClick={onClose} sx={{ color: 'text.secondary' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ bgcolor: 'background.default' }}>
        <Grid container spacing={3} sx={{ pt: 2 }}>

          <Grid item xs={12} md={7}>
            <Stepper activeStep={activeStep} orientation="vertical">

              <Step key="panel1">
                <StepLabel>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {t('templatesPage.formDialog.configTitle')}
                  </Typography>
                </StepLabel>
                <StepContent>
                  <Box sx={{ ...glassStyle, p: 3, mt: 1 }}>
                    <Stack spacing={2.5}>
                      {!isEditMode && (
                        <Controller
                          name="whatsappInstanceId"
                          control={control}
                          rules={{ required: t('templatesPage.submitDialog.instanceRequired') }}
                          render={({ field }) => (
                            <FormControl fullWidth error={!!errors.whatsappInstanceId}>
                              <InputLabel>{t('templatesPage.submitDialog.instanceLabel')}</InputLabel>
                              <Select {...field} label={t('templatesPage.submitDialog.instanceLabel')} disabled={instancesLoading}>
                                {instances?.map((instance) => (
                                  <MenuItem key={instance._id} value={instance._id}>
                                    {instance.instanceName} ({instance.phoneNumber})
                                  </MenuItem>
                                ))}
                              </Select>
                              {errors.whatsappInstanceId && <Typography component="span" variant="caption" color="error">{errors.whatsappInstanceId.message}</Typography>}
                            </FormControl>
                          )}
                        />
                      )}
                      <Controller
                        name="name"
                        control={control}
                        rules={{ required: t('templatesPage.formDialog.nameRequired') }}
                        render={({ field: { onChange, ...restField } }) => (
                          <TextField
                            {...restField}
                            label={t('templatesPage.formDialog.nameLabel')}
                            error={!!errors.name}
                            helperText={errors.name?.message}
                            onChange={(e) => onChange(applyNameMask(e.target.value))}
                            fullWidth
                            disabled={isEditMode}
                          />
                        )}
                      />
                      <Controller
                        name="templateType"
                        control={control}
                        rules={{ required: t('templatesPage.formDialog.typeRequired') }}
                        render={({ field }) => (
                          <FormControl fullWidth>
                            <InputLabel>{t('templatesPage.formDialog.typeLabel')}</InputLabel>
                            <Select {...field} label={t('templatesPage.formDialog.typeLabel')}>
                              <MenuItem value="conversation">{t('templatesPage.formDialog.typeConversation')}</MenuItem>
                              <MenuItem value="follow_up">{t('templatesPage.formDialog.typeFollowUp')}</MenuItem>
                            </Select>
                          </FormControl>
                        )}
                      />
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Controller name="category" control={control} rules={{ required: true }} render={({ field }) => (
                            <FormControl fullWidth>
                              <InputLabel>{t('templatesPage.formDialog.categoryLabel')}</InputLabel>
                              <Select {...field} label={t('templatesPage.formDialog.categoryLabel')}>
                                <MenuItem value="MARKETING">{t('templatesPage.formDialog.categoryMarketing')}</MenuItem>
                                <MenuItem value="UTILITY">{t('templatesPage.formDialog.categoryUtility')}</MenuItem>
                                <MenuItem value="AUTHENTICATION">{t('templatesPage.formDialog.categoryAuth')}</MenuItem>
                              </Select>
                            </FormControl>
                          )} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Controller name="language" control={control} rules={{ required: true }} render={({ field }) => (
                            <FormControl fullWidth>
                              <InputLabel>{t('templatesPage.formDialog.languageLabel')}</InputLabel>
                              <Select {...field} label={t('templatesPage.formDialog.languageLabel')}>
                                <MenuItem value="pt_BR">{t('templatesPage.formDialog.langPtBr')}</MenuItem>
                                <MenuItem value="en_US">{t('templatesPage.formDialog.langEnUs')}</MenuItem>
                                <MenuItem value="es_ES">{t('templatesPage.formDialog.langEsEs')}</MenuItem>
                              </Select>
                            </FormControl>
                          )} />
                        </Grid>
                      </Grid>
                    </Stack>
                  </Box>
                </StepContent>
              </Step>

              <Step key="panel2">
                <StepLabel>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {t('templatesPage.formDialog.contentTitle')}
                  </Typography>
                </StepLabel>
                <StepContent>
                  <Box sx={{ ...glassStyle, p: 3, mt: 1 }}>
                    <Stack spacing={2.5}>
                      <Controller
                        name="headerType"
                        control={control}
                        render={({ field }) => (
                          <FormControl fullWidth>
                            <InputLabel>{t('templatesPage.formDialog.headerLabel')}</InputLabel>
                            <Select {...field} label={t('templatesPage.formDialog.headerLabel')}>
                              <MenuItem value="NONE">{t('templatesPage.formDialog.headerNone')}</MenuItem>
                              <MenuItem value="TEXT">{t('templatesPage.formDialog.headerText')}</MenuItem>

                              <MenuItem value="IMAGE">{t('templatesPage.formDialog.headerImage', 'Imagem')}</MenuItem>
                              <MenuItem value="VIDEO">{t('templatesPage.formDialog.headerVideo', 'Video')}</MenuItem>
                              <MenuItem value="DOCUMENT">{t('templatesPage.formDialog.headerDocument', 'Documento')}</MenuItem>

                            </Select>
                          </FormControl>
                        )}
                      />
                      {headerType === 'TEXT' && (
                        <Controller
                          name="headerText"
                          control={control}
                          rules={{ required: t('templatesPage.formDialog.headerTextRequired') }}
                          render={({ field }) => (
                            <TextField {...field} label={t('templatesPage.formDialog.headerTextLabel')} error={!!errors.headerText} helperText={errors.headerText?.message} fullWidth />
                          )}
                        />
                      )}
                      {['IMAGE', 'VIDEO', 'DOCUMENT'].includes(headerType) && (
                        <Alert severity="info" variant="outlined" sx={{ ...glassStyle }}>
                          {t('templatesPage.formDialog.mediaHeaderHelp', 'Você especificará a mídia real (imagem, vídeo, etc.) no momento do envio da mensagem, não aqui.')}
                        </Alert>
                      )}

                      <Divider sx={{ my: 1 }} />
                      <Controller
                        name="bodyText"
                        control={control}
                        rules={{ required: t('templatesPage.formDialog.bodyRequired') }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label={t('templatesPage.formDialog.bodyLabel')}
                            multiline
                            rows={6}
                            error={!!errors.bodyText}
                            helperText={errors.bodyText?.message || t('templatesPage.formDialog.bodyHelper')}
                            fullWidth
                          />
                        )}
                      />
                      <Divider sx={{ my: 1 }} />
                      <Controller
                        name="footerText"
                        control={control}
                        render={({ field }) => (
                          <TextField {...field} label={t('templatesPage.formDialog.footerLabel')} helperText={t('templatesPage.formDialog.footerHelper')} fullWidth />
                        )}
                      />
                    </Stack>
                  </Box>
                </StepContent>
              </Step>

              <Step key="panel3">
                <StepLabel>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {t('templatesPage.formDialog.buttonsTitle')}
                  </Typography>
                </StepLabel>
                <StepContent>
                  <Box sx={{ ...glassStyle, p: 3, mt: 1 }}>
                    <Stack spacing={2}>
                      <Controller
                        name="buttonType"
                        control={control}
                        render={({ field }) => (
                          <FormControl>
                            <RadioGroup {...field}>
                              <FormControlLabel value="NONE" control={<Radio />} label={t('templatesPage.formDialog.buttonTypeNone')} />
                              <FormControlLabel value="QUICK_REPLY" control={<Radio />} label={t('templatesPage.formDialog.buttonTypeQuickReply')} />
                              <FormControlLabel value="URL" control={<Radio />} label={t('templatesPage.formDialog.buttonTypeUrl')} />
                            </RadioGroup>
                          </FormControl>
                        )}
                      />

                      {buttonType === 'QUICK_REPLY' && (
                        <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: 'action.hover' }}>
                          <Stack spacing={2}>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>{t('templatesPage.formDialog.quickReplyHelp')}</Typography>
                            {fields.map((item, index) => (
                              <Stack direction="row" spacing={1} key={item.id}>
                                <Controller
                                  name={`quickReplyButtons.${index}.text`}
                                  control={control}
                                  rules={{ required: t('templatesPage.formDialog.buttonTextRequired') }}
                                  render={({ field }) => (
                                    <TextField {...field} label={`${t('templatesPage.formDialog.buttonTextLabel')} ${index + 1}`} fullWidth error={!!errors.quickReplyButtons?.[index]?.text} />
                                  )}
                                />
                                <IconButton aria-label="Deletar Botão" onClick={() => remove(index)} sx={{ color: 'error.main' }}>
                                  <DeleteIcon />
                                </IconButton>
                              </Stack>
                            ))}
                            {fields.length < 3 && (
                              <Button startIcon={<AddIcon />} onClick={handleAddQuickReplyButton} variant="outlined" color="secondary">
                                {t('templatesPage.formDialog.addButton')} (Máx: 3)
                              </Button>
                            )}
                          </Stack>
                        </Paper>
                      )}

                      {buttonType === 'URL' && (
                        <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: 'action.hover' }}>
                          <Stack spacing={2}>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>{t('templatesPage.formDialog.urlButtonHelp')}</Typography>
                            <Controller
                              name="urlButtonText"
                              control={control}
                              rules={{ required: t('templatesPage.formDialog.buttonTextRequired') }}
                              render={({ field }) => (
                                <TextField {...field} label={t('templatesPage.formDialog.buttonTextLabel')} fullWidth error={!!errors.urlButtonText} />
                              )}
                            />
                            <Controller
                              name="urlButtonUrl"
                              control={control}
                              rules={{ required: t('templatesPage.formDialog.buttonUrlRequired') }}
                              render={({ field }) => (
                                <TextField {...field} label={t('templatesPage.formDialog.buttonUrlLabel')} fullWidth error={!!errors.urlButtonUrl}
                                  InputProps={{
                                    startAdornment: <InputAdornment position="start">https://</InputAdornment>,
                                  }}
                                />
                              )}
                            />
                          </Stack>
                        </Paper>
                      )}
                    </Stack>
                  </Box>
                </StepContent>
              </Step>
            </Stepper>
          </Grid>

          <Grid item xs={12} md={5}>
            <Box sx={{ position: 'sticky', top: 16 }}>
              <Paper sx={{ ...glassStyle, p: 2 }}>
                <MetaPricingTable selectedCategory={selectedCategory} />
              </Paper>
              <Alert severity="info" sx={{ mt: 2, ...glassStyle, p: 2 }}>
                {t('templatesPage.formDialog.infoAlert')}
              </Alert>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: '16px 24px', bgcolor: 'background.paper', borderTop: '1px solid', borderColor: 'divider' }}>
        <Button onClick={onClose} color="inherit" disabled={isLoading}>
          {t('common.cancel')}
        </Button>
        <Box sx={{ flexGrow: 1 }} />

        {activeStep > 0 && (
          <Button onClick={handleBack} sx={{ mr: 1 }} disabled={isLoading}>
            {t('common.back')}
          </Button>
        )}

        {activeStep < steps.length - 1 ? (
          <Button onClick={handleNext} variant="contained" disabled={isLoading}>
            {t('common.next')}
          </Button>
        ) : (
          <GradientButton type="submit" loading={isLoading}>
            {submitButtonText}
          </GradientButton>
        )}
      </DialogActions>
    </StyledDialog>
  );
};
