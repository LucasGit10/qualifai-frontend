import React, { useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { 
  Box, 
  Grid, 
  Typography, 
  Paper, 
  TextField, 
  Button, 
  CircularProgress, 
  Card, 
  CardContent, 
  CardActions, 
  IconButton, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  FormControlLabel, 
  Switch, 
  InputAdornment,
  Divider,
  Chip
} from '@mui/material';
import { 
  AddCircleOutline as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  CheckCircle as CheckIcon 
} from '@mui/icons-material';
import { toast } from 'react-toastify';

// Simulação de API - substitua pelas suas chamadas reais
const api = {
  getPlans: async () => {
    // Simula uma chamada de API que busca os planos
    // No seu app, seria algo como: await axios.get('/api/plans')
    console.log("Buscando planos...");
    return [
      { id: 1, name: 'Plano Básico', price: 49.90, features: ['1 usuário', '500 leads/mês', 'Suporte via e-mail'], isActive: true },
      { id: 2, name: 'Plano Profissional', price: 99.90, features: ['5 usuários', '2000 leads/mês', 'Dashboard de Análise', 'Suporte via Chat'], isActive: true },
      { id: 3, name: 'Plano Enterprise', price: 249.90, features: ['Usuários ilimitados', 'Leads ilimitados', 'API de integração', 'Suporte dedicado'], isActive: false },
    ];
  },
  createPlan: async (newPlan) => {
    // Simula a criação de um novo plano
    console.log("Criando novo plano:", newPlan);
    return { ...newPlan, id: Math.random() };
  },
  deletePlan: async (planId) => {
    // Simula a exclusão de um plano
    console.log("Excluindo plano:", planId);
    return { success: true };
  }
};
// Fim da simulação de API

export default function PlansPage() {
  const queryClient = useQueryClient();
  const [newPlan, setNewPlan] = useState({
    name: '',
    price: '',
    description: '',
    features: '',
    isActive: true,
  });

  // Busca os dados dos planos usando react-query
  const { data: plans, isLoading, isError } = useQuery('plans', api.getPlans);

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setNewPlan(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!newPlan.name || !newPlan.price) {
      toast.error('Nome e Preço são obrigatórios.');
      return;
    }
    
    try {
      const planData = {
        ...newPlan,
        price: parseFloat(newPlan.price),
        features: newPlan.features.split(',').map(f => f.trim()), // Transforma string em array
      };
      await api.createPlan(planData);
      toast.success('Plano cadastrado com sucesso!');
      // Invalida a query 'plans', forçando o react-query a buscar os dados novamente
      queryClient.invalidateQueries('plans');
      // Limpa o formulário
      setNewPlan({ name: '', price: '', description: '', features: '', isActive: true });
    } catch (error) {
      toast.error('Erro ao cadastrar o plano.');
    }
  };

  const handleDelete = async (planId) => {
    if (window.confirm('Tem certeza que deseja excluir este plano?')) {
      try {
        await api.deletePlan(planId);
        toast.success('Plano excluído com sucesso!');
        queryClient.invalidateQueries('plans');
      } catch (error) {
        toast.error('Erro ao excluir o plano.');
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
        Gerenciamento de Planos
      </Typography>

      <Grid container spacing={4}>
        {/* Seção de Cadastro de Planos */}
        <Grid item xs={12} md={4}>
          <Typography variant="h6" gutterBottom>
            Cadastrar Novo Plano
          </Typography>
          <Paper component="form" onSubmit={handleSubmit} sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              name="name"
              label="Nome do Plano"
              value={newPlan.name}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <TextField
              name="price"
              label="Preço Mensal"
              type="number"
              value={newPlan.price}
              onChange={handleInputChange}
              fullWidth
              required
              InputProps={{
                startAdornment: <InputAdornment position="start">R$</InputAdornment>,
              }}
            />
            <TextField
              name="features"
              label="Funcionalidades"
              value={newPlan.features}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={3}
              helperText="Separe as funcionalidades por vírgula (,)"
            />
            <FormControlLabel
              control={
                <Switch
                  name="isActive"
                  checked={newPlan.isActive}
                  onChange={handleInputChange}
                  color="success"
                />
              }
              label="Plano Ativo"
            />
            <Button
              type="submit"
              variant="contained"
              startIcon={<AddIcon />}
              sx={{ mt: 1 }}
            >
              Salvar Plano
            </Button>
          </Paper>
        </Grid>

        {/* Seção de Listagem de Planos */}
        <Grid item xs={12} md={8}>
          <Typography variant="h6" gutterBottom>
            Planos Existentes
          </Typography>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
              <CircularProgress />
            </Box>
          ) : isError ? (
            <Typography color="error">Erro ao carregar os planos.</Typography>
          ) : (
            <Grid container spacing={2}>
              {plans.length === 0 ? (
                <Grid item xs={12}>
                  <Typography>Nenhum plano cadastrado ainda.</Typography>
                </Grid>
              ) : (
                plans.map((plan) => (
                  <Grid item xs={12} sm={6} key={plan.id}>
                    <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                            {plan.name}
                          </Typography>
                          <Chip 
                            label={plan.isActive ? 'Ativo' : 'Inativo'} 
                            color={plan.isActive ? 'success' : 'default'} 
                            size="small"
                          />
                        </Box>
                        <Typography variant="h4" color="primary" sx={{ my: 1 }}>
                          R$ {plan.price.toFixed(2)}<Typography variant="body2" component="span">/mês</Typography>
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <List dense>
                          {plan.features.map((feature, index) => (
                            <ListItem key={index} disablePadding>
                              <ListItemIcon sx={{ minWidth: '32px' }}>
                                <CheckIcon color="success" fontSize="small" />
                              </ListItemIcon>
                              <ListItemText primary={feature} />
                            </ListItem>
                          ))}
                        </List>
                      </CardContent>
                      <CardActions sx={{ justifyContent: 'flex-end' }}>
                        <IconButton aria-label="editar" onClick={() => toast.info('Funcionalidade de edição a ser implementada.')}>
                          <EditIcon />
                        </IconButton>
                        <IconButton aria-label="excluir" onClick={() => handleDelete(plan.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </CardActions>
                    </Card>
                  </Grid>
                ))
              )}
            </Grid>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}