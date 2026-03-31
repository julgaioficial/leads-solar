import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Sun, Save, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface Kit {
  id: string;
  name: string;
  power: string;
  panels: number;
  inverter: string | null;
  price: number;
  install_price: number | null;
  min_consumption: number;
  max_consumption: number;
}

const emptyForm = { name: "", power: "", panels: 0, inverter: "", price: 0, installPrice: 0, minConsumption: 0, maxConsumption: 0 };

export default function DashboardKits() {
  const { toast } = useToast();
  const { integratorId } = useAuth();
  const [kits, setKits] = useState<Kit[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingKit, setEditingKit] = useState<Kit | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (integratorId) loadKits(); }, [integratorId]);

  const loadKits = async () => {
    const { data } = await supabase.from("kits").select("*").eq("integrator_id", integratorId!).order("min_consumption");
    setKits(data || []);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.power) { toast({ title: "Preencha nome e potência", variant: "destructive" }); return; }

    if (editingKit) {
      await supabase.from("kits").update({
        name: formData.name, power: formData.power, panels: formData.panels,
        inverter: formData.inverter, price: formData.price, install_price: formData.installPrice,
        min_consumption: formData.minConsumption, max_consumption: formData.maxConsumption,
      }).eq("id", editingKit.id);
      toast({ title: "Kit atualizado! ✅" });
    } else {
      await supabase.from("kits").insert({
        integrator_id: integratorId!, name: formData.name, power: formData.power,
        panels: formData.panels, inverter: formData.inverter, price: formData.price,
        install_price: formData.installPrice, min_consumption: formData.minConsumption,
        max_consumption: formData.maxConsumption,
      });
      toast({ title: "Kit adicionado! ✅" });
    }
    setFormData(emptyForm);
    setEditingKit(null);
    setIsDialogOpen(false);
    loadKits();
  };

  const handleEdit = (kit: Kit) => {
    setEditingKit(kit);
    setFormData({
      name: kit.name, power: kit.power, panels: kit.panels,
      inverter: kit.inverter || "", price: Number(kit.price),
      installPrice: Number(kit.install_price) || 0,
      minConsumption: kit.min_consumption, maxConsumption: kit.max_consumption,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    await supabase.from("kits").update({ active: false }).eq("id", id);
    toast({ title: "Kit removido" });
    loadKits();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Kits Fotovoltaicos</h2>
            <p className="text-muted-foreground">Gerencie os kits e faixas de consumo para orçamentos automáticos</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(o) => { setIsDialogOpen(o); if (!o) { setEditingKit(null); setFormData(emptyForm); } }}>
            <DialogTrigger asChild><Button variant="solar"><Plus className="h-4 w-4 mr-2" />Novo Kit</Button></DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader><DialogTitle>{editingKit ? "Editar Kit" : "Adicionar Novo Kit"}</DialogTitle></DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 space-y-2"><Label>Nome do Kit *</Label><Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Kit Residencial 5kWp" /></div>
                  <div className="space-y-2"><Label>Potência *</Label><Input value={formData.power} onChange={(e) => setFormData({ ...formData, power: e.target.value })} placeholder="5 kWp" /></div>
                  <div className="space-y-2"><Label>Nº de Painéis</Label><Input type="number" value={formData.panels || ""} onChange={(e) => setFormData({ ...formData, panels: parseInt(e.target.value) || 0 })} /></div>
                  <div className="col-span-2 space-y-2"><Label>Inversor</Label><Input value={formData.inverter} onChange={(e) => setFormData({ ...formData, inverter: e.target.value })} placeholder="Growatt 5000" /></div>
                  <div className="space-y-2"><Label>Preço do Kit (R$)</Label><Input type="number" value={formData.price || ""} onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })} /></div>
                  <div className="space-y-2"><Label>Instalação (R$)</Label><Input type="number" value={formData.installPrice || ""} onChange={(e) => setFormData({ ...formData, installPrice: parseInt(e.target.value) || 0 })} /></div>
                </div>
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                  <div className="flex items-center gap-2 mb-3"><Zap className="h-4 w-4 text-primary" /><Label className="font-semibold">Faixa de Consumo (kWh/mês)</Label></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label className="text-xs">Mínimo</Label><Input type="number" value={formData.minConsumption || ""} onChange={(e) => setFormData({ ...formData, minConsumption: parseInt(e.target.value) || 0 })} /></div>
                    <div className="space-y-2"><Label className="text-xs">Máximo</Label><Input type="number" value={formData.maxConsumption || ""} onChange={(e) => setFormData({ ...formData, maxConsumption: parseInt(e.target.value) || 0 })} /></div>
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button variant="outline" className="flex-1" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                  <Button variant="solar" className="flex-1" onClick={handleSave}><Save className="h-4 w-4 mr-2" />{editingKit ? "Salvar" : "Adicionar"}</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {kits.map((kit) => (
            <div key={kit.id} className="group card-solar hover:shadow-lg transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-cta"><Sun className="h-6 w-6 text-primary-foreground" /></div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 hover:bg-muted rounded-lg" onClick={() => handleEdit(kit)}><Edit className="h-4 w-4 text-muted-foreground" /></button>
                  <button className="p-2 hover:bg-destructive/10 rounded-lg" onClick={() => handleDelete(kit.id)}><Trash2 className="h-4 w-4 text-destructive" /></button>
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">{kit.name}</h3>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between"><span className="text-muted-foreground">Potência</span><span className="font-medium">{kit.power}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Painéis</span><span className="font-medium">{kit.panels} unidades</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Inversor</span><span className="font-medium">{kit.inverter || "-"}</span></div>
              </div>
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/10 mb-4">
                <div className="flex items-center gap-1 mb-1"><Zap className="h-3 w-3 text-primary" /><span className="text-xs font-medium text-primary">Faixa de consumo</span></div>
                <p className="text-sm font-semibold">{kit.min_consumption} - {kit.max_consumption} kWh/mês</p>
              </div>
              <div className="pt-4 border-t border-border">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm text-muted-foreground">Preço Total</span>
                  <span className="text-xl font-bold text-primary">R$ {(Number(kit.price) + Number(kit.install_price || 0)).toLocaleString("pt-BR")}</span>
                </div>
              </div>
            </div>
          ))}
          <button onClick={() => setIsDialogOpen(true)} className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 min-h-[320px]">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4"><Plus className="h-6 w-6 text-muted-foreground" /></div>
            <p className="font-medium">Adicionar Novo Kit</p>
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
