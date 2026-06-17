import React, { useState, useMemo } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Box, Typography, Button, Tabs, Tab, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Chip,
  Grid, Divider, IconButton, Tooltip, alpha, useTheme,
  Avatar, Paper, Stack, CircularProgress, Radio, RadioGroup, 
  FormControlLabel, FormControl
} from '@mui/material';
import {
  Close as CloseIcon,
  History as HistoryIcon,
  CalendarMonth as FutureIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  Download as DownloadIcon,
  Warning as WarningIcon,
  Schedule as ScheduleIcon,
  AccountBalance as BankIcon,
  Receipt as ReceiptIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'react-toastify';
import api from '../../services/api';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (v) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

const fmtDate = (d) => {
  try { return format(parseISO(d), 'dd/MM/yyyy', { locale: ptBR }); }
  catch { return d || '—'; }
};

const fmtPhone = (tel) => {
  if (!tel) return '—';
  const digits = String(tel).replace(/\D/g, '');
  const n = digits.startsWith('55') && (digits.length === 12 || digits.length === 13)
    ? digits.slice(2)
    : digits;
  if (n.length === 11) return `(${n.slice(0,2)}) ${n.slice(2,7)}-${n.slice(7)}`;
  if (n.length === 10) return `(${n.slice(0,2)}) ${n.slice(2,6)}-${n.slice(6)}`;
  return tel;
};

const normalizeContactValue = (value) => String(value || '').replace(/\D/g, '');

const getDialogPaperSx = (theme, color) => ({
  borderRadius: 3,
  background: theme.palette.mode === 'dark'
    ? 'rgba(18, 18, 30, 0.92)'
    : 'rgba(255, 255, 255, 0.98)',
  backdropFilter: 'blur(24px)',
  WebkitBackdropFilter: 'blur(24px)',
  border: `1px solid ${alpha(color || theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.24 : 0.16)}`,
  boxShadow: theme.palette.mode === 'dark'
    ? `0 24px 64px ${alpha('#000', 0.45)}`
    : `0 24px 64px ${alpha('#000', 0.12)}`,
  overflow: 'hidden',
});

// ─── Chip de atraso ───────────────────────────────────────────────────────────
const AtrasoChip = ({ dias }) => {
  if (!dias || dias <= 0) return null;
  let bg = '#f59e0b', color = '#f59e0b';
  if (dias > 180) { bg = '#9c27b0'; color = '#ce93d8'; }
  else if (dias > 90) { bg = '#ef4444'; color = '#ef4444'; }
  else if (dias > 30) { bg = '#f97316'; color = '#f97316'; }
  return (
    <Chip
      label={`${dias}d`}
      size="small"
      icon={<WarningIcon style={{ fontSize: 12, color }} />}
      sx={{
        bgcolor: alpha(bg, 0.15),
        color,
        fontWeight: 700,
        fontSize: '0.7rem',
        border: `1px solid ${alpha(bg, 0.3)}`,
        '& .MuiChip-icon': { ml: 0.5 },
      }}
    />
  );
};

// ─── KPI mini card ─────────────────────────────────────────────────────────────
const MiniKpi = ({ label, value, color, icon, sub }) => {
  const theme = useTheme();
  return (
    <Box sx={{
      flex: 1, p: 2, borderRadius: 2,
      backgroundColor: alpha(theme.palette.background.paper, theme.palette.mode === 'dark' ? 0.45 : 0.9),
      border: `1px solid ${alpha(color, 0.25)}`,
      minWidth: 120,
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
        {React.cloneElement(icon, { sx: { fontSize: 14, color } })}
        <Typography variant="caption" sx={{ color, fontWeight: 700, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>
          {label}
        </Typography>
      </Box>
      <Typography fontWeight={800} sx={{ color, fontSize: '1rem', lineHeight: 1.2 }}>{value}</Typography>
      {sub && <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>{sub}</Typography>}
    </Box>
  );
};

// ─── Tabela de lançamentos ─────────────────────────────────────────────────────
function ChargesTable({ charges, isFuture, onPay, isPaying }) {
  const theme = useTheme();

  if (!charges.length) return (
    <Box sx={{ py: 4, textAlign: 'center' }}>
      <Typography color="text.secondary" variant="body2">
        {isFuture ? 'Nenhum lançamento futuro.' : 'Nenhuma cobrança vencida.'}
      </Typography>
    </Box>
  );

  return (
    <TableContainer sx={{ maxHeight: 360, overflowY: 'auto', borderRadius: 1.5 }}>
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            {['Contrato', 'Apto', 'Esp', 'Elemento', 'Parcela', 'Vencimento', ...(isFuture ? [] : ['Atraso']), 'Principal', 'Juros', 'Multa', 'Total', 'Ações'].map((h) => (
              <TableCell
                key={h}
                sx={{
                  fontWeight: 700,
                  fontSize: '0.7rem',
                  color: 'text.secondary',
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                  py: 1,
                  bgcolor: alpha(theme.palette.background.paper, 0.9),
                  whiteSpace: 'nowrap',
                }}
              >
                {h}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {charges.map((c, i) => (
            <TableRow
              key={c.id || i}
              hover
              sx={{
                '&:hover': { bgcolor: alpha(isFuture ? '#10b981' : theme.palette.primary.main, 0.05) },
                ...(isFuture && {
                  '& td': { borderLeft: i === 0 ? 'none' : undefined },
                }),
              }}
            >
              <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.78rem', color: 'text.secondary', whiteSpace: 'nowrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {c.contrato || '—'}
                  {c.tags?.includes('novo') && (
                    <Chip 
                      label="NOVO" 
                      size="small" 
                      sx={{ 
                        height: 16, 
                        fontSize: '0.6rem', 
                        fontWeight: 900, 
                        bgcolor: alpha('#10b981', 0.15), 
                        color: '#10b981', 
                        border: '1px solid currentColor' 
                      }} 
                    />
                  )}
                </Box>
              </TableCell>
              <TableCell sx={{ fontSize: '0.78rem', fontWeight: 600 }}>{c.apto || '—'}</TableCell>
              <TableCell>
                <Chip
                  label={c.esp || '—'}
                  size="small"
                  sx={{
                    fontSize: '0.65rem', fontWeight: 700,
                    bgcolor: c.esp === 'NP' ? alpha('#6366f1', 0.15) : alpha('#f59e0b', 0.15),
                    color: c.esp === 'NP' ? '#818cf8' : '#f59e0b',
                    border: `1px solid ${c.esp === 'NP' ? alpha('#6366f1', 0.3) : alpha('#f59e0b', 0.3)}`,
                  }}
                />
              </TableCell>
              <TableCell>
                <Chip
                  label={c.elemento || '—'}
                  size="small"
                  sx={{
                    fontSize: '0.65rem', fontWeight: 700,
                    bgcolor: c.elemento === 'BAN' ? alpha('#0ea5e9', 0.15) : alpha('#ec4899', 0.15),
                    color: c.elemento === 'BAN' ? '#38bdf8' : '#f472b6',
                    border: `1px solid ${c.elemento === 'BAN' ? alpha('#0ea5e9', 0.3) : alpha('#ec4899', 0.3)}`,
                  }}
                />
              </TableCell>
              <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.78rem' }}>{c.parcela || '—'}</TableCell>
              <TableCell sx={{ fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {isFuture && <ScheduleIcon sx={{ fontSize: 12, color: '#10b981' }} />}
                  {fmtDate(c.vencimento)}
                </Box>
              </TableCell>
              {!isFuture && (
                <TableCell>
                  <AtrasoChip dias={c.atraso} />
                </TableCell>
              )}
              <TableCell sx={{ fontSize: '0.78rem', fontWeight: 600 }}>{fmt(c.principal)}</TableCell>
              <TableCell sx={{ fontSize: '0.78rem', color: c.jurosMora > 0 ? '#f59e0b' : 'text.secondary' }}>
                {fmt(c.jurosMora)}
              </TableCell>
              <TableCell sx={{ fontSize: '0.78rem', color: c.multa > 0 ? '#ef4444' : 'text.secondary' }}>
                {fmt(c.multa)}
              </TableCell>
              <TableCell sx={{ fontSize: '0.82rem', fontWeight: 800, color: isFuture ? '#10b981' : theme.palette.primary.main, whiteSpace: 'nowrap' }}>
                {fmt(c.total)}
              </TableCell>
              <TableCell>
                <Tooltip title={c.status === 'pago' ? "Parcela já paga" : (String(c._id).startsWith('r-') ? "Dados de exemplo não permitem baixa" : "Confirmar Pagamento")}>
                  <span>
                    <IconButton 
                      size="small" 
                      color={c.status === 'pago' ? "success" : "default"}
                      onClick={() => onPay(c)}
                      disabled={isPaying || String(c._id).startsWith('r-') || c.status === 'pago'}
                      sx={{ 
                        bgcolor: c.status === 'pago' ? alpha('#10b981', 0.2) : alpha('#10b981', 0.1),
                        '&:hover': { bgcolor: alpha('#10b981', 0.2) },
                        opacity: (String(c._id).startsWith('r-') && c.status !== 'pago') ? 0.3 : 1
                      }}
                    >
                      {c.status === 'pago' ? <CheckCircleIcon sx={{ fontSize: 18, color: '#10b981' }} /> : <CheckCircleIcon sx={{ fontSize: 18 }} />}
                    </IconButton>
                  </span>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

// ─── Modal principal ───────────────────────────────────────────────────────────
export default function DebtorDetailModal({ open, onClose, debtor }) {
  const theme = useTheme();
  const [tab, setTab] = useState(0);
  const [exportOpen, setExportOpen] = useState(false);
  const [exportType, setExportType] = useState('ultimo');
  const [isExporting, setIsExporting] = useState(false);
  const [isPayingAll, setIsPayingAll] = useState(false);
  const queryClient = useQueryClient();

  // Mutação para pagar uma parcela individual
  const payMutation = useMutation(
    (charge) => api.post('/debts/payment', {
      installmentId: charge._id, // Assumindo que o ID do lançamento no mock/db é _id
      amount: charge.total,
      paymentMethod: 'transfer'
    }),
    {
      onSuccess: () => {
        toast.success('Pagamento confirmado!');
        queryClient.invalidateQueries(['debts-by-month']);
        queryClient.invalidateQueries(['dashboard-stats']);
        queryClient.invalidateQueries(['debtors-summary']);
      },
      onError: (err) => {
        toast.error(err.response?.data?.message || 'Erro ao processar pagamento.');
      }
    }
  );

  const handlePayAll = async () => {
    if (!window.confirm(`Deseja realmente quitar TODAS as ${vencidas.length + futuras.length} parcelas deste devedor?`)) return;
    
    setIsPayingAll(true);
    try {
      await api.post(`/debts/lead/${debtor._id}/pay-all`);
      toast.success('Dívida quitada com sucesso!');
      queryClient.invalidateQueries(['debts-by-month']);
      queryClient.invalidateQueries(['dashboard-stats']);
      queryClient.invalidateQueries(['debtors-summary']);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erro ao quitar dívida.');
    } finally {
      setIsPayingAll(false);
    }
  };

  const today = useMemo(() => new Date(), []);

  const vencidas = useMemo(
    () => (debtor?.charges || []).filter((c) => new Date(c.vencimento) <= today),
    [debtor, today]
  );
  const futuras = useMemo(
    () => (debtor?.charges || []).filter((c) => new Date(c.vencimento) > today),
    [debtor, today]
  );
  const contactItems = useMemo(() => {
    const items = [];
    const seen = new Set();
    const addPhone = (value, label) => {
      const normalized = normalizeContactValue(value);
      if (!normalized || seen.has(normalized)) return;
      seen.add(normalized);
      items.push({ type: 'phone', value, label });
    };

    addPhone(debtor?.telefone1, 'Telefone 1');
    addPhone(debtor?.telefone2, 'Telefone 2');
    (debtor?.contacts || []).forEach((contact) => {
      if (contact?.type === 'phone') {
        addPhone(contact.value, contact.label || 'Telefone importado');
        return;
      }
      if (!contact?.value) return;
      const key = `${contact.type || 'contact'}:${contact.value}`;
      if (seen.has(key)) return;
      seen.add(key);
      items.push(contact);
    });

    return items;
  }, [debtor]);

  const handleExport = async () => {
    if (!debtor?._id) return;
    setIsExporting(true);
    try {
      const res = await api.get(`/spreadsheets/export/debtors?type=${exportType}&leadId=${debtor._id}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Relatorio_${debtor.cliente.replace(/\s/g, '_')}_${format(new Date(), 'ddMMyyyy')}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setExportOpen(false);
      toast.success('PDF gerado com sucesso!');
    } catch (err) {
      toast.error('Erro ao gerar o relatório.');
    } finally {
      setIsExporting(false);
    }
  };

  if (!debtor) return null;

  const initials = debtor.cliente
    ?.split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase() || '??';

  const avatarColor = ['#6366f1', '#8b5cf6', '#ec4899', '#0ea5e9', '#10b981'][
    debtor.cpfCnpj?.charCodeAt(0) % 5 || 0
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          ...getDialogPaperSx(theme, avatarColor),
        },
      }}
    >
      {/* ─── Header ─── */}
      <Box
        sx={{
          px: 3, py: 2.5,
          backgroundColor: alpha(theme.palette.background.paper, theme.palette.mode === 'dark' ? 0.35 : 0.9),
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2.5, justifyContent: 'space-between' }}>
          {/* Avatar + dados pessoais */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <Avatar
              sx={{
                width: 56, height: 56, fontWeight: 800, fontSize: '1.2rem',
                background: `linear-gradient(135deg, ${avatarColor}, ${alpha(avatarColor, 0.6)})`,
                boxShadow: `0 4px 16px ${alpha(avatarColor, 0.4)}`,
                flexShrink: 0,
              }}
            >
              {initials}
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={800} sx={{ lineHeight: 1.2, mb: 0.25 }}>
                {debtor.cliente}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace', mb: 0.5 }}>
                CPF/CNPJ: {debtor.cpfCnpj}
              </Typography>
              {debtor.profissao && (
                <Chip
                  label={debtor.profissao}
                  size="small"
                  icon={<PersonIcon style={{ fontSize: 12 }} />}
                  sx={{ fontSize: '0.68rem', bgcolor: alpha(avatarColor, 0.15), color: avatarColor, border: `1px solid ${alpha(avatarColor, 0.3)}` }}
                />
              )}
            </Box>
          </Box>
          <IconButton onClick={onClose} size="small" sx={{ color: 'text.secondary', mt: -0.5 }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Linha de contato */}
        <Box sx={{ display: 'flex', gap: 3, mt: 1.5, flexWrap: 'wrap' }}>
          {debtor.enderecoResidencial && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <HomeIcon sx={{ fontSize: 13, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">{debtor.enderecoResidencial}</Typography>
            </Box>
          )}
          {contactItems.map((contact, index) => (
            <Box key={`${contact.type || 'contact'}-${contact.value}-${index}`} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {contact.type === 'phone' && <PhoneIcon sx={{ fontSize: 13, color: 'text.secondary' }} />}
              <Typography variant="caption" color="text.secondary">
                {contact.type === 'phone' ? fmtPhone(contact.value) : contact.value}
                {contact.label ? ` (${contact.label})` : ''}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Info de contrato / empreendimento */}
        <Box sx={{ display: 'flex', gap: 2, mt: 1, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <BankIcon sx={{ fontSize: 13, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              {debtor.empreendimento}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <ReceiptIcon sx={{ fontSize: 13, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              Contrato: <strong>{debtor.contrato}</strong>
              {debtor.apto ? ` | Apto: ${debtor.apto}` : ''}
            </Typography>
          </Box>
          {debtor.dataNascimento && (
            <Typography variant="caption" color="text.secondary">
              Nasc.: {fmtDate(debtor.dataNascimento)}
            </Typography>
          )}
        </Box>
      </Box>

      {/* ─── KPIs ─── */}
      <Box sx={{ px: 3, py: 2, display: 'flex', gap: 1.5, flexWrap: 'wrap', borderBottom: `1px solid ${theme.palette.divider}` }}>
        <MiniKpi
          label="Total Geral"
          value={fmt(debtor.totalGeral)}
          color="#6366f1"
          icon={<TrendingUpIcon />}
          sub={`${debtor.charges?.length || 0} lançamentos`}
        />
        <MiniKpi
          label="Vencido"
          value={fmt(debtor.totalVencido)}
          color="#ef4444"
          icon={<WarningIcon />}
          sub={`${vencidas.length} parcelas`}
        />
        <MiniKpi
          label="A Vencer"
          value={fmt(debtor.totalFuturo)}
          color="#10b981"
          icon={<CheckCircleIcon />}
          sub={`${futuras.length} parcelas`}
        />
      </Box>

      {/* ─── Tabs ─── */}
      <Box sx={{ px: 3, borderBottom: `1px solid ${theme.palette.divider}` }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{
            '& .MuiTab-root': { fontWeight: 700, fontSize: '0.82rem', textTransform: 'none', minHeight: 44 },
            '& .MuiTabs-indicator': {
              background: tab === 0
                ? 'linear-gradient(90deg, #ef4444, #f97316)'
                : 'linear-gradient(90deg, #10b981, #059669)',
              height: 3, borderRadius: 2,
            },
          }}
        >
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <HistoryIcon sx={{ fontSize: 16, color: tab === 0 ? '#ef4444' : 'inherit' }} />
                Histórico / Vencidos
                <Chip label={vencidas.length} size="small" sx={{ height: 18, fontSize: '0.65rem', fontWeight: 700, bgcolor: alpha('#ef4444', 0.2), color: '#ef4444' }} />
              </Box>
            }
          />
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <FutureIcon sx={{ fontSize: 16, color: tab === 1 ? '#10b981' : 'inherit' }} />
                Lançamentos Futuros
                <Chip label={futuras.length} size="small" sx={{ height: 18, fontSize: '0.65rem', fontWeight: 700, bgcolor: alpha('#10b981', 0.2), color: '#10b981' }} />
              </Box>
            }
          />
        </Tabs>
      </Box>

      {/* ─── Conteúdo das abas ─── */}
      <DialogContent sx={{ p: 0, pb: 0 }}>
        {/* Banner de contexto */}
        {tab === 0 ? (
          <Box sx={{ px: 3, py: 1.5, bgcolor: alpha('#ef4444', 0.06), borderBottom: `1px solid ${alpha('#ef4444', 0.12)}` }}>
            <Typography variant="caption" sx={{ color: '#f87171', fontWeight: 600 }}>
              Parcelas com vencimento já ultrapassado — exibindo principais, juros e multas acumulados.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ px: 3, py: 1.5, bgcolor: alpha('#10b981', 0.06), borderBottom: `1px solid ${alpha('#10b981', 0.12)}` }}>
            <Typography variant="caption" sx={{ color: '#34d399', fontWeight: 600 }}>
              Lançamentos com vencimento futuro — sem encargos (valores base do contrato).
            </Typography>
          </Box>
        )}

        <Box sx={{ p: 2.5 }}>
          {tab === 0 && <ChargesTable charges={vencidas} isFuture={false} onPay={payMutation.mutate} isPaying={payMutation.isLoading} />}
          {tab === 1 && <ChargesTable charges={futuras} isFuture={true} onPay={payMutation.mutate} isPaying={payMutation.isLoading} />}
        </Box>
      </DialogContent>

      {/* ─── Footer ─── */}
      <DialogActions sx={{ px: 3, py: 1.5, borderTop: `1px solid ${theme.palette.divider}`, gap: 1 }}>
        <Button
          variant="outlined"
          color="success"
          startIcon={<DownloadIcon />}
          size="small"
          onClick={() => setExportOpen(true)}
          sx={{ borderRadius: 2, fontSize: '0.78rem', fontWeight: 700, borderColor: alpha('#10b981', 0.4) }}
        >
          Exportar Relatório
        </Button>
        <Button
          variant="contained"
          color="success"
          startIcon={isPayingAll ? <CircularProgress size={16} color="inherit" /> : <CheckCircleIcon />}
          size="small"
          onClick={handlePayAll}
          disabled={isPayingAll || (vencidas.length === 0 && futuras.length === 0) || String(debtor?._id).startsWith('r-')}
          sx={{ 
            borderRadius: 2, 
            fontSize: '0.78rem', 
            fontWeight: 800,
            background: `linear-gradient(135deg, ${theme.palette.success.main}, #059669)`,
            boxShadow: `0 4px 12px ${alpha(theme.palette.success.main, 0.4)}`,
            '&:hover': {
              background: `linear-gradient(135deg, #059669, ${theme.palette.success.main})`,
              boxShadow: `0 6px 20px ${alpha(theme.palette.success.main, 0.5)}`,
            }
          }}
        >
          Quitar Tudo
        </Button>
        <Box sx={{ flex: 1 }} />
        <Button onClick={onClose} sx={{ borderRadius: 2 }}>Fechar</Button>
      </DialogActions>

      {/* Modal Interno de Opções de Exportação */}
      <Dialog 
        open={exportOpen} 
        onClose={() => !isExporting && setExportOpen(false)}
        PaperProps={{ sx: getDialogPaperSx(theme, theme.palette.success.main) }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: '#10b981' }}>Configurações do Relatório</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
            Escolha como o histórico de cobrança deste devedor será apresentado:
          </Typography>
          <FormControl component="fieldset">
            <RadioGroup value={exportType} onChange={(e) => setExportType(e.target.value)}>
              <FormControlLabel 
                value="ultimo" 
                control={<Radio color="success" />} 
                label={<Typography sx={{fontWeight:600}}>Resumido (Apenas Último Status)</Typography>} 
              />
              <FormControlLabel 
                value="completo" 
                control={<Radio color="success" />} 
                label={<Typography sx={{fontWeight:600}}>Detalhado (Histórico por Datas)</Typography>} 
              />
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setExportOpen(false)} disabled={isExporting} color="inherit">Cancelar</Button>
          <Button 
            variant="contained" 
            color="success" 
            onClick={handleExport} 
            disabled={isExporting}
            startIcon={isExporting ? <CircularProgress size={16} color="inherit" /> : <DownloadIcon />}
            sx={{ borderRadius: 2, fontWeight: 700, px: 3 }}
          >
            {isExporting ? 'Processando...' : 'Exportar PDF'}
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
}
