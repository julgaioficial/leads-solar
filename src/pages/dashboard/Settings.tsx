import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Palette,
  Image,
  Type,
  Save,
  Eye,
  Upload,
  RotateCcw,
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function DashboardSettings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    companyName: "Solar Tech SP",
    tagline: "Energia solar acessível para todos",
    primaryColor: "#E88A1A",
    secondaryColor: "#2D9B83",
    accentColor: "#F5C542",
    logoUrl: "",
    faviconUrl: "",
    heroTitle: "Descubra quanto você pode economizar com energia solar",
    heroSubtitle: "Faça uma simulação gratuita e receba seu orçamento personalizado em minutos.",
    ctaText: "Simular Agora",
    footerText: "© 2024 Solar Tech SP. Todos os direitos reservados.",
    whatsappNumber: "(11) 99999-9999",
    email: "contato@solartech.com",
  });

  const handleChange = (field: string, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    toast({
      title: "Configurações salvas! ✅",
      description: "Suas alterações serão aplicadas na sua página.",
    });
  };

  const handleReset = () => {
    toast({
      title: "Configurações restauradas",
      description: "Voltamos às configurações padrão.",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Configurações</h2>
            <p className="text-muted-foreground">
              Personalize sua página white-label e marca
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Restaurar
            </Button>
            <Button variant="solar" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </Button>
          </div>
        </div>

        {/* Identidade Visual */}
        <div className="card-solar">
          <div className="flex items-center gap-2 mb-6">
            <Palette className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Identidade Visual</h3>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Nome da Empresa</Label>
              <Input
                value={settings.companyName}
                onChange={(e) => handleChange("companyName", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Tagline</Label>
              <Input
                value={settings.tagline}
                onChange={(e) => handleChange("tagline", e.target.value)}
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 mt-6">
            <div className="space-y-2">
              <Label>Cor Primária</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={settings.primaryColor}
                  onChange={(e) => handleChange("primaryColor", e.target.value)}
                  className="w-10 h-10 rounded-lg border border-input cursor-pointer"
                />
                <Input
                  value={settings.primaryColor}
                  onChange={(e) => handleChange("primaryColor", e.target.value)}
                  className="flex-1 font-mono"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Cor Secundária</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={settings.secondaryColor}
                  onChange={(e) => handleChange("secondaryColor", e.target.value)}
                  className="w-10 h-10 rounded-lg border border-input cursor-pointer"
                />
                <Input
                  value={settings.secondaryColor}
                  onChange={(e) => handleChange("secondaryColor", e.target.value)}
                  className="flex-1 font-mono"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Cor de Destaque</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={settings.accentColor}
                  onChange={(e) => handleChange("accentColor", e.target.value)}
                  className="w-10 h-10 rounded-lg border border-input cursor-pointer"
                />
                <Input
                  value={settings.accentColor}
                  onChange={(e) => handleChange("accentColor", e.target.value)}
                  className="flex-1 font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Logo e Favicon */}
        <div className="card-solar">
          <div className="flex items-center gap-2 mb-6">
            <Image className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Logo e Favicon</h3>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>URL do Logo</Label>
              <Input
                value={settings.logoUrl}
                onChange={(e) => handleChange("logoUrl", e.target.value)}
                placeholder="https://seusite.com/logo.png"
              />
              <div className="w-full h-32 rounded-xl border-2 border-dashed border-border flex items-center justify-center bg-muted/30">
                {settings.logoUrl ? (
                  <img
                    src={settings.logoUrl}
                    alt="Logo"
                    className="max-h-24 max-w-full object-contain"
                  />
                ) : (
                  <div className="text-center">
                    <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Cole a URL do logo acima
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label>URL do Favicon</Label>
              <Input
                value={settings.faviconUrl}
                onChange={(e) => handleChange("faviconUrl", e.target.value)}
                placeholder="https://seusite.com/favicon.ico"
              />
              <div className="w-full h-32 rounded-xl border-2 border-dashed border-border flex items-center justify-center bg-muted/30">
                {settings.faviconUrl ? (
                  <img
                    src={settings.faviconUrl}
                    alt="Favicon"
                    className="max-h-16 max-w-full object-contain"
                  />
                ) : (
                  <div className="text-center">
                    <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Cole a URL do favicon acima
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Textos da Página */}
        <div className="card-solar">
          <div className="flex items-center gap-2 mb-6">
            <Type className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Textos da Página</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Título Principal (Hero)</Label>
              <Input
                value={settings.heroTitle}
                onChange={(e) => handleChange("heroTitle", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Subtítulo</Label>
              <Textarea
                value={settings.heroSubtitle}
                onChange={(e) => handleChange("heroSubtitle", e.target.value)}
                rows={2}
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Texto do Botão CTA</Label>
                <Input
                  value={settings.ctaText}
                  onChange={(e) => handleChange("ctaText", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>WhatsApp de Contato</Label>
                <Input
                  value={settings.whatsappNumber}
                  onChange={(e) => handleChange("whatsappNumber", e.target.value)}
                />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email de Contato</Label>
                <Input
                  value={settings.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Texto do Rodapé</Label>
                <Input
                  value={settings.footerText}
                  onChange={(e) => handleChange("footerText", e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="card-solar bg-gradient-to-br from-primary/5 to-primary/10">
          <div className="flex items-center gap-2 mb-4">
            <Eye className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Prévia da Página</h3>
          </div>
          <div
            className="rounded-xl border overflow-hidden bg-background p-6"
            style={{
              borderColor: settings.primaryColor,
            }}
          >
            <div className="text-center space-y-3">
              <h4 className="text-xl font-bold" style={{ color: settings.primaryColor }}>
                {settings.companyName}
              </h4>
              <p className="text-sm text-muted-foreground">{settings.tagline}</p>
              <h3 className="text-lg font-semibold">{settings.heroTitle}</h3>
              <p className="text-sm text-muted-foreground">{settings.heroSubtitle}</p>
              <button
                className="px-6 py-2 rounded-lg text-white font-medium text-sm"
                style={{ backgroundColor: settings.primaryColor }}
              >
                {settings.ctaText}
              </button>
            </div>
          </div>
        </div>

        <Button variant="solar" size="lg" className="w-full" onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Salvar Todas as Configurações
        </Button>
      </div>
    </DashboardLayout>
  );
}
