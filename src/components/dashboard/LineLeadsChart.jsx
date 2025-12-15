import React from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ReferenceLine,
  Label,
  Area
} from 'recharts';
import { useTheme, Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const CustomTooltip = ({ active, payload, label }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  
  if (active && payload && payload.length) {
    return (
      <Box sx={{
        background: theme.palette.custom.glass?.medium || 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(10px)',
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: '12px',
        padding: '16px',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      }}>
        <Typography variant="subtitle2" sx={{ 
          color: theme.palette.text.primary,
          fontWeight: 600,
          marginBottom: '8px',
          fontSize: '0.9rem'
        }}>
          {label}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{
            width: '12px',
            height: '12px',
            background: theme.palette.secondary.main,
            borderRadius: '50%',
            marginRight: '8px',
            boxShadow: `0 0 8px ${theme.palette.secondary.main}50`
          }} />
          <Typography variant="body2" sx={{ color: theme.palette.text.primary, fontSize: '0.85rem' }}>
            {t('dashboard.charts.leads')}: <strong style={{fontSize: '1.1rem'}}>{payload[0].value}</strong>
          </Typography>
        </Box>
      </Box>
    );
  }

  return null;
};

export default function LineLeadsChart({ data }) {
  const { t } = useTranslation();
  const theme = useTheme();

  // Garantir que sempre temos dados para mostrar a linha completa
  const chartData = data && data.length > 0 ? data : Array.from({ length: 30 }, (_, i) => ({
    date: `${String(i + 1).padStart(2, '0')}/01`,
    leads: 0
  }));

  const averageLeads = chartData && chartData.length > 0 
    ? Math.round(chartData.reduce((a, b) => a + b.leads, 0) / chartData.length)
    : 0;

  // Encontrar o valor máximo para ajustar o domínio do Y-axis
  const maxLeads = Math.max(...chartData.map(item => item.leads), 10);

  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        position: 'relative',
        '& *': {
          outline: 'none !important',
          boxShadow: 'none !important',
        },
        '& .recharts-wrapper': {
          fontFamily: theme.typography.fontFamily,
        },
        '& .recharts-cartesian-grid-horizontal line': {
          stroke: theme.palette.divider,
          strokeDasharray: '3 3',
        },
        '& .recharts-cartesian-grid-vertical line': {
          stroke: 'transparent',
        },
        '& .recharts-xAxis .recharts-cartesian-axis-line': {
          stroke: theme.palette.divider,
        },
        '& .recharts-yAxis .recharts-cartesian-axis-line': {
          stroke: theme.palette.divider,
        },
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart 
          data={chartData} 
          margin={{ top: 25, right: 20, left: 15, bottom: 20 }}
        >
          <defs>
            {/* Gradiente para a linha */}
            <linearGradient id="leadsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={theme.palette.secondary.main} stopOpacity={1}/>
              <stop offset="100%" stopColor={theme.palette.secondary.light} stopOpacity={0.8}/>
            </linearGradient>
            
            {/* Gradiente para a área */}
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={theme.palette.secondary.main} stopOpacity={0.4}/>
              <stop offset="100%" stopColor={theme.palette.secondary.main} stopOpacity={0.1}/>
            </linearGradient>

            {/* Sombra para a linha */}
            <filter id="lineShadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor={theme.palette.secondary.main} floodOpacity="0.3"/>
            </filter>
          </defs>
          
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={theme.palette.divider}
            vertical={false} 
          />

          <XAxis 
            dataKey="date"
            tickLine={false}
            axisLine={{ stroke: theme.palette.divider, strokeWidth: 1 }}
            tick={{ fill: theme.palette.text.primary, fontSize: 11, dy: 10, fontWeight: 500 }}
            interval="preserveStartEnd"
          />
          
          <YAxis 
            allowDecimals={false}
            tickLine={false}
            axisLine={{ stroke: theme.palette.divider, strokeWidth: 1 }}
            tick={{ fill: theme.palette.text.primary, fontSize: 11, fontWeight: 500 }}
            domain={[0, maxLeads + 5]}
            ticks={[0, Math.floor(maxLeads/2), maxLeads]}
          />
          
          <ReferenceLine 
            y={averageLeads}
            stroke={theme.palette.text.secondary}
            strokeWidth={2}
            strokeDasharray="5 5"
          >
            <Label 
              value={`${t('dashboard.charts.average')}: ${averageLeads}`}
              position="insideTopRight"
              fontSize={10}
              fill={theme.palette.text.secondary}
              fontWeight="600"
            />
          </ReferenceLine>
          
          <Tooltip 
            content={<CustomTooltip />}
            cursor={{ 
              stroke: theme.palette.divider, 
              strokeWidth: 1,
              strokeDasharray: '3 3'
            }}
          />
          
          <Legend 
            wrapperStyle={{ 
              paddingTop: '10px',
              fontSize: '11px',
              fontWeight: 600
            }}
            formatter={(value) => (
              <span style={{ 
                color: theme.palette.text.primary, 
                fontSize: '0.75rem', 
                fontWeight: 600,
              }}>
                {value}
              </span>
            )}
          />

          {/* Área com gradiente */}
          <Area
            type="monotone"
            dataKey="leads"
            stroke="transparent"
            fill="url(#areaGradient)"
            fillOpacity={1}
            connectNulls={true}
            isAnimationActive={true}
            animationDuration={1500}
          />
          
          {/* Linha principal SEM bolinhas */}
          <Line
            type="monotone"
            dataKey="leads"
            name={t('dashboard.charts.newLeadsLegend')}
            stroke="url(#leadsGradient)"
            strokeWidth={4}
            dot={false}
            activeDot={{
              r: 6,
              fill: theme.palette.secondary.main,
              stroke: theme.palette.background.paper,
              strokeWidth: 2,
            }}
            strokeLinecap="round"
            strokeLinejoin="round"
            connectNulls={true}
            isAnimationActive={true}
            animationDuration={2000}
            animationEasing="ease-out"
            filter="url(#lineShadow)"
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Indicador visual de que a linha está visível mesmo com zeros */}
      {chartData.every(item => item.leads === 0) && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            background: theme.palette.custom.glass?.medium,
            backdropFilter: 'blur(10px)',
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: '12px',
            padding: '16px 20px',
            maxWidth: '80%',
          }}
        >
          <Typography 
            variant="body2" 
            sx={{ 
              color: theme.palette.text.secondary,
              fontWeight: 500,
              fontSize: '0.85rem'
            }}
          >
            📊 Acompanhe seus leads aqui. A linha aparecerá assim que você tiver dados.
          </Typography>
        </Box>
      )}
    </Box>
  );
}