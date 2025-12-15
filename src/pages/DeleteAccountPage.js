import React, { useState } from 'react'; // <--- CORREÇÃO AQUI
import { useNavigate } from 'react-router-dom';
import {
  Accordion, AccordionSummary, AccordionDetails, Alert, Box, Button, Container,
  Divider, Modal, Paper, Stack, Typography, ListItemIcon, List, ListItem,
  ListItemText, alpha, useTheme, CssBaseline, Fade, Slide, CircularProgress, IconButton
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import GavelIcon from '@mui/icons-material/Gavel';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import SecurityIcon from '@mui/icons-material/Security';
import BlockIcon from '@mui/icons-material/Block';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import DescriptionIcon from '@mui/icons-material/Description';
import { useTranslation } from 'react-i18next';
import { GradientButton } from '../components/ui/GradientButton';

const PolicySection = ({ icon, title, children }) => (
  <Accordion sx={{
    boxShadow: 'none',
    backgroundColor: 'transparent',
    backgroundImage: 'none',
    '&:not(:last-child)': { borderBottom: '1px solid rgba(255, 255, 255, 0.12)' },
    '&:before': { display: 'none' },
    '&.Mui-expanded': { margin: 0 }
  }}>
    <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{
      borderRadius: 1,
      transition: 'background-color 0.2s',
      '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.05)' }
    }}>
      <Stack direction="row" alignItems="center" spacing={1.5}>
        <ListItemIcon sx={{ minWidth: 'auto', color: 'primary.light' }}>{icon}</ListItemIcon>
        <Typography variant="h6" component="h2" sx={{fontSize: '1.1rem', fontWeight: '500'}}>{title}</Typography>
      </Stack>
    </AccordionSummary>
    <AccordionDetails sx={{ pt: 2, color: 'text.secondary' }}>
      {children}
    </AccordionDetails>
  </Accordion>
);

