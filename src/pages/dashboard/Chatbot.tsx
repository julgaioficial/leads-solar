import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { ChatWidget } from "@/components/chatbot/ChatWidget";
import {
  BarChart3,
  Settings,
  MessageCircle,
  RefreshCw,
  ExternalLink,
  Copy,
  Link2,
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const sampleKits = [
  { id: 1, name: "Kit 3kWp", power: "3 kWp", panels: 6, inverter: "Growatt 3000", price: 15000, installPrice: 3000, minConsumption: 200, maxConsumption: 350 },
  { id: 2, name: "Kit 5kWp", power: "5 kWp", panels: 10, inverter: "Growatt 5000", price: 22000, installPrice: 4500, minConsumption: 350, maxConsumption: 550 },
  { id: 3, name: "Kit 10kWp", power: "10 kWp", panels: 20, inverter: "Growatt 10000", price: 42000, installPrice: 8000, minConsumption: 550, maxConsumption: 1100 },
];

export default function DashboardChatbot() {
  const { toast } = useToast();
  const [key, setKey] = useState(0);
  const pageUrl = `${window.location.origin}/s/solar-tech-sp`;

  const copyLink = () => {
    navigator.clipboard.writeText(pageUrl);
    toast({ title: "Link copiado! 📋" });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Chatbot</h2>
            <p className="text-muted-foreground">
              Preview do chatbot alimentado pelos seus kits e fluxo de conversa
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setKey((k) => k + 1)}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Resetar
            </Button>
            <Button variant="outline" onClick={() => window.open(pageUrl, "_blank")}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Ver Página
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Chat Preview */}
          <div className="lg:col-span-2">
            <ChatWidget
              key={key}
              companyName="Solar Tech SP"
              primaryColor="#E88A1A"
              secondaryColor="#2D9B83"
              kits={sampleKits}
              embedded
              botName="Assistente Solar"
            />
          </div>

          {/* Stats & Info */}
          <div className="space-y-6">
            {/* Link */}
            <div className="card-solar">
              <div className="flex items-center gap-2 mb-3">
                <Link2 className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Seu Link</h3>
              </div>
              <div className="flex gap-2">
                <input
                  readOnly
                  value={pageUrl}
                  className="flex-1 px-3 py-2 rounded-lg bg-muted text-xs font-mono border truncate"
                />
                <Button variant="outline" size="sm" onClick={copyLink}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="card-solar">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Estatísticas</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                  <span className="text-sm text-muted-foreground">Conversas hoje</span>
                  <span className="font-bold">47</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                  <span className="text-sm text-muted-foreground">Orçamentos gerados</span>
                  <span className="font-bold text-secondary">23</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                  <span className="text-sm text-muted-foreground">Taxa de conclusão</span>
                  <span className="font-bold">72%</span>
                </div>
              </div>
            </div>

            <div className="card-solar">
              <div className="flex items-center gap-2 mb-4">
                <Settings className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Alimentação de Dados</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="p-3 rounded-lg bg-secondary/5 border border-secondary/10">
                  <p className="font-medium text-secondary">Kits Cadastrados</p>
                  <p className="text-muted-foreground">{sampleKits.length} kits disponíveis</p>
                </div>
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                  <p className="font-medium text-primary">Fluxo de Conversa</p>
                  <p className="text-muted-foreground">6 perguntas ativas</p>
                </div>
              </div>
            </div>

            <div className="card-solar bg-gradient-to-br from-primary/5 to-primary/10">
              <div className="flex items-center gap-2 mb-2">
                <MessageCircle className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Integração</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                O chatbot usa os dados dos seus kits e fluxo de conversa para gerar orçamentos automaticamente.
              </p>
              <p className="text-xs text-muted-foreground">
                Edite as perguntas em <strong>Fluxo de Conversa</strong> e os kits em <strong>Kits</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
