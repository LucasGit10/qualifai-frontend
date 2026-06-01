import React, { useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Box, Button, TextField, Typography, Paper, Stack, Chip, alpha, useTheme
} from '@mui/material';
import { Email as EmailIcon, Save as SaveIcon } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';

const normalizeTemplateName = (value = '') => value
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9_]+/g, '_')
  .replace(/^_+|_+$/g, '')
  .slice(0, 80);

const getComponentText = (template, type) => (
  template?.components?.find(component => component.type === type)?.text || ''
);

const DEFAULT_BODY = `Olá {{nome}},

Estamos entrando em contato sobre o contrato {{contrato}} vinculado ao empreendimento {{empreendimento}}.

Identificamos pendências em aberto e queremos ajudar você a encontrar a melhor forma de regularização.

Pode responder este email ou falar conosco pelos canais oficiais da empresa.`;

export default function EmailTemplateFormDialog({ open, onClose, onSubmit, template, isLoading }) {
  const theme = useTheme();
  const isEdit = Boolean(template);
  const { control, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      emailSubject: '',
      emailPreheader: '',
      bodyText: DEFAULT_BODY,
      footerText: 'Equipe de atendimento'
    }
  });

  const bodyText = watch('bodyText') || '';
  const subject = watch('emailSubject') || '';

  useEffect(() => {
    if (!open) return;
    reset({
      name: template?.name || '',
      emailSubject: template?.emailSubject || 'Regularização do contrato {{contrato}}',
      emailPreheader: template?.emailPreheader || 'Contato oficial sobre pendências em aberto.',
      bodyText: getComponentText(template, 'BODY') || DEFAULT_BODY,
      footerText: getComponentText(template, 'FOOTER') || 'Equipe de atendimento'
    });
  }, [open, template, reset]);

  const variables = ['{{nome}}', '{{contrato}}', '{{empreendimento}}', '{{valor_total}}', '{{email}}', '{{telefone}}'];

  return (
    <Dialog open={open} onClose={isLoading ? undefined : onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
          <EmailIcon color="primary" />
          <Box>
            <Typography variant="h6" fontWeight={800}>
              {isEdit ? 'Editar template de email' : 'Novo template de email'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Monte uma comunicação clara, identificável e reutilizável.
            </Typography>
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2.25} sx={{ mt: 1 }}>
          <Paper
            elevation={0}
            sx={{
              p: 1.5,
              borderRadius: 2,
              bgcolor: alpha(theme.palette.info.main, 0.08),
              border: `1px solid ${alpha(theme.palette.info.main, 0.18)}`,
            }}
          >
            <Typography variant="body2" fontWeight={700}>Boas práticas</Typography>
            <Typography variant="caption" color="text.secondary">
              Use identificação da empresa, contexto do contrato e canais oficiais. Evite links encurtados e chamadas agressivas.
            </Typography>
          </Paper>

          <Controller
            name="name"
            control={control}
            rules={{ required: 'Informe um nome interno.' }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Nome interno"
                placeholder="regularizacao_contrato"
                error={Boolean(errors.name)}
                helperText={errors.name?.message || 'Use letras minúsculas, números e underscore.'}
                onChange={(event) => field.onChange(normalizeTemplateName(event.target.value))}
                fullWidth
              />
            )}
          />

          <Controller
            name="emailSubject"
            control={control}
            rules={{ required: 'Informe o assunto do email.' }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Assunto"
                placeholder="Regularização do contrato {{contrato}}"
                error={Boolean(errors.emailSubject)}
                helperText={errors.emailSubject?.message || `${subject.length}/180 caracteres`}
                inputProps={{ maxLength: 180 }}
                fullWidth
              />
            )}
          />

          <Controller
            name="emailPreheader"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Prévia da caixa de entrada"
                placeholder="Contato oficial sobre pendências em aberto."
                inputProps={{ maxLength: 220 }}
                helperText="Aparece como complemento do assunto em alguns clientes de email."
                fullWidth
              />
            )}
          />

          <Box>
            <Typography variant="caption" color="text.secondary" fontWeight={700}>
              Variáveis disponíveis
            </Typography>
            <Stack direction="row" gap={1} flexWrap="wrap" sx={{ mt: 0.75 }}>
              {variables.map(variable => (
                <Chip
                  key={variable}
                  label={variable}
                  size="small"
                  onClick={() => setValue('bodyText', `${bodyText}${bodyText.endsWith(' ') || !bodyText ? '' : ' '}${variable}`)}
                  sx={{ fontFamily: 'monospace' }}
                />
              ))}
            </Stack>
          </Box>

          <Controller
            name="bodyText"
            control={control}
            rules={{ required: 'Informe o corpo do email.' }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Corpo do email"
                multiline
                minRows={9}
                error={Boolean(errors.bodyText)}
                helperText={errors.bodyText?.message || `${bodyText.length}/2000 caracteres`}
                inputProps={{ maxLength: 2000 }}
                fullWidth
              />
            )}
          />

          <Controller
            name="footerText"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Assinatura/rodapé" fullWidth />
            )}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} disabled={isLoading}>Cancelar</Button>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          disabled={isLoading}
          onClick={handleSubmit(onSubmit)}
          sx={{ borderRadius: 2, fontWeight: 800 }}
        >
          Salvar template
        </Button>
      </DialogActions>
    </Dialog>
  );
}
