import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  BarChart3,
  Brain,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  MessageSquare,
  Phone,
  Play,
  Star,
  TrendingDown,
  Users,
  X,
  Zap,
} from 'lucide-react';
import ChatBot from '../components/AiChat';
import '../styles/LandingPage.css';

const heroAssets = {
  background:
    'https://d2xsxph8kpxj0f.cloudfront.net/310519663663917866/LsbpsJNDuhUWKBBRH5jsgL/hero-bg-3d-m97VYnjg6ikVm7FfB2ZoRS.webp',
  whatsapp:
    'https://d2xsxph8kpxj0f.cloudfront.net/310519663663917866/LsbpsJNDuhUWKBBRH5jsgL/whatsapp-mockup-Ju52LmQkHUoErdEvAGRUNp.webp',
  dashboard:
    'https://d2xsxph8kpxj0f.cloudfront.net/310519663663917866/LsbpsJNDuhUWKBBRH5jsgL/dashboard-mockup-CWTHMLekEE4c766zgkPv98.webp',
  flow:
    'https://d2xsxph8kpxj0f.cloudfront.net/310519663663917866/LsbpsJNDuhUWKBBRH5jsgL/ai-flow-illustration-oWqm92cU2nSuu6WkESY5UC.webp',
};

const painPoints = [
  {
    icon: Clock,
    title: 'Tempo Perdido',
    description: 'Equipes gastas com tarefas operacionais que não geram receita',
  },
  {
    icon: Users,
    title: 'Leads Desqualificados',
    description: 'Conversas com clientes sem potencial de pagamento',
  },
  {
    icon: DollarSign,
    title: 'Custo Operacional Alto',
    description: 'Salários, treinamento e ferramentas para SDRs tradicionais',
  },
  {
    icon: TrendingDown,
    title: 'Oportunidades Perdidas',
    description: 'Clientes não atendidos fora do horário comercial',
  },
];

const features = [
  {
    icon: Zap,
    title: 'Qualificação Inteligente',
    description:
      'IA que identifica e prioriza clientes com potencial em tempo real, focando apenas em quem realmente pode pagar',
  },
  {
    icon: MessageSquare,
    title: 'Comunicação em Escala',
    description:
      'Mensagens, áudios e ligações automatizadas via WhatsApp oficial. IA humanizada que negocia naturalmente',
  },
  {
    icon: Calendar,
    title: 'Agendamento Automático',
    description:
      'Meetings sincronizadas direto no CRM e calendário. Fluxo automático de ponta a ponta',
  },
  {
    icon: Clock,
    title: 'Disponibilidade 24/7',
    description:
      'IA trabalhando 24 horas, 7 dias por semana. Nenhuma oportunidade é perdida, independente do horário',
  },
];

const steps = [
  {
    number: '01',
    title: 'Conectar em minutos',
    description:
      'Integre seu WhatsApp e CRM. Nossa IA está pronta para começar a trabalhar imediatamente.',
    details: ['API oficial do WhatsApp', 'Sincronização com CRM', 'Configuração automática'],
  },
  {
    number: '02',
    title: 'IA qualifica e negocia',
    description:
      'Nossa inteligência artificial conversa com clientes, qualifica débitos e negocia pagamentos automaticamente.',
    details: ['Negociação inteligente', 'Mensagens e áudios automáticos', 'Contrato gerado automaticamente'],
  },
  {
    number: '03',
    title: 'Boleto enviado e pago',
    description:
      'Boleto é gerado e enviado via WhatsApp. Cliente paga e você recupera o crédito.',
    details: ['Geração de boleto', 'Envio automático', 'Acompanhamento de pagamento'],
  },
];

