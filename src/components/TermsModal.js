import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Modal,
  Checkbox,
  FormControlLabel,
  useTheme,
  alpha,
} from '@mui/material';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 750,
  bgcolor: 'background.paper',
  border: '1px solid',
  borderColor: 'divider',
  boxShadow: 24,
  borderRadius: 4,
  display: 'flex',
  flexDirection: 'column',
  maxHeight: '90vh', 
  p: { xs: 2, sm: 3, md: 4 },
};

export default function PolicyModal({ open, onClose, onConfirm }) {
  const theme = useTheme();
  const [isAgreed, setIsAgreed] = useState(false);
  const [scrolledToEnd, setScrolledToEnd] = useState(false);

  const handleConfirm = () => {
    if (isAgreed && scrolledToEnd) {
      onConfirm();
    }
  };

  const handleScroll = (event) => {
    if (scrolledToEnd) return;
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 5) {
      setScrolledToEnd(true);
    }
  };
  
  const scrollableBoxSx = {
    flexGrow: 1,
    overflowY: 'auto',
    p: { xs: 1.5, sm: 2, md: 3 },
    mt: 2,
    backgroundColor: alpha(theme.palette.background.default, 0.5),
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: 2,
    color: 'text.secondary',
    '& strong': {
      color: 'text.primary',
    },
    '& ul': {
      paddingLeft: '20px'
    },
    '& li': {
      marginBottom: '8px'
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="terms-modal-title"
    >
      <Box sx={modalStyle}>
        <Typography 
          id="terms-modal-title" 
          variant="h5" 
          component="h2" 
          sx={{
            fontWeight: 700,
            fontSize: { xs: '1.25rem', sm: '1.5rem' } 
          }}
        >
          Política de Privacidade e Proteção de Dados
        </Typography>

        <Typography variant="body2" sx={{ mt: 1, mb: 2, color: 'text.secondary' }}>
          Grupo IoTeam Software e Aplicativos (QualifAI)
        </Typography>
        
        <Box onScroll={handleScroll} sx={scrollableBoxSx}>
            <Typography variant="h6" component="h3" sx={{fontSize: '1.1rem', mb: 1}}><strong>1. Introdução</strong></Typography>
            <Typography variant="body2" paragraph>
                O Grupo IoTeam Software e Aplicativos tem o compromisso de proteger a privacidade e os dados pessoais de seus Clientes, Usuários Finais e visitantes de seus websites. Esta Política visa esclarecer de forma transparente como tratamos os dados pessoais, em conformidade com a legislação vigente.
            </Typography>
            <Typography variant="body2" paragraph>
                Esta Política se aplica a todas as empresas do Grupo IoTeam. Se tiver alguma dúvida após a leitura, entre em contato conosco pelo e-mail: contato@qualifai.tech.
            </Typography>

            <Typography variant="h6" component="h3" sx={{fontSize: '1.1rem', mt: 2, mb: 1}}><strong>2. Definições</strong></Typography>
            <Typography variant="body2" paragraph>
                Para facilitar a compreensão, aqui estão algumas definições importantes usadas nesta Política:
            </Typography>
            <Typography component="div">
                <ul>
                    <li><Typography variant="body2"><strong>Autoridade de Proteção de Dados:</strong> órgão regulador responsável por fiscalizar a legislação aplicável.</Typography></li>
                    <li><Typography variant="body2"><strong>Bases legais:</strong> fundamentos jurídicos que legitimam o tratamento de dados pessoais.</Typography></li>
                    <li><Typography variant="body2"><strong>Cliente:</strong> pessoa jurídica que utiliza os serviços do Grupo IoTeam.</Typography></li>
                    <li><Typography variant="body2"><strong>Controlador:</strong> quem determina as finalidades e os meios de tratamento dos dados pessoais.</Typography></li>
                    <li><Typography variant="body2"><strong>Processador:</strong> quem trata os dados em nome do controlador.</Typography></li>
                    <li><Typography variant="body2"><strong>Dados pessoais:</strong> qualquer informação que identifique ou possa identificar uma pessoa natural.</Typography></li>
                    <li><Typography variant="body2"><strong>DPO (Encarregado de Proteção de Dados):</strong> profissional responsável pela comunicação entre o controlador, os titulares dos dados e a autoridade.</Typography></li>
                    <li><Typography variant="body2"><strong>Cookies/Web Beacons:</strong> tecnologias de rastreamento usadas para coletar dados de navegação.</Typography></li>
                    <li><Typography variant="body2"><strong>Titular dos dados:</strong> a pessoa a quem os dados pessoais se referem.</Typography></li>
                    <li><Typography variant="body2"><strong>Tratamento:</strong> qualquer operação realizada com dados pessoais.</Typography></li>
                    <li><Typography variant="body2"><strong>Usuário Final:</strong> pessoa natural que utiliza os serviços fornecidos ao Cliente.</Typography></li>
                </ul>
            </Typography>

            <Typography variant="h6" component="h3" sx={{fontSize: '1.1rem', mt: 2, mb: 1}}><strong>3. Quais dados coletamos e para quais finalidades?</strong></Typography>
            <Typography variant="body2" paragraph>
                <strong>3.1 Coleta de Dados Pessoais</strong><br/>
                Os dados pessoais coletados variam de acordo com sua interação com nossos serviços:
            </Typography>
            <Typography component="div" >
                <ul>
                    <li><Typography variant="body2"><strong>Acesso ao site:</strong> endereço IP, data e hora, navegador, localização geográfica.</Typography></li>
                    <li><Typography variant="body2"><strong>Cadastro:</strong> nome, e-mail, cargo, nome de usuário, senha, nome da empresa.</Typography></li>
                    <li><Typography variant="body2"><strong>Contratação de serviços:</strong> nome, CPF, endereço, cargo, empresa, telefone, e-mail, dados bancários.</Typography></li>
                    <li><Typography variant="body2"><strong>Suporte e atendimento:</strong> nome, e-mail, telefone, empresa e gravação (em chamadas de voz).</Typography></li>
                    <li><Typography variant="body2"><strong>Marketing e comunicação:</strong> nome, e-mail, telefone, empresa.</Typography></li>
                    <li><Typography variant="body2"><strong>Melhoria da experiência digital:</strong> dados de navegação e comportamento no site.</Typography></li>
                    <li><Typography variant="body2"><strong>Pesquisas de satisfação:</strong> nome, empresa, cargo, local, respostas fornecidas.</Typography></li>
                    <li><Typography variant="body2"><strong>Relações com fornecedores:</strong> nome, CPF, endereço, cargo, empresa, telefone, e-mail, dados bancários.</Typography></li>
                    <li><Typography variant="body2"><strong>Processos de recrutamento:</strong> nome, e-mail e telefone fornecidos por plataformas de recrutamento.</Typography></li>
                    <li><Typography variant="body2"><strong>Campanhas de marketing:</strong> nome, sobrenome, e-mail e telefone.</Typography></li>
                </ul>
            </Typography>
            <Typography variant="body2" paragraph sx={{mt: 2}}>
                <strong>3.2 Dados do Usuário Final</strong><br/>
                No contexto de nossos serviços, atuamos como Processadores, tratando os dados pessoais de acordo com as instruções de nossos Clientes, que são os Controladores. Recomendamos que os Usuários Finais consultem diretamente a política de privacidade do respectivo Cliente com quem têm relação.
            </Typography>
            
            <Typography variant="h6" component="h3" sx={{fontSize: '1.1rem', mt: 2, mb: 1}}><strong>4. Cookies e Tecnologias Semelhantes</strong></Typography>
            <Typography variant="body2" paragraph>
                Utilizamos cookies para melhorar sua experiência em nosso site. Os tipos utilizados são: Necessários, de Análise, de Funcionalidade e de Marketing. Você pode gerenciar suas preferências a qualquer momento através da opção “Declaração de Cookies” disponível no rodapé do site.
            </Typography>
            <Typography variant="body2" paragraph>
                 <strong>4.1 Web Beacons:</strong> Usados para analisar o tráfego e o comportamento no site. Você pode desativá-los alterando as configurações do seu navegador para bloquear imagens e scripts.
            </Typography>
            
            <Typography variant="h6" component="h3" sx={{fontSize: '1.1rem', mt: 2, mb: 1}}><strong>5. Compartilhamento de Dados</strong></Typography>
            <Typography variant="body2" paragraph>
                Seus dados podem ser compartilhados com: Empresas do Grupo IoTeam Software e Aplicativos; Prestadores de serviços sob contrato; Plataformas de análise de dados; Parceiros de marketing e publicidade; Autoridades públicas, em cumprimento a obrigações legais; Terceiros, quando necessário para proteger direitos.
            </Typography>

            <Typography variant="h6" component="h3" sx={{fontSize: '1.1rem', mt: 2, mb: 1}}><strong>6. Transferência Internacional de Dados</strong></Typography>
            <Typography variant="body2" paragraph>
                Os dados pessoais podem ser transferidos para outros países, como Estados Unidos, Argentina, México e Brasil, respeitando os requisitos legais e adotando medidas de segurança adequadas. Ao continuar a usar nossos serviços, você concorda com essa transferência.
            </Typography>

            <Typography variant="h6" component="h3" sx={{fontSize: '1.1rem', mt: 2, mb: 1}}><strong>7. Comunicações de Marketing</strong></Typography>
            <Typography variant="body2" paragraph>
                Podemos usar seus dados para enviar comunicações promocionais. O consentimento será solicitado sempre que necessário, e todas as mensagens conterão uma opção para cancelar a inscrição.
            </Typography>

            <Typography variant="h6" component="h3" sx={{fontSize: '1.1rem', mt: 2, mb: 1}}><strong>8. Segurança dos Dados</strong></Typography>
            <Typography variant="body2" paragraph>
                Adotamos medidas técnicas e administrativas rigorosas para proteger seus dados pessoais contra acessos não autorizados e situações acidentais. Sua colaboração é essencial: evite compartilhar senhas ou informações sensíveis com terceiros.
            </Typography>

            <Typography variant="h6" component="h3" sx={{fontSize: '1.1rem', mt: 2, mb: 1}}><strong>9. Período de Armazenamento</strong></Typography>
            <Typography variant="body2" paragraph>
                Seus dados são armazenados pelo tempo necessário para cumprir as finalidades informadas ou as obrigações legais. Mesmo após um pedido de exclusão, podemos reter alguns dados para fins legais ou regulatórios.
            </Typography>

            <Typography variant="h6" component="h3" sx={{fontSize: '1.1rem', mt: 2, mb: 1}}><strong>10. Dados de Crianças e Adolescentes</strong></Typography>
            <Typography variant="body2" paragraph>
                Nossos serviços não são destinados a menores de idade. Se identificarmos o tratamento indevido de dados de crianças ou adolescentes, providenciaremos sua exclusão imediata.
            </Typography>

            <Typography variant="h6" component="h3" sx={{fontSize: '1.1rem', mt: 2, mb: 1}}><strong>11. Direitos do Titular dos Dados</strong></Typography>
            <Typography variant="body2" paragraph>
                Você, como titular dos dados, tem os seguintes direitos: Confirmar a existência de tratamento; Acessar seus dados; Corrigir dados incompletos ou incorretos; Solicitar anonimização, bloqueio ou exclusão; Solicitar portabilidade; Saber com quem seus dados foram compartilhados; Revogar o consentimento; Opor-se ao tratamento de dados; Solicitar a revisão de decisões automatizadas.
            </Typography>
             <Typography variant="body2" paragraph>
                Para exercer seus direitos, preencha o Formulário de Requisição do Titular, disponível em nosso site, ou solicite-o através do canal de contato com o DPO.
            </Typography>

            <Typography variant="h6" component="h3" sx={{fontSize: '1.1rem', mt: 2, mb: 1}}><strong>12. Contato com o Encarregado de Proteção de Dados (DPO)</strong></Typography>
            <Typography variant="body2" paragraph>
                <strong>DPO:</strong> Matheus César Bento Arantes – OAB/MG 159.983<br/>
                <strong>Email:</strong> contato@qualifai.tech
            </Typography>

            <Typography variant="h6" component="h3" sx={{fontSize: '1.1rem', mt: 2, mb: 1}}><strong>13. Atualizações desta Política</strong></Typography>
            <Typography variant="body2" paragraph>
                Esta Política pode ser atualizada periodicamente. Recomendamos que você a consulte com frequência. O uso contínuo de nossos produtos, serviços e sites após as alterações indica sua concordância com os novos termos.
            </Typography>
        </Box>

        <FormControlLabel
          disabled={!scrolledToEnd}
          control={
            <Checkbox
              checked={isAgreed}
              onChange={(e) => setIsAgreed(e.target.checked)}
              name="termsAgreement"
              color="primary"
            />
          }
          label="Eu li, entendi e concordo plenamente com a Política de Privacidade e Proteção de Dados."
          sx={{ mt: 2, display: 'block' }} 
        />
        
        <Box 
          sx={{ 
            mt: 3, 
            display: 'flex', 
            gap: 2,
            flexDirection: { xs: 'column-reverse', sm: 'row' },
            justifyContent: 'flex-end',
          }}
        >
          <Button 
            variant="text" 
            onClick={onClose} 
            sx={{
              color: 'text.secondary',
              width: { xs: '100%', sm: 'auto' }
            }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleConfirm}
            disabled={!scrolledToEnd || !isAgreed}
            sx={{
                background: theme.palette.custom.gradients.button,
                transition: 'opacity 0.3s ease',
                '&:disabled': {
                    opacity: 0.5,
                    color: theme.palette.text.secondary
                },
                width: { xs: '100%', sm: 'auto' }
            }}
          >
            Confirmar e Criar Conta
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}