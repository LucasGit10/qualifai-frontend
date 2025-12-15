import React from 'react';
import { Box, Typography, TextField, Switch, FormControlLabel, Collapse, Divider } from '@mui/material';
import { Controller } from 'react-hook-form';
import { useShowcaseContext } from '../../../contexts/ShowcaseContext';
import ShowcaseBlocker from '../../Showcase/ShowcaseBlocker';
import { useTranslation } from 'react-i18next'; // 1. Importar

export default function RdStationSettings({ control, register, watch }) {
  const { t } = useTranslation(); // 2. Inicializar
  const { isGuestMode } = useShowcaseContext();
  const watchRdstation = watch("rdstationEnabled");

  return (
    <>
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          {t('settingsPage.crm.rdstation.title')} {t('settingsPage.inDevelopment')}
        </Typography>
        <ShowcaseBlocker inline>
          <Controller
            name="rdstationEnabled"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={<Switch {...field} checked={!!field.value} color="switch"/>}
                label={t('settingsPage.crm.rdstation.enableLabel')}
              />
            )}
          />
        </ShowcaseBlocker>
        <Collapse in={watchRdstation}>
          <TextField
            fullWidth
            label={t('settingsPage.crm.rdstation.privateTokenLabel')}
            type="password"
            margin="normal"
            {...register('rdstationPrivateToken')}
            helperText={t('settingsPage.crm.rdstation.privateTokenHelper')}
            disabled={isGuestMode}
          />
        </Collapse>
      </Box>
      <Divider sx={{ my: 3 }} />
    </>
  );
}