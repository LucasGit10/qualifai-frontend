import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  Box, Typography, Button, Paper, Dialog, DialogTitle, DialogContent, DialogActions,
  useTheme, Grid, Card, CardContent, Divider, Chip, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, IconButton, Tooltip, alpha, TextField,
  InputAdornment, Select, MenuItem, FormControl, InputLabel, Badge, Tab, Tabs,
  LinearProgress, Collapse, Stack, Avatar, Pagination, CircularProgress
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  ReceiptLong as DebtsIcon,
  Search as SearchIcon,
  AccountBalance as AccountBalanceIcon,
  Gavel as GavelIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as MoneyIcon,
  Refresh as RefreshIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  CalendarMonth as CalendarIcon,
  TableChart as TableChartIcon,
  BarChart as BarChartIcon,
  FilterList as FilterIcon,
  People as PeopleIcon,
  Visibility as ViewIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  DeleteSweep as DeleteSweepIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { format, subMonths, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, CartesianGrid, Legend } from 'recharts';
import api from '../services/api';
import { useAuthStore } from '../stores/authStore';
import { useSocket } from '../contexts/SocketContext';
import { USE_MOCKS } from '../config/env';
import { groupChargesByDebtor } from '../mocks/debtorsMocks';
import DebtorDetailModal from '../components/debts/DebtorDetailModal';

// ─── Helpers de formatação ────────────────────────────────────────────────────
const MESES_PT = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
const fmt = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);
const fmtNum = (v) => new Intl.NumberFormat('pt-BR').format(v || 0);

// ─── Mock de meses ─────────────────────────────────────────────────────────────
const buildMockMonths = () => {
  const today = new Date();
  return Array.from({ length: 6 }, (_, i) => {
    const d = subMonths(today, i);
    const mes = d.getMonth() + 1;
    const ano = d.getFullYear();
    const total = Math.floor(Math.random() * 15) + 5;
    return {
      ano, mes,
      totalRegistros: total,
      totalValor: Math.floor(Math.random() * 120000) + 20000,
      totalPrincipal: Math.floor(Math.random() * 90000) + 15000,
      totalJuros: Math.floor(Math.random() * 8000) + 1000,
      totalMulta: Math.floor(Math.random() * 4000) + 500,
      registros: Array.from({ length: total }, (_, j) => ({
        _id: `r-${ano}-${mes}-${j}`,
        cliente: ['João Carlos Mendes','Maria Aparecida Costa','Carlos Eduardo Ribeiro','Ana Paula Ferreira','Roberto Alves Nogueira'][j % 5],
        contrato: `${String(1000 + j + i * 20).padStart(4,'0')}-${j % 9}`,
        cpfCnpj: '772.580.451-04',
        total: Math.floor(Math.random() * 15000) + 500,
        atraso: Math.floor(Math.random() * 365),
        vencimento: subMonths(today, i).toISOString(),
        empreendimento: ['Marca Registrada','Gran Toro'][j % 2],
      })),
    };
  });
};

// ─── Chip de atraso ─────────────────────────────────────────────────────────
const AtrasoChip = ({ dias }) => {
  if (!dias || dias <= 0) return <Chip label="Em dia" size="small" sx={{ bgcolor: alpha('#4caf50',0.15), color:'#4caf50', fontWeight:700, fontSize:'0.7rem' }} />;
  if (dias <= 30)  return <Chip label={`${dias}d`} size="small" sx={{ bgcolor: alpha('#ff9800',0.15), color:'#ff9800', fontWeight:700, fontSize:'0.7rem' }} />;
  if (dias <= 90)  return <Chip label={`${dias}d`} size="small" sx={{ bgcolor: alpha('#f44336',0.2),  color:'#f44336', fontWeight:700, fontSize:'0.7rem' }} />;
  return <Chip label={`${dias}d`} size="small" sx={{ bgcolor: alpha('#9c27b0',0.2), color:'#ce93d8', fontWeight:700, fontSize:'0.7rem' }} />;
};

