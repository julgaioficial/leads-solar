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
import { Plus, Edit, Trash2, Package, Sun } from "lucide-react";
import { useState } from "react";

const initialKits = [
  {
    id: 1,
    name: "Kit Residencial 3kWp",
    power: "3 kWp",
    panels: 6,
    inverter: "Growatt 3000",
    price: 15000,
    installPrice: 3000,
  },
  {
    id: 2,
    name: "Kit Residencial 5kWp",
    power: "5 kWp",
    panels: 10,
    inverter: "Growatt 5000",
    price: 22000,
    installPrice: 4500,
  },
  {
    id: 3,
    name: "Kit Comercial 10kWp",
    power: "10 kWp",
    panels: 20,
    inverter: "Growatt 10000",
    price: 42000,
    installPrice: 8000,
  },
  {
    id: 4,
    name: "Kit Comercial 20kWp",
    power: "20 kWp",
    panels: 40,
    inverter: "Growatt 20000",
    price: 78000,
    installPrice: 15000,
  },
];

export default function DashboardKits() {
  const [kits, setKits] = useState(initialKits);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newKit, setNewKit] = useState({
    name: "",
    power: "",
    panels: 0,
    inverter: "",
    price: 0,
    installPrice: 0,
  });

  const handleAddKit = () => {
    if (newKit.name && newKit.power) {
      setKits([...kits, { ...newKit, id: Date.now() }]);
      setNewKit({
        name: "",
        power: "",
        panels: 0,
        inverter: "",
        price: 0,
        installPrice: 0,
      });
      setIsDialogOpen(false);
    }
  };

  const handleDeleteKit = (id: number) => {
    setKits(kits.filter((kit) => kit.id !== id));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Kits Fotovoltaicos</h2>
            <p className="text-muted-foreground">
              Gerencie os kits disponíveis para orçamentos
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="solar">
                <Plus className="h-4 w-4 mr-2" />
                Novo Kit
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Adicionar Novo Kit</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 space-y-2">
                    <Label>Nome do Kit</Label>
                    <Input
                      value={newKit.name}
                      onChange={(e) =>
                        setNewKit({ ...newKit, name: e.target.value })
                      }
                      placeholder="Kit Residencial 5kWp"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Potência</Label>
                    <Input
                      value={newKit.power}
                      onChange={(e) =>
                        setNewKit({ ...newKit, power: e.target.value })
                      }
                      placeholder="5 kWp"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Nº de Painéis</Label>
                    <Input
                      type="number"
                      value={newKit.panels || ""}
                      onChange={(e) =>
                        setNewKit({ ...newKit, panels: parseInt(e.target.value) || 0 })
                      }
                      placeholder="10"
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label>Inversor</Label>
                    <Input
                      value={newKit.inverter}
                      onChange={(e) =>
                        setNewKit({ ...newKit, inverter: e.target.value })
                      }
                      placeholder="Growatt 5000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Preço do Kit (R$)</Label>
                    <Input
                      type="number"
                      value={newKit.price || ""}
                      onChange={(e) =>
                        setNewKit({ ...newKit, price: parseInt(e.target.value) || 0 })
                      }
                      placeholder="22000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Instalação (R$)</Label>
                    <Input
                      type="number"
                      value={newKit.installPrice || ""}
                      onChange={(e) =>
                        setNewKit({
                          ...newKit,
                          installPrice: parseInt(e.target.value) || 0,
                        })
                      }
                      placeholder="4500"
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="solar"
                    className="flex-1"
                    onClick={handleAddKit}
                  >
                    Adicionar Kit
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Kits Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {kits.map((kit) => (
            <div
              key={kit.id}
              className="group card-solar hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-cta">
                  <Sun className="h-6 w-6 text-primary-foreground" />
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                    <Edit className="h-4 w-4 text-muted-foreground" />
                  </button>
                  <button
                    className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                    onClick={() => handleDeleteKit(kit.id)}
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
            className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 min-h-[280px]"
          >
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <Plus className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="font-medium">Adicionar Novo Kit</p>
            <p className="text-sm text-muted-foreground">
              Configure um novo kit solar
            </p>
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}