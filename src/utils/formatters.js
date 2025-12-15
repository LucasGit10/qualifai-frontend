import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const formatDate = (date) => {
  if (!date) return '';
  return format(new Date(date), 'dd/MM/yyyy', { locale: ptBR });
};

export const formatDateTime = (date) => {
  if (!date) return '';
  return format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: ptBR });
};

export const formatTimeAgo = (date) => {
  if (!date) return '';
  return formatDistanceToNow(new Date(date), { 
    addSuffix: true, 
    locale: ptBR 
  });
};

export const formatCurrency = (value) => {
  if (!value) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const formatPhone = (phone) => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{2})(\d{4,5})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
};

export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};