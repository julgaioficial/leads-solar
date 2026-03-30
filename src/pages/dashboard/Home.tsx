import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ChatWidget } from "@/components/chatbot/ChatWidget";
import { 
  Users, 
  TrendingUp, 
  MessageSquare,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  ExternalLink,
  Copy,
  Link2,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const sampleKits = [
  { id: 1, name: "Kit 3kWp", power: "3 kWp", panels: 6, inverter: "Growatt 3000", price: 15000, installPrice: 3000, minConsumption: 200, maxConsumption: 350 },
  { id: 2, name: "Kit 5kWp", power: "5 kWp", panels: 10, inverter: "Growatt 5000", price: 22000, installPrice: 4500, minConsumption: 350, maxConsumption: 550 },
  { id: 3, name: "Kit 10kWp", power: "10 kWp", panels: 20, inverter: "Growatt 10000", price: 42000, installPrice: 8000, minConsumption: 550, maxConsumption: 1100 },
];

const stats = [
  { label: "Leads Hoje", value: "24", change: "+12%", trend: "up", icon: Users },
  { label: "Taxa de Conversão", value: "38%", change: "+5%", trend: "up", icon: TrendingUp },
  { label: "Orçamentos Restantes", value: "178/250", change: "", trend: "neutral", icon: FileText },
  { label: "Conversas Hoje", value: "156", change: "-3%", trend: "down", icon: MessageSquare },
];

export default function DashboardHome() {
  const { toast } = useToast();
  const [chatKey, setChatKey] = useState(0);
  const pageUrl = `${window.location.origin}/s/solar-tech-sp`;

  const copyLink = () => {
    navigator.clipboard.writeText(pageUrl);
    toast({ title: "Link copiado! 📋" });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Olá, João! 👋</h2>
            <p className="text-muted-foreground">Aqui está o resumo do seu dia.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setChatKey((k) => k + 1)}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Resetar Chat
            </Button>
            <Button variant="outline" size="sm" onClick={() => window.open(pageUrl, "_blank")}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Ver Página
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                {stat.change && (
                  <span className={`flex items-center text-sm font-medium ${
                    stat.trend === "up" ? "text-secondary" : stat.trend === "down" ? "text-destructive" : "text-muted-foreground"
                  }`}>
                    {stat.trend === "up" && <ArrowUpRight className="h-4 w-4" />}
                    {stat.trend === "down" && <ArrowDownRight className="h-4 w-4" />}
                    {stat.change}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-3xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Chatbot Centralizado + Sidebar */}
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Chatbot Central */}
          <div className="lg:col-span-3 flex flex-col items-center">
            <div className="w-full max-w-2xl">
              <div className="mb-4 text-center">
                <h3 className="text-lg font-semibold">Preview do seu Chatbot</h3>
                <p className="text-sm text-muted-foreground">Esse é o chatbot que seus clientes veem na página white-label</p>
              </div>
              <ChatWidget
                key={chatKey}
                companyName="Solar Tech SP"
                primaryColor="#E88A1A"
                secondaryColor="#2D9B83"
                kits={sampleKits}
                embedded
                botName="Assistente Solar"
              />
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-4">
            {/* Link */}
            <div className="card-solar">
              <div className="flex items-center gap-2 mb-3">
                <Link2 className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-sm">Seu Link</h3>
              </div>
              <div className="flex gap-2">
                <input
                  readOnly
                  value={pageUrl}
                  className="flex-1 px-3 py-2 rounded-lg bg-muted text-[10px] font-mono border truncate"
                />
                <Button variant="outline" size="sm" onClick={copyLink}>
                  <Copy className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            {/* Stats rápidas */}
            <div className="card-solar">
              <h3 className="font-semibold text-sm mb-3">📊 Estatísticas</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 rounded-lg bg-muted/50">
                  <span className="text-xs text-muted-foreground">Conversas hoje</span>
                  <span className="font-bold text-sm">47</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg bg-muted/50">
                  <span className="text-xs text-muted-foreground">Orçamentos</span>
                  <span className="font-bold text-sm text-secondary">23</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg bg-muted/50">
                  <span className="text-xs text-muted-foreground">Conclusão</span>
                  <span className="font-bold text-sm">72%</span>
                </div>
              </div>
            </div>

            {/* Ações */}
            <div className="card-solar">
              <h3 className="font-semibold text-sm mb-3">⚡ Ações Rápidas</h3>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                  <Users className="h-3.5 w-3.5 mr-2" />
                  Ver Leads
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                  <MessageSquare className="h-3.5 w-3.5 mr-2" />
                  Editar Fluxo
                </Button>
              </div>
            </div>

            {/* Dica */}
            <div className="card-solar bg-gradient-to-br from-primary/5 to-primary/10">
              <h3 className="font-semibold text-sm mb-1">💡 Dica</h3>
              <p className="text-xs text-muted-foreground">
                Leads HOT têm 3x mais chances de fechar. Priorize o contato em 24h!
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
