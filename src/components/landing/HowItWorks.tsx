import { MessageSquare, Bot, FileText, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: MessageSquare,
    step: "01",
    title: "Cliente envia mensagem",
    description:
      "Seu cliente entra em contato pelo WhatsApp. O bot ZapSolar inicia a conversa automaticamente.",
  },
  {
    icon: Bot,
    step: "02",
    title: "IA coleta informações",
    description:
      "Perguntas inteligentes capturam: consumo mensal, tipo de telhado, localização e preferências.",
  },
  {
    icon: FileText,
    step: "03",
    title: "Pré-orçamento enviado",
    description:
      "Em segundos, o cliente recebe um pré-orçamento profissional com seus kits e valores.",
  },
  {
    icon: TrendingUp,
    step: "04",
    title: "Lead qualificado no dashboard",
    description:
      "Você vê todos os dados no painel, pronto para fechar a venda com informações completas.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Como <span className="text-gradient-solar">funciona</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Em 4 passos simples, transforme mensagens em vendas.
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-24 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-primary via-accent to-secondary" />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative text-center group">
                {/* Step Number Circle */}
                <div className="relative inline-flex mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-cta flex items-center justify-center text-primary-foreground shadow-solar group-hover:scale-110 transition-transform duration-300">
                    <step.icon className="h-8 w-8" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-foreground text-background text-sm font-bold flex items-center justify-center">
                    {step.step}
                  </span>
                </div>

                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