const testimonials = [
  {
    name: 'Ana Silva',
    company: 'Nexora Solutions',
    role: 'Diretora de Operações',
    text:
      'A Qualifai transformou nossa geração de leads. A qualificação é impecável e a comunicação da IA é surpreendentemente humanizada. Nossas agendas nunca estiveram tão cheias!',
  },
  {
    name: 'Bruno Costa',
    company: 'Grupo Horizonte Azul',
    role: 'Diretor de Vendas',
    text:
      'Estávamos perdendo tempo com leads desqualificados. Com a Qualifai, nossa equipe foca apenas no que realmente importa, aumentando a conversão em 40%.',
  },
  {
    name: 'Diego Mendes',
    company: 'Trevoo',
    role: 'Gerente de Vendas',
    text:
      'O suporte 24/7 da IA é uma vantagem enorme. Não perdemos mais oportunidades, mesmo fora do horário comercial. É como ter um SDR extra sempre ativo.',
  },
];

const featureCategories = [
  {
    icon: MessageCircle,
    title: 'Atendimento & Comunicação',
    tone: 'blue',
    features: [
      'API oficial do WhatsApp integrada',
      'Disparos de mensagens em massa e campanhas segmentadas',
      'Atendimento receptivo ilimitado via WhatsApp',
      'Mensagens de áudio inteligentes automatizadas',
      'Ligações automáticas com IA humanizada',
      'Integração com E-mail e Google Calendar',
    ],
  },
  {
    icon: Brain,
    title: 'IA & Automação',
    tone: 'purple',
    features: [
      'Qualificação automática de leads',
      'Negociação inteligente de crédito',
      'Geração automática de contratos',
      'Emissão de boletos automática',
      'Follow-ups programáveis e inteligentes',
      'Análise de padrões de pagamento',
    ],
  },
  {
    icon: BarChart3,
    title: 'Gestão & Análise',
    tone: 'cyan',
    features: [
      'Dashboard em tempo real',
      'Métricas de recuperação detalhadas',
      'Funil de vendas visual',
      'Integração omnichannel',
      'Relatórios automáticos',
      'Análise de ROI por campanha',
    ],
  },
];

const capabilities = [
  'IA humanizada que conversa naturalmente',
  'Disparos inteligentes baseados em comportamento',
  'WhatsApp oficial com compliance total',
  'Áudios automáticos com voz natural',
  'Ligações automatizadas 24/7',
  'Integração com qualquer CRM',
];

const benefits = [
  'Aumento de 3X na recuperação de crédito',
  'Redução de 72% em custos operacionais',
  'Atendimento 24/7 sem pausa',
  'Qualificação automática de 100% dos leads',
  'Aumento de conversão de até 40%',
  'ROI positivo em menos de 30 dias',
];

const LandingButton = ({ children, variant = 'primary', className = '', ...props }) => (
  <button className={`qlp-button qlp-button-${variant} ${className}`.trim()} {...props}>
    {children}
  </button>
);

const scrollTo = (id) => {
  const target = document.getElementById(id);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleNav = (id) => {
    setIsOpen(false);
    scrollTo(id);
  };

  return (
    <header className="qlp-header">
      <div className="qlp-container qlp-header-inner">
        <button className="qlp-logo" onClick={() => scrollTo('hero')} type="button" aria-label="Qualifai">
          <span className="qlp-logo-mark">Q</span>
          <span>Qualifai</span>
        </button>

        <nav className="qlp-nav" aria-label="Navegação principal">
          <button type="button" onClick={() => handleNav('features')}>
            Recursos
          </button>
          <button type="button" onClick={() => handleNav('how-it-works')}>
            Como funciona
          </button>
          <button type="button" onClick={() => handleNav('testimonials')}>
            Depoimentos
          </button>
          <button type="button" onClick={() => handleNav('pricing')}>
            Preços
          </button>
        </nav>

        <div className="qlp-header-actions">
          <LandingButton variant="ghost" onClick={() => navigate('/login')}>
            Entrar
          </LandingButton>
          <LandingButton onClick={() => navigate('/register-calendar')}>Agendar demo</LandingButton>
        </div>

        <button
          className="qlp-menu-button"
          onClick={() => setIsOpen((current) => !current)}
          type="button"
          aria-label="Abrir menu"
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isOpen && (
        <div className="qlp-mobile-menu">
          <button type="button" onClick={() => handleNav('features')}>
            Recursos
          </button>
          <button type="button" onClick={() => handleNav('how-it-works')}>
            Como funciona
          </button>
          <button type="button" onClick={() => handleNav('testimonials')}>
            Depoimentos
          </button>
          <button type="button" onClick={() => handleNav('pricing')}>
            Preços
          </button>
          <LandingButton variant="ghost" onClick={() => navigate('/login')}>
            Entrar
          </LandingButton>
          <LandingButton onClick={() => navigate('/register-calendar')}>Agendar demo</LandingButton>
        </div>
      )}
    </header>
  );
}

