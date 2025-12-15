import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  FormControlLabel,
  Switch,
  Collapse,
  Chip,
  Stack,
  Divider
} from '@mui/material';
import { CheckCircle, Link as LinkIcon, LinkOff as LinkOffIcon } from '@mui/icons-material';
import { Controller } from 'react-hook-form';
import api from '../../../services/api';
import { useTranslation } from 'react-i18next';

function HubspotSettings({ control, user, updateUser, watch }) {
  const queryClient = useQueryClient();
  const isConnected = user?.settings?.integrations?.hubspot?.connected || false;
  const { t } = useTranslation();

  const getAuthUrlMutation = useMutation(() => api.get('/integrations/hubspot/auth-url'),
    {
      onSuccess: (response) => {
        window.location.href = response.data.authUrl;
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || t('settingsPage.crm.hubspot.toasts.connectError'));
      }
    }
  );

  const disconnectMutation = useMutation(
    () => api.delete('/integrations/hubspot'),
    {
      onSuccess: () => {
        toast.success(t('settingsPage.crm.hubspot.toasts.disconnectSuccess'));
        queryClient.invalidateQueries('user-profile');
        const updatedUser = { ...user };
        if (updatedUser.settings?.integrations?.hubspot) {
          updatedUser.settings.integrations.hubspot.connected = false;
        }
        updateUser(updatedUser);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || t('settingsPage.crm.hubspot.toasts.disconnectError'));
      }
    }
  );

  return (
    <>
      <Box>
        <Controller
          name="hubspotEnabled"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={<Switch {...field} checked={field.value} color="switch" />}
              label={
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="subtitle1" fontWeight="bold">{t('settingsPage.crm.hubspot.title')}</Typography>
                  {isConnected && <Chip icon={<CheckCircle />} label={t('settingsPage.crm.hubspot.connectedStatus')} color="success" size="small" />}
                </Stack>
              }
            />
          )}
        />
        <Collapse in={watch('hubspotEnabled')}>
          <Box sx={{ pl: 4, pt: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {t('settingsPage.crm.hubspot.description')}
            </Typography>
            {isConnected ? (
              <Button variant="outlined" color="error" startIcon={disconnectMutation.isLoading ? <CircularProgress size={20} /> : <LinkOffIcon />} onClick={() => disconnectMutation.mutate()} disabled={disconnectMutation.isLoading}>
                {t('settingsPage.crm.hubspot.disconnectButton')}
              </Button>
            ) : (
              <Button variant="contained" startIcon={getAuthUrlMutation.isLoading ? <CircularProgress size={20} /> : <LinkIcon />} onClick={() => getAuthUrlMutation.mutate()} disabled={getAuthUrlMutation.isLoading}>
                {t('settingsPage.crm.hubspot.connectButton')}
              </Button>
            )}
          </Box>
        </Collapse>
      </Box>
      <Divider sx={{ my: 3 }} />
    </>

  );
};

export default HubspotSettings;
