import React from 'react';
import { useQuery } from 'react-query';
import { Grid, Typography, Box, CircularProgress, useTheme, alpha, useMediaQuery } from '@mui/material';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { format, parseISO, subDays } from 'date-fns';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';
import ChartPaper from './ChartPaper';

// Dados mockados para campanhas
const MOCK_CAMPAIGN_DATA = {
  campaignName: "Campanha Demo",
  statsByStatus: [
    { name: 'Pendentes', value: 45 },
    { name: 'Enviados', value: 120 },
    { name: 'Respondidos', value: 35 },
    { name: 'Falhas', value: 8 }
  ],
  activityOverTime: Array.from({ length: 14 }, (_, i) => ({
    date: format(subDays(new Date(), 13 - i), 'yyyy-MM-dd'),
    sent: Math.floor(Math.random() * 30) + 10,
    replied: Math.floor(Math.random() * 15) + 5
  }))
};

const CustomPieTooltip = ({ active, payload }) => {
  const theme = useTheme();
  if (active && payload && payload.length) {
    return (
      <Box sx={{
        background: theme.palette.mode === 'dark' 
          ? 'rgba(255, 255, 255, 0.12)'
          : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
        borderRadius: '12px',
        padding: '16px',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      }}>
        <Typography variant="subtitle2" sx={{ 
          color: theme.palette.text.primary, 
          fontWeight: 600, 
          fontSize: '0.9rem' 
        }}>
          {`${payload[0].name}: ${payload[0].value}`}
        </Typography>
      </Box>
    );
  }
  return null;
};

