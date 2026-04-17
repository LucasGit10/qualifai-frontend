// Mock data for AI chats, Messages, and Notifications

export const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    title: 'Acordo Fechado!',
    message: 'João Silva aceitou a negociação de R$ 900,00.',
    type: 'success',
    priority: 'high',
    timestamp: new Date().toISOString(),
    isRead: false
  },
  {
    id: 2,
    title: 'Falha na Campanha',
    message: 'Campanha "Feirão Lote 1" teve 12% de falha no envio de SMS.',
    type: 'error',
    priority: 'high',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    isRead: false
  },
  {
    id: 3,
    title: 'Nova Interação de IA',
    message: 'A IA Qualif completou o atendimento do cliente Marcos (Ticket #342).',
    type: 'info',
    priority: 'normal',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    isRead: true
  }
];

export const MOCK_CONVERSATIONS = [
  {
    id: 1,
    participantName: 'Marta Souza',
    lastMessage: 'Amanhã eu pago o boleto sem falta.',
    time: '10:30 AM',
    unread: 2,
    status: 'Em aberto',
    messages: [
      { sender: 'AI', text: 'Bom dia, Marta. Consta em nosso sistema um atraso de 15 dias na parcela 03/12. Como podemos ajudar?', time: '10:00 AM' },
      { sender: 'User', text: 'Eu perdi a data, me desculpe.', time: '10:15 AM' },
      { sender: 'User', text: 'Amanhã eu pago o boleto sem falta.', time: '10:30 AM' }
    ]
  },
  {
    id: 2,
    participantName: 'Roberto Alves',
    lastMessage: 'Queria saber se tem desconto para parcela única.',
    time: 'Ontem',
    unread: 0,
    status: 'Pausado',
    messages: [
      { sender: 'AI', text: 'Roberto, identificamos sua dívida com o Banco Brasil. Deseja renegociar?', time: '09:00 AM' },
      { sender: 'User', text: 'Queria saber se tem desconto para parcela única.', time: '11:00 AM' }
    ]
  }
];
