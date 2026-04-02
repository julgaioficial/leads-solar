import { AdminLayout } from "@/components/layout/AdminLayout";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { DollarSign, Save, Package } from "lucide-react";

interface Plan {
  id: string;
  name: string;
  price: number;
  budget_limit: number;
  description: string | null;
  active: boolean;
}

export default function AdminPricing() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    const { data } = await supabase
      .from("platform_plans")
      .select("*")
      .order("price", { ascending: true });
    setPlans((data as Plan[]) || []);
    setLoading(false);
  };

  const updatePlan = (id: string, field: keyof Plan, value: string | number | boolean) => {
    setPlans((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const savePlan = async (plan: Plan) => {
    setSaving(plan.id);
    const { error } = await supabase
      .from("platform_plans")
      .update({
        name: plan.name,
        price: plan.price,
        budget_limit: plan.budget_limit,
        description: plan.description,
        active: plan.active,
      })
      .eq("id", plan.id);

    if (error) {
      toast.error("Erro ao salvar: " + error.message);
    } else {
      toast.success(`Plano ${plan.name} atualizado com sucesso!`);
    }
    setSaving(null);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Preços dos Planos</h2>
          <p className="text-muted-foreground">
            Edite os valores e limites de cada plano de assinatura
          </p>
        </div>

        {loading ? (
          <p className="text-muted-foreground">Carregando...</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="card-solar border border-border rounded-xl p-6 space-y-5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${plan.id === "pro" ? "bg-primary/10" : "bg-secondary/10"}`}>
                      <Package className={`h-5 w-5 ${plan.id === "pro" ? "text-primary" : "text-secondary"}`} />
                    </div>
                    <h3 className="text-lg font-bold">{plan.id.toUpperCase()}</h3>
                  </div>
                  <label className="flex items-center gap-2 text-sm text-muted-foreground">
                    Ativo
                    <input
                      type="checkbox"
                      checked={plan.active}
                      onChange={(e) => updatePlan(plan.id, "active", e.target.checked)}
                      className="rounded"
                    />
                  </label>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Nome do Plano</label>
                    <Input
                      value={plan.name}
                      onChange={(e) => updatePlan(plan.id, "name", e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Preço (R$)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        step="0.01"
                        value={plan.price}
                        onChange={(e) => updatePlan(plan.id, "price", parseFloat(e.target.value) || 0)}
                        className="pl-9"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Limite de Orçamentos/mês</label>
                    <Input
                      type="number"
                      value={plan.budget_limit}
                      onChange={(e) => updatePlan(plan.id, "budget_limit", parseInt(e.target.value) || 0)}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Descrição</label>
                    <Input
                      value={plan.description || ""}
                      onChange={(e) => updatePlan(plan.id, "description", e.target.value)}
                    />
                  </div>
                </div>

                <Button
                  onClick={() => savePlan(plan)}
                  disabled={saving === plan.id}
                  className="w-full"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saving === plan.id ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
