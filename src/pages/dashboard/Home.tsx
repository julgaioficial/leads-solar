import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { 
  Users, 
  CreditCard, 
  TrendingUp, 
  MessageSquare,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";

const stats = [
  {
    label: "Leads Hoje",
    value: "24",
    change: "+12%",
    trend: "up",
    icon: Users,
  },
  {
    label: "Taxa de Conversão",
    value: "38%",
    change: "+5%",
    trend: "up",
    icon: TrendingUp,
  },
  {
    label: "Orçamentos Restantes",
    value: "178/250",
    change: "",
    trend: "neutral",
    icon: CreditCard,
  },
  {
    label: "Conversas Hoje",
    value: "156",
    change: "-3%",
    trend: "down",
    icon: MessageSquare,
  },
];

const recentLeads = [
  { name: "João Silva", email: "joao@email.com", status: "HOT", time: "5 min" },
  { name: "Maria Santos", email: "maria@email.com", status: "WARM", time: "12 min" },
  { name: "Pedro Costa", email: "pedro@email.com", status: "COLD", time: "25 min" },
  { name: "Ana Oliveira", email: "ana@email.com", status: "HOT", time: "32 min" },
  { name: "Carlos Lima", email: "carlos@email.com", status: "WARM", time: "45 min" },
];

const statusColors = {
  HOT: "bg-destructive/10 text-destructive",
  WARM: "bg-accent text-accent-foreground",
  COLD: "bg-secondary/10 text-secondary",
};

export default function DashboardHome() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Olá, João! 👋</h2>
            <p className="text-muted-foreground">
              Aqui está o resumo do seu dia.
            </p>
          </div>
          <Button variant="solar">+ Novo Kit</Button>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                {stat.change && (
                  <span
                    className={`flex items-center text-sm font-medium ${
                      stat.trend === "up"
                        ? "text-secondary"
                        : stat.trend === "down"
                        ? "text-destructive"
                        : "text-muted-foreground"
                    }`}
                  >
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

        {/* Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Leads */}
          <div className="lg:col-span-2 card-solar">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Leads Recentes</h3>
              <Button variant="ghost" size="sm">
                Ver Todos
              </Button>
            </div>
            <div className="space-y-4">
              {recentLeads.map((lead, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-panel flex items-center justify-center text-secondary-foreground font-semibold text-sm">
                      {lead.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{lead.name}</p>
                      <p className="text-sm text-muted-foreground">{lead.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        statusColors[lead.status as keyof typeof statusColors]
                      }`}
                    >
                      {lead.status}
                    </span>
                    <span className="text-xs text-muted-foreground">{lead.time}</span>
                    <button className="p-1 hover:bg-muted rounded">
                      <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="card-solar">
              <h3 className="text-lg font-semibold mb-4">Ações Rápidas</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Ver Todos os Leads
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Editar Fluxo de Conversa
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Comprar Mais Créditos
                </Button>
              </div>
            </div>

            <div className="card-solar bg-gradient-to-br from-primary/5 to-primary/10">
              <h3 className="font-semibold mb-2">💡 Dica do Dia</h3>
              <p className="text-sm text-muted-foreground">
                Leads HOT têm 3x mais chances de fechar. Priorize o contato com
                eles nas próximas 24 horas!
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}