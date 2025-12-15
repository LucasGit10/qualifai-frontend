import React, { useEffect, useState } from 'react';
import { useMutation, useQueryClient, useQuery } from 'react-query';
import {
  Box, Button, Chip, CircularProgress, FormControl, InputLabel, MenuItem, Select, Typography, Collapse, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Divider
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import QRCode from "react-qr-code";

import api from '../../services/api';
import { useAuthStore } from '../../stores/authStore';
import ShowcaseBlocker from '../Showcase/ShowcaseBlocker';

// Importar TODAS as integrações
import KommoSettings from './Integrations/KommoSettings';
import PipedriveSettings from './Integrations/PipedriveSettings';
import HubspotSettings from './Integrations/HubspotSettings';
import SalesforceSettings from './Integrations/SalesforceSettings';
import RdStationSettings from './Integrations/RdStationSettings';
import PipefySettings from './Integrations/PipefySettings';
import ZohoSettings from './Integrations/ZohoSettings';
import SmtpSettings from './Integrations/SmtpSettings';
import GoogleSettings from './Integrations/GoogleSettings';
import { CheckCircle, ErrorOutline, HelpOutline, Hub } from '@mui/icons-material';

export default function IntegrationsSettings({ onTabChange }) {
  const { user, updateUser } = useAuthStore();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [qrCode, setQrCode] = useState('');
  const [isQrCodeModalOpen, setIsQrCodeModalOpen] = useState(false);

  // Busca o provedor de WhatsApp do usuário na API
  const { data: fetchedWhatsAppProvider } = useQuery(
    'whatsappProvider',
    () => api.get('/whatsapp-ai/whatsapp-provider').then(res => res.data.provider),
    {
      staleTime: Infinity,
    }
  );

  const { data: zapiStatus, refetch: refetchZapiStatus, isLoading: isStatusLoading } = useQuery(
    'zapiStatus',
    () => api.get('/zapi/status').then(res => res.data.status),
    { 
      enabled: user?.settings?.integrations?.whatsappProvider === 'zapi' && !!user?.settings?.integrations?.zapi?.instanceId,
      refetchOnWindowFocus: false,
    }
  );

  const { control, register, handleSubmit, watch, reset, formState: { errors } } = useForm({
    defaultValues: {}
  });

  useEffect(() => {
    if (user?.settings?.integrations) {
        reset({
            // WhatsApp Provider
            whatsappProvider: fetchedWhatsAppProvider || user.settings.integrations.whatsappProvider || 'whatsapp',
            zapiEnabled: user.settings.integrations.zapi?.enabled || false,
            zapiInstanceId: user.settings.integrations.zapi?.instanceId || '',
            zapiToken: user.settings.integrations.zapi?.token || '',
            
            // CRM Integrations
            hubspotEnabled: user.settings.integrations.hubspot?.enabled || false,
            // Adicionado campo hubspotApiKey no reset, assumindo que o hook-form precisa dele para o payload completo do HEAD.
            hubspotApiKey: user.settings.integrations.hubspot?.apiKey || '', 

            pipedriveEnabled: user.settings.integrations.pipedrive?.enabled || false,

            salesforceEnabled: user.settings.integrations.salesforce?.enabled || false,
            salesforceInstanceUrl: user.settings.integrations.salesforce?.instanceUrl || '',
            salesforceClientId: user.settings.integrations.salesforce?.clientId || '',
            salesforceClientSecret: user.settings.integrations.salesforce?.clientSecret || '',
            salesforceRefreshToken: user.settings.integrations.salesforce?.refreshToken || '',
            
            rdstationEnabled: user.settings.integrations.rdstation?.enabled || false,
            rdstationPrivateToken: user.settings.integrations.rdstation?.privateToken || '',

            pipefyEnabled: user.settings.integrations.pipefy?.enabled || false,
            pipefyApiKey: user.settings.integrations.pipefy?.apiKey || '',
            pipefyPipelineId: user.settings.integrations.pipefy?.pipelineId || '',
            pipefyFieldMappings: user.settings.integrations.pipefy?.fieldMappings || [],

            kommoEnabled: user.settings.integrations.kommo?.enabled || false,
            kommoSubdomain: user.settings.integrations.kommo?.subdomain || '',
            kommoClientId: user.settings.integrations.kommo?.clientId || '',
            kommoClientSecret: user.settings.integrations.kommo?.clientSecret || '',
            kommoAuthorizationCode: '',

            zohoEnabled: user.settings.integrations.zoho?.enabled || false,
            zohoApiDomain: user.settings.integrations.zoho?.apiDomain || '',
            zohoClientId: user.settings.integrations.zoho?.clientId || '',
            zohoClientSecret: user.settings.integrations.zoho?.clientSecret || '',
            zohoRefreshToken: user.settings.integrations.zoho?.refreshToken || '',

            // Email & Other Integrations
            smtpEnabled: user.settings.integrations.smtp?.enabled || false,
            smtpProvider: user.settings.integrations.smtp?.provider || 'gmail',
            smtpHost: user.settings.integrations.smtp?.host || '',
            smtpPort: user.settings.integrations.smtp?.port || 587,
            smtpSecure: user.settings.integrations.smtp?.secure || false,
            smtpUser: user.settings.integrations.smtp?.auth?.user || '',
            smtpPass: user.settings.integrations.smtp?.auth?.pass || '',
        });
    }
  }, [user, reset, fetchedWhatsAppProvider]);
  
  const watchWhatsappProvider = watch("whatsappProvider");
  
  useEffect(() => {
    if (watchWhatsappProvider === 'zapi') {
      refetchZapiStatus();
    }
  }, [watchWhatsappProvider, refetchZapiStatus]);

  const updateIntegrationsMutation = useMutation(
    (data) => api.put('/integrations/settings', data),
    {
      onSuccess: (response) => {
        toast.success('Configurações salvas com sucesso!');
        updateUser({ settings: { ...user.settings, integrations: response.data.integrations } });
        queryClient.invalidateQueries('user-profile');
        queryClient.invalidateQueries('whatsappProvider');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Erro ao salvar as configurações');
      }
    }
  );

  const connectZapiMutation = useMutation(
    () => api.post('/zapi/connect'),
    {
      onSuccess: (response) => {
        setQrCode(response.data.qrCodeBase64);
        setIsQrCodeModalOpen(true);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Erro ao gerar QR Code.');
      }
    }
  );
  
  const disconnectZapiMutation = useMutation(
    () => api.post('/zapi/disconnect'),
    {
      onSuccess: () => {
        toast.success('Instância Z-API desconectada.');
        refetchZapiStatus();
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Erro ao desconectar.');
      }
    }
  );

  const onSubmitIntegrations = (data) => {
    const integrationsPayload = {
      whatsappProvider: data.whatsappProvider,
      zapi: {
        enabled: data.whatsappProvider === 'zapi',
        instanceId: data.zapiInstanceId,
        token: data.zapiToken,
      },
      whatsapp: {
        ...user.settings.integrations.whatsapp,
        enabled: data.whatsappProvider === 'whatsapp'
      },
// <<<<<<< HEAD: Definição do payload do HubSpot com apiKey (versão mais completa)
      hubspot: { 
        apiKey: data.hubspotApiKey, 
        enabled: data.hubspotEnabled 
      },
// =======
/*
      hubspot: { ...user.settings.integrations.hubspot, enabled: data.hubspotEnabled },
*/
// >>>>>>> 3ea1802 (created Hubspot integration in IntegrationsSettings)
      pipedrive: {
        ...user.settings.integrations.pipedrive,
        enabled: data.pipedriveEnabled
      },
      salesforce: {
        instanceUrl: data.salesforceInstanceUrl,
        clientId: data.salesforceClientId,
        clientSecret: data.salesforceClientSecret,
        refreshToken: data.salesforceRefreshToken,
        enabled: data.salesforceEnabled
      },
      rdstation: { 
        privateToken: data.rdstationPrivateToken, 
        enabled: data.rdstationEnabled 
      },
      pipefy: {
        apiKey: data.pipefyApiKey,
        pipelineId: data.pipefyPipelineId,
        enabled: data.pipefyEnabled,
        fieldMappings: data.pipefyFieldMappings?.filter(m => m.qualifaiField && m.pipefyFieldId) || []
      },
      zoho: {
        apiDomain: data.zohoApiDomain,
        clientId: data.zohoClientId,
        clientSecret: data.zohoClientSecret,
        refreshToken: data.zohoRefreshToken,
        enabled: data.zohoEnabled
      },
      kommo: {
        refreshToken: user.settings?.integrations?.kommo?.refreshToken,
        enabled: data.kommoEnabled,
        subdomain: data.kommoSubdomain,
        clientId: data.kommoClientId,
        clientSecret: data.kommoClientSecret,
        ...(data.kommoAuthorizationCode && { authorizationCode: data.kommoAuthorizationCode }),
      },
      google: {
        ...user.settings.integrations.google,
      },
      smtp: {
        enabled: data.smtpEnabled,
        provider: data.smtpProvider,
        host: data.smtpHost,
        port: Number(data.smtpPort),
        secure: data.smtpSecure,
        auth: { user: data.smtpUser, pass: data.smtpPass }
      },
    };

    if (integrationsPayload.kommo.authorizationCode) {
        delete integrationsPayload.kommo.refreshToken;
    }

    updateIntegrationsMutation.mutate({ integrations: integrationsPayload });
  };

  const commonProps = { control, register, watch, user, errors };
  
  const getStatusChip = () => {
    if (isStatusLoading) return <Chip icon={<CircularProgress size={16} />} label="Verificando..." size="small" />;
    if (zapiStatus?.connected) return <Chip icon={<CheckCircle />} label="Conectado" color="success" size="small" />;
    if (zapiStatus) return <Chip icon={<ErrorOutline />} label="Desconectado" color="error" size="small" />;
    return <Chip icon={<HelpOutline />} label="Não verificado" size="small" />;
  };

  return (
    <>
      <Box component="form" onSubmit={handleSubmit(onSubmitIntegrations)} sx={{ mt: 2 }}>
        
        {/* WhatsApp Provider Section */}
        <Typography variant="subtitle1" gutterBottom>Provedor de WhatsApp</Typography>
        <Controller
          name="whatsappProvider"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Selecione o Provedor</InputLabel>
              <Select {...field} label="Selecione o Provedor">
                <MenuItem value="whatsapp">WhatsApp Oficial (Meta)</MenuItem>
                <MenuItem value="zapi">Z-API (Não Oficial)</MenuItem>
              </Select>
            </FormControl>
          )}
        />
        
        <Collapse in={watchWhatsappProvider === 'whatsapp'}>
          <Button 
            variant="outlined" 
            onClick={() => onTabChange(2)} 
            color='secondary'
          >
            Gerenciar Conexão Oficial do WhatsApp
          </Button>
        </Collapse>
        
        <Collapse in={watchWhatsappProvider === 'zapi'}>
          <TextField fullWidth label="Z-API Instance ID" margin="normal" {...register('zapiInstanceId')} required />
          <TextField fullWidth label="Z-API Token" type="password" margin="normal" {...register('zapiToken')} required />
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 2 }}>
            <Button variant="contained" onClick={() => connectZapiMutation.mutate()} disabled={connectZapiMutation.isLoading}>
              {connectZapiMutation.isLoading ? <CircularProgress size={24} /> : 'Conectar / Obter QR Code'}
            </Button>
            <Button variant="outlined" onClick={() => refetchZapiStatus()} disabled={isStatusLoading} color='secondary'>Verificar Status</Button>
            <Button variant="outlined" color="error" onClick={() => disconnectZapiMutation.mutate()} disabled={disconnectZapiMutation.isLoading}>Desconectar</Button>
            {getStatusChip()}
          </Box>
        </Collapse>
{/* <<<<<<< HEAD: Apenas o Bloco do WhatsApp, o resto do HTML está no final do arquivo
>>>>>>> 3ea1802 (created Hubspot integration in IntegrationsSettings): Todo o corpo de Integrações CRM
      <Divider sx={{ my: 4 }} />
      <GoogleSettings />
      <SmtpSettings {...commonProps} />
      <Divider sx={{ my: 4 }} />
      <KommoSettings {...commonProps} />
      <PipedriveSettings {...commonProps} />
      <HubspotSettings {...commonProps} />
      {/*<RdStationSettings {...commonProps} />*/}
      {/*<PipefySettings {...commonProps} />*/}
      <ZohoSettings {...commonProps} />
      
      <ShowcaseBlocker>
        <Button
          type="submit"
          variant="contained"
          sx={{ mt: 4 }}
          disabled={updateIntegrationsMutation.isLoading}
        >
          {updateIntegrationsMutation.isLoading ? <CircularProgress size={24} /> : 'Salvar Integrações'}
        </Button>
