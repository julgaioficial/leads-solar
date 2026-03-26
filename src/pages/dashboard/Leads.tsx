import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, Download, Eye, Phone, Mail, Flame, Thermometer, Snowflake, X, MessageSquare } from "lucide-react";
import { useState } from "react";

interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  city: string;
  consumption: string;
  consumptionKwh: number;
  billValue: number;
  roofType: string;
  kitSuggested: string;
  kitPrice: number;
  status: "HOT" | "WARM" | "COLD";
  converted: boolean;
  createdAt: string;
  score: number;
  messages: number;
}

const leads: Lead[] = [
  {
    id: 1, name: "João Silva", email: "joao@email.com", phone: "(11) 99999-1234",
    city: "São Paulo", consumption: "450 kWh", consumptionKwh: 450, billValue: 520,
    roofType: "Cerâmica", kitSuggested: "Kit Residencial 5kWp", kitPrice: 26500,
    status: "HOT", converted: false, createdAt: "2024-01-15", score: 92, messages: 8,
  },
  {
    id: 2, name: "Maria Santos", email: "maria@email.com", phone: "(21) 98888-5678",
    city: "Rio de Janeiro", consumption: "320 kWh", consumptionKwh: 320, billValue: 380,
    roofType: "Laje", kitSuggested: "Kit Residencial 3kWp", kitPrice: 18000,
    status: "WARM", converted: false, createdAt: "2024-01-15", score: 75, messages: 5,
  },
  {
    id: 3, name: "Pedro Costa", email: "pedro@email.com", phone: "(31) 97777-9012",
    city: "Belo Horizonte", consumption: "280 kWh", consumptionKwh: 280, billValue: 310,
    roofType: "Fibrocimento", kitSuggested: "Kit Residencial 3kWp", kitPrice: 18000,
    status: "COLD", converted: false, createdAt: "2024-01-14", score: 45, messages: 3,
  },
  {
    id: 4, name: "Ana Oliveira", email: "ana@email.com", phone: "(41) 96666-3456",
    city: "Curitiba", consumption: "520 kWh", consumptionKwh: 520, billValue: 620,
    roofType: "Metálico", kitSuggested: "Kit Residencial 5kWp", kitPrice: 26500,
    status: "HOT", converted: true, createdAt: "2024-01-14", score: 88, messages: 12,
  },
  {
    id: 5, name: "Carlos Lima", email: "carlos@email.com", phone: "(51) 95555-7890",
    city: "Porto Alegre", consumption: "380 kWh", consumptionKwh: 380, billValue: 440,
    roofType: "Cerâmica", kitSuggested: "Kit Residencial 5kWp", kitPrice: 26500,
    status: "WARM", converted: false, createdAt: "2024-01-13", score: 68, messages: 6,
  },
  {
    id: 6, name: "Fernanda Souza", email: "fernanda@email.com", phone: "(85) 94444-1234",
    city: "Fortaleza", consumption: "800 kWh", consumptionKwh: 800, billValue: 950,
    roofType: "Laje", kitSuggested: "Kit Comercial 10kWp", kitPrice: 50000,
    status: "HOT", converted: false, createdAt: "2024-01-13", score: 95, messages: 10,
  },
];

