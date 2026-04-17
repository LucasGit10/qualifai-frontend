import React, { useState } from 'react';
import {
  Box, Typography, Button, DialogTitle, DialogContent, DialogActions,
  CircularProgress, Table, TableBody, TableCell, TableHead, TableRow,
  Paper, Chip, Grid, TextField, IconButton, Tooltip, Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Payment as PaymentIcon,
  PersonAdd as PersonAddIcon,
  Description as DescriptionIcon,
  History as HistoryIcon
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import debtService from '../services/debtService';
import { StyledDialog } from './ui/StyledDialog';
import { GradientButton } from './ui/GradientButton';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const DebtManagementDialog = ({ open, onClose, leadId, leadName }) => {
  const queryClient = useQueryClient();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newDebt, setNewDebt] = useState({
    contractNumber: '',
    amount: '',
    installmentsCount: 1,
    firstDueDate: format(new Date(), 'yyyy-MM-dd'),
    interestRate: 1,
    penaltyRate: 2
  });
  const [showGuarantorForm, setShowGuarantorForm] = useState(false);
  const [newGuarantor, setNewGuarantor] = useState({
    name: '',
    email: '',
    phone: '',
    taxId: '',
    relationship: ''
  });

  const { data: debtData, isLoading, refetch } = useQuery(
    ['debt', leadId],
    () => debtService.getDebtByLead(leadId).then(res => res.data),
    {
      enabled: !!leadId && open,
      retry: false,
      onError: () => {
        // Se der 404, não mostrar erro de toast, apenas o formulário de criação
      }
    }
  );

  const addGuarantorMutation = useMutation(
    (data) => debtService.addGuarantor({ ...data, debtId: debtData?.debt?._id }),
    {
      onSuccess: () => {
        toast.success('Fiador adicionado!');
        setShowGuarantorForm(false);
        setNewGuarantor({ name: '', email: '', phone: '', taxId: '', relationship: '' });
        queryClient.invalidateQueries(['debt', leadId]);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Erro ao adicionar fiador');
      }
    }
  );

  const createDebtMutation = useMutation(
    (data) => debtService.createDebt({ ...data, leadId }),
    {
      onSuccess: () => {
        toast.success('Dívida criada com sucesso!');
        setShowCreateForm(false);
        queryClient.invalidateQueries(['debt', leadId]);
        queryClient.invalidateQueries('dashboard-stats');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Erro ao criar dívida');
      }
    }
  );

  const processPaymentMutation = useMutation(
    (data) => debtService.processPayment(data),
    {
      onSuccess: () => {
        toast.success('Pagamento registrado!');
        queryClient.invalidateQueries(['debt', leadId]);
        queryClient.invalidateQueries('dashboard-stats');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Erro ao processar pagamento');
      }
    }
  );

  const handleCreateDebt = (e) => {
    e.preventDefault();
    createDebtMutation.mutate(newDebt);
  };

  const handlePayment = (installmentId, amount) => {
    if (window.confirm(`Confirmar pagamento de R$ ${amount.toFixed(2)}?`)) {
      processPaymentMutation.mutate({
        installmentId,
        amount,
        paymentMethod: 'pix'
      });
    }
  };

  const handleAddGuarantor = (e) => {
    e.preventDefault();
    addGuarantorMutation.mutate(newGuarantor);
  };

  const getStatusChip = (status) => {
    const configs = {
      'pago': { color: 'success', label: 'Pago' },
      'pendente': { color: 'warning', label: 'Pendente' },
      'atrasado': { color: 'error', label: 'Atrasado' }
    };
    const config = configs[status] || { color: 'default', label: status };
    return <Chip label={config.label} color={config.color} size="small" />;
  };

  if (!open) return null;

  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <DescriptionIcon color="primary" />
          <Typography variant="h6">Gestão de Dívida - {leadName}</Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent dividers>
        {isLoading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : debtData ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Resumo da Dívida */}
            <Paper sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={6} md={3}>
                  <Typography variant="caption" color="text.secondary">Contrato</Typography>
                  <Typography variant="body1" fontWeight="bold">#{debtData.debt.contractNumber}</Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="caption" color="text.secondary">Valor Original</Typography>
                  <Typography variant="body1">R$ {debtData.debt.originalAmount?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="caption" color="text.secondary">Saldo Devedor</Typography>
                  <Typography variant="body1" color="error.main" fontWeight="bold">
                    R$ {debtData.debt.currentBalance?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="caption" color="text.secondary">Status</Typography>
                  <Box>
                    <Chip 
                      label={debtData.debt.status.toUpperCase()} 
                      color={debtData.debt.status === 'quitado' ? 'success' : 'primary'} 
                      size="small" 
                    />
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            {/* Lista de Parcelas */}
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <HistoryIcon fontSize="small" /> Parcelas e Pagamentos
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Vencimento</TableCell>
                    <TableCell>Valor</TableCell>
                    <TableCell>Atualizado</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {debtData.installments.map((inst) => (
                    <TableRow key={inst._id}>
                      <TableCell>{inst.number}</TableCell>
                      <TableCell>{format(new Date(inst.dueDate), 'dd/MM/yyyy')}</TableCell>
                      <TableCell>R$ {inst.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                      <TableCell>
                        <Typography variant="body2" color={inst.updated > inst.amount ? 'error.main' : 'inherit'}>
                          R$ {inst.updated.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </Typography>
                      </TableCell>
                      <TableCell>{getStatusChip(inst.status)}</TableCell>
                      <TableCell align="right">
                        {inst.status !== 'pago' && (
                          <Tooltip title="Registrar Pagamento">
                            <IconButton 
                              size="small" 
                              color="success" 
                              onClick={() => handlePayment(inst._id, inst.updated)}
                              disabled={processPaymentMutation.isLoading}
                            >
                              <PaymentIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>

            {/* Fiadores */}
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonAddIcon fontSize="small" /> Fiadores
                </Typography>
                {!showGuarantorForm && (
                  <Button size="small" startIcon={<AddIcon />} onClick={() => setShowGuarantorForm(true)}>
                    Novo Fiador
                  </Button>
                )}
              </Box>
              
              {showGuarantorForm ? (
                <Paper sx={{ p: 2, border: '1px dashed grey' }}>
                  <Typography variant="caption" gutterBottom>Cadastrar Novo Fiador</Typography>
                  <Grid container spacing={1} sx={{ mt: 1 }}>
                    <Grid item xs={12} sm={6}>
                      <TextField size="small" fullWidth label="Nome" value={newGuarantor.name} onChange={(e) => setNewGuarantor({...newGuarantor, name: e.target.value})} required />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField size="small" fullWidth label="CPF/CNPJ" value={newGuarantor.taxId} onChange={(e) => setNewGuarantor({...newGuarantor, taxId: e.target.value})} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField size="small" fullWidth label="E-mail" value={newGuarantor.email} onChange={(e) => setNewGuarantor({...newGuarantor, email: e.target.value})} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField size="small" fullWidth label="Telefone" value={newGuarantor.phone} onChange={(e) => setNewGuarantor({...newGuarantor, phone: e.target.value})} />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField size="small" fullWidth label="Parentesco/Relação" value={newGuarantor.relationship} onChange={(e) => setNewGuarantor({...newGuarantor, relationship: e.target.value})} />
                    </Grid>
                  </Grid>
                  <Box display="flex" justifyContent="flex-end" gap={1} mt={2}>
                    <Button size="small" onClick={() => setShowGuarantorForm(false)}>Cancelar</Button>
                    <Button size="small" variant="contained" onClick={handleAddGuarantor} disabled={addGuarantorMutation.isLoading}>Salvar Fiador</Button>
                  </Box>
                </Paper>
              ) : debtData.guarantors?.length > 0 ? (
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {debtData.guarantors.map((g) => (
                    <Chip 
                      key={g._id} 
                      icon={<AccountCircleIcon />} 
                      label={`${g.name} (${g.relationship || 'Fiador'})`} 
                      variant="outlined" 
                    />
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">Nenhum fiador vinculado.</Typography>
              )}
            </Box>
          </Box>
        ) : showCreateForm ? (
          <form onSubmit={handleCreateDebt}>
            <Grid container spacing={2} sx={{ pt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField 
                  fullWidth label="Número do Contrato" 
                  value={newDebt.contractNumber} 
                  onChange={(e) => setNewDebt({...newDebt, contractNumber: e.target.value})}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  fullWidth label="Valor Total" type="number"
                  value={newDebt.amount} 
                  onChange={(e) => setNewDebt({...newDebt, amount: e.target.value})}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  fullWidth label="Qtd. Parcelas" type="number"
                  value={newDebt.installmentsCount} 
                  onChange={(e) => setNewDebt({...newDebt, installmentsCount: e.target.value})}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  fullWidth label="Primeiro Vencimento" type="date"
                  value={newDebt.firstDueDate} 
                  onChange={(e) => setNewDebt({...newDebt, firstDueDate: e.target.value})}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  fullWidth label="Juros Mensais (%)" type="number"
                  value={newDebt.interestRate} 
                  onChange={(e) => setNewDebt({...newDebt, interestRate: e.target.value})}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  fullWidth label="Multa por Atraso (%)" type="number"
                  value={newDebt.penaltyRate} 
                  onChange={(e) => setNewDebt({...newDebt, penaltyRate: e.target.value})}
                />
              </Grid>
            </Grid>
            <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
              <Button onClick={() => setShowCreateForm(false)}>Cancelar</Button>
              <GradientButton type="submit" disabled={createDebtMutation.isLoading}>
                Criar Dívida
              </GradientButton>
            </Box>
          </form>
        ) : (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              Nenhuma dívida registrada para este lead.
            </Typography>
            <Button 
              variant="outlined" 
              startIcon={<AddIcon />} 
              onClick={() => setShowCreateForm(true)}
              sx={{ mt: 2 }}
            >
              Registrar Nova Dívida
            </Button>
          </Box>
        )}
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} color="inherit">Fechar</Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default DebtManagementDialog;