function Hero() {
  const navigate = useNavigate();

  return (
    <section id="hero" className="qlp-hero">
      <div
        className="qlp-hero-media"
        style={{ backgroundImage: `url("${heroAssets.background}")` }}
        aria-hidden="true"
      />
      <div className="qlp-hero-overlay" aria-hidden="true" />

      <div className="qlp-container qlp-hero-content">
        <div className="qlp-hero-copy">
          <h1>
            Seu call center agora cabe no <span>WhatsApp</span>
          </h1>
          <p>
            A Qualifai usa inteligência artificial para automatizar cobranças, qualificar conversas e recuperar mais
            crédito com menos operação.
          </p>
          <div className="qlp-hero-actions">
            <LandingButton onClick={() => navigate('/register-calendar')} className="qlp-button-lg">
              Agendar demonstração <ArrowRight size={20} />
            </LandingButton>
            <LandingButton variant="outline" onClick={() => scrollTo('how-it-works')} className="qlp-button-lg">
              <Play size={20} /> Ver funcionamento
            </LandingButton>
          </div>
        </div>

        <div className="qlp-hero-mockups" aria-label="Prévia do WhatsApp e dashboard Qualifai">
          <div className="qlp-phone-shot">
            <img src={heroAssets.whatsapp} alt="Mockup do WhatsApp automatizado pela Qualifai" />
          </div>
          <div className="qlp-dashboard-shot">
            <img src={heroAssets.dashboard} alt="Dashboard da Qualifai" />
          </div>
        </div>
      </div>

      <button className="qlp-scroll-indicator" type="button" onClick={() => scrollTo('pain-points')}>
        <span>Scroll para explorar</span>
        <span className="qlp-scroll-pill" aria-hidden="true" />
      </button>
    </section>
  );
}

