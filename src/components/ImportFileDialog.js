import React, { useState, useEffect, useRef } from 'react';
import {
  // CORREÇÃO: Adicionados DialogTitle e DialogContent de volta
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Paper,
  Typography,
  CircularProgress,
  alpha,
  useTheme,
  Alert,
} from '@mui/material';
import { FileUpload as FileUploadIcon, CheckCircleOutline as CheckCircleIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

// Caminhos de importação agora funcionarão
import { StyledDialog } from './ui/StyledDialog';
import { GradientButton } from './ui/GradientButton';

export default function ImportFileDialog({ open, onClose, onSubmit, isLoading }) {
  const { t } = useTranslation();
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const theme = useTheme();
  const dropRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (file) {
      onSubmit(file);
    } else {
      toast.warn(t('importFileDialog.toastWarning'));
    }
  };
  
  useEffect(() => {
    if (!open) {
      setFile(null);
    }
  }, [open]);

  const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  useEffect(() => {
    const dropZone = dropRef.current;
    if (dropZone) {
      dropZone.addEventListener('dragover', handleDragOver);
      dropZone.addEventListener('dragleave', handleDragLeave);
      dropZone.addEventListener('drop', handleDrop);
      return () => {
        dropZone.removeEventListener('dragover', handleDragOver);
        dropZone.removeEventListener('dragleave', handleDragLeave);
        dropZone.removeEventListener('drop', handleDrop);
      };
    }
  }, []); 

  return (
    <StyledDialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ color: theme.palette.primary.light }}>
        {t('importFileDialog.title')}
      </DialogTitle>
      <DialogContent>
        <Alert
          severity="info"
          variant="outlined"
          sx={{
            mb: 2,
            borderColor: 'info.light',
            color: 'info.light',
            '& .MuiAlert-icon': {
              color: 'info.light',
            },
          }}
        >
          {t('importFileDialog.info')}
        </Alert>

        <label htmlFor="lead-file-upload">
          <Paper
            ref={dropRef}
            variant="outlined"
            sx={{
              p: 4,
              textAlign: 'center',
              cursor: 'pointer',
              borderStyle: 'dashed',
              borderWidth: '2px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderColor: isDragging ? 'primary.main' : 'rgba(255, 255, 255, 0.2)',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: 'primary.light',
                transform: 'scale(1.02)',
              },
            }}
          >
            <input
              id="lead-file-upload"
              type="file"
              hidden
              accept=".csv,.xlsx,.xls,.pdf"
              onChange={handleFileChange}
            />
            {file ? (
              <>
                <CheckCircleIcon sx={{ fontSize: 40, mb: 1, color: 'success.main' }} />
                <Typography sx={{ color: 'success.light' }}>{file.name}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {t('importFileDialog.dropzoneReady')}
                </Typography>
              </>
            ) : (
              <>
                <FileUploadIcon sx={{ fontSize: 40, mb: 1, color: isDragging ? 'primary.main' : 'text.secondary' }} />
                <Typography sx={{ color: isDragging ? 'primary.light' : 'white' }}>
                  {t('importFileDialog.dropzoneDefault')}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {t('importFileDialog.dropzoneCaption')}
                </Typography>
              </>
            )}
          </Paper>
        </label>
      </DialogContent>
      <DialogActions sx={{ p: '16px 24px' }}>
        <Button onClick={onClose} color="inherit">{t('common.cancel')}</Button>
        <GradientButton
          onClick={handleSubmit}
          disabled={isLoading || !file}
          startIcon={isLoading ? <CircularProgress size={20} color="inherit"/> : null}
        >
          {t('importFileDialog.importButton')}
        </GradientButton>
      </DialogActions>
    </StyledDialog>
  );
}