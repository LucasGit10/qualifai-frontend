import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    List,
    ListItem,
    ListItemText,
    Divider,
    Box,
    Button,
    useTheme,
    useMediaQuery
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const policySections = [
    {
        id: 'panel1',
        title: '1. Definições',
        content: (
            <>
                <Typography paragraph sx={{ color: '#333', lineHeight: 1.8 }}>Para os fins deste documento, aplicam-se as seguintes definições:</Typography>
                <List dense>
                    <ListItem><ListItemText primary={<Typography variant="body2" sx={{ color: '#333' }}><strong style={{ color: '#3a1c71' }}>Cliente:</strong> A pessoa jurídica contratante da Qualifai, autorizada a acessar e usar a Plataforma nos termos deste documento.</Typography>} /></ListItem>
                    <ListItem><ListItemText primary={<Typography variant="body2" sx={{ color: '#333' }}><strong style={{ color: '#3a1c71' }}>Usuários Autorizados:</strong> Funcionários, representantes ou prestadores de serviço do Cliente, cadastrados na Plataforma para operá-la em nome da empresa.</Typography>} /></ListItem>
                    <ListItem><ListItemText primary={<Typography variant="body2" sx={{ color: '#333' }}><strong style={{ color: '#3a1c71' }}>Leads:</strong> Potenciais clientes submetidos para qualificação automatizada pela Plataforma.</Typography>} /></ListItem>
                    <ListItem><ListItemText primary={<Typography variant="body2" sx={{ color: '#333' }}><strong style={{ color: '#3a1c71' }}>Dados Pessoais:</strong> Informações que identificam ou podem identificar pessoas naturais, conforme definição da Lei Geral de Proteção de Dados (Lei nº 13.709/2018 – LGPD).</Typography>} /></ListItem>
                    <ListItem><ListItemText primary={<Typography variant="body2" sx={{ color: '#333' }}><strong style={{ color: '#3a1c71' }}>Serviço:</strong> O conjunto de funcionalidades providas pela Plataforma, incluindo captura, enriquecimento, qualificação de leads e agendamento de reuniões.</Typography>} /></ListItem>
                </List>
            </>
        )
    },
    {
        id: 'panel2',
        title: '2. Objeto',
        content: (
            <>
                <Typography paragraph sx={{ color: '#333', lineHeight: 1.8 }}>
                    A Qualifai disponibiliza ao Cliente o acesso e uso de uma plataforma digital para qualificação automatizada de leads por meio de inteligência artificial, com base em parâmetros previamente definidos pelo Cliente, cujas funcionalidades podem incluir:
                </Typography>
                <List dense>
                    <ListItem><ListItemText primary={<Typography sx={{ color: '#333' }}>Integração com ferramentas de CRM, APIs e planilhas;</Typography>} /></ListItem>
                    <ListItem><ListItemText primary={<Typography sx={{ color: '#333' }}>Classificação de leads como frios, mornos ou quentes;</Typography>} /></ListItem>
                    <ListItem><ListItemText primary={<Typography sx={{ color: '#333' }}>Enriquecimento automático com dados públicos e/ou dados coletados com consentimento;</Typography>} /></ListItem>
                    <ListItem><ListItemText primary={<Typography sx={{ color: '#333' }}>Agendamento de reuniões com leads qualificados;</Typography>} /></ListItem>
                    <ListItem><ListItemText primary={<Typography sx={{ color: '#333' }}>Geração de relatórios de desempenho e dashboards.</Typography>} /></ListItem>
                </List>
            </>
        )
    },
    {
        id: 'panel3',
        title: '3. Aceite e Modificação dos Termos',
        content: (
            <>
                <Typography paragraph sx={{ color: '#333', lineHeight: 1.8 }}><strong>a.</strong> O uso da Plataforma implica na aceitação integral e irrestrita destes Termos.</Typography>
                <Typography paragraph sx={{ color: '#333', lineHeight: 1.8 }}><strong>b.</strong> A Qualifai poderá alterar estes Termos a qualquer tempo, por razões legais, técnicas ou operacionais, mediante aviso prévio de, no mínimo, 10 (dez) dias.</Typography>
                <Typography paragraph sx={{ color: '#333', lineHeight: 1.8 }}><strong>c.</strong> Caso o Cliente não concorde com os novos termos, poderá solicitar o encerramento de sua conta sem ônus, ressalvada a guarda de dados conforme cláusula 7.</Typography>
            </>
        )
    },
    {
        id: 'panel4',
        title: '4. Direitos e Obrigações da Qualifai',
        content: (
            <>
                <Typography variant="h6" sx={{ color: '#3a1c71', fontSize: '1rem', fontWeight: 700, mb: 1 }}>4.1. Licença de Uso</Typography>
                <Typography paragraph sx={{ color: '#333', lineHeight: 1.8 }}>A Qualifai concede ao Cliente uma licença limitada, não exclusiva, intransferível e revogável para usar a Plataforma, exclusivamente para os fins previstos neste contrato e de acordo com os planos contratados.</Typography>
                
                <Typography variant="h6" sx={{ color: '#3a1c71', fontSize: '1rem', fontWeight: 700, mb: 1, mt: 2 }}>4.2. Propriedade Intelectual</Typography>
                <Typography paragraph sx={{ color: '#333', lineHeight: 1.8 }}>Todos os direitos relativos à Plataforma, incluindo códigos-fonte, APIs, interfaces, logotipos, algoritmos e documentos, são de propriedade exclusiva da Qualifai. Nenhum direito de propriedade intelectual é transferido ao Cliente.</Typography>

                <Typography variant="h6" sx={{ color: '#3a1c71', fontSize: '1rem', fontWeight: 700, mb: 1, mt: 2 }}>4.3. Atualizações e Suporte</Typography>
                <Typography sx={{ color: '#333', lineHeight: 1.8 }}>A Qualifai se compromete a manter a Plataforma atualizada, funcional e segura, oferecendo suporte técnico nos prazos e canais definidos em contrato.</Typography>
            </>
        )
    },
    {
        id: 'panel5',
        title: '5. Direitos e Obrigações do Cliente',
        content: (
            <>
                <Typography variant="h6" sx={{ color: '#3a1c71', fontSize: '1rem', fontWeight: 700, mb: 1 }}>5.1. Responsabilidades do Cliente</Typography>
                <Typography paragraph sx={{ color: '#333', lineHeight: 1.8 }}>O Cliente se compromete a:</Typography>
                <List dense>
                    <ListItem><ListItemText primary={<Typography sx={{ color: '#333' }}>Utilizar a Plataforma de forma ética, lícita e em conformidade com a legislação vigente;</Typography>} /></ListItem>
                    <ListItem><ListItemText primary={<Typography sx={{ color: '#333' }}>Fornecer dados verdadeiros e atualizados;</Typography>} /></ListItem>
                    <ListItem><ListItemText primary={<Typography sx={{ color: '#333' }}>Proteger suas credenciais de acesso;</Typography>} /></ListItem>
                    <ListItem><ListItemText primary={<Typography sx={{ color: '#333' }}>Garantir que os leads submetidos à Plataforma foram obtidos de forma lícita, com as devidas permissões e consentimentos exigidos por lei.</Typography>} /></ListItem>
                </List>

                <Typography variant="h6" sx={{ color: '#3a1c71', fontSize: '1rem', fontWeight: 700, mb: 1, mt: 2 }}>5.2. Condutas Proibidas</Typography>
                <Typography paragraph sx={{ color: '#333', lineHeight: 1.8 }}>É vedado ao Cliente:</Typography>
                <List dense>
                    <ListItem><ListItemText primary={<Typography sx={{ color: '#333' }}>Usar a Plataforma para coleta ou análise de dados para fins discriminatórios, políticos, sensíveis ou não autorizados;</Typography>} /></ListItem>
                    <ListItem><ListItemText primary={<Typography sx={{ color: '#333' }}>Integrar ou exportar dados da Plataforma para sistemas de 'scoring', segmentação abusiva, marketing ilegal ou revenda;</Typography>} /></ListItem>
                    <ListItem><ListItemText primary={<Typography sx={{ color: '#333' }}>Realizar engenharia reversa, copiar ou clonar a Plataforma;</Typography>} /></ListItem>
                    <ListItem><ListItemText primary={<Typography sx={{ color: '#333' }}>Criar contas falsas ou automatizar interações sem autorização prévia.</Typography>} /></ListItem>
                </List>
            </>
        )
    },
    {
        id: 'panel6',
        title: '6. Tratamento de Dados Pessoais',
        content: (
            <>
                <Typography variant="h6" sx={{ color: '#3a1c71', fontSize: '1rem', fontWeight: 700, mb: 1 }}>6.1. Finalidade e Base Legal</Typography>
                <Typography paragraph sx={{ color: '#333', lineHeight: 1.8 }}>A Qualifai coleta, trata e armazena dados exclusivamente com o propósito de prestar os serviços contratados, nos termos da LGPD. O Cliente se declara controlador dos dados dos leads e usuários que insere na Plataforma, atuando a Qualifai como operadora.</Typography>
                
                <Typography variant="h6" sx={{ color: '#3a1c71', fontSize: '1rem', fontWeight: 700, mb: 1, mt: 2 }}>6.2. Compartilhamento com Terceiros</Typography>
                <Typography paragraph sx={{ color: '#333', lineHeight: 1.8 }}>A Qualifai poderá compartilhar dados com:</Typography>
                <List dense>
                    <ListItem><ListItemText primary={<Typography sx={{ color: '#333' }}>Fornecedores e subprocessadores contratados para infraestrutura, como serviços de nuvem e APIs externas;</Typography>} /></ListItem>
                    <ListItem><ListItemText primary={<Typography sx={{ color: '#333' }}>Autoridades judiciais ou administrativas, mediante ordem legal;</Typography>} /></ListItem>
                    <ListItem><ListItemText primary={<Typography sx={{ color: '#333' }}>Com o consentimento expresso do Cliente.</Typography>} /></ListItem>
                </List>

                <Typography variant="h6" sx={{ color: '#3a1c71', fontSize: '1rem', fontWeight: 700, mb: 1, mt: 2 }}>6.3. Retenção e Exclusão de Dados</Typography>
                <Typography paragraph sx={{ color: '#333', lineHeight: 1.8 }}>Os dados serão mantidos pelo período necessário para a prestação dos serviços, podendo ser excluídos:</Typography>
                <List dense>
                    <ListItem><ListItemText primary={<Typography sx={{ color: '#333' }}>Mediante solicitação do Cliente;</Typography>} /></ListItem>
                    <ListItem><ListItemText primary={<Typography sx={{ color: '#333' }}>Após o fim da relação contratual, respeitadas as obrigações legais.</Typography>} /></ListItem>
                </List>
            </>
        )
    },
    {
        id: 'panel7',
        title: '7. Segurança da Informação',
        content: (
            <>
                <Typography paragraph sx={{ color: '#333', lineHeight: 1.8 }}>A Qualifai emprega medidas técnicas e administrativas razoáveis para proteger os dados, incluindo:</Typography>
                <List dense>
                    <ListItem><ListItemText primary={<Typography sx={{ color: '#333' }}>Criptografia em trânsito e em repouso;</Typography>} /></ListItem>
                    <ListItem><ListItemText primary={<Typography sx={{ color: '#333' }}>Controle de acesso por níveis de permissão;</Typography>} /></ListItem>
                    <ListItem><ListItemText primary={<Typography sx={{ color: '#333' }}>Monitoramento de logs;</Typography>} /></ListItem>
                    <ListItem><ListItemText primary={<Typography sx={{ color: '#333' }}>Backups periódicos;</Typography>} /></ListItem>
                    <ListItem><ListItemText primary={<Typography sx={{ color: '#333' }}>Procedimentos de resposta a incidentes.</Typography>} /></ListItem>
                </List>
            </>
        )
    },
    {
        id: 'panel8',
        title: '8. Auditoria e Monitoramento',
        content: (
            <Typography sx={{ color: '#333', lineHeight: 1.8 }}>
                A Qualifai reserva-se o direito de auditar o uso da Plataforma pelo Cliente, sempre que necessário para: verificar o cumprimento dos Termos; investigar denúncias ou irregularidades; garantir a segurança da infraestrutura.
            </Typography>
        )
    },
    {
        id: 'panel9',
        title: '9. Suspensão e Cancelamento',
        content: (
            <>
                <Typography paragraph sx={{ color: '#333', lineHeight: 1.8 }}><strong>a.</strong> A Qualifai poderá suspender ou cancelar o acesso do Cliente, com ou sem aviso prévio, em caso de:</Typography>
                <List dense>
                    <ListItem><ListItemText primary={<Typography sx={{ color: '#333' }}>Violação destes Termos;</Typography>} /></ListItem>
                    <ListItem><ListItemText primary={<Typography sx={{ color: '#333' }}>Uso fraudulento, abusivo ou ilegal da Plataforma;</Typography>} /></ListItem>
                    <ListItem><ListItemText primary={<Typography sx={{ color: '#333' }}>Inadimplência contratual superior a 30 dias.</Typography>} /></ListItem>
                </List>
                <Typography paragraph sx={{ color: '#333', lineHeight: 1.8 }}><strong>b.</strong> Em caso de rescisão, o Cliente poderá solicitar cópia dos dados armazenados, no prazo de 15 dias após o fim do contrato.</Typography>
            </>
        )
    },
    {
        id: 'panel10',
        title: '10. Limitação de Responsabilidade',
        content: (
            <>
                <Typography paragraph sx={{ color: '#333', lineHeight: 1.8 }}>A Qualifai não será responsável por:</Typography>
                <List dense>
                    <ListItem><ListItemText primary={<Typography sx={{ color: '#333' }}>Falhas de terceiros, incluindo provedores de internet, energia ou hospedagem;</Typography>} /></ListItem>
                    <ListItem><ListItemText primary={<Typography sx={{ color: '#333' }}>Danos indiretos, lucros cessantes, perdas comerciais ou interrupções causadas pelo mau uso da Plataforma;</Typography>} /></ListItem>
                    <ListItem><ListItemText primary={<Typography sx={{ color: '#333' }}>Dados inseridos de forma incorreta ou ilícita pelo Cliente.</Typography>} /></ListItem>
                </List>
                <Typography sx={{ color: '#333', lineHeight: 1.8 }}>A responsabilidade da Qualifai limita-se ao valor proporcional dos serviços contratados nos 3 meses anteriores ao evento danoso.</Typography>
            </>
        )
    },
    {
        id: 'panel11',
        title: '11. Foro e Lei Aplicável',
        content: (
            <Typography sx={{ color: '#333', lineHeight: 1.8 }}>
                Estes Termos são regidos pela legislação brasileira, em especial o Código Civil, o Marco Civil da Internet e a LGPD. Fica eleito o foro da Comarca de Uberlândia-MG, sede da Qualifai, com renúncia expressa a qualquer outro, por mais privilegiado que seja.
            </Typography>
        )
    },
    {
        id: 'panel12',
        title: '12. POLÍTICA DE COOKIES – QUALIFAI',
        content: (
            <>
                <Typography variant="h6" sx={{ color: '#3a1c71', fontSize: '1rem', fontWeight: 700, mb: 1 }}>12.1. O que são cookies?</Typography>
                <Typography paragraph sx={{ color: '#333', lineHeight: 1.8 }}>Cookies são pequenos arquivos de texto armazenados em seu navegador quando você visita um site. Eles ajudam a lembrar suas preferências, melhorar a navegação e entender como você interage com o conteúdo da plataforma.</Typography>
                
                <Typography variant="h6" sx={{ color: '#3a1c71', fontSize: '1rem', fontWeight: 700, mb: 1, mt: 2 }}>12.2. Por que usamos cookies?</Typography>
                <Typography paragraph sx={{ color: '#333', lineHeight: 1.8 }}>Usamos cookies para:</Typography>
                <List dense>
                    <ListItem><ListItemText primary={<Typography sx={{ color: '#333' }}>Funcionamento essencial: Garantir que o site funcione corretamente (login, sessão, navegação segura).</Typography>} /></ListItem>
                    <ListItem><ListItemText primary={<Typography sx={{ color: '#333' }}>Desempenho e estatísticas: Entender como os usuários utilizam a plataforma, identificando erros e melhorando funcionalidades.</Typography>} /></ListItem>
                    <ListItem><ListItemText primary={<Typography sx={{ color: '#333' }}>Personalização: Lembrar preferências e comportamentos para oferecer uma experiência mais relevante.</Typography>} /></ListItem>
                    <ListItem><ListItemText primary={<Typography sx={{ color: '#333' }}>Marketing e publicidade (se aplicável): Exibir conteúdos ou campanhas mais alinhados ao seu perfil (apenas com seu consentimento).</Typography>} /></ListItem>
                </List>

                <Typography variant="h6" sx={{ color: '#3a1c71', fontSize: '1rem', fontWeight: 700, mb: 1, mt: 2 }}>12.3. Tipos de cookies que usamos</Typography>
                <Box sx={{ border: '1px solid #eee', borderRadius: 2, p: 2 }}>
                    <Box>
                        <Typography><strong>Tipo de Cookie:</strong> Cookies Essenciais</Typography>
                        <Typography variant="body2" sx={{ color: '#444' }}><strong>Propósito:</strong> Permitem funcionalidades básicas como login e navegação</Typography>
                        <Typography variant="body2"><strong>Necessário?</strong> ✅ Sim</Typography>
                        <Divider sx={{ my: 1.5 }} />
                        <Typography><strong>Tipo de Cookie:</strong> Cookies de Desempenho</Typography>
                        <Typography variant="body2" sx={{ color: '#444' }}><strong>Propósito:</strong> Coletam dados para análise de uso da plataforma</Typography>
                        <Typography variant="body2"><strong>Necessário?</strong> ❌ Não (opcional)</Typography>
                        <Divider sx={{ my: 1.5 }} />
                        <Typography><strong>Tipo de Cookie:</strong> Cookies de Funcionalidade</Typography>
                        <Typography variant="body2" sx={{ color: '#444' }}><strong>Propósito:</strong> Armazenam preferências do usuário (idioma, tema, etc.)</Typography>
                        <Typography variant="body2"><strong>Necessário?</strong> ❌ Não (opcional)</Typography>
                        <Divider sx={{ my: 1.5 }} />
                        <Typography><strong>Tipo de Cookie:</strong> Cookies de Marketing</Typography>
                        <Typography variant="body2" sx={{ color: '#444' }}><strong>Propósito:</strong> Usados para personalizar anúncios e rastrear conversões</Typography>
                        <Typography variant="body2"><strong>Necessário?</strong> ❌ Não (opcional)</Typography>
                    </Box>
                </Box>

                <Typography variant="h6" sx={{ color: '#3a1c71', fontSize: '1rem', fontWeight: 700, mb: 1, mt: 2 }}>12.4. Como gerenciar cookies</Typography>
                <Typography paragraph sx={{ color: '#333', lineHeight: 1.8 }}>Você pode aceitar ou recusar os cookies não essenciais através do banner exibido ao acessar o site. Você também pode controlar os cookies diretamente nas configurações do seu navegador, bloqueando ou excluindo arquivos já armazenados.</Typography>
                <Typography sx={{ color: '#333', lineHeight: 1.8 }}>⚠️ <strong>Atenção:</strong> O bloqueio de cookies essenciais pode afetar a funcionalidade da plataforma.</Typography>
                
                <Typography variant="h6" sx={{ color: '#3a1c71', fontSize: '1rem', fontWeight: 700, mb: 1, mt: 2 }}>12.5. Cookies de terceiros</Typography>
                <Typography paragraph sx={{ color: '#333', lineHeight: 1.8 }}>Podemos usar serviços de terceiros, como Google Analytics, Meta Pixel e serviços de chat ou suporte. Esses serviços também podem armazenar cookies em seu navegador. Recomendamos que consulte as políticas de privacidade desses fornecedores.</Typography>

                <Typography variant="h6" sx={{ color: '#3a1c71', fontSize: '1rem', fontWeight: 700, mb: 1, mt: 2 }}>12.6. Mudanças nesta política</Typography>
                <Typography sx={{ color: '#333', lineHeight: 1.8 }}>Esta Política de Cookies pode ser atualizada para refletir mudanças nas práticas da Qualifai ou requisitos legais. A data da última atualização será sempre indicada no início deste documento.</Typography>
            </>
        )
    },
    {
        id: 'panel13',
        title: '13. Contato',
        content: (
            <>
                <Typography paragraph sx={{ color: '#333', lineHeight: 1.8 }}>Se você tiver alguma dúvida sobre o uso de cookies ou sobre seus direitos, entre em contato conosco:</Typography>
                <Typography sx={{ color: '#333', lineHeight: 1.8 }}><strong>Email:</strong> <span style={{ color: '#3a1c71', fontWeight: 600 }}>contato@qualifai.tech</span></Typography>
                <Divider sx={{ my: 2 }}/>
                <Typography sx={{ color: '#333', lineHeight: 1.8 }}>Ao continuar usando o Qualifai, você declara estar ciente e concordar com o uso de cookies conforme descrito nesta política.</Typography>
            </>
        )
    },
    {
        id: 'panel14',
        title: '14. Planos e Custos de Terceiros',
        content: (
            <>
                 <Typography paragraph sx={{ color: '#333', lineHeight: 1.8 }}>
                    Os valores dos planos cobrem <strong>exclusivamente</strong> nosso serviço de inteligência artificial integrado ao WhatsApp para envio de mensagens, bem como as demais funcionalidades da plataforma.
                </Typography>
                <Box sx={{ border: '1px dashed #3a1c71', borderRadius: 2, p: 2, bgcolor: 'rgba(58, 28, 113, 0.05)' }}>
                    <Typography variant="subtitle2" sx={{ color: '#3a1c71', fontWeight: 700, mb: 1 }}>Nota Importante sobre Custos da Meta:</Typography>
                    <Typography variant="body2" sx={{ color: '#333' }}>
                        Custos do WhatsApp (Meta) <strong>não estão inclusos</strong>. Atualmente, a taxa é de aprox. <strong>R$ 0,34</strong> por conversa iniciada ativamente, sujeita a alteração pela Meta sem aviso prévio.
                    </Typography>
                </Box>
            </>
        )
    }
];

