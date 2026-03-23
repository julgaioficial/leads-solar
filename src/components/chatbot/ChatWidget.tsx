import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

interface Kit {
  id: string | number;
  name: string;
  power: string;
  panels: number;
  inverter: string;
  price: number;
  installPrice: number;
  minConsumption: number;
  maxConsumption: number;
}

interface FlowQuestion {
  id: string;
  order: number;
  question: string;
  type: "text" | "number" | "options" | "location";
  options?: string[];
  variable: string;
  required: boolean;
  active: boolean;
}

interface ChatMessage {
  id: string;
  text: string;
  sender: "bot" | "user";
  timestamp: Date;
  options?: string[];
}

interface ChatWidgetProps {
  companyName?: string;
  primaryColor?: string;
  secondaryColor?: string;
  logoUrl?: string;
  welcomeMessage?: string;
  closingMessage?: string;
  questions?: FlowQuestion[];
  kits?: Kit[];
  embedded?: boolean;
  botName?: string;
  botAvatar?: string;
  integratorId?: string;
}

const defaultQuestions: FlowQuestion[] = [
  { id: "q1", order: 1, question: "Olá! 👋 Qual é o seu nome?", type: "text", variable: "nome", required: true, active: true },
  { id: "q2", order: 2, question: "Em qual cidade você está?", type: "text", variable: "cidade", required: true, active: true },
  { id: "q3", order: 3, question: "Qual o valor médio da sua conta de luz? (R$)", type: "number", variable: "valor_conta", required: true, active: true },
  { id: "q4", order: 4, question: "Qual o seu consumo mensal em kWh?", type: "number", variable: "consumo_kwh", required: true, active: true },
  { id: "q5", order: 5, question: "Qual o tipo do seu telhado?", type: "options", options: ["Cerâmica", "Fibrocimento", "Metálico", "Laje", "Solo"], variable: "tipo_telhado", required: true, active: true },
];

const defaultKits: Kit[] = [
  { id: 1, name: "Kit Residencial 3kWp", power: "3 kWp", panels: 6, inverter: "Growatt 3000", price: 15000, installPrice: 3000, minConsumption: 200, maxConsumption: 350 },
  { id: 2, name: "Kit Residencial 5kWp", power: "5 kWp", panels: 10, inverter: "Growatt 5000", price: 22000, installPrice: 4500, minConsumption: 350, maxConsumption: 550 },
  { id: 3, name: "Kit Comercial 10kWp", power: "10 kWp", panels: 20, inverter: "Growatt 10000", price: 42000, installPrice: 8000, minConsumption: 550, maxConsumption: 1100 },
];

