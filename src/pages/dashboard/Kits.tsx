import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Sun, Save, Zap } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface Kit {
  id: number;
  name: string;
  power: string;
  panels: number;
  inverter: string;
  price: number;
  installPrice: number;
  minConsumption: number;
  maxConsumption: number;
}

const initialKits: Kit[] = [
  {
    id: 1,
    name: "Kit Residencial 3kWp",
    power: "3 kWp",
    panels: 6,
    inverter: "Growatt 3000",
    price: 15000,
    installPrice: 3000,
    minConsumption: 200,
    maxConsumption: 350,
  },
  {
    id: 2,
    name: "Kit Residencial 5kWp",
    power: "5 kWp",
    panels: 10,
    inverter: "Growatt 5000",
    price: 22000,
    installPrice: 4500,
    minConsumption: 350,
    maxConsumption: 550,
  },
  {
    id: 3,
    name: "Kit Comercial 10kWp",
    power: "10 kWp",
    panels: 20,
    inverter: "Growatt 10000",
    price: 42000,
    installPrice: 8000,
    minConsumption: 550,
    maxConsumption: 1100,
  },
  {
    id: 4,
    name: "Kit Comercial 20kWp",
    power: "20 kWp",
    panels: 40,
    inverter: "Growatt 20000",
    price: 78000,
    installPrice: 15000,
    minConsumption: 1100,
    maxConsumption: 2200,
  },
];

const emptyKit = {
  name: "",
  power: "",
  panels: 0,
  inverter: "",
  price: 0,
  installPrice: 0,
  minConsumption: 0,
  maxConsumption: 0,
};

export default function DashboardKits() {
  const { toast } = useToast();
  const [kits, setKits] = useState<Kit[]>(initialKits);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingKit, setEditingKit] = useState<Kit | null>(null);
  const [formData, setFormData] = useState(emptyKit);

  const handleSave = () => {
    if (!formData.name || !formData.power) {
      toast({ title: "Preencha nome e potência", variant: "destructive" });
      return;
    }

    if (editingKit) {
      setKits(kits.map((k) => (k.id === editingKit.id ? { ...k, ...formData } : k)));
      toast({ title: "Kit atualizado! ✅" });
    } else {
      setKits([...kits, { ...formData, id: Date.now() }]);
      toast({ title: "Kit adicionado! ✅" });
    }

    setFormData(emptyKit);
    setEditingKit(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (kit: Kit) => {
    setEditingKit(kit);
    setFormData({
      name: kit.name,
      power: kit.power,
      panels: kit.panels,
      inverter: kit.inverter,
      price: kit.price,
      installPrice: kit.installPrice,
      minConsumption: kit.minConsumption,
      maxConsumption: kit.maxConsumption,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setKits(kits.filter((k) => k.id !== id));
    toast({ title: "Kit removido" });
  };

  const findKitForConsumption = (kwh: number) => {
    return kits.find((k) => kwh >= k.minConsumption && kwh <= k.maxConsumption);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Kits Fotovoltaicos</h2>
            <p className="text-muted-foreground">
              Gerencie os kits e faixas de consumo para orçamentos automáticos
            </p>
          </div>
          <Dialog
            open={isDialogOpen}
            onOpenChange={(o) => {
              setIsDialogOpen(o);
              if (!o) {
                setEditingKit(null);
                setFormData(emptyKit);
              }
            }}
          >
            <DialogTrigger asChild>
              <Button variant="solar">
                <Plus className="h-4 w-4 mr-2" />
                Novo Kit
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>
                  {editingKit ? "Editar Kit" : "Adicionar Novo Kit"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 space-y-2">
                    <Label>Nome do Kit *</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Kit Residencial 5kWp"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Potência *</Label>
                    <Input
                      value={formData.power}
                      onChange={(e) => setFormData({ ...formData, power: e.target.value })}
                      placeholder="5 kWp"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Nº de Painéis</Label>
                    <Input
                      type="number"
                      value={formData.panels || ""}
                      onChange={(e) => setFormData({ ...formData, panels: parseInt(e.target.value) || 0 })}
                      placeholder="10"
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label>Inversor</Label>
                    <Input
                      value={formData.inverter}
                      onChange={(e) => setFormData({ ...formData, inverter: e.target.value })}
                      placeholder="Growatt 5000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Preço do Kit (R$)</Label>
                    <Input
                      type="number"
                      value={formData.price || ""}
                      onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                      placeholder="22000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Instalação (R$)</Label>
                    <Input
                      type="number"
                      value={formData.installPrice || ""}
                      onChange={(e) => setFormData({ ...formData, installPrice: parseInt(e.target.value) || 0 })}
                      placeholder="4500"
                    />
                  </div>
                </div>

                {/* Consumption Range */}
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="h-4 w-4 text-primary" />
                    <Label className="font-semibold">Faixa de Consumo (kWh/mês)</Label>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    O chatbot sugere este kit quando o consumo do lead estiver nesta faixa
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs">Mínimo (kWh)</Label>
                      <Input
                        type="number"
                        value={formData.minConsumption || ""}
                        onChange={(e) => setFormData({ ...formData, minConsumption: parseInt(e.target.value) || 0 })}
                        placeholder="350"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Máximo (kWh)</Label>
                      <Input
                        type="number"
                        value={formData.maxConsumption || ""}
                        onChange={(e) => setFormData({ ...formData, maxConsumption: parseInt(e.target.value) || 0 })}
                        placeholder="550"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button variant="outline" className="flex-1" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button variant="solar" className="flex-1" onClick={handleSave}>
                    <Save className="h-4 w-4 mr-2" />
                    {editingKit ? "Salvar" : "Adicionar"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Kits Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {kits.map((kit) => (
            <div key={kit.id} className="group card-solar hover:shadow-lg transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-cta">
                  <Sun className="h-6 w-6 text-primary-foreground" />
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                    onClick={() => handleEdit(kit)}
                  >
                    <Edit className="h-4 w-4 text-muted-foreground" />
                  </button>
                  <button
                    className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                    onClick={() => handleDelete(kit.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-semibold mb-2">{kit.name}</h3>

              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Potência</span>
                  <span className="font-medium">{kit.power}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Painéis</span>
                  <span className="font-medium">{kit.panels} unidades</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Inversor</span>
                  <span className="font-medium">{kit.inverter}</span>
                </div>
              </div>

              {/* Consumption Range */}
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/10 mb-4">
                <div className="flex items-center gap-1 mb-1">
                  <Zap className="h-3 w-3 text-primary" />
                  <span className="text-xs font-medium text-primary">Faixa de consumo</span>
                </div>
                <p className="text-sm font-semibold">
                  {kit.minConsumption} - {kit.maxConsumption} kWh/mês
                </p>
              </div>

              <div className="pt-4 border-t border-border">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm text-muted-foreground">Preço Total</span>
                  <span className="text-xl font-bold text-primary">
                    R$ {(kit.price + kit.installPrice).toLocaleString("pt-BR")}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Kit: R$ {kit.price.toLocaleString("pt-BR")} + Instalação: R${" "}
                  {kit.installPrice.toLocaleString("pt-BR")}
                </p>
              </div>
            </div>
          ))}

          {/* Add New Kit Card */}
          <button
            onClick={() => setIsDialogOpen(true)}
            className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 min-h-[320px]"
          >
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <Plus className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="font-medium">Adicionar Novo Kit</p>
            <p className="text-sm text-muted-foreground">
              Configure um novo kit solar com faixa de consumo
            </p>
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
