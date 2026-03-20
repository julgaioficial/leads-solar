import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/Logo";
import { ArrowLeft, Check, CreditCard, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const plans = [
  {
    id: "basic",
    name: "Básico",
    price: "69,90",
    budgets: 100,
    features: ["100 pré-orçamentos/mês", "Chatbot responsivo", "Dashboard completo", "Suporte por email"],
  },
  {
    id: "pro",
    name: "Pro",
    price: "149,90",
    budgets: 250,
    popular: true,
    features: [
      "250 pré-orçamentos/mês",
      "Chatbot responsivo",
      "Dashboard completo",
      "Suporte prioritário",
      "API de integração",
      "White label",
    ],
  },
];

export default function OnboardingPlan() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState("pro");
  const [isLoading, setIsLoading] = useState(false);

  const handleFinish = () => {
    setIsLoading(true);
    setTimeout(() => {
      toast({
        title: "Trial ativado! 🎉",
        description: "Você tem 7 dias grátis para testar. Aproveite!",
      });
      navigate("/dashboard/home");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col">
      <header className="p-6 flex items-center justify-between">
        <Logo size="md" />
        <span className="text-sm text-muted-foreground">Passo 5 de 5</span>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-3xl animate-fade-up">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Escolha seu Plano</h1>
              <p className="text-muted-foreground">
                7 dias grátis, sem cartão de crédito
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {plans.map((plan) => (
              <button
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`relative p-6 rounded-2xl border-2 text-left transition-all ${
                  selectedPlan === plan.id
                    ? "border-primary bg-primary/5 shadow-solar"
                    : "border-border hover:border-primary/50"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 right-4">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-cta text-primary-foreground text-xs font-medium">
                      <Zap className="h-3 w-3" />
                      Mais Popular
                    </span>
                  </div>
                )}

                <div className="mb-4">
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-sm text-muted-foreground">R$</span>
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">/mês</span>
                  </div>
                  <p className="text-sm text-secondary mt-1">
                    {plan.budgets} pré-orçamentos inclusos
                  </p>
                </div>

                <ul className="space-y-2">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-secondary" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {selectedPlan === plan.id && (
                  <div className="absolute top-4 left-4 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <Check className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}
              </button>
            ))}
          </div>

          <div className="bg-card rounded-xl border border-border/50 p-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Trial de 7 dias grátis</p>
                <p className="text-sm text-muted-foreground">
                  Teste todas as funcionalidades. Só paga se gostar!
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => navigate("/onboarding/branding")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <Button
              variant="solar"
              size="lg"
              className="flex-1"
              onClick={handleFinish}
              disabled={isLoading}
            >
              {isLoading ? "Ativando trial..." : "Começar Trial Grátis"}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}