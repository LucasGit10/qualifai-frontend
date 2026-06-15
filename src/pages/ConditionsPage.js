import React from 'react';
import {
    Box,
    Container,
    Typography,
    List,
    ListItem,
    ListItemText,
    Button,
    Paper
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const updatedAt = '15 de junho de 2026';

const Section = ({ title, children }) => (
    <Paper variant="outlined" sx={{ p: { xs: 2.5, md: 4 }, mb: 2.5, borderRadius: 3 }}>
        <Typography variant="h5" component="h2" sx={{ color: '#3a1c71', fontWeight: 700, mb: 2 }}>
            {title}
        </Typography>
        {children}
    </Paper>
);

const Paragraph = ({ children }) => (
    <Typography paragraph sx={{ color: '#333', lineHeight: 1.8 }}>{children}</Typography>
);

const Items = ({ items }) => (
    <List dense>
        {items.map((item) => (
            <ListItem key={item} sx={{ py: 0.4 }}>
                <ListItemText primary={<Typography sx={{ color: '#333', lineHeight: 1.7 }}>{item}</Typography>} />
            </ListItem>
        ))}
    </List>
);

function PrivacyPolicyPage() {
    const navigate = useNavigate();

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#fff', pb: 8 }}>
            <Box sx={{ position: 'sticky', top: 0, zIndex: 100, bgcolor: 'rgba(255,255,255,0.94)', borderBottom: '1px solid #eee', py: 2 }}>
                <Container maxWidth="lg">
                    <Button onClick={() => navigate(-1)} startIcon={<ArrowBackIcon />} sx={{ color: '#3a1c71', textTransform: 'none', fontWeight: 600 }}>
                        Voltar
                    </Button>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ mt: 6 }}>
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <Typography variant="overline" sx={{ color: '#3a1c71', fontWeight: 700, letterSpacing: 2 }}>
                        JURIDICO E PRIVACIDADE
                    </Typography>
                    <Typography variant="h3" component="h1" sx={{ fontWeight: 800, my: 1 }}>
                        Politica de Privacidade e Protecao de Dados
                    </Typography>
                    <Typography sx={{ color: '#666' }}>Ultima atualizacao: {updatedAt}</Typography>
                </Box>

                <Section title="1. Quem somos e a quem esta Politica se aplica">
                    <Paragraph>
                        A Qualifai e uma plataforma da IoTeam Softwares e Aplicativos LTDA, CNPJ 53.564.165/0001-52. Esta Politica explica como tratamos dados pessoais de clientes, usuarios da plataforma, visitantes, fornecedores e pessoas contatadas por empresas que utilizam a Qualifai.
                    </Paragraph>
                    <Paragraph>
                        Quando tratamos dados para administrar contas, contratos, pagamentos, seguranca, suporte e nosso site, a Qualifai atua como controladora. Quando uma empresa contratante insere dados de seus clientes, devedores, leads ou contatos e utiliza a plataforma para se comunicar com eles, essa empresa normalmente atua como controladora e a Qualifai atua como operadora, seguindo suas instrucoes documentadas.
                    </Paragraph>
                </Section>

                <Section title="2. Responsabilidade da empresa contratante">
                    <Paragraph>
                        A empresa contratante declara e se compromete a inserir e utilizar somente dados obtidos licitamente e necessarios para finalidades legitimas. Ela deve definir e documentar a base legal aplicavel, informar os titulares quando exigido, respeitar seus direitos e manter evidencias que demonstrem a regularidade do tratamento.
                    </Paragraph>
                    <Paragraph>
                        A existencia de contrato entre a empresa contratante e seu cliente pode ser uma evidencia relevante e fundamentar determinados tratamentos, mas nao autoriza automaticamente qualquer uso dos dados. A licitude depende da finalidade, da base legal adequada e do cumprimento da LGPD, das regras de comunicacoes comerciais e das politicas dos canais utilizados.
                    </Paragraph>
                    <Paragraph>
                        A Qualifai nao compra bases clandestinas, nao autoriza spam, perseguicao, discriminacao, fraude ou uso de dados para finalidade incompativel. Podemos suspender o tratamento ou solicitar comprovacoes quando identificarmos risco, denuncia ou indicio de irregularidade.
                    </Paragraph>
                </Section>

                <Section title="3. Dados pessoais tratados">
                    <Items items={[
                        'Dados de cadastro e contrato: nome, empresa, cargo, CPF ou CNPJ, e-mail, telefone, endereco, credenciais e informacoes de cobranca.',
                        'Dados inseridos pelas empresas contratantes: nome, CPF ou CNPJ, telefones, e-mails, empresa, contatos, dividas, parcelas, vencimentos, garantidores, observacoes, status de cobranca e historico de relacionamento.',
                        'Dados de conversas: mensagens, respostas, anexos, audios, documentos, identificadores, datas, status de entrega e historico de atendimento em canais conectados.',
                        'Dados de integracoes: identificadores, tokens de autorizacao, contas conectadas e informacoes necessarias para operar WhatsApp, Instagram, CRM, calendario, e-mail e demais servicos habilitados pelo cliente.',
                        'Dados tecnicos e de seguranca: IP, dispositivo, navegador, logs, eventos de acesso, cookies, erros e registros de auditoria.',
                        'Dados gerados pela plataforma: classificacoes, resumos, sugestoes, proximas acoes, relatorios, metricas e inferencias produzidas por automacao ou inteligencia artificial.'
                    ]} />
                    <Paragraph>
                        A plataforma nao deve ser utilizada para inserir dados pessoais sensiveis, dados de criancas e adolescentes ou informacoes excessivas, salvo quando houver necessidade comprovada, base legal adequada e autorizacao contratual especifica.
                    </Paragraph>
                </Section>

                <Section title="4. Finalidades e bases legais">
                    <Items items={[
                        'Criar contas, autenticar usuarios, executar contratos, faturar e prestar suporte.',
                        'Importar, organizar e atualizar cadastros, leads, dividas, parcelas e historicos informados pela empresa contratante.',
                        'Enviar, receber e armazenar comunicacoes nos canais habilitados pela empresa contratante.',
                        'Automatizar atendimento, cobranca, qualificacao, agendamento, relatorios e proximas acoes.',
                        'Gerar analises, resumos e sugestoes com inteligencia artificial, sujeitos a revisao humana quando apropriado.',
                        'Prevenir fraude, proteger contas, manter logs, investigar incidentes e cumprir obrigacoes legais.',
                        'Melhorar a plataforma com dados agregados ou anonimizados sempre que possivel.'
                    ]} />
                    <Paragraph>
                        Conforme o contexto, o tratamento pode se apoiar na execucao de contrato, cumprimento de obrigacao legal ou regulatoria, exercicio regular de direitos, legitimo interesse, protecao do credito ou consentimento. A empresa contratante e responsavel por determinar a base legal aplicavel aos dados que controla e pelas comunicacoes que solicita.
                    </Paragraph>
                </Section>

                <Section title="5. WhatsApp, Instagram, Meta e outros canais">
                    <Paragraph>
                        Quando o cliente conecta uma conta do WhatsApp Business, Instagram ou outro canal, a Qualifai trata os dados necessarios para autenticar a integracao, consultar a conta conectada, receber webhooks, enviar e receber mensagens, midias e modelos aprovados, registrar status e apresentar o historico na plataforma.
                    </Paragraph>
                    <Paragraph>
                        O uso desses canais tambem esta sujeito aos termos e politicas de seus fornecedores, inclusive Meta. A empresa contratante deve possuir autorizacao para usar a conta conectada, respeitar as regras de opt-in e opt-out, janelas de atendimento, modelos aprovados e demais politicas aplicaveis.
                    </Paragraph>
                </Section>

                <Section title="6. Inteligencia artificial e decisoes automatizadas">
                    <Paragraph>
                        A Qualifai pode utilizar inteligencia artificial para classificar contatos, resumir conversas, sugerir respostas e proximas acoes, gerar conteudo e apoiar automacoes. Entradas e resultados podem ser enviados a provedores tecnologicos contratados somente na medida necessaria para executar a funcionalidade habilitada.
                    </Paragraph>
                    <Paragraph>
                        Resultados automatizados podem conter erros e devem ser revisados pela empresa contratante antes de decisoes com efeitos relevantes. O titular pode solicitar informacoes e revisao de decisoes tomadas unicamente com base em tratamento automatizado, nos termos da legislacao aplicavel.
                    </Paragraph>
                </Section>

                <Section title="7. Compartilhamento, subprocessadores e transferencia internacional">
                    <Paragraph>
                        Podemos compartilhar dados com fornecedores de infraestrutura em nuvem, banco de dados, seguranca, comunicacao, Meta e canais conectados, inteligencia artificial, e-mail, calendario, pagamentos, suporte e analise. O compartilhamento e limitado ao necessario para prestar o servico, cumprir a lei ou proteger direitos.
                    </Paragraph>
                    <Paragraph>
                        Alguns fornecedores podem tratar dados fora do Brasil. Nessas situacoes, adotamos mecanismos contratuais e medidas compativeis com a LGPD e exigimos protecao adequada dos dados. Nao vendemos dados pessoais controlados pelos clientes.
                    </Paragraph>
                </Section>

                <Section title="8. Retencao, exclusao e seguranca">
                    <Paragraph>
                        Conservamos dados pelo tempo necessario para prestar os servicos, cumprir obrigacoes legais, exercer direitos e atender aos prazos definidos no contrato com a empresa contratante. Apos o encerramento, os dados podem ser excluidos ou anonimizados, ressalvadas copias de seguranca e retencoes legalmente permitidas.
                    </Paragraph>
                    <Paragraph>
                        Adotamos medidas tecnicas e administrativas razoaveis, incluindo controle de acesso, autenticacao, registros de auditoria, protecao de credenciais, backups e procedimentos de resposta a incidentes. Nenhum sistema e absolutamente seguro. Incidentes relevantes serao tratados e comunicados conforme a legislacao.
                    </Paragraph>
                </Section>

                <Section title="9. Direitos dos titulares">
                    <Paragraph>
                        Titulares podem solicitar confirmacao de tratamento, acesso, correcao, anonimização, bloqueio, eliminacao, portabilidade, informacoes sobre compartilhamento, oposicao, revogacao de consentimento e revisao de decisoes automatizadas, quando aplicavel.
                    </Paragraph>
                    <Paragraph>
                        Para dados inseridos por uma empresa contratante, a solicitacao deve preferencialmente ser dirigida a essa empresa, que e a controladora. A Qualifai prestara assistencia para atendimento das solicitacoes conforme o contrato e a LGPD.
                    </Paragraph>
                </Section>

                <Section title="10. Cookies, contato e atualizacoes">
                    <Paragraph>
                        Utilizamos cookies essenciais para login, seguranca e funcionamento. Cookies analiticos, funcionais ou de marketing, quando utilizados, devem respeitar as preferencias apresentadas ao visitante.
                    </Paragraph>
                    <Paragraph>
                        Duvidas, solicitacoes de privacidade ou comunicacoes sobre dados podem ser enviadas para contato@qualifai.tech. O encarregado indicado pela Qualifai e Matheus Cesar Bento Arantes, OAB/MG 159.983.
                    </Paragraph>
                    <Paragraph>
                        Esta Politica pode ser atualizada para refletir mudancas legais, tecnicas ou operacionais. Alteracoes relevantes serao comunicadas pelos canais apropriados.
                    </Paragraph>
                </Section>

                <Typography variant="body2" sx={{ textAlign: 'center', color: '#777', mt: 5 }}>
                    © {new Date().getFullYear()} Qualifai - IoTeam Softwares e Aplicativos LTDA.
                </Typography>
            </Container>
        </Box>
    );
}

export default PrivacyPolicyPage;