</ShowcaseBlocker>
  
  <Divider sx={{ my: 4 }} />

        {/* Google Integration */}
        <GoogleSettings />

        {/* Email SMTP Integration */}
        <SmtpSettings {...commonProps} />

        <Divider sx={{ my: 4 }} />

        {/* TODAS as Integrações CRM */}
        <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2 }}>
          Integrações CRM
        </Typography>

        {/* Kommo CRM */}
        <KommoSettings {...commonProps} />

        {/* Pipedrive CRM */}
        <PipedriveSettings {...commonProps} />

        {/* Hubspot CRM */}
        <HubspotSettings {...commonProps} />

        {/* Salesforce CRM */}
        <SalesforceSettings {...commonProps} />

        {/* RD Station CRM */}
        <RdStationSettings {...commonProps} />

        {/* Pipefy CRM */}
        <PipefySettings {...commonProps} />

        {/* Zoho CRM */}
        <ZohoSettings {...commonProps} />

        <ShowcaseBlocker>
          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 4 }}
            disabled={updateIntegrationsMutation.isLoading}
          >
            {updateIntegrationsMutation.isLoading ? <CircularProgress size={24} /> : 'Salvar Integrações'}
          </Button>
        </ShowcaseBlocker>
      </Box>

      {/* QR Code Modal */}
      <Dialog open={isQrCodeModalOpen} onClose={() => setIsQrCodeModalOpen(false)}>
        <DialogTitle>Escaneie o QR Code</DialogTitle>
        <DialogContent sx={{ textAlign: 'center' }}>
          <Typography sx={{mb: 2}}>Abra seu WhatsApp e escaneie o código para conectar.</Typography>
          {qrCode ? (
            <Box sx={{ background: 'white', padding: '16px', display: 'inline-block' }}>
              <QRCode value={qrCode} size={256} />
            </Box>
          ) : <CircularProgress />}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setIsQrCodeModalOpen(false); refetchZapiStatus(); }}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}