import React, { useState } from 'react';
import {
  Box, Typography, Paper, Grid, Card, CardContent,
  IconButton, Collapse, useTheme, alpha, Tooltip,
  LinearProgress
} from '@mui/material';
import {
  KeyboardArrowDown as ExpandMoreIcon,
  KeyboardArrowUp as ExpandLessIcon,
  CalendarToday as CalendarIcon,
  TrendingUp as TrendIcon,
  AccountBalanceWallet as WalletIcon,
  CheckCircle as PaidIcon,
  Schedule as PendingIcon,
  Error as OverdueIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const MonthCard = ({ data }) => {
  const theme = useTheme();
  const total = data.paid + data.pending + data.overdue;
  const recoveryRate = total > 0 ? Math.round((data.paid / total) * 100) : 0;

  const monthName = format(new Date(2024, data.month, 1), 'MMMM', { locale: ptBR });

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <Paper
        sx={{
          p: 2,
          height: '100%',
          background: alpha(theme.palette.background.paper, 0.4),
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Progress Background */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            height: '4px',
            width: `${recoveryRate}%`,
            background: `linear-gradient(90deg, ${theme.palette.success.main}, ${theme.palette.success.light})`,
            transition: 'width 1s ease-in-out'
          }}
        />

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="subtitle1" fontWeight="bold" sx={{ textTransform: 'capitalize' }}>
            {monthName}
          </Typography>
          <Tooltip title="Taxa de Recuperação">
            <Box
              sx={{
                px: 1,
                py: 0.5,
                borderRadius: 1,
                bgcolor: alpha(theme.palette.success.main, 0.1),
                color: theme.palette.success.main,
                fontSize: '0.75rem',
                fontWeight: 'bold'
              }}
            >
              {recoveryRate}%
            </Box>
          </Tooltip>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <PaidIcon sx={{ fontSize: 12, color: theme.palette.success.main }} /> Pago
            </Typography>
            <Typography variant="caption" fontWeight="bold">R$ {data.paid.toLocaleString()}</Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <PendingIcon sx={{ fontSize: 12, color: theme.palette.warning.main }} /> Pendente
            </Typography>
            <Typography variant="caption" fontWeight="bold">R$ {data.pending.toLocaleString()}</Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <OverdueIcon sx={{ fontSize: 12, color: theme.palette.error.main }} /> Atrasado
            </Typography>
            <Typography variant="caption" fontWeight="bold">R$ {data.overdue.toLocaleString()}</Typography>
          </Box>
        </Box>
      </Paper>
    </motion.div>
  );
};

const YearPanel = ({ data, isDefaultExpanded }) => {
  const [expanded, setExpanded] = useState(isDefaultExpanded);
  const theme = useTheme();

  const totalPossible = data.totalPaid + data.totalPending + data.totalOverdue;
  const annualRecoveryRate = totalPossible > 0 ? Math.round((data.totalPaid / totalPossible) * 100) : 0;

  return (
    <Card
      sx={{
        mb: 3,
        background: theme.palette.custom?.glass?.medium || alpha(theme.palette.background.paper, 0.1),
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: 4,
        overflow: 'visible'
      }}
    >
      <Box
        sx={{
          p: 3,
          cursor: 'pointer',
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          gap: 2
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Box
            sx={{
              width: 50,
              height: 50,
              borderRadius: 2,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: theme.palette.primary.main
            }}
          >
            <CalendarIcon />
          </Box>
          <Box>
            <Typography variant="h5" fontWeight="bold">{data.year}</Typography>
            <Typography variant="body2" color="text.secondary">Resumo anual de recebimentos</Typography>
          </Box>
        </Box>

        <Box display="flex" gap={4} sx={{ width: { xs: '100%', sm: 'auto' }, overflowX: 'auto' }}>
          <Box>
            <Typography variant="caption" color="text.secondary" display="block">TOTAL PAGO</Typography>
            <Typography variant="subtitle1" fontWeight="bold" color="success.main">R$ {data.totalPaid.toLocaleString()}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" display="block">TOTAL PENDENTE</Typography>
            <Typography variant="subtitle1" fontWeight="bold" color="warning.main">R$ {data.totalPending.toLocaleString()}</Typography>
          </Box>
          <Box sx={{ minWidth: 100 }}>
            <Typography variant="caption" color="text.secondary" display="block">RECUPERAÇÃO</Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="subtitle1" fontWeight="bold">{annualRecoveryRate}%</Typography>
              <TrendIcon sx={{ color: annualRecoveryRate > 50 ? 'success.main' : 'warning.main', fontSize: 16 }} />
            </Box>
          </Box>
          <IconButton size="small">
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
      </Box>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Box sx={{ p: 3, pt: 0 }}>
          <Grid container spacing={2}>
            {data.months.filter(m => (m.paid + m.pending + m.overdue) > 0).map((monthData, idx) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={idx}>
                <MonthCard data={monthData} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Collapse>
    </Card>
  );
};

export default function AnnualSummary({ summaryData }) {
  if (!summaryData || summaryData.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: 'center', opacity: 0.5 }}>
        <WalletIcon sx={{ fontSize: 60, mb: 2 }} />
        <Typography>Nenhum histórico de cobrança encontrado.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        Painéis de Cobrança
        <Box component="span" sx={{ px: 2, py: 0.5, borderRadius: 5, bgcolor: 'primary.main', color: 'white', fontSize: '0.7rem' }}>
          ANUAL
        </Box>
      </Typography>

      <AnimatePresence>
        {summaryData.map((yearData, idx) => (
          <YearPanel
            key={yearData.year}
            data={yearData}
            isDefaultExpanded={idx === 0}
          />
        ))}
      </AnimatePresence>
    </Box>
  );
}
