import { useParams } from "react-router-dom";
import { ChatWidget } from "@/components/chatbot/ChatWidget";
import { Sun, Shield, Zap, Phone, Mail, CheckCircle, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { CTA } from "@/components/landing/CTA";
import { Footer } from "@/components/landing/Footer";

type ErrorType = 'not_found' | 'inactive' | 'network_error' | null;

interface IntegratorData {
  id: string;
  companyName: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  logoUrl: string;
  heroTitle: string;
  heroSubtitle: string;
  ctaText: string;
  footerText: string;
  phone: string;
  email: string;
  botName: string;
  welcomeMessage: string;
  closingMessage: string;
  features: { title: string; description: string }[];
  testimonials: { name: string; text: string; rating: number }[];
  kits: { id: string; name: string; power: string; panels: number; inverter: string; price: number; installPrice: number; minConsumption: number; maxConsumption: number }[];
  questions: { id: string; order: number; question: string; type: "text" | "number" | "options"; options?: string[]; variable: string; required: boolean; active: boolean }[];
  active: boolean;
}

export default function WhiteLabelPage() {
  const { slug } = useParams<{ slug: string }>();
  const [data, setData] = useState<IntegratorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorType, setErrorType] = useState<ErrorType>(null);

  useEffect(() => {
    if (!slug) return;
    loadIntegrator(slug);
  }, [slug]);

  const loadIntegrator = async (slug: string) => {
    const { data: integrator, error: intErr } = await supabase
      .from("integrators")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (intErr) {
      setErrorType('network_error');
      setLoading(false);
      return;
    }

    if (!integrator) {
      setErrorType('not_found');
      setLoading(false);
      return;
    }

    if (!integrator.active) {
      setErrorType('inactive');
      setLoading(false);
      return;
    }

    // Load kits and questions in parallel
    const [kitsRes, questionsRes] = await Promise.all([
      supabase.from("kits").select("*").eq("integrator_id", integrator.id).eq("active", true).order("min_consumption"),
      supabase.from("flow_questions").select("*").eq("integrator_id", integrator.id).eq("active", true).order("question_order"),
    ]);

    const features = Array.isArray(integrator.features) ? integrator.features as { title: string; description: string }[] : [
      { title: "Economia Real", description: "Reduza até 95% da sua conta de energia elétrica" },
      { title: "Retorno Garantido", description: "Investimento que se paga em 3-5 anos" },
      { title: "25 Anos de Garantia", description: "Painéis com garantia de desempenho de fábrica" },
    ];

    const testimonials = Array.isArray(integrator.testimonials) ? integrator.testimonials as { name: string; text: string; rating: number }[] : [
      { name: "Carlos M.", text: "Minha conta de luz caiu de R$ 850 para R$ 90!", rating: 5 },
      { name: "Ana P.", text: "Atendimento excelente e instalação rápida.", rating: 5 },
      { name: "Roberto S.", text: "Melhor investimento que fiz.", rating: 5 },
    ];

    setData({
      id: integrator.id,
      companyName: integrator.company_name,
      primaryColor: integrator.primary_color || "#E88A1A",
      secondaryColor: integrator.secondary_color || "#2D9B83",
      accentColor: integrator.accent_color || "#F5C542",
      logoUrl: integrator.logo_url || "",
      heroTitle: integrator.hero_title || "Descubra quanto você pode economizar com energia solar",
      heroSubtitle: integrator.hero_subtitle || "Faça uma simulação gratuita e receba seu orçamento personalizado em minutos.",
      ctaText: integrator.cta_text || "Simular Agora",
      footerText: integrator.footer_text || `© ${new Date().getFullYear()} ${integrator.company_name}`,
      phone: integrator.phone || "",
      email: integrator.email || "",
      botName: integrator.bot_name || "Assistente Solar",
      welcomeMessage: integrator.welcome_message || "Olá! 🌞 Vou te ajudar a economizar com energia solar!",
      closingMessage: integrator.closing_message || "Perfeito! Seu orçamento está pronto!",
      features,
      testimonials,
      kits: (kitsRes.data || []).map(k => ({
        id: k.id,
        name: k.name,
        power: k.power,
        panels: k.panels,
        inverter: k.inverter || "",
        price: Number(k.price),
        installPrice: Number(k.install_price) || 0,
        minConsumption: k.min_consumption,
        maxConsumption: k.max_consumption,
      })),
      questions: (questionsRes.data || []).map(q => ({
        id: q.id,
        order: q.question_order,
        question: q.question_text,
        type: q.question_type as "text" | "number" | "options",
        options: q.options ? (Array.isArray(q.options) ? q.options as string[] : JSON.parse(q.options as string)) : undefined,
        variable: q.variable,
        required: q.required ?? true,
        active: q.active ?? true,
      })),
      active: integrator.active ?? true,
    });
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (errorType === 'not_found') {
    // When slug not found, show the default landing page (Index.tsx)
    // Import and render the default landing page components
    return (
      <div className="min-h-screen">
        <Navbar />
        <Hero />
        <Features />
        <HowItWorks />
        <CTA />
        <Footer />
      </div>
    );
  }

  if (errorType === 'inactive') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-muted/50 to-muted/30">
        <div className="max-w-md w-full mx-4 text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Site temporariamente indisponível</h1>
            <p className="text-muted-foreground">
              Este site está temporariamente indisponível. Por favor, entre em contato com o integrador para mais informações.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (errorType === 'network_error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-muted/50 to-muted/30">
        <div className="max-w-md w-full mx-4 text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-orange-600" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Erro ao carregar a página</h1>
            <p className="text-muted-foreground">
              Ocorreu um erro ao carregar a página. Verifique sua conexão e tente novamente.
            </p>
          </div>
          <Button onClick={() => loadIntegrator(slug!)} className="w-full">
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Navbar */}
      <nav className="sticky top-0 z-40 backdrop-blur-md border-b" style={{ backgroundColor: `${data.primaryColor}08`, borderColor: `${data.primaryColor}15` }}>
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {data.logoUrl ? (
              <img src={data.logoUrl} alt={data.companyName} className="h-9 w-auto" />
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${data.primaryColor}, ${data.secondaryColor})` }}>
                  <Sun className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-lg">{data.companyName}</span>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ background: `radial-gradient(circle at 30% 50%, ${data.primaryColor}, transparent 70%)` }} />
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium" style={{ backgroundColor: `${data.primaryColor}10`, color: data.primaryColor }}>
                <Zap className="h-4 w-4" />
                Simulação 100% gratuita
              </div>
              <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight">{data.heroTitle}</h1>
              <p className="text-lg text-muted-foreground leading-relaxed">{data.heroSubtitle}</p>
              <div className="flex items-center gap-6 pt-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4" style={{ color: data.secondaryColor }} />
                  Sem compromisso
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Zap className="h-4 w-4" style={{ color: data.primaryColor }} />
                  Resultado em minutos
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Por que escolher <span style={{ color: data.primaryColor }}>{data.companyName}</span>?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {data.features.map((f, i) => (
              <div key={i} className="bg-card rounded-2xl p-6 border shadow-sm hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: `linear-gradient(135deg, ${data.primaryColor}15, ${data.secondaryColor}15)` }}>
                  <CheckCircle className="h-6 w-6" style={{ color: data.primaryColor }} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {data.logoUrl ? (
                <img src={data.logoUrl} alt="" className="h-8 w-auto" />
              ) : (
                <div className="flex items-center gap-2">
                  <Sun className="h-5 w-5" style={{ color: data.primaryColor }} />
                  <span className="font-bold">{data.companyName}</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              {data.phone && (
                <a href={`https://wa.me/${data.phone.replace(/\D/g, "")}`} className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                  <Phone className="h-4 w-4" />
                  {data.phone}
                </a>
              )}
              {data.email && (
                <a href={`mailto:${data.email}`} className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                  <Mail className="h-4 w-4" />
                  {data.email}
                </a>
              )}
            </div>
          </div>
          <div className="mt-6 text-center text-xs text-muted-foreground">
            {data.footerText}
            <span className="block mt-1 opacity-50">Powered by Leads Solar ⚡</span>
          </div>
        </div>
      </footer>

      {/* Floating chat for all screens */}
      <ChatWidget
        companyName={data.companyName}
        primaryColor={data.primaryColor}
        secondaryColor={data.secondaryColor}
        logoUrl={data.logoUrl}
        welcomeMessage={data.welcomeMessage}
        closingMessage={data.closingMessage}
        questions={data.questions}
        kits={data.kits}
        botName={data.botName}
        integratorId={data.id}
      />
    </div>
  );
}
