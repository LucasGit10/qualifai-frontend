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
    Box,
    Button,
    IconButton,
    useTheme,
    useMediaQuery
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';

const policySections = [
    {
        id: 'panel1',
        title: '1. Introdução',
        content: (
            <>
                <Typography paragraph sx={{ color: '#333', lineHeight: 1.8 }}>
                    O <strong>Grupo loTeam Software e Aplicativos</strong> está comprometido em proteger a privacidade e os dados pessoais de seus Clientes, Usuários Finais e visitantes de seus websites. Esta Política visa esclarecer, de forma transparente, como tratamos os dados pessoais, em conformidade com a legislação vigente.
                </Typography>
                <Typography paragraph sx={{ color: '#333', lineHeight: 1.8 }}>
                    Esta Política se aplica a todas as empresas que integram o Grupo loTeam. Caso tenha dúvidas após a leitura, entre em contato conosco pelo e-mail: <span style={{ color: '#3a1c71', fontWeight: 600 }}>contato@qualifai.tech</span>.
                </Typography>
            </>
        )
    },
    {
        id: 'panel2',
        title: '2. Definições',
        content: (
            <>
                <Typography paragraph sx={{ color: '#333' }}>Para facilitar a compreensão, seguem algumas definições importantes:</Typography>
                <List dense>
                    {[
                        { term: "Autoridade de Proteção de Dados", def: "Órgão regulador responsável por fiscalizar a legislação aplicável." },
                        { term: "Bases Legais", def: "Fundamentos legais que legitimam o tratamento de dados pessoais." },
                        { term: "Cliente", def: "Pessoa jurídica que utiliza os serviços do Grupo loTeam." },
                        { term: "Controlador", def: "Aquele que determina as finalidades e meios de tratamento dos dados pessoais." },
                        { term: "Operador", def: "Aquele que realiza o tratamento de dados em nome do controlador." },
                        { term: "Dados Pessoais", def: "Qualquer informação que identifique ou possa identificar uma pessoa natural." },
                        { term: "DPO (Encarregado)", def: "Profissional responsável pela comunicação entre o controlador, titulares e autoridade." },
                        { term: "Cookies", def: "Tecnologias de rastreamento usadas para coletar dados de navegação." },
                        { term: "Titular", def: "A pessoa a quem os dados pessoais se referem." },
                        { term: "Tratamento", def: "Qualquer operação realizada com dados pessoais." },
                        { term: "Usuário Final", def: "Pessoa física que utiliza os serviços fornecidos ao Cliente." }
                    ].map((item, index) => (
                        <ListItem key={index} sx={{ py: 0.5 }}>
                            <ListItemText 
                                primary={
                                    <Typography variant="body2" sx={{ color: '#333' }}>
                                        <strong style={{ color: '#3a1c71' }}>{item.term}:</strong> {item.def}
                                    </Typography>
                                } 
                            />
                        </ListItem>
                    ))}
                </List>
            </>
        )
    },
    {
        id: 'panel3',
        title: '3. Quais dados coletamos e finalidades',
        content: (
            <>
                <Typography variant="h6" sx={{ color: '#3a1c71', fontSize: '1rem', fontWeight: 700, mb: 2 }}>
                    3.1 Coleta de Dados Pessoais
                </Typography>
                <List dense>
                    {[
                        "Acesso ao site: IP, data/hora, navegador, geolocalização.",
                        "Cadastro: nome, e-mail, cargo, usuário, senha, empresa.",
                        "Contratação: nome, CPF, endereço, cargo, empresa, telefone, e-mail, dados bancários.",
                        "Suporte: nome, e-mail, telefone, empresa, gravação de voz.",
                        "Marketing: nome, e-mail, telefone, empresa.",
                        "Experiência digital: dados de navegação e comportamento.",
                        "Pesquisas: nome, empresa, cargo, respostas.",
                        "Fornecedores: dados cadastrais e bancários.",
                        "Recrutamento: currículos e contatos.",
                        "Campanhas: nome, e-mail, telefone."
                    ].map((text, idx) => (
                        <ListItem key={idx} sx={{ py: 0.5 }}>
                            <Box component="span" sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#3a1c71', mr: 2, display: 'inline-block' }} />
                            <ListItemText primary={<Typography variant="body2" sx={{ color: '#333' }}>{text}</Typography>} />
                        </ListItem>
                    ))}
                </List>
                
                <Box sx={{ mt: 3, p: 2, bgcolor: '#f8f9fa', borderRadius: 2, borderLeft: '4px solid #3a1c71' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#3a1c71' }}>3.2 Dados do Usuário Final</Typography>
                    <Typography variant="body2" sx={{ mt: 1, color: '#444' }}>
                        Atuamos como Operadores, tratando dados conforme instruções dos Clientes (Controladores). Recomendamos que Usuários Finais consultem a política do Cliente diretamente.
                    </Typography>
                </Box>
            </>
        )
    },
    {
        id: 'panel4',
        title: '4. Cookies e Tecnologias',
        content: (
            <>
                <Typography paragraph sx={{ color: '#333' }}>Tipos de cookies utilizados:</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {['Necessários', 'Analíticos', 'Funcionalidade', 'Marketing'].map((tag) => (
                        <Box key={tag} sx={{ px: 2, py: 0.5, bgcolor: 'rgba(58, 28, 113, 0.05)', color: '#3a1c71', borderRadius: '16px', fontSize: '0.85rem', fontWeight: 500 }}>
                            {tag}
                        </Box>
                    ))}
                </Box>
                <Typography paragraph sx={{ color: '#333', fontSize: '0.9rem' }}>
                    Gerencie suas preferências na opção "Declaração de Cookies" no rodapé. Web Beacons podem ser desativados bloqueando imagens no navegador.
                </Typography>
            </>
        )
    },
    {
        id: 'panel5',
        title: '5. Compartilhamento de Dados',
        content: (
            <Typography sx={{ color: '#333', lineHeight: 1.8 }}>
                Compartilhamos com: Empresas do Grupo, prestadores de serviços, plataformas de análise, parceiros de marketing, autoridades públicas (quando legalmente exigido) e terceiros para proteção de direitos.
            </Typography>
        )
    },
    {
        id: 'panel6',
        title: '6. Transferência Internacional',
        content: (
            <Typography sx={{ color: '#333', lineHeight: 1.8 }}>
                Dados podem ser transferidos para países como EUA, Argentina, México e Brasil, sempre com medidas de segurança adequadas. Ao usar nossos serviços, você concorda com essa transferência.
            </Typography>
        )
    },
    {
        id: 'panel7',
        title: '7. Comunicações de Marketing',
        content: (
            <Typography sx={{ color: '#333', lineHeight: 1.8 }}>
                Enviamos promoções mediante consentimento (quando necessário). Todas as mensagens possuem opção clara de descadastramento (opt-out).
            </Typography>
        )
    },
    {
        id: 'panel8',
        title: '8. Segurança dos Dados',
        content: (
            <Typography sx={{ color: '#333', lineHeight: 1.8 }}>
                Utilizamos medidas técnicas rigorosas contra acesso não autorizado. <strong>Sua parte:</strong> não compartilhe senhas com terceiros.
            </Typography>
        )
    },
    {
        id: 'panel9',
        title: '9. Período de Armazenamento',
        content: (
            <Typography sx={{ color: '#333', lineHeight: 1.8 }}>
                Mantemos os dados pelo tempo necessário para as finalidades ou obrigações legais. Mesmo após pedido de exclusão, alguns dados podem ser retidos por lei.
            </Typography>
        )
    },
    {
        id: 'panel10',
        title: '10. Crianças e Adolescentes',
        content: (
            <Typography sx={{ color: '#333', lineHeight: 1.8 }}>
                Serviços não destinados a menores. Tratamento indevido identificado resultará em exclusão imediata dos dados.
            </Typography>
        )
    },
    {
        id: 'panel11',
        title: '11. Seus Direitos',
        content: (
            <>
                <Typography paragraph sx={{ color: '#333' }}>Você pode solicitar:</Typography>
                <List dense sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1 }}>
                    {[
                        "Confirmação de tratamento", "Acesso aos dados", "Correção de dados",
                        "Anonimização/Bloqueio", "Portabilidade", "Informação de compartilhamento",
                        "Revogação de consentimento", "Oposição ao tratamento", "Revisão de decisão automatizada"
                    ].map((right, idx) => (
                        <ListItem key={idx} disablePadding>
                             <Box component="span" sx={{ color: '#3a1c71', mr: 1 }}>✓</Box>
                             <ListItemText primary={<Typography variant="body2" sx={{ color: '#333' }}>{right}</Typography>} />
                        </ListItem>
                    ))}
                </List>
            </>
        )
    },
    {
        id: 'panel12',
        title: '12. Encarregado (DPO)',
        content: (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, bgcolor: '#f5f5f7', borderRadius: 2 }}>
                <DescriptionOutlinedIcon sx={{ fontSize: 40, color: '#3a1c71' }} />
                <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#3a1c71' }}>Matheus César Bento Arantes</Typography>
                    <Typography variant="body2" sx={{ color: '#444' }}>OAB/MG 159.983</Typography>
                    <Typography variant="body2" sx={{ color: '#3a1c71', fontWeight: 600, mt: 0.5 }}>contato@qualifai.tech</Typography>
                </Box>
            </Box>
        )
    },
    {
        id: 'panel13',
        title: '13. Atualizações',
        content: (
            <Typography sx={{ color: '#333', lineHeight: 1.8 }}>
                Política sujeita a atualizações. O uso contínuo dos serviços indica concordância com os novos termos.
            </Typography>
        )
    },
    {
        id: 'panel14',
        title: '14. Planos e Custos Meta',
        content: (
            <>
                 <Typography paragraph sx={{ color: '#333', lineHeight: 1.8 }}>
                    Os valores dos planos cobrem <strong>exclusivamente</strong> nosso serviço de IA e plataforma.
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

function PrivacyPolicyPage() {
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
                            color: '#3a1c71', 
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
                
                <Box sx={{ textAlign: 'center', mb: 8 }}>
                    <Typography variant="overline" sx={{ fontWeight: 700, letterSpacing: 2, color: '#3a1c71' }}>
                        JURÍDICO & PRIVACIDADE
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
                        Política de Privacidade
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#444', fontWeight: 400, maxWidth: 600, mx: 'auto' }}>
                        Transparência total sobre como o <span style={{color: '#3a1c71', fontWeight: 600}}>Grupo loTeam (QualifAI)</span> protege e utiliza seus dados.
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
                                            color: isExpanded ? '#3a1c71' : '#777',
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
                                        color: isExpanded ? '#3a1c71' : '#333',
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
                    <Typography variant="caption" sx={{ display: 'block', mt: 1, color: '#aaa' }}>
                        Última atualização: Novembro de 2025
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}

export default PrivacyPolicyPage;