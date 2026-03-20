import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Bot,
  Send,
  Settings,
  ToggleLeft,
  BarChart3,
  MessageCircle,
  RefreshCw,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface Message {
  id: string;
  text: string;
  sender: "bot" | "user";
  timestamp: Date;
}

const sampleKits = [
  { name: "Kit 3kWp", consumption: "300-400 kWh", price: "R$ 14.500" },
  { name: "Kit 5kWp", consumption: "400-600 kWh", price: "R$ 22.800" },
  { name: "Kit 8kWp", consumption: "600-900 kWh", price: "R$ 34.200" },
];

export default function DashboardChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Olá! 🌞 Sou o assistente virtual da **Solar Tech SP**. Posso te ajudar a descobrir quanto você pode economizar com energia solar!\n\nQual é o seu nome?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateBotResponse = (userMsg: string) => {
    setIsTyping(true);
    const lowerMsg = userMsg.toLowerCase();

    let response = "";

    if (messages.length <= 2) {
      response = `Prazer, ${userMsg}! 😊\n\nEm qual cidade você está?`;
    } else if (messages.length <= 4) {
      response = `Ótimo! E qual o valor médio da sua conta de luz? (R$)`;
    } else if (messages.length <= 6) {
      const value = parseInt(userMsg.replace(/\D/g, ""));
      if (value && value > 0) {
        const kit = value < 400 ? sampleKits[0] : value < 700 ? sampleKits[1] : sampleKits[2];
        response = `Perfeito! 🎉 Com base na sua conta de luz, o kit ideal para você é:\n\n☀️ **${kit.name}**\n💰 Investimento: **${kit.price}**\n⚡ Faixa de consumo: **${kit.consumption}**\n\nEm breve um especialista entrará em contato! 📞`;
      } else {
        response = "Não entendi o valor. Pode me informar quanto você paga de conta de luz por mês? (ex: 350)";
      }
    } else {
      response = "Obrigado pelo interesse! Um de nossos especialistas entrará em contato em breve. 🚀";
    }

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          text: response,
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
      setIsTyping(false);
    }, 1200);
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: input.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    simulateBotResponse(input.trim());
  };

  const handleReset = () => {
    setMessages([
      {
        id: "1",
        text: "Olá! 🌞 Sou o assistente virtual da **Solar Tech SP**. Posso te ajudar a descobrir quanto você pode economizar com energia solar!\n\nQual é o seu nome?",
        sender: "bot",
        timestamp: new Date(),
      },
    ]);
  };

  const formatText = (text: string) => {
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Chatbot</h2>
            <p className="text-muted-foreground">
              Chatbot responsivo alimentado pelos seus kits e fluxo de conversa
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleReset}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Resetar
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Chat Preview */}
          <div className="lg:col-span-2">
            <div className="card-solar p-0 overflow-hidden">
              {/* Chat Header */}
              <div className="px-6 py-4 border-b border-border bg-primary/5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">Assistente Solar</p>
                  <p className="text-xs text-secondary flex items-center gap-1">
                    <span className="w-2 h-2 bg-secondary rounded-full" />
                    Online
                  </p>
                </div>
              </div>

              {/* Messages */}
              <div className="h-[400px] overflow-y-auto p-4 space-y-4 scrollbar-thin">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm ${
                        msg.sender === "user"
                          ? "bg-primary text-primary-foreground rounded-br-md"
                          : "bg-muted rounded-bl-md"
                      }`}
                      dangerouslySetInnerHTML={{ __html: formatText(msg.text) }}
                    />
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-muted px-4 py-3 rounded-2xl rounded-bl-md">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-border">
                <div className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Digite sua mensagem..."
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  />
                  <Button variant="solar" onClick={handleSend} disabled={!input.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Stats & Info */}
          <div className="space-y-6">
            <div className="card-solar">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Estatísticas</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                  <span className="text-sm text-muted-foreground">Conversas hoje</span>
                  <span className="font-bold">47</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                  <span className="text-sm text-muted-foreground">Orçamentos gerados</span>
                  <span className="font-bold text-secondary">23</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                  <span className="text-sm text-muted-foreground">Taxa de conclusão</span>
                  <span className="font-bold">72%</span>
                </div>
              </div>
            </div>

            <div className="card-solar">
              <div className="flex items-center gap-2 mb-4">
                <Settings className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Alimentação de Dados</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="p-3 rounded-lg bg-secondary/5 border border-secondary/10">
                  <p className="font-medium text-secondary">Kits Cadastrados</p>
                  <p className="text-muted-foreground">{sampleKits.length} kits disponíveis</p>
                </div>
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                  <p className="font-medium text-primary">Fluxo de Conversa</p>
                  <p className="text-muted-foreground">6 perguntas ativas</p>
                </div>
              </div>
            </div>

            <div className="card-solar bg-gradient-to-br from-primary/5 to-primary/10">
              <div className="flex items-center gap-2 mb-2">
                <MessageCircle className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Integração</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                O chatbot usa os dados dos seus kits cadastrados e o fluxo de conversa configurado para gerar orçamentos automaticamente.
              </p>
              <p className="text-xs text-muted-foreground">
                Edite as perguntas em <strong>Fluxo de Conversa</strong> e os kits em <strong>Kits</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
