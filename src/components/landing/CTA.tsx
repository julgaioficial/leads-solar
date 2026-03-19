import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function CTA() {
  return (
    <section className="py-24 bg-gradient-to-br from-foreground to-foreground/95">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 mb-8">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Oferta de Lançamento
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-background mb-6">
            Pronto para automatizar
            <br />
            seu atendimento solar?
          </h2>

          <p className="text-lg text-background/70 mb-8 max-w-2xl mx-auto">
            Junte-se a +50 integradores que já economizam 20+ horas por mês
            com o Leads Solar. Comece seu trial de 7 dias grátis hoje.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register">
              <Button variant="solar" size="xl" className="group">
                Começar Grátis Agora
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer">
              <Button variant="glass" size="xl">
                Falar com Vendas
              </Button>
            </a>
          </div>

          <p className="mt-6 text-sm text-background/50">
            ✓ 7 dias grátis • ✓ Sem cartão de crédito • ✓ Cancele quando quiser
          </p>
        </div>
      </div>
    </section>
  );
}
