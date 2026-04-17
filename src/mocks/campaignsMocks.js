// Mock data for Campaigns and Message Templates

export const MOCK_CAMPAIGNS = [
  {
    _id: "c1",
    name: 'Feirão de Negociação Abril',
    status: 'running',
    channel: 'whatsapp',
    description: 'Campanha massiva para atrasos de 30 a 90 dias com desconto de 15%.',
    stats: { total: 1542, sent: 1200, failed: 42, replied: 180 },
    conversionRate: '12%',
    startDate: '2023-04-01',
    audience: 'Atrasos de 30 a 90 dias'
  },
  {
    _id: "c2",
    name: 'Cobrança Preventiva (< 5 dias)',
    status: 'paused',
    channel: 'email',
    description: 'Avisos de vencimento iminente disparados 5 dias antes.',
    stats: { total: 300, sent: 150, failed: 5, replied: 20 },
    conversionRate: '25%',
    startDate: '2023-04-05',
    audience: 'Vencimentos próximos'
  },
  {
    _id: "c3",
    name: 'Recuperação Judicial Lote 1',
    status: 'completed',
    channel: 'whatsapp_official',
    description: 'Comunicação protocolar antes do ajuizamento da dívida.',
    stats: { total: 50, sent: 50, failed: 0, replied: 5 },
    conversionRate: '2%',
    startDate: '2022-12-10',
    audience: 'Atrasos > 360 dias'
  }
];

export const MOCK_TEMPLATES = [
  {
    _id: 't1',
    name: 'Cobranca_Preventiva_V1',
    category: 'UTILITY',
    language: 'pt_BR',
    status: 'approved',
    templateType: 'conversation',
    components: [
      { type: 'BODY', text: 'Olá {{1}}, lembramos que seu boleto no valor de {{2}} vence amanhã. Não esqueça de pagar para evitar multas!' }
    ]
  },
  {
    _id: 't2',
    name: 'Feirao_Limpa_Nome_Desconto',
    category: 'MARKETING',
    language: 'pt_BR',
    status: 'pending_approval',
    templateType: 'conversation',
    components: [
      { type: 'BODY', text: 'Olá {{1}}! Temos uma oferta imperdível: quite sua dívida de {{2}} com 50% de desconto hoje mesmo. Responda SIM para negociar.' }
    ]
  },
  {
    _id: 't3',
    name: 'Aviso_Judicial_Ultima_Oportunidade',
    category: 'UTILITY',
    language: 'pt_BR',
    status: 'rejected',
    templateType: 'conversation',
    components: [
      { type: 'BODY', text: 'Prezado(a) {{1}}, não identificamos o pagamento do acordo. Evite restrições no CPF, ligue para nosso time: 0800-000-000.' }
    ]
  }
];