function TermsOfUsePage() {
    const [expanded, setExpanded] = useState(false);
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            backgroundColor: '#ffffff',
            color: '#1a1a1a',
            pb: 8
        }}>
            <Box sx={{ 
                position: 'sticky', 
                top: 0, 
                zIndex: 100, 
                bgcolor: 'rgba(255,255,255,0.9)', 
                backdropFilter: 'blur(10px)',
                borderBottom: '1px solid #eaeaea',
                py: { xs: 2, md: 3 }
            }}>
                <Container maxWidth="xl" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Button
                        onClick={() => navigate(-1)}
                        startIcon={<ArrowBackIcon />}
                        sx={{ 
                            color: '#3a1c71', // Alterado para roxo escuro
                            textTransform: 'none', 
                            fontWeight: 600,
                            '&:hover': { bgcolor: '#f5f5f5', color: '#3a1c71' }
                        }}
                    >
                        Voltar
                    </Button>
                    <Box 
                        component="img" 
                        src="/Logoooo 1.png" 
                        alt="QualifAI" 
                        sx={{ 
                            height: { xs: 50, md: 45 },
                            objectFit: 'contain' 
                        }} 
                    />
                    <Box sx={{ width: 64 }} />
                </Container>
            </Box>

            <Container maxWidth="xl" sx={{ mt: 6 }}>
                
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Typography variant="overline" sx={{ fontWeight: 700, letterSpacing: 2, color: '#3a1c71' }}>
                        JURÍDICO & CONTRATUAL
                    </Typography>
                    <Typography 
                        variant={isMobile ? "h4" : "h3"} 
                        component="h1" 
                        sx={{ 
                            fontWeight: 800, 
                            mt: 1, 
                            mb: 2,
                            background: 'linear-gradient(135deg, #1a1a1a 0%, #3a1c71 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        Termos de Uso da Plataforma Qualifai
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#3a1c71', fontWeight: 500 }}>
                        Uma solução IoTeam
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1, color: '#777' }}>
                        Última atualização: 18 de agosto de 2025
                    </Typography>
                </Box>

                <Box sx={{ my: 5, p: 3, bgcolor: '#f8f9fa', borderRadius: 3, borderLeft: '5px solid #3a1c71' }}>
                    <Typography paragraph sx={{ color: '#333', lineHeight: 1.7 }}>
                        Estes Termos de Uso regulam o uso da plataforma digital Qualifai (Plataforma de propriedade da IoTeam Softwares e Aplicativos LTDA), pessoa jurídica de direito privado, inscrita no CNPJ sob o nº 53.564.165/0001-52, com sede na Rua São Conrado nº 110 (Apt 103), doravante denominada "Qualifai" ou "nós".
                    </Typography>
                    <Typography paragraph sx={{ color: '#333', lineHeight: 1.7 }}>
                        Ao utilizar qualquer funcionalidade da Plataforma, o Cliente declara que leu, entendeu e concorda integralmente com estes Termos, além da Política de Privacidade e demais documentos regulatórios que complementam este instrumento.
                    </Typography>
                    <Typography paragraph sx={{ color: '#333', lineHeight: 1.7, fontWeight: 500, fontStyle: 'italic' }}>
                        <strong>O que é o serviço?</strong> O Qualifai é uma plataforma de automação comercial B2B SaaS (Software as a Service) que atua como um SDR virtual, usando inteligência artificial para qualificar leads e agendar reuniões automaticamente.
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {policySections.map((section) => {
                        const isExpanded = expanded === section.id;
                        return (
                            <Accordion
                                key={section.id}
                                expanded={isExpanded}
                                onChange={handleChange(section.id)}
                                disableGutters
                                elevation={0}
                                sx={{
                                    border: isExpanded ? '1px solid #3a1c71' : '1px solid #eaeaea',
                                    borderRadius: '12px !important',
                                    transition: 'all 0.3s ease',
                                    backgroundColor: '#fff',
                                    boxShadow: isExpanded ? '0 10px 30px -10px rgba(58, 28, 113, 0.15)' : 'none',
                                    '&:hover': {
                                        borderColor: isExpanded ? '#3a1c71' : '#ccc',
                                        transform: isExpanded ? 'none' : 'translateY(-2px)'
                                    },
                                    '&:before': { display: 'none' }
                                }}
                            >
                                <AccordionSummary
                                    expandIcon={
                                        <ExpandMoreIcon sx={{ 
                                            color: isExpanded ? '#3a1c71' : '#777', // Alterado
                                            transition: 'transform 0.3s'
                                        }} />
                                    }
                                    sx={{
                                        px: 3,
                                        py: 1,
                                        '& .MuiAccordionSummary-content': { my: 2 }
                                    }}
                                >
                                    <Typography sx={{ 
                                        fontWeight: isExpanded ? 700 : 600, 
                                        fontSize: '1.1rem',
                                        color: isExpanded ? '#3a1c71' : '#333', // Alterado
                                        transition: 'color 0.2s'
                                    }}>
                                        {section.title}
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails sx={{ px: 3, pb: 4, pt: 0 }}>
                                    <Box sx={{ height: '1px', width: '100%', bgcolor: '#f0f0f0', mb: 3 }} />
                                    {section.content}
                                </AccordionDetails>
                            </Accordion>
                        );
                    })}
                </Box>

                <Box sx={{ mt: 10, textAlign: 'center', borderTop: '1px solid #eaeaea', pt: 4 }}>
                    <Typography variant="body2" sx={{ color: '#777' }}>
                        © {new Date().getFullYear()} QualifAI - Grupo loTeam. Todos os direitos reservados.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}

export default TermsOfUsePage;