const statusConfig = {
  HOT: { label: "Quente", icon: Flame, color: "bg-destructive/10 text-destructive border-destructive/20" },
  WARM: { label: "Morno", icon: Thermometer, color: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  COLD: { label: "Frio", icon: Snowflake, color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
};

export default function DashboardLeads() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const hotCount = leads.filter((l) => l.status === "HOT").length;
  const warmCount = leads.filter((l) => l.status === "WARM").length;
  const coldCount = leads.filter((l) => l.status === "COLD").length;
  const convertedCount = leads.filter((l) => l.converted).length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Leads</h2>
            <p className="text-muted-foreground">
              Gerencie e filtre seus leads por temperatura
            </p>
          </div>
          <Button variant="outline" onClick={() => window.open('https://www.google.com', '_blank')}>
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <button
            onClick={() => setStatusFilter(statusFilter === "HOT" ? "all" : "HOT")}
            className={`p-4 rounded-xl border transition-all ${statusFilter === "HOT" ? "ring-2 ring-destructive" : ""} bg-destructive/5 border-destructive/10`}
          >
            <div className="flex items-center gap-2">
              <Flame className="h-4 w-4 text-destructive" />
              <p className="text-sm text-muted-foreground">Quentes</p>
            </div>
            <p className="text-2xl font-bold text-destructive">{hotCount}</p>
          </button>
          <button
            onClick={() => setStatusFilter(statusFilter === "WARM" ? "all" : "WARM")}
            className={`p-4 rounded-xl border transition-all ${statusFilter === "WARM" ? "ring-2 ring-amber-500" : ""} bg-amber-500/5 border-amber-500/10`}
          >
            <div className="flex items-center gap-2">
              <Thermometer className="h-4 w-4 text-amber-600" />
              <p className="text-sm text-muted-foreground">Mornos</p>
            </div>
            <p className="text-2xl font-bold text-amber-600">{warmCount}</p>
          </button>
          <button
            onClick={() => setStatusFilter(statusFilter === "COLD" ? "all" : "COLD")}
            className={`p-4 rounded-xl border transition-all ${statusFilter === "COLD" ? "ring-2 ring-blue-500" : ""} bg-blue-500/5 border-blue-500/10`}
          >
            <div className="flex items-center gap-2">
              <Snowflake className="h-4 w-4 text-blue-600" />
              <p className="text-sm text-muted-foreground">Frios</p>
            </div>
            <p className="text-2xl font-bold text-blue-600">{coldCount}</p>
          </button>
          <div className="p-4 rounded-xl bg-secondary/5 border border-secondary/10">
            <p className="text-sm text-muted-foreground">Convertidos</p>
            <p className="text-2xl font-bold text-secondary">{convertedCount}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, email ou cidade..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="HOT">🔥 Quentes</SelectItem>
              <SelectItem value="WARM">🌡️ Mornos</SelectItem>
              <SelectItem value="COLD">❄️ Frios</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="card-solar overflow-hidden p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lead</TableHead>
                <TableHead>Cidade</TableHead>
                <TableHead>Consumo</TableHead>
                <TableHead>Kit Sugerido</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.map((lead) => {
                const StatusIcon = statusConfig[lead.status].icon;
                return (
                  <TableRow
                    key={lead.id}
                    className={`cursor-pointer ${lead.converted ? "bg-secondary/5" : ""}`}
                    onClick={() => setSelectedLead(lead)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-panel flex items-center justify-center text-secondary-foreground font-semibold text-sm">
                          {lead.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">
                            {lead.name}
                            {lead.converted && (
                              <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-secondary/10 text-secondary">
                                ✓ Convertido
                              </span>
                            )}
                          </p>
                          <p className="text-sm text-muted-foreground">{lead.phone}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{lead.city}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{lead.consumption}</p>
                        <p className="text-xs text-muted-foreground">R$ {lead.billValue}/mês</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium">{lead.kitSuggested}</p>
                        <p className="text-xs text-primary font-semibold">
                          R$ {lead.kitPrice.toLocaleString("pt-BR")}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              lead.score >= 80
                                ? "bg-destructive"
                                : lead.score >= 60
                                ? "bg-amber-500"
                                : "bg-blue-500"
                            }`}
                            style={{ width: `${lead.score}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{lead.score}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${statusConfig[lead.status].color}`}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {statusConfig[lead.status].label}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                        <button className="p-2 hover:bg-muted rounded-lg transition-colors" onClick={() => setSelectedLead(lead)}>
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        </button>
                        <a href={`https://wa.me/55${lead.phone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-muted rounded-lg transition-colors">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                        </a>
                        <a href={`mailto:${lead.email}`} className="p-2 hover:bg-muted rounded-lg transition-colors">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                        </a>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Lead Detail Dialog */}
        <Dialog open={!!selectedLead} onOpenChange={(o) => !o && setSelectedLead(null)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Detalhes do Lead</DialogTitle>
            </DialogHeader>
            {selectedLead && (
              <div className="space-y-4 mt-2">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-panel flex items-center justify-center text-secondary-foreground font-bold text-xl">
                    {selectedLead.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{selectedLead.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedLead.city}</p>
                  </div>
                  <span className={`ml-auto inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${statusConfig[selectedLead.status].color}`}>
                    {statusConfig[selectedLead.status].label}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">Telefone</p>
                    <p className="font-medium text-sm">{selectedLead.phone}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="font-medium text-sm">{selectedLead.email}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">Consumo</p>
                    <p className="font-medium text-sm">{selectedLead.consumption}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">Conta de Luz</p>
                    <p className="font-medium text-sm">R$ {selectedLead.billValue}/mês</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">Tipo de Telhado</p>
                    <p className="font-medium text-sm">{selectedLead.roofType}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">Mensagens</p>
                    <p className="font-medium text-sm">{selectedLead.messages} trocadas</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                  <p className="text-xs text-muted-foreground mb-1">Kit Sugerido</p>
                  <p className="font-bold">{selectedLead.kitSuggested}</p>
                  <p className="text-primary font-bold text-lg">
                    R$ {selectedLead.kitPrice.toLocaleString("pt-BR")}
                  </p>
                </div>

                <div className="flex gap-3">
                  <a
                    href={`https://wa.me/55${selectedLead.phone.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button variant="solar" className="w-full">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      WhatsApp
                    </Button>
                  </a>
                  <a href={`mailto:${selectedLead.email}`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </Button>
                  </a>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
