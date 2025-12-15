import React from 'react';
import { Box, Typography, TextField, Switch, FormControlLabel, Alert, Collapse, Divider, useTheme, Button, CircularProgress, alpha } from '@mui/material';
import { Controller } from 'react-hook-form';
import { useShowcaseContext } from '../../../contexts/ShowcaseContext';
import ShowcaseBlocker from '../../Showcase/ShowcaseBlocker';
import { useAuthStore } from '../../../stores/authStore';
import { useMutation, useQueryClient } from 'react-query';
import api from '../../../services/api';
import { toast } from 'react-toastify';
import { useTranslation, Trans } from 'react-i18next';
import LinkIcon from '@mui/icons-material/Link';
import LinkOffIcon from '@mui/icons-material/LinkOff';


export default function KommoSettings({ control, register, watch }) {
  const { isGuestMode } = useShowcaseContext();
  const { user, updateUser } = useAuthStore();
  const { t } = useTranslation();
  const watchKommo = watch("kommoEnabled");
  const theme = useTheme();
  const queryClient = useQueryClient();

  const isConnected = user?.settings?.integrations?.kommo?.refreshToken && user?.settings?.integrations?.kommo?.enabled;

  const { mutate: getAuthUrl, isLoading: isConnecting } = useMutation(
    () => api.get('/integrations/kommo/auth-url'), {
      onSuccess: (response) => {
        if (response.data?.url) {
          window.location.href = response.data.url;
        }
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || t("settingsPage.crm.kommo.toasts.connectError"));
      }
    }
  );

  const { mutate: disconnect, isLoading: isDisconnecting } = useMutation(
    () => api.post('/integrations/kommo/disconnect'), {
      onSuccess: (response) => {
        toast.success(t("settingsPage.crm.kommo.toasts.disconnectSuccess"));
        updateUser({ settings: { ...user.settings, integrations: response.data.integrations } });
        queryClient.invalidateQueries('user-profile');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || t("settingsPage.crm.kommo.toasts.disconnectError"));
      }
    }
  );

  const handleConnect = () => {
    getAuthUrl();
  };

  return (
    <>
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>Kommo CRM</Typography>
        <ShowcaseBlocker inline>
          <Controller
            name="kommoEnabled"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={<Switch {...field} checked={!!isConnected} readOnly color="switch" />}
                label={isConnected ? t('settingsPage.crm.kommo.connectedStatus') : t('settingsPage.crm.kommo.enableLabel')}
              />
            )}
          />
        </ShowcaseBlocker>
        <Collapse in={watchKommo}>
          <Box>
            <Alert severity="info" sx={{ my: 1, background: theme.palette.custom.glass.dark }}>
              {t('settingsPage.crm.kommo.alert')}
            </Alert>

            <Box sx={{ mt: 2 }}>
              {isConnected ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, border: '1px solid', borderColor: 'success.main', borderRadius: 2, bgcolor: alpha(theme.palette.success.main, 0.1) }}>
                  <LinkIcon color="success" />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>{t('settingsPage.crm.connectedSuccess')}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      <Trans
                        i18nKey="settingsPage.crm.kommo.connectedInfo"
                        values={{ subdomain: user?.settings?.integrations?.kommo?.subdomain }}
                        components={[<strong />]}
                      />
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<LinkOffIcon />}
                    onClick={() => disconnect()}
                    disabled={isDisconnecting}
                  >
                    {isDisconnecting ? t('settingsPage.crm.disconnectingButton') : t('settingsPage.crm.disconnectButton')}
                  </Button>
                </Box>
              ) : (
                <Button
                  variant="contained"
                  startIcon={isConnecting ? <CircularProgress size={20} color="inherit" /> : <LinkIcon />}
                  onClick={handleConnect}
                  disabled={isConnecting || isGuestMode}
                >
                  {isConnecting ? t('settingsPage.crm.connectingButton') : t('settingsPage.crm.kommo.connectButton')}
                </Button>
              )}
            </Box>
          </Box>
        </Collapse>
      </Box>
      <Divider sx={{ my: 3 }} />
    </>
  );
}