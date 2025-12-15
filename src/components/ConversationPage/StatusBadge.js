import { Chip } from '@mui/material';

export const getStatusColor = (status) => {
  switch (status) {
    case 'active': return 'success';
    case 'closed': return 'default';
    case 'escalated': return 'warning';
    default: return 'default';
  }
};

export const getStatusLabel = (status) => {
  switch (status) {
    case 'active': return 'Ativo';
    case 'closed': return 'Fechado';
    case 'escalated': return 'Escalado';
    default: return status;
  }
};

export default function StatusBadge({ status }) {
  return (
    <Chip 
      label={getStatusLabel(status)} 
      color={getStatusColor(status)} 
      size="small" 
    />
  );
}