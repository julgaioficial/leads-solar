import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { 
  Users, 
  CreditCard, 
  TrendingUp, 
  MessageSquare,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Copy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { buildWhiteLabelUrl } from "@/lib/slug";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

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
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [integrator, setIntegrator] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState(stats);
  const [recentLeadsData, setRecentLeadsData] = useState(recentLeads);

  useEffect(() => {
    const fetchIntegrator = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const { data: integratorData, error: integratorError } = await supabase
          .from('integrators')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (integratorError) {
          console.error('Error fetching integrator:', integratorError);
        } else {
          setIntegrator(integratorData);
        }

        // Fetch real stats from database
        if (integratorData?.id) {
          const integratorId = integratorData.id;
          
          // Fetch leads count for today
          const today = new Date().toISOString().split('T')[0];
          const { data: leadsToday, error: leadsError } = await supabase
            .from('leads')
            .select('*', { count: 'exact' })
            .eq('integrator_id', integratorId)
            .gte('created_at', today);

          if (!leadsError && leadsToday) {
            setStatsData(prev => ({
              ...prev,
              0: { ...prev[0], value: leadsToday.length.toString() }
            }));
          }

          // Fetch conversion rate
          const { data: allLeads, error: allLeadsError } = await supabase
            .from('leads')
            .select('converted')
            .eq('integrator_id', integratorId);

          if (!allLeadsError && allLeads) {
            const convertedCount = allLeads.filter(l => l.converted).length;
            const conversionRate = allLeads.length > 0 
              ? ((convertedCount / allLeads.length) * 100).toFixed(0) 
              : '0';
            setStatsData(prev => ({
              ...prev,
              1: { ...prev[1], value: `${conversionRate}%` }
            }));
          }

          // Fetch remaining budgets
          const { data: transactions, error: transactionsError } = await supabase
            .from('budget_transactions')
            .select('*')
            .eq('integrator_id', integratorId);

          if (!transactionsError && transactions && integratorData.subscription_plan) {
            const maxBudgets = integratorData.subscription_plan === 'PRO' ? 250 : 100;
            const usedBudgets = transactions.length;
            setStatsData(prev => ({
              ...prev,
              2: { ...prev[2], value: `${maxBudgets - usedBudgets}/${maxBudgets}` }
            }));
          }
        }
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchIntegrator();
  }, [user?.id]);

  const handleCopyLink = async () => {
    if (!integrator?.slug) return;

    const link = buildWhiteLabelUrl(integrator.slug);
    try {
      await navigator.clipboard.writeText(link);
      toast({
        title: "Link copiado!",
        description: "O link foi copiado para a área de transferência.",
      });
    } catch (err) {
      console.error('Error copying to clipboard:', err);
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar o link.",
        variant: "destructive",
      });
    }
  };

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
          <Button variant="solar" onClick={() => navigate('/dashboard/kits')}>+ Novo Kit</Button>
        </div>

        {/* White-Label Link Card */}
        {!loading && (
          <Card className="card-solar p-6">
            {integrator && integrator.slug ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Seu Link Exclusivo</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Compartilhe este link com seus clientes para acessar seu site white-label
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 p-3 bg-muted rounded-lg">
                    <a 
                      href={buildWhiteLabelUrl(integrator.slug)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm font-mono break-all text-primary hover:underline"
                    >
                      {buildWhiteLabelUrl(integrator.slug)}
                    </a>
                  </div>
                  <Button
                    variant="solar"
                    size="sm"
                    onClick={handleCopyLink}
                    className="flex items-center gap-2"
                  >
                    <Copy className="h-4 w-4" />
                    Copiar Link
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Complete seu cadastro</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Complete seu cadastro para ativar seu site
                  </p>
                </div>
                <Button
                  variant="solar"
                  onClick={() => navigate('/onboarding/company')}
                >
                  Ir para Onboarding
                </Button>
              </div>
            )}
          </Card>
        )}

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
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/dashboard/leads')}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Ver Todos os Leads
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/dashboard/flows')}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Editar Fluxo de Conversa
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/dashboard/kits')}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Ver Orçamentos
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