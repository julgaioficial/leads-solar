import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Search, Eye, Ban, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";

interface Integrator {
  id: string;
  company_name: string;
  email: string | null;
  phone: string | null;
  slug: string;
  subscription_plan: string | null;
  subscription_status: string | null;
  budgets_used: number | null;
  monthly_budget_limit: number | null;
  active: boolean | null;
  created_at: string;
  trial_ends_at: string | null;
}

const statusColors: Record<string, string> = {
  active: "bg-secondary/10 text-secondary border-secondary/20",
  trial: "bg-accent text-accent-foreground border-accent/50",
  past_due: "bg-destructive/10 text-destructive border-destructive/20",
  canceled: "bg-muted text-muted-foreground border-muted",
  expired: "bg-muted text-muted-foreground border-muted",
};

export default function AdminIntegrators() {
  const { toast } = useToast();
  const [integrators, setIntegrators] = useState<Integrator[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Integrator | null>(null);
  const [leadCounts, setLeadCounts] = useState<Record<string, number>>({});

  useEffect(() => { loadIntegrators(); }, []);

  const loadIntegrators = async () => {
    const { data } = await supabase
      .from("integrators")
      .select("id, company_name, email, phone, slug, subscription_plan, subscription_status, budgets_used, monthly_budget_limit, active, created_at, trial_ends_at")
      .order("created_at", { ascending: false });
    setIntegrators(data || []);
    setLoading(false);

    // Load lead counts
    if (data && data.length > 0) {
      const { data: leads } = await supabase.from("leads").select("integrator_id");
      const counts: Record<string, number> = {};
      (leads || []).forEach(l => { counts[l.integrator_id] = (counts[l.integrator_id] || 0) + 1; });
      setLeadCounts(counts);
    }
  };

  const toggleActive = async (integrator: Integrator) => {
    const newActive = !integrator.active;
    await supabase.from("integrators").update({ active: newActive }).eq("id", integrator.id);
    setIntegrators(prev => prev.map(i => i.id === integrator.id ? { ...i, active: newActive } : i));
    toast({ title: newActive ? "Integrador ativado ✅" : "Integrador desativado" });
  };

  const filtered = integrators.filter(i =>
    i.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (i.email || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCount = integrators.filter(i => i.subscription_status === "active").length;
  const trialCount = integrators.filter(i => i.subscription_status === "trial").length;
  const pastDueCount = integrators.filter(i => i.subscription_status === "past_due").length;
  const mrr = integrators.reduce((acc, i) => {
    if (i.subscription_status !== "active") return acc;
    return acc + (i.subscription_plan === "pro" ? 149.90 : 69.90);
  }, 0);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Integradores</h2>
          <p className="text-muted-foreground">Gerencie todos os integradores da plataforma</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-secondary/5 border border-secondary/10">
            <p className="text-sm text-muted-foreground">Ativos</p>
            <p className="text-2xl font-bold text-secondary">{activeCount}</p>
          </div>
          <div className="p-4 rounded-xl bg-accent/50 border border-accent/50">
            <p className="text-sm text-muted-foreground">Em Trial</p>
            <p className="text-2xl font-bold">{trialCount}</p>
          </div>
          <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/10">
            <p className="text-sm text-muted-foreground">Inadimplentes</p>
            <p className="text-2xl font-bold text-destructive">{pastDueCount}</p>
          </div>
          <div className="p-4 rounded-xl bg-muted/50 border border-border">
            <p className="text-sm text-muted-foreground">MRR Total</p>
            <p className="text-2xl font-bold">R$ {mrr.toFixed(2).replace(".", ",")}</p>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar por empresa ou email..." className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>

        <div className="card-solar overflow-hidden p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empresa</TableHead>
                <TableHead>Plano</TableHead>
                <TableHead>Orçamentos</TableHead>
                <TableHead>Leads</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Desde</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((i) => (
                <TableRow key={i.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{i.company_name}</p>
                      <p className="text-sm text-muted-foreground">{i.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${i.subscription_plan === "pro" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                      {(i.subscription_plan || "basic").toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell>{i.budgets_used || 0}/{i.monthly_budget_limit || 100}</TableCell>
                  <TableCell>{leadCounts[i.id] || 0}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusColors[i.subscription_status || "trial"] || statusColors.trial}`}>
                      {(i.subscription_status || "trial").toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">{new Date(i.created_at).toLocaleDateString("pt-BR")}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors" onClick={() => setSelected(i)}>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      </button>
                      <button className="p-2 hover:bg-destructive/10 rounded-lg transition-colors" onClick={() => toggleActive(i)}>
                        {i.active ? <Ban className="h-4 w-4 text-destructive" /> : <CheckCircle className="h-4 w-4 text-secondary" />}
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">{loading ? "Carregando..." : "Nenhum integrador encontrado"}</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
          <DialogContent>
            <DialogHeader><DialogTitle>Detalhes do Integrador</DialogTitle></DialogHeader>
            {selected && (
              <div className="space-y-4 mt-2">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">Empresa</p>
                    <p className="font-medium">{selected.company_name}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">Slug</p>
                    <p className="font-mono text-sm">/s/{selected.slug}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="font-medium text-sm">{selected.email || "-"}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">Telefone</p>
                    <p className="font-medium text-sm">{selected.phone || "-"}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">Plano</p>
                    <p className="font-medium">{(selected.subscription_plan || "basic").toUpperCase()}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">Leads</p>
                    <p className="font-medium">{leadCounts[selected.id] || 0}</p>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
