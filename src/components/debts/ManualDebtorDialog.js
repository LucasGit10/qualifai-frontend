import React, { useState } from 'react';
import { Box, Typography, Button, DialogTitle, DialogContent, DialogActions, CircularProgress, Grid, TextField, IconButton, Dialog, Stack, Paper } from '@mui/material';
import { Add as AddIcon, People as PeopleIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { alpha, useTheme } from '@mui/material/styles';
import api from '../../services/api';

const fmt = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

const getDialogPaperSx = (theme, color) => ({
  borderRadius: 3,
  background: theme.palette.mode === 'dark' ? 'rgba(18, 18, 30, 0.92)' : 'rgba(255, 255, 255, 0.98)',
  backdropFilter: 'blur(24px)',
  WebkitBackdropFilter: 'blur(24px)',
  border: `1px solid ${alpha(color || theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.28 : 0.18)}`,
  boxShadow: theme.palette.mode === 'dark' ? `0 24px 64px ${alpha('#000', 0.45)}` : `0 24px 48px ${alpha('#000', 0.12)}`
});

export default function ManualDebtorDialog({ open, onClose, onCreated }) {
  const theme = useTheme();
  const [form, setForm] = useState({
    cliente: '',
    cpfCnpj: '',
    email: '',
    telefone1: '',
    telefone2: '',
    contatosExtras: '',
    empreendimento: '',
    torre: '',
    apto: '',
    enderecoResidencial: '',
    profissao: '',
    status: 'novo',
    note: '',
    dividas: [{
      contrato: '',
      vencimento: format(new Date(), 'yyyy-MM-dd'),
      principal: '',
      juros: '',
      multa: '',
      total: '',
      parcela: 1
    }]
  });

  const update = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const updateDivida = (index, field) => (event) => {
    const newDividas = [...form.dividas];
    newDividas[index][field] = event.target.value;
    setForm((current) => ({ ...current, dividas: newDividas }));
  };

  const addDivida = () => {
    setForm((current) => ({
      ...current,
      dividas: [...current.dividas, { contrato: '', vencimento: format(new Date(), 'yyyy-MM-dd'), principal: '', juros: '', multa: '', total: '', parcela: 1 }]
    }));
  };

  const removeDivida = (index) => {
    setForm((current) => ({
      ...current,
      dividas: current.dividas.filter((_, i) => i !== index)
    }));
  };

  const createMutation = useMutation(
    async () => {
      const extraPhones = form.contatosExtras
        .split(/[\n,;]+/)
        .map((value) => value.trim())
        .filter(Boolean);
        
      const payload = {
        ...form,
        contatos: extraPhones,
        dividas: form.dividas.map(d => {
          const principal = Number(d.principal) || 0;
          const juros = Number(d.juros) || 0;
          const multa = Number(d.multa) || 0;
          return {
            contrato: d.contrato,
            vencimento: d.vencimento,
            parcela: Number(d.parcela) || 1,
            principal,
            juros,
            multa,
            total: Number(d.total) || (principal + juros + multa)
          };
        })
      };
      delete payload.contatosExtras;
      const { data } = await api.post('/spreadsheets/debtors/manual', payload);
      return data;
    },
    {
      onSuccess: () => {
        toast.success('Devedor cadastrado com sucesso.');
        onCreated?.();
        onClose();
      },
      onError: (err) => {
        toast.error(err.response?.data?.message || 'Erro ao cadastrar devedor.');
      }
    }
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.cliente.trim() && !form.cpfCnpj.trim()) return toast.warn('Informe pelo menos nome ou CPF/CNPJ.');
    if (form.dividas.length === 0) return toast.warn('Adicione pelo menos uma cobranca.');
    for (const d of form.dividas) {
      if (!d.vencimento) return toast.warn('Informe o vencimento de todas as cobrancas.');
      const t = Number(d.total) || ((Number(d.principal) || 0) + (Number(d.juros) || 0) + (Number(d.multa) || 0));
      if (t <= 0) return toast.warn('Informe um valor total maior que zero para todas as cobrancas.');
    }
    createMutation.mutate();
  };

  return (
    <Dialog open={open} onClose={createMutation.isLoading ? undefined : onClose} maxWidth="md" fullWidth PaperProps={{ sx: getDialogPaperSx(theme, theme.palette.primary.main) }}>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PeopleIcon color="primary" />
            <Box>
              <Typography variant="h6" fontWeight={800}>Novo devedor manual</Typography>
              <Typography variant="caption" color="text.secondary">
                Cadastre sem planilha, com contatos, contrato, valor e observacao inicial.
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2.5}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: alpha(theme.palette.primary.main, 0.03) }}>
              <Typography variant="subtitle2" fontWeight={800} gutterBottom>1. Dados do devedor</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={7}>
                  <TextField fullWidth label="Nome do devedor" value={form.cliente} onChange={update('cliente')} autoFocus />
                </Grid>
                <Grid item xs={12} md={5}>
                  <TextField fullWidth label="CPF/CNPJ" value={form.cpfCnpj} onChange={update('cpfCnpj')} helperText="Usado para evitar duplicidade" />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Empreendimento / Empresa" value={form.empreendimento} onChange={update('empreendimento')} />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField fullWidth label="Torre" value={form.torre} onChange={update('torre')} />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField fullWidth label="Apto / Unidade" value={form.apto} onChange={update('apto')} />
                </Grid>
                <Grid item xs={12} md={8}>
                  <TextField fullWidth label="Endereco" value={form.enderecoResidencial} onChange={update('enderecoResidencial')} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField fullWidth label="Profissao" value={form.profissao} onChange={update('profissao')} />
                </Grid>
              </Grid>
            </Paper>

            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="subtitle2" fontWeight={800} gutterBottom>2. Contatos</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <TextField fullWidth label="Telefone principal" value={form.telefone1} onChange={update('telefone1')} placeholder="(11) 99999-9999" />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField fullWidth label="Telefone secundario" value={form.telefone2} onChange={update('telefone2')} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField fullWidth label="E-mail" type="email" value={form.email} onChange={update('email')} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth multiline minRows={2} label="Outros telefones" value={form.contatosExtras} onChange={update('contatosExtras')} helperText="Um por linha, ou separados por virgula/ponto e virgula." />
                </Grid>
              </Grid>
            </Paper>

            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle2" fontWeight={800}>3. Cobrancas / Dividas</Typography>
                <Button size="small" startIcon={<AddIcon />} onClick={addDivida} variant="outlined">Adicionar Divida</Button>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <TextField fullWidth label="Status do devedor" value={form.status} onChange={update('status')} helperText="Ex: novo, contatado, em_negociacao" />
                </Grid>
              </Grid>

              {form.dividas.map((divida, index) => {
                const calcT = (Number(divida.principal) || 0) + (Number(divida.juros) || 0) + (Number(divida.multa) || 0);
                return (
                  <Box key={index} sx={{ mt: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2, position: 'relative' }}>
                    {form.dividas.length > 1 && (
                      <IconButton size="small" color="error" onClick={() => removeDivida(index)} sx={{ position: 'absolute', top: 4, right: 4 }}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4}>
                        <TextField fullWidth size="small" label="Contrato" value={divida.contrato} onChange={updateDivida(index, 'contrato')} />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TextField fullWidth size="small" label="Vencimento" type="date" value={divida.vencimento} onChange={updateDivida(index, 'vencimento')} InputLabelProps={{ shrink: true }} required />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TextField fullWidth size="small" label="Parcela" type="number" value={divida.parcela} onChange={updateDivida(index, 'parcela')} inputProps={{ min: 1 }} />
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <TextField fullWidth size="small" label="Principal" type="number" value={divida.principal} onChange={updateDivida(index, 'principal')} inputProps={{ min: 0, step: '0.01' }} />
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <TextField fullWidth size="small" label="Juros" type="number" value={divida.juros} onChange={updateDivida(index, 'juros')} inputProps={{ min: 0, step: '0.01' }} />
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <TextField fullWidth size="small" label="Multa" type="number" value={divida.multa} onChange={updateDivida(index, 'multa')} inputProps={{ min: 0, step: '0.01' }} />
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <TextField fullWidth size="small" label="Total" type="number" value={divida.total} onChange={updateDivida(index, 'total')} helperText={calcT > 0 ? `Sug: ${fmt(calcT)}` : ''} inputProps={{ min: 0, step: '0.01' }} />
                      </Grid>
                    </Grid>
                  </Box>
                );
              })}
            </Paper>

            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="subtitle2" fontWeight={800} gutterBottom>4. Observacao inicial</Typography>
              <TextField fullWidth multiline minRows={3} label="Nota interna" value={form.note} onChange={update('note')} helperText="Essa nota tambem sai no relatorio completo do devedor." />
            </Paper>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={onClose} disabled={createMutation.isLoading}>Cancelar</Button>
          <Button type="submit" variant="contained" startIcon={createMutation.isLoading ? <CircularProgress size={16} /> : <AddIcon />} disabled={createMutation.isLoading}>
            {createMutation.isLoading ? 'Cadastrando...' : 'Cadastrar devedor'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
