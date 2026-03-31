import { AdminLayout } from "@/components/layout/AdminLayout";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Users,
  DollarSign,
  TrendingUp,
  Activity,
  ArrowUpRight,
  Key,
  Eye,
  Ban,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface IntegratorRow {
  id: string;
  company_name: string;
  subscription_plan: string | null;
  subscription_status: string | null;
  budgets_used: number | null;
  monthly_budget_limit: number | null;
  created_at: string;
}

const statusColors: Record<string, string> = {
  active: "bg-secondary/10 text-secondary",
  trial: "bg-accent text-accent-foreground",
  past_due: "bg-destructive/10 text-destructive",
  canceled: "bg-muted text-muted-foreground",
  expired: "bg-muted text-muted-foreground",
};

export default function AdminDashboard() {
  const [integrators, setIntegrators] = useState<IntegratorRow[]>([]);
  const [totalLeads, setTotalLeads] = useState(0);
  const [activeLicenses, setActiveLicenses] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [intRes, leadsRes, licRes] = await Promise.all([
      supabase.from("integrators").select("id, company_name, subscription_plan, subscription_status, budgets_used, monthly_budget_limit, created_at").order("created_at", { ascending: false }).limit(10),
      supabase.from("leads").select("id", { count: "exact", head: true }),
      supabase.from("licenses").select("id", { count: "exact", head: true }).eq("status", "active"),
    ]);
    setIntegrators(intRes.data || []);
    setTotalLeads(leadsRes.count || 0);
    setActiveLicenses(licRes.count || 0);
  };

  const activeCount = integrators.filter(i => i.subscription_status === "active").length;
  const trialCount = integrators.filter(i => i.subscription_status === "trial").length;
  const pastDueCount = integrators.filter(i => i.subscription_status === "past_due").length;

  const mrr = integrators.reduce((acc, i) => {
    if (i.subscription_status !== "active") return acc;
    return acc + (i.subscription_plan === "pro" ? 149.90 : 69.90);
  }, 0);

  const stats = [
    { label: "MRR Total", value: `R$ ${mrr.toFixed(2).replace(".", ",")}`, icon: DollarSign },
    { label: "Integradores Ativos", value: `${activeCount}`, icon: Users },
    { label: "Licenças Ativas", value: `${activeLicenses}`, icon: Key },
    { label: "Leads Gerados (Total)", value: `${totalLeads}`, icon: Activity },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Dashboard Administrativo</h2>
          <p className="text-muted-foreground">Visão geral da plataforma Leads Solar</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-3xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 card-solar">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Integradores Recentes</h3>
              <button onClick={() => navigate("/admin/integrators")} className="text-sm text-primary hover:underline">Ver Todos</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Empresa</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Plano</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Orçamentos</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {integrators.slice(0, 5).map((i) => (
                    <tr key={i.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-2 font-medium">{i.company_name}</td>
                      <td className="py-3 px-2">
                        <span className={`text-xs font-semibold ${i.subscription_plan === "pro" ? "text-primary" : "text-muted-foreground"}`}>
                          {(i.subscription_plan || "basic").toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-2">{i.budgets_used || 0}/{i.monthly_budget_limit || 100}</td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[i.subscription_status || "trial"] || statusColors.trial}`}>
                          {(i.subscription_status || "trial").toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {integrators.length === 0 && (
                    <tr><td colSpan={4} className="py-8 text-center text-muted-foreground">Nenhum integrador cadastrado ainda</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card-solar">
              <h3 className="text-lg font-semibold mb-4">Resumo</h3>
              <div className="space-y-3">
                <div className="flex justify-between p-3 rounded-lg bg-secondary/5">
                  <span className="text-sm text-muted-foreground">Ativos</span>
                  <span className="font-bold text-secondary">{activeCount}</span>
                </div>
                <div className="flex justify-between p-3 rounded-lg bg-accent/30">
                  <span className="text-sm text-muted-foreground">Em Trial</span>
                  <span className="font-bold">{trialCount}</span>
                </div>
                <div className="flex justify-between p-3 rounded-lg bg-destructive/5">
                  <span className="text-sm text-muted-foreground">Inadimplentes</span>
                  <span className="font-bold text-destructive">{pastDueCount}</span>
                </div>
              </div>
            </div>

            <div className="card-solar bg-gradient-to-br from-primary/5 to-primary/10">
              <h3 className="font-semibold mb-2">📊 Planos</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Básico (R$ 69,90)</span>
                  <span className="font-medium">{integrators.filter(i => i.subscription_plan === "basic" && i.subscription_status === "active").length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pro (R$ 149,90)</span>
                  <span className="font-medium">{integrators.filter(i => i.subscription_plan === "pro" && i.subscription_status === "active").length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
