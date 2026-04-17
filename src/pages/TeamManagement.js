import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Box, Typography, Paper, Switch, CircularProgress, Tooltip, useTheme, alpha, TextField, Grid, Button, Card, CardContent, Alert, IconButton, Chip, Avatar, Menu, MenuItem, Divider, DialogTitle, DialogContent, DialogActions, Pagination, Fade, Grow, Slide } from '@mui/material';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'react-toastify';
import { Groups as GroupsIcon, PersonAdd as PersonAddIcon, Delete as DeleteIcon, Visibility, VisibilityOff, CalendarMonth as CalendarMonthIcon, Warning as WarningIcon } from '@mui/icons-material';
import api from '../services/api';
import { USE_MOCKS } from '../config/env';
import { MOCK_TEAM_MEMBERS } from '../mocks';
import { StyledDialog } from '../components/ui/StyledDialog';
import { GradientButton } from '../components/ui/GradientButton';

const fetchManagedUsers = async () => {
    const { data } = await api.get('/manager/users');
    return data;
};

const CreateUserDialog = ({ open, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const createUserMutation = useMutation((userData) => api.post('/manager/users', userData), {
        onSuccess: () => { toast.success('Usuário de vendas criado com sucesso!'); onSuccess(); onClose(); },
        onError: (error) => toast.error(error.response?.data?.message || 'Erro ao criar usuário'),
    });
    const handleSubmit = (e) => { e.preventDefault(); createUserMutation.mutate(formData); };
    const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    return (
        <StyledDialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Adicionar Vendedor à Equipe</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent><Grid container spacing={2} sx={{ pt: 1 }}><Grid item xs={12}><TextField fullWidth name="name" label="Nome Completo" value={formData.name} onChange={handleChange} required /></Grid><Grid item xs={12}><TextField fullWidth name="email" label="Email" type="email" value={formData.email} onChange={handleChange} required /></Grid><Grid item xs={12}><TextField fullWidth name="password" label="Senha Provisória" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange} required helperText="O usuário deverá alterar a senha no primeiro login." InputProps={{ endAdornment: <IconButton onClick={() => setShowPassword(!showPassword)}>{showPassword ? <VisibilityOff/> : <Visibility/>}</IconButton> }} /></Grid></Grid></DialogContent>
                <DialogActions sx={{ p: '16px 24px' }}><Button onClick={onClose} color="inherit" disabled={createUserMutation.isLoading}>Cancelar</Button><GradientButton type="submit" loading={createUserMutation.isLoading}>Adicionar Usuário</GradientButton></DialogActions>
            </form>
        </StyledDialog>
    );
};

const DeleteUserDialog = ({ open, onClose, onConfirm, userName, isLoading }) => {
    const theme = useTheme();
    return (
        <StyledDialog open={open} onClose={onClose} maxWidth="xs">
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><WarningIcon color="error"/>Confirmar Exclusão</DialogTitle>
            <DialogContent>
                <Typography>Você tem certeza que deseja excluir permanentemente o usuário <Typography component="span" fontWeight="bold">{userName}</Typography>?</Typography>
                <Alert severity="error" sx={{ mt: 2 }}>Esta ação é irreversível.</Alert>
            </DialogContent>
            <DialogActions sx={{ p: '16px 24px' }}>
                <Button onClick={onClose} color="inherit" disabled={isLoading}>Cancelar</Button>
                <GradientButton onClick={onConfirm} loading={isLoading} color="error" sx={{ background: theme.palette.error.main }}>Excluir</GradientButton>
            </DialogActions>
        </StyledDialog>
    );
};

// ALTERAÇÃO: Trocado o menu de 3 pontos pelo ícone de lixeira
const UserCard = ({ user, onStatusChange, onDelete, isUpdating }) => {
    const theme = useTheme();

    return (
        <Card sx={{ p: 2, borderRadius: 3, backgroundColor: 'rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.2)', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, overflow: 'hidden', minWidth: 0 }}>
                    <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.3), color: 'primary.light', flexShrink: 0 }}>
                        {user.name.charAt(0)}
                    </Avatar>
                    <Box sx={{ overflow: 'hidden' }}>
                        <Typography variant="body1" fontWeight="bold" noWrap>{user.name}</Typography>
                        <Typography variant="body2" color="text.secondary" noWrap>{user.email}</Typography>
                    </Box>
                </Box>
                <Tooltip title="Excluir Usuário">
                    <IconButton size="small" onClick={() => onDelete(user)} sx={{ flexShrink: 0 }}>
                        <DeleteIcon color="error" />
                    </IconButton>
                </Tooltip>
            </Box>
            <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 1 }}>
                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarMonthIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">Membro desde: {format(new Date(user.createdAt), 'dd/MM/yyyy')}</Typography>
                </Box>
                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {user.role && <Chip label={user.role} size="small" variant="outlined" />}
                </Box>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, pt: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <Typography variant="body2" fontWeight={500}>{user.isActive ? 'Ativo' : 'Inativo'}</Typography>
                <Switch checked={user.isActive} onChange={(e) => onStatusChange(user._id, { isActive: e.target.checked })} disabled={isUpdating} color="success" />
            </Box>
        </Card>
    );
};