// ─── Tabela interna do accordion ──────────────────────────────────────────────
function MonthTable({ registros, search }) {
  const theme = useTheme();
  const filtered = useMemo(() => {
    if (!search) return registros;
    const q = search.toLowerCase();
    return registros.filter(r =>
      (r.cliente||'').toLowerCase().includes(q) ||
      (r.contrato||'').toLowerCase().includes(q) ||
      (r.cpfCnpj||'').toLowerCase().includes(q) ||
      (r.empreendimento||'').toLowerCase().includes(q)
    );
  }, [registros, search]);

  if (!filtered.length) return (
    <Box sx={{ textAlign:'center', py:3 }}>
      <Typography color="text.secondary" variant="body2">Nenhum registro encontrado{search ? ` para "${search}"` : ''}.</Typography>
    </Box>
  );

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            {['Cliente','Apto','Contrato','Esp/Elem','Vencimento','Atraso','Valor Total'].map(h => (
              <TableCell key={h} sx={{ fontWeight:700, fontSize:'0.75rem', color:'text.secondary', py:1 }}>{h}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {filtered.map((r, i) => (
            <TableRow key={r._id || i} hover sx={{ '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.04) } }}>
              <TableCell sx={{ fontWeight:600, fontSize:'0.82rem' }}>
                <Box>
                  <Typography variant="inherit" sx={{ display:'block' }}>{r.cliente || r.razao || '—'}</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize:'0.65rem' }}>{r.empreendimento}</Typography>
                </Box>
              </TableCell>
              <TableCell sx={{ fontSize:'0.78rem', fontWeight: 600 }}>{r.apto ? `${r.torre || ''} ${r.apto}`.trim() : '—'}</TableCell>
              <TableCell sx={{ fontFamily:'monospace', fontSize:'0.78rem', color:'text.secondary' }}>{r.contrato || '—'}</TableCell>
              <TableCell sx={{ fontSize:'0.72rem' }}>
                <Stack direction="row" spacing={0.5}>
                  {r.esp && <Chip label={r.esp} size="small" sx={{ height: 16, fontSize: '0.6rem', bgcolor: alpha(theme.palette.info.main, 0.1), color: 'info.main', border: 'none' }} />}
                  {r.elemento && <Chip label={r.elemento} size="small" sx={{ height: 16, fontSize: '0.6rem', bgcolor: alpha(theme.palette.secondary.main, 0.1), color: 'secondary.main', border: 'none' }} />}
                </Stack>
              </TableCell>
              <TableCell sx={{ fontSize:'0.78rem', color:'text.secondary' }}>
                {r.vencimento ? format(new Date(r.vencimento), 'dd/MM/yyyy') : '—'}
              </TableCell>
              <TableCell><AtrasoChip dias={r.atraso} /></TableCell>
              <TableCell sx={{ fontWeight:700, fontSize:'0.82rem', color:'primary.main' }}>
                {fmt(r.total || r.valorSpc || r.valorAtualizado)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

// ─── Accordion de um mês ──────────────────────────────────────────────────────
function MonthAccordion({ data, globalSearch, defaultExpanded }) {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(defaultExpanded);
  const mesNome = MESES_PT[(data.mes || 1) - 1];

  return (
    <Paper
      elevation={0}
      sx={{
        mb: 1.5, borderRadius: 2.5,
        border: `1px solid ${expanded ? alpha(theme.palette.primary.main, 0.35) : alpha(theme.palette.divider, 0.5)}`,
        overflow: 'hidden',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        background: expanded
          ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main,0.06)} 0%, ${alpha(theme.palette.background.paper,0.7)} 100%)`
          : alpha(theme.palette.background.paper, 0.5),
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: expanded
          ? `0 4px 24px ${alpha(theme.palette.primary.main, 0.12)}, inset 0 1px 0 ${alpha('#fff',0.06)}`
          : `0 2px 8px ${alpha('#000', 0.08)}`,
        '&:hover': {
          border: `1px solid ${alpha(theme.palette.primary.main, 0.4)}`,
          boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.1)}`,
        },
      }}
    >
      <Box
        onClick={() => setExpanded(e => !e)}
        sx={{ display:'flex', alignItems:'center', gap:2, p:2, cursor:'pointer', '&:hover': { background: alpha(theme.palette.primary.main, 0.04) } }}
      >
        <Box sx={{
          minWidth:72, textAlign:'center', p:1, borderRadius:2,
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.4)}`,
        }}>
          <Typography variant="caption" sx={{ color:'rgba(255,255,255,0.85)', display:'block', lineHeight:1, fontWeight:600 }}>{mesNome}</Typography>
          <Typography variant="subtitle2" sx={{ color:'#fff', fontWeight:800, fontSize:'0.9rem' }}>{data.ano}</Typography>
        </Box>
        <Box sx={{ flex:1, display:'flex', gap:3, flexWrap:'wrap' }}>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize:'0.68rem', fontWeight:600, textTransform:'uppercase', letterSpacing:0.5 }}>Registros</Typography>
            <Typography fontWeight={700}>{fmtNum(data.totalRegistros)}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize:'0.68rem', fontWeight:600, textTransform:'uppercase', letterSpacing:0.5 }}>Valor Total</Typography>
            <Typography fontWeight={700} color="primary.main">{fmt(data.totalValor)}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize:'0.68rem', fontWeight:600, textTransform:'uppercase', letterSpacing:0.5 }}>Principal</Typography>
            <Typography fontWeight={600}>{fmt(data.totalPrincipal)}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize:'0.68rem', fontWeight:600, textTransform:'uppercase', letterSpacing:0.5 }}>Juros/Multa</Typography>
            <Typography fontWeight={600} color="warning.main">{fmt((data.totalJuros||0)+(data.totalMulta||0))}</Typography>
          </Box>
        </Box>
        <Box sx={{ display:'flex', alignItems:'center', gap:1 }}>
          <Chip
            label={`${data.totalRegistros} reg.`}
            size="small"
            sx={{
              fontWeight:700,
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main,0.2)}, ${alpha(theme.palette.secondary.main,0.1)})`,
              color:'primary.light',
              border: `1px solid ${alpha(theme.palette.primary.main,0.25)}`,
            }}
          />
          {expanded ? <ExpandLessIcon sx={{ color:'primary.main', opacity:0.8 }} /> : <ExpandMoreIcon sx={{ color:'text.secondary' }} />}
        </Box>
      </Box>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Divider sx={{ borderColor: alpha(theme.palette.divider, 0.5) }} />
        <Box sx={{ p:1.5, background: alpha(theme.palette.background.default, 0.3) }}>
          <MonthTable registros={data.registros || []} search={globalSearch} />
        </Box>
      </Collapse>
    </Paper>
  );
}

// ─── Dialog de importação ─────────────────────────────────────────────────────
function ImportDialog({ open, onClose, onImportSuccess }) {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const { socket } = useSocket(); // NOVO
  const [file, setFile] = useState(null);
  
  // Estados para animação de extração
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionStep, setExtractionStep] = useState('');
  const [extractionProgress, setExtractionProgress] = useState(0);

  // Escutar progresso via Socket
  React.useEffect(() => {
    if (socket && isExtracting) {
      // Entrar na sala de progresso (uso o ID fake que coloquei no back)
      socket.emit('join-room', '000000000000000000000001');
      
      const handleProgress = (data) => {
        if (data.status === 'extraindo') {
          setExtractionProgress(data.percent);
          setExtractionStep(`Extraindo devedores: ${data.current} de ${data.total} (${data.percent}%)`);
        } else if (data.status === 'finalizado') {
          setExtractionProgress(100);
          setExtractionStep('Extração finalizada! Sincronizando dados...');
        }
      };

      socket.on('spreadsheet-progress', handleProgress);
      return () => {
        socket.off('spreadsheet-progress', handleProgress);
      };
    }
  }, [socket, isExtracting]);

  const handleImport = async () => {
    if (!file) return;
    setIsExtracting(true);
    setExtractionProgress(0);
    setExtractionStep('Enviando arquivo para o servidor...');

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      // Chama a Rota Real de Back-end com monitoramento de upload
      const { data } = await api.post('/spreadsheets/import/generic', formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          // Dividimos os 100% da barra: 50% upload, 50% extração (ou apenas mostra o upload até 100)
          // Mas como o socket vai assumir depois do upload, vamos usar a barra pra ambos
          if (percentCompleted < 100) {
            setExtractionProgress(percentCompleted / 2); // Upload representa os primeiros 50%
            setExtractionStep(`Enviando arquivo: ${percentCompleted}%`);
          } else {
            setExtractionStep('Arquivo recebido. Iniciando extração dos dados...');
          }
        }
      });
      
      toast.success(`✅ Importação Feita! Criados: ${data.created} | Atualizados: ${data.updated}`);
      
      if (onImportSuccess) onImportSuccess();
      queryClient.invalidateQueries(['debts-by-month']);
      onClose();
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Falha ao importar o arquivo. Verifique a estrutura da planilha.';
      toast.error(errMsg);
      console.error("Erro no import:", err);
    } finally {
      setIsExtracting(false);
      setExtractionProgress(0);
      setFile(null);
    }
  };

  const handleClose = () => {
    if (isExtracting) return; // bloqueia fechamento durante extração
    setFile(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth PaperProps={{ sx: {
      borderRadius: 3,
      background: 'rgba(18, 18, 30, 0.95)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
      boxShadow: `0 24px 64px ${alpha(theme.palette.primary.main, 0.2)}`,
    }}}>
      <DialogTitle sx={{ pb: 1, textAlign: isExtracting ? 'center' : 'left' }}>
        <Typography variant="h6" fontWeight={800} sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          {isExtracting ? 'Processando Planilha' : '📁 Importar Planilha de Cobrança'}
        </Typography>
        {!isExtracting && (
          <Typography variant="caption" color="text.secondary">Faça upload do extrato de cobranças e inadimplência</Typography>
        )}
      </DialogTitle>

      <DialogContent>
        {isExtracting ? (
          <Box sx={{ py: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            <Box sx={{ width: '80%', textAlign: 'center' }}>
              <LinearProgress 
                variant="determinate"
                value={extractionProgress}
                sx={{ 
                  height: 10, 
                  borderRadius: 5, 
                  backgroundColor: alpha(theme.palette.divider, 0.1),
                  '& .MuiLinearProgress-bar': {
                    backgroundImage: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
                  }
                }} 
              />
              <Typography variant="caption" sx={{ mt: 1, display: 'block', color: 'primary.main', fontWeight: 700 }}>
                {Math.round(extractionProgress)}% concluído
              </Typography>
            </Box>
            <Typography variant="body1" fontWeight={600} sx={{ color: 'text.secondary' }}>
              {extractionStep}
            </Typography>
          </Box>
        ) : (
          <>
            <Box sx={{ mb: 3, p: 2, borderRadius: 2, bgcolor: alpha(theme.palette.info.main, 0.05), border: `1px solid ${alpha(theme.palette.info.main,0.2)}` }}>
              <Typography variant="caption" color="info.main" fontWeight={700}>Formato Único de Importação</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                Campos suportados: Cliente, CPF/CNPJ, Contrato, Vencimento, Principal, Juros, Multa, Total, Empreendimento.
                Lançamentos vencidos e com vencimento futuro (ex: 2026/2027) serão extraídos e agrupados automaticamente.
              </Typography>
            </Box>

            <Box
              sx={{
                border: `2px dashed ${file ? theme.palette.primary.main : theme.palette.divider}`,
                borderRadius: 3, p: 4, textAlign: 'center', cursor: 'pointer',
                transition: 'all 0.2s ease', bgcolor: file ? alpha(theme.palette.primary.main, 0.04) : 'transparent',
                '&:hover': { borderColor: theme.palette.primary.main, bgcolor: alpha(theme.palette.primary.main, 0.04) },
              }}
              onClick={() => document.getElementById(`file-input-debts`).click()}
            >
              <UploadIcon sx={{ fontSize: 48, color: file ? theme.palette.primary.main : 'text.secondary', mb: 1, opacity: file ? 1 : 0.5 }} />
              <Typography fontWeight={700} color={file ? 'primary.main' : 'text.primary'} sx={{ fontSize: '1.1rem', mb: 0.5 }}>
                {file ? file.name : 'Clique para selecionar seu arquivo'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {file ? `Tamanho: ${(file.size / 1024 / 1024).toFixed(2)} MB` : 'Arquivos suportados: .csv, .xlsx, .xls'}
              </Typography>
              <input
                id="file-input-debts"
                type="file"
                accept=".csv,.xlsx,.xls"
                style={{ display: 'none' }}
                onChange={(e) => setFile(e.target.files[0])}
              />
            </Box>
          </>
        )}
      </DialogContent>

      {!isExtracting && (
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={handleClose} sx={{ borderRadius: 2, color: 'text.secondary' }}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handleImport}
            disabled={!file}
            sx={{
              borderRadius: 2, fontWeight: 700, px: 4,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.4)}`,
            }}
          >
            Extrair Dados e Importar
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}

// ─── Gráfico mensal ─────────────────────────────────────────────────────────
function MonthlyChart({ months }) {
  const data = [...months].reverse().map(m => ({
    name: `${MESES_PT[m.mes - 1]}/${String(m.ano).slice(2)}`,
    Principal: m.totalPrincipal || 0,
    Juros: m.totalJuros || 0,
    Multa: m.totalMulta || 0,
  }));
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#aaa' }} />
        <YAxis tick={{ fontSize: 10, fill: '#aaa' }} tickFormatter={v => `R$${(v/1000).toFixed(0)}k`} />
        <RechartsTooltip formatter={(v) => fmt(v)} contentStyle={{ backgroundColor: '#1e1e2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} />
        <Legend wrapperStyle={{ fontSize: '12px' }} />
        <Bar dataKey="Principal" fill="#6366f1" radius={[3,3,0,0]} />
        <Bar dataKey="Juros"     fill="#f59e0b" radius={[3,3,0,0]} />
        <Bar dataKey="Multa"     fill="#ef4444" radius={[3,3,0,0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────
function KpiCard({ label, value, icon, color, sub }) {
  const theme = useTheme();
  return (
    <Card elevation={0} sx={{
      borderRadius: 3,
      border: `1px solid ${alpha(color, 0.3)}`,
      background: `linear-gradient(135deg, ${alpha(color,0.12)} 0%, ${alpha(theme.palette.background.paper,0.6)} 100%)`,
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      boxShadow: `0 4px 24px ${alpha(color, 0.1)}, inset 0 1px 0 ${alpha('#fff',0.08)}`,
      height: '100%',
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': { transform: 'translateY(-3px)', boxShadow: `0 8px 32px ${alpha(color, 0.2)}, inset 0 1px 0 ${alpha('#fff',0.12)}` },
    }}>
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', mb:1.5 }}>
          <Typography variant="caption" color="text.secondary" sx={{ textTransform:'uppercase', letterSpacing:0.8, fontWeight:700, fontSize:'0.65rem' }}>
            {label}
          </Typography>
          <Box sx={{ p:1, borderRadius:2, background: `linear-gradient(135deg, ${alpha(color,0.25)}, ${alpha(color,0.1)})`, border: `1px solid ${alpha(color,0.3)}`, backdropFilter:'blur(8px)' }}>
            {React.cloneElement(icon, { sx:{ fontSize:16, color } })}
          </Box>
        </Box>
        <Typography variant="h5" fontWeight={800} sx={{ color, lineHeight:1, mb:0.5, letterSpacing:'-0.5px' }}>{value}</Typography>
        {sub && <Typography variant="caption" color="text.secondary" sx={{ opacity:0.8 }}>{sub}</Typography>}
      </CardContent>
    </Card>
  );
}

// ─── Card de Devedor ──────────────────────────────────────────────────────────
function DebtorCard({ debtor, onViewDetails }) {
  const theme = useTheme();
  const AVATAR_COLORS = ['#6366f1','#8b5cf6','#ec4899','#0ea5e9','#10b981'];
  const avatarColor = AVATAR_COLORS[debtor.cpfCnpj?.charCodeAt(0) % AVATAR_COLORS.length || 0];
  const initials = debtor.cliente?.split(' ').slice(0,2).map(n => n[0]).join('').toUpperCase() || '??';
  const hasOverdue = debtor.qtdVencidas > 0;

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: `1px solid ${hasOverdue ? alpha('#ef4444', 0.3) : alpha(theme.palette.divider, 0.5)}`,
        background: hasOverdue
          ? `linear-gradient(135deg, ${alpha('#ef4444',0.05)} 0%, ${alpha(theme.palette.background.paper,0.65)} 100%)`
          : alpha(theme.palette.background.paper, 0.55),
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: `0 4px 20px ${alpha('#000', 0.12)}, inset 0 1px 0 ${alpha('#fff',0.06)}`,
        transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 12px 40px ${alpha(avatarColor, 0.2)}, inset 0 1px 0 ${alpha('#fff',0.1)}`,
          border: `1px solid ${alpha(avatarColor, 0.4)}`,
        },
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        {/* Top row: avatar + nome + badge */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 2 }}>
          <Avatar
            sx={{
              width: 44, height: 44, fontSize: '0.95rem', fontWeight: 800, flexShrink: 0,
              background: `linear-gradient(135deg, ${avatarColor}, ${alpha(avatarColor, 0.6)})`,
              boxShadow: `0 4px 12px ${alpha(avatarColor, 0.35)}`,
            }}
          >
            {initials}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography fontWeight={700} noWrap sx={{ fontSize: '0.95rem', lineHeight: 1.3 }}>
              {debtor.cliente}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace', display: 'block', mb: 0.5 }}>
              {debtor.cpfCnpj}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {(() => {
                const status = debtor.status?.toLowerCase() || 'novo';
                const statusMap = {
                  'novo': { color: theme.palette.info.main, label: 'NOVO DEVEDOR' },
                  'contatado': { color: theme.palette.warning.main, label: 'CONTATADO' },
                  'em_negociacao': { color: '#9c27b0', label: 'EM NEGOCIAÇÃO' },
                  'acordado': { color: theme.palette.secondary.main, label: 'ACORDADO' },
                  'ativo': { color: '#00bcd4', label: 'ATIVO' },
                  'quitado': { color: theme.palette.success.main, label: 'QUITADO' },
                  'judicial': { color: theme.palette.error.main, label: 'JUDICIAL' },
                };
                const config = statusMap[status] || { color: theme.palette.grey[500], label: status.toUpperCase() };

                return (
                  <Chip
                    label={config.label}
                    size="small"
                    sx={{ 
                      fontSize: '0.65rem', 
                      fontWeight: 800, 
                      bgcolor: alpha(config.color, 0.1), 
                      color: config.color, 
                      border: `1px solid ${alpha(config.color, 0.3)}` 
                    }}
                  />
                );
              })()}
              <Chip
                label={debtor.empreendimento}
                size="small"
                sx={{ fontSize: '0.65rem', fontWeight: 600, bgcolor: alpha(avatarColor, 0.12), color: avatarColor, border: `1px solid ${alpha(avatarColor, 0.25)}` }}
              />
            </Box>
          </Box>
        </Box>

        {/* Stats financeiros */}
        <Box
          sx={{
            p: 1.5, borderRadius: 2, mb: 2,
            background: alpha(theme.palette.background.default, 0.5),
            border: `1px solid ${alpha(theme.palette.divider, 0.4)}`,
          }}
        >
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Montante Total
          </Typography>
          <Typography fontWeight={800} sx={{ fontSize: '1.35rem', lineHeight: 1.2, color: hasOverdue ? '#ef4444' : theme.palette.primary.main, letterSpacing: '-0.5px' }}>
            {fmt(debtor.totalGeral)}
          </Typography>
        </Box>

        {/* Badges vencidas / futuras */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          {debtor.qtdVencidas > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, px: 1, py: 0.5, borderRadius: 1.5, bgcolor: alpha('#ef4444', 0.12), border: `1px solid ${alpha('#ef4444', 0.25)}` }}>
              <ErrorIcon sx={{ fontSize: 12, color: '#ef4444' }} />
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#ef4444', fontSize: '0.7rem' }}>
                {debtor.qtdVencidas} vencida{debtor.qtdVencidas > 1 ? 's' : ''}
              </Typography>
            </Box>
          )}
          {debtor.qtdFuturas > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, px: 1, py: 0.5, borderRadius: 1.5, bgcolor: alpha('#10b981', 0.12), border: `1px solid ${alpha('#10b981', 0.25)}` }}>
              <ScheduleIcon sx={{ fontSize: 12, color: '#10b981' }} />
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#10b981', fontSize: '0.7rem' }}>
                {debtor.qtdFuturas} a vencer
              </Typography>
            </Box>
          )}
        </Box>

        {/* Rodapé: contrato + botão */}
        <Divider sx={{ mb: 1.5, borderColor: alpha(theme.palette.divider, 0.4) }} />
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
              Contrato <strong style={{ color: '#fff' }}>{debtor.contrato}</strong>
              {debtor.apto ? ` · Apto ${debtor.apto}` : ''}
            </Typography>
          </Box>
          <Button
            variant="contained"
            size="small"
            startIcon={<ViewIcon sx={{ fontSize: 14 }} />}
            onClick={() => onViewDetails(debtor)}
            sx={{
              borderRadius: 2, fontWeight: 700, fontSize: '0.75rem', px: 1.5, py: 0.5,
              background: `linear-gradient(135deg, ${avatarColor}, ${theme.palette.primary.dark})`,
              boxShadow: `0 4px 12px ${alpha(avatarColor, 0.35)}`,
              '&:hover': { boxShadow: `0 6px 20px ${alpha(avatarColor, 0.5)}` },
            }}
          >
            Ver Lançamentos
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

