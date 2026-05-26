import React, { useState, useEffect } from 'react';
import { 
  DialogTitle, DialogContent, DialogActions, Button, 
  TextField, Grid, Typography, useTheme, alpha, Box
} from '@mui/material';
import { InsertDriveFile as InsertDriveFileIcon } from '@mui/icons-material';
import { StyledDialog } from 'components/ui/StyledDialog';
import { GradientButton } from 'components/ui/GradientButton';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { saveAs } from 'file-saver';
import { toast } from 'react-toastify';
import api from 'services/api';

const aditivoFields = [
  { name: 'NOME_VENDEDOR', label: 'Nome Vendedor' },
  { name: 'DATA_CONTRATO_ORIGINAL', label: 'Data do Contrato Original' },
  { name: 'TIPO_CONTRATO_ORIGINAL', label: 'Tipo do Contrato Original' },
  { name: 'PARCELAS_VENCIDAS', label: 'Parcelas Vencidas' },
  { name: 'VALOR_ORIGINAL_DIVIDA', label: 'Valor Original da Dívida (R$)' },
  { name: 'VALOR_ORIGINAL_DIVIDA_POR_EXTENSO', label: 'Valor Original (Por Extenso)' },
  { name: 'NUMERO_PARCELAS_RENEGOCIADAS', label: 'Nº Parcelas Renegociadas' },
  { name: 'VALOR_PARCELA_RENEGOCIADA', label: 'Valor Parcela Renegociada (R$)' },
  { name: 'VALOR_PARCELA_RENEGOCIADA_POR_EXTENSO', label: 'Valor Parcela (Por Extenso)' },
  { name: 'DIA_VENCIMENTO_PARCELA', label: 'Dia Vencimento' },
  { name: 'DATA_PRIMEIRA_PARCELA', label: 'Data 1ª Parcela' },
  { name: 'FORMA_DE_PAGAMENTO', label: 'Forma de Pagamento' },
  { name: 'PERCENTUAL_MULTA_MORATORIA', label: '% Multa Moratória' },
  { name: 'PERCENTUAL_MULTA_MORATORIA_POR_EXTENSO', label: '% Multa (Por Extenso)' },
  { name: 'PERCENTUAL_JUROS_MES', label: '% Juros ao Mês' },
  { name: 'PERCENTUAL_JUROS_MES_POR_EXTENSO', label: '% Juros (Por Extenso)' },
  { name: 'INDICE_CORRECAO_MONETARIA', label: 'Índice Correção Monetária' },
  { name: 'PERCENTUAL_HONORARIOS', label: '% Honorários' },
  { name: 'PERCENTUAL_HONORARIOS_POR_EXTENSO', label: '% Honorários (Por Extenso)' },
  { name: 'CIDADE_FORO', label: 'Cidade Foro' },
  { name: 'ESTADO_FORO', label: 'Estado Foro' },
  { name: 'CIDADE_ASSINATURA', label: 'Cidade Assinatura' },
  { name: 'ESTADO_ASSINATURA', label: 'Estado Assinatura' },
  { name: 'DATA_ASSINATURA', label: 'Data Assinatura' },
  { name: 'NOME_TESTEMUNHA_1', label: 'Nome Testemunha 1' },
  { name: 'CPF_TESTEMUNHA_1', label: 'CPF Testemunha 1' },
  { name: 'NOME_TESTEMUNHA_2', label: 'Nome Testemunha 2' },
  { name: 'CPF_TESTEMUNHA_2', label: 'CPF Testemunha 2' }
];

