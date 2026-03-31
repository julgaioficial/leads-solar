import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ChatWidget } from "@/components/chatbot/ChatWidget";
import {
  Users, TrendingUp, FileText, ArrowUpRight, ArrowDownRight, RefreshCw, ExternalLink, Copy, Link2, MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface IntegratorData {
  id: string;
  company_name: string;
  slug: string;
  primary_color: string | null;
  secondary_color: string | null;
  bot_name: string | null;
  welcome_message: string | null;
  closing_message: string | null;
  logo_url: string | null;
  budgets_used: number | null;
  monthly_budget_limit: number | null;
}

interface KitData {
  id: string;
  name: string;
  power: string;
  panels: number;
  inverter: string | null;
  price: number;
  install_price: number | null;
  min_consumption: number;
  max_consumption: number;
}

export default function DashboardHome() {
  const { toast } = useToast();
  const { integratorId } = useAuth();
  const [chatKey, setChatKey] = useState(0);
  const [integrator, setIntegrator] = useState<IntegratorData | null>(null);
  const [kits, setKits] = useState<KitData[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [leadsToday, setLeadsToday] = useState(0);
  const [totalLeads, setTotalLeads] = useState(0);

  useEffect(() => {
    if (integratorId) loadData();
  }, [integratorId]);

  const loadData = async () => {
    const [intRes, kitsRes, questionsRes] = await Promise.all([
      supabase.from("integrators").select("*").eq("id", integratorId!).single(),
      supabase.from("kits").select("*").eq("integrator_id", integratorId!).eq("active", true).order("min_consumption"),
      supabase.from("flow_questions").select("*").eq("integrator_id", integratorId!).eq("active", true).order("question_order"),
    ]);

    if (intRes.data) setIntegrator(intRes.data as any);
    setKits(kitsRes.data || []);
    setQuestions((questionsRes.data || []).map((q: any) => ({
      id: q.id, order: q.question_order, question: q.question_text,
      type: q.question_type, options: q.options ? (Array.isArray(q.options) ? q.options : JSON.parse(q.options)) : undefined,
      variable: q.variable, required: q.required ?? true, active: q.active ?? true,
    })));

    // Count leads
    const today = new Date().toISOString().split("T")[0];
    const [todayRes, totalRes] = await Promise.all([
      supabase.from("leads").select("id", { count: "exact", head: true }).eq("integrator_id", integratorId!).gte("created_at", today),
      supabase.from("leads").select("id", { count: "exact", head: true }).eq("integrator_id", integratorId!),
    ]);
    setLeadsToday(todayRes.count || 0);
    setTotalLeads(totalRes.count || 0);
  };

  const pageUrl = integrator ? `${window.location.origin}/s/${integrator.slug}` : "";

  const copyLink = () => {
    navigator.clipboard.writeText(pageUrl);
    toast({ title: "Link copiado! 📋" });
  };

  const stats = [
    { label: "Leads Hoje", value: `${leadsToday}`, icon: Users },
    { label: "Total de Leads", value: `${totalLeads}`, icon: TrendingUp },
    { label: "Orçamentos", value: `${integrator?.budgets_used || 0}/${integrator?.monthly_budget_limit || 100}`, icon: FileText },
    { label: "Kits Ativos", value: `${kits.length}`, icon: MessageSquare },
  ];

  const chatKits = kits.map(k => ({
    id: k.id, name: k.name, power: k.power, panels: k.panels,
    inverter: k.inverter || "", price: Number(k.price),
    installPrice: Number(k.install_price) || 0,
    minConsumption: k.min_consumption, maxConsumption: k.max_consumption,
  }));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Olá! 👋</h2>
            <p className="text-muted-foreground">Aqui está o resumo do seu dia.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setChatKey((k) => k + 1)}>
              <RefreshCw className="h-4 w-4 mr-2" />Resetar Chat
            </Button>
            {pageUrl && (
              <Button variant="outline" size="sm" onClick={() => window.open(pageUrl, "_blank")}>
                <ExternalLink className="h-4 w-4 mr-2" />Ver Página
              </Button>
            )}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-3xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 flex flex-col items-center">
            <div className="w-full max-w-2xl">
              <div className="mb-4 text-center">
                <h3 className="text-lg font-semibold">Preview do seu Chatbot</h3>
                <p className="text-sm text-muted-foreground">Esse é o chatbot que seus clientes veem na página white-label</p>
              </div>
              <ChatWidget
                key={chatKey}
                companyName={integrator?.company_name || "Minha Empresa"}
                primaryColor={integrator?.primary_color || "#E88A1A"}
                secondaryColor={integrator?.secondary_color || "#2D9B83"}
                logoUrl={integrator?.logo_url || undefined}
                welcomeMessage={integrator?.welcome_message || undefined}
                closingMessage={integrator?.closing_message || undefined}
                kits={chatKits}
                questions={questions}
                embedded
                botName={integrator?.bot_name || "Assistente Solar"}
                integratorId={integratorId || undefined}
              />
            </div>
          </div>

          <div className="space-y-4">
            {pageUrl && (
              <div className="card-solar">
                <div className="flex items-center gap-2 mb-3">
                  <Link2 className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-sm">Seu Link</h3>
                </div>
                <div className="flex gap-2">
                  <input readOnly value={pageUrl} className="flex-1 px-3 py-2 rounded-lg bg-muted text-[10px] font-mono border truncate" />
                  <Button variant="outline" size="sm" onClick={copyLink}><Copy className="h-3.5 w-3.5" /></Button>
                </div>
              </div>
            )}

            <div className="card-solar">
              <h3 className="font-semibold text-sm mb-3">⚡ Ações Rápidas</h3>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start text-xs" onClick={() => window.location.href = "/dashboard/leads"}>
                  <Users className="h-3.5 w-3.5 mr-2" />Ver Leads
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start text-xs" onClick={() => window.location.href = "/dashboard/flows"}>
                  <MessageSquare className="h-3.5 w-3.5 mr-2" />Editar Fluxo
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start text-xs" onClick={() => window.location.href = "/dashboard/settings"}>
                  <TrendingUp className="h-3.5 w-3.5 mr-2" />Configurações
                </Button>
              </div>
            </div>

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
