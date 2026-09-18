export const site = {
  name: 'ValeMind',
  url: 'https://valemind.tech',
  email: 'contato@valemind.com.br',
  // Configure an HTTPS endpoint accepting JSON to enable confirmed submissions.
  contactEndpoint: '',
};

export const needs = [
  ['automation', 'Automatizar um processo'],
  ['system', 'Criar um sistema'],
  ['modernize', 'Melhorar um sistema existente'],
  ['data', 'Organizar ou visualizar dados'],
  ['integration', 'Integrar ferramentas'],
  ['web', 'Criar uma solução web'],
  ['discovery', 'Ainda não sei exatamente'],
];

export const problems = [
  [
    'automation',
    'Processos manuais',
    'Menos tarefas repetitivas. Mais tempo para o que importa.',
    'repeat',
  ],
  ['system', 'Sistemas internos', 'Sua operação organizada em um só lugar.', 'window'],
  ['automation', 'Automação', 'Fluxos que trabalham junto com a sua equipe.', 'bolt'],
  ['data', 'Dashboards e dados', 'Informações claras para tomar boas decisões.', 'chart'],
  ['integration', 'Integrações', 'Suas ferramentas conversando entre si.', 'link'],
  ['web', 'Soluções web', 'Sua empresa mais próxima dos seus clientes.', 'globe'],
];

export const services = [
  [
    'window',
    'Sistemas web e dashboards sob medida',
    'Plataformas de gestão, portais para clientes e painéis de controle que organizam seus dados em um só lugar, substituindo planilhas e processos espalhados.',
    [
      'Interfaces limpas e fáceis de usar',
      'Relatórios e gráficos em tempo real',
      'Controle de acessos e permissões',
    ],
  ],
  [
    'message',
    'Chatbots e atendimento inteligente',
    'Assistentes virtuais para WhatsApp e sites que respondem dúvidas frequentes e realizam triagens 24 horas por dia.',
    [
      'Conexão com WhatsApp API',
      'Respostas naturais com IA (ChatGPT)',
      'Encaminhamento rápido para atendentes',
    ],
  ],
  [
    'repeat',
    'Automação de processos e integrações',
    'Conectamos seus sistemas para disparar notificações, sincronizar dados e eliminar o trabalho manual repetitivo da sua equipe.',
    [
      'Conexão entre CRMs, planilhas e e-mails',
      'Menos erros de digitação',
      'Economia de tempo e recursos',
    ],
  ],
  [
    'database',
    'APIs e gestão de dados',
    'Estrutura técnica com Node.js, Express e Prisma ORM para oferecer rapidez, estabilidade e segurança às suas informações.',
    [
      'Bancos de dados PostgreSQL e Redis',
      'Comunicação segura entre sistemas',
      'Arquitetura preparada para crescer',
    ],
  ],
  [
    'globe',
    'Sites institucionais e páginas de vendas',
    'Páginas modernas, rápidas e otimizadas para apresentar sua empresa com clareza e capturar novos contatos.',
    [
      'Design responsivo',
      'Performance e otimização para buscas',
      'Formulários integrados ao atendimento',
    ],
  ],
  [
    'bolt',
    'Modernização e evolução de software',
    'Atualizamos sistemas antigos, corrigimos falhas de desempenho e organizamos seu código com versionamento profissional.',
    [
      'Limpeza de código e correção de bugs',
      'Versionamento com Git e GitHub',
      'Suporte contínuo e preventivo',
    ],
  ],
];

export const technologies = [
  ['React e Next.js', 'Interfaces e renderização no servidor'],
  ['Angular', 'Sistemas web'],
  ['Node.js e Express', 'APIs e integrações'],
  ['Python e PyTorch', 'Inteligência artificial e dados'],
  ['PostgreSQL e Redis', 'Armazenamento e performance'],
  ['Prisma ORM', 'Gestão e tipagem de dados'],
  ['Git e GitHub', 'Versionamento e CI/CD'],
  ['WhatsApp e Webhooks', 'Automação de atendimento'],
];

export const projects = [
  {
    name: 'ValeBot AI',
    category: 'Atendimento inteligente',
    icon: 'message',
    problem: 'Clientes esperando por respostas e uma equipe ocupada com perguntas recorrentes.',
    solution:
      'Chatbot integrado ao WhatsApp com inteligência artificial para automatizar as triagens iniciais.',
    outcome: 'Respostas que passaram de horas para instantes.',
    tags: ['Python', 'OpenAI API', 'Node.js'],
  },
  {
    name: 'GestorWeb',
    category: 'Portal de controle interno',
    icon: 'window',
    problem:
      'Informações espalhadas em planilhas e dificuldade para acompanhar os fluxos de trabalho.',
    solution: 'Painel administrativo sob medida em Next.js e Prisma para organizar a operação.',
    outcome: 'Fluxos de trabalho centralizados e geração de relatórios.',
    tags: ['Next.js', 'Prisma', 'PostgreSQL'],
  },
  {
    name: 'AutoSync',
    category: 'Integração de dados e notificações',
    icon: 'link',
    problem: 'Contatos recebidos pelo site precisam chegar rapidamente à equipe de atendimento.',
    solution: 'Automação que conecta formulários ao banco de dados e envia alertas imediatos.',
    outcome: 'Informações conectadas ao fluxo de atendimento.',
    tags: ['Node.js', 'Redis', 'Git / GitHub'],
  },
];
