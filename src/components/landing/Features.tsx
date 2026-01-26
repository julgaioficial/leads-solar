import { 
  MessageSquare, 
  Zap, 
  BarChart3, 
  CreditCard, 
  Palette, 
  Shield 
} from "lucide-react";

const features = [
  {
    icon: MessageSquare,
    title: "WhatsApp Automatizado",
    description: "Responda leads 24/7 com IA conversacional. Capture informações e envie pré-orçamentos instantaneamente.",
    color: "primary",
  },
  {
    icon: Zap,
    title: "Pré-Orçamentos em Segundos",
    description: "Gere orçamentos profissionais baseados nos dados do lead, kits disponíveis e localização.",
    color: "accent",
  },
  {
    icon: BarChart3,
    title: "Dashboard Inteligente",
    description: "Acompanhe leads, conversões, ROI e performance em tempo real com métricas detalhadas.",
    color: "secondary",
  },
  {
    icon: CreditCard,
    title: "Sistema de Créditos",
    description: "Pague apenas pelo que usar. 1 crédito = 1 pré-orçamento enviado. Sem surpresas.",
    color: "primary",
  },
  {
    icon: Palette,
    title: "White Label",
    description: "Personalize cores, logo e mensagens. Seu cliente vê sua marca, não a nossa.",
    color: "accent",
  },
  {
    icon: Shield,
    title: "Seguro e Confiável",
    description: "Dados criptografados, backup automático e uptime de 99.9%. Seu negócio protegido.",
    color: "secondary",
  },
];

const colorClasses = {
  primary: {
    bg: "bg-primary/10",
    text: "text-primary",
    border: "border-primary/20",
  },
  secondary: {
    bg: "bg-secondary/10",
    text: "text-secondary",
    border: "border-secondary/20",
  },
  accent: {
    bg: "bg-accent/20",
    text: "text-accent-foreground",
    border: "border-accent/30",
  },
};

export function Features() {
  return (
    <section id="features" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Tudo que você precisa para{" "}
            <span className="text-gradient-solar">escalar</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ferramentas poderosas para automatizar seu atendimento e converter mais leads em vendas.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const colors = colorClasses[feature.color as keyof typeof colorClasses];
            return (
              <div
                key={index}
                className="group relative p-6 rounded-2xl border border-border/50 bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div
                  className={`inline-flex p-3 rounded-xl ${colors.bg} ${colors.border} border mb-4`}
                >
                  <feature.icon className={`h-6 w-6 ${colors.text}`} />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