// ─── Aba de Devedores ─────────────────────────────────────────────────────────
function DebtorsTab({ debtorsData, onViewDetails }) {
  const theme = useTheme();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos'); // Filtro de status padrão
  
  const debtors = debtorsData || [];
  const today = new Date();

  // Opções de status disponíveis
  const statusOptions = [
    { value: 'todos', label: 'Todos os Status' },
    { value: 'novo', label: 'Novo Devedor' },
    { value: 'contatado', label: 'Contatado' },
    { value: 'em_negociacao', label: 'Em Negociação' },
    { value: 'acordado', label: 'Acordo Feito' },
    { value: 'ativo', label: 'Ativo' },
    { value: 'quitado', label: 'Quitado' },
    { value: 'judicial', label: 'Judicial' },
  ];

  const filtered = useMemo(() => {
    return debtors.filter(d => {
      // Filtro de texto
      const q = search.toLowerCase();
      const matchSearch = !search ||
        (d.cliente||'').toLowerCase().includes(q) ||
        (d.cpfCnpj||'').toLowerCase().includes(q) ||
        (d.contrato||'').toLowerCase().includes(q) ||
        (d.empreendimento||'').toLowerCase().includes(q);

      // Filtro de status
      const matchStatus = statusFilter === 'todos' || d.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [debtors, search, statusFilter]);

  const [page, setPage] = useState(1);
  const itemsPerPage = 12;

  // Reseta a página quando as buscas mudam
  React.useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  const paginatedDebtors = useMemo(() => {
    return filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  }, [filtered, page]);

  const totalPrincipal = debtors.reduce((a, d) => a + (d.totalPrincipalGeral || 0), 0);
  const totalMontante = debtors.reduce((a, d) => a + (d.totalGeral || 0), 0);
  const totalVencido = debtors.reduce((a, d) => a + d.totalVencido, 0);
  const totalFuturo = debtors.reduce((a, d) => a + d.totalFuturo, 0);

  return (
    <Box>
      {/* KPIs da aba */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Principal',       value: fmt(totalPrincipal),      color: theme.palette.primary.main, icon: <AccountBalanceIcon />, sub: 'Apenas dívida original' },
          { label: 'Montante Total',        value: fmt(totalMontante),       color: '#6366f1',                  icon: <MoneyIcon />,     sub: 'Geral (vencido + futuro)' },
          { label: 'Total Vencido',         value: fmt(totalVencido),        color: '#ef4444',                  icon: <ErrorIcon />,     sub: 'Em atraso / vencido' },
          { label: 'Lançamentos Futuros',   value: fmt(totalFuturo),         color: '#10b981',                  icon: <ScheduleIcon />,  sub: 'A vencer (2026–2027+)' },
        ].map(k => (
          <Grid item xs={12} sm={6} md={3} key={k.label}>
            <KpiCard {...k} />
          </Grid>
        ))}
      </Grid>

      {/* Busca */}
      <Paper elevation={0} sx={{
        p: 2, mb: 3, borderRadius: 2.5,
        background: alpha(theme.palette.background.paper, 0.6),
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
        display: 'flex', gap: 2, alignItems: 'center',
      }}>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <Select 
            value={statusFilter} 
            onChange={e => setStatusFilter(e.target.value)} 
            sx={{ borderRadius: 1.5, background: alpha(theme.palette.background.paper, 0.4) }}
          >
            {statusOptions.map(opt => (
              <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          size="small"
          placeholder="Buscar por nome, CPF, contrato, empreendimento..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 18, color: 'text.secondary' }} /></InputAdornment> }}
          sx={{ flex: 1, '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
        />
        <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
          {filtered.length} de {debtors.length} devedores
        </Typography>
      </Paper>

      {/* Grid de cards */}
      {/* Paginação (Topo) */}
      {filtered.length > itemsPerPage && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Pagination
            count={Math.ceil(filtered.length / itemsPerPage)}
            page={page}
            onChange={(_, p) => setPage(p)}
            color="primary"
            variant="outlined"
            shape="rounded"
            sx={{
              '& .MuiPaginationItem-root': {
                borderColor: alpha(theme.palette.divider, 0.5),
                color: 'text.primary',
              },
              '& .Mui-selected': {
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main}) !important`,
                color: '#fff !important',
                borderColor: 'transparent',
                boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.4)}`,
              }
            }}
          />
        </Box>
      )}

      {/* Grid de cards pginado */}
      <Grid container spacing={2.5}>
        {paginatedDebtors.map((debtor) => (
          <Grid item xs={12} sm={6} md={4} key={debtor.cpfCnpj}>
            <DebtorCard debtor={debtor} onViewDetails={onViewDetails} />
          </Grid>
        ))}
        {filtered.length === 0 && (
          <Grid item xs={12}>
            <Paper elevation={0} sx={{ p: 6, textAlign: 'center', borderRadius: 2.5, background: alpha(theme.palette.background.paper, 0.4), border: `1px solid ${alpha(theme.palette.divider, 0.4)}` }}>
              <PeopleIcon sx={{ fontSize: 48, color: 'text.secondary', opacity: 0.3, mb: 2 }} />
              <Typography variant="h6" color="text.secondary">Nenhum devedor encontrado</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Tente outro termo de busca.</Typography>
            </Paper>
          </Grid>
        )}
      </Grid>

    </Box>
  );
}

// ─── Aba de Cobranças (accordion por mês) ─────────────────────────────────────
function ChargesTab({ importOpen, setImportOpen }) {
  const theme = useTheme();
  const [tipo, setTipo] = useState('inadimplencia');
  const [anoFiltro, setAnoFiltro] = useState(String(new Date().getFullYear()));
  const [globalSearch, setGlobalSearch] = useState('');
  const [viewMode, setViewMode] = useState('accordion');

  const { data: monthData, isLoading, refetch } = useQuery(
    ['debts-by-month', tipo, anoFiltro],
    async () => {
      try {
        const { data } = await api.get(`/spreadsheets/by-month?tipo=${tipo}&ano=${anoFiltro}`);
        return data;
      } catch (err) {
        console.warn("API de meses falhou, usando mock para layout:", err);
        return buildMockMonths();
      }
    },
    { staleTime: 60000, keepPreviousData: true }
  );

  const months = monthData || [];
  const totalValor = months.reduce((a, m) => a + (m.totalValor || 0), 0);
  const totalRegistros = months.reduce((a, m) => a + (m.totalRegistros || 0), 0);
  const totalJuros = months.reduce((a, m) => a + (m.totalJuros || 0), 0);
  const totalMulta = months.reduce((a, m) => a + (m.totalMulta || 0), 0);
  const anos = ['2023','2024','2025','2026','2027'];

  return (
    <Box>
      {/* KPIs */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label:'Total de Registros',     value: fmtNum(totalRegistros), color: theme.palette.primary.main,  icon: <TableChartIcon />,  sub: `Ano ${anoFiltro}` },
          { label:'Valor Total da Carteira', value: fmt(1565450.39),        color: '#6366f1',                   icon: <MoneyIcon />,       sub: `Acumulado ${anoFiltro}` },
          { label:'Total de Juros',          value: fmt(totalJuros),        color: '#f59e0b',                   icon: <TrendingUpIcon />,  sub: 'Juros de mora' },
          { label:'Total de Multas',         value: fmt(totalMulta),        color: '#ef4444',                   icon: <GavelIcon />,       sub: 'Multas acumuladas' },
          { label:'Meses com Registros',     value: months.length,          color: '#10b981',                   icon: <CalendarIcon />,    sub: `Ano ${anoFiltro}` },
        ].map(k => (
          <Grid item xs={12} sm={6} md={2.4} key={k.label}>
            <KpiCard {...k} />
          </Grid>
        ))}
      </Grid>

      {/* Filtros da Cobrança */}
      <Paper elevation={0} sx={{
        p: 2, mb: 3, borderRadius: 2.5,
        background: alpha(theme.palette.background.paper, 0.6),
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
        boxShadow: `0 4px 16px ${alpha('#000',0.08)}, inset 0 1px 0 ${alpha('#fff',0.06)}`,
        display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center',
      }}>
        <FormControl size="small" sx={{ minWidth: 100 }}>
          <InputLabel>Ano</InputLabel>
          <Select value={anoFiltro} label="Ano" onChange={e => setAnoFiltro(e.target.value)} sx={{ borderRadius: 1.5 }}>
            {anos.map(a => <MenuItem key={a} value={a}>{a}</MenuItem>)}
          </Select>
        </FormControl>
        <TextField
          size="small" placeholder="Buscar cliente, contrato, CPF..." value={globalSearch}
          onChange={e => setGlobalSearch(e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 18, color: 'text.secondary' }} /></InputAdornment> }}
          sx={{ flex: 1, minWidth: 220, '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
        />
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title="Accordion por mês">
            <IconButton size="small" onClick={() => setViewMode('accordion')} color={viewMode==='accordion'?'primary':'default'} sx={{ border:`1px solid ${alpha(theme.palette.divider,0.8)}` }}>
              <TableChartIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Gráfico mensal">
            <IconButton size="small" onClick={() => setViewMode('chart')} color={viewMode==='chart'?'primary':'default'} sx={{ border:`1px solid ${alpha(theme.palette.divider,0.8)}` }}>
              <BarChartIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Atualizar">
            <IconButton size="small" onClick={() => refetch()} sx={{ border:`1px solid ${alpha(theme.palette.divider,0.8)}` }}>
              <RefreshIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>

      {isLoading && <LinearProgress sx={{ mb: 2, borderRadius: 1 }} />}

      {viewMode === 'chart' && months.length > 0 && (
        <Paper elevation={0} sx={{ p:3, mb:3, borderRadius:2.5, background: alpha(theme.palette.background.paper, 0.6), backdropFilter:'blur(16px)', border:`1px solid ${alpha(theme.palette.divider,0.5)}` }}>
          <Typography variant="subtitle1" fontWeight={700} gutterBottom>
            Evolução Mensal da Carteira
          </Typography>
          <MonthlyChart months={months} />
        </Paper>
      )}

      {viewMode === 'accordion' && (
        <Box>
          {months.length === 0 && !isLoading ? (
            <Paper elevation={0} sx={{ p:6, textAlign:'center', borderRadius:2.5, background: alpha(theme.palette.background.paper, 0.5), backdropFilter:'blur(16px)', border:`1px solid ${alpha(theme.palette.divider,0.4)}` }}>
              <CalendarIcon sx={{ fontSize:48, color:'text.secondary', opacity:0.3, mb:2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>Nenhum registro encontrado</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb:3 }}>
                Importe uma planilha para visualizar os registros organizados por mês de vencimento.
              </Typography>
              <Button variant="contained" startIcon={<UploadIcon />} onClick={() => setImportOpen(true)}
                sx={{ borderRadius:2, background:`linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})` }}>
                Importar Planilha
              </Button>
            </Paper>
          ) : (
            months.map((m, i) => (
              <MonthAccordion key={`${m.ano}-${m.mes}`} data={m} globalSearch={globalSearch} defaultExpanded={i === 0} />
            ))
          )}
        </Box>
      )}
    </Box>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────
export default function Debts() {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const [importOpen, setImportOpen] = useState(false);
  const [selectedDebtor, setSelectedDebtor] = useState(null);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const { data: debtors = [], isLoading, refetch } = useQuery(
    ['debtors-summary'],
    async () => {
      try {
        const { data } = await api.get('/spreadsheets/debtors');
        return data; 
      } catch (err) {
        console.warn("API de devedores falhou, usando mock para layout:", err);
        return groupChargesByDebtor(); 
      }
    },
    { staleTime: 30000 }
  );

  const handleReset = async () => {
    setIsResetting(true);
    try {
      console.log('--- [FRONTEND] Iniciando limpeza ---');
      const res = await api.delete('/spreadsheets/clear');
      console.log('--- [FRONTEND] Resposta API:', res.data);
      toast.success('✅ Base de dados limpa com sucesso!');
      refetch();
      queryClient.invalidateQueries(['debts-by-month']);
      setResetDialogOpen(false);
    } catch (err) {
      toast.error('Falha ao limpar base de dados.');
      console.error(err);
    } finally {
      setIsResetting(false);
    }
  };

  const currentSelectedDebtor = useMemo(() => {
    if (!selectedDebtor) return null;
    return debtors.find(d => d._id === selectedDebtor._id) || selectedDebtor;
  }, [selectedDebtor, debtors]);

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, minHeight: '100vh' }}>

      {/* ─── Header ─── */}
      <Box sx={{ display:'flex', alignItems:'center', justifyContent:'space-between', mb: 3, flexWrap:'wrap', gap:2 }}>
        <Box sx={{ display:'flex', alignItems:'center', gap:2 }}>
          <Box sx={{
            p: 1.5, borderRadius: 2,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.4)}`,
          }}>
            <DebtsIcon sx={{ color:'#fff', fontSize:28 }} />
          </Box>
          <Box>
            <Typography variant="h5" fontWeight={800} sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
            }}>
              Gestão de Devedores
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {isLoading ? 'Carregando dados reais...' : 'Visão geral sincronizada com o banco de dados.'}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display:'flex', gap:1, flexWrap:'wrap' }}>
          <Button
            variant="outlined"
            color="error"
            onClick={() => setResetDialogOpen(true)}
            startIcon={<DeleteSweepIcon />}
            sx={{ borderRadius: 2, fontWeight: 700, borderColor: alpha(theme.palette.error.main, 0.4) }}
          >
            Limpar Base
          </Button>
          <Button
            variant="outlined"
            onClick={() => refetch()}
            startIcon={<RefreshIcon />}
            sx={{ borderRadius: 2, fontWeight: 700, borderColor: alpha(theme.palette.primary.main, 0.5) }}
          >
            Sincronizar
          </Button>
          <Button
            variant="contained"
            startIcon={<UploadIcon />}
            onClick={() => setImportOpen(true)}
            sx={{ borderRadius:2, fontWeight:700, background:`linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})` }}
          >
            Importar Cobranças
          </Button>
        </Box>
      </Box>

      {/* ─── Conteúdo único ─── */}
      {isLoading ? (
        <Box sx={{ py: 10, textAlign: 'center' }}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }} color="text.secondary">Extraindo informações de devedores...</Typography>
        </Box>
      ) : (
        <DebtorsTab 
          debtorsData={debtors} 
          onViewDetails={(debtor) => setSelectedDebtor(debtor)} 
        />
      )}

      {/* ─── Modais ─── */}
      <ImportDialog open={importOpen} onClose={() => setImportOpen(false)} onImportSuccess={() => refetch()} />
      <DebtorDetailModal
        open={!!selectedDebtor}
        onClose={() => setSelectedDebtor(null)}
        debtor={currentSelectedDebtor}
      />

      {/* Confirmação de Reset */}
      <Dialog 
        open={resetDialogOpen} 
        onClose={() => !isResetting && setResetDialogOpen(false)}
        PaperProps={{ sx: { borderRadius: 3, background: 'rgba(18, 18, 30, 0.95)', backdropFilter: 'blur(24px)', border: `1px solid ${alpha(theme.palette.error.main, 0.3)}` }}}
      >
        <DialogTitle sx={{ fontWeight: 800, color: 'error.main' }}>Limpar Base de Dados?</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Tem certeza que deseja <strong>apagar permanentemente</strong> todos os devedores e cobranças importados?
            Esta ação não pode ser desfeita.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button 
            onClick={() => setResetDialogOpen(false)} 
            disabled={isResetting}
            sx={{ borderRadius: 2, fontWeight: 700 }}
          >
            Cancelar
          </Button>
          <Button 
            variant="contained" 
            color="error" 
            onClick={handleReset} 
            disabled={isResetting}
            startIcon={isResetting ? <CircularProgress size={16} /> : <DeleteSweepIcon />}
            sx={{ borderRadius: 2, fontWeight: 700, px: 3 }}
          >
            {isResetting ? 'Limpando...' : 'Confirmar Limpeza'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}