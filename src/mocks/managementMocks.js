// Mock data for Team Management, Agenda/Calendar, and No Response (Pendencies)

export const MOCK_TEAM_MEMBERS = [
  {
    id: 1,
    name: 'Ana Rodrigues',
    role: 'SDR Senior',
    email: 'ana.rodrigues@qualifai.com',
    status: 'online',
    recoveryRate: '22%',
    activeDeals: 45
  },
  {
    id: 2,
    name: 'Bruno Costa',
    role: 'Analista de Cobrança',
    email: 'bruno.costa@qualifai.com',
    status: 'offline',
    recoveryRate: '15%',
    activeDeals: 30
  },
  {
    id: 3,
    name: 'Carla Dias',
    role: 'Supervisor',
    email: 'carla.dias@qualifai.com',
    status: 'online',
    recoveryRate: '28%',
    activeDeals: 12
  }
];

export const MOCK_SCHEDULES = [
  {
    id: 1,
    title: 'Ligar para João Silva (Acordo CT-2022-001)',
    date: '2023-11-20',
    time: '14:00',
    status: 'pending',
    type: 'call'
  },
  {
    id: 2,
    title: 'Revisão Processo Judicial (Ana Paula)',
    date: '2023-11-21',
    time: '09:30',
    status: 'completed',
    type: 'meeting'
  },
  {
    id: 3,
    title: 'Enviar Boleto Atualizado (Maria Oliveira)',
    date: '2023-11-25',
    time: '16:00',
    status: 'pending',
    type: 'task'
  }
];

export const MOCK_NO_RESPONSE_LEADS = [
  {
    id: 101,
    name: 'Lucas Mendes',
    debtValue: 4500.00,
    lastAttempt: '2023-10-01',
    attemptsCount: 8,
    channel: 'WhatsApp',
    actionRequired: 'Mudar para SMS/Email'
  },
  {
    id: 102,
    name: 'Fernanda Lima',
    debtValue: 1250.00,
    lastAttempt: '2023-10-10',
    attemptsCount: 5,
    channel: 'Telefone',
    actionRequired: 'Análise Judicial'
  }
];