const CampaignStatusPieChart = ({ data, isMobile }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  
  const keyMap = {
    'Pendentes': 'pending',
    'Enviados': 'sent',
    'Respondidos': 'replied',
    'Falhas': 'failed',
  };

  const translatedData = data.map(item => ({
    ...item,
    name: t(`dashboard.campaignStatus.${keyMap[item.name] || item.name.toLowerCase()}`)
  }));
  
  // Cores suaves e harmoniosas para ambos os temas
  const statusColorMap = theme.palette.mode === 'dark' 
    ? {
        [t('dashboard.campaignStatus.pending')]: '#8b5cf6', // Roxo suave
        [t('dashboard.campaignStatus.sent')]: '#3b82f6',    // Azul suave
        [t('dashboard.campaignStatus.replied')]: '#10b981', // Verde suave
        [t('dashboard.campaignStatus.failed')]: '#ef4444',  // Vermelho suave
      }
    : {
        [t('dashboard.campaignStatus.pending')]: '#a78bfa', // Roxo pastel
        [t('dashboard.campaignStatus.sent')]: '#60a5fa',    // Azul pastel
        [t('dashboard.campaignStatus.replied')]: '#34d399', // Verde pastel
        [t('dashboard.campaignStatus.failed')]: '#f87171',  // Vermelho pastel
      };

  return (
    <ResponsiveContainer width="100%" height={isMobile ? 200 : "100%"}>
      <PieChart>
        <defs>
          {translatedData.map((entry, index) => (
            <filter key={index} id={`pie-glow-${index}`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          ))}
        </defs>

        <Pie 
          data={translatedData} 
          dataKey="value" 
          nameKey="name" 
          cx="50%" 
          cy="50%" 
          innerRadius={isMobile ? "35%" : "40%"} 
          outerRadius={isMobile ? "65%" : "70%"} 
          paddingAngle={2}
        >
          {translatedData.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={statusColorMap[entry.name] || theme.palette.grey[300]} 
              stroke={alpha(theme.palette.background.paper, 0.3)}
              strokeWidth={1}
              opacity={0.85}
              filter={`url(#pie-glow-${index})`}
            />
          ))}
        </Pie>
        <Tooltip content={<CustomPieTooltip />} />
        <Legend 
          iconSize={isMobile ? 6 : 8} 
          wrapperStyle={{ 
            fontSize: isMobile ? '0.6rem' : '0.7rem',
            marginTop: isMobile ? '5px' : '10px'
          }}
          layout={isMobile ? 'horizontal' : 'vertical'}
          verticalAlign={isMobile ? 'bottom' : 'middle'}
          align={isMobile ? 'center' : 'right'}
          formatter={(value) => (
            <span style={{ 
              color: theme.palette.text.primary, 
              fontSize: isMobile ? '0.6rem' : '0.7rem',
              fontWeight: 500
            }}>
              {value}
            </span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

const CustomBarTooltip = ({ active, payload, label }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  
  if (active && payload && payload.length) {
    return (
      <Box sx={{
        background: theme.palette.mode === 'dark' 
          ? 'rgba(255, 255, 255, 0.12)'
          : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
        borderRadius: '12px',
        padding: '16px',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      }}>
        <Typography variant="subtitle2" sx={{ 
          color: theme.palette.text.primary,
          fontWeight: 600,
          marginBottom: '8px'
        }}>
          {label}
        </Typography>
        {payload.map((entry, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
            <Box sx={{
              width: '10px',
              height: '10px',
              background: entry.color,
              borderRadius: '2px',
              marginRight: '6px',
              opacity: 0.8
            }} />
            <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>
              {entry.name}: <strong>{entry.value}</strong>
            </Typography>
          </Box>
        ))}
      </Box>
    );
  }
  return null;
};

const CampaignActivityBarChart = ({ data, isMobile, isTablet, isDesktop }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  
  // Cores suaves para a barra - harmonizando com o tema
  const barColors = theme.palette.mode === 'dark' 
    ? {
        primary: '#8b5cf6', // Roxo suave
        gradientStart: '#8b5cf6',
        gradientEnd: '#c4b5fd'
      }
    : {
        primary: '#a78bfa', // Roxo pastel
        gradientStart: '#a78bfa',
        gradientEnd: '#ddd6fe'
      };

  // CORREÇÃO DEFINITIVA: Intervalo inteligente baseado na quantidade de dados
  const getXAxisInterval = () => {
    if (isMobile) return 'preserveStartEnd'; // Mobile mostra alguns labels
    if (data.length <= 7) return 0; // Se tiver poucos dados, mostra todos
    if (data.length <= 14) return 1; // Se tiver dados médios, mostra 1 de 2
    return 2; // Se tiver muitos dados, mostra 1 de 3
  };

  // CORREÇÃO: Tamanho da fonte baseado na quantidade de dados
  const getXAxisFontSize = () => {
    if (isMobile) return 9;
    if (data.length > 10) return 8; // Fontes menores para muitos dados
    return 10;
  };

  return (
    <ResponsiveContainer width="100%" height={isMobile ? 200 : "100%"}>
      <BarChart 
        data={data} 
        margin={{ 
          top: 10, 
          right: isMobile ? 10 : 25, // CORREÇÃO: Margem direita maior
          left: isMobile ? -10 : -15, 
          bottom: isMobile ? 10 : 25 // CORREÇÃO: Margem inferior maior
        }}
        barSize={isMobile ? 12 : 20} // CORREÇÃO: Largura das barras
      >
        <defs>
          <linearGradient id="sentGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={barColors.gradientStart} stopOpacity={0.8}/>
            <stop offset="100%" stopColor={barColors.gradientEnd} stopOpacity={0.4}/>
          </linearGradient>
          
          <filter id="barGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        
        <CartesianGrid 
          strokeDasharray="3 3" 
          stroke={alpha(theme.palette.text.primary, 0.1)}
          horizontal={true}
          vertical={false}
        />
        
        <XAxis 
          dataKey="date" 
          tick={{ 
            fontSize: getXAxisFontSize(), // CORREÇÃO: Tamanho dinâmico
            fill: theme.palette.text.primary,
            fontFamily: theme.typography.fontFamily,
          }} 
          axisLine={{ 
            stroke: alpha(theme.palette.text.primary, 0.3),
            strokeWidth: 1
          }}
          tickLine={{ 
            stroke: alpha(theme.palette.text.primary, 0.3)
          }}
          interval={getXAxisInterval()} // CORREÇÃO: Intervalo inteligente
          height={isMobile ? 35 : 45} // CORREÇÃO: Altura aumentada
          minTickGap={isMobile ? 1 : 2} // CORREÇÃO: Espaço mínimo entre ticks
        />
        
        <YAxis 
          allowDecimals={false} 
          tick={{ 
            fontSize: isMobile ? 9 : 10, 
            fill: theme.palette.text.primary,
            fontFamily: theme.typography.fontFamily
          }} 
          axisLine={{ 
            stroke: alpha(theme.palette.text.primary, 0.3),
            strokeWidth: 1
          }}
          tickLine={{ 
            stroke: alpha(theme.palette.text.primary, 0.3)
          }}
          width={isMobile ? 30 : 40} // CORREÇÃO: Largura aumentada
        />
        
        <Tooltip 
          cursor={{ 
            fill: alpha(theme.palette.primary.main, 0.1),
            stroke: alpha(theme.palette.primary.main, 0.3),
            strokeWidth: 1,
            strokeDasharray: '3 3'
          }}
          content={<CustomBarTooltip />}
        />
        
        <Bar 
          dataKey="sent" 
          fill="url(#sentGradient)" 
          name={t('dashboard.charts.sends')}
          radius={[4, 4, 0, 0]}
          filter="url(#barGlow)"
          opacity={0.9}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default function CampaignStatsChart({ campaignId, campaignName, useMockData = false }) {
  const { t } = useTranslation();
  const theme = useTheme();
  
  // CORREÇÃO: Breakpoints mais precisos
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  
  const { data, isLoading, isError } = useQuery(
    ['campaignStats', campaignId],
    () => api.get(`/dashboard/campaigns/${campaignId}/stats`).then(res => res.data),
    { 
      staleTime: 60000,
      enabled: !useMockData
    }
  );

  const campaignData = useMockData ? MOCK_CAMPAIGN_DATA : data;
  
  // CORREÇÃO: Reduzir dados para telas com muitos pontos
  const formattedActivityData = React.useMemo(() => {
    const rawData = campaignData?.activityOverTime?.map(item => ({
      ...item,
      date: format(parseISO(item.date), 'dd/MM')
    })) || [];

    // Se tiver muitos dados e for mobile/tablet, reduz para melhor visualização
    if (rawData.length > 10 && (isMobile || isTablet)) {
      return rawData.filter((_, index) => index % 2 === 0); // Pega 1 de 2
    }
    
    return rawData;
  }, [campaignData?.activityOverTime, isMobile, isTablet]);

  if (isLoading && !useMockData) {
    return (
      <Grid item xs={12} md={6} lg={4}>
        <ChartPaper title={t('dashboard.charts.campaignAnalysisTitle', { campaignName })}>
          <Box display="flex" justifyContent="center" alignItems="center" height={isMobile ? 450 : 300}>
            <CircularProgress size={isMobile ? 30 : 40} />
          </Box>
        </ChartPaper>
      </Grid>
    );
  }

  if ((isError || !campaignData) && !useMockData) {
    return (
      <Grid item xs={12} md={6} lg={4}>
        <ChartPaper title={t('dashboard.charts.campaignAnalysisTitle', { campaignName })}>
          <Box display="flex" justifyContent="center" alignItems="center" height={isMobile ? 450 : 300}>
            <Typography 
              variant={isMobile ? "body2" : "body1"}
              sx={{ 
                color: theme.palette.text.secondary,
                opacity: 0.8,
                textAlign: 'center',
                px: 2
              }}
            >
              {t('dashboard.charts.errorLoading')}
            </Typography>
          </Box>
        </ChartPaper>
      </Grid>
    );
  }

  return (
    <Grid item xs={12} md={6} lg={4}>
      <ChartPaper 
        title={t('dashboard.charts.campaignAnalysisTitle', { 
          campaignName: campaignData?.campaignName || campaignName 
        })}
        sx={{ 
          minHeight: isMobile ? 450 : 350,
          height: '100%'
        }}
      >
        <Grid 
          container 
          spacing={isMobile ? 2 : 1} 
          sx={{ 
            height: '100%',
            flexDirection: isMobile ? 'column' : 'row'
          }}
        >
          {/* Gráfico de Pizza - Status */}
          <Grid 
            item 
            xs={12}
            sm={5}
            sx={{ 
              height: isMobile ? 220 : '100%',
              minHeight: isMobile ? 220 : 180,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Typography 
              variant="subtitle2" 
              align="center" 
              gutterBottom 
              sx={{ 
                color: theme.palette.text.primary, 
                fontWeight: 600,
                fontSize: isMobile ? '0.75rem' : '0.8rem',
                opacity: 0.9,
                mb: isMobile ? 1 : 2
              }}
            >
              {t('dashboard.charts.contactStatus')}
            </Typography>
            <Box sx={{ flex: 1 }}>
              <CampaignStatusPieChart 
                data={campaignData?.statsByStatus || []} 
                isMobile={isMobile}
              />
            </Box>
          </Grid>

          {/* Gráfico de Barras - Atividade */}
          <Grid 
            item 
            xs={12}
            sm={7}
            sx={{ 
              height: isMobile ? 220 : '100%',
              minHeight: isMobile ? 220 : 180,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Typography 
              variant="subtitle2" 
              align="center" 
              gutterBottom 
              sx={{ 
                color: theme.palette.text.primary, 
                fontWeight: 600,
                fontSize: isMobile ? '0.75rem' : '0.8rem',
                opacity: 0.9,
                mb: isMobile ? 1 : 2
              }}
            >
              {t('dashboard.charts.sendsPerDay')}
            </Typography>
            <Box sx={{ flex: 1 }}>
              <CampaignActivityBarChart 
                data={formattedActivityData} 
                isMobile={isMobile}
                isTablet={isTablet}
                isDesktop={isDesktop}
              />
            </Box>
          </Grid>
        </Grid>
      </ChartPaper>
    </Grid>
  );
}