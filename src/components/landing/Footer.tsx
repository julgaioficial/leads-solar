import { Logo } from "@/components/layout/Logo";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-foreground text-background/80 py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <div className="mb-4">
              <Logo size="lg" />
            </div>
            <p className="text-background/60 max-w-md">
              Automatize o atendimento do seu negócio de energia solar.
              Pré-orçamentos instantâneos via WhatsApp.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-background mb-4">Produto</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#features" className="hover:text-primary transition-colors">
                  Funcionalidades
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-primary transition-colors">
                  Planos
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-primary transition-colors">
                  Como Funciona
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-background mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/privacy" className="hover:text-primary transition-colors">
                  Privacidade
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-primary transition-colors">
                  Termos de Uso
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-background/10 text-center text-sm text-background/50">
          <p>© {new Date().getFullYear()} Leads Solar. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
