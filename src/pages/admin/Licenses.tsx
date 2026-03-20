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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Key,
  Plus,
  Copy,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface License {
  id: string;
  key: string;
  company: string;
  plan: "BASIC" | "PRO";
  status: "ACTIVE" | "EXPIRED" | "REVOKED" | "PENDING";
  createdAt: string;
  expiresAt: string;
  usedBudgets: number;
  maxBudgets: number;
}

const generateKey = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const segments = Array.from({ length: 4 }, () =>
    Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join("")
  );
  return `LS-${segments.join("-")}`;
};

const initialLicenses: License[] = [
  {
    id: "1",
    key: "LS-A8K3F-9JW2L-MX7QP-4HN6T",
    company: "Solar Tech SP",
    plan: "PRO",
    status: "ACTIVE",
    createdAt: "2024-01-05",
    expiresAt: "2025-01-05",
    usedBudgets: 89,
    maxBudgets: 250,
  },
  {
    id: "2",
    key: "LS-B2R5G-7KL4M-NY8WE-3DP9U",
    company: "Energia Verde RJ",
    plan: "BASIC",
    status: "ACTIVE",
    createdAt: "2024-01-12",
    expiresAt: "2025-01-12",
    usedBudgets: 45,
    maxBudgets: 100,
  },
  {
    id: "3",
    key: "LS-C6T1H-5QX8N-PZ3VK-9BM2J",
    company: "Power Solar PR",
    plan: "BASIC",
    status: "EXPIRED",
    createdAt: "2023-06-15",
    expiresAt: "2024-06-15",
    usedBudgets: 100,
    maxBudgets: 100,
  },
  {
    id: "4",
    key: "LS-D4W7S-1FL6Y-RU9CA-8GK3E",
    company: "",
    plan: "PRO",
    status: "PENDING",
    createdAt: "2024-02-01",
    expiresAt: "2025-02-01",
    usedBudgets: 0,
    maxBudgets: 250,
  },
];

const statusConfig = {
  ACTIVE: { color: "bg-secondary/10 text-secondary border-secondary/20", icon: CheckCircle2, label: "Ativa" },
  EXPIRED: { color: "bg-muted text-muted-foreground border-muted", icon: Clock, label: "Expirada" },
  REVOKED: { color: "bg-destructive/10 text-destructive border-destructive/20", icon: XCircle, label: "Revogada" },
  PENDING: { color: "bg-accent/50 text-accent-foreground border-accent/50", icon: Clock, label: "Pendente" },
};

export default function AdminLicenses() {
  const { toast } = useToast();
  const [licenses, setLicenses] = useState<License[]>(initialLicenses);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newPlan, setNewPlan] = useState<"BASIC" | "PRO">("PRO");
  const [newCompany, setNewCompany] = useState("");

  const filteredLicenses = licenses.filter(
    (l) =>
      l.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleGenerate = () => {
    const newLicense: License = {
      id: `${Date.now()}`,
      key: generateKey(),
      company: newCompany || "",
      plan: newPlan,
      status: newCompany ? "ACTIVE" : "PENDING",
      createdAt: new Date().toISOString().split("T")[0],
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      usedBudgets: 0,
      maxBudgets: newPlan === "PRO" ? 250 : 100,
    };
    setLicenses([newLicense, ...licenses]);
    setIsDialogOpen(false);
    setNewCompany("");
    toast({ title: "Licença gerada! 🔑", description: `Chave: ${newLicense.key}` });
  };

  const handleCopy = (key: string) => {
    navigator.clipboard.writeText(key);
    toast({ title: "Chave copiada!" });
  };

  const handleRevoke = (id: string) => {
    setLicenses(licenses.map((l) => (l.id === id ? { ...l, status: "REVOKED" as const } : l)));
    toast({ title: "Licença revogada", variant: "destructive" });
  };

  const handleRenew = (id: string) => {
    setLicenses(
      licenses.map((l) =>
        l.id === id
          ? {
              ...l,
              status: "ACTIVE" as const,
              expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
              usedBudgets: 0,
            }
          : l
      )
    );
    toast({ title: "Licença renovada! ✅" });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Licenças</h2>
            <p className="text-muted-foreground">
              Gere e gerencie licenças white-label para assinantes
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="solar">
                <Plus className="h-4 w-4 mr-2" />
                Gerar Licença
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Gerar Nova Licença</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Empresa (opcional)</Label>
                  <Input
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    placeholder="Nome da empresa do assinante"
                  />
                  <p className="text-xs text-muted-foreground">
                    Deixe vazio para gerar uma licença pendente
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Plano</Label>
                  <Select value={newPlan} onValueChange={(v) => setNewPlan(v as "BASIC" | "PRO")}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BASIC">Básico — 100 orçamentos/mês — R$ 69,90</SelectItem>
                      <SelectItem value="PRO">Pro — 250 orçamentos/mês — R$ 149,90</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="p-4 rounded-xl bg-muted/50 border border-border">
                  <p className="text-sm text-muted-foreground mb-1">Prévia da chave:</p>
                  <p className="font-mono text-sm font-medium">{generateKey()}</p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button variant="solar" className="flex-1" onClick={handleGenerate}>
                    <Key className="h-4 w-4 mr-2" />
                    Gerar Licença
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-secondary/5 border border-secondary/10">
            <p className="text-sm text-muted-foreground">Ativas</p>
            <p className="text-2xl font-bold text-secondary">
              {licenses.filter((l) => l.status === "ACTIVE").length}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-accent/50 border border-accent/50">
            <p className="text-sm text-muted-foreground">Pendentes</p>
            <p className="text-2xl font-bold">
              {licenses.filter((l) => l.status === "PENDING").length}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-muted/50 border border-border">
            <p className="text-sm text-muted-foreground">Expiradas</p>
            <p className="text-2xl font-bold text-muted-foreground">
              {licenses.filter((l) => l.status === "EXPIRED").length}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/10">
            <p className="text-sm text-muted-foreground">Revogadas</p>
            <p className="text-2xl font-bold text-destructive">
              {licenses.filter((l) => l.status === "REVOKED").length}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por chave ou empresa..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="card-solar overflow-hidden p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Chave de Licença</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Plano</TableHead>
                <TableHead>Orçamentos</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Expira em</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLicenses.map((license) => {
                const StatusIcon = statusConfig[license.status].icon;
                return (
                  <TableRow key={license.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <code className="text-xs font-mono bg-muted px-2 py-1 rounded">
                          {license.key}
                        </code>
                        <button
                          onClick={() => handleCopy(license.key)}
                          className="p-1 hover:bg-muted rounded transition-colors"
                        >
                          <Copy className="h-3 w-3 text-muted-foreground" />
                        </button>
                      </div>
                    </TableCell>
                    <TableCell>
                      {license.company || (
                        <span className="text-muted-foreground italic">Não atribuída</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded ${
                          license.plan === "PRO"
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {license.plan}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {license.usedBudgets}/{license.maxBudgets}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${statusConfig[license.status].color}`}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {statusConfig[license.status].label}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {license.expiresAt}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        {(license.status === "EXPIRED" || license.status === "REVOKED") && (
                          <button
                            onClick={() => handleRenew(license.id)}
                            className="p-2 hover:bg-muted rounded-lg transition-colors"
                            title="Renovar"
                          >
                            <RefreshCw className="h-4 w-4 text-secondary" />
                          </button>
                        )}
                        {license.status === "ACTIVE" && (
                          <button
                            onClick={() => handleRevoke(license.id)}
                            className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                            title="Revogar"
                          >
                            <XCircle className="h-4 w-4 text-destructive" />
                          </button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
}
