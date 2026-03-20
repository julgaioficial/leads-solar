import { AdminLayout } from "@/components/layout/AdminLayout";
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
import { Search, Filter, MoreHorizontal, Eye, Mail, Ban } from "lucide-react";
import { useState } from "react";

const integrators = [
  {
    id: 1,
    company: "Solar Tech SP",
    owner: "João Silva",
    email: "joao@solartech.com",
    plan: "PRO",
    mrr: 149.9,
    status: "ACTIVE",
    leads: 156,
    budgets: "189/250",
    joinedAt: "2024-01-05",
  },
  {
    id: 2,
    company: "Energia Verde RJ",
    owner: "Maria Santos",
    email: "maria@energiaverde.com",
    plan: "BASIC",
    mrr: 69.9,
    status: "TRIAL",
    leads: 45,
    budgets: "45/100",
    joinedAt: "2024-01-12",
  },
  {
    id: 3,
    company: "Sol & Cia MG",
    owner: "Pedro Costa",
    email: "pedro@solecia.com",
    plan: "PRO",
    mrr: 149.9,
    status: "ACTIVE",
    leads: 234,
    budgets: "89/250",
    joinedAt: "2023-12-20",
  },
  {
    id: 4,
    company: "Power Solar PR",
    owner: "Ana Oliveira",
    email: "ana@powersolar.com",
    plan: "BASIC",
    mrr: 69.9,
    status: "PAST_DUE",
    leads: 89,
    budgets: "0/100",
    joinedAt: "2023-11-15",
  },
  {
    id: 5,
    company: "Eco Energy SC",
    owner: "Carlos Lima",
    email: "carlos@ecoenergy.com",
    plan: "PRO",
    mrr: 149.9,
    status: "ACTIVE",
    leads: 178,
    budgets: "134/250",
    joinedAt: "2023-12-01",
  },
];

const statusColors = {
  ACTIVE: "bg-secondary/10 text-secondary border-secondary/20",
  TRIAL: "bg-accent text-accent-foreground border-accent/50",
  PAST_DUE: "bg-destructive/10 text-destructive border-destructive/20",
  CANCELED: "bg-muted text-muted-foreground border-muted",
};

export default function AdminIntegrators() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredIntegrators = integrators.filter(
    (i) =>
      i.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Integradores</h2>
            <p className="text-muted-foreground">
              Gerencie todos os integradores da plataforma
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por empresa, nome ou email..."
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
        <div className="grid grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-secondary/5 border border-secondary/10">
            <p className="text-sm text-muted-foreground">Ativos</p>
            <p className="text-2xl font-bold text-secondary">
              {integrators.filter((i) => i.status === "ACTIVE").length}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-accent/50 border border-accent/50">
            <p className="text-sm text-muted-foreground">Em Trial</p>
            <p className="text-2xl font-bold">
              {integrators.filter((i) => i.status === "TRIAL").length}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/10">
            <p className="text-sm text-muted-foreground">Inadimplentes</p>
            <p className="text-2xl font-bold text-destructive">
              {integrators.filter((i) => i.status === "PAST_DUE").length}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-muted/50 border border-border">
            <p className="text-sm text-muted-foreground">MRR Total</p>
            <p className="text-2xl font-bold">
              R$ {integrators.reduce((acc, i) => acc + (i.status === "ACTIVE" ? i.mrr : 0), 0).toLocaleString("pt-BR")}
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="card-solar overflow-hidden p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empresa</TableHead>
                <TableHead>Plano</TableHead>
                <TableHead>MRR</TableHead>
                <TableHead>Orçamentos</TableHead>
                <TableHead>Leads</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Desde</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredIntegrators.map((integrator) => (
                <TableRow key={integrator.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{integrator.company}</p>
                      <p className="text-sm text-muted-foreground">
                        {integrator.owner}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded ${
                        integrator.plan === "PRO"
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {integrator.plan}
                    </span>
                  </TableCell>
                  <TableCell>R$ {integrator.mrr.toFixed(2).replace('.', ',')}</TableCell>
                  <TableCell>{integrator.credits}</TableCell>
                  <TableCell>{integrator.leads}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium border ${
                        statusColors[integrator.status as keyof typeof statusColors]
                      }`}
                    >
                      {integrator.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {integrator.joinedAt}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      </button>
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                      </button>
                      <button className="p-2 hover:bg-destructive/10 rounded-lg transition-colors">
                        <Ban className="h-4 w-4 text-destructive" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
}