import React, { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Paper,
  Switch,
  TextField,
  Tooltip,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import {
  CalendarMonth as CalendarMonthIcon,
  Delete as DeleteIcon,
  Groups as GroupsIcon,
  PersonAdd as PersonAddIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import api from '../services/api';
import { StyledDialog } from '../components/ui/StyledDialog';
import { GradientButton } from '../components/ui/GradientButton';

const fetchTeamMembers = async () => {
  const { data } = await api.get('/manager/users');
  return data;
};

const CreateMemberDialog = ({ open, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({ name: '', roleLabel: 'Atendente' });

  const createMemberMutation = useMutation((payload) => api.post('/manager/users', payload), {
    onSuccess: () => {
      toast.success('Perfil de atendimento criado com sucesso!');
      setFormData({ name: '', roleLabel: 'Atendente' });
      onSuccess();
      onClose();
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Erro ao criar perfil.'),
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    createMemberMutation.mutate(formData);
  };

  return (
    <StyledDialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Adicionar Perfil de Atendimento</DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="name"
                label="Nome exibido"
                value={formData.name}
                onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="roleLabel"
                label="Funcao"
                value={formData.roleLabel}
                onChange={(event) => setFormData((prev) => ({ ...prev, roleLabel: event.target.value }))}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: '16px 24px' }}>
          <Button onClick={onClose} color="inherit" disabled={createMemberMutation.isLoading}>Cancelar</Button>
          <GradientButton type="submit" loading={createMemberMutation.isLoading}>Adicionar Perfil</GradientButton>
        </DialogActions>
      </Box>
    </StyledDialog>
  );
};

const DeleteMemberDialog = ({ open, onClose, onConfirm, memberName, isLoading }) => (
  <StyledDialog open={open} onClose={onClose} maxWidth="xs">
    <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <WarningIcon color="error" />
      Confirmar Exclusao
    </DialogTitle>
    <DialogContent>
      <Typography>
        Voce tem certeza que deseja excluir o perfil <Typography component="span" fontWeight="bold">{memberName}</Typography>?
      </Typography>
      <Alert severity="warning" sx={{ mt: 2 }}>
        O login principal e a instancia do WhatsApp nao serao alterados.
      </Alert>
    </DialogContent>
    <DialogActions sx={{ p: '16px 24px' }}>
      <Button onClick={onClose} color="inherit" disabled={isLoading}>Cancelar</Button>
      <GradientButton onClick={onConfirm} loading={isLoading} color="error">Excluir</GradientButton>
    </DialogActions>
  </StyledDialog>
);

const MemberCard = ({ member, onStatusChange, onDelete, isUpdating }) => {
  const theme = useTheme();
  const ownerEmail = member.owner?.email;

  return (
    <Card sx={{
      p: 2,
      borderRadius: 2,
      backgroundColor: alpha(theme.palette.background.paper, 0.72),
      border: `1px solid ${alpha(theme.palette.divider, 0.22)}`,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, overflow: 'hidden', minWidth: 0 }}>
          <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.2), color: 'primary.main', flexShrink: 0 }}>
            {member.name?.charAt(0)?.toUpperCase() || 'A'}
          </Avatar>
          <Box sx={{ overflow: 'hidden' }}>
            <Typography variant="body1" fontWeight="bold" noWrap>{member.name}</Typography>
            <Typography variant="body2" color="text.secondary" noWrap>{member.roleLabel || 'Atendente'}</Typography>
            {ownerEmail && <Typography variant="caption" color="text.secondary" noWrap>{ownerEmail}</Typography>}
          </Box>
        </Box>
        <Tooltip title="Excluir perfil">
          <IconButton size="small" onClick={() => onDelete(member)} sx={{ flexShrink: 0 }}>
            <DeleteIcon color="error" />
          </IconButton>
        </Tooltip>
      </Box>
      <Divider sx={{ my: 2 }} />
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CalendarMonthIcon fontSize="small" sx={{ color: 'text.secondary' }} />
          <Typography variant="caption" color="text.secondary">
            Criado em: {member.createdAt ? format(new Date(member.createdAt), 'dd/MM/yyyy') : '-'}
          </Typography>
        </Box>
        <Chip label="Mesmo login e WhatsApp" size="small" variant="outlined" sx={{ alignSelf: 'flex-start' }} />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, pt: 2, borderTop: `1px solid ${alpha(theme.palette.divider, 0.2)}` }}>
        <Typography variant="body2" fontWeight={500}>{member.isActive ? 'Ativo' : 'Inativo'}</Typography>
        <Switch checked={!!member.isActive} onChange={(event) => onStatusChange(member._id, { isActive: event.target.checked })} disabled={isUpdating} color="success" />
      </Box>
    </Card>
  );
};