export default function DeleteAccountPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const [openModal, setOpenModal] = useState(false);
  const daysRemaining = 12;

  const deletionConditions = t('deleteAccountPage.sections.deletionConditions.conditions', { returnObjects: true }) || [];
  const retentionConditions = t('deleteAccountPage.sections.dataRetention.conditions', { returnObjects: true }) || [];
  const cancellationConditions = t('deleteAccountPage.sections.autoCancellation.conditions', { returnObjects: true }) || [];
  const deadlineConditions = t('deleteAccountPage.sections.cancellationDeadlines.conditions', { returnObjects: true }) || [];
  const rightsConditions = t('deleteAccountPage.sections.userRights.conditions', { returnObjects: true }) || [];

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);
  const handleGoBack = () => navigate(-1);

  const handleScheduleDeletion = () => { console.log('Agendado'); handleCloseModal(); navigate('/app/settings'); };
  const handleDeleteNow = () => { console.log('Excluído'); handleCloseModal(); navigate('/login'); };

  return (
    <>
      <CssBaseline />
        <Container maxWidth={false} sx={{ px: { xs: 2, sm: 4, md: 6 } }}>
          
          <Slide direction="up" in timeout={500}>
            <Paper sx={{ 
              position: 'relative',
              p: { xs: 2, sm: 4 }, 
              borderRadius: 4, 
              backgroundColor: 'rgba(255, 255, 255, 0.08)', 
              backdropFilter: 'blur(15px)', 
              border: '1px solid rgba(255, 255, 255, 0.2)' 
            }}>
              <IconButton
                aria-label="voltar"
                onClick={handleGoBack}
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                }}
              >
                <CloseIcon />
              </IconButton>

              <Box sx={{ textAlign: 'center', mb: 2, mt: { xs: 3, sm: 0 } }}>
                <DescriptionIcon color="primary" sx={{ fontSize: 40, mb:1 }}/>
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>{t('deleteAccountPage.mainTitle')}</Typography>
                <Typography variant="caption" color="text.secondary">{t('deleteAccountPage.lastUpdated')}</Typography>
              </Box>
              
              <Divider sx={{ my: 3, borderColor: 'rgba(255, 255, 255, 0.2)' }} />

              <Typography variant="body1" paragraph sx={{ color: 'text.secondary', fontSize: '1.05rem', lineHeight: 1.7 }}>{t('deleteAccountPage.introParagraph')}</Typography>

              <Box sx={{ mt: 4, border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: 2, overflow: 'hidden' }}>
                <PolicySection icon={<DeleteForeverIcon />} title={t('deleteAccountPage.sections.deletionRequest.title')}>
                    <Typography variant="body1" paragraph>{t('deleteAccountPage.sections.deletionRequest.paragraph')}</Typography>
                    <Stack spacing={1} sx={{ pl: 2 }}>
                        <Typography><strong>{t('deleteAccountPage.sections.deletionRequest.email')}</strong> contato@qualifai.tech</Typography>
                    </Stack>
                </PolicySection>
                <PolicySection icon={<EventBusyIcon />} title={t('deleteAccountPage.sections.deletionConditions.title')}><Typography paragraph>{t('deleteAccountPage.sections.deletionConditions.paragraph')}</Typography><List dense>{deletionConditions.map(text => (<ListItem key={text}><ListItemIcon sx={{minWidth: 24}}>•</ListItemIcon><ListItemText primary={text}/></ListItem>))}</List></PolicySection>
                <PolicySection icon={<SecurityIcon />} title={t('deleteAccountPage.sections.dataRetention.title')}><Typography paragraph>{t('deleteAccountPage.sections.dataRetention.paragraph')}</Typography><List dense>{retentionConditions.map(text => (<ListItem key={text}><ListItemIcon sx={{minWidth: 24}}>•</ListItemIcon><ListItemText primary={text}/></ListItem>))}</List></PolicySection>
                <PolicySection icon={<BlockIcon />} title={t('deleteAccountPage.sections.autoCancellation.title')}><Typography paragraph>{t('deleteAccountPage.sections.autoCancellation.paragraph')}</Typography><List dense>{cancellationConditions.map(text => (<ListItem key={text}><ListItemIcon sx={{minWidth: 24}}>•</ListItemIcon><ListItemText primary={text}/></ListItem>))}</List></PolicySection>
                <PolicySection icon={<GavelIcon />} title={t('deleteAccountPage.sections.cancellationDeadlines.title')}><Typography paragraph>{t('deleteAccountPage.sections.cancellationDeadlines.paragraph')}</Typography><List dense>{deadlineConditions.map(text => (<ListItem key={text}><ListItemIcon sx={{minWidth: 24}}>•</ListItemIcon><ListItemText primary={text}/></ListItem>))}</List></PolicySection>
                <PolicySection icon={<AccountBoxIcon />} title={t('deleteAccountPage.sections.userRights.title')}><Typography paragraph>{t('deleteAccountPage.sections.userRights.paragraph')}</Typography><List dense>{rightsConditions.map(text => (<ListItem key={text}><ListItemIcon sx={{minWidth: 24}}>•</ListItemIcon><ListItemText primary={text}/></ListItem>))}</List></PolicySection>
                <PolicySection icon={<ContactMailIcon />} title={t('deleteAccountPage.sections.contact.title')}><Typography paragraph>{t('deleteAccountPage.sections.contact.paragraph')}</Typography></PolicySection>
              </Box>
              
              <Paper sx={{ mt: 5, p: 3, borderRadius: 3, backgroundColor: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', border: `1px solid ${alpha(theme.palette.error.main, 0.5)}`, boxShadow: `0 0 16px ${alpha(theme.palette.error.main, 0.3)}` }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'error.light', textAlign:'center' }}>{t('deleteAccountPage.dangerZone.title')}</Typography>
                <Typography sx={{textAlign:'center', color: 'error.main', mt:1}}>{t('deleteAccountPage.dangerZone.warning', { days: daysRemaining })}</Typography>
                <Box sx={{ mt: 3, textAlign: 'center' }}>
                    <GradientButton color="error" onClick={handleOpenModal} sx={{ background: theme.palette.error.main }}>{t('perigo.btn_excluir_conta')}</GradientButton>
                </Box>
              </Paper>
            </Paper>
          </Slide>

          <Modal open={openModal} onClose={handleCloseModal}>
            <Fade in={openModal}>
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: { xs: '90%', sm: 450 }, p: 4, borderRadius: 3, backgroundColor: 'rgba(30, 30, 45, 0.8)', backdropFilter: 'blur(15px)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <WarningAmberIcon color="error" sx={{fontSize: 30}}/>
                        <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>{t('deleteAccountPage.modal.title')}</Typography>
                    </Stack>
                    <Typography sx={{ mt: 2, color: 'text.secondary' }}>{t('deleteAccountPage.modal.description', { days: daysRemaining })}</Typography>
                    <Stack direction="column" spacing={1.5} sx={{ mt: 3 }}>
                      <Button variant="outlined" onClick={handleScheduleDeletion}>{t('deleteAccountPage.modal.scheduleButton', { days: daysRemaining })}</Button>
                      <GradientButton color="error" onClick={handleDeleteNow} sx={{ background: theme.palette.error.main }}>{t('deleteAccountPage.modal.deleteNowButton')}</GradientButton>
                      <Button onClick={handleCloseModal} color="inherit" sx={{ mt: 1 }}>{t('deleteAccountPage.modal.cancelButton')}</Button>
                    </Stack>
                </Box>
            </Fade>
          </Modal>
        </Container>
    </>
  );
}