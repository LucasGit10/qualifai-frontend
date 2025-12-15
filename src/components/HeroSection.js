import React, { useRef, useEffect, useState } from 'react';
import {
  Typography,
  Button,
  Box,
  Container,
  Grid,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { motion } from 'framer-motion';
import { useTranslation, Trans } from 'react-i18next';
import CustomAppBar from './CustomAppBar';

// Como useNavigate não funciona neste ambiente, um mock é fornecido.
const useNavigate = () => (path) => console.log(`Navegando para: ${path}`);

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const fadeInUp = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6 } },
};

function HeroSection() {
  const { t } = useTranslation();
  const videoRef = useRef(null);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleScheduleClick = () => {
    navigate(`/register-calendar?email=${encodeURIComponent(email)}`);
  };
  
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.75;
    }
  }, []);

  return (
    <Box 
      sx={{ 
        position: 'relative', 
        width: '100%', 
        minHeight: { xs: '90vh', md: '100vh' }, 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          top: 0,
          left: 0,
          objectFit: 'cover',
          borderRadius: '0 0 35px 35px',
          zIndex: 0,
        }}
      >
        <source src="/hero-video.mp4" type="video/mp4" />
      </video>

      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(to bottom, rgba(213, 204, 228, 0.8), rgba(172, 123, 212, 0.95))', 
          borderRadius: '0 0 35px 35px',
          zIndex: 1,
        }}
      />

      <Container maxWidth="xl" sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        py: { xs: 4, md: 8 },
        pt: { xs: 10, md: 12 },
        pb: 15,
        position: 'relative',
        alignItems: 'center',
        px: { xs: 1, md: 4 }, 
        zIndex: 2,
      }}>
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            maxWidth: '1200px',
            zIndex: 10,
          }}
        >
          <CustomAppBar />
        </Box>

        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          <MenuItem onClick={handleClose}>Blog</MenuItem>
          <MenuItem onClick={handleClose}>Contato</MenuItem>
        </Menu>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <motion.div variants={fadeInUp}>
            <Typography 
              variant="h1" 
              component="h1"
              sx={{ 
                fontWeight: 700,
                fontSize: { xs: '2.1rem', sm: '3.5rem', md: '4rem' },
                mb: 3,
                lineHeight: 1.2,
                color: '#1A0A3A',
                fontFamily: '"Nunito Sans", sans-serif',
                textAlign: 'center',
                whiteSpace: 'pre-line' 
              }}
              dangerouslySetInnerHTML={{ __html: t('hero.title') }}
            >
            </Typography>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <Typography 
              variant="h5" 
              component="p"
              sx={{ 
                color: '#000000',
                maxWidth: 800,
                mx: 'auto',
                mb: 5,
                fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.5rem' },
                lineHeight: 1.6,
                fontFamily: '"Nunito Sans", sans-serif',
                textAlign: 'center',
              }}
            >
              <Trans i18nKey="hero.subtitle">
                Nossa <strong>IA de qualificação de leads, conversas e agenda reuniões</strong> somente com quem realmente quer comprar. Liberte seus vendedores para o que eles fazem de melhor: <strong>fechar negócios.</strong>
              </Trans>
            </Typography>
          </motion.div>
          
          {/* <motion.div variants={fadeInUp}>
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: { xs: 'column', sm: 'row' },
                width: '100%',
                maxWidth: '700px'
              }}
            >
              <Box
                component="input"
                type="email"
                placeholder={t('hero.emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{
                  width: { xs: '100%', sm: '377px' },
                  height: 57,
                  border: '1px solid #7356FC',
                  borderRadius: '15px',
                  px: 2,
                  fontSize: '16px',
                  fontFamily: 'Poppins, sans-serif',
                  '&:focus': {
                    outline: 'none',
                    borderColor: '#48287D',
                  },
                }}
              />
              <Button
                variant="contained"
                onClick={handleScheduleClick}
                sx={{
                  width: { xs: '100%', sm: '318px' },
                  height: 57,
                  borderRadius: '15px',
                  bgcolor: '#DC3884',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '16px',
                  textTransform: 'none',
                  '&:hover': {
                    bgcolor: '#B8286C',
                  },
                }}
              >
                {t('hero.scheduleButton')}
              </Button>
            </Box>
          </motion.div>
           */}
          <motion.div variants={fadeInUp} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <Grid 
              container 
              justifyContent="center" 
              sx={{ 
                mt: 8,
                width: '100%',
              }}
            >
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Box
                  sx={{
                    width: { xs: '100%', md: '90%', lg: '95%' },
                    aspectRatio: '16 / 9',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: { xs: '15px', md: '25px' },
                    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                    background: 'rgba(255, 255, 255, 0.01)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    p: { xs: 1, md: 2 },
                  }}
                >
                  <Box
                    sx={{
                      width: '100%',
                      height: '100%',
                      backgroundImage: "url('/dashboard.png')",
                      backgroundSize: '100% 100%',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                      borderRadius: { xs: '12px', md: '20px' },
                      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                      zIndex: 2,
                    }}
                  />

                  <Box
                    sx={{
                      position: 'absolute',
                      top: '0%',
                      left: { xs: '40%', md: '50%' },
                      transform: 'translate(-50%, -50%)',
                      width: { xs: '45px', md: '80px' },
                      height: { xs: '45px', md: '80px' },
                      background: `
                        radial-gradient(circle at 50% 120%, rgba(255, 255, 255, 0.8), transparent 70%), 
                        rgba(255, 255, 255, 0.05)
                      `,
                      borderRadius: '50%',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
                      backdropFilter: 'blur(45px) saturate(200%) brightness(1.1)',
                      WebkitBackdropFilter: 'blur(45px) saturate(200%) brightness(1.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 4,
                      overflow: 'hidden',
                    }}
                  >
                    <img 
                      src="/icons/Frame 6-1.svg" 
                      alt="Ícone de E-mail verificado" 
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        borderRadius: '50%',
                        objectFit: 'cover'
                      }} 
                    />
                  </Box>

                  <Box
                    sx={{
                      position: 'absolute',
                      width: { xs: '55px', md: '90px' },
                      height: { xs: '55px', md: '90px' },
                      top: { xs: 'auto', md: '50%' },
                      left: { xs: '80%', md: '0%' }, 
                      bottom: { xs: '3%', md: 'auto' },
                      right: { xs: 'auto' },
                      transform: { xs: 'translate(-50%, 50%)', md: 'translate(-50%, -50%)' },
                      background: `
                        radial-gradient(circle at 50% 120%, rgba(255, 255, 255, 0.8), transparent 70%), 
                        rgba(255, 255, 255, 0.05)
                      `,
                      borderRadius: '50%',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
                      backdropFilter: 'blur(45px) saturate(200%) brightness(1.1)',
                      WebkitBackdropFilter: 'blur(45px) saturate(200%) brightness(1.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 4,
                      overflow: 'hidden',
                    }}
                  >
                    <img 
                      src="/icons/Frame 6.svg" 
                      alt="Ícone do WhatsApp" 
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        borderRadius: '50%',
                        objectFit: 'cover'
                      }} 
                    />
                  </Box>

                  <Box
                    sx={{
                      // 1. VISIBILIDADE: Escondido por padrão em telas menores (como tablets e celulares).
                      display: { xs: 'none', lg: 'block' },

                      // 2. LARGURA RESPONSIVA: Continua fluida para telas grandes.
                      width: 'clamp(200px, 18vw, 278.85px)',

                      // 3. REGRA ESPECIAL: Força o desaparecimento abaixo de 1700px.
                      '@media (max-width: 1700px)': {
                        display: 'none',
                      },

                      // 4. POSICIONAMENTO: Seus outros estilos.
                      position: 'absolute',
                      top: '40%',
                      right: 0,
                      transform: 'translate(50%, -50%)',
                      zIndex: 4,
                    }}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '40px',
                        left: '14px',
                        width: '251px',
                        height: '84px',
                        background: 'rgba(233, 193, 255, 0.2)',
                        borderRadius: '13.5px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                        backdropFilter: 'blur(15px)',
                        WebkitBackdropFilter: 'blur(15px)',
                        zIndex: 1,
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '20px',
                        left: '7px',
                        width: '265px',
                        height: '88px',
                        background: 'rgba(233, 193, 255, 0.2)',
                        borderRadius: '13.5px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                        backdropFilter: 'blur(15px)',
                        WebkitBackdropFilter: 'blur(15px)',
                        zIndex: 2,
                      }}
                    />
                    <Box
                      sx={{
                        position: 'relative',
                        width: '278.85px',
                        height: '92.95px',
                        background: 'rgba(233, 193, 255, 0.2)',
                        borderRadius: '13.5px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                        backdropFilter: 'blur(15px)',
                        WebkitBackdropFilter: 'blur(15px)',
                        display: 'flex',
                        alignItems: 'center',
                        p: 2,
                        gap: 2,
                        zIndex: 3,
                      }}
                    >
                      <Box
                        sx={{
                          width: '65px',
                          height: '65px',
                          borderRadius: '50%',
                          bgcolor: 'purple',
                          backgroundImage: "url('/image-blog.jpg')",
                          backgroundRepeat: 'no-repeat',
                          backgroundSize: 'contain',
                          backgroundPosition: 'center center',
                        }}
                      />
                      
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <Box
                          sx={{
                            bgcolor: '#48287D',
                            color: 'white',
                            fontSize: '10px',
                            fontWeight: 'bold',
                            px: 1,
                            py: 0.5,
                            borderRadius: '5px',
                            textTransform: 'uppercase',
                            width: 'fit-content',
                          }}
                        >
                          NOVO LEAD
                        </Box>
                        <Box
                          sx={{
                            width: '150px',
                            height: '14px',
                            bgcolor: 'white',
                            opacity: 0.5,
                            borderRadius: '5px',
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  );
}

export default HeroSection;