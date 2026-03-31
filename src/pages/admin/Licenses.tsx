import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Key, Plus, Copy, Search, CheckCircle2, XCircle, Clock, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface License {
  id: string;
  license_key: string;
  plan: "basic" | "pro";
  status: "active" | "expired" | "revoked" | "trial";
  assigned_to: string | null;
  created_at: string;
  expires_at: string | null;
}

const statusConfig: Record<string, { color: string; icon: typeof CheckCircle2; label: string }> = {
  active: { color: "bg-secondary/10 text-secondary border-secondary/20", icon: CheckCircle2, label: "Ativa" },
  expired: { color: "bg-muted text-muted-foreground border-muted", icon: Clock, label: "Expirada" },
  revoked: { color: "bg-destructive/10 text-destructive border-destructive/20", icon: XCircle, label: "Revogada" },
  trial: { color: "bg-accent/50 text-accent-foreground border-accent/50", icon: Clock, label: "Trial" },
};

export default function AdminLicenses() {
  const { toast } = useToast();
  const [licenses, setLicenses] = useState<License[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newPlan, setNewPlan] = useState<"basic" | "pro">("pro");
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadLicenses(); }, []);

  const loadLicenses = async () => {
    const { data } = await supabase.from("licenses").select("*").order("created_at", { ascending: false });
    setLicenses((data || []) as License[]);
    setLoading(false);
  };

  const handleGenerate = async () => {
    const { data, error } = await supabase.rpc("generate_license_key");
    if (error) { toast({ title: "Erro ao gerar chave", variant: "destructive" }); return; }

    const key = data as string;
    const expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();

    const { error: insertErr } = await supabase.from("licenses").insert({
      license_key: key,
      plan: newPlan,
      status: "active" as const,
      expires_at: expiresAt,
    });

    if (insertErr) { toast({ title: "Erro ao salvar licença", variant: "destructive" }); return; }

    toast({ title: "Licença gerada! 🔑", description: `Chave: ${key}` });
    setIsDialogOpen(false);
    loadLicenses();
  };

  const handleCopy = (key: string) => {
    navigator.clipboard.writeText(key);
    toast({ title: "Chave copiada!" });
  };

  const handleRevoke = async (id: string) => {
    await supabase.from("licenses").update({ status: "revoked" as const }).eq("id", id);
    toast({ title: "Licença revogada", variant: "destructive" });
    loadLicenses();
  };

  const handleRenew = async (id: string) => {
    const expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
    await supabase.from("licenses").update({ status: "active" as const, expires_at: expiresAt }).eq("id", id);
    toast({ title: "Licença renovada! ✅" });
    loadLicenses();
  };

  const filtered = licenses.filter(l =>
    l.license_key.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Licenças</h2>
            <p className="text-muted-foreground">Gere e gerencie licenças white-label</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="solar"><Plus className="h-4 w-4 mr-2" />Gerar Licença</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Gerar Nova Licença</DialogTitle></DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Plano</Label>
                  <Select value={newPlan} onValueChange={(v) => setNewPlan(v as "basic" | "pro")}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Básico — 100 orçamentos/mês — R$ 69,90</SelectItem>
                      <SelectItem value="pro">Pro — 250 orçamentos/mês — R$ 149,90</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                  <Button variant="solar" className="flex-1" onClick={handleGenerate}>
                    <Key className="h-4 w-4 mr-2" />Gerar Licença
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-secondary/5 border border-secondary/10">
            <p className="text-sm text-muted-foreground">Ativas</p>
            <p className="text-2xl font-bold text-secondary">{licenses.filter(l => l.status === "active").length}</p>
          </div>
          <div className="p-4 rounded-xl bg-accent/50 border border-accent/50">
            <p className="text-sm text-muted-foreground">Trial</p>
            <p className="text-2xl font-bold">{licenses.filter(l => l.status === "trial").length}</p>
          </div>
          <div className="p-4 rounded-xl bg-muted/50 border border-border">
            <p className="text-sm text-muted-foreground">Expiradas</p>
            <p className="text-2xl font-bold text-muted-foreground">{licenses.filter(l => l.status === "expired").length}</p>
          </div>
          <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/10">
            <p className="text-sm text-muted-foreground">Revogadas</p>
            <p className="text-2xl font-bold text-destructive">{licenses.filter(l => l.status === "revoked").length}</p>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar por chave..." className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>

        <div className="card-solar overflow-hidden p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Chave de Licença</TableHead>
                <TableHead>Plano</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Expira em</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((license) => {
                const config = statusConfig[license.status] || statusConfig.trial;
                const StatusIcon = config.icon;
                return (
                  <TableRow key={license.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <code className="text-xs font-mono bg-muted px-2 py-1 rounded">{license.license_key}</code>
                        <button onClick={() => handleCopy(license.license_key)} className="p-1 hover:bg-muted rounded transition-colors">
                          <Copy className="h-3 w-3 text-muted-foreground" />
                        </button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`text-xs font-semibold px-2 py-1 rounded ${license.plan === "pro" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                        {license.plan.toUpperCase()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${config.color}`}>
                        <StatusIcon className="h-3 w-3" />{config.label}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {license.expires_at ? new Date(license.expires_at).toLocaleDateString("pt-BR") : "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        {(license.status === "expired" || license.status === "revoked") && (
                          <button onClick={() => handleRenew(license.id)} className="p-2 hover:bg-muted rounded-lg transition-colors" title="Renovar">
                            <RefreshCw className="h-4 w-4 text-secondary" />
                          </button>
                        )}
                        {license.status === "active" && (
                          <button onClick={() => handleRevoke(license.id)} className="p-2 hover:bg-destructive/10 rounded-lg transition-colors" title="Revogar">
                            <XCircle className="h-4 w-4 text-destructive" />
                          </button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">{loading ? "Carregando..." : "Nenhuma licença encontrada"}</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
}
