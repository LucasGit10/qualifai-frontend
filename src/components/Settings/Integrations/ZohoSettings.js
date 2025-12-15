import React from 'react';
import { Box, Typography, TextField, Switch, FormControlLabel, Collapse, Divider } from '@mui/material';
import { Controller } from 'react-hook-form';
import { useShowcaseContext } from '../../../contexts/ShowcaseContext';
import ShowcaseBlocker from '../../Showcase/ShowcaseBlocker';
import { useTranslation } from 'react-i18next'; // 1. Importar

export default function ZohoSettings({ control, register, watch }) {
  const { t } = useTranslation(); // 2. Inicializar
  const { isGuestMode } = useShowcaseContext();
  const watchZoho = watch("zohoEnabled");

  return (
    <>
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>{t('settingsPage.crm.zoho.title')}</Typography>
        <ShowcaseBlocker inline>
          <Controller
            name="zohoEnabled"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={<Switch {...field} checked={!!field.value} color="switch"/>}
                label={t('settingsPage.crm.zoho.enableLabel')}
              />
            )}
          />
        </ShowcaseBlocker>
        <Collapse in={watchZoho}>
          <>
            <TextField 
              fullWidth 
              label={t('settingsPage.crm.zoho.apiDomainLabel')} 
              margin="normal" 
              {...register('zohoApiDomain')} 
              helperText={t('settingsPage.crm.zoho.apiDomainHelper')} 
              disabled={isGuestMode} 
            />
            <TextField 
              fullWidth 
              label={t('settingsPage.crm.zoho.clientIdLabel')} 
              margin="normal" 
              {...register('zohoClientId')} 
              helperText={t('settingsPage.crm.zoho.clientIdHelper')} 
              disabled={isGuestMode} 
            />
            <TextField 
              fullWidth 
              type="password" 
              label={t('settingsPage.crm.zoho.clientSecretLabel')} 
              margin="normal" 
              {...register('zohoClientSecret')} 
              disabled={isGuestMode} 
            />
            <TextField 
              fullWidth 
              type="password" 
              label={t('settingsPage.crm.zoho.refreshTokenLabel')} 
              margin="normal" 
              {...register('zohoRefreshToken')} 
              disabled={isGuestMode} 
            />
          </>
        </Collapse>
      </Box>
      <Divider sx={{ my: 3 }} />
    </>
  );
}