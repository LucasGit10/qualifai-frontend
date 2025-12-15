export const LEAD_STATUS = {
  NEW: 'novo',
  CONTACTED: 'contatado',
  QUALIFIED: 'qualificado',
  WARM: 'morno',
  COLD: 'frio',
  CONVERTED: 'convertido',
};

export const LEAD_STATUS_LABELS = {
  [LEAD_STATUS.NEW]: 'Novo',
  [LEAD_STATUS.CONTACTED]: 'Contatado',
  [LEAD_STATUS.QUALIFIED]: 'Qualificado',
  [LEAD_STATUS.WARM]: 'Morno',
  [LEAD_STATUS.COLD]: 'Frio',
  [LEAD_STATUS.CONVERTED]: 'Convertido',
};

export const LEAD_STATUS_COLORS = {
  [LEAD_STATUS.NEW]: 'default',
  [LEAD_STATUS.CONTACTED]: 'primary',
  [LEAD_STATUS.QUALIFIED]: 'success',
  [LEAD_STATUS.WARM]: 'warning',
  [LEAD_STATUS.COLD]: 'error',
  [LEAD_STATUS.CONVERTED]: 'success',
};

export const LEAD_SOURCES = {
  FORM: 'form',
  LINKEDIN: 'linkedin',
  EMAIL: 'email',
  WHATSAPP: 'whatsapp',
  CHAT: 'chat',
  PAID_TRAFFIC: 'paid_traffic',
  HUBSPOT: 'hubspot',
  PIPEDRIVE: 'pipedrive',
  SALESFORCE: 'salesforce',
  RDSTATION: 'rdstation',
  PIPEFY: 'pipefy',
  ZOHO: 'zoho',
  KOMMO: 'kommo'
};

export const LEAD_SOURCE_LABELS = {
  [LEAD_SOURCES.FORM]: 'Formulário',
  [LEAD_SOURCES.LINKEDIN]: 'LinkedIn',
  [LEAD_SOURCES.EMAIL]: 'Email',
  [LEAD_SOURCES.WHATSAPP]: 'WhatsApp',
  [LEAD_SOURCES.CHAT]: 'Chat',
  [LEAD_SOURCES.PAID_TRAFFIC]: 'Tráfego Pago',
  [LEAD_SOURCES.HUBSPOT]: 'HubSpot',
  [LEAD_SOURCES.PIPEDRIVE]: 'Pipedrive',
  [LEAD_SOURCES.SALESFORCE]: 'Salesforce',
  [LEAD_SOURCES.RDSTATION]: 'RD Station',
  [LEAD_SOURCES.PIPEFY]: 'Pipefy',
  [LEAD_SOURCES.ZOHO]: 'Zoho CRM',
  [LEAD_SOURCES.KOMMO]: 'Kommo CRM'
};

export const CONVERSATION_STATUS = {
  ACTIVE: 'active',
  CLOSED: 'closed',
  ESCALATED: 'escalated'
};

export const CONVERSATION_STATUS_LABELS = {
  [CONVERSATION_STATUS.ACTIVE]: 'Ativa',
  [CONVERSATION_STATUS.CLOSED]: 'Fechada',
  [CONVERSATION_STATUS.ESCALATED]: 'Escalada'
};

export const CHANNELS = {
  EMAIL: 'email',
  WHATSAPP: 'whatsapp',
  CHAT: 'chat',
  LINKEDIN: 'linkedin'
};

export const CHANNEL_LABELS = {
  [CHANNELS.EMAIL]: 'Email',
  [CHANNELS.WHATSAPP]: 'WhatsApp',
  [CHANNELS.CHAT]: 'Chat',
  [CHANNELS.LINKEDIN]: 'LinkedIn'
};

export const PLANS = [
  {
    id: 'basic-monthly',
    name: "Light",
    price: "R$697,00/mês",
    subscription: 'Ideal para microempresas e empreendedores individuais que estão começando a automatizar seus processos de atendimento',
    description: "*Incluído no pacote os serviços anunciados, o valor de mensageria é pago à parte diretamente à META.", 
    features: [
      "API oficial do whatsApp",
      "Disparos de mensagem em massa",
      "As primeiras 1.000 conversas do mês (qualquer tipo) são gratuitas",
      "1 SDR/número virtual com IA para qualificação de leads e atendimento",
      "Atendimento receptivo pelo WhatsApp ilimitado com ia personalizável",
      "Até 500 conversas iniciadas ativamente pela ia no WhastApp por mês*",
      "Criação de campanhas por segmentação ativas",
      "Indicadores com Dashboard origem dos contatos",
      "Integração com WhatsApp, E-mail e calendário",
      "Onbording personalizado",
      "IA faz agendamento automático com Google calendário",
      "Suporte via e-mail",
      "Até 3 acessos",
    ],
    highlight: false,
    billingCycle: 'monthly',
    originalPrice: "R$597,00"
  },
  {
    id: 'plus-monthly',
    name: "Pro",
    price: "R$1.597,00/mês",
    description: "O plano Plus é ideal para empresas em crescimento que precisam ir além do básico e alcançar alta performance no atendimento.",
    features: [
      "Tudo do Starter",
      "Mensagens de áudio inteligentes enviados por IA",
      "Cadastro de até 5 SDRs/números virtuais com IA para qualificação de leads",
      "Conversas ilimitadas ativas iniciadas pela ia no WhastApp por mês",
      "Follow-ups automáticos programáveis e personalizáveis",
      "IA para agendamento automático de reuniões entre vendedor e lead direto no CRM",
      "Suporte via WhatsApp, chat e e-mail",
      "Acesso ilimitados",
      "Quadro Kanban",
    ],
    highlight: false,
    billingCycle: 'monthly',
    originalPrice: "R$1.597,00"
  },
  {
    id: 'unlimited-monthly',
    name: "Ilimitado",
    price: "Sob Demanda",
    description: "Para empresas que desejam automação completa e desempenho máximo no atendimento em alta escala.",
    features: [
      "Todos os recursos anteriores ilimitados",
      "Prospeção de leads",
      "Ligação ativa com IA",
      "Closer",
      "Customer success",
      "Desenvolvimento de funcionalidades adicionais exclusivas",
    ],
    highlight: true,
  },
];

export const META_PRICING_DATA = [
  {
    category: 'MARKETING',
    type: 'Marketing',
    description: 'Promoções, ofertas, anúncios de produtos, campanhas de marca.',
    priceBRL: '~ R$ 0,33',
  },
  {
    category: 'UTILITY',
    type: 'Utilidade',
    description: 'Confirmações de pedido, status de entrega, lembretes de agendamento, etc.',
    priceBRL: '~ R$ 0,18',
  },
  {
    category: 'AUTHENTICATION',
    type: 'Autenticação',
    description: 'Envio de códigos de verificação, login, recuperação de senha, etc.',
    priceBRL: '~ R$ 0,18',
  },
  {
    category: 'SERVICE',
    type: 'Serviço (Iniciada pelo Cliente)',
    description: 'O cliente envia a primeira mensagem. A empresa pode responder livremente na janela de 24h.',
    priceBRL: '~ R$ 0,16',
  }
];

export const FREE_TIER_INFO = {
  description: 'As primeiras 1.000 conversas do mês (qualquer tipo) são gratuitas.',
};