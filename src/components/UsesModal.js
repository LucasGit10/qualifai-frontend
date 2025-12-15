import React from 'react';
import {
    Box,
    Button,
    Checkbox,
    Container,
    Divider,
    FormControlLabel,
    List,
    ListItem,
    ListItemText,
    Modal,
    Typography,
    useTheme, // Hook para acessar o tema
    alpha     // Utilitário para trabalhar com cores transparentes
} from '@mui/material';

// O estilo agora é uma função que recebe o tema para usar seus valores dinamicamente
const getModalStyle = (theme) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 800, // Largura máxima levemente aumentada para melhor legibilidade
  // Aplicando o efeito de vidro usando as cores do tema
  backgroundColor: alpha(theme.palette.background.paper, 0.8),
  backdropFilter: 'blur(10px)',
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: 24,
  p: 4,
  borderRadius: 4, // Corresponde a 16px
  display: 'flex',
  flexDirection: 'column',
  color: theme.palette.text.primary, // Definindo a cor de texto padrão para o modal
});

// Conteúdo extraído do arquivo original
const policySections = [
    {
        id: 'panel1',
        title: '1. Definições',
        content: (
            <>
                <Typography paragraph>Para os fins deste instrumento, aplicam-se as seguintes definições:</Typography>
                <List dense>
                    <ListItem><ListItemText primary="Cliente: A pessoa jurídica que contrata a Qualifai, autorizada a acessar e usar a Plataforma nos termos deste documento." /></ListItem>
                    <ListItem><ListItemText primary="Usuários Autorizados: Funcionários, representantes ou prestadores de serviço do Cliente, cadastrados na Plataforma para operá-la em nome da empresa." /></ListItem>
                    <ListItem><ListItemText primary="Leads: Potenciais clientes submetidos à qualificação automatizada pela Plataforma." /></ListItem>
                    <ListItem><ListItemText primary="Dados Pessoais: Informações que identificam ou podem identificar pessoas naturais, conforme definido pela Lei Geral de Proteção de Dados (Lei nº 13.709/2018 – LGPD)." /></ListItem>
                    <ListItem><ListItemText primary="Serviço: O conjunto de funcionalidades disponibilizadas pela Plataforma, incluindo captura, enriquecimento, qualificação de leads e agendamento de reuniões." /></ListItem>
                </List>
            </>
        )
    },
    {
        id: 'panel2',
        title: '2. Objeto',
        content: (
            <>
                <Typography paragraph>
                    A Qualifai disponibiliza ao Cliente o acesso e uso de uma plataforma digital para qualificação automatizada de leads por meio de inteligência artificial, com base em parâmetros previamente definidos pelo Cliente, com funcionalidades que podem incluir:
                </Typography>
                <List dense>
                    <ListItem><ListItemText primary="Integração com ferramentas de CRM, APIs e planilhas;" /></ListItem>
                    <ListItem><ListItemText primary="Classificação de leads como frios, mornos ou quentes;" /></ListItem>
                    <ListItem><ListItemText primary="Enriquecimento automático com dados públicos e/ou coletados com consentimento;" /></ListItem>
                    <ListItem><ListItemText primary="Agendamento de reuniões com leads qualificados;" /></ListItem>
                    <ListItem><ListItemText primary="Geração de relatórios e dashboards de desempenho." /></ListItem>
                </List>
            </>
        )
    },
    {
        id: 'panel3',
        title: '3. Aceite e Modificação dos Termos',
        content: (
            <>
                <Typography paragraph><strong>a.</strong> O uso da Plataforma implica na aceitação total e irrestrita destes Termos.</Typography>
                <Typography paragraph><strong>b.</strong> A Qualifai poderá alterar estes Termos a qualquer momento, por razões legais, técnicas ou operacionais, mediante notificação prévia de, no mínimo, 10 (dez) dias.</Typography>
                <Typography paragraph><strong>c.</strong> Caso o Cliente não concorde com os novos termos, poderá solicitar o encerramento de sua conta sem ônus, com a preservação de dados conforme previsto na cláusula 7.</Typography>
            </>
        )
    },
    {
        id: 'panel4',
        title: '4. Direitos e Obrigações da Qualifai',
        content: (
            <>
                <Typography variant="h6" component="h3" sx={{fontSize: '1rem', mb: 1}}>4.1. Licença de Uso</Typography>
                <Typography paragraph>A Qualifai concede ao Cliente uma licença limitada, não exclusiva, intransferível e revogável para usar a Plataforma, exclusivamente para os fins previstos neste contrato e de acordo com os planos contratados.</Typography>
                
                <Typography variant="h6" component="h3" sx={{fontSize: '1rem', mt: 2, mb: 1}}>4.2. Propriedade Intelectual</Typography>
                <Typography paragraph>Todos os direitos relacionados à Plataforma, incluindo códigos-fonte, APIs, interfaces, logotipos, algoritmos e documentos são de propriedade exclusiva da Qualifai. Nenhum direito de propriedade intelectual é transferido ao Cliente.</Typography>

                <Typography variant="h6" component="h3" sx={{fontSize: '1rem', mt: 2, mb: 1}}>4.3. Atualizações e Suporte</Typography>
                <Typography>A Qualifai se compromete a manter a Plataforma atualizada, funcional e segura, oferecendo suporte técnico nos prazos e canais definidos em contrato.</Typography>
            </>
        )
    },
    {
        id: 'panel5',
        title: '5. Direitos e Obrigações do Cliente',
        content: (
            <>
                <Typography variant="h6" component="h3" sx={{fontSize: '1rem', mb: 1}}>5.1. Responsabilidades do Cliente</Typography>
                <Typography paragraph>O Cliente se compromete a:</Typography>
                <List dense>
                    <ListItem><ListItemText primary="Utilizar a Plataforma de forma ética, lícita e em conformidade com a legislação vigente;" /></ListItem>
                    <ListItem><ListItemText primary="Fornecer dados verdadeiros e atualizados;" /></ListItem>
                    <ListItem><ListItemText primary="Proteger suas credenciais de acesso;" /></ListItem>
                    <ListItem><ListItemText primary="Garantir que os leads submetidos à Plataforma foram obtidos de forma lícita, com as devidas permissões e consentimentos exigidos por lei." /></ListItem>
                </List>

                <Typography variant="h6" component="h3" sx={{fontSize: '1rem', mt: 2, mb: 1}}>5.2. Condutas Proibidas</Typography>
                <Typography paragraph>É vedado ao Cliente:</Typography>
                <List dense>
                    <ListItem><ListItemText primary="Utilizar a Plataforma para coleta ou análise de dados para fins discriminatórios, políticos, sensíveis ou não autorizados;" /></ListItem>
                    <ListItem><ListItemText primary="Integrar ou exportar dados da Plataforma para sistemas de 'scoring', segmentação abusiva, marketing ilegal ou revenda;" /></ListItem>
                    <ListItem><ListItemText primary="Realizar engenharia reversa, cópia ou clonagem da Plataforma;" /></ListItem>
                    <ListItem><ListItemText primary="Criar contas falsas ou automatizar interações sem autorização prévia." /></ListItem>
                </List>
            </>
        )
    },
    {
        id: 'panel6',
        title: '6. Tratamento de Dados Pessoais',
        content: (
            <>
                <Typography variant="h6" component="h3" sx={{fontSize: '1rem', mb: 1}}>6.1. Finalidade e Base Legal</Typography>
                <Typography paragraph>A Qualifai coleta, trata e armazena dados exclusivamente com o propósito de prestar os serviços contratados, nos termos da LGPD. O Cliente declara ser o controlador dos dados de leads e usuários que insere na Plataforma, atuando a Qualifai como operadora.</Typography>
                
                <Typography variant="h6" component="h3" sx={{fontSize: '1rem', mt: 2, mb: 1}}>6.2. Compartilhamento com Terceiros</Typography>
                <Typography paragraph>A Qualifai poderá compartilhar dados com:</Typography>
                <List dense>
                    <ListItem><ListItemText primary="Fornecedores e subprocessadores contratados para infraestrutura, como serviços em nuvem e APIs externas;" /></ListItem>
                    <ListItem><ListItemText primary="Autoridades judiciais ou administrativas, mediante ordem legal;" /></ListItem>
                    <ListItem><ListItemText primary="Com o consentimento expresso do Cliente." /></ListItem>
                </List>

                <Typography variant="h6" component="h3" sx={{fontSize: '1rem', mt: 2, mb: 1}}>6.3. Retenção e Exclusão de Dados</Typography>
                <Typography paragraph>Os dados serão mantidos pelo período necessário para a prestação dos serviços, podendo ser excluídos:</Typography>
                <List dense>
                    <ListItem><ListItemText primary="Mediante solicitação do Cliente;" /></ListItem>
                    <ListItem><ListItemText primary="Após o fim da relação contratual, respeitadas as obrigações legais." /></ListItem>
                </List>
            </>
        )
    },
    {
        id: 'panel7',
        title: '7. Segurança da Informação',
        content: (
            <>
                <Typography paragraph>A Qualifai emprega medidas técnicas e administrativas razoáveis para proteger os dados, incluindo:</Typography>
                <List dense>
                    <ListItem><ListItemText primary="Criptografia em trânsito e em repouso;" /></ListItem>
                    <ListItem><ListItemText primary="Controle de acesso por níveis de permissão;" /></ListItem>
                    <ListItem><ListItemText primary="Monitoramento de logs;" /></ListItem>
                    <ListItem><ListItemText primary="Backups periódicos;" /></ListItem>
                    <ListItem><ListItemText primary="Procedimentos de resposta a incidentes." /></ListItem>
                </List>
            </>
        )
    },
    {
        id: 'panel8',
        title: '8. Auditoria e Monitoramento',
        content: (
            <Typography>
                A Qualifai se reserva o direito de auditar o uso da Plataforma pelo Cliente, sempre que necessário para: verificar o cumprimento dos Termos; investigar denúncias ou irregularidades; garantir a segurança da infraestrutura.
            </Typography>
        )
    },
    {
        id: 'panel9',
        title: '9. Suspensão e Cancelamento',
        content: (
            <>
                <Typography paragraph><strong>a.</strong> A Qualifai poderá suspender ou cancelar o acesso do Cliente, com ou sem aviso prévio, em caso de:</Typography>
                <List dense>
                    <ListItem><ListItemText primary="Violação destes Termos;" /></ListItem>
                    <ListItem><ListItemText primary="Uso fraudulento, abusivo ou ilegal da Plataforma;" /></ListItem>
                    <ListItem><ListItemText primary="Inadimplência contratual superior a 30 dias." /></ListItem>
                </List>
                <Typography paragraph><strong>b.</strong> Em caso de rescisão, o Cliente poderá solicitar uma cópia dos dados armazenados, no prazo de 15 dias após o fim do contrato.</Typography>
            </>
        )
    },
    {
        id: 'panel10',
        title: '10. Limitação de Responsabilidade',
        content: (
            <>
                <Typography paragraph>A Qualifai não será responsável por:</Typography>
                <List dense>
                    <ListItem><ListItemText primary="Falhas de terceiros, incluindo provedores de internet, energia ou hospedagem;" /></ListItem>
                    <ListItem><ListItemText primary="Danos indiretos, lucros cessantes, perdas ou interrupções de negócios causados por mau uso da Plataforma;" /></ListItem>
                    <ListItem><ListItemText primary="Dados inseridos de forma incorreta ou ilícita pelo Cliente." /></ListItem>
                </List>
                <Typography>A responsabilidade da Qualifai limita-se ao valor proporcional dos serviços contratados nos últimos 3 meses anteriores ao evento danoso.</Typography>
            </>
        )
    },
    {
        id: 'panel11',
        title: '11. Foro e Legislação Aplicável',
        content: (
            <Typography>
                Estes Termos são regidos pela legislação brasileira, em especial o Código Civil, o Marco Civil da Internet e a LGPD. Fica eleito o foro da Comarca de Uberlândia-MG, sede da Qualifai, com renúncia expressa a qualquer outro, por mais privilegiado que seja.
            </Typography>
        )
    },
    {
        id: 'panel12',
        title: '12. POLÍTICA DE COOKIES – QUALIFAI',
        content: (
            <>
                <Typography variant="h6" component="h3" sx={{fontSize: '1rem', mb: 1}}>12.1. O que são cookies?</Typography>
                <Typography paragraph>Cookies são pequenos arquivos de texto armazenados em seu navegador quando você visita um site. Eles ajudam a lembrar suas preferências, melhorar a navegação e entender como você interage com o conteúdo da plataforma.</Typography>
                
                <Typography variant="h6" component="h3" sx={{fontSize: '1rem', mt: 2, mb: 1}}>12.2. Para que usamos cookies?</Typography>
                <Typography paragraph>Utilizamos cookies para:</Typography>
                <List dense>
                    <ListItem><ListItemText primary="Funcionamento essencial: Garantir que o site funcione corretamente (login, sessão, navegação segura)." /></ListItem>
                    <ListItem><ListItemText primary="Desempenho e estatísticas: Entender como os usuários utilizam a plataforma, identificando erros e melhorando funcionalidades." /></ListItem>
                    <ListItem><ListItemText primary="Personalização: Lembrar preferências e comportamentos para oferecer uma experiência mais relevante." /></ListItem>
                    <ListItem><ListItemText primary="Marketing e publicidade (se aplicável): Exibir conteúdos ou campanhas mais alinhados ao seu perfil (somente com seu consentimento)." /></ListItem>
                </List>

                <Typography variant="h6" component="h3" sx={{fontSize: '1rem', mt: 2, mb: 1}}>12.3. Tipos de cookies que utilizamos</Typography>
                <Box>
                    <Typography><strong>Tipo de Cookie:</strong> Cookies essenciais</Typography>
                    <Typography><strong>Finalidade:</strong> Permitir funcionalidades básicas como login e navegação</Typography>
                    <Typography><strong>Necessário?</strong> ✅ Sim</Typography>
                    <Divider sx={{ my: 1 }} />
                    <Typography><strong>Tipo de Cookie:</strong> Cookies de desempenho</Typography>
                    <Typography><strong>Finalidade:</strong> Coletar dados para análise de uso da plataforma</Typography>
                    <Typography><strong>Necessário?</strong> ❌ Não (opcional)</Typography>
                    <Divider sx={{ my: 1 }} />
                    <Typography><strong>Tipo de Cookie:</strong> Cookies de funcionalidade</Typography>
                    <Typography><strong>Finalidade:</strong> Armazenar preferências do usuário (idioma, tema, etc.)</Typography>
                    <Typography><strong>Necessário?</strong> ❌ Não (opcional)</Typography>
                    <Divider sx={{ my: 1 }} />
                    <Typography><strong>Tipo de Cookie:</strong> Cookies de marketing</Typography>
                    <Typography><strong>Finalidade:</strong> Usados para personalizar anúncios e rastrear conversões</Typography>
                    <Typography><strong>Necessário?</strong> ❌ Não (opcional)</Typography>
                </Box>

                <Typography variant="h6" component="h3" sx={{fontSize: '1rem', mt: 2, mb: 1}}>12.4. Como gerenciar os cookies</Typography>
                <Typography paragraph>Você pode aceitar ou recusar os cookies não essenciais através do banner exibido ao acessar o site. Também é possível controlar os cookies diretamente nas configurações do seu navegador, bloqueando ou excluindo arquivos já armazenados.</Typography>
                <Typography>⚠️ <strong>Atenção:</strong> O bloqueio de cookies essenciais pode afetar a funcionalidade da plataforma.</Typography>
                
                <Typography variant="h6" component="h3" sx={{fontSize: '1rem', mt: 2, mb: 1}}>12.5. Cookies de terceiros</Typography>
                <Typography paragraph>Podemos utilizar serviços de terceiros, como Google Analytics, Meta Pixel e serviços de chat ou atendimento. Esses serviços também podem armazenar cookies em seu navegador. Recomendamos que você consulte as políticas de privacidade desses fornecedores.</Typography>

                <Typography variant="h6" component="h3" sx={{fontSize: '1rem', mt: 2, mb: 1}}>12.6. Alterações nesta política</Typography>
                <Typography>Esta Política de Cookies pode ser atualizada para refletir mudanças nas práticas da Qualifai ou em requisitos legais. A data da última atualização será sempre indicada no início deste documento.</Typography>
            </>
        )
    },
    {
        id: 'panel13',
        title: '13. Fale conosco',
        content: (
            <>
                <Typography paragraph>Se você tiver alguma dúvida sobre o uso de cookies ou sobre seus direitos, entre em contato conosco:</Typography>
                <Typography><strong>Email:</strong> contato@qualifai.tech</Typography>
                <Divider sx={{ my: 2 }}/>
                <Typography>Ao continuar utilizando a Qualifai, você declara estar ciente e de acordo com o uso de cookies conforme descrito nesta política.</Typography>
            </>
        )
    }
];

