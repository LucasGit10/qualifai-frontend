export const COMMON_TOUR_ROUTES = [  
  {
    path: '/app/dashboard',
    title: 'Dashboard',
    steps: [
      {
        element: '#tour-dashboard-statscards',
        popover: {
          title: 'Indicadores Principais (KPIs)',
          description: 'Comece com uma visão rápida dos números mais importantes: total de leads, conversas ativas, leads qualificados e mais.'
        }
      },
      {
        element: '#tour-dashboard-whatsapp',
        popover: {
          title: 'Saúde dos Canais',
          description: 'Monitore aqui o status e o volume de mensagens das suas contas de WhatsApp conectadas.'
        }
      },
      {
        element: '#tour-dashboard-graficos',
        popover: {
          title: 'Gráficos de Desempenho',
          description: 'Analise a evolução dos seus leads, o funil de vendas e de onde vêm seus melhores contatos.'
        }
      },
      {
        element: '#tour-dashboard-tarefas',
        popover: {
          title: 'Atividades e Tarefas',
          description: 'Acompanhe as ações recentes na plataforma e as tarefas pendentes da sua equipe para manter tudo em dia.'
        }
      },
      {
        element: '#tour-dashboard-campaigns',
        popover: {
          title: 'Resumo das Campanhas',
          description: 'Por fim, veja o desempenho resumido das suas campanhas de marketing mais recentes.'
        }
      }
    ]
  },
    {
    path: '/app/leads',
    title: 'Leads',
    steps: [
      {
        element: '#tour-leads-header',
        popover: {
          title: 'Controles e Filtros',
          description: 'Aqui você pode buscar por um lead específico ou usar os filtros para refinar sua lista por status ou origem.'
        }
      },
      {
        element: '#tour-leads-status-cards',
        popover: {
          title: 'Navegação Rápida por Status',
          description: 'Clique em qualquer um destes cards para filtrar rapidamente todos os leads que estão em uma etapa específica do funil.'
        }
      },
      {
        element: '#tour-leads-action-bar',
        popover: {
          title: 'Ações Principais',
          description: 'Crie um novo lead, importe de um arquivo ou sincronize com seu CRM. Após selecionar leads na lista, você também pode iniciar conversas ou excluí-los em massa aqui.'
        }
      },
      {
        element: '#tour-leads-list',
        popover: {
          title: 'Sua Base de Leads',
          description: 'Esta é a sua lista principal de contatos. Selecione um ou mais leads para realizar ações em massa, ou use os ícones em cada linha para interagir individualmente.'
        }
      }
    ]
  },
  {
    path: '/app/conversations',
    title: 'Conversas',
    steps: [
      {
        element: '#tour-conversas-lista',
        popover: {
          title: 'Caixa de Entrada Unificada',
          description: 'Gerencie todas as suas conversas do WhatsApp e Instagram em um único lugar, com a ajuda da nossa IA.'
        }
      },
    ]
  },
  {
    path: '/app/campaigns',
    title: 'Campanhas',
    steps: [
      {
        element: '#tour-campanhas-criar',
        popover: {
          title: 'Criar Campanhas',
          description: 'Inicie uma nova campanha para engajar seus leads com mensagens em massa de forma programada.'
        }
      }
    ]
  },
  {
    path: '/app/profile',
    title: 'Meu Perfil',
    steps: [
      {
        element: '#tour-perfil-dados',
        popover: {
          title: 'Seu Perfil',
          description: 'Para finalizar, aqui você pode atualizar suas informações pessoais, como nome, e-mail e foto de perfil.'
        }
      }
    ]
  },
];

export const MANAGER_TOUR_ROUTES = [
  {
    path: '/app/team',
    title: 'Equipe',
    steps: [
      {
        element: '#tour-equipe-lista',
        popover: {
          title: 'Gerenciamento da Equipe',
          description: 'Como gestor, aqui você pode adicionar, remover e gerenciar as permissões dos membros do seu time.'
        }
      }
    ]
  },
  {
    path: '/app/settings',
    title: 'Configurações',
    steps: [
      {
        element: '#tour-settings-ia',
        popover: {
          title: 'Configurações da Plataforma',
          description: 'Nesta seção, você pode personalizar as configurações da sua conta e da inteligência artificial.'
        }
      }
    ]
  },
];

// Módulo 3: Rotas exclusivas para Admins
export const ADMIN_TOUR_ROUTES = [
  {
    path: '/app/admin',
    title: 'Painel Admin',
    steps: [
      {
        element: '#tour-admin-geral',
        popover: {
          title: 'Administração do Sistema',
          description: 'Este é o painel de gerenciamento geral, onde você tem controle total sobre usuários e configurações do sistema.'
        }
      }
    ]
  },
  {
    path: '/app/plans-admin',
    title: 'Gerenciar Planos',
    steps: [
      {
        element: '#tour-admin-planos',
        popover: {
          title: 'Gestão de Planos',
          description: 'Aqui você pode criar, editar e gerenciar os planos de assinatura disponíveis para os clientes.'
        }
      }
    ]
  },
  {
    path: '/app/blog-editor',
    title: 'Editor do Blog',
    steps: [
      {
        element: '#tour-admin-blog',
        popover: {
          title: 'Conteúdo do Blog',
          description: 'Use esta área para criar e publicar novos artigos no blog da plataforma.'
        }
      }
    ]
  },
];