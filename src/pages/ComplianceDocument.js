import React, { useRef, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Paper,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  CloudUpload as CloudUploadIcon,
  Description as DescriptionIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import { useAuthStore } from '../stores/authStore';

const formatFileSize = (size = 0) => {
  if (size < 1024 * 1024) return `${Math.max(1, Math.round(size / 1024))} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

export default function ComplianceDocument() {
  const theme = useTheme();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);
  const updateUser = useAuthStore((state) => state.updateUser);
  const [file, setFile] = useState(null);
  const [notes, setNotes] = useState('');
  const [skipDocument, setSkipDocument] = useState(false);

  const { data, isLoading } = useQuery(
    'complianceStatus',
    () => api.get('/compliance/status').then((res) => res.data),
    { retry: false }
  );

  const uploadMutation = useMutation(
    async () => {
      const formData = new FormData();
      formData.append('document', file);
      if (notes.trim()) formData.append('notes', notes.trim());
      return api.post('/compliance/document', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
    {
      onSuccess: (response) => {
        const uploadedAt = response.data?.document?.uploadedAt || new Date().toISOString();
        updateUser({
          compliance: {
            document: response.data?.document?._id,
            documentUploadedAt: uploadedAt,
            documentApprovedAt: uploadedAt,
          },
        });
        queryClient.invalidateQueries('complianceStatus');
        toast.success('Documento anexado com sucesso.');
        navigate('/app/dashboard', { replace: true });
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Nao foi possivel anexar o documento.');
      },
    }
  );

  const exemptMutation = useMutation(
    () => api.post('/compliance/exempt', { reason: notes.trim() }),
    {
      onSuccess: (response) => {
        updateUser({ compliance: response.data?.compliance });
        queryClient.invalidateQueries('complianceStatus');
        toast.success('Conta liberada sem exigencia de documento.');
        navigate('/app/dashboard', { replace: true });
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Nao foi possivel liberar a conta.');
      },
    }
  );

  const handleDownload = async () => {
    try {
      const response = await api.get('/compliance/document/download', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: response.headers['content-type'] }));
      window.open(url, '_blank', 'noopener,noreferrer');
      setTimeout(() => window.URL.revokeObjectURL(url), 30000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Nao foi possivel abrir o documento.');
    }
  };

  const canSubmit = Boolean(file) && !uploadMutation.isLoading && !skipDocument;
  const canExempt = skipDocument && !exemptMutation.isLoading;

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 96px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 2, md: 4 },
        bgcolor: theme.palette.background.default,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 760,
          p: { xs: 2.5, md: 4 },
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
          bgcolor: theme.palette.background.paper,
        }}
      >
        <Stack spacing={3}>
          <Box>
            <Typography variant="h5" fontWeight={700}>
              Documento de permissao e consentimento
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Anexe o comprovante que demonstra que os dados usados e os envios de mensagens foram autorizados pelos usuarios ou possuem base legal adequada.
            </Typography>
          </Box>

          <Alert severity="warning">
            O envio e o inicio de mensagens ficam bloqueados ate que este documento esteja salvo no sistema ou a conta seja liberada manualmente.
          </Alert>

          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : data?.exempted ? (
            <Alert severity="success" icon={<CheckCircleIcon />}>
              Esta conta esta liberada sem exigencia de documento.
            </Alert>
          ) : data?.completed ? (
            <Alert
              severity="success"
              icon={<CheckCircleIcon />}
              action={
                <Button color="inherit" size="small" startIcon={<DownloadIcon />} onClick={handleDownload}>
                  Abrir
                </Button>
              }
            >
              Documento atual: {data.document?.originalName} ({formatFileSize(data.document?.size)})
            </Alert>
          ) : null}

          <Box
            sx={{
              border: `1px dashed ${theme.palette.divider}`,
              borderRadius: 2,
              p: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              flexWrap: 'wrap',
              opacity: skipDocument ? 0.55 : 1,
            }}
          >
            <DescriptionIcon color="primary" />
            <Box sx={{ flex: 1, minWidth: 220 }}>
              <Typography variant="subtitle2">
                {file ? file.name : 'PDF, imagem, DOC ou DOCX'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Tamanho maximo: 10 MB.
              </Typography>
            </Box>
            <input
              ref={fileInputRef}
              hidden
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx"
              onChange={(event) => setFile(event.target.files?.[0] || null)}
            />
            <Button
              variant="outlined"
              startIcon={<CloudUploadIcon />}
              disabled={skipDocument}
              onClick={() => fileInputRef.current?.click()}
            >
              Selecionar
            </Button>
          </Box>

          <FormControlLabel
            control={
              <Checkbox
                checked={skipDocument}
                onChange={(event) => setSkipDocument(event.target.checked)}
              />
            }
            label="Liberar esta conta sem anexar documento"
          />

          <TextField
            label={skipDocument ? 'Motivo da liberacao' : 'Observacoes internas'}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            multiline
            minRows={3}
            placeholder={skipDocument ? 'Ex.: conta interna/teste, autorizacao feita fora da plataforma.' : 'Ex.: origem da base, data do opt-in, campanha ou contrato relacionado.'}
          />

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="flex-end">
            {(data?.completed || data?.exempted) && (
              <Button variant="text" onClick={() => navigate('/app/dashboard')}>
                Continuar
              </Button>
            )}
            <Button
              variant="contained"
              startIcon={uploadMutation.isLoading ? <CircularProgress size={18} color="inherit" /> : <CloudUploadIcon />}
              disabled={!canSubmit}
              onClick={() => uploadMutation.mutate()}
            >
              Salvar documento
            </Button>
            {skipDocument && (
              <Button
                variant="outlined"
                color="warning"
                disabled={!canExempt}
                onClick={() => exemptMutation.mutate()}
              >
                {exemptMutation.isLoading ? 'Liberando...' : 'Liberar sem documento'}
              </Button>
            )}
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}