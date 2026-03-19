import { AdminLayout } from "@/components/layout/AdminLayout";
import {
  Users,
  DollarSign,
  TrendingUp,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const stats = [
  {
    label: "MRR Total",
    value: "R$ 12.560",
    change: "+18%",
    trend: "up",
    icon: DollarSign,
  },
  {
    label: "Integradores Ativos",
    value: "48",
    change: "+5",
    trend: "up",
    icon: Users,
  },
  {
    label: "Taxa de Churn",
    value: "3.2%",
    change: "-0.8%",
    trend: "down",
    icon: TrendingUp,
  },
  {
    label: "Leads Gerados (Total)",
    value: "2.847",
    change: "+234",
    trend: "up",
    icon: Activity,
  },
];

const recentIntegrators = [
  { name: "Solar Tech SP", plan: "PRO", mrr: 199.9, status: "ACTIVE", leads: 156 },
  { name: "Energia Verde RJ", plan: "BASIC", mrr: 99.9, status: "TRIAL", leads: 45 },
  { name: "Sol & Cia MG", plan: "PRO", mrr: 199.9, status: "ACTIVE", leads: 234 },
  { name: "Power Solar PR", plan: "BASIC", mrr: 99.9, status: "PAST_DUE", leads: 89 },
  { name: "Eco Energy SC", plan: "PRO", mrr: 199.9, status: "ACTIVE", leads: 178 },
];

const statusColors = {
  ACTIVE: "bg-secondary/10 text-secondary",
  TRIAL: "bg-accent text-accent-foreground",
  PAST_DUE: "bg-destructive/10 text-destructive",
  CANCELED: "bg-muted text-muted-foreground",
};

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold">Dashboard Administrativo</h2>
          <p className="text-muted-foreground">
            Visão geral da plataforma Leads Solar
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <span
                  className={`flex items-center text-sm font-medium ${
                    stat.trend === "up"
                      ? "text-secondary"
                      : stat.trend === "down" && stat.label !== "Taxa de Churn"
                      ? "text-destructive"
                      : "text-secondary"
                  }`}
                >
                  {stat.trend === "up" && <ArrowUpRight className="h-4 w-4" />}
                  {stat.trend === "down" && <ArrowDownRight className="h-4 w-4" />}
                  {stat.change}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-3xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Integrators Table */}
          <div className="lg:col-span-2 card-solar">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Integradores Recentes</h3>
              <a href="/admin/integrators" className="text-sm text-primary hover:underline">
                Ver Todos
              </a>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                      Empresa
                    </th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                      Plano
                    </th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                      MRR
                    </th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                      Leads
                    </th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentIntegrators.map((integrator, index) => (
                    <tr
                      key={index}
                      className="border-b border-border/50 hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-3 px-2">
                        <span className="font-medium">{integrator.name}</span>
                      </td>
                      <td className="py-3 px-2">
                        <span
                          className={`text-xs font-medium ${
                            integrator.plan === "PRO"
                              ? "text-primary"
                              : "text-muted-foreground"
                          }`}
                        >
                          {integrator.plan}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        R$ {integrator.mrr}
                      </td>
                      <td className="py-3 px-2">{integrator.leads}</td>
                      <td className="py-3 px-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            statusColors[integrator.status as keyof typeof statusColors]
                          }`}
                        >
                          {integrator.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Alerts */}
          <div className="space-y-6">
            <div className="card-solar">
              <h3 className="text-lg font-semibold mb-4">Alertas</h3>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-destructive/5 border border-destructive/10">
                  <p className="text-sm font-medium text-destructive">
                    1 integrador com pagamento atrasado
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Power Solar PR - R$ 197
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-accent/50 border border-accent/50">
                  <p className="text-sm font-medium">
                    2 trials acabando em 3 dias
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Energia Verde RJ, Nova Solar BA
                  </p>
                </div>
              </div>
            </div>

            <div className="card-solar bg-gradient-to-br from-primary/5 to-primary/10">
              <h3 className="font-semibold mb-2">📊 Resumo do Mês</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Novos integradores</span>
                  <span className="font-medium">+8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cancelamentos</span>
                  <span className="font-medium text-destructive">-2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Upgrades</span>
                  <span className="font-medium text-secondary">+3</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}