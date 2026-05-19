import React from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  LinearProgress,
  Paper,
  Stack,
  Tooltip,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import {
  AutoAwesome as AutoAwesomeIcon,
  ContentCopy as ContentCopyIcon,
  Psychology as PsychologyIcon,
  Refresh as RefreshIcon,
  WarningAmber as WarningAmberIcon,
} from '@mui/icons-material';

const temperatureColor = {
  quente: 'success',
  morno: 'warning',
  frio: 'info',
  critico: 'error',
  desconhecido: 'default',
};

const riskColor = {
  baixo: 'success',
  medio: 'warning',
  alto: 'error',
  critico: 'error',
  desconhecido: 'default',
};

const formatDate = (date) => {
  if (!date) return null;
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function NegotiationIntelligencePanel({
  intelligence,
  isAnalyzing,
  onAnalyze,
  onUseMessage,
  compact = false,
}) {
  const theme = useTheme();
  const probability = Number.isFinite(Number(intelligence?.agreementProbability))
    ? Number(intelligence.agreementProbability)
    : null;

  return (
    <Paper
      elevation={0}
      sx={{
        p: compact ? 1.5 : 2,
        borderRadius: 3,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.22)}`,
        background: theme.palette.mode === 'dark'
          ? `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.22)}, ${alpha(theme.palette.background.paper, 0.92)})`
          : `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.14)}, ${alpha(theme.palette.common.white, 0.94)})`,
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
        <Stack direction="row" alignItems="center" gap={1}>
          <AutoAwesomeIcon color="primary" />
          <Box>
            <Typography variant="subtitle1" fontWeight={800} color="text.primary">
              Central inteligente
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {intelligence?.analyzedAt
                ? `Atualizada em ${formatDate(intelligence.analyzedAt)}`
                : 'Analise a conversa para ver a próxima melhor ação'}
            </Typography>
          </Box>
        </Stack>

        <Tooltip title="Atualizar análise">
          <span>
            <Button
              size="small"
              variant="contained"
              startIcon={isAnalyzing ? <CircularProgress size={16} color="inherit" /> : <RefreshIcon />}
              onClick={onAnalyze}
              disabled={isAnalyzing}
              sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
            >
              {isAnalyzing ? 'Analisando' : 'Analisar'}
            </Button>
          </span>
        </Tooltip>
      </Stack>

      {!intelligence?.analyzedAt ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          Gere um snapshot tático com objeção, risco, proposta e mensagem sugerida.
        </Alert>
      ) : (
        <Stack spacing={1.5} sx={{ mt: 2 }}>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Chip
              size="small"
              label={`Temperatura: ${intelligence.temperature || 'desconhecida'}`}
              color={temperatureColor[intelligence.temperature] || 'default'}
              variant="filled"
            />
            <Chip
              size="small"
              label={`Risco: ${intelligence.riskLevel || 'desconhecido'}`}
              color={riskColor[intelligence.riskLevel] || 'default'}
              variant="outlined"
            />
            {intelligence.mood && (
              <Chip size="small" icon={<PsychologyIcon />} label={intelligence.mood} variant="outlined" />
            )}
          </Stack>

          {probability !== null && (
            <Box>
              <Stack direction="row" alignItems="center" justifyContent="space-between" mb={0.5}>
                <Typography variant="caption" color="text.secondary">
                  Chance de acordo
                </Typography>
                <Typography variant="caption" fontWeight={800} color="text.primary">
                  {probability}%
                </Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={probability}
                sx={{ height: 8, borderRadius: 999 }}
              />
            </Box>
          )}

          <InfoBlock title="Objeção principal" text={intelligence.mainObjection} />
          <InfoBlock title="Próxima melhor ação" text={intelligence.recommendedAction} strong />
          <InfoBlock title="Proposta recomendada" text={intelligence.recommendedProposal} />

          {intelligence.suggestedMessage && (
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.success.main, 0.28)}`,
                backgroundColor: alpha(theme.palette.success.main, theme.palette.mode === 'dark' ? 0.08 : 0.05),
              }}
            >
              <Typography variant="caption" color="text.secondary" fontWeight={700}>
                Mensagem sugerida
              </Typography>
              <Typography variant="body2" color="text.primary" sx={{ mt: 0.5, whiteSpace: 'pre-wrap' }}>
                {intelligence.suggestedMessage}
              </Typography>
              {onUseMessage && (
                <Button
                  size="small"
                  startIcon={<ContentCopyIcon />}
                  onClick={() => onUseMessage(intelligence.suggestedMessage)}
                  sx={{ mt: 1, textTransform: 'none', fontWeight: 700 }}
                >
                  Usar mensagem
                </Button>
              )}
            </Box>
          )}

          {intelligence.humanSummary && (
            <InfoBlock title="Resumo para humano" text={intelligence.humanSummary} />
          )}

          {!!intelligence.avoid?.length && (
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight={700}>
                Evitar
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 0.75 }}>
                {intelligence.avoid.map((item) => (
                  <Chip key={item} size="small" label={item} icon={<WarningAmberIcon />} color="warning" variant="outlined" />
                ))}
              </Stack>
            </Box>
          )}

          {!!intelligence.flags?.length && (
            <>
              <Divider />
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {intelligence.flags.map((flag) => (
                  <Chip key={flag} size="small" label={flag} variant="outlined" />
                ))}
              </Stack>
            </>
          )}
        </Stack>
      )}
    </Paper>
  );
}

function InfoBlock({ title, text, strong = false }) {
  if (!text) return null;
  return (
    <Box>
      <Typography variant="caption" color="text.secondary" fontWeight={700}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.primary" fontWeight={strong ? 700 : 400} sx={{ mt: 0.25 }}>
        {text}
      </Typography>
    </Box>
  );
}
