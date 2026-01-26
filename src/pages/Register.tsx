import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/layout/Logo";
import { Eye, EyeOff, ArrowRight, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Demo registration - replace with real auth
    setTimeout(() => {
      navigate("/onboarding/welcome");
      toast({
        title: "Conta criada!",
        description: "Vamos configurar sua conta.",
      });
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Decorative */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-secondary to-panel-dark items-center justify-center p-12">
        <div className="max-w-md">
          <h2 className="text-3xl font-bold text-secondary-foreground mb-6">
            Comece seu trial gratuito de 7 dias
          </h2>
          <p className="text-secondary-foreground/80 mb-8">
            Automatize o atendimento do seu negócio solar e converta mais leads
            em vendas.
          </p>

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

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link to="/" className="inline-block mb-8">
            <Logo size="lg" />
          </Link>

          <h1 className="text-3xl font-bold mb-2">Criar conta</h1>
          <p className="text-muted-foreground mb-8">
            Preencha seus dados para começar
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Seu nome"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="(11) 99999-9999"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Nome da Empresa</Label>
              <Input
                id="company"
                name="company"
                placeholder="Sua empresa solar"
                value={formData.company}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Mínimo 8 caracteres"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="solar"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Criando conta..." : "Começar Trial Grátis"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Ao criar uma conta, você concorda com nossos{" "}
            <Link to="/terms" className="underline">
              Termos de Uso
            </Link>{" "}
            e{" "}
            <Link to="/privacy" className="underline">
              Política de Privacidade
            </Link>
            .
          </p>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Já tem uma conta?{" "}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Fazer login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}