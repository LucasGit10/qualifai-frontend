import React from 'react';
import { useQuery } from 'react-query';
import { Box, Typography, Paper, List, ListItem, ListItemAvatar, Avatar, ListItemText, CircularProgress, Alert, useTheme, Divider, Chip, Slide, Fade, Badge, keyframes } from '@mui/material';
import { EmojiEvents as EmojiEventsIcon, TrendingUp as TrendingUpIcon, AutoAwesome as CrownIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import api from '../services/api';
import { useAuthStore } from '../stores/authStore';
import { alpha } from '@mui/system';

// --- ANIMAÇÃO E ESTILOS ---
const pulseAnimation = (color) => keyframes`
  0% { box-shadow: 0 0 8px 3px ${alpha(color, 0.4)}, inset 0 0 6px 2px ${alpha(color, 0.3)}; }
  50% { box-shadow: 0 0 24px 8px ${alpha(color, 0.6)}, inset 0 0 12px 4px ${alpha(color, 0.4)}; }
  100% { box-shadow: 0 0 8px 3px ${alpha(color, 0.4)}, inset 0 0 6px 2px ${alpha(color, 0.3)}; }
`;

const getMedalStyle = (rank) => {
    switch (rank) {
        case 1: return { color: '#FFD700', name: 'gold' };
        case 2: return { color: '#C0C0C0', name: 'silver' };
        case 3: return { color: '#CD7F32', name: 'bronze' };
        default: return { color: 'transparent', name: 'default' };
    }
};

// --- COMPONENTES DA PÁGINA ---

const PodiumItem = ({ user, rank }) => {
    const isTop = rank === 1;
    const style = getMedalStyle(rank);
    const animation = pulseAnimation(style.color);

    return (
        <Box
            component={motion.div}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: rank * 0.2 }}
            sx={{
                display: 'flex',
                alignSelf: 'flex-end',
                mb: isTop ? 4 : 0,
                width: { xs: '33%', md: '28%' },
                zIndex: isTop ? 10 : 1,
            }}
        >
            <Paper
                sx={{
                    p: 2, position: 'relative', overflow: 'hidden',
                    width: '100%', borderRadius: 4,
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(15px)',
                    border: `2px solid ${alpha(style.color, 0.7)}`,
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    textAlign: 'center', gap: 1,
                    transform: isTop ? 'scale(1.15)' : 'scale(0.95)',
                    animation: `${animation} 3s infinite ease-in-out`,
                }}
            >
                <Typography variant="h1" sx={{
                    position: 'absolute', top: -10, right: 10,
                    fontWeight: 800, color: alpha(style.color, 0.1),
                    fontSize: { xs: '4rem', sm: '6rem' }
                }}>
                    {rank}º
                </Typography>
                <Badge overlap="circular" anchorOrigin={{ vertical: 'top', horizontal: 'right' }} badgeContent={isTop ? <CrownIcon sx={{ color: style.color, fontSize: '2.5rem' }} /> : null}>
                    <Avatar sx={{ width: isTop ? 90 : 70, height: isTop ? 90 : 70, mt: 2, border: `4px solid ${style.color}` }}>
                        {user.name.charAt(0)}
                    </Avatar>
                </Badge>
                <Typography variant="h6" fontWeight="bold" noWrap mt={1}>{user.name}</Typography>
                <Typography variant="h4" fontWeight="bold" sx={{ color: style.color }}>{user.hotLeads}</Typography>
                <Typography variant="body2" color="text.secondary">Leads Qualificados</Typography>
            </Paper>
        </Box>
    );
};

const RankingListItem = ({ user, rank }) => {
    const { user: currentUser } = useAuthStore();
    const theme = useTheme();
    const isCurrentUser = currentUser._id === user.userId;
    return (
         <ListItem sx={{ borderRadius: 2, backgroundColor: isCurrentUser ? alpha(theme.palette.primary.main, 0.2) : 'transparent', transition: 'background-color 0.2s', '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.1) } }}>
            <ListItemText primary={<Typography sx={{ fontWeight: 700, minWidth: '40px' }}>{rank}º</Typography>} sx={{ flex: 'none', mr: 2 }} />
            <ListItemAvatar><Avatar sx={{ bgcolor: 'primary.dark' }}>{user.name.charAt(0)}</Avatar></ListItemAvatar>
            <ListItemText primary={<Typography sx={{ fontWeight: 600 }}>{user.name} {isCurrentUser && "(Você)"}</Typography>} secondary="Vendedor" />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto' }}>
                <TrendingUpIcon color="success" />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{user.hotLeads}</Typography>
            </Box>
        </ListItem>
    );
};

export default function Ranking() {
    const { data: rankingData, isLoading, isError } = useQuery('salesRanking', () => api.get('/ranking').then(res => res.data), { refetchInterval: 30000 });
    const topThree = rankingData ? rankingData.slice(0, 3) : [];
    const restOfRanking = rankingData ? rankingData.slice(3) : [];

    return (
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
            <Fade in timeout={500}>
                <Paper sx={{ p: 2, mb: 3, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2, backgroundColor: 'rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                    <EmojiEventsIcon color="primary" sx={{ fontSize: 40 }}/>
                    <Typography variant="h4" fontWeight="bold">Ranking de Vendas</Typography>
                </Paper>
            </Fade>

            {isLoading ? <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress size={50} /></Box>
             : isError ? <Alert severity="error">Não foi possível carregar o ranking.</Alert>
             : !rankingData || rankingData.length === 0 ? <Alert severity="info" variant="outlined">Ainda não há dados para exibir o ranking este mês.</Alert>
             : (
                <>
                    <Slide direction="down" in timeout={500}>
                        <Paper sx={{ p: 3, mb: 3, borderRadius: 3, overflow: 'hidden', backgroundColor: 'transparent', border: 'none' }}>
                             <Typography variant="h5" align="center" sx={{ fontWeight: 'bold', mb: 4 }}>Pódio do Mês</Typography>
                             <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: { xs: 1, sm: 2 }, minHeight: 320 }}>
                                {topThree.length >= 2 && <PodiumItem user={topThree[1]} rank={2} />}
                                {topThree.length >= 1 && <PodiumItem user={topThree[0]} rank={1} />}
                                {topThree.length >= 3 && <PodiumItem user={topThree[2]} rank={3} />}
                             </Box>
                        </Paper>
                    </Slide>

                    {restOfRanking.length > 0 && (
                        <Slide direction="up" in timeout={700}>
                            <Paper sx={{ p: 3, borderRadius: 3, backgroundColor: 'rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                                <Typography variant="h6" gutterBottom>Classificação Geral</Typography>
                                <List>
                                    {restOfRanking.map((user, index) => (
                                        <React.Fragment key={user.userId}>
                                            <RankingListItem user={user} rank={index + 4} />
                                            {index < restOfRanking.length - 1 && <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />}
                                        </React.Fragment>
                                    ))}
                                </List>
                            </Paper>
                        </Slide>
                    )}
                </>
            )}
        </Box>
    );
}