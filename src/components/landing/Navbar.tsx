import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/Logo";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Logo size="md" />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Funcionalidades
            </a>
            <a href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Planos
            </a>
            <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Como Funciona
            </a>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Entrar
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="solar" size="sm">
                Começar Grátis
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border/50 animate-fade-in">
            <div className="flex flex-col gap-4">
              <a 
                href="#features" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Funcionalidades
              </a>
              <a 
                href="#pricing" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Planos
              </a>
              <a 
                href="#how-it-works" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Como Funciona
              </a>
              <div className="flex flex-col gap-2 pt-4 border-t border-border/50">
                <Link to="/login" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Entrar
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setIsOpen(false)}>
                  <Button variant="solar" className="w-full">
                    Começar Grátis
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
