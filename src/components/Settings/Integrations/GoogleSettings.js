import React, { useState } from 'react';
import { Box, Typography, Button, Divider, CircularProgress } from '@mui/material';
import { Google as GoogleIcon, Link as LinkIcon, LinkOff as LinkOffIcon } from '@mui/icons-material';
import { useAuthStore } from '../../../stores/authStore';
import { useMutation, useQueryClient } from 'react-query';
import api from '../../../services/api';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next'; // 1. Importar
import ShowcaseBlocker from '../../Showcase/ShowcaseBlocker';

export default function GoogleSettings() {
    const { t } = useTranslation(); // 2. Inicializar o hook
    const { user, updateUser } = useAuthStore();
    const queryClient = useQueryClient();
    const [isConnecting, setIsConnecting] = useState(false);

    const isConnected = user?.settings?.integrations?.google?.enabled;
    const connectedEmail = user?.settings?.integrations?.google?.userEmail;

    const handleConnect = async () => {
        setIsConnecting(true);
        try {
            const response = await api.get('/integrations/google/auth-url');
            if (response.data?.url) {
                window.location.href = response.data.url;
            } else {
                // 3. Usar tradução para os toasts
                toast.error(t('settingsPage.google.toasts.authUrlError'));
                setIsConnecting(false);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || t('settingsPage.google.toasts.connectError'));
            setIsConnecting(false);
        }
    };
    
    const disconnectMutation = useMutation(
        () => api.post('/integrations/google/disconnect'),
        {
            onSuccess: (response) => {
                toast.success(t('settingsPage.google.toasts.disconnectSuccess'));
                updateUser(response.data.user);
                queryClient.invalidateQueries('user-profile');
            },
            onError: (error) => {
                toast.error(error.response?.data?.message || t('settingsPage.google.toasts.disconnectError'));
            }
        }
    );

    const handleDisconnect = () => {
        disconnectMutation.mutate();
    };

    return (
        <>
            <Box sx={{ mb: 3 }}>
                {/* 3. Usar tradução para os textos */}
                <Typography variant="subtitle1" gutterBottom>{t('settingsPage.google.title')}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {t('settingsPage.google.description')}
                </Typography>

                {isConnected ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                        <GoogleIcon color="success" />
                        <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>{t('settingsPage.google.connectedStatus')}</Typography>
                            <Typography variant="body2" color="text.secondary">
                                {t('settingsPage.google.connectedInfo')} <strong>{connectedEmail}</strong>
                            </Typography>
                        </Box>
                        <ShowcaseBlocker inline>
                            <Button
                                variant="outlined"
                                color="error"
                                startIcon={<LinkOffIcon />}
                                onClick={handleDisconnect}
                                disabled={disconnectMutation.isLoading}
                            >
                                {disconnectMutation.isLoading ? t('settingsPage.google.buttons.disconnecting') : t('settingsPage.google.buttons.disconnect')}
                            </Button>
                        </ShowcaseBlocker>
                    </Box>
                ) : (
                    <ShowcaseBlocker inline>
                        <Button
                            variant="contained"
                            startIcon={isConnecting ? <CircularProgress size={20} color="inherit" /> : <LinkIcon />}
                            onClick={handleConnect}
                            disabled={isConnecting}
                        >
                            {isConnecting ? t('settingsPage.google.buttons.connecting') : t('settingsPage.google.buttons.connect')}
                        </Button>
                    </ShowcaseBlocker>
                )}
            </Box>
            <Divider sx={{ my: 3 }} />
        </>
    );
}