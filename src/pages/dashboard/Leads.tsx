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
import { Search, Filter, Download, Eye, Phone, Mail } from "lucide-react";
import { useState } from "react";

const leads = [
  {
    id: 1,
    name: "João Silva",
    email: "joao@email.com",
    phone: "(11) 99999-1234",
    city: "São Paulo",
    consumption: "450 kWh",
    status: "HOT",
    createdAt: "2024-01-15",
    score: 92,
  },
  {
    id: 2,
    name: "Maria Santos",
    email: "maria@email.com",
    phone: "(21) 98888-5678",
    city: "Rio de Janeiro",
    consumption: "320 kWh",
    status: "WARM",
    createdAt: "2024-01-15",
    score: 75,
  },
  {
    id: 3,
    name: "Pedro Costa",
    email: "pedro@email.com",
    phone: "(31) 97777-9012",
    city: "Belo Horizonte",
    consumption: "280 kWh",
    status: "COLD",
    createdAt: "2024-01-14",
    score: 45,
  },
  {
    id: 4,
    name: "Ana Oliveira",
    email: "ana@email.com",
    phone: "(41) 96666-3456",
    city: "Curitiba",
    consumption: "520 kWh",
    status: "HOT",
    createdAt: "2024-01-14",
    score: 88,
  },
  {
    id: 5,
    name: "Carlos Lima",
    email: "carlos@email.com",
    phone: "(51) 95555-7890",
    city: "Porto Alegre",
    consumption: "380 kWh",
    status: "WARM",
    createdAt: "2024-01-13",
    score: 68,
  },
];

const statusColors = {
  HOT: "bg-destructive/10 text-destructive border-destructive/20",
  WARM: "bg-accent text-accent-foreground border-accent/50",
  COLD: "bg-secondary/10 text-secondary border-secondary/20",
};

export default function DashboardLeads() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLeads = leads.filter(
    (lead) =>
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Leads</h2>
            <p className="text-muted-foreground">
              Gerencie todos os seus leads em um só lugar
            </p>
          </div>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
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
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/10">
            <p className="text-sm text-muted-foreground">HOT</p>
            <p className="text-2xl font-bold text-destructive">
              {leads.filter((l) => l.status === "HOT").length}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-accent/50 border border-accent/50">
            <p className="text-sm text-muted-foreground">WARM</p>
            <p className="text-2xl font-bold">
              {leads.filter((l) => l.status === "WARM").length}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-secondary/5 border border-secondary/10">
            <p className="text-sm text-muted-foreground">COLD</p>
            <p className="text-2xl font-bold text-secondary">
              {leads.filter((l) => l.status === "COLD").length}
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="card-solar overflow-hidden p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lead</TableHead>
                <TableHead>Cidade</TableHead>
                <TableHead>Consumo</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-panel flex items-center justify-center text-secondary-foreground font-semibold text-sm">
                        {lead.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{lead.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {lead.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{lead.city}</TableCell>
                  <TableCell>{lead.consumption}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            lead.score >= 80
                              ? "bg-destructive"
                              : lead.score >= 60
                              ? "bg-accent"
                              : "bg-secondary"
                          }`}
                          style={{ width: `${lead.score}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{lead.score}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium border ${
                        statusColors[lead.status as keyof typeof statusColors]
                      }`}
                    >
                      {lead.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {lead.createdAt}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      </button>
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                      </button>
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
}