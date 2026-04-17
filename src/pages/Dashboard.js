import React, { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Grid, Typography, Box, LinearProgress, useTheme, alpha } from '@mui/material';
import { 
  People as PeopleIcon, 
  TrendingUp as TrendingUpIcon, 
  Chat as ChatIcon, 
  CheckCircle as CheckCircleIcon, 
  ReportProblem as ReportProblemIcon, 
  Dashboard as DashboardIcon, 
  AccountBalanceWallet as WalletIcon, 
  Payment as PaymentIcon 
} from '@mui/icons-material';
import { format, subDays, eachDayOfInterval } from 'date-fns';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

// --- ARQUIVOS DE SERVIÇO, ESTADO E CONTEXTO ---
import api from '../services/api';
import { useAuthStore } from '../stores/authStore';
import { useTour } from '../contexts/TourContext'; 
import { USE_MOCKS } from '../config/env';

// --- COMPONENTES DO DASHBOARD ---
import StatCard from '../components/dashboard/StatCard';
import ChartPaper from '../components/dashboard/ChartPaper';
import LineLeadsChart from '../components/dashboard/LineLeadsChart';
import FunnelLeads from '../components/dashboard/FunnelLeadsChart';
import LeadsBySourceChart from '../components/dashboard/LeadsBySourceChart';
import ConversationsByChannelChart from '../components/dashboard/ConversationsByChannelChart';
import RecentActivities from '../components/dashboard/RecentActivities';
import WhatsappStatsBoard from '../components/dashboard/WhatsappStatsBoard';
import CampaignStatsChart from '../components/dashboard/CampaignStatsChart';
import InstagramStatsBoard from '../components/dashboard/InstagramStatsBoard';

// ─── Helpers ──────────────────────────────────────────────────────────
const fmt = (v) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const MOCK_DATA = {
  stats: {
    totalLeads: 1247,
    activeConversations: 28,
    qualifiedLeads: 89,
    escalatedConversations: 12,
    conversionRate: 7.2,
    whatsappApiCost: '124,50',
    financial: {
      totalRecovered: '145.230,50',
      commissions: '14.523,05'
    },
    leadsOverTime: Array.from({ length: 30 }, (_, i) => ({
      _id: format(subDays(new Date(), 29 - i), 'yyyy-MM-dd'),
      count: Math.floor(Math.random() * 50) + 20
    })),
    leadsByStatus: [
      { _id: 'novo', count: 450 },
      { _id: 'contatado', count: 320 },
      { _id: 'em_negociacao', count: 180 },
      { _id: 'acordado', count: 89 },
      { _id: 'quitado', count: 64 },
      { _id: 'judicial', count: 22 },
    ],
    leadsBySource: [
      { _id: 'whatsapp', count: 420 },
      { _id: 'email', count: 380 },
      { _id: 'telefone', count: 210 },
      { _id: 'form', count: 150 },
      { _id: 'outros', count: 87 }
    ],
    conversationsByChannel: [
      { _id: 'whatsapp', count: 680 },
      { _id: 'email', count: 320 },
      { _id: 'telefone', count: 150 },
      { _id: 'chat', count: 97 }
    ]
  },
  activities: {
    activities: [
      { id: 1, type: 'lead', title: 'Novo Devedor Adicionado', description: 'João Silva via Importação CSV', timestamp: new Date().toISOString() },
      { id: 2, type: 'conversation', title: 'Conversa Ativa', description: 'Maria Santos no WhatsApp', timestamp: subDays(new Date(), 1).toISOString() },
      { id: 3, type: 'lead', title: 'Acordo Firmado', description: 'Pedro Oliveira — R$ 4.200,00', timestamp: subDays(new Date(), 2).toISOString() },
      { id: 4, type: 'conversation', title: 'Enviado para Jurídico', description: 'Ana Costa — Contrato #2891', timestamp: subDays(new Date(), 3).toISOString() },
      { id: 5, type: 'lead', title: 'Novo Devedor Adicionado', description: 'Carlos Ribeiro via Form', timestamp: subDays(new Date(), 4).toISOString() }
    ]
  },
  instances: [
    { _id: '1', instanceName: 'WhatsApp Cobrança', messagesSent: 1247, messagesReceived: 980 },
    { _id: '2', instanceName: 'WhatsApp Jurídico', messagesSent: 856, messagesReceived: 720 }
  ],
  campaigns: {
    campaigns: [
      { _id: '1', name: 'Campanha Jun/2025', status: 'active' },
      { _id: '2', name: 'Segunda Via Boleto', status: 'running' },
      { _id: '3', name: 'Negativados Q1', status: 'completed' }
    ]
  },
  conversations: {
    conversations: Array.from({ length: 45 }, (_, i) => ({
      id: i + 1,
      status: i < 28 ? 'active' : 'closed',
      channel: i % 3 === 0 ? 'instagram' : 'whatsapp'
    }))
  }
};

