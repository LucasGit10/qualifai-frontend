import { Box, Grid, Typography, IconButton, Link as MuiLink } from '@mui/material';
import { Instagram, LinkedIn } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const socialIcons = [
  { icon: <Instagram />, url: 'https://instagram.com/qualifai.tech?igsh=OHp2azVtczd6Zzcw' },
  { icon: <LinkedIn />, url: 'https://www.linkedin.com/company/qualifaitech/' },
];

const usefulLinksData = [
  { tKey: 'blog', href: '/blog' },
  { tKey: 'home', href: '/' },
  { tKey: 'contact', href: '/register-calendar' },
];

const Footer = () => {
  const { t } = useTranslation();

  return (
    <Box
      component="footer"
      sx={{
        width: '100%',
        background: '#0F0C29',
        color: 'common.white',
        px: { xs: 2, sm: 4, md: 10 },
        py: { xs: 4, md: 6 },
        mt: 'auto',
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.2)',
      }}
    >
      <Box>
        <Grid container spacing={5} alignItems="flex-start">
          
          {/* ÁREA MODIFICADA AQUI */}
          <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', md: 'flex-start' } }}>
            {/* Este Box agora é flex para segurar as duas imagens */}
            <Box sx={{ 
              mb: 2,
              display: 'flex',        // <-- Adicionado
              alignItems: 'center',   // <-- Adicionado
              gap: 2                  // <-- Adicionado (ajuste o espaçamento)
            }}>
              {/* Sua logo original */}
              <img
                src="/Fundo transparente(1) 1.png"
                alt="Logo QualifAI"
                style={{ height: '80px', width: 'auto' }}
              />

              {/* SUA NOVA IMAGEM AQUI */}
              <img
                src="/meta.png" // <-- TROQUE O SRC
                alt="meta"         // <-- TROQUE O ALT
                style={{ height: '60px', width: 'auto' }} // <-- Ajuste o estilo
              />
            </Box>
            
            <Typography variant="body2" sx={{ maxWidth: 300, color: '#FFFFFF', lineHeight: '24px', fontSize: '16px', textAlign: { xs: 'center', md: 'left' } }}>
              {t('footer.tagline')}
            </Typography>
          </Grid>
          
          {/* O resto do footer continua igual... */}
          <Grid item xs={6} md={3} sx={{ ml: { md: 'auto' } }}>
            <Box>
              <Typography variant="h6" fontWeight={600} mb={2} sx={{ color: '#FFFFFF', textShadow: '0 2px 4px rgba(0,0,0,0.2)', fontFamily: 'Poppins', fontSize: '16px' }}>
                {t('footer.navigationTitle')}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {usefulLinksData.map(({ tKey, href }) => (
                <motion.div key={tKey} whileHover={{ x: 5 }}>
                  <MuiLink component={RouterLink} to={href} variant="body2" sx={{ color: '#FFFFFF', textDecoration: 'none', fontFamily: 'Poppins', fontSize: '14px', lineHeight: '21px', '&:hover': { color: '#ffced2', textDecoration: 'underline' }, cursor: 'pointer' }}>
                    {t(`footer.usefulLinks.${tKey}`)}
                  </MuiLink>
                </motion.div>
              ))}
            </Box>
          </Grid>
          
          <Grid item xs={6} md={3} sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'flex-end', md: 'flex-start' } }}>
            <Box>
              <Typography variant="h6" fontWeight={600} mb={2} sx={{ color: '#FFFFFF', textShadow: '0 2px 4px rgba(0,0,0,0.2)', fontFamily: 'Poppins', fontSize: '16px' }}>
                {t('footer.socialMediaTitle')}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: '15px' }}>
              {socialIcons.map(({ icon, url }, index) => (
                <motion.div key={index} whileHover={{ scale: 1.2, rotate: 10 }} whileTap={{ scale: 0.9 }}>
                  <IconButton component="a" href={url} target="_blank" rel="noopener noreferrer" sx={{ color: '#fff', width: 36, height: 36, borderRadius: '18px', bgcolor: '#DC3884', '&:hover': { backgroundColor: 'rgba(215, 109, 119, 0.2)' } }}>
                    {icon}
                  </IconButton>
                </motion.div>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* ... (Resto do seu código de copyright) ... */}
      <Box mt={8} borderTop={`1px solid #272061`}>
        <Box sx={{ pt: 4 }}>
          {/* <<< LAYOUT PARA TELAS GRANDES (DESKTOP) */}
          <Grid container justifyContent="space-between" alignItems="center" sx={{ display: { xs: 'none', sm: 'flex' } }}>
            <Grid item>
              <MuiLink component={RouterLink} to="/privacy" variant="body2" sx={{ color: '#FFFFFF', fontSize: '12px', lineHeight: '18px', textDecoration: 'none', '&:hover': { color: '#ffced2', textDecoration: 'underline' } }}>
                {t('footer.privacyPolicy')}
              </MuiLink>
            </Grid>
            <Grid item>
              <MuiLink component={RouterLink} to="/terms" variant="body2" sx={{ color: '#FFFFFF', fontSize: '12px', lineHeight: '18px', textDecoration: 'none', '&:hover': { color: '#ffced2', textDecoration: 'underline' } }}>
                {t('footer.termsOfUse')}
              </MuiLink>
            </Grid>
            <Grid item>
              <Typography variant="body2" sx={{ color: '#FFFFFF', fontSize: '12px', lineHeight: '18px' }}>
                {t('footer.copyright', { year: new Date().getFullYear() })}
              </Typography>
            </Grid>
          </Grid>

          {/* <<< LAYOUT PARA TELAS PEQUENAS (MOBILE) */}
          <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
              <MuiLink component={RouterLink} to="/privacy" variant="body2" sx={{ color: '#FFFFFF', fontSize: '12px', lineHeight: '18px', textDecoration: 'none', '&:hover': { color: '#ffced2', textDecoration: 'underline' } }}>
                {t('footer.privacyPolicy')}
              </MuiLink>
              <MuiLink component={RouterLink} to="/terms" variant="body2" sx={{ color: '#FFFFFF', fontSize: '12px', lineHeight: '18px', textDecoration: 'none', '&:hover': { color: '#ffced2', textDecoration: 'underline' } }}>
                {t('footer.termsOfUse')}
              </MuiLink>
            </Box>
            <Box borderTop={`1px solid #272061`} pt={4}>
              <Typography variant="body2" sx={{ color: '#FFFFFF', fontSize: '12px', lineHeight: '18px', textAlign: 'center' }}>
                {t('footer.copyright', { year: new Date().getFullYear() })}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;