export function ChatWidget({
  companyName = "Solar Tech",
  primaryColor = "#E88A1A",
  secondaryColor = "#2D9B83",
  logoUrl,
  welcomeMessage = "Olá! 🌞 Sou o assistente da *{empresa}*. Vou te ajudar a descobrir quanto você pode economizar com energia solar!",
  closingMessage = "Perfeito, *{nome}*! 🎉\n\n☀️ Kit recomendado: *{kit_nome}*\n⚡ Potência: *{kit_potencia}*\n🔋 Painéis: *{kit_paineis}* unidades\n💰 Investimento: *R$ {kit_preco}*\n📉 Economia estimada: *R$ {economia}/mês*\n\nEm breve um especialista entrará em contato! 📞",
  questions = defaultQuestions,
  kits = defaultKits,
  embedded = false,
  botName = "Assistente Solar",
  integratorId,
}: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(embedded);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [conversationDone, setConversationDone] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeQuestions = questions.filter((q) => q.active).sort((a, b) => a.order - b.order);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      startConversation();
    }
  }, [isOpen]);

  const startConversation = () => {
    const welcome = welcomeMessage.replace("{empresa}", companyName);
    addBotMessage(formatBold(welcome));
    setTimeout(() => {
      if (activeQuestions.length > 0) askQuestion(0);
    }, 1000);
  };

  const formatBold = (text: string) => text.replace(/\*(.*?)\*/g, "<strong>$1</strong>").replace(/\n/g, "<br/>");

  const addBotMessage = (text: string, options?: string[]) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, { id: `bot-${Date.now()}`, text, sender: "bot", timestamp: new Date(), options }]);
      setIsTyping(false);
    }, 800 + Math.random() * 600);
  };

  const askQuestion = (stepIndex: number) => {
    if (stepIndex >= activeQuestions.length) {
      generateBudget();
      return;
    }
    setCurrentStep(stepIndex);
    const q = activeQuestions[stepIndex];
    addBotMessage(q.question, q.type === "options" ? q.options : undefined);
  };

  const findKit = (consumption: number): Kit | undefined => kits.find((k) => consumption >= k.minConsumption && consumption <= k.maxConsumption);

  const saveLead = async (allAnswers: Record<string, string>, kit: Kit | undefined) => {
    if (!integratorId) return;

    const consumption = parseInt(allAnswers["consumo_kwh"] || allAnswers["valor_conta"] || "0");
    const monthlyBill = parseFloat(allAnswers["valor_conta"] || "0");
    
    // Determine score
    let score: "hot" | "warm" | "cold" = "cold";
    if (consumption > 500 || monthlyBill > 500) score = "hot";
    else if (consumption > 200 || monthlyBill > 200) score = "warm";

    const { data: lead } = await supabase.from("leads").insert({
      integrator_id: integratorId,
      name: allAnswers["nome"] || null,
      city: allAnswers["cidade"] || null,
      monthly_bill: monthlyBill || null,
      consumption_kwh: parseInt(allAnswers["consumo_kwh"] || "0") || null,
      roof_type: allAnswers["tipo_telhado"] || null,
      recommended_kit_id: typeof kit?.id === "string" ? kit.id : null,
      score,
      answers: allAnswers,
    }).select("id").single();

    // Save conversation
    if (lead) {
      await supabase.from("conversations").insert([{
        lead_id: lead.id,
        integrator_id: integratorId,
        messages: messages.map(m => ({ text: m.text, sender: m.sender, timestamp: m.timestamp })) as unknown as import("@/integrations/supabase/types").Json,
        completed: true,
      }]);

      await supabase.from("budget_transactions").insert([{
        integrator_id: integratorId,
        lead_id: lead.id,
        type: "BUDGET_USED",
        description: `Pré-orçamento para ${allAnswers["nome"] || "lead"}`,
      }]);
    }
  };

  const generateBudget = () => {
    setConversationDone(true);
    const consumption = parseInt(answers["consumo_kwh"] || answers["valor_conta"] || "0");
    const kit = findKit(consumption) || kits[0];
    const economia = Math.round((kit?.price || 0) / 60);

    let msg = closingMessage
      .replace("{nome}", answers["nome"] || "cliente")
      .replace("{consumo_kwh}", answers["consumo_kwh"] || consumption.toString())
      .replace("{kit_nome}", kit?.name || "Kit Solar")
      .replace("{kit_potencia}", kit?.power || "")
      .replace("{kit_paineis}", kit?.panels?.toString() || "")
      .replace("{kit_preco}", ((kit?.price || 0) + (kit?.installPrice || 0)).toLocaleString("pt-BR"))
      .replace("{economia}", economia.toLocaleString("pt-BR"));

    addBotMessage(formatBold(msg));

    // Save lead to database
    saveLead(answers, kit);
  };

  const handleSend = (text?: string) => {
    const value = text || input.trim();
    if (!value || conversationDone) return;

    setMessages((prev) => [...prev, { id: `user-${Date.now()}`, text: value, sender: "user", timestamp: new Date() }]);
    setInput("");

    if (currentStep >= 0 && currentStep < activeQuestions.length) {
      const q = activeQuestions[currentStep];
      const newAnswers = { ...answers, [q.variable]: value };
      setAnswers(newAnswers);
      setTimeout(() => askQuestion(currentStep + 1), 300);
    }
  };

  const handleReset = () => {
    setMessages([]);
    setCurrentStep(-1);
    setAnswers({});
    setConversationDone(false);
    setTimeout(() => startConversation(), 100);
  };

  const currentQuestion = currentStep >= 0 && currentStep < activeQuestions.length ? activeQuestions[currentStep] : null;

  if (!embedded && !isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 animate-pulse-glow"
        style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
      >
        <MessageCircle className="h-7 w-7 text-white" />
      </button>
    );
  }

  return (
    <div className={cn(
      "flex flex-col bg-background overflow-hidden",
      embedded ? "w-full h-[600px] rounded-2xl border shadow-xl" : "fixed bottom-6 right-6 z-50 w-[400px] h-[600px] rounded-2xl shadow-2xl border animate-slide-up"
    )}>
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 text-white relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-white/20" />
          <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-white/10" />
        </div>
        <div className="relative">
          {logoUrl ? (
            <img src={logoUrl} alt="" className="w-10 h-10 rounded-full object-cover border-2 border-white/30" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <Bot className="h-5 w-5" />
            </div>
          )}
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
        </div>
        <div className="flex-1 relative">
          <p className="font-semibold text-sm">{botName}</p>
          <p className="text-xs text-white/80">{companyName} • Online</p>
        </div>
        <div className="flex items-center gap-1 relative">
          <button onClick={handleReset} className="p-2 rounded-lg hover:bg-white/10 transition-colors text-xs" title="Reiniciar conversa">↻</button>
          {!embedded && (
            <button onClick={() => setIsOpen(false)} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin bg-gradient-to-b from-muted/30 to-background">
        {messages.map((msg) => (
          <div key={msg.id} className={cn("flex gap-2", msg.sender === "user" ? "justify-end" : "justify-start")}>
            {msg.sender === "bot" && (
              <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center mt-1" style={{ backgroundColor: `${primaryColor}15` }}>
                <Sparkles className="h-3.5 w-3.5" style={{ color: primaryColor }} />
              </div>
            )}
            <div className="flex flex-col gap-1 max-w-[78%]">
              <div
                className={cn(
                  "px-4 py-2.5 text-sm leading-relaxed",
                  msg.sender === "user" ? "rounded-2xl rounded-br-md text-white" : "rounded-2xl rounded-bl-md bg-card border shadow-sm"
                )}
                style={msg.sender === "user" ? { background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` } : {}}
                dangerouslySetInnerHTML={{ __html: msg.text }}
              />
              {msg.options && msg.options.length > 0 && !conversationDone && (
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {msg.options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(opt)}
                      className="px-3 py-1.5 rounded-full text-xs font-medium border-2 transition-all duration-200 hover:scale-105"
                      style={{ borderColor: primaryColor, color: primaryColor, backgroundColor: `${primaryColor}08` }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = primaryColor; e.currentTarget.style.color = "white"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = `${primaryColor}08`; e.currentTarget.style.color = primaryColor; }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {msg.sender === "user" && (
              <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center mt-1 bg-muted">
                <User className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
            )}
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-2 items-start">
            <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: `${primaryColor}15` }}>
              <Sparkles className="h-3.5 w-3.5" style={{ color: primaryColor }} />
            </div>
            <div className="bg-card border shadow-sm px-4 py-3 rounded-2xl rounded-bl-md">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: primaryColor, animationDelay: "0ms" }} />
                <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: primaryColor, animationDelay: "150ms" }} />
                <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: primaryColor, animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t bg-background">
        {conversationDone ? (
          <div className="text-center py-2">
            <p className="text-xs text-muted-foreground mb-2">Conversa finalizada</p>
            <button onClick={handleReset} className="text-xs font-medium px-4 py-1.5 rounded-full transition-colors" style={{ color: primaryColor, backgroundColor: `${primaryColor}10` }}>
              Iniciar nova conversa
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={currentQuestion?.type === "number" ? "Digite um número..." : "Digite sua mensagem..."}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 px-4 py-2.5 rounded-xl border bg-muted/50 text-sm focus:outline-none focus:ring-2 transition-all"
              type={currentQuestion?.type === "number" ? "number" : "text"}
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim()}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white transition-all duration-200 disabled:opacity-40 hover:scale-105"
              style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        )}
        <p className="text-[10px] text-center text-muted-foreground mt-2 opacity-60">Powered by Leads Solar ⚡</p>
      </div>
    </div>
  );
}
