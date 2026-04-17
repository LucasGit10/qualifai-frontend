// Mock data for Dashboard KPIs and charts (Debt Collection focus)

export const MOCK_DASHBOARD_STATS = {
  activeDebtors: 1245,
  totalRecovered: 154000.50,
  conversionRate: 18.5,
  totalDebtPortfolio: 1250000.00,
  activeCampaigns: 4,
  interactionsToday: 850
};

export const MOCK_RECOVERY_CHART = [
  { name: 'Seg', valor: 4000 },
  { name: 'Ter', valor: 3000 },
  { name: 'Qua', valor: 2000 },
  { name: 'Qui', valor: 2780 },
  { name: 'Sex', valor: 1890 },
  { name: 'Sáb', valor: 2390 },
  { name: 'Dom', valor: 3490 },
];

export const MOCK_DEBT_PORTFOLIO_STATUS = [
  { name: 'Atraso < 30 dias', value: 400 },
  { name: '31 a 90 dias', value: 300 },
  { name: '91 a 180 dias', value: 200 },
  { name: '> 180 dias', value: 100 },
  { name: 'Judicial', value: 245 },
];

export const MOCK_CAMPAIGN_PERFORMANCE = [
  { id: 1, name: 'Feirão Limpa Nome', sent: 5000, read: 3500, clicked: 1200, converted: 150 },
  { id: 2, name: 'Aviso Céditos < 30s', sent: 1200, read: 900, clicked: 300, converted: 80 },
  { id: 3, name: 'Recuperação Judicial', sent: 300, read: 150, clicked: 50, converted: 5 },
];