export default function TeamManagement() {
    const queryClient = useQueryClient();
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [page, setPage] = useState(1);
    
    const USERS_PER_PAGE = 6;
    const { data, isLoading, isError } = useQuery('managedUsers', async () => {
        if (USE_MOCKS) {
            return {
                users: MOCK_TEAM_MEMBERS,
                limit: 10,
                currentCount: MOCK_TEAM_MEMBERS.length,
                isAdminView: false
            };
        }
        return fetchManagedUsers();
    });
    
    const users = data?.users || [];
    const limit = data?.limit || 0;
    const currentCount = data?.currentCount || 0;
    const isAdminView = data?.isAdminView || false;
    const canAddUser = currentCount < limit;
    
    const paginatedUsers = useMemo(() => users.slice((page - 1) * USERS_PER_PAGE, page * USERS_PER_PAGE), [users, page]);
    const pageCount = Math.ceil(users.length / USERS_PER_PAGE);
    const handlePageChange = (event, value) => setPage(value);

    const updateUserMutation = useMutation(({ userId, updates }) => api.put(`/manager/users/${userId}`, updates), { onSuccess: () => { queryClient.invalidateQueries('managedUsers'); toast.success('Usuário atualizado!'); }, onError: (error) => toast.error(error.response?.data?.message || 'Erro ao atualizar.'), });
    const deleteUserMutation = useMutation((userId) => api.delete(`/manager/users/${userId}`), { onSuccess: () => { queryClient.invalidateQueries('managedUsers'); toast.success('Usuário excluído!'); setDeleteDialogOpen(false); setUserToDelete(null); }, onError: (error) => toast.error(error.response?.data?.message || 'Erro ao excluir.'), });

    const handleUpdate = (userId, updates) => updateUserMutation.mutate({ userId, updates });
    
    const handleDeleteRequest = (user) => {
        setUserToDelete(user);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if(userToDelete) deleteUserMutation.mutate(userToDelete._id);
    };

    if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>;
    if (isError) return <Alert severity="error">Não foi possível carregar os dados da equipe.</Alert>;

    return (
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
            <Fade in timeout={500}>
                <Paper sx={{ p: 2, mb: 3, borderRadius: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                    <Box display="flex" alignItems="center" gap={2}><GroupsIcon sx={{ fontSize: 40 }} /><Typography variant="h4" fontWeight="bold">Gestão de Time</Typography></Box>
                </Paper>
            </Fade>

            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Slide direction="right" in timeout={500}>
                        <Paper sx={{ p: 3, borderRadius: 3, backgroundColor: 'rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.2)', textAlign: 'center', height: '100%' }}>
                            <Typography variant="h6">Licenças Utilizadas</Typography>
                            <Box sx={{ position: 'relative', display: 'inline-flex', my: 2 }}><CircularProgress variant="determinate" value={(currentCount / limit) * 100} size={100} thickness={4} /><Box sx={{ top: 0, left: 0, bottom: 0, right: 0, position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Typography variant="h5" component="div" fontWeight="bold">{`${currentCount}/${limit}`}</Typography></Box></Box>
                            <GradientButton fullWidth startIcon={<PersonAddIcon />} onClick={() => setCreateDialogOpen(true)} disabled={!canAddUser || isAdminView}>Adicionar Vendedor</GradientButton>
                            {!canAddUser && <Alert severity="warning" variant="outlined" sx={{ mt: 2, textAlign: 'left' }}>Limite de usuários atingido.</Alert>}
                        </Paper>
                    </Slide>
                </Grid>

                <Grid item xs={12} md={8}>
                    <Slide direction="left" in timeout={500}>
                        <Paper sx={{ p: 2, borderRadius: 3, backgroundColor: 'rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.2)', display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                                {paginatedUsers.length > 0 ? paginatedUsers.map((user, index) => (
                                    <Grid item xs={12} sm={6} lg={4} key={user._id}>
                                        <Grow in timeout={300 + index * 100}>
                                            <Box sx={{ height: '100%' }}>
                                                <UserCard user={user} onStatusChange={handleUpdate} onDelete={handleDeleteRequest} isUpdating={updateUserMutation.isLoading}/>
                                            </Box>
                                        </Grow>
                                    </Grid>
                                )) : <Typography sx={{p:3}}>Nenhum usuário encontrado.</Typography>}
                            </Grid>
                            {pageCount > 1 && (<Box sx={{ display: 'flex', justifyContent: 'center', pt: 3, mt: 'auto' }}><Pagination count={pageCount} page={page} onChange={handlePageChange} color="primary" /></Box>)}
                        </Paper>
                    </Slide>
                </Grid>
            </Grid>

            <CreateUserDialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} onSuccess={() => queryClient.invalidateQueries('managedUsers')} />
            <DeleteUserDialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} onConfirm={handleConfirmDelete} userName={userToDelete?.name} isLoading={deleteUserMutation.isLoading} />
        </Box>
    );
}