function PainPoints() {
  return (
    <section id="pain-points" className="qlp-section qlp-section-soft">
      <div className="qlp-container">
        <SectionIntro
          title="O desafio das operações de cobrança"
          description="Empresas perdem milhões em oportunidades de recuperação enquanto desperdiçam recursos em processos manuais"
        />

        <div className="qlp-grid qlp-grid-two">
          {painPoints.map(({ icon: Icon, title, description }) => (
            <article className="qlp-card qlp-card-horizontal" key={title}>
              <div className="qlp-icon qlp-icon-soft">
                <Icon size={24} />
              </div>
              <div>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="qlp-stats-grid">
          <Metric value="40%" text="Do tempo de vendedores em tarefas operacionais" />
          <Metric value="72%" text="Potencial de redução de custos com automação" tone="purple" />
          <Metric value="24/7" text="Oportunidades perdidas fora do horário comercial" />
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="features" className="qlp-section">
      <div className="qlp-container">
        <SectionIntro
          title="A solução que transforma sua operação"
          description="Qualifai combina IA humanizada com automação inteligente para recuperar mais crédito com menos esforço"
        />

        <div className="qlp-grid qlp-grid-two">
          {features.map(({ icon: Icon, title, description }) => (
            <article className="qlp-card qlp-card-feature" key={title}>
              <div className="qlp-icon qlp-icon-primary">
                <Icon size={28} />
              </div>
              <div>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="qlp-metric-panels">
          <MetricPanel value="3X" text="Mais recuperação de crédito" tone="blue" />
          <MetricPanel value="72%" text="Redução de custo operacional" tone="purple" />
          <MetricPanel value="24/7" text="Sem pausa, sempre ativa" tone="cyan" />
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="how-it-works" className="qlp-section qlp-section-soft">
      <div className="qlp-container">
        <SectionIntro
          title="Como funciona em 3 passos simples"
          description="De zero a recuperação de crédito automatizada em minutos"
        />

        <div className="qlp-steps">
          {steps.map((step, index) => (
            <article className="qlp-step" key={step.number}>
              <div className="qlp-step-marker">
                <span>{step.number}</span>
                {index < steps.length - 1 && <i aria-hidden="true" />}
              </div>
              <div className="qlp-step-card">
                <h3>{step.title}</h3>
                <p>{step.description}</p>
                <div className="qlp-tags">
                  {step.details.map((detail) => (
                    <span key={detail}>
                      <CheckCircle2 size={16} /> {detail}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="qlp-image-frame">
          <img src={heroAssets.flow} alt="Fluxo de automação com inteligência artificial" />
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section id="testimonials" className="qlp-section">
      <div className="qlp-container">
        <SectionIntro
          title="Empresas que já transformaram sua operação"
          description="Veja como a Qualifai está ajudando empresas a recuperar mais crédito com menos esforço"
        />

        <div className="qlp-grid qlp-grid-three">
          {testimonials.map((testimonial) => (
            <article className="qlp-card qlp-testimonial" key={testimonial.name}>
              <div className="qlp-stars" aria-label="Avaliação 5 estrelas">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} size={20} fill="currentColor" />
                ))}
              </div>
              <p>"{testimonial.text}"</p>
              <footer>
                <strong>{testimonial.name}</strong>
                <span>{testimonial.role}</span>
                <b>{testimonial.company}</b>
              </footer>
            </article>
          ))}
        </div>

        <div className="qlp-trust-grid">
          <Metric value="500+" text="Empresas confiam na Qualifai" />
          <Metric value="R$ 2.3B" text="Em crédito recuperado" tone="purple" />
          <Metric value="98.6%" text="Taxa de satisfação" tone="cyan" />
        </div>
      </div>
    </section>
  );
}

function DetailedFeatures() {
  return (
    <section id="pricing" className="qlp-section qlp-section-muted">
      <div className="qlp-container">
        <SectionIntro
          title="Recursos completos para sua operação"
          description="Tudo que você precisa para automatizar recuperação de crédito em uma única plataforma"
        />

        <div className="qlp-grid qlp-grid-three">
          {featureCategories.map(({ icon: Icon, title, tone, features: items }) => (
            <article className="qlp-feature-list" key={title}>
              <header className={`qlp-feature-list-head qlp-gradient-${tone}`}>
                <Icon size={32} />
                <h3>{title}</h3>
              </header>
              <div className="qlp-feature-list-body">
                {items.map((item) => (
                  <span key={item}>
                    <CheckCircle2 size={20} /> {item}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="qlp-image-frame qlp-dashboard-preview">
          <img src={heroAssets.dashboard} alt="Prévia do dashboard de gestão Qualifai" />
        </div>

        <div className="qlp-capabilities">
          <FeatureChecklist title="Capacidades principais" items={capabilities} tone="blue" />
          <FeatureChecklist title="Benefícios comprovados" items={benefits} tone="purple" />
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  const navigate = useNavigate();

  return (
    <section className="qlp-final-cta">
      <div className="qlp-container qlp-final-cta-inner">
        <div className="qlp-badge">
          <Zap size={16} />
          <span>Pronto para transformar sua operação?</span>
        </div>
        <h2>Comece agora com uma demonstração gratuita</h2>
        <p>
          Veja na prática como a Qualifai pode aumentar sua recuperação de crédito em 3X, reduzindo custos operacionais
          em até 72%.
        </p>
        <div className="qlp-hero-actions">
          <LandingButton variant="light" onClick={() => navigate('/register-calendar')} className="qlp-button-lg">
            Agendar demonstração <ArrowRight size={20} />
          </LandingButton>
          <LandingButton variant="outline-light" onClick={() => scrollTo('hero')} className="qlp-button-lg">
            Conversar com especialista
          </LandingButton>
        </div>
        <div className="qlp-cta-trust">
          <p>Confie em empresas líderes que já transformaram sua operação</p>
          <div>
            <span>✓ Sem cartão de crédito necessário</span>
            <span>✓ Acesso imediato à plataforma</span>
            <span>✓ Suporte dedicado 24/7</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="qlp-footer">
      <div className="qlp-container">
        <div className="qlp-footer-grid">
          <div>
            <h3>Qualifai</h3>
            <p>Transformando WhatsApp em um call center inteligente com IA humanizada.</p>
            <div className="qlp-socials">
              <a href="https://www.linkedin.com/company/qualifai" target="_blank" rel="noreferrer">
                LinkedIn
              </a>
              <a href="https://x.com" target="_blank" rel="noreferrer">
                Twitter
              </a>
            </div>
          </div>
          <FooterColumn title="Produto" items={['Recursos', 'Preços', 'Integrações', 'API']} />
          <FooterColumn title="Empresa" items={['Sobre nós', 'Blog', 'Carreiras', 'Contato']} />
          <FooterColumn title="Legal" items={['Privacidade', 'Termos de Uso', 'Compliance', 'Segurança']} />
        </div>

        <div className="qlp-contact-grid">
          <ContactItem icon={Mail} label="Email" value="contato@qualifai.com.br" />
          <ContactItem icon={Phone} label="Telefone" value="+55 (11) 3000-0000" />
          <ContactItem icon={MapPin} label="Localização" value="São Paulo, Brasil" />
        </div>

        <div className="qlp-footer-bottom">
          <p>© 2026 Qualifai. Todos os direitos reservados.</p>
          <div>
            <a href="/privacy">Privacidade</a>
            <a href="/terms">Termos</a>
            <a href="/blog">Blog</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SectionIntro({ title, description }) {
  return (
    <div className="qlp-section-intro">
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}

function Metric({ value, text, tone = 'blue' }) {
  return (
    <div className="qlp-metric">
      <strong className={`qlp-text-${tone}`}>{value}</strong>
      <p>{text}</p>
    </div>
  );
}

function MetricPanel({ value, text, tone }) {
  return (
    <div className={`qlp-metric-panel qlp-gradient-${tone}`}>
      <strong>{value}</strong>
      <p>{text}</p>
    </div>
  );
}

function FeatureChecklist({ title, items, tone }) {
  return (
    <div className="qlp-checklist">
      <h3>{title}</h3>
      <ul>
        {items.map((item) => (
          <li key={item}>
            <span className={`qlp-dot qlp-dot-${tone}`} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function FooterColumn({ title, items }) {
  return (
    <div>
      <h4>{title}</h4>
      <ul>
        {items.map((item) => (
          <li key={item}>
            <a href="/#features">{item}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ContactItem({ icon: Icon, label, value }) {
  return (
    <div className="qlp-contact-item">
      <Icon size={20} />
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="qlp-page">
      <Header />
      <main>
        <Hero />
        <PainPoints />
        <Features />
        <HowItWorks />
        <Testimonials />
        <DetailedFeatures />
        <FinalCTA />
      </main>
      <Footer />
      <ChatBot conversationId="landingpage" />
    </div>
  );
}
