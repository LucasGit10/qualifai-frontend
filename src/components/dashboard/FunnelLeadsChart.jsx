import { ResponsiveContainer, FunnelChart, Funnel, Tooltip, LabelList, Cell } from 'recharts';
import { useTheme, Box, Typography, Alert } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { InfoOutlined } from '@mui/icons-material';

const CustomTooltip = ({ active, payload }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  if (active && payload && payload.length) {
    return (
      <Box sx={{
        background: theme.palette.mode === 'dark' 
          ? theme.palette.custom.glass?.medium 
          : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: '12px',
        padding: '16px',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Box sx={{
            width: '12px',
            height: '12px',
            background: payload[0].payload.fill,
            borderRadius: '2px',
            marginRight: '8px',
            boxShadow: `0 0 8px ${payload[0].payload.fill}50`
          }} />
          <Typography variant="subtitle2" sx={{ 
            color: theme.palette.text.primary, 
            fontWeight: 600, 
            fontSize: '0.9rem' 
          }}>
            {payload[0].name}
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ 
          color: theme.palette.text.primary, 
          fontSize: '0.85rem' 
        }}>
          {t('dashboard.charts.devedores')}: <strong style={{fontSize: '1.1rem'}}>{payload[0].value}</strong>
        </Typography>
        {payload[0].payload.percentage && (
          <Typography variant="body2" sx={{ 
            color: theme.palette.text.secondary, 
            fontSize: '0.8rem', 
            mt: 0.5 
          }}>
            {payload[0].payload.percentage}% do total
          </Typography>
        )}
      </Box>
    );
  }

  return null;
};

const EmptyFunnelMessage = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        p: 3,
      }}
    >
      <InfoOutlined 
        sx={{ 
          fontSize: 48, 
          color: theme.palette.info.main,
          mb: 2,
          opacity: 0.7
        }} 
      />
      <Typography 
        variant="h6" 
        sx={{ 
          color: theme.palette.text.primary, 
          fontWeight: 600,
          mb: 1
        }}
      >
        {t('dashboard.funnel.emptyTitle')}
      </Typography>
      <Typography 
        variant="body2" 
        sx={{ 
          color: theme.palette.text.secondary,
          maxWidth: '300px',
          lineHeight: 1.5
        }}
      >
        {t('dashboard.funnel.emptyDescription')}
      </Typography>
    </Box>
  );
};

export default function FunnelLeadsChart({ data }) {
  const { t } = useTranslation();
  const theme = useTheme();

  // Ordem do funil de cobrança: fluxo do devedor
  const funnelOrder = ['novo', 'contatado', 'em_negociacao', 'acordado', 'quitado', 'judicial'];
  const statusMap = new Map(data?.map(item => [item._id, item.count]) || []);

  // Verificar se há dados válidos (mais que zero)
  const hasValidData = data && data.some(item => item.count > 0);
  const totalDevedores = data?.reduce((sum, item) => sum + (item.count || 0), 0) || 0;

  // Cores orientadas a cobrança: azul → roxo → laranja → verde claro → verde escuro → vermelho
  const funnelColors = theme.palette.mode === 'dark'
    ? ['#3B82F6', '#8B5CF6', '#F59E0B', '#34D399', '#10B981', '#EF4444']
    : ['#2563EB', '#7C3AED', '#D97706', '#059669', '#047857', '#DC2626'];

  // Calcular totais e porcentagens
  const formattedData = funnelOrder.map((status, index) => {
    const value = statusMap.get(status) || 0;
    const percentage = totalDevedores > 0 ? ((value / totalDevedores) * 100).toFixed(1) : '0.0';
    
    return {
      name: t(`dashboard.funnelLabels.${status}`) || status,
      value: value,
      fill: funnelColors[index] || theme.palette.primary.main,
      percentage: percentage
    };
  });

  // Se não há dados válidos, mostrar mensagem
  if (!hasValidData || totalDevedores === 0) {
    return <EmptyFunnelMessage />;
  }

  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        '& *': {
          outline: 'none !important',
          boxShadow: 'none !important',
        },
        '& .recharts-wrapper': {
          fontFamily: theme.typography.fontFamily,
        }
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <FunnelChart>
          <Tooltip
            cursor={{ fill: 'transparent' }}
            content={<CustomTooltip />}
          />
          <Funnel 
            dataKey="value" 
            data={formattedData} 
            isAnimationActive={true}
            animationDuration={600}
            labelLine={false}
          >
            {formattedData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.fill}
                stroke={theme.palette.divider}
                strokeWidth={2}
                opacity={0.85}
              />
            ))}
            <LabelList
              position="right"
              dataKey="name"
              fill={theme.palette.text.primary} 
              stroke="none"
              fontSize={11}
              fontWeight={600}
              formatter={(value) => `${value}`}
            />
            <LabelList
              position="center"
              dataKey="value"
              fill={theme.palette.text.primary} 
              stroke="none"
              fontSize={12}
              fontWeight={700}
              formatter={(value) => value > 0 ? value : ''}
            />
          </Funnel>
        </FunnelChart>
      </ResponsiveContainer>
    </Box>
  );
}