export default function Dashboard() {
  const theme = useTheme();
  const { t } = useTranslation();
  const { isAuthenticated, user, updateUser } = useAuthStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [lineChartData, setLineChartData] = useState([]);

  const { isTourActive, currentStage, runStepTour, advanceTour } = useTour();

  // Tour Logic
  useEffect(() => {
    if (isTourActive && currentStage?.path === '/app/dashboard') {
      setTimeout(() => {
        runStepTour(currentStage.steps, advanceTour);
      }, 500);
    }
  }, [isTourActive, currentStage, runStepTour, advanceTour]);

  // Stripe Polling Logic (Mantido intacto caso você precise no futuro)
  useEffect(() => {
    const stripeSuccess = searchParams.get('stripe_success') === 'true';
    if (stripeSuccess && user?.plan === 'guest') {
      const pollingToastId = toast.loading(t('dashboard.toasts.checkingSubscription'));

      const interval = setInterval(async () => {
        try {
          // Aqui faria a requisição real de validação
          // const response = await api.get('/auth/profile');
          const fakeResponse = { data: { user: { ...user, plan: 'pro' } } }; // Mock
          
          if (fakeResponse.data.user && fakeResponse.data.user.plan !== 'guest') {
            updateUser(fakeResponse.data.user);
            queryClient.invalidateQueries();
            clearInterval(interval);
            clearTimeout(timeout);
            toast.update(pollingToastId, { render: t('dashboard.toasts.subscriptionSuccess'), type: "success", isLoading: false, autoClose: 5000 });
            searchParams.delete('stripe_success');
            setSearchParams(searchParams, { replace: true });
          }
        } catch (error) {
          console.error("Polling for profile failed:", error);
        }
      }, 3000);

      const timeout = setTimeout(() => {
        clearInterval(interval);
        toast.update(pollingToastId, { render: t('dashboard.toasts.subscriptionError'), type: "error", isLoading: false, autoClose: 10000 });
      }, 45000);
      
      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [searchParams, setSearchParams, user, updateUser, queryClient, navigate, t]);

  // ==========================================
  // QUERIES MOCKADAS
  // ==========================================
  const { data: statsData, isLoading: isLoadingStats } = useQuery(
    'dashboard-stats',
    async () => {
      if (USE_MOCKS) {
        await delay(800);
        return MOCK_DATA.stats;
      }
      return api.get('/dashboard/stats').then(res => res.data);
    },
    { enabled: isAuthenticated, keepPreviousData: true }
  );

  const { data: activitiesData, isLoading: isLoadingActivities } = useQuery(
    'dashboard-activities',
    async () => {
      if (USE_MOCKS) {
        await delay(1000);
        return MOCK_DATA.activities;
      }
      return api.get('/dashboard/activities').then(res => res.data);
    },
    { enabled: isAuthenticated, keepPreviousData: true }
  );

  const { data: instancesData, isLoading: isLoadingInstances } = useQuery(
    'whatsapp-instances',
    async () => {
      if (USE_MOCKS) {
        await delay(1200);
        return MOCK_DATA.instances;
      }
      return api.get('/whatsapp').then(res => res.data);
    },
    { enabled: isAuthenticated }
  );

  const { data: campaignsData } = useQuery(
    'dashboard-campaigns',
    async () => {
      if (USE_MOCKS) {
        await delay(900);
        return MOCK_DATA.campaigns;
      }
      return api.get('/campaigns').then(res => res.data);
    },
    { enabled: isAuthenticated, staleTime: 5 * 60 * 1000 }
  );

  const { data: conversationsData, isLoading: isLoadingConversations } = useQuery(
    'conversations-data',
    async () => {
      if (USE_MOCKS) {
        await delay(1100);
        return MOCK_DATA.conversations;
      }
      return api.get('/conversations').then(res => res.data);
    },
    { enabled: isAuthenticated }
  );

  // Derivando os dados das queries para as props dos componentes
  const stats = statsData;
  const activities = activitiesData?.activities || [];
  const allConversations = conversationsData?.conversations || [];

  const whatsappConversations = allConversations.filter(c => c.channel === 'whatsapp');
  const instagramConversations = allConversations.filter(c => c.channel === 'instagram');
  const whatsappInstances = instancesData || [];
  
  const campaignsToDisplay = campaignsData?.campaigns?.filter(c => c.status !== 'draft') || [];

  const isLoading = isLoadingStats || isLoadingActivities || isLoadingInstances || isLoadingConversations;

  useEffect(() => {
    if (!stats?.leadsOverTime) return;
    const days = eachDayOfInterval({ start: subDays(new Date(), 29), end: new Date() });
    const dataMap = new Map(stats.leadsOverTime.map(item => [item._id, item.count]));

    const newData = days.map(day => {
      const formattedDate = format(day, 'yyyy-MM-dd');
      return {
        date: format(day, 'dd/MM'),
        leads: dataMap.get(formattedDate) || 0,
      };
    });

    setLineChartData(prev =>
      prev.length ? newData.map((d, i) => ({ ...d, leads: d.leads || prev[i]?.leads || 0 })) : newData
    );
  }, [stats]);

  if (isLoading && !stats) {
    return (
      <LinearProgress
        sx={{
          background: alpha(theme.palette.primary.main, 0.2),
          '& .MuiLinearProgress-bar': { 
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})` 
          }
        }}
      />
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', p: { xs: 1, sm: 2, md: 3 } }}>
      <Box 
        sx={{ 
          p: { xs: 2, sm: 3 }, 
          mb: 3, 
          borderRadius: 3, 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between', 
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 2,
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <DashboardIcon sx={{ fontSize: { xs: 32, sm: 40 }, color: theme.palette.primary.main }} />
          <Box>
            <Typography variant="h4" fontWeight="bold" sx={{ 
              fontSize: { xs: '1.5rem', sm: '2rem' },
              color: theme.palette.text.primary,
            }}>
              {t('dashboard.title')}
            </Typography>
            <Typography variant="body2" sx={{ color: theme.palette.text.primary, mt: 0.5, opacity: 0.8 }}>
              Visão geral do desempenho de recuperação de crédito
            </Typography>
          </Box>
        </Box>
      </Box>

      <Grid container spacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={12} container spacing={{ xs: 1, sm: 2, md: 3 }} id="tour-dashboard-statscards">
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <StatCard 
              title={t('dashboard.statCards.totalDevedores')} 
              value={stats?.totalLeads || 0} 
              icon={<PeopleIcon />} 
              color={theme.palette.primary.main} 
              subtitle={t('dashboard.statCards.total')} 
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <StatCard 
              title={t('dashboard.statCards.activeConversations')} 
              value={stats?.activeConversations || 0} 
              icon={<ChatIcon />} 
              color={theme.palette.secondary.main} 
              subtitle={t('dashboard.statCards.now')} 
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <StatCard 
              title={t('dashboard.statCards.acordosAtivos')} 
              value={stats?.qualifiedLeads || 0} 
              icon={<CheckCircleIcon />} 
              color={theme.palette.success.main} 
              subtitle={t('dashboard.statCards.thisMonth')} 
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={3}>
            <StatCard 
              title={t('dashboard.statCards.custoContato')} 
              value={fmt(stats?.whatsappApiCost || 0)} 
              icon={<ChatIcon />} 
              color={theme.palette.info.main} 
              subtitle={t('dashboard.statCards.thisMonth')} 
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={4}>
            <StatCard 
              title={t('dashboard.statCards.totalRecovered')} 
              value={fmt(stats?.financial?.totalRecovered || 0)} 
              icon={<PaymentIcon />} 
              color={theme.palette.success.main} 
              subtitle={t('dashboard.statCards.thisMonth')} 
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={4}>
            <StatCard 
              title={t('dashboard.statCards.fees')} 
              value={fmt(stats?.financial?.commissions || 0)} 
              icon={<TrendingUpIcon />} 
              color={theme.palette.warning.main} 
              subtitle={t('dashboard.statCards.thisMonth')} 
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={4}>
            <StatCard 
              title={t('dashboard.statCards.conversionRate')} 
              value={`${stats?.conversionRate || 0}%`} 
              icon={<TrendingUpIcon />} 
              color={theme.palette.custom?.pink?.[500] || theme.palette.info.main} 
              subtitle={t('dashboard.statCards.thisMonth')} 
            />
          </Grid>
        </Grid>
 
        <Grid item xs={12} id="tour-dashboard-whatsapp">
          <WhatsappStatsBoard instances={whatsappInstances} conversations={{ conversations: whatsappConversations }} />
        </Grid>
 
        {user?.role === 'admin' && (
          <Grid item xs={12}>
            <InstagramStatsBoard conversations={{ conversations: instagramConversations }} />
          </Grid>
        )}

        <Grid item xs={12} container spacing={{ xs: 1, sm: 2, md: 3 }} id="tour-dashboard-graficos">
          <Grid item xs={12} xl={7}>
            <ChartPaper title={t('dashboard.charts.newDevedoresTitle')}>
              <LineLeadsChart data={lineChartData} />
            </ChartPaper>
          </Grid>
          <Grid item xs={12} xl={5}>
            <ChartPaper title={t('dashboard.charts.devedoresFunnelTitle')}>
              <FunnelLeads data={stats?.leadsByStatus || []} />
            </ChartPaper>
          </Grid>
          <Grid item xs={12} md={6} xl={4}>
            <ChartPaper title={t('dashboard.charts.leadsBySourceTitle')}>
              <LeadsBySourceChart data={stats?.leadsBySource || []} />
            </ChartPaper>
          </Grid>
          <Grid item xs={12} md={6} xl={4}>
            <ChartPaper title={t('dashboard.charts.conversationsByChannelTitle')}>
              <ConversationsByChannelChart data={stats?.conversationsByChannel || []} />
            </ChartPaper>
          </Grid>

          <Grid item xs={12} xl={4} id="tour-dashboard-tarefas">
            <RecentActivities activities={activities} />
          </Grid>
        </Grid>

        <Grid item xs={12} container spacing={{ xs: 1, sm: 2, md: 3 }} id="tour-dashboard-campaigns">
          {campaignsToDisplay.length > 0 && (
            <Grid item xs={12} mt={4}>
              <Box 
                sx={{ 
                  p: 2, 
                  borderRadius: 3,
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  mb: 2
                }}
              >
                <Typography variant="h5" gutterBottom sx={{
                  color: theme.palette.text.primary,
                  fontWeight: 600,
                  fontSize: { xs: '1.25rem', sm: '1.5rem' },
                  position: 'relative',
                  display: 'inline-block',
                  '&:after': {
                    content: '""',
                    display: 'block',
                    width: '60%',
                    height: '3px',
                    background: `linear-gradient(90deg, ${theme.palette.secondary.main}, transparent)`,
                    marginTop: '4px',
                    borderRadius: '3px'
                  }
                }}>
                  {t('dashboard.charts.recentCampaignsTitle')}
                </Typography>
              </Box>
            </Grid>
          )}
          
          {campaignsToDisplay.map(campaign => (
            <CampaignStatsChart 
              key={campaign._id} 
              campaignId={campaign._id} 
              campaignName={campaign.name} 
              useMockData={true} // Forçando true caso o componente filho exija
            />
          ))}
        </Grid>
      </Grid>
    </Box>
  );
}