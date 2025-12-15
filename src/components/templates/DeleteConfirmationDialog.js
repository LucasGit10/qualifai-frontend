import React from 'react';
import {
  Button, DialogTitle, DialogContent, DialogActions,
  Typography, Alert, useTheme
} from '@mui/material';
import {
  WarningAmber as WarningIcon,
  DeleteForever as DeleteForeverIcon
} from '@mui/icons-material';
import { useTranslation, Trans } from 'react-i18next';
import { StyledDialog } from 'components/ui/StyledDialog';
import { GradientButton } from 'components/ui/GradientButton';
import { formatTemplateNameForDisplay } from 'utils/templateUtils';

export const DeleteConfirmationDialog = ({ open, onClose, onConfirm, isLoading, templateName }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'error.main' }}>
        <WarningIcon />{t('templatesPage.deleteDialog.title')}
      </DialogTitle>
      <DialogContent sx={{ textAlign: 'center' }}>
        <DeleteForeverIcon sx={{ fontSize: 60, color: 'error.light', mb: 2 }} />
        <Typography>
          <Trans i18nKey="templatesPage.deleteDialog.message" values={{ templateName: formatTemplateNameForDisplay(templateName) }}>
            Você está prestes a deletar o template <Typography component="span" fontWeight="bold">"{formatTemplateNameForDisplay(templateName)}"</Typography>.
          </Trans>
        </Typography>
        <Alert severity="error" sx={{ mt: 2, textAlign: 'left' }}>
          {t('templatesPage.deleteDialog.warning')}
        </Alert>
      </DialogContent>
      <DialogActions sx={{ p: '16px 24px' }}>
        <Button onClick={onClose} disabled={isLoading} color="inherit">{t('common.cancel')}</Button>
        <GradientButton
          onClick={onConfirm}
          loading={isLoading}
          color="error"
          sx={{ background: theme.palette.error.main, '&:hover': { background: theme.palette.error.dark } }}
        >
          {t('templatesPage.deleteDialog.deleteButton')}
        </GradientButton>
      </DialogActions>
    </StyledDialog>
  );
};