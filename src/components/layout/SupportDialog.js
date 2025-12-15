import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  CircularProgress, Button, Typography
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import api from 'services/api';

export default function SupportDialog({ open, onClose }) {
  const { t } = useTranslation();
  const [isSending, setIsSending] = useState(false);
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: { subject: '', message: '' }
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data) => {
    setIsSending(true);
    try {
      await api.post('/support/send-message', data);
      toast.success(t('layout.toasts.supportSuccess'));
      handleClose();
    } catch (error) {
      toast.error(error.response?.data?.message || t('layout.toasts.supportError'));
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(15px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '16px',
        }
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>{t('layout.supportDialog.title')}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }} color="text.secondary">
            {t('layout.supportDialog.description')}
          </Typography>
          <Controller
            name="subject"
            control={control}
            rules={{ required: t('layout.supportDialog.subjectError') }}
            render={({ field }) => (
              <TextField
                {...field}
                autoFocus
                margin="dense"
                label={t('layout.supportDialog.subjectLabel')}
                type="text"
                fullWidth
                variant="outlined"
                error={!!errors.subject}
                helperText={errors.subject?.message}
              />
            )}
          />
          <Controller
            name="message"
            control={control}
            rules={{ required: t('layout.supportDialog.messageError') }}
            render={({ field }) => (
              <TextField
                {...field}
                margin="dense"
                label={t('layout.supportDialog.messageLabel')}
                type="text"
                fullWidth
                variant="outlined"
                multiline
                rows={6}
                error={!!errors.message}
                helperText={errors.message?.message}
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{t('layout.supportDialog.cancelButton')}</Button>
          <Button type="submit" variant="contained" disabled={isSending}>
            {isSending ? <CircularProgress size={24} color="inherit" /> : t('layout.supportDialog.sendButton')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
