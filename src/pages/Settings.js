import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Box, Typography, Paper, Tabs, Tab, useTheme, Grid, Fade, Slide, alpha } from '@mui/material';
import { useQueryClient } from 'react-query';
import { Tune as TuneIcon, SyncAlt as SyncAltIcon, SmartToy as SmartToyIcon, WhatsApp as WhatsAppIcon, Assessment as AssessmentIcon, Label as LabelIcon } from '@mui/icons-material';

import AiSettings from '../components/Settings/AiSettings';
import IntegrationsSettings from '../components/Settings/IntegrationsSettings';
import WhatsApp from './WhatsApp';
import PerformanceReportSettings from '../components/Settings/PerformanceReportSettings';
import DebtorStatusesSettings from '../components/Settings/DebtorStatusesSettings';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: { xs: 2, sm: 3 } }}>{children}</Box>}
    </div>
  );
}

export default function Settings() {
  const [tabValue, setTabValue] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();

  // ... (seu useEffect para notificações de auth continua o mesmo)
  useEffect(() => {

    const status = searchParams.get('google_auth');
    if (status) {
        if (status === 'success') {
            toast.success('Conta Google conectada com sucesso!');
        } else if (status === 'error') {
            const message = searchParams.get('message') || 'Ocorreu um erro ao conectar com o Google.';
            toast.error(decodeURIComponent(message));
        }
        // Clean up URL
        searchParams.delete('google_auth');
        searchParams.delete('message');
        setSearchParams(searchParams, { replace: true });
    }
    
    const kommoStatus = searchParams.get('kommo_auth');
    if (kommoStatus) {
        if (kommoStatus === 'success') {
            toast.success('Kommo CRM conectado com sucesso!');
            queryClient.invalidateQueries('user-profile');
        } else if (kommoStatus === 'error') {
            const message = searchParams.get('message') || 'Ocorreu um erro ao conectar com o Kommo.';
            toast.error(decodeURIComponent(message));
        }
        searchParams.delete('kommo_auth');
        searchParams.delete('message');
        setSearchParams(searchParams, { replace: true });
    }

    const pipedriveStatus = searchParams.get('pipedrive_auth');
    if (pipedriveStatus) {
        if (pipedriveStatus === 'success') {
            toast.success('Pipedrive conectado com sucesso!');
            queryClient.invalidateQueries('user-profile');
        } else if (pipedriveStatus === 'error') {
            const message = searchParams.get('message') || 'Ocorreu um erro ao conectar com o Pipedrive.';
            toast.error(decodeURIComponent(message));
        }
        searchParams.delete('pipedrive_auth');
        searchParams.delete('message');
        setSearchParams(searchParams, { replace: true });
    }

    const hubspotStatus = searchParams.get('hubspot_auth');
    if (hubspotStatus) {
        if (hubspotStatus === 'success') {
            toast.success('HubSpot conectado com sucesso!');
            queryClient.invalidateQueries('user-profile');
        } else if (hubspotStatus === 'error') {
            const message = searchParams.get('message') || 'Ocorreu um erro ao conectar com o HubSpot.';
            toast.error(decodeURIComponent(message));
        }
        searchParams.delete('hubspot_auth');
        searchParams.delete('message');
        setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams, queryClient]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const TABS = [
    { label: "IA", icon: <SmartToyIcon /> },
    { label: "Integrações", icon: <SyncAltIcon /> },
    { label: "WhatsApp", icon: <WhatsAppIcon /> },
    { label: "Relatórios", icon: <AssessmentIcon /> },
    { label: "Status de Devedores", icon: <LabelIcon /> }
  ];

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Fade in timeout={500}>
        <Paper sx={{ p: 2, mb: 3, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2, backgroundColor: 'rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
          <TuneIcon sx={{ fontSize: 40 }} />
          <Typography variant="h4" fontWeight="bold">Configurações</Typography>
        </Paper>
      </Fade>

      <Slide direction="up" in timeout={500}>
        <Paper sx={{
          borderRadius: 3,
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          minHeight: 'calc(100vh - 200px)'
        }}>
          <Grid container>
            <Grid item xs={12} md={3}>
              <Tabs
                orientation="vertical"
                variant="scrollable"
                value={tabValue}
                onChange={handleTabChange}
                sx={{
                  borderRight: 1,
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  p: 1,
                  '& .MuiTabs-indicator': {
                    backgroundColor: 'primary.main',
                    left: 0,
                    width: '3px',
                    borderRadius: '3px',
                  },
                  '& .MuiTab-root': {
                    justifyContent: 'flex-start',
                    textTransform: 'none',
                    fontSize: '1rem',
                    borderRadius: 2,
                    margin: '4px',
                    opacity: 0.7,
                  },
                  '& .MuiTab-root.Mui-selected': {
                    backgroundColor: alpha('#FFF', 0.1),
                    color: 'primary.light',
                    opacity: 1,
                  },
                }}
              >
                {TABS.map((tab, index) => (
                  <Tab key={index} icon={tab.icon} iconPosition="start" label={tab.label} />
                ))}
              </Tabs>
            </Grid>
            <Grid item xs={12} md={9}>
              <Fade in timeout={300} key={tabValue}>
                <div>
                  <TabPanel value={tabValue} index={0}><AiSettings /></TabPanel>
                  <TabPanel value={tabValue} index={1}><IntegrationsSettings onTabChange={setTabValue} /></TabPanel>
                  <TabPanel value={tabValue} index={2}><WhatsApp /></TabPanel>
                  <TabPanel value={tabValue} index={3}><PerformanceReportSettings /></TabPanel>
                  <TabPanel value={tabValue} index={4}><DebtorStatusesSettings /></TabPanel>
                </div>
              </Fade>
            </Grid>
          </Grid>
        </Paper>
      </Slide>
    </Box>
  );
}