import React, { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  LinearProgress,
  Paper,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Groups as GroupsIcon,
  PersonAdd as PersonAddIcon,
  PersonOutline as PersonOutlineIcon,
  VpnKey as VpnKeyIcon,
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

const getGlassPanelSx = (theme) => ({
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'background.paper',
  backdropFilter: theme.palette.mode === 'dark' ? 'blur(10px)' : 'none',
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : theme.palette.divider}`,
  borderRadius: 3,
  boxShadow: theme.palette.mode === 'dark' ? '0 8px 32px 0 rgba(31, 38, 135, 0.37)' : theme.shadows[2],
});

const CreateMemberDialog = ({ open, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({ name: '', roleLabel: 'Atendente' });

  const createMemberMutation = useMutation((payload) => api.post('/manager/users', payload), {
    onSuccess: () => {
      toast.success('Usuario do time criado com sucesso!');
      setFormData({ name: '', roleLabel: 'Atendente' });
      onSuccess();
      onClose();
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Erro ao criar usuario.'),
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    createMemberMutation.mutate(formData);
  };

  const isSubmitting = createMemberMutation.isLoading;

  return (
    <StyledDialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ pb: 1 }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main' }}>
            <PersonAddIcon fontSize="small" />
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight={700}>Novo usuario do time</Typography>
            <Typography variant="body2" color="text.secondary">
              Ele usara o mesmo login principal e a mesma instancia de WhatsApp.
            </Typography>
          </Box>
        </Stack>
      </DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="name"
                label="Nome exibido"
                value={formData.name}
                onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
                required
                autoFocus
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
        <DialogActions sx={{ p: '16px 24px', pt: 0 }}>
          <Button onClick={onClose} color="inherit" disabled={isSubmitting}>Cancelar</Button>
          <GradientButton
            type="submit"
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : <PersonAddIcon />}
          >
            Adicionar usuario
          </GradientButton>
        </DialogActions>
      </Box>
    </StyledDialog>
  );
};

const DeleteMemberDialog = ({ open, onClose, onConfirm, memberName, isLoading }) => (
  <StyledDialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
    <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <WarningIcon color="warning" />
      Remover usuario
    </DialogTitle>
    <DialogContent>
      <Typography>
        Tem certeza que deseja remover <Typography component="span" fontWeight={700}>{memberName}</Typography> do time?
      </Typography>
      <Alert severity="warning" sx={{ mt: 2 }}>
        O login principal e a instancia do WhatsApp nao serao alterados.
      </Alert>
    </DialogContent>
    <DialogActions sx={{ p: '16px 24px' }}>
      <Button onClick={onClose} color="inherit" disabled={isLoading}>Cancelar</Button>
      <Button
        onClick={onConfirm}
        disabled={isLoading}
        color="error"
        variant="contained"
        startIcon={isLoading ? <CircularProgress size={18} color="inherit" /> : <DeleteIcon />}
      >
        Remover
      </Button>
    </DialogActions>
  </StyledDialog>
);

const SummaryCard = ({ title, value, helper, icon, color }) => {
  const theme = useTheme();

  return (
    <Paper
      sx={{
        ...getGlassPanelSx(theme),
        p: 2.5,
        height: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        gap: 2,
        overflow: 'hidden',
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.75 }}>
          {title}
        </Typography>
        <Typography variant="h4" fontWeight={700} sx={{ lineHeight: 1.1 }}>
          {value}
        </Typography>
        {helper && (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
            {helper}
          </Typography>
        )}
      </Box>
      <Avatar
        sx={{
          width: 54,
          height: 54,
          bgcolor: alpha(color, 0.18),
          color,
          border: `1px solid ${alpha(color, 0.28)}`,
          flexShrink: 0,
        }}
      >
        {icon}
      </Avatar>
    </Paper>
  );
};

const EmptyState = ({ onAction, disabled }) => {
  const theme = useTheme();

  return (
    <Paper
      sx={{
        p: { xs: 3, sm: 5 },
        textAlign: 'center',
        borderRadius: 3,
        backgroundColor: alpha(theme.palette.background.paper, theme.palette.mode === 'dark' ? 0.32 : 0.85),
        border: `1px dashed ${alpha(theme.palette.primary.main, 0.35)}`,
      }}
    >
      <Avatar sx={{ mx: 'auto', mb: 2, bgcolor: alpha(theme.palette.primary.main, 0.14), color: 'primary.main' }}>
        <PersonAddIcon />
      </Avatar>
      <Typography fontWeight={700}>Nenhum usuario cadastrado</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 2 }}>
        Adicione pessoas do time para separar conversas por atendente usando o mesmo acesso.
      </Typography>
      <GradientButton startIcon={<PersonAddIcon />} onClick={onAction} disabled={disabled}>
        Adicionar usuario
      </GradientButton>
    </Paper>
  );
};

export default function TeamManagement() {
  const queryClient = useQueryClient();
  const theme = useTheme();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);

  const { data, isLoading, isError } = useQuery('managedUsers', fetchTeamMembers);
  const members = data?.users || [];
  const limit = data?.limit || 0;
  const currentCount = data?.currentCount || 0;
  const isAdminView = data?.isAdminView || false;
  const activeCount = members.filter((member) => member.isActive).length;
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
      toast.success('Usuario atualizado!');
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Erro ao atualizar usuario.'),
  });

  const deleteMemberMutation = useMutation((memberId) => api.delete(`/manager/users/${memberId}`), {
    onSuccess: () => {
      queryClient.invalidateQueries('managedUsers');
      queryClient.invalidateQueries('teamMembersForMenu');
      toast.success('Usuario removido!');
      setMemberToDelete(null);
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Erro ao remover usuario.'),
  });

  const handleCreateSuccess = () => {
    queryClient.invalidateQueries('managedUsers');
    queryClient.invalidateQueries('teamMembersForMenu');
  };

  if (isLoading) {
    return (
      <Box sx={{ p: { xs: 2, sm: 3 } }}>
        <LinearProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ p: { xs: 2, sm: 3 } }}>
        <Alert severity="error">Nao foi possivel carregar os usuarios do time.</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Paper
        sx={{
          ...getGlassPanelSx(theme),
          p: 2,
          mb: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <GroupsIcon sx={{ fontSize: { xs: 32, sm: 40 }, color: 'primary.main' }} />
          <Box>
            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{ fontSize: { xs: '1.5rem', sm: '2rem' }, color: 'text.primary' }}
            >
              Gestao de Time
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.primary', mt: 0.5, opacity: 0.8 }}>
              Crie usuarios internos para operar o mesmo acesso e WhatsApp.
            </Typography>
          </Box>
        </Box>
        <GradientButton
          startIcon={<PersonAddIcon />}
          onClick={() => setCreateDialogOpen(true)}
          disabled={!canAddMember}
          sx={{ width: { xs: '100%', sm: 'auto' } }}
        >
          Adicionar usuario
        </GradientButton>
      </Paper>

      <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <SummaryCard
            title="Usuarios cadastrados"
            value={limitLabel}
            helper={isAdminView ? 'Visualizacao administrativa' : 'Uso do limite contratado'}
            icon={<GroupsIcon />}
            color={theme.palette.primary.main}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <SummaryCard
            title="Ativos"
            value={activeCount}
            helper="Aparecem no menu de conversas"
            icon={<PersonOutlineIcon />}
            color={theme.palette.success.main}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <SummaryCard
            title="Acesso"
            value="Unico"
            helper="Mesmo login principal e WhatsApp"
            icon={<VpnKeyIcon />}
            color={theme.palette.secondary.main}
          />
        </Grid>
      </Grid>

      {isAdminView && (
        <Alert severity="info" variant="outlined" sx={{ mb: 2 }}>
          Administradores visualizam os usuarios do time, mas a criacao deve ser feita no login do manager.
        </Alert>
      )}
      {!isAdminView && !canAddMember && (
        <Alert severity="warning" variant="outlined" sx={{ mb: 2 }}>
          Limite de usuarios do time atingido.
        </Alert>
      )}

      <Paper sx={{ ...getGlassPanelSx(theme), overflow: 'hidden' }}>
        <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Typography variant="h6" fontWeight={700}>Usuarios do time</Typography>
          <Typography variant="body2" color="text.secondary">
            Gerencie quem aparece como atendente nas conversas compartilhadas.
          </Typography>
        </Box>

        {members.length > 0 ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow
                  sx={{
                    '& th': {
                      color: 'text.secondary',
                      fontWeight: 700,
                      borderColor: alpha(theme.palette.divider, 0.7),
                      whiteSpace: 'nowrap',
                    },
                  }}
                >
                  <TableCell>Usuario</TableCell>
                  <TableCell>Funcao</TableCell>
                  <TableCell>Origem</TableCell>
                  <TableCell>Criado em</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="right">Acoes</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {members.map((member) => {
                  const ownerEmail = member.owner?.email;
                  const createdAt = member.createdAt ? format(new Date(member.createdAt), 'dd/MM/yyyy') : '-';

                  return (
                    <TableRow
                      key={member._id}
                      hover
                      sx={{
                        '& td': {
                          borderColor: alpha(theme.palette.divider, 0.7),
                        },
                      }}
                    >
                      <TableCell>
                        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 220 }}>
                          <Avatar
                            sx={{
                              bgcolor: alpha(theme.palette.primary.main, 0.18),
                              color: 'primary.main',
                              fontWeight: 800,
                            }}
                          >
                            {member.name?.charAt(0)?.toUpperCase() || 'U'}
                          </Avatar>
                          <Box sx={{ minWidth: 0 }}>
                            <Typography fontWeight={700} noWrap>{member.name}</Typography>
                            {ownerEmail && (
                              <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
                                {ownerEmail}
                              </Typography>
                            )}
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>{member.roleLabel || 'Atendente'}</TableCell>
                      <TableCell>
                        <Chip
                          label="Mesmo login e WhatsApp"
                          size="small"
                          variant="outlined"
                          sx={{
                            color: 'primary.main',
                            borderColor: alpha(theme.palette.primary.main, 0.35),
                            fontWeight: 700,
                          }}
                        />
                      </TableCell>
                      <TableCell>{createdAt}</TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
                          <Chip
                            label={member.isActive ? 'Ativo' : 'Inativo'}
                            size="small"
                            color={member.isActive ? 'success' : 'default'}
                            variant={member.isActive ? 'filled' : 'outlined'}
                            sx={{ minWidth: 72, fontWeight: 700 }}
                          />
                          <Switch
                            checked={!!member.isActive}
                            onChange={(event) => updateMemberMutation.mutate({
                              memberId: member._id,
                              updates: { isActive: event.target.checked },
                            })}
                            disabled={updateMemberMutation.isLoading}
                            color="success"
                          />
                        </Stack>
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Remover usuario">
                          <span>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => setMemberToDelete(member)}
                              disabled={deleteMemberMutation.isLoading}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box sx={{ p: 2 }}>
            <EmptyState onAction={() => setCreateDialogOpen(true)} disabled={!canAddMember} />
          </Box>
        )}
      </Paper>

      <CreateMemberDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSuccess={handleCreateSuccess}
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
