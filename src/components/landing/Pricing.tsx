import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, Zap } from "lucide-react";

const plans = [
  {
    name: "Básico",
    price: "69,90",
    budgets: "100",
    description: "Ideal para integradores iniciantes",
    features: [
      "100 pré-orçamentos/mês",
      "Chatbot responsivo",
      "Dashboard completo",
      "Suporte por email",
      "Gestão de kits",
      "Relatórios básicos",
    ],
    popular: false,
    cta: "Começar Trial Grátis",
  },
  {
    name: "Pro",
    price: "149,90",
    budgets: "250",
    description: "Para integradores estabelecidos",
    features: [
      "250 pré-orçamentos/mês",
      "Chatbot responsivo",
      "Dashboard completo",
      "Suporte prioritário",
      "Gestão de kits avançada",
      "Relatórios detalhados",
      "API de integração",
      "White label completo",
    ],
    popular: true,
    cta: "Começar Trial Grátis",
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Planos simples e{" "}
            <span className="text-gradient-panel">transparentes</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comece com 7 dias grátis. Cancele quando quiser. Sem taxas escondidas.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative p-8 rounded-2xl border-2 transition-all duration-300 hover:shadow-xl ${
                plan.popular
                  ? "border-primary bg-card shadow-solar"
                  : "border-border/50 bg-card"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 px-4 py-1 rounded-full bg-gradient-cta text-primary-foreground text-sm font-medium">
                    <Zap className="h-3 w-3" />
                    Mais Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-muted-foreground">{plan.description}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-sm text-muted-foreground">R$</span>
                  <span className="text-5xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
                <p className="text-sm text-secondary mt-1">
                  {plan.budgets} pré-orçamentos inclusos
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-secondary/10 flex items-center justify-center">
                      <Check className="h-3 w-3 text-secondary" />
                    </div>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link to="/register">
                <Button
                  variant={plan.popular ? "solar" : "outline"}
                  size="lg"
                  className="w-full"
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            💡 1 crédito = 1 pré-orçamento enviado •{" "}
            <span className="text-primary">ROI médio de 915%</span>
          </p>
        </div>
      </div>
    </section>
  );
}
