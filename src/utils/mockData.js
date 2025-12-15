import { addDays, subDays } from 'date-fns';

const generateId = () => Math.random().toString(36).substr(2, 9);

export const mockLeads = {
    leads: [
        { _id: generateId(), name: 'Ana Silva', email: 'ana.silva@example.com', company: 'Tech Solutions', source: 'linkedin', status: 'qualificado' },
        { _id: generateId(), name: 'Bruno Costa', email: 'bruno.costa@example.com', company: 'Inova Corp', source: 'form', status: 'novo' },
        { _id: generateId(), name: 'Carla Dias', email: 'carla.dias@example.com', company: 'Market Growth', source: 'email', status: 'morno' },
        { _id: generateId(), name: 'Daniel Alves', email: 'daniel.alves@example.com', company: 'Future Systems', source: 'whatsapp', status: 'contatado' },
        { _id: generateId(), name: 'Eduarda Lima', email: 'eduarda.lima@example.com', company: 'Data Insights', source: 'form', status: 'frio' },
        { _id: generateId(), name: 'Fábio Pereira', email: 'fabio.p@example.com', company: 'Connect All', source: 'linkedin', status: 'novo' },
        { _id: generateId(), name: 'Gabriela Mota', email: 'gabi.mota@example.com', company: 'CloudFast', source: 'email', status: 'qualificado' },
        { _id: generateId(), name: 'Heitor Barros', email: 'h.barros@example.com', company: 'SecureNet', source: 'whatsapp', status: 'convertido' },
    ],
    total: 8,
    totalPages: 1,
    currentPage: 1,
};

export const mockConversations = {
    conversations: mockLeads.leads.map(lead => ({
        _id: generateId(),
        lead: lead,
        channel: lead.source,
        status: 'active',
        messages: [{ role: 'lead', content: 'Olá, gostaria de saber mais sobre o produto.' }, { role: 'ai', content: 'Olá! Claro, posso ajudar com isso. Qual sua principal necessidade?' }],
        updatedAt: new Date().toISOString(),
        aiEnabled: true,
        notes: [],
    })),
    total: 8,
    totalPages: 1,
    currentPage: 1,
};

export const mockDashboardStats = {
    totalLeads: 125,
    activeConversations: 8,
    escalatedConversations: 3,
    qualifiedLeads: 14,
    conversionRate: 11,
    leadsOverTime: Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (29 - i));
        return {
            _id: date.toISOString().split('T')[0],
            count: Math.floor(Math.random() * 5) + 1,
        };
    }),
    leadsByStatus: [
        { _id: 'novo', count: 45 },
        { _id: 'contatado', count: 30 },
        { _id: 'qualificado', count: 14 },
        { _id: 'morno', count: 20 },
        { _id: 'convertido', count: 5 },
    ],
    leadsBySource: [
        { _id: 'form', count: 40 },
        { _id: 'linkedin', count: 35 },
        { _id: 'whatsapp', count: 25 },
        { _id: 'email', count: 25 },
    ],
    conversationsByChannel: [
        { _id: 'whatsapp', count: 50 },
        { _id: 'email', count: 30 },
        { _id: 'chat', count: 15 },
    ]
};

export const mockActivities = {
    activities: [
        { type: 'lead', id: '1', title: 'Novo lead: Gabriela Mota', description: 'CloudFast - gabi.mota@example.com', timestamp: new Date().toISOString(), status: 'qualificado' },
        { type: 'conversation', id: '2', title: 'Conversa atualizada: Daniel Alves', description: 'whatsapp - 8 mensagens', timestamp: new Date().toISOString(), status: 'active' },
        { type: 'lead', id: '3', title: 'Novo lead: Fábio Pereira', description: 'Connect All - fabio.p@example.com', timestamp: new Date().toISOString(), status: 'novo' },
        { type: 'conversation', id: '4', title: 'Conversa escalada: Ana Silva', description: 'email - 12 mensagens', timestamp: new Date().toISOString(), status: 'escalated' },
        { type: 'lead', id: '5', title: 'Novo lead: Eduarda Lima', description: 'Data Insights - eduarda.lima@example.com', timestamp: new Date().toISOString(), status: 'frio' },
    ]
};

export const mockCampaigns = {
    campaigns: [
        { _id: generateId(), name: 'Campanha de Lançamento Q3', description: 'Campanha via WhatsApp para novos leads da base.', status: 'running', channel: 'whatsapp', whatsappInstance: 'principal_br', stats: { total: 100, sent: 50, replied: 5, failed: 2 } },
        { _id: generateId(), name: 'Nutrição de Leads - Email', description: 'Sequência de emails para leads mornos.', status: 'paused', channel: 'email', stats: { total: 250, sent: 120, replied: 15, failed: 5 } },
        { _id: generateId(), name: 'Reativação de Clientes', description: 'Campanha para clientes inativos.', status: 'completed', channel: 'whatsapp', whatsappInstance: 'secundario_latam', stats: { total: 50, sent: 50, replied: 10, failed: 0 } },
        { _id: generateId(), name: 'Campanha de Fim de Ano', description: 'Oferta especial para o fim de ano.', status: 'draft', channel: 'email', stats: { total: 500, sent: 0, replied: 0, failed: 0 } },
    ]
};

export const mockKanbanData = {
    _id: generateId(),
    name: 'Pipeline de Vendas',
    columns: [
        { _id: 'col1', title: 'Novos Leads', position: 0, items: [
            { _id: generateId(), title: 'Lead da Empresa X', description: 'Demonstrou interesse no produto A.', priority: 'Média', tags: ['PME', 'SaaS'] },
            { _id: generateId(), title: 'Lead do Formulário Y', description: 'Solicitou uma demonstração.', priority: 'Alta', tags: ['Enterprise'] },
        ]},
        { _id: 'col2', title: 'Primeiro Contato', position: 1, items: [
            { _id: generateId(), title: 'Lead da Empresa Z', description: 'Enviado email de apresentação.', priority: 'Baixa', tags: ['Startup'] },
        ]},
        { _id: 'col3', title: 'Em Negociação', position: 2, items: [
            { _id: generateId(), title: 'Lead da Empresa W', description: 'Reunião agendada para sexta.', priority: 'Alta', tags: ['SaaS', 'Fintech'] },
        ]},
        { _id: 'col4', title: 'Ganhos', position: 3, items: []},
    ]
};

export const mockCalendarEvents = [
    { id: generateId(), title: 'Reunião com Tech Solutions', start: new Date(), end: addDays(new Date(), 0), resource: { leadName: 'Ana Silva', crm: 'HubSpot' } },
    { id: generateId(), title: 'Follow-up Market Growth', start: addDays(new Date(), 1), end: addDays(new Date(), 1), resource: { leadName: 'Carla Dias', crm: 'Pipedrive' } },
    { id: generateId(), title: 'Demo para CloudFast', start: subDays(new Date(), 2), end: subDays(new Date(), 2), resource: { leadName: 'Gabriela Mota', crm: 'Kommo' } },
];

export const mockUserInstances = {
    instances: [
        { _id: generateId(), instanceName: 'instancia_principal', phoneNumber: '+55 (11) 98765-4321', status: 'connected', messagesSent: 120, messagesReceived: 45 },
        { _id: generateId(), instanceName: 'instancia_secundaria', phoneNumber: '+1 (555) 123-4567', status: 'connecting', messagesSent: 10, messagesReceived: 2 },
    ]
};