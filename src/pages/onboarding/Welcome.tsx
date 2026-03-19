import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/Logo";
import { Sparkles, ArrowRight, Building2, MessageSquare, Palette, CreditCard } from "lucide-react";

const steps = [
  { id: 1, title: "Boas-vindas", icon: Sparkles },
  { id: 2, title: "Empresa", icon: Building2 },
  { id: 3, title: "WhatsApp", icon: MessageSquare },
  { id: 4, title: "Branding", icon: Palette },
  { id: 5, title: "Plano", icon: CreditCard },
];

export default function OnboardingWelcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col">
      {/* Header */}
      <header className="p-6">
        <Logo size="md" />
      </header>

      {/* Progress */}
      <div className="px-6 mb-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                    step.id === 1
                      ? "bg-primary border-primary text-primary-foreground"
                      : "border-border bg-background text-muted-foreground"
                  }`}
                >
                  <step.icon className="h-5 w-5" />
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-12 lg:w-24 h-0.5 mx-2 ${
                      step.id < 1 ? "bg-primary" : "bg-border"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-xl text-center animate-fade-up">
          <div className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-gradient-cta flex items-center justify-center animate-pulse-glow">
            <Sparkles className="h-10 w-10 text-primary-foreground" />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Bem-vindo ao Leads Solar! 🎉
          </h1>

          <p className="text-lg text-muted-foreground mb-8">
            Vamos configurar sua conta em apenas 4 passos simples.
            Você terá seu assistente de vendas funcionando em menos de 10 minutos.
          </p>

          <div className="bg-card rounded-2xl border border-border/50 p-6 mb-8 text-left">
            <h3 className="font-semibold mb-4">O que vamos configurar:</h3>
            <ul className="space-y-3">
              {[
                "Dados da sua empresa",
                "Conexão com WhatsApp",
                "Personalização visual",
                "Escolha do plano ideal",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-bold text-sm">
                    {i + 1}
                  </div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <Button
            variant="solar"
            size="xl"
            onClick={() => navigate("/onboarding/company")}
            className="group"
          >
            Começar Configuração
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>

          <p className="mt-4 text-sm text-muted-foreground">
            Tempo estimado: 5-10 minutos
          </p>
        </div>
      </main>
    </div>
  );
}