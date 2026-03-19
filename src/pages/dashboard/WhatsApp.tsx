import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  MessageSquare,
  Phone,
  CheckCircle2,
  XCircle,
  RefreshCw,
  QrCode,
  Wifi,
  WifiOff,
  Copy,
  ExternalLink,
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

type ConnectionStatus = "disconnected" | "connecting" | "connected" | "qr_code";

export default function DashboardWhatsApp() {
  const { toast } = useToast();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [instanceName, setInstanceName] = useState("");
  const [status, setStatus] = useState<ConnectionStatus>("disconnected");
  const [isLoading, setIsLoading] = useState(false);

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "");
    if (digits.length <= 2) return digits;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 11)
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(formatPhone(e.target.value));
  };

  const handleConnect = () => {
    if (!phoneNumber || phoneNumber.replace(/\D/g, "").length < 11) {
      toast({
        title: "Número inválido",
        description: "Insira um número de WhatsApp válido com DDD.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setStatus("connecting");

    // Simula conexão com Evolution API
    setTimeout(() => {
      setStatus("qr_code");
      setIsLoading(false);
      setInstanceName(`leads-solar-${phoneNumber.replace(/\D/g, "").slice(-4)}`);
    }, 2000);
  };

  const handleConfirmQR = () => {
    setIsLoading(true);
    setTimeout(() => {
      setStatus("connected");
      setIsLoading(false);
      toast({
        title: "WhatsApp conectado! ✅",
        description: "Seu chatbot está ativo e pronto para receber leads.",
      });
    }, 1500);
  };

  const handleDisconnect = () => {
    setStatus("disconnected");
    setPhoneNumber("");
    setInstanceName("");
    toast({
      title: "WhatsApp desconectado",
      description: "A instância foi desativada.",
    });
  };

  const copyWebhookUrl = () => {
    navigator.clipboard.writeText(
      `https://api.leadssolar.com.br/webhook/${instanceName}`
    );
    toast({ title: "URL copiada!" });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-3xl">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold">Conexão WhatsApp</h2>
          <p className="text-muted-foreground">
            Conecte seu número de WhatsApp para ativar o chatbot automático
          </p>
        </div>

        {/* Status Card */}
        <div className="card-solar">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div
                className={`p-3 rounded-xl ${
                  status === "connected"
                    ? "bg-secondary/10"
                    : "bg-muted"
                }`}
              >
                {status === "connected" ? (
                  <Wifi className="h-6 w-6 text-secondary" />
                ) : (
                  <WifiOff className="h-6 w-6 text-muted-foreground" />
                )}
              </div>
              <div>
                <h3 className="font-semibold">
                  {status === "connected"
                    ? "WhatsApp Conectado"
                    : status === "connecting"
                    ? "Conectando..."
                    : status === "qr_code"
                    ? "Aguardando leitura do QR Code"
                    : "WhatsApp Desconectado"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {status === "connected"
                    ? `Instância: ${instanceName}`
                    : "Configure abaixo para ativar"}
                </p>
              </div>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium border ${
                status === "connected"
                  ? "bg-secondary/10 text-secondary border-secondary/20"
                  : status === "connecting" || status === "qr_code"
                  ? "bg-accent text-accent-foreground border-accent/50"
                  : "bg-destructive/10 text-destructive border-destructive/20"
              }`}
            >
              {status === "connected"
                ? "Online"
                : status === "connecting"
                ? "Conectando"
                : status === "qr_code"
                ? "QR Code"
                : "Offline"}
            </span>
          </div>

          {/* Connection Form */}
          {status === "disconnected" && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Como funciona?</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Basta inserir seu número de WhatsApp abaixo. A plataforma
                      vai criar uma instância dedicada para seu chatbot via
                      Evolution API. Você só precisa escanear o QR Code uma vez.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Número do WhatsApp (com DDD)</Label>
                <Input
                  placeholder="(11) 99999-9999"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  maxLength={15}
                />
                <p className="text-xs text-muted-foreground">
                  Use o número que será dedicado ao atendimento dos leads
                </p>
              </div>

              <Button
                variant="solar"
                size="lg"
                className="w-full"
                onClick={handleConnect}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Criando instância...
                  </>
                ) : (
                  <>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Conectar WhatsApp
                  </>
                )}
              </Button>
            </div>
          )}

          {/* QR Code Step */}
          {status === "qr_code" && (
            <div className="space-y-4">
              <div className="flex flex-col items-center py-6">
                <div className="w-48 h-48 bg-muted rounded-2xl flex items-center justify-center border-2 border-dashed border-border mb-4">
                  <QrCode className="h-24 w-24 text-muted-foreground/50" />
                </div>
                <p className="text-sm text-muted-foreground text-center max-w-sm">
                  Abra o WhatsApp no celular → Menu (⋮) → Aparelhos conectados
                  → Conectar aparelho → Escaneie o código acima
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setStatus("disconnected")}
                >
                  Cancelar
                </Button>
                <Button
                  variant="solar"
                  className="flex-1"
                  onClick={handleConfirmQR}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                  )}
                  Já escaneei
                </Button>
              </div>
            </div>
          )}

          {/* Connected Info */}
          {status === "connected" && (
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">Número</p>
                  <p className="font-medium">{phoneNumber}</p>
                </div>
                <div className="p-4 rounded-xl bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">Instância</p>
                  <p className="font-medium">{instanceName}</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-muted/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Webhook URL
                    </p>
                    <p className="font-mono text-sm break-all">
                      https://api.leadssolar.com.br/webhook/{instanceName}
                    </p>
                  </div>
                  <button
                    onClick={copyWebhookUrl}
                    className="p-2 hover:bg-background rounded-lg transition-colors"
                  >
                    <Copy className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-secondary/5 border border-secondary/10 text-center">
                  <p className="text-2xl font-bold text-secondary">156</p>
                  <p className="text-xs text-muted-foreground">Mensagens hoje</p>
                </div>
                <div className="p-3 rounded-xl bg-primary/5 border border-primary/10 text-center">
                  <p className="text-2xl font-bold text-primary">23</p>
                  <p className="text-xs text-muted-foreground">Leads capturados</p>
                </div>
                <div className="p-3 rounded-xl bg-accent/50 border border-accent/50 text-center">
                  <p className="text-2xl font-bold">98%</p>
                  <p className="text-xs text-muted-foreground">Uptime</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleDisconnect}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Desconectar
                </Button>
                <Button variant="outline" className="flex-1">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reiniciar Instância
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Evolution API Info */}
        <div className="card-solar bg-gradient-to-br from-primary/5 to-primary/10">
          <div className="flex items-start gap-3">
            <ExternalLink className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h3 className="font-semibold mb-1">Powered by Evolution API</h3>
              <p className="text-sm text-muted-foreground">
                Utilizamos a Evolution API para garantir uma conexão estável e
                segura com o WhatsApp. Sua instância é dedicada e isolada, sem
                interferência de outros usuários.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