const confissaoFields = [
  { name: 'DATA_CONTRATO_ORIGINAL', label: 'Data do Contrato Original' },
  { name: 'NOME_CREDOR', label: 'Nome Credor' },
  { name: 'NOME_FIADOR', label: 'Nome Fiador' },
  { name: 'CPF_FIADOR', label: 'CPF Fiador' },
  { name: 'VALOR_TOTAL_DIVIDA', label: 'Valor Total Dívida (R$)' },
  { name: 'VALOR_TOTAL_DIVIDA_POR_EXTENSO', label: 'Valor Dívida (Por Extenso)' },
  { name: 'NUMERO_PARCELAS', label: 'Nº Parcelas' },
  { name: 'NUMERO_PARCELAS_POR_EXTENSO', label: 'Nº Parcelas (Por Extenso)' },
  { name: 'VALOR_PARCELA', label: 'Valor da Parcela (R$)' },
  { name: 'VALOR_PARCELA_POR_EXTENSO', label: 'Valor Parcela (Por Extenso)' },
  { name: 'DATAS_VENCIMENTO_PARCELAS', label: 'Datas Vencimento Parcelas' },
  { name: 'FORMA_DE_PAGAMENTO', label: 'Forma de Pagamento' },
  { name: 'NUMERO_PARCELAS_ORIGINAIS', label: 'Nº Parcelas Originais' },
  { name: 'DATA_ACORDO_ORIGINAL', label: 'Data Acordo Original' },
  { name: 'PERIODO_VENCIMENTO_ORIGINAL', label: 'Período Vencimento Original' },
  { name: 'PERCENTUAL_MULTA_MORATORIA', label: '% Multa Moratória' },
  { name: 'PERCENTUAL_JUROS_MES', label: '% Juros ao Mês' },
  { name: 'PERCENTUAL_HONORARIOS', label: '% Honorários' },
  { name: 'CIDADE_FORO', label: 'Cidade Foro' },
  { name: 'ESTADO_FORO', label: 'Estado Foro' },
  { name: 'CIDADE_ASSINATURA', label: 'Cidade Assinatura' },
  { name: 'ESTADO_ASSINATURA', label: 'Estado Assinatura' },
  { name: 'DATA_ASSINATURA', label: 'Data Assinatura' },
  { name: 'NOME_TESTEMUNHA_1', label: 'Nome Testemunha 1' },
  { name: 'CPF_TESTEMUNHA_1', label: 'CPF Testemunha 1' },
  { name: 'NOME_TESTEMUNHA_2', label: 'Nome Testemunha 2' },
  { name: 'CPF_TESTEMUNHA_2', label: 'CPF Testemunha 2' }
];

