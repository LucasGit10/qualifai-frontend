import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
  IconButton,
  Stack,
  useTheme,
  alpha
} from '@mui/material';
import { Close as CloseIcon, RocketLaunch as RocketLaunchIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import MeetingModal from './MeetingModal';

const ConversionModal = ({ open, onClose }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [meetingModalOpen, setMeetingModalOpen] = useState(false);

  const handleNavigateToPlans = () => {
    onClose();
    navigate('/signature');
  };

  const handleOpenMeetingModal = () => {
    onClose();
    setMeetingModalOpen(true);
  };

  const handleCloseMeetingModal = () => {
    setMeetingModalOpen(false);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            borderRadius: '16px',
            textAlign: 'center',
            boxShadow: theme.shadows[10],
          },
        }}
      >
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 16,
            top: 16,
            color: 'text.secondary',
            '&:hover': {
              color: 'text.primary',
              backgroundColor: alpha(theme.palette.text.primary, 0.05)
            }
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogTitle sx={{ px: 4, pt: 5, pb: 1 }}>
          <RocketLaunchIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h5" component="h2" fontWeight={700}>
            Acesse esta e todas as outras funcionalidades
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ px: 4 }}>
          <DialogContentText color="text.secondary">
            Assine agora para criar, salvar e automatizar seu trabalho. Desbloqueie todo o poder da nossa plataforma.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', px: 4, pb: 4 }}>
          <Stack spacing={2} width="100%">
            <Button
              onClick={handleNavigateToPlans}
              variant="contained"
              fullWidth
              size="large"
              sx={{
                borderRadius: '8px',
                py: 1.5,
                fontWeight: 600,
                background: theme.palette.custom?.gradients?.button || theme.palette.primary.main,
                '&:hover': {
                  background: theme.palette.custom?.gradients?.buttonHover || theme.palette.primary.dark,
                  transform: 'translateY(-1px)'
                }
              }}
            >
              Explore nossos Planos
            </Button>
            <Button
              onClick={handleOpenMeetingModal}
              variant="outlined"
              fullWidth
              size="large"
              sx={{
                borderRadius: '8px',
                py: 1.5,
                fontWeight: 600,
                borderWidth: '2px',
                '&:hover': { borderWidth: '2px' }
              }}
            >
              Fale com nossa equipe
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>

      <MeetingModal open={meetingModalOpen} onClose={handleCloseMeetingModal} />
    </>
  );
};

export default ConversionModal;