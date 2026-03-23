import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/layout/Logo";
import { Eye, EyeOff, ArrowRight, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const benefits = [
  "7 dias grátis para testar",
  "Sem cartão de crédito",
  "Cancele quando quiser",
  "Suporte completo",
];

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const generateSlug = (company: string) => {
    return company
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // 1. Sign up
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: { full_name: formData.name },
        emailRedirectTo: window.location.origin,
      },
    });

    if (authError || !authData.user) {
      toast({ title: "Erro ao criar conta", description: authError?.message || "Tente novamente.", variant: "destructive" });
      setIsLoading(false);
      return;
    }

    const userId = authData.user.id;
    const slug = generateSlug(formData.company) + "-" + Math.random().toString(36).slice(2, 6);

    // 2. Create integrator role
    await supabase.from("user_roles").insert({ user_id: userId, role: "integrator" as const });

    // 3. Create integrator record
    await supabase.from("integrators").insert({
      user_id: userId,
      company_name: formData.company,
      slug,
      email: formData.email,
      phone: formData.phone,
      subscription_status: "trial",
      subscription_plan: "basic",
      monthly_budget_limit: 100,
    });

    // 4. Create default flow questions
    const { data: integratorData } = await supabase
      .from("integrators")
      .select("id")
      .eq("user_id", userId)
      .single();

    if (integratorData) {
      const defaultQuestions = [
        { integrator_id: integratorData.id, question_order: 1, question_text: "Olá! 👋 Qual é o seu nome?", question_type: "text", variable: "nome", required: true, active: true },
        { integrator_id: integratorData.id, question_order: 2, question_text: "Em qual cidade você está?", question_type: "text", variable: "cidade", required: true, active: true },
        { integrator_id: integratorData.id, question_order: 3, question_text: "Qual o valor médio da sua conta de luz? (R$)", question_type: "number", variable: "valor_conta", required: true, active: true },
        { integrator_id: integratorData.id, question_order: 4, question_text: "Qual o seu consumo mensal em kWh?", question_type: "number", variable: "consumo_kwh", required: true, active: true },
        { integrator_id: integratorData.id, question_order: 5, question_text: "Qual o tipo do seu telhado?", question_type: "options", options: JSON.stringify(["Cerâmica", "Fibrocimento", "Metálico", "Laje", "Solo"]), variable: "tipo_telhado", required: true, active: true },
      ];
      await supabase.from("flow_questions").insert(defaultQuestions);

      // Default kits
      const defaultKits = [
        { integrator_id: integratorData.id, name: "Kit Residencial 3kWp", power: "3 kWp", panels: 6, inverter: "Growatt 3000", price: 15000, install_price: 3000, min_consumption: 200, max_consumption: 350 },
        { integrator_id: integratorData.id, name: "Kit Residencial 5kWp", power: "5 kWp", panels: 10, inverter: "Growatt 5000", price: 22000, install_price: 4500, min_consumption: 350, max_consumption: 550 },
        { integrator_id: integratorData.id, name: "Kit Comercial 10kWp", power: "10 kWp", panels: 20, inverter: "Growatt 10000", price: 42000, install_price: 8000, min_consumption: 550, max_consumption: 1100 },
      ];
      await supabase.from("kits").insert(defaultKits);
    }

    toast({ title: "Conta criada!", description: "Vamos configurar sua conta." });
    navigate("/onboarding/welcome");
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-secondary to-panel-dark items-center justify-center p-12">
        <div className="max-w-md">
          <h2 className="text-3xl font-bold text-secondary-foreground mb-6">Comece seu trial gratuito de 7 dias</h2>
          <p className="text-secondary-foreground/80 mb-8">Automatize o atendimento do seu negócio solar e converta mais leads em vendas.</p>
          <ul className="space-y-4">
            {benefits.map((benefit, i) => (
              <li key={i} className="flex items-center gap-3 text-secondary-foreground">
                <div className="w-6 h-6 rounded-full bg-secondary-foreground/20 flex items-center justify-center">
                  <Check className="h-4 w-4" />
                </div>
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link to="/" className="inline-block mb-8">
            <Logo size="lg" />
          </Link>

          <h1 className="text-3xl font-bold mb-2">Criar conta</h1>
          <p className="text-muted-foreground mb-8">Preencha seus dados para começar</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input id="name" name="name" placeholder="Seu nome" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input id="phone" name="phone" type="tel" placeholder="(11) 99999-9999" value={formData.phone} onChange={handleChange} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Nome da Empresa</Label>
              <Input id="company" name="company" placeholder="Sua empresa solar" value={formData.company} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="seu@email.com" value={formData.email} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input id="password" name="password" type={showPassword ? "text" : "password"} placeholder="Mínimo 8 caracteres" value={formData.password} onChange={handleChange} required minLength={8} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" variant="solar" size="lg" className="w-full" disabled={isLoading}>
              {isLoading ? "Criando conta..." : "Começar Trial Grátis"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Ao criar uma conta, você concorda com nossos <Link to="/terms" className="underline">Termos de Uso</Link> e <Link to="/privacy" className="underline">Política de Privacidade</Link>.
          </p>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Já tem uma conta? <Link to="/login" className="text-primary hover:underline font-medium">Fazer login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
