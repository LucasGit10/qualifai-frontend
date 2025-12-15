import React, { useMemo } from 'react';
import { Box, Typography, TextField, Switch, FormControlLabel, Alert, useTheme, Grid, Collapse, Divider, MenuItem, IconButton, Button } from '@mui/material';
import { Controller, useFieldArray } from 'react-hook-form';
import { useShowcaseContext } from '../../../contexts/ShowcaseContext';
import ShowcaseBlocker from '../../Showcase/ShowcaseBlocker';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next'; // 1. Importar

export default function PipefySettings({ control, register, watch }) {
  const { t } = useTranslation(); // 2. Inicializar
  const { isGuestMode } = useShowcaseContext();
  const watchPipefy = watch("pipefyEnabled");
  const theme = useTheme();

  // 3. Gerar a lista de campos dinamicamente a partir do JSON
  const qualifaiLeadFields = useMemo(() => [
    { value: 'name', label: t('settingsPage.crm.pipefy.qualifaiLeadFields.name') },
    { value: 'email', label: t('settingsPage.crm.pipefy.qualifaiLeadFields.email') },
    { value: 'phone', label: t('settingsPage.crm.pipefy.qualifaiLeadFields.phone') },
    { value: 'company', label: t('settingsPage.crm.pipefy.qualifaiLeadFields.company') },
    { value: 'position', label: t('settingsPage.crm.pipefy.qualifaiLeadFields.position') },
    { value: 'source', label: t('settingsPage.crm.pipefy.qualifaiLeadFields.source') },
    { value: 'status', label: t('settingsPage.crm.pipefy.qualifaiLeadFields.status') },
  ], [t]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "pipefyFieldMappings"
  });

  return (
    <>
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          {t('settingsPage.crm.pipefy.title')} {t('settingsPage.inDevelopment')}
        </Typography>
        <ShowcaseBlocker inline>
          <Controller
            name="pipefyEnabled"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={<Switch {...field} checked={!!field.value} color="switch"/>}
                label={t('settingsPage.crm.pipefy.enableLabel')}
              />
            )}
          />
        </ShowcaseBlocker>
        <Collapse in={watchPipefy}>
          <Box>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t('settingsPage.crm.pipefy.pipelineIdLabel')}
                  margin="normal"
                  {...register('pipefyPipelineId')}
                  helperText={t('settingsPage.crm.pipefy.pipelineIdHelper')}
                  disabled={isGuestMode}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="password"
                  label={t('settingsPage.crm.pipefy.apiKeyLabel')}
                  margin="normal"
                  {...register('pipefyApiKey')}
                  helperText={t('settingsPage.crm.pipefy.apiKeyHelper')}
                  disabled={isGuestMode}
                />
              </Grid>
            </Grid>
            <Box mt={2}>
              <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>{t('settingsPage.crm.pipefy.mappingTitle')}</Typography>
              <Alert severity="info" sx={{ mb: 2 ,background: theme.palette.custom.glass.dark}}>
                {t('settingsPage.crm.pipefy.mappingAlert')}
              </Alert>
              {fields.map((item, index) => (
                <Grid container spacing={1} key={item.id} sx={{ mb: 1, alignItems: 'center' }}>
                  <Grid item xs={12} sm={5}>
                    <Controller
                      name={`pipefyFieldMappings.${index}.qualifaiField`}
                      control={control}
                      defaultValue={item.qualifaiField}
                      render={({ field }) => (
                        <TextField {...field} select fullWidth label={t('settingsPage.crm.pipefy.qualifaiFieldLabel')} size="small" disabled={isGuestMode}>
                          {qualifaiLeadFields.map(option => (
                            <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={5}>
                    <TextField
                      {...register(`pipefyFieldMappings.${index}.pipefyFieldId`)}
                      fullWidth
                      label={t('settingsPage.crm.pipefy.pipefyFieldLabel')}
                      size="small"
                      placeholder={t('settingsPage.crm.pipefy.pipefyFieldPlaceholder')}
                      disabled={isGuestMode}
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <ShowcaseBlocker inline>
                      <IconButton onClick={() => remove(index)} color="error" aria-label={t('settingsPage.crm.pipefy.removeMappingLabel')}>
                        <DeleteIcon />
                      </IconButton>
                    </ShowcaseBlocker>
                  </Grid>
                </Grid>
              ))}
              <ShowcaseBlocker>
                <Button size="small" onClick={() => append({ qualifaiField: '', pipefyFieldId: '' })} sx={{ mt: 1 }}>
                  {t('settingsPage.crm.pipefy.addMappingButton')}
                </Button>
              </ShowcaseBlocker>
            </Box>
          </Box>
        </Collapse>
      </Box>
      <Divider sx={{ my: 3 }} />
    </>
  );
}