import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Bot, TrendingUp } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute top-20 right-10 w-72 h-72 bg-solar-orange/10 rounded-full blur-3xl animate-pulse-soft" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-panel-teal/10 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: "1s" }} />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-up">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Automatize seu atendimento solar
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-up stagger-1">
            Pré-Orçamentos{" "}
            <span className="text-gradient-solar">Automáticos</span>
            <br />
            para Integradores Solares
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-up stagger-2">
            Transforme leads do WhatsApp em pré-orçamentos instantâneos. 
            Economize 20+ horas por mês e aumente suas conversões em até 40%.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-fade-up stagger-3">
            <Link to="/register">
              <Button variant="solar" size="xl" className="group">
                Começar 7 Dias Grátis
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button variant="outline" size="xl">
                Ver Demonstração
              </Button>
            </a>
          </div>

          {/* Social Proof */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground animate-fade-up stagger-4">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-solar flex items-center justify-center text-xs font-bold text-primary-foreground border-2 border-background"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <span>+50 integradores</span>
            </div>
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              <span>10.000+ leads atendidos</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-secondary" />
              <span>40% mais conversões</span>
            </div>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="mt-16 max-w-5xl mx-auto animate-fade-up stagger-5">
          <div className="relative rounded-2xl border border-border/50 bg-card shadow-2xl overflow-hidden">
            {/* Browser Header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-muted/50">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                <div className="w-3 h-3 rounded-full bg-accent/60" />
                <div className="w-3 h-3 rounded-full bg-secondary/60" />
              </div>
              <div className="flex-1 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-background/50 text-xs text-muted-foreground">
                  <div className="w-3 h-3 bg-secondary rounded-full" />
                  app.zapsolar.com.br
                </div>
              </div>
            </div>
            
            {/* Dashboard Content Preview */}
            <div className="p-6 bg-gradient-to-b from-background to-muted/30">
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { label: "Leads Hoje", value: "24", trend: "+12%" },
                  { label: "Taxa Conversão", value: "38%", trend: "+5%" },
                  { label: "Créditos", value: "47/60", trend: "" },
                ].map((stat, i) => (
                  <div key={i} className="stat-card">
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold">{stat.value}</span>
                      {stat.trend && (
                        <span className="text-xs text-secondary">{stat.trend}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-32 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/10" />
                <div className="h-32 rounded-xl bg-gradient-to-br from-secondary/5 to-secondary/10 border border-secondary/10" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
