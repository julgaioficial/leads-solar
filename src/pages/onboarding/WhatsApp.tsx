import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/Logo";
import { ArrowLeft, ArrowRight, MessageSquare, Smartphone, QrCode, Check } from "lucide-react";

const steps = [
  {
    id: 1,
    title: "Baixe o WhatsApp Business",
    description: "Baixe o app WhatsApp Business na Play Store ou App Store.",
    icon: Smartphone,
  },
  {
    id: 2,
    title: "Configure um número dedicado",
    description: "Use um número exclusivo para o atendimento automatizado.",
    icon: MessageSquare,
  },
  {
    id: 3,
    title: "Escaneie o QR Code",
    description: "Conecte seu WhatsApp ao ZapSolar escaneando o código.",
    icon: QrCode,
  },
];

export default function OnboardingWhatsApp() {
  const navigate = useNavigate();
  const [isConnected, setIsConnected] = useState(false);

  const simulateConnection = () => {
    // Simulate WhatsApp connection
    setTimeout(() => {
      setIsConnected(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col">
      <header className="p-6 flex items-center justify-between">
        <Logo size="md" />
        <span className="text-sm text-muted-foreground">Passo 3 de 5</span>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl animate-fade-up">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Conectar WhatsApp</h1>
              <p className="text-muted-foreground">
                Configure seu número para receber leads
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Instructions */}
            <div className="space-y-6">
              <h3 className="font-semibold">Como conectar:</h3>
              {steps.map((step) => (
                <div key={step.id} className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                    <step.icon className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <h4 className="font-medium">{step.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* QR Code Area */}
            <div className="flex flex-col items-center justify-center p-8 rounded-2xl border border-border/50 bg-card">
              {isConnected ? (
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary/10 flex items-center justify-center">
                    <Check className="h-8 w-8 text-secondary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Conectado!</h3>
                  <p className="text-sm text-muted-foreground">
                    Seu WhatsApp está pronto para receber leads.
                  </p>
                </div>
              ) : (
                <>
                  <div className="w-48 h-48 bg-muted rounded-xl flex items-center justify-center mb-4">
                    <QrCode className="h-24 w-24 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground text-center mb-4">
                    Escaneie com o WhatsApp Business
                  </p>
                  <Button variant="secondary" onClick={simulateConnection}>
                    Simular Conexão
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => navigate("/onboarding/company")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <Button
              variant="solar"
              size="lg"
              className="flex-1"
              onClick={() => navigate("/onboarding/branding")}
              disabled={!isConnected}
            >
              Continuar
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Problemas para conectar?{" "}
            <a href="#" className="text-primary hover:underline">
              Ver tutorial completo
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}