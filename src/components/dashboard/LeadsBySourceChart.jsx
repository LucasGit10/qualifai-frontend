import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { useTheme, Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const CustomTooltip = ({ active, payload }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  if (active && payload && payload.length) {
    const total = payload[0].payload.total || 1;
    const percentage = ((payload[0].value / total) * 100).toFixed(1);
    
    return (
      <Box sx={{
        background: theme.palette.custom.glass?.medium || 'rgba(255, 255, 255, 0.15)',
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
            borderRadius: '50%',
            marginRight: '8px',
            boxShadow: `0 0 8px ${payload[0].payload.fill}50`
          }} />
          <Typography variant="subtitle2" sx={{ color: theme.palette.text.primary, fontWeight: 600, fontSize: '0.9rem' }}>
            {payload[0].name}
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ color: theme.palette.text.primary, fontSize: '0.85rem' }}>
          {t('dashboard.charts.leads')}: <strong style={{fontSize: '1.1rem'}}>{payload[0].value}</strong>
        </Typography>
        <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontSize: '0.8rem', mt: 0.5 }}>
          {percentage}% do total
        </Typography>
      </Box>
    );
  }

  return null;
};

export default function LeadsBySourceChart({ data }) {
  const { t } = useTranslation();
  const theme = useTheme();

  const PIE_COLORS = [
    '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe', '#00c49f'
  ];

  const total = data?.reduce((sum, item) => sum + (item.count || 0), 0) || 1;
  
  const formattedData = data?.map((item, index) => ({
    name: t(`dashboard.leadSources.${item._id.toLowerCase()}`) || item._id,
    value: item.count || 0,
    fill: PIE_COLORS[index % PIE_COLORS.length],
    total: total
  })) || [];

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
        },
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <defs>
            {formattedData.map((entry, index) => (
              <filter key={index} id={`glow-${index}`} x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            ))}
          </defs>
          
          <Pie
            data={formattedData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius="45%"
            outerRadius="75%"
            paddingAngle={1}
            stroke={theme.palette.divider}
            strokeWidth={2}
            animationDuration={800}
            animationBegin={200}
          >
            {formattedData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.fill}
                filter={`url(#glow-${index})`}
              />
            ))}
          </Pie>

          <Tooltip
            cursor={{ fill: 'transparent' }}
            content={<CustomTooltip />}
          />

          <Legend
            wrapperStyle={{
              marginTop: '15px',
              fontSize: '11px'
            }}
            formatter={(value) => (
              <span style={{
                color: theme.palette.text.primary,
                fontSize: '0.7rem',
                fontWeight: 500
              }}>
                {value}
              </span>
            )}
            iconType="circle"
            iconSize={8}
          />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
}