import React from 'react';
import { Avatar } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import ChatIcon from '@mui/icons-material/Chat';

export const formatPhoneNumber = (phone) => {
  if (!phone) return 'Telefone não informado';
  const cleaned = ('' + phone).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3];
  }
  return phone;
};

export const getChannelIcon = (channel, props = {}) => {
  const avatarSx = { width: 24, height: 24, boxShadow: '0 2px 4px rgba(0,0,0,0.3)' };
  const iconProps = { sx: { fontSize: 14, color: 'white' }, ...props };

  switch (channel) {
    case 'email':
      return <Avatar sx={{ ...avatarSx, bgcolor: 'grey.700' }}><EmailIcon {...iconProps} /></Avatar>;
    case 'whatsapp':
      return <Avatar sx={{ ...avatarSx, bgcolor: '#25D366' }}><WhatsAppIcon {...iconProps} /></Avatar>;
    case 'linkedin':
      return <Avatar sx={{ ...avatarSx, bgcolor: '#0A66C2' }}><LinkedInIcon {...iconProps} /></Avatar>;
    default:
      return <Avatar sx={{ ...avatarSx, bgcolor: 'primary.main' }}><ChatIcon {...iconProps} /></Avatar>;
  }
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'active':
      return 'success';
    case 'escalated':
      return 'error';
    case 'closed':
      return 'default';
    case 'new':
    case 'engaged':
    case 'qualified':
      return 'info';
    case 'scheduledMeeting':
    case 'meetingEnded':
      return 'secondary';
    case 'lost':
      return 'warning';
    default:
      return 'primary';
  }
};

export const getStatusLabel = (status) => {
  const labels = {
    active: 'Ativo',
    escalated: 'Escalado',
    closed: 'Fechado',
    new: 'Novo Contato',
    engaged: 'Engajado',
    qualified: 'Qualificado',
    scheduledMeeting: 'Reunião Agendada',
    meetingEnded: 'Reunião Finalizada',
    lost: 'Perdido',
  };
  return labels[status] || status;
};

export const hasNote = (conversation) => {
  return conversation?.notes?.length > 0;
};