export default function DocGeneratorDialog({ open, onClose, docType, conversation }) {
  const theme = useTheme();
  const [formData, setFormData] = useState({});

  const fields = docType === 'aditivo' ? aditivoFields : confissaoFields;

  // Reseta e preenche os campos com os dados conhecidos ao abrir
  useEffect(() => {
    if (open) {
      setFormData({
        NOME_COMPRADOR: conversation.lead?.name || "",
        NOME_DEVEDOR: conversation.lead?.name || "",
        CPF_COMPRADOR: conversation.lead?.taxId || "",
        CPF_DEVEDOR: conversation.lead?.taxId || "",
        NOME_DO_EMPREENDIMENTO: conversation.lead?.company || "",
        EMPREENDIMENTO_ORIGINAL: conversation.lead?.company || "",
      });
    }
  }, [open, docType, conversation]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenerate = async () => {
    try {
      const url = docType === 'aditivo' ? '/aditivo.docx' : '/confissao.docx';
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const zip = new PizZip(arrayBuffer);
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
        nullGetter: (part) => formData[part.value] !== undefined ? formData[part.value] : "" 
      });

      // Pega todos os campos mais os fixos do devedor
      const dataToRender = { ...formData, 
        NOME_COMPRADOR: conversation.lead?.name || "",
        NOME_DEVEDOR: conversation.lead?.name || "",
        CPF_COMPRADOR: conversation.lead?.taxId || "",
        CPF_DEVEDOR: conversation.lead?.taxId || "",
        NOME_DO_EMPREENDIMENTO: conversation.lead?.company || ""
      };

      doc.render(dataToRender);

      const out = doc.getZip().generate({
        type: "blob",
        mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      const title = docType === 'aditivo' ? 'Aditivo' : 'Confissao';
      saveAs(out, `${title}_${conversation.lead?.name || 'documento'}.docx`);
      toast.success("Documento gerado com sucesso!");
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao gerar documento.");
    }
  };

  const handleSendWhatsApp = async () => {
    try {
      const url = docType === 'aditivo' ? '/aditivo.docx' : '/confissao.docx';
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const zip = new PizZip(arrayBuffer);
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
        nullGetter: (part) => formData[part.value] !== undefined ? formData[part.value] : "" 
      });

      const dataToRender = { ...formData, 
        NOME_COMPRADOR: conversation.lead?.name || "",
        NOME_DEVEDOR: conversation.lead?.name || "",
        CPF_COMPRADOR: conversation.lead?.taxId || "",
        CPF_DEVEDOR: conversation.lead?.taxId || "",
        NOME_DO_EMPREENDIMENTO: conversation.lead?.company || ""
      };

      doc.render(dataToRender);

      const out = doc.getZip().generate({
        type: "blob",
        mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      const title = docType === 'aditivo' ? 'Aditivo' : 'Confissao';
      const filename = `${title}_${conversation.lead?.name || 'documento'}.docx`;

      const uploadData = new FormData();
      uploadData.append('file', out, filename);
      uploadData.append('conversationId', conversation._id);
      uploadData.append('senderRole', 'human');

      toast.info("Enviando documento pelo WhatsApp...", { autoClose: 2000 });

      await api.post('/whatsapp/send-document', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success("Documento enviado pelo WhatsApp com sucesso!");
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || "Erro ao enviar documento pelo WhatsApp.");
    }
  };

  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, pb: 1 }}>
        <InsertDriveFileIcon sx={{ color: theme.palette.primary.main }} />
        <Typography variant="h6" fontWeight="800" color={theme.palette.text.primary}>
          Preencher: {docType === 'aditivo' ? 'Aditivo Contratual' : 'Termo de Confissão'}
        </Typography>
      </DialogTitle>
      
      <DialogContent sx={{ mt: 1 }}>
        <Box sx={{ 
          p: 2, 
          mb: 3, 
          borderRadius: 2, 
          backgroundColor: alpha(theme.palette.primary.main, 0.1),
          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
        }}>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
            Os dados base do cliente (Nome, CPF e Empreendimento) já serão preenchidos automaticamente.
            Preencha os campos da negociação abaixo para gerar o documento completo. Se você deixar algum em branco, ele ficará vazio no documento.
          </Typography>
        </Box>
        
        <Grid container spacing={2}>
          {fields.map((field) => (
            <Grid item xs={12} sm={6} md={4} key={field.name}>
              <TextField
                fullWidth
                size="small"
                label={field.label}
                name={field.name}
                value={formData[field.name] || ''}
                onChange={handleChange}
                variant="outlined"
                InputProps={{
                  sx: {
                    borderRadius: 2,
                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: alpha(theme.palette.primary.main, 0.5),
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.primary.main,
                    }
                  }
                }}
                InputLabelProps={{
                  sx: { color: theme.palette.text.secondary }
                }}
              />
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      
      <DialogActions sx={{ p: '16px 24px' }}>
        <Button 
          onClick={onClose} 
          color="inherit"
          sx={{ color: theme.palette.text.secondary, fontWeight: 700 }}
        >
          Cancelar
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        <Button 
          onClick={handleSendWhatsApp}
          variant="outlined"
          color="success"
          sx={{ 
            fontWeight: 700, 
            borderColor: theme.palette.success.main, 
            color: theme.palette.success.main,
            '&:hover': {
              backgroundColor: alpha(theme.palette.success.main, 0.1),
              borderColor: theme.palette.success.main,
            }
          }}
        >
          Enviar via WhatsApp
        </Button>
        <GradientButton onClick={handleGenerate}>
          Baixar Documento
        </GradientButton>
      </DialogActions>
    </StyledDialog>
  );
}
