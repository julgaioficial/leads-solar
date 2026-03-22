import { useParams } from "react-router-dom";
import { ChatWidget } from "@/components/chatbot/ChatWidget";
import { Sun, Shield, Zap, Phone, Mail, MapPin, CheckCircle, ArrowRight, Star } from "lucide-react";
import { useState, useEffect } from "react";

// Simulated integrator data (would come from DB via slug lookup)
const getIntegratorBySlug = (slug: string) => ({
  slug,
  companyName: "Solar Tech SP",
  tagline: "Energia solar acessível para todos",
  primaryColor: "#E88A1A",
  secondaryColor: "#2D9B83",
  accentColor: "#F5C542",
  logoUrl: "",
  heroTitle: "Descubra quanto você pode economizar com energia solar",
  heroSubtitle: "Faça uma simulação gratuita e receba seu orçamento personalizado em minutos. Sem compromisso!",
  ctaText: "Simular Agora",
  footerText: "© 2024 Solar Tech SP. Todos os direitos reservados.",
  whatsappNumber: "(11) 99999-9999",
  email: "contato@solartech.com",
  address: "São Paulo, SP",
  features: [
    { title: "Economia Real", description: "Reduza até 95% da sua conta de energia elétrica" },
    { title: "Retorno Garantido", description: "Investimento que se paga em 3-5 anos" },
    { title: "25 Anos de Garantia", description: "Painéis com garantia de desempenho de fábrica" },
  ],
  testimonials: [
    { name: "Carlos M.", text: "Minha conta de luz caiu de R$ 850 para R$ 90! Recomendo.", rating: 5 },
    { name: "Ana P.", text: "Atendimento excelente e instalação rápida. Super satisfeita!", rating: 5 },
    { name: "Roberto S.", text: "Melhor investimento que fiz. Energia limpa e economia real.", rating: 5 },
  ],
  active: true,
  botName: "Assistente Solar",
  welcomeMessage: "Olá! 🌞 Sou o assistente da *{empresa}*. Vou te ajudar a descobrir quanto você pode economizar com energia solar!",
  closingMessage: "Perfeito, *{nome}*! 🎉\n\n☀️ Kit recomendado: *{kit_nome}*\n⚡ Potência: *{kit_potencia}*\n🔋 Painéis: *{kit_paineis}* unidades\n💰 Investimento: *R$ {kit_preco}*\n📉 Economia estimada: *R$ {economia}/mês*\n\nEm breve um especialista entrará em contato! 📞",
  kits: [
    { id: 1, name: "Kit Residencial 3kWp", power: "3 kWp", panels: 6, inverter: "Growatt 3000", price: 15000, installPrice: 3000, minConsumption: 200, maxConsumption: 350 },
    { id: 2, name: "Kit Residencial 5kWp", power: "5 kWp", panels: 10, inverter: "Growatt 5000", price: 22000, installPrice: 4500, minConsumption: 350, maxConsumption: 550 },
    { id: 3, name: "Kit Comercial 10kWp", power: "10 kWp", panels: 20, inverter: "Growatt 10000", price: 42000, installPrice: 8000, minConsumption: 550, maxConsumption: 1100 },
  ],
  questions: [
    { id: "q1", order: 1, question: "Olá! 👋 Qual é o seu nome?", type: "text" as const, variable: "nome", required: true, active: true },
    { id: "q2", order: 2, question: "Em qual cidade você está?", type: "text" as const, variable: "cidade", required: true, active: true },
    { id: "q3", order: 3, question: "Qual o valor médio da sua conta de luz? (R$)", type: "number" as const, variable: "valor_conta", required: true, active: true },
    { id: "q4", order: 4, question: "Qual o seu consumo mensal em kWh?", type: "number" as const, variable: "consumo_kwh", required: true, active: true },
    { id: "q5", order: 5, question: "Qual o tipo do seu telhado?", type: "options" as const, options: ["Cerâmica", "Fibrocimento", "Metálico", "Laje", "Solo"], variable: "tipo_telhado", required: true, active: true },
  ],
});

export default function WhiteLabelPage() {
  const { slug } = useParams<{ slug: string }>();
  const [showChat, setShowChat] = useState(false);
  const data = getIntegratorBySlug(slug || "demo");

  const scrollToChat = () => {
    setShowChat(true);
    setTimeout(() => {
      document.getElementById("chatbot-section")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  if (!data.active) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Página não disponível.</p>
      </div>
    );
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
          <button
            onClick={scrollToChat}
            className="px-5 py-2 rounded-full text-white text-sm font-semibold transition-all hover:scale-105 shadow-lg"
            style={{ background: `linear-gradient(135deg, ${data.primaryColor}, ${data.secondaryColor})` }}
          >
            {data.ctaText}
          </button>
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
              <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight">
                {data.heroTitle}
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {data.heroSubtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={scrollToChat}
                  className="px-8 py-4 rounded-xl text-white font-bold text-lg transition-all hover:scale-105 shadow-xl flex items-center justify-center gap-2"
                  style={{ background: `linear-gradient(135deg, ${data.primaryColor}, ${data.secondaryColor})` }}
                >
                  {data.ctaText}
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
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
            {/* Hero right: embedded chat */}
            <div className="hidden lg:block">
              <ChatWidget
                companyName={data.companyName}
                primaryColor={data.primaryColor}
                secondaryColor={data.secondaryColor}
                logoUrl={data.logoUrl}
                welcomeMessage={data.welcomeMessage}
                closingMessage={data.closingMessage}
                questions={data.questions}
                kits={data.kits}
                embedded
                botName={data.botName}
              />
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

      {/* Testimonials */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">O que nossos clientes dizem</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {data.testimonials.map((t, i) => (
              <div key={i} className="bg-card rounded-2xl p-6 border shadow-sm">
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-current" style={{ color: data.accentColor }} />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mb-4">"{t.text}"</p>
                <p className="font-semibold text-sm">{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Chatbot Section (mobile + CTA) */}
      <section id="chatbot-section" className="py-16 bg-muted/30">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-3">
            Faça sua simulação agora
          </h2>
          <p className="text-center text-muted-foreground mb-8">
            Responda algumas perguntas e receba seu orçamento personalizado
          </p>
          <ChatWidget
            companyName={data.companyName}
            primaryColor={data.primaryColor}
            secondaryColor={data.secondaryColor}
            logoUrl={data.logoUrl}
            welcomeMessage={data.welcomeMessage}
            closingMessage={data.closingMessage}
            questions={data.questions}
            kits={data.kits}
            embedded
            botName={data.botName}
          />
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
              {data.whatsappNumber && (
                <a href={`https://wa.me/${data.whatsappNumber.replace(/\D/g, "")}`} className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                  <Phone className="h-4 w-4" />
                  {data.whatsappNumber}
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

      {/* Floating chat for mobile (hides on lg where it's embedded in hero) */}
      <div className="lg:hidden">
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
        />
      </div>
    </div>
  );
}