export default function TermsOfUseModal({ open, onClose, onConfirm }) {
  const theme = useTheme(); // Acessa o tema aqui
  const [isAgreed, setIsAgreed] = React.useState(false);
  const [scrolledToEnd, setScrolledToEnd] = React.useState(false);

  const handleConfirm = () => {
    if (isAgreed && scrolledToEnd) {
      onConfirm();
    }
  };

  const handleScroll = (event) => {
    if (scrolledToEnd) return;
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 5) { // tolerância de 5px
      setScrolledToEnd(true);
    }
  };

  // Propriedade SX para a área de conteúdo rolável, usando valores do tema
  const scrollableBoxSx = {
    flexGrow: 1,
    maxHeight: 450,
    overflowY: 'auto',
    p: 3,
    mt: 2,
    backgroundColor: alpha(theme.palette.background.default, 0.5),
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: 2,
    color: theme.palette.text.secondary, // Define a cor base do texto para a política
    '& strong': {
      color: theme.palette.text.primary, // Torna o texto em negrito mais proeminente
    },
    '& .MuiListItem-root': { // Estiliza os itens da lista para melhor espaçamento
      paddingTop: 0,
      paddingBottom: '4px',
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="terms-of-use-modal-title"
    >
      <Box sx={getModalStyle(theme)}>
        <Typography id="terms-of-use-modal-title" variant="h5" component="h2" sx={{ fontWeight: 700 }}>
          Termos de Uso da Plataforma Qualifai
        </Typography>

        <Typography variant="body2" sx={{ mt: 1, mb: 2, color: 'text.secondary' }}>
          Última atualização: 07 de outubro de 2025
        </Typography>
        
        <Box onScroll={handleScroll} sx={scrollableBoxSx}>
            <Typography variant="body2" paragraph>
              Estes Termos de Uso regem a utilização da plataforma digital Qualifai (Plataforma de propriedade de IoTeam Softwares e Aplicativos LTDA”), pessoa jurídica de direito privado, inscrita no CNPJ sob o nº 53.564.165/0001-52, com sede na Rua São Conrado nº 110 (Apt 103), doravante denominada “Qualifai” ou “nós”.
            </Typography>
            <Typography variant="body2" paragraph>
              Ao utilizar qualquer funcionalidade da Plataforma, o Cliente declara que leu, compreendeu e concorda integralmente com estes Termos, além da Política de Privacidade e demais documentos regulatórios que complementam este instrumento.
            </Typography>
            <Typography variant="body2" paragraph sx={{ fontStyle: 'italic', color: 'text.primary' }}>
                <strong>O que é o serviço?</strong> A Qualifai é uma plataforma B2B SaaS (Software como Serviço) de automação comercial que atua como um SDR virtual, utilizando inteligência artificial para qualificar leads e agendar reuniões automaticamente.
            </Typography>
            <Divider sx={{ my: 2, borderColor: 'divider' }} />
            
            {policySections.map((section) => (
                <Box key={section.id} sx={{ mb: 3 }}>
                    <Typography variant="h6" component="h3" sx={{fontSize: '1.1rem', mb: 1.5}}>
                        <strong>{section.title}</strong>
                    </Typography>
                    {section.content}
                </Box>
            ))}
        </Box>

        <FormControlLabel
          disabled={!scrolledToEnd}
          control={
            <Checkbox
              checked={isAgreed}
              onChange={(e) => setIsAgreed(e.target.checked)}
              name="termsAgreement"
              color="primary" // O tema cuida da cor
            />
          }
          label="Eu li, entendi e concordo plenamente com os Termos de Uso da Plataforma Qualifai."
          sx={{ mt: 2, display: 'block' }} 
        />
        
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button 
            variant="text" 
            onClick={onClose} 
            sx={{ color: 'text.secondary' }} // Botão de cancelar menos proeminente
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleConfirm}
            disabled={!scrolledToEnd || !isAgreed}
            // Aplicando o gradiente personalizado do tema
            sx={{
                background: theme.palette.custom.gradients.button,
                transition: 'opacity 0.3s ease',
                '&:disabled': {
                    opacity: 0.5,
                    color: theme.palette.text.secondary
                }
            }}
          >
            Confirmar e Criar Conta
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}