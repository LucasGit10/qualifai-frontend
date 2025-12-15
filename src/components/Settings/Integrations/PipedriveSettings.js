import React from 'react';
import { Box, Typography, Button, Switch, FormControlLabel, CircularProgress, Divider, alpha, useTheme } from '@mui/material';
import { Controller } from 'react-hook-form';
import { useShowcaseContext } from '../../../contexts/ShowcaseContext';
import ShowcaseBlocker from '../../Showcase/ShowcaseBlocker';
import { useAuthStore } from '../../../stores/authStore';
import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import api from '../../../services/api';
import { Link as LinkIcon, LinkOff as LinkOffIcon } from '@mui/icons-material';
import { useTranslation, Trans } from 'react-i18next';

export default function PipedriveSettings({ control, watch }) {
  const { t } = useTranslation();
  const { isGuestMode } = useShowcaseContext();
  const { user, updateUser } = useAuthStore();
  const queryClient = useQueryClient();
  const theme = useTheme();

  const isConnected = user?.settings?.integrations?.pipedrive?.refreshToken && user?.settings?.integrations?.pipedrive?.enabled;
  const connectedDomain = user?.settings?.integrations?.pipedrive?.apiDomain;

  const { mutate: getAuthUrl, isLoading: isConnecting } = useMutation(
    () => api.get('/integrations/pipedrive/auth-url'), {
      onSuccess: (response) => {
        if (response.data?.url) {
          window.location.href = response.data.url;
        }
      },
      onError: (error) => toast.error(error.response?.data?.message || t("settingsPage.crm.pipedrive.toasts.connectError"))
    }
  );

  const { mutate: disconnect, isLoading: isDisconnecting } = useMutation(
    () => api.post('/integrations/pipedrive/disconnect'), {
      onSuccess: (response) => {
        toast.success(t("settingsPage.crm.pipedrive.toasts.disconnectSuccess"));
        updateUser({ settings: { ...user.settings, integrations: response.data.integrations } });
        queryClient.invalidateQueries('user-profile');
      },
      onError: (error) => toast.error(error.response?.data?.message || t("settingsPage.crm.pipedrive.toasts.disconnectError"))
    }
  );

  return (
    <>
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>{t('settingsPage.crm.pipedrive.title')}</Typography>
        <Controller
            name="pipedriveEnabled"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={<Switch {...field} checked={!!isConnected} readOnly color="switch"/>}
                // ===== MUDANÇA PRINCIPAL AQUI =====
                label={isConnected ? t('settingsPage.crm.pipedrive.connectedStatus') : t('settingsPage.crm.pipedrive.enableLabel')}
              />
            )}
        />
        
        <Box sx={{ mt: 2 }}>
            {isConnected ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, border: '1px solid', borderColor: 'success.main', borderRadius: 2, bgcolor: alpha(theme.palette.success.main, 0.1) }}>
                    <LinkIcon color="success" />
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>{t('settingsPage.crm.connectedSuccess')}</Typography>
                        <Typography variant="body2" color="text.secondary">
                            <Trans
                                i18nKey="settingsPage.crm.pipedrive.connectedInfo"
                                values={{ domain: connectedDomain }}
                                components={[<strong />]}
                            />
                        </Typography>
                    </Box>
                    <ShowcaseBlocker inline>
                        <Button
                            variant="outlined"
                            color="error"
                            startIcon={<LinkOffIcon />}
                            onClick={() => disconnect()}
                            disabled={isDisconnecting}
                        >
                            {isDisconnecting ? t('settingsPage.crm.disconnectingButton') : t('settingsPage.crm.disconnectButton')}
                        </Button>
                    </ShowcaseBlocker>
                </Box>
            ) : (
                <ShowcaseBlocker inline>
                    <Button
                        variant="contained"
                        startIcon={isConnecting ? <CircularProgress size={20} color="inherit" /> : <LinkIcon />}
                        onClick={() => getAuthUrl()}
                        disabled={isConnecting || isGuestMode}
                    >
                        {isConnecting ? t('settingsPage.crm.connectingButton') : t('settingsPage.crm.pipedrive.connectButton')}
                    </Button>
                </ShowcaseBlocker>
            )}
        </Box>
      </Box>
      <Divider sx={{ my: 3 }} />
    </>
  );
}