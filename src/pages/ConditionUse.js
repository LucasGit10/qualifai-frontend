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

function TermsOfUsePage() {
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
                        JURIDICO E CONTRATUAL
                    </Typography>
                    <Typography variant="h3" component="h1" sx={{ fontWeight: 800, my: 1 }}>
                        Termos de Uso da Plataforma Qualifai
                    </Typography>
                    <Typography sx={{ color: '#666' }}>Ultima atualizacao: {updatedAt}</Typography>
                </Box>

                <Section title="1. Identificacao, aceite e objeto">
                    <Paragraph>
                        Estes Termos regulam o uso da plataforma Qualifai, fornecida pela IoTeam Softwares e Aplicativos LTDA, CNPJ 53.564.165/0001-52, com sede em Uberlandia, Minas Gerais. Ao contratar ou utilizar a plataforma, a empresa contratante declara que leu e aceita estes Termos e a Politica de Privacidade.
                    </Paragraph>
                    <Paragraph>
                        A Qualifai e uma plataforma empresarial de atendimento, cobranca, qualificacao, automacao e gestao de relacionamento. Suas funcionalidades podem incluir importacao de planilhas, gestao de contatos e dividas, integracoes, WhatsApp, Instagram, e-mail, agenda, relatorios e recursos de inteligencia artificial.
                    </Paragraph>
                </Section>

                <Section title="2. Uso licito de dados pessoais">
                    <Paragraph>
                        A empresa contratante e responsavel pelos dados pessoais que insere, importa, conecta ou solicita que sejam tratados na plataforma. Ela declara possuir relacao legitima com os titulares e base legal adequada para cada finalidade, incluindo comunicacoes de atendimento, cobranca, qualificacao ou marketing.
                    </Paragraph>
                    <Paragraph>
                        Contratos, consentimentos, relacoes comerciais, obrigacoes legais, exercicio regular de direitos, protecao do credito e legitimo interesse podem fundamentar tratamentos em situacoes especificas. A simples existencia de contrato nao autoriza usos excessivos, incompativeis, enganosos ou proibidos.
                    </Paragraph>
                    <Items items={[
                        'Manter provas da origem dos dados, da base legal e das autorizacoes aplicaveis.',
                        'Fornecer avisos de privacidade e atender aos direitos dos titulares.',
                        'Inserir apenas dados adequados, necessarios, corretos e atualizados.',
                        'Respeitar pedidos de oposicao, descadastramento e interrupcao de contato.',
                        'Comunicar imediatamente qualquer suspeita de uso indevido ou incidente.'
                    ]} />
                </Section>

                <Section title="3. Papel das partes na LGPD">
                    <Paragraph>
                        Em relacao aos dados de clientes, devedores, leads e contatos inseridos pela empresa contratante, ela normalmente atua como controladora e a Qualifai atua como operadora, tratando dados conforme instrucoes documentadas para prestar os servicos.
                    </Paragraph>
                    <Paragraph>
                        A Qualifai atua como controladora dos dados necessarios para administrar a propria relacao comercial, contas de usuarios, faturamento, seguranca, prevencao a fraudes, suporte, cumprimento legal e melhoria da plataforma com dados agregados ou anonimizados.
                    </Paragraph>
                    <Paragraph>
                        A Qualifai podera utilizar subprocessadores para infraestrutura, comunicacao, inteligencia artificial, pagamentos e outras funcoes necessarias, observando requisitos de seguranca e protecao de dados.
                    </Paragraph>
                </Section>

                <Section title="4. Canais de comunicacao e politicas de terceiros">
                    <Paragraph>
                        Ao conectar WhatsApp, Instagram, CRM, e-mail, calendario ou outro servico, a empresa contratante confirma que possui autorizacao para usar a conta e permite que a Qualifai trate identificadores, tokens, mensagens, midias, contatos e eventos necessarios para operar a integracao.
                    </Paragraph>
                    <Paragraph>
                        A empresa contratante deve cumprir os termos e politicas dos fornecedores conectados, inclusive as regras da Meta sobre WhatsApp Business e Instagram, modelos de mensagem, consentimento, opt-in, opt-out, qualidade e conteudo. Custos cobrados por terceiros nao estao incluidos, salvo previsao expressa no plano ou contrato.
                    </Paragraph>
                </Section>

                <Section title="5. Inteligencia artificial e automacoes">
                    <Paragraph>
                        Recursos de inteligencia artificial podem gerar classificacoes, resumos, sugestoes, mensagens e proximas acoes. Esses resultados sao auxiliares, podem conter imprecisoes e nao substituem avaliacao humana, juridica, financeira ou profissional.
                    </Paragraph>
                    <Paragraph>
                        A empresa contratante e responsavel por configurar, revisar e supervisionar automacoes e conteudos antes de utiliza-los em decisoes ou comunicacoes que possam produzir efeitos relevantes aos titulares.
                    </Paragraph>
                </Section>

                <Section title="6. Condutas proibidas">
                    <Items items={[
                        'Utilizar dados obtidos ilegalmente, bases clandestinas ou informacoes sem finalidade legitima.',
                        'Enviar spam, mensagens enganosas, ameacadoras, discriminatorias ou em desacordo com pedidos de opt-out.',
                        'Cobrar dividas inexistentes, prescritas de forma abusiva ou sem documentacao que sustente a cobranca.',
                        'Inserir dados sensiveis, de criancas ou adolescentes sem necessidade, base legal e autorizacao adequadas.',
                        'Compartilhar credenciais, tentar acessar contas alheias, contornar limites ou comprometer a seguranca da plataforma.',
                        'Usar a plataforma para fraude, assedio, vigilancia ilegal, discriminacao ou qualquer atividade ilicita.'
                    ]} />
                    <Paragraph>
                        A Qualifai pode solicitar comprovacoes, limitar funcionalidades, suspender contas, preservar evidencias e cooperar com autoridades quando houver indicios de violacao.
                    </Paragraph>
                </Section>

                <Section title="7. Seguranca, disponibilidade e incidentes">
                    <Paragraph>
                        A Qualifai adota medidas tecnicas e administrativas razoaveis para proteger a plataforma. A empresa contratante deve proteger suas credenciais, limitar acessos, manter seus usuarios atualizados e configurar corretamente as integracoes.
                    </Paragraph>
                    <Paragraph>
                        A disponibilidade pode ser afetada por manutencoes, internet, fornecedores externos e eventos fora do controle razoavel da Qualifai. Incidentes relevantes serao investigados e tratados conforme a legislacao e os contratos aplicaveis.
                    </Paragraph>
                </Section>

                <Section title="8. Retencao, encerramento e exclusao">
                    <Paragraph>
                        Os dados permanecem disponiveis durante a contratacao e pelos periodos necessarios para prestacao do servico, seguranca, exercicio de direitos e cumprimento legal. No encerramento, a empresa contratante deve solicitar eventual exportacao dentro do prazo contratual.
                    </Paragraph>
                    <Paragraph>
                        A Qualifai podera excluir ou anonimizar dados apos o encerramento, ressalvadas copias de seguranca temporarias e hipoteses legais de conservacao. Contas podem ser suspensas ou encerradas por inadimplencia, risco de seguranca, ordem legal ou violacao destes Termos.
                    </Paragraph>
                </Section>

                <Section title="9. Propriedade intelectual e responsabilidade">
                    <Paragraph>
                        A plataforma, codigo, interfaces, marcas, modelos e documentacao pertencem a Qualifai ou a seus licenciantes. A contratacao concede apenas direito limitado de uso durante a vigencia do contrato.
                    </Paragraph>
                    <Paragraph>
                        Cada parte responde pelos atos sob seu controle e por suas obrigacoes legais. A empresa contratante responde pela origem, finalidade, conteudo, configuracoes e uso dos dados que controla. A Qualifai responde pelo tratamento realizado sob sua responsabilidade, observados estes Termos, o contrato e a legislacao aplicavel.
                    </Paragraph>
                </Section>

                <Section title="10. Contato, alteracoes e foro">
                    <Paragraph>
                        Duvidas ou comunicacoes podem ser enviadas para contato@qualifai.tech. Estes Termos podem ser atualizados por razoes legais, tecnicas ou operacionais, com comunicacao de alteracoes relevantes.
                    </Paragraph>
                    <Paragraph>
                        Aplicam-se as leis brasileiras, especialmente o Codigo Civil, o Marco Civil da Internet e a LGPD. Ressalvadas as hipoteses legais de foro obrigatorio, fica eleito o foro de Uberlandia, Minas Gerais.
                    </Paragraph>
                </Section>

                <Typography variant="body2" sx={{ textAlign: 'center', color: '#777', mt: 5 }}>
                    © {new Date().getFullYear()} Qualifai - IoTeam Softwares e Aplicativos LTDA.
                </Typography>
            </Container>
        </Box>
    );
}

export default TermsOfUsePage;
