import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Logo } from "@/components/layout/Logo";
import { ArrowLeft, ArrowRight, Palette, Upload } from "lucide-react";

const colorPresets = [
  { name: "Solar", primary: "#F59E0B", secondary: "#10B981" },
  { name: "Ocean", primary: "#3B82F6", secondary: "#06B6D4" },
  { name: "Forest", primary: "#22C55E", secondary: "#14B8A6" },
  { name: "Sunset", primary: "#EF4444", secondary: "#F97316" },
];

export default function OnboardingBranding() {
  const navigate = useNavigate();
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [welcomeMessage, setWelcomeMessage] = useState(
    "Olá! 👋 Bem-vindo à {empresa}. Sou seu assistente virtual e vou te ajudar a receber um pré-orçamento de energia solar. Vamos começar?"
  );

  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col">
      <header className="p-6 flex items-center justify-between">
        <Logo size="md" />
        <span className="text-sm text-muted-foreground">Passo 4 de 5</span>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl animate-fade-up">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
              <Palette className="h-6 w-6 text-accent-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Personalização</h1>
              <p className="text-muted-foreground">
                Configure a aparência do seu assistente
              </p>
            </div>
          </div>

          <div className="space-y-8">
            {/* Logo Upload */}
            <div className="space-y-4">
              <Label>Logo da Empresa</Label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-xl border-2 border-dashed border-border bg-muted/50 flex items-center justify-center">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <Button variant="outline" size="sm">
                    Fazer Upload
                  </Button>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG ou JPG, máximo 2MB
                  </p>
                </div>
              </div>
            </div>

            {/* Color Theme */}
            <div className="space-y-4">
              <Label>Tema de Cores</Label>
              <div className="grid grid-cols-4 gap-4">
                {colorPresets.map((preset, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedPreset(index)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selectedPreset === index
                        ? "border-primary shadow-md"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex gap-2 mb-2">
                      <div
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: preset.primary }}
                      />
                      <div
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: preset.secondary }}
                      />
                    </div>
                    <span className="text-sm font-medium">{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Welcome Message */}
            <div className="space-y-4">
              <Label htmlFor="welcomeMessage">Mensagem de Boas-vindas</Label>
              <Textarea
                id="welcomeMessage"
                value={welcomeMessage}
                onChange={(e) => setWelcomeMessage(e.target.value)}
                rows={4}
                placeholder="Digite a mensagem inicial do bot..."
              />
              <p className="text-xs text-muted-foreground">
                Use {"{empresa}"} para inserir o nome da sua empresa automaticamente.
              </p>
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => navigate("/onboarding/whatsapp")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <Button
              variant="solar"
              size="lg"
              className="flex-1"
              onClick={() => navigate("/onboarding/plan")}
            >
              Continuar
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}