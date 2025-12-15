import {
    ArrowDownward as ArrowDownwardIcon,
    ArrowUpward as ArrowUpwardIcon,
    Remove as RemoveIcon,
} from '@mui/icons-material';

export const priorityConfig = {
    Baixa: { icon: <ArrowDownwardIcon fontSize="small" />, color: 'success', hex: '#4ECDC4' },
    Média: { icon: <RemoveIcon fontSize="small" />, color: 'warning', hex: '#FFA07A' },
    Alta: { icon: <ArrowUpwardIcon fontSize="small" />, color: 'error', hex: '#FF6B6B' },
};