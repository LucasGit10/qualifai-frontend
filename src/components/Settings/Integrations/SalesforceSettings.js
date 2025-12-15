import React from 'react';
import { Box, Typography, TextField, Switch, FormControlLabel, Collapse, Divider } from '@mui/material';
import { Controller } from 'react-hook-form';
import { useShowcaseContext } from '../../../contexts/ShowcaseContext';
import ShowcaseBlocker from '../../Showcase/ShowcaseBlocker';
import { useTranslation } from 'react-i18next'; // 1. Importar

export default function SalesforceSettings({ control, register, watch }) {
  const { t } = useTranslation(); // 2. Inicializar
  const { isGuestMode } = useShowcaseContext();
  const watchSalesforce = watch("salesforceEnabled");

  return (
    <>
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          {t('settingsPage.crm.salesforce.title')} {t('settingsPage.inDevelopment')}
        </Typography>
        <ShowcaseBlocker inline>
          <Controller
            name="salesforceEnabled"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={<Switch {...field} checked={!!field.value} color="switch"/>}
                label={t('settingsPage.crm.salesforce.enableLabel')}
              />
            )}
          />
        </ShowcaseBlocker>
        <Collapse in={watchSalesforce}>
          <>
            <TextField 
              fullWidth 
              label={t('settingsPage.crm.salesforce.instanceUrlLabel')} 
              margin="normal" 
              {...register('salesforceInstanceUrl')} 
              helperText={t('settingsPage.crm.salesforce.instanceUrlHelper')} 
              disabled={isGuestMode} 
            />
            <TextField 
              fullWidth 
              label={t('settingsPage.crm.salesforce.clientIdLabel')} 
              margin="normal" 
              {...register('salesforceClientId')} 
              helperText={t('settingsPage.crm.salesforce.clientIdHelper')} 
              disabled={isGuestMode} 
            />
            <TextField 
              fullWidth 
              type="password" 
              label={t('settingsPage.crm.salesforce.clientSecretLabel')} 
              margin="normal" 
              {...register('salesforceClientSecret')} 
              disabled={isGuestMode} 
            />
            <TextField 
              fullWidth 
              type="password" 
              label={t('settingsPage.crm.salesforce.refreshTokenLabel')} 
              margin="normal" 
              {...register('salesforceRefreshToken')} 
              disabled={isGuestMode} 
            />
          </>
        </Collapse>
      </Box>
      <Divider sx={{ my: 3 }} />
    </>
  );
}