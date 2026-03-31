import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Search, Download, Eye, Phone, Mail, Flame, Thermometer, Snowflake, MessageSquare } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface Lead {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  city: string | null;
  consumption_kwh: number | null;
  monthly_bill: number | null;
  roof_type: string | null;
  score: "hot" | "warm" | "cold" | null;
  converted: boolean | null;
  created_at: string;
  answers: Record<string, string> | null;
  recommended_kit_id: string | null;
}

const statusConfig = {
  hot: { label: "Quente", icon: Flame, color: "bg-destructive/10 text-destructive border-destructive/20" },
  warm: { label: "Morno", icon: Thermometer, color: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  cold: { label: "Frio", icon: Snowflake, color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
};

export default function DashboardLeads() {
  const { integratorId } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (integratorId) loadLeads();
  }, [integratorId]);

  const loadLeads = async () => {
    const { data } = await supabase
      .from("leads")
      .select("*")
      .eq("integrator_id", integratorId!)
      .order("created_at", { ascending: false });
    setLeads((data || []) as Lead[]);
    setLoading(false);
  };

  const filtered = leads.filter((lead) => {
    const matchesSearch =
      (lead.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lead.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lead.city || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || lead.score === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const hotCount = leads.filter(l => l.score === "hot").length;
  const warmCount = leads.filter(l => l.score === "warm").length;
  const coldCount = leads.filter(l => l.score === "cold").length;
  const convertedCount = leads.filter(l => l.converted).length;

  const exportCSV = () => {
    const headers = "Nome,Email,Telefone,Cidade,Consumo kWh,Conta Mensal,Score,Data\n";
    const rows = leads.map(l =>
      `"${l.name || ""}","${l.email || ""}","${l.phone || ""}","${l.city || ""}",${l.consumption_kwh || ""},${l.monthly_bill || ""},${l.score || ""},${new Date(l.created_at).toLocaleDateString("pt-BR")}`
    ).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "leads.csv";
    a.click();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Leads</h2>
            <p className="text-muted-foreground">Gerencie e filtre seus leads por temperatura</p>
          </div>
          <Button variant="outline" onClick={exportCSV}><Download className="h-4 w-4 mr-2" />Exportar CSV</Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <button onClick={() => setStatusFilter(statusFilter === "hot" ? "all" : "hot")}
            className={`p-4 rounded-xl border transition-all ${statusFilter === "hot" ? "ring-2 ring-destructive" : ""} bg-destructive/5 border-destructive/10`}>
            <div className="flex items-center gap-2"><Flame className="h-4 w-4 text-destructive" /><p className="text-sm text-muted-foreground">Quentes</p></div>
            <p className="text-2xl font-bold text-destructive">{hotCount}</p>
          </button>
          <button onClick={() => setStatusFilter(statusFilter === "warm" ? "all" : "warm")}
            className={`p-4 rounded-xl border transition-all ${statusFilter === "warm" ? "ring-2 ring-amber-500" : ""} bg-amber-500/5 border-amber-500/10`}>
            <div className="flex items-center gap-2"><Thermometer className="h-4 w-4 text-amber-600" /><p className="text-sm text-muted-foreground">Mornos</p></div>
            <p className="text-2xl font-bold text-amber-600">{warmCount}</p>
          </button>
          <button onClick={() => setStatusFilter(statusFilter === "cold" ? "all" : "cold")}
            className={`p-4 rounded-xl border transition-all ${statusFilter === "cold" ? "ring-2 ring-blue-500" : ""} bg-blue-500/5 border-blue-500/10`}>
            <div className="flex items-center gap-2"><Snowflake className="h-4 w-4 text-blue-600" /><p className="text-sm text-muted-foreground">Frios</p></div>
            <p className="text-2xl font-bold text-blue-600">{coldCount}</p>
          </button>
          <div className="p-4 rounded-xl bg-secondary/5 border border-secondary/10">
            <p className="text-sm text-muted-foreground">Convertidos</p>
            <p className="text-2xl font-bold text-secondary">{convertedCount}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar por nome, email ou cidade..." className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Filtrar status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="hot">🔥 Quentes</SelectItem>
              <SelectItem value="warm">🌡️ Mornos</SelectItem>
              <SelectItem value="cold">❄️ Frios</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="card-solar overflow-hidden p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lead</TableHead>
                <TableHead>Cidade</TableHead>
                <TableHead>Consumo</TableHead>
                <TableHead>Conta</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((lead) => {
                const score = lead.score || "cold";
                const cfg = statusConfig[score];
                const StatusIcon = cfg.icon;
                return (
                  <TableRow key={lead.id} className={`cursor-pointer ${lead.converted ? "bg-secondary/5" : ""}`} onClick={() => setSelectedLead(lead)}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-panel flex items-center justify-center text-secondary-foreground font-semibold text-sm">
                          {(lead.name || "?").charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium">
                            {lead.name || "Sem nome"}
                            {lead.converted && <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-secondary/10 text-secondary">✓ Convertido</span>}
                          </p>
                          <p className="text-sm text-muted-foreground">{lead.phone || lead.email || "-"}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{lead.city || "-"}</TableCell>
                    <TableCell>{lead.consumption_kwh ? `${lead.consumption_kwh} kWh` : "-"}</TableCell>
                    <TableCell>{lead.monthly_bill ? `R$ ${Number(lead.monthly_bill).toLocaleString("pt-BR")}` : "-"}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${cfg.color}`}>
                        <StatusIcon className="h-3 w-3" />{cfg.label}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{new Date(lead.created_at).toLocaleDateString("pt-BR")}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                        <button className="p-2 hover:bg-muted rounded-lg transition-colors" onClick={() => setSelectedLead(lead)}>
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        </button>
                        {lead.phone && (
                          <a href={`https://wa.me/55${lead.phone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-muted rounded-lg transition-colors">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                          </a>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">{loading ? "Carregando..." : "Nenhum lead encontrado"}</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <Dialog open={!!selectedLead} onOpenChange={(o) => !o && setSelectedLead(null)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader><DialogTitle>Detalhes do Lead</DialogTitle></DialogHeader>
            {selectedLead && (
              <div className="space-y-4 mt-2">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-panel flex items-center justify-center text-secondary-foreground font-bold text-xl">
                    {(selectedLead.name || "?").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{selectedLead.name || "Sem nome"}</h3>
                    <p className="text-sm text-muted-foreground">{selectedLead.city || "-"}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {selectedLead.phone && <div className="p-3 rounded-lg bg-muted/50"><p className="text-xs text-muted-foreground">Telefone</p><p className="font-medium text-sm">{selectedLead.phone}</p></div>}
                  {selectedLead.email && <div className="p-3 rounded-lg bg-muted/50"><p className="text-xs text-muted-foreground">Email</p><p className="font-medium text-sm">{selectedLead.email}</p></div>}
                  <div className="p-3 rounded-lg bg-muted/50"><p className="text-xs text-muted-foreground">Consumo</p><p className="font-medium text-sm">{selectedLead.consumption_kwh || "-"} kWh</p></div>
                  <div className="p-3 rounded-lg bg-muted/50"><p className="text-xs text-muted-foreground">Conta</p><p className="font-medium text-sm">R$ {Number(selectedLead.monthly_bill || 0).toLocaleString("pt-BR")}</p></div>
                  {selectedLead.roof_type && <div className="p-3 rounded-lg bg-muted/50"><p className="text-xs text-muted-foreground">Telhado</p><p className="font-medium text-sm">{selectedLead.roof_type}</p></div>}
                </div>
                {selectedLead.answers && Object.keys(selectedLead.answers).length > 0 && (
                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                    <p className="text-xs text-muted-foreground mb-2">Respostas do Chatbot</p>
                    {Object.entries(selectedLead.answers).map(([key, val]) => (
                      <div key={key} className="flex justify-between text-sm py-1">
                        <span className="text-muted-foreground">{key}</span>
                        <span className="font-medium">{val}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex gap-3">
                  {selectedLead.phone && (
                    <a href={`https://wa.me/55${selectedLead.phone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="flex-1">
                      <Button variant="solar" className="w-full"><MessageSquare className="h-4 w-4 mr-2" />WhatsApp</Button>
                    </a>
                  )}
                  {selectedLead.email && (
                    <a href={`mailto:${selectedLead.email}`} className="flex-1">
                      <Button variant="outline" className="w-full"><Mail className="h-4 w-4 mr-2" />Email</Button>
                    </a>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
