import React from 'react';
import {
  Card, CardContent, CardActions, Chip, Alert,
  Grid, Typography, IconButton, Tooltip, Stack, CardHeader,
  alpha, useTheme, Box, Divider
} from '@mui/material';
import {
  Edit as EditIcon, Delete as DeleteIcon, Send as SendIcon,
  CheckCircle as ApprovedIcon, HighlightOff as RejectedIcon,
  HourglassEmpty as PendingIcon, Drafts as DraftIcon,
  Image as ImageIcon,
  Link as LinkIcon,
  Reply as ReplyIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { GradientButton } from 'components/ui/GradientButton'; 
import { formatTemplateNameForDisplay } from 'utils/templateUtils';

// 🔥 FUNÇÕES COMPLETADAS
const getStatusIcon = (status) => {
  switch (status) {
    case 'approved': return <ApprovedIcon fontSize="small" />;
    case 'rejected': return <RejectedIcon fontSize="small" />;
    case 'pending_approval': return <PendingIcon fontSize="small" />;
    case 'draft': return <DraftIcon fontSize="small" />;
    default: return <DraftIcon fontSize="small" />;
  }
};

const getStatusStyles = (status, theme) => {
  const baseStyle = {
    boxShadow: theme.shadows[1],
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: theme.shadows[4]
    }
  };

  switch (status) {
    case 'approved':
      return {
        ...baseStyle,
        borderLeft: `4px solid ${theme.palette.success.main}`
      };
    case 'rejected':
      return {
        ...baseStyle,
        borderLeft: `4px solid ${theme.palette.error.main}`
      };
    case 'pending_approval':
      return {
        ...baseStyle,
        borderLeft: `4px solid ${theme.palette.warning.main}`
      };
    default:
      return {
        ...baseStyle,
        borderLeft: `4px solid ${theme.palette.grey[400]}`
      };
  }
};

const TemplateHeaderPreview = ({ component }) => {
  const { t } = useTranslation();
  if (!component) return null;

  let content = null;
  switch (component.format) {
    case 'TEXT':
      content = `"${component.text}"`;
      break;
    case 'IMAGE':
      content = <><ImageIcon fontSize="small" sx={{ mr: 0.5 }} /> {t('templatesPage.card.headerImage')}</>;
      break;
    case 'VIDEO':
      content = <>{t('templatesPage.card.headerVideo')}</>;
      break;
    case 'DOCUMENT':
      content = <>{t('templatesPage.card.headerDocument')}</>;
      break;
    default:
      return null;
  }
  return (
    <Box sx={{ mb: 1, p: 1, borderRadius: 1, bgcolor: 'action.focus' }}>
      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>
        {t('templatesPage.card.headerLabel')}: {content}
      </Typography>
    </Box>
  );
};

const TemplateButtonsPreview = ({ components = [] }) => {
  const { t } = useTranslation();
  const buttonsComponent = components.find(c => c.type === 'BUTTONS');
  if (!buttonsComponent || !buttonsComponent.buttons) return null;

  return (
    <Box sx={{ mt: 2 }}>
      <Divider />
      <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1, display: 'block' }}>
        {t('templatesPage.card.buttonsLabel')}:
      </Typography>
      <Stack direction="row" spacing={1} sx={{ mt: 0.5, flexWrap: 'wrap' }}>
        {buttonsComponent.buttons.map((btn, index) => (
          <Chip
            key={index}
            icon={btn.type === 'URL' ? <LinkIcon /> : <ReplyIcon />}
            label={btn.text}
            size="small"
            variant="outlined"
            sx={{ mt: 0.5 }}
          />
        ))}
      </Stack>
    </Box>
  );
};

export const TemplateCard = ({ template, onAction }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const headerComponent = template.components?.find(c => c.type === 'HEADER');
  const bodyComponent = template.components?.find(c => c.type === 'BODY');
  const footerComponent = template.components?.find(c => c.type === 'FOOTER');

  const displayName = formatTemplateNameForDisplay(template.name);

  return (
    <Card sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      borderRadius: 3,
      transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
      border: `1px solid ${theme.palette.divider}`,
      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'background.paper',
      backdropFilter: theme.palette.mode === 'dark' ? 'blur(10px)' : 'none',
      ...getStatusStyles(template.status, theme),
    }}>
      <CardHeader
        action={
          <Stack direction="row">
            {['draft', 'rejected'].includes(template.status) && (
              <Tooltip title={t('templatesPage.card.editTooltip')}>
                <IconButton size="small" onClick={() => onAction('edit', template)} sx={{ color: 'text.secondary' }}>
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title={t('templatesPage.card.deleteTooltip')}>
              <IconButton size="small" onClick={() => onAction('delete', template)} sx={{ color: 'error.main' }}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        }
        title={
          <Typography variant="subtitle1" fontWeight="bold" noWrap sx={{ color: 'text.primary' }}>
            {displayName}
          </Typography>
        }
        subheader={
          <Chip
            icon={getStatusIcon(template.status)}
            label={t(`templatesPage.status.${template.status.toLowerCase()}`)}
            color={template.status === 'approved' ? 'success' : template.status === 'rejected' ? 'error' : template.status === 'pending_approval' ? 'warning' : 'default'}
            size="small"
            sx={{ mt: 0.5 }}
          />
        }
      />
      <CardContent sx={{ flexGrow: 1, pt: 0 }}>
        <Stack spacing={2}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {t('templatesPage.card.categoryLabel')} {template.category}
            </Typography>
            <Chip
              label={template.templateType === 'follow_up' ? t('templatesPage.card.followUpChip') : t('templatesPage.card.conversationChip')}
              size="small"
              variant="outlined"
            />
          </Stack>
          
          <Box
            sx={{
              maxHeight: 250,
              overflowY: 'auto',
              p: 1.5,
              borderRadius: 1,
              border: `1px solid ${theme.palette.divider}`,
              backgroundColor: 'action.hover',
            }}
          >
            <TemplateHeaderPreview component={headerComponent} />
            
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', color: 'text.primary' }}>
              {bodyComponent?.text || t('templatesPage.card.noBodyText')}
            </Typography>

            {footerComponent && (
              <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1, display: 'block', fontStyle: 'italic' }}>
                {footerComponent.text}
              </Typography>
            )}
            
            <TemplateButtonsPreview components={template.components} />
          </Box>

          {template.status === 'rejected' && (
            <Alert severity="error" variant="outlined">
              {t('templatesPage.card.rejectionReason')} {template.rejectionReason || t('templatesPage.card.notSpecified')}
            </Alert>
          )}
        </Stack>
      </CardContent>
      {template.status === 'draft' && (
        <CardActions sx={{ p: 2, mt: 'auto' }}>
          <GradientButton
            fullWidth
            size="small"
            startIcon={<SendIcon />}
            onClick={() => onAction('submit', template)}>
            {t('templatesPage.card.submitButton')}
          </GradientButton>
        </CardActions>
      )}
    </Card>
  );
};