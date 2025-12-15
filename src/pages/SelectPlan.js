import React, { useState } from 'react';
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Divider,
  Container,
  CircularProgress
} from '@mui/material';
import { motion } from 'framer-motion';
import { CheckCircle } from '@mui/icons-material';
import { staggerContainer, fadeInUp } from '../components/AnimatedComponents';
import { useMutation } from 'react-query';
import api from '../services/api';
import { toast } from 'react-toastify';
import { useAuthStore } from '../stores/authStore';
import { useNavigate } from 'react-router-dom';

import { PLANS } from '../utils/constants';

const PlansSelectionPage = () => {
  const [loadingPlanId, setLoadingPlanId] = useState(null);
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const { mutate: createCheckoutSession, isLoading } = useMutation(
    (planId) => api.post('/payments/create-checkout-session', { planId }),
    {
      onSuccess: (response) => {
        if (response.data?.url) {
          toast.info('Redirecionando para o checkout...');
          window.location.href = response.data.url;
        } else {
          toast.error('Não foi possível obter a URL de checkout. Tente novamente.');
          setLoadingPlanId(null);
        }
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Erro ao criar a sessão de checkout. Certifique-se de que está logado.');
        setLoadingPlanId(null);
      },
    }
  );

  const handleSelectPlan = (plan) => {
    if (!isAuthenticated) {
        toast.info('Por favor, faça login ou crie uma conta para selecionar um plano.');
        navigate('/login', { state: { from: { pathname: '/signature' } } });
        return;
    }
    if (isLoading) return;
    setLoadingPlanId(plan.id);
    createCheckoutSession(plan.id);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        py: 8,
        background: 'linear-gradient(to bottom, #0f0c29, #1a153a)',
      }}
    >
      <Container maxWidth="xl"> 
        <Box
          component={motion.div}
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <Typography
            variant="h2"
            align="center"
            sx={{
              fontWeight: 700,
              mb: 4,
              color: '#e2d6ff'
            }}
          >
            Escolha Seu Plano
          </Typography>
          
          <Grid
            container
            spacing={4}
            justifyContent="center"
            alignItems="stretch" 
            sx={{
              mt: 4 
            }}
          >
            {PLANS.map((plan, index) => (
              <Grid
                item
                xs={12} 
                sm={6}  
                md={3}
                key={plan.id}
              >
                <motion.div
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.1 }}
                  style={{
                    height: '100%',
                    cursor: 'pointer',
                  }}
                  whileHover={{
                    y: -15,
                    scale: 1.02
                  }}
                  onClick={() => handleSelectPlan(plan)}
                >
                  <Card
                    sx={{
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      width: '100%',
                      height: '100%',
                      p: 4,
                      borderRadius: 4,
                      background: plan.highlight
                        ? 'linear-gradient(135deg, #3a1c71, #d76d77)'
                        : 'rgba(39, 34, 72, 0.9)',
                      color: '#d76d77',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                      border: '1px solid rgba(226, 214, 255, 0.2)',
                      transition: 'all 0.4s ease',
                      '&:hover': {
                        transform: 'translateY(-10px) scale(1.02)',
                        boxShadow: '0 16px 48px rgba(58, 28, 113, 0.5)',
                        borderColor: 'rgba(226, 214, 255, 0.4)',
                      }
                    }}
                  >
                    {loadingPlanId === plan.id && (
                      <Box sx={{
                        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        zIndex: 2, borderRadius: 4, color: 'white'
                      }}>
                        <CircularProgress color="inherit" />
                      </Box>
                    )}
                    <CardContent sx={{
                      textAlign: 'center',
                      flexGrow: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      p: 0
                    }}>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h5" sx={{
                          fontWeight: 700, mb: 2, fontSize: '1.8rem',
                          color: plan.highlight ? '#fff' : '#d76d77'
                        }}>
                          {plan.name}
                        </Typography>

                        {/* --- INÍCIO DA LÓGICA ALTERADA --- */}
                        <Box sx={{ minHeight: '60px', mb: 2 }}>
                          {/* Mostra a SUBSCRIPTION se for o PRIMEIRO card */}
                          {plan.subscription && index === 0 && (
                            <Typography variant="body2" sx={{ 
                              color: plan.highlight ? 'rgba(255,255,255,0.8)' : 'rgba(255, 206, 210, 0.8)',
                            }}>
                              {plan.subscription}
                            </Typography>
                          )}
                          {/* Mostra a DESCRIPTION se for o SEGUNDO ou TERCEIRO card */}
                          {plan.description && (index === 1 || index === 2) && (
                            <Typography variant="body2" sx={{ 
                              color: plan.highlight ? 'rgba(255,255,255,0.8)' : 'rgba(255, 206, 210, 0.8)',
                            }}>
                              {plan.description}
                            </Typography>
                          )}
                        </Box>
                        {/* --- FIM DA LÓGICA ALTERADA --- */}

                        <Divider sx={{
                          mb: 3, height: '2px',
                          background: plan.highlight ? 'rgba(255,255,255,0.3)' : 'rgba(226, 214, 255, 0.3)'
                        }} />

                        <Box component="ul" sx={{ listStyle: 'none', p: 0, mb: 4, textAlign: 'left' }}>
                          {plan.features.map((feature, i) => (
                            <Box component="li" key={i} sx={{ display: 'flex', alignItems: 'flex-start', mb: 2, px: 1, color: plan.highlight ? '#fff' : '#ffced2ff' }}>
                              <CheckCircle sx={{ fontSize: 20, mr: 1.5, mt: '2px', color: plan.highlight ? '#fff' : '#fecdd2ff' }} />
                              <Typography variant="body1" sx={{ lineHeight: 1.5 }}>{feature}</Typography>
                            </Box>
                          ))}
                        </Box>
                      </Box>
                      
                      <Box sx={{ mt: 'auto', pt: 2 }}>
                        {/* --- LÓGICA ALTERADA AQUI TAMBÉM --- */}
                        {/* Mostra a DESCRIPTION se for o PRIMEIRO card */}
                        {plan.description && index === 0 && (
                          <Typography 
                            variant="caption" 
                            component="p" 
                            sx={{ 
                              px: 1,
                              fontStyle: 'italic',
                              color: 'rgba(226, 214, 255, 0.7)'
                            }}
                          >
                            {plan.description}
                          </Typography>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
                
                <Box sx={{ mt: 2, textAlign: 'center', color: '#d76d77', fontSize: '0.9rem', px: 2, }}>
                  <Typography variant="body2">
                    <strong>1 semana grátis</strong> - Após esse período, será cobrada a primeira mensalidade de {plan.originalPrice}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default PlansSelectionPage;