export default function TeamManagement() {
  const queryClient = useQueryClient();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);

  const { data, isLoading, isError } = useQuery('managedUsers', fetchTeamMembers);
  const members = data?.users || [];
  const limit = data?.limit || 0;
  const currentCount = data?.currentCount || 0;
  const isAdminView = data?.isAdminView || false;
  const canAddMember = !isAdminView && currentCount < limit;

  const limitLabel = useMemo(() => {
    if (isAdminView || limit === null || limit === undefined) return `${currentCount}`;
    if (limit === Infinity || Number.isNaN(limit)) return `${currentCount}`;
    return `${currentCount}/${limit}`;
  }, [currentCount, isAdminView, limit]);

  const updateMemberMutation = useMutation(({ memberId, updates }) => api.put(`/manager/users/${memberId}`, updates), {
    onSuccess: () => {
      queryClient.invalidateQueries('managedUsers');
      queryClient.invalidateQueries('teamMembersForMenu');
      toast.success('Perfil atualizado!');
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Erro ao atualizar perfil.'),
  });

  const deleteMemberMutation = useMutation((memberId) => api.delete(`/manager/users/${memberId}`), {
    onSuccess: () => {
      queryClient.invalidateQueries('managedUsers');
      queryClient.invalidateQueries('teamMembersForMenu');
      toast.success('Perfil excluido!');
      setMemberToDelete(null);
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Erro ao excluir perfil.'),
  });

  if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>;
  if (isError) return <Alert severity="error">Nao foi possivel carregar os perfis de atendimento.</Alert>;

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box display="flex" alignItems="center" gap={2}>
          <GroupsIcon sx={{ fontSize: 40 }} />
          <Box>
            <Typography variant="h4" fontWeight="bold">Gestao de Atendimento</Typography>
            <Typography variant="body2" color="text.secondary">
              Crie perfis internos que usam o mesmo login e a mesma instancia de WhatsApp.
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 2, textAlign: 'center', height: '100%' }}>
            <Typography variant="h6">Perfis Cadastrados</Typography>
            <Typography variant="h3" fontWeight="bold" sx={{ my: 2 }}>{limitLabel}</Typography>
            <GradientButton fullWidth startIcon={<PersonAddIcon />} onClick={() => setCreateDialogOpen(true)} disabled={!canAddMember}>
              Adicionar Perfil
            </GradientButton>
            {isAdminView && <Alert severity="info" variant="outlined" sx={{ mt: 2, textAlign: 'left' }}>Administradores visualizam os perfis, mas a criacao fica no login do manager.</Alert>}
            {!isAdminView && !canAddMember && <Alert severity="warning" variant="outlined" sx={{ mt: 2, textAlign: 'left' }}>Limite de perfis atingido.</Alert>}
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Grid container spacing={2}>
            {members.length > 0 ? members.map((member) => (
              <Grid item xs={12} sm={6} lg={4} key={member._id}>
                <MemberCard
                  member={member}
                  onStatusChange={(memberId, updates) => updateMemberMutation.mutate({ memberId, updates })}
                  onDelete={setMemberToDelete}
                  isUpdating={updateMemberMutation.isLoading}
                />
              </Grid>
            )) : (
              <Grid item xs={12}>
                <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
                  <Typography color="text.secondary">Nenhum perfil cadastrado.</Typography>
                </Paper>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>

      <CreateMemberDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSuccess={() => {
          queryClient.invalidateQueries('managedUsers');
          queryClient.invalidateQueries('teamMembersForMenu');
        }}
      />
      <DeleteMemberDialog
        open={!!memberToDelete}
        onClose={() => setMemberToDelete(null)}
        onConfirm={() => memberToDelete && deleteMemberMutation.mutate(memberToDelete._id)}
        memberName={memberToDelete?.name}
        isLoading={deleteMemberMutation.isLoading}
      />
    </Box>
  );
}
