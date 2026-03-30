import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Palette,
  Image,
  Type,
  Save,
  Eye,
  Upload,
  RotateCcw,
  Globe,
  MessageSquare,
  Star,
  Link2,
  Copy,
  ExternalLink,
  Lock,
  CheckCircle,
  Plus,
  Trash2,
} from "lucide-react";
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Feature {
  title: string;
  description: string;
}

interface Testimonial {
  name: string;
  text: string;
  rating: number;
}

export default function DashboardSettings() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isActive] = useState(true); // Simulates license activation

  const [settings, setSettings] = useState({
    companyName: "Solar Tech SP",
    slug: "solar-tech-sp",
    tagline: "Energia solar acessível para todos",
    primaryColor: "#E88A1A",
    secondaryColor: "#2D9B83",
    accentColor: "#F5C542",
    logoUrl: "",
    faviconUrl: "",
    heroTitle: "Descubra quanto você pode economizar com energia solar",
    heroSubtitle: "Faça uma simulação gratuita e receba seu orçamento personalizado em minutos. Sem compromisso!",
    ctaText: "Simular Agora",
    footerText: "© 2024 Solar Tech SP. Todos os direitos reservados.",
    whatsappNumber: "(11) 99999-9999",
    email: "contato@solartech.com",
    address: "São Paulo, SP",
    botName: "Assistente Solar",
    welcomeMessage: "Olá! 🌞 Sou o assistente da *{empresa}*. Vou te ajudar a descobrir quanto você pode economizar com energia solar!",
    closingMessage: "Perfeito, *{nome}*! 🎉\n\n☀️ Kit recomendado: *{kit_nome}*\n⚡ Potência: *{kit_potencia}*\n🔋 Painéis: *{kit_paineis}* unidades\n💰 Investimento: *R$ {kit_preco}*\n📉 Economia estimada: *R$ {economia}/mês*\n\nEm breve um especialista entrará em contato! 📞",
  });

  const [features, setFeatures] = useState<Feature[]>([
    { title: "Economia Real", description: "Reduza até 95% da sua conta de energia elétrica" },
    { title: "Retorno Garantido", description: "Investimento que se paga em 3-5 anos" },
    { title: "25 Anos de Garantia", description: "Painéis com garantia de desempenho de fábrica" },
  ]);

  const [testimonials, setTestimonials] = useState<Testimonial[]>([
    { name: "Carlos M.", text: "Minha conta de luz caiu de R$ 850 para R$ 90!", rating: 5 },
    { name: "Ana P.", text: "Atendimento excelente e instalação rápida.", rating: 5 },
  ]);

  const [isSaving, setIsSaving] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);

  const pageUrl = `${window.location.origin}/s/${settings.slug}`;

  const handleChange = (field: string, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', user.id);

    try {
      const { data, error } = await supabase.storage
        .from('logos')
        .upload(`integrators/${user.id}/logo.${file.name.split('.').pop()}`, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('logos')
        .getPublicUrl(data.path);

      setSettings((prev) => ({ ...prev, logoUrl: publicUrl }));
      toast({ title: "Logo atualizada! ✅" });
    } catch (err) {
      console.error('Error uploading logo:', err);
      toast({ title: "Erro ao upload da logo", variant: "destructive" });
    }
  };

  const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    try {
      const { data, error } = await supabase.storage
        .from('favicons')
        .upload(`integrators/${user.id}/favicon.${file.name.split('.').pop()}`, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('favicons')
        .getPublicUrl(data.path);

      setSettings((prev) => ({ ...prev, faviconUrl: publicUrl }));
      toast({ title: "Favicon atualizado! ✅" });
    } catch (err) {
      console.error('Error uploading favicon:', err);
      toast({ title: "Erro ao upload do favicon", variant: "destructive" });
    }
  };

  const handleSave = async () => {
    console.log('handleSave called');
    if (!user?.id) {
      toast({ title: "Erro", description: "Usuário não autenticado", variant: "destructive" });
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('integrators')
        .update({
          company_name: settings.companyName,
          primary_color: settings.primaryColor,
          secondary_color: settings.secondaryColor,
          accent_color: settings.accentColor,
          logo_url: settings.logoUrl,
          hero_title: settings.heroTitle,
          hero_subtitle: settings.heroSubtitle,
          cta_text: settings.ctaText,
          footer_text: settings.footerText,
          phone: settings.whatsappNumber,
          email: settings.email,
          bot_name: settings.botName,
          welcome_message: settings.welcomeMessage,
          closing_message: settings.closingMessage,
          features: features,
          testimonials: testimonials,
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({ title: "Configurações salvas! ✅", description: "Sua página white-label foi atualizada." });
    } catch (err) {
      console.error('Error saving settings:', err);
      toast({ title: "Erro ao salvar", description: "Tente novamente mais tarde.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(pageUrl);
    toast({ title: "Link copiado! 📋" });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-5xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Configurações</h2>
            <p className="text-muted-foreground">Personalize sua página, marca e chatbot</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => window.open(pageUrl, "_blank")}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Ver Página
            </Button>
            <Button variant="solar" onClick={() => { console.log('Salvar button clicked'); handleSave(); }}>
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </Button>
          </div>
        </div>

        {/* Page URL */}
        <div className="card-solar">
          <div className="flex items-center gap-2 mb-3">
            <Link2 className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Seu Link Exclusivo</h3>
          </div>
          <div className="flex gap-2">
            <div className="flex-1 flex items-center gap-0">
              <span className="px-3 py-2 bg-muted rounded-l-lg border border-r-0 text-sm text-muted-foreground">
                {window.location.origin}/s/
              </span>
              <Input
                value={settings.slug}
                onChange={(e) => handleChange("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                className="rounded-l-none flex-1 font-mono"
              />
            </div>
            <Button variant="outline" onClick={copyLink}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Tabs defaultValue="brand" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="brand"><Palette className="h-4 w-4 mr-1.5" /> Marca</TabsTrigger>
            <TabsTrigger value="page"><Globe className="h-4 w-4 mr-1.5" /> Página</TabsTrigger>
            <TabsTrigger value="chat"><MessageSquare className="h-4 w-4 mr-1.5" /> Chatbot</TabsTrigger>
            <TabsTrigger value="social"><Star className="h-4 w-4 mr-1.5" /> Social</TabsTrigger>
          </TabsList>

          {/* Brand Tab */}
          <TabsContent value="brand" className="space-y-6">
            <div className="card-solar">
              <h3 className="text-lg font-semibold mb-4">Identidade Visual</h3>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Nome da Empresa</Label>
                  <Input value={settings.companyName} onChange={(e) => handleChange("companyName", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Tagline</Label>
                  <Input value={settings.tagline} onChange={(e) => handleChange("tagline", e.target.value)} />
                </div>
              </div>
              <div className="grid sm:grid-cols-3 gap-6 mt-6">
                {[
                  { label: "Cor Primária", field: "primaryColor" },
                  { label: "Cor Secundária", field: "secondaryColor" },
                  { label: "Cor de Destaque", field: "accentColor" },
                ].map(({ label, field }) => (
                  <div key={field} className="space-y-2">
                    <Label>{label}</Label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={(settings as any)[field]}
                        onChange={(e) => handleChange(field, e.target.value)}
                        className="w-10 h-10 rounded-lg border border-input cursor-pointer"
                      />
                      <Input value={(settings as any)[field]} onChange={(e) => handleChange(field, e.target.value)} className="flex-1 font-mono" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-solar">
              <div className="flex items-center gap-2 mb-4">
                <Image className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Logo e Favicon</h3>
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                {[
                  { label: "Logo da Empresa", field: "logoUrl", h: "h-32", inputRef: logoInputRef, onUpload: handleLogoUpload },
                  { label: "Favicon", field: "faviconUrl", h: "h-32", inputRef: faviconInputRef, onUpload: handleFaviconUpload },
                ].map(({ label, field, h, inputRef, onUpload }) => (
                  <div key={field} className="space-y-2">
                    <Label>{label}</Label>
                    <Input 
                      value={(settings as any)[field]} 
                      onChange={(e) => handleChange(field, e.target.value)} 
                      placeholder="https://..." 
                      readOnly
                    />
                    <input
                      type="file"
                      ref={inputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={onUpload}
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => inputRef?.current?.click()}
                      className="w-full"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Fazer Upload
                    </Button>
                    <div className={`w-full ${h} rounded-xl border-2 border-dashed border-border flex items-center justify-center bg-muted/30`}>
                      {(settings as any)[field] ? (
                        <img src={(settings as any)[field]} alt="" className="max-h-24 max-w-full object-contain" />
                      ) : (
                        <div className="text-center">
                          <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">Clique para fazer upload</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Page Tab */}
          <TabsContent value="page" className="space-y-6">
            <div className="card-solar">
              <h3 className="text-lg font-semibold mb-4">Seção Hero</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Título Principal</Label>
                  <Input value={settings.heroTitle} onChange={(e) => handleChange("heroTitle", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Subtítulo</Label>
                  <Textarea value={settings.heroSubtitle} onChange={(e) => handleChange("heroSubtitle", e.target.value)} rows={3} />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Texto do Botão CTA</Label>
                    <Input value={settings.ctaText} onChange={(e) => handleChange("ctaText", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Texto do Rodapé</Label>
                    <Input value={settings.footerText} onChange={(e) => handleChange("footerText", e.target.value)} />
                  </div>
                </div>
              </div>
            </div>

            <div className="card-solar">
              <h3 className="text-lg font-semibold mb-4">Contato</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>WhatsApp</Label>
                  <Input value={settings.whatsappNumber} onChange={(e) => handleChange("whatsappNumber", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={settings.email} onChange={(e) => handleChange("email", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Endereço</Label>
                  <Input value={settings.address} onChange={(e) => handleChange("address", e.target.value)} />
                </div>
              </div>
            </div>

            {/* Editable Features */}
            <div className="card-solar">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Diferenciais</h3>
                <Button variant="outline" size="sm" onClick={() => setFeatures([...features, { title: "", description: "" }])}>
                  <Plus className="h-4 w-4 mr-1" /> Adicionar
                </Button>
              </div>
              <div className="space-y-4">
                {features.map((f, i) => (
                  <div key={i} className="flex gap-3 items-start p-3 rounded-lg bg-muted/50">
                    <div className="flex-1 grid sm:grid-cols-2 gap-3">
                      <Input
                        placeholder="Título"
                        value={f.title}
                        onChange={(e) => {
                          const updated = [...features];
                          updated[i].title = e.target.value;
                          setFeatures(updated);
                        }}
                      />
                      <Input
                        placeholder="Descrição"
                        value={f.description}
                        onChange={(e) => {
                          const updated = [...features];
                          updated[i].description = e.target.value;
                          setFeatures(updated);
                        }}
                      />
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setFeatures(features.filter((_, j) => j !== i))}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Editable Testimonials */}
            <div className="card-solar">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Depoimentos</h3>
                <Button variant="outline" size="sm" onClick={() => setTestimonials([...testimonials, { name: "", text: "", rating: 5 }])}>
                  <Plus className="h-4 w-4 mr-1" /> Adicionar
                </Button>
              </div>
              <div className="space-y-4">
                {testimonials.map((t, i) => (
                  <div key={i} className="p-4 rounded-lg bg-muted/50 space-y-3">
                    <div className="flex gap-3 items-center">
                      <Input
                        placeholder="Nome do cliente"
                        value={t.name}
                        className="w-40"
                        onChange={(e) => {
                          const updated = [...testimonials];
                          updated[i].name = e.target.value;
                          setTestimonials(updated);
                        }}
                      />
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => {
                              const updated = [...testimonials];
                              updated[i].rating = star;
                              setTestimonials(updated);
                            }}
                          >
                            <Star className={`h-4 w-4 ${star <= t.rating ? "fill-current text-yellow-500" : "text-muted-foreground/30"}`} />
                          </button>
                        ))}
                      </div>
                      <Button variant="ghost" size="sm" className="ml-auto" onClick={() => setTestimonials(testimonials.filter((_, j) => j !== i))}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                    <Textarea
                      placeholder="Depoimento do cliente..."
                      value={t.text}
                      rows={2}
                      onChange={(e) => {
                        const updated = [...testimonials];
                        updated[i].text = e.target.value;
                        setTestimonials(updated);
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Editable Steps (How It Works) */}
            <div className="card-solar">
              <h3 className="text-lg font-semibold mb-4">Como Funciona (Passos)</h3>
              <div className="space-y-4">
                {[
                  { step: "01", title: "Cliente envia mensagem", icon: "MessageSquare" },
                  { step: "02", title: "IA coleta informações", icon: "Bot" },
                  { step: "03", title: "Pré-orçamento enviado", icon: "FileText" },
                  { step: "04", title: "Lead qualificado no dashboard", icon: "TrendingUp" },
                ].map((step, i) => (
                  <div key={i} className="flex gap-3 items-start p-3 rounded-lg bg-muted/50">
                    <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {step.step}
                    </div>
                    <div className="flex-1 space-y-2">
                      <Input
                        placeholder="Título do passo"
                        value={step.title}
                        onChange={(e) => {
                          const updatedSteps = [
                            { step: "01", title: "Cliente envia mensagem", icon: "MessageSquare" },
                            { step: "02", title: "IA coleta informações", icon: "Bot" },
                            { step: "03", title: "Pré-orçamento enviado", icon: "FileText" },
                            { step: "04", title: "Lead qualificado no dashboard", icon: "TrendingUp" },
                          ];
                          updatedSteps[i].title = e.target.value;
                          console.log("Updated steps:", updatedSteps);
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Editable Pricing Section (Hidden on white-label) */}
            <div className="card-solar">
              <h3 className="text-lg font-semibold mb-4">Seção de Planos (Ocultar no white-label)</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Título da Seção</Label>
                  <Input value="Planos simples e transparentes" readOnly />
                </div>
                <div className="space-y-2">
                  <Label>Subtítulo</Label>
                  <Input value="Comece com 7 dias grátis. Cancele quando quiser. Sem taxas escondidas." readOnly />
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">
                    💡 Limite mensal de pré-orçamentos gerados pelo chatbot • <span className="text-primary">ROI médio de 915%</span>
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Chat Tab */}
          <TabsContent value="chat" className="space-y-6">
            <div className="card-solar">
              <h3 className="text-lg font-semibold mb-4">Configurações do Chatbot</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Nome do Bot</Label>
                  <Input value={settings.botName} onChange={(e) => handleChange("botName", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Mensagem de Boas-Vindas</Label>
                  <Textarea value={settings.welcomeMessage} onChange={(e) => handleChange("welcomeMessage", e.target.value)} rows={3} />
                  <p className="text-xs text-muted-foreground">Use *texto* para negrito. Variável: {"{empresa}"}</p>
                </div>
                <div className="space-y-2">
                  <Label>Mensagem de Encerramento (Orçamento)</Label>
                  <Textarea value={settings.closingMessage} onChange={(e) => handleChange("closingMessage", e.target.value)} rows={6} />
                  <p className="text-xs text-muted-foreground">
                    Variáveis: {"{nome}"}, {"{consumo_kwh}"}, {"{kit_nome}"}, {"{kit_potencia}"}, {"{kit_paineis}"}, {"{kit_preco}"}, {"{economia}"}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 text-sm text-muted-foreground">
              <p><strong>💡 Dica:</strong> As perguntas do chatbot são editadas em <strong>Fluxo de Conversa</strong> e os kits em <strong>Kits</strong>. O chatbot usa esses dados automaticamente.</p>
            </div>
          </TabsContent>

          {/* Social Proof Tab */}
          <TabsContent value="social" className="space-y-6">
            <div className="card-solar">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Depoimentos</h3>
                <Button variant="outline" size="sm" onClick={() => setTestimonials([...testimonials, { name: "", text: "", rating: 5 }])}>
                  <Plus className="h-4 w-4 mr-1" /> Adicionar
                </Button>
              </div>
              <div className="space-y-4">
                {testimonials.map((t, i) => (
                  <div key={i} className="p-4 rounded-lg bg-muted/50 space-y-3">
                    <div className="flex gap-3 items-center">
                      <Input
                        placeholder="Nome do cliente"
                        value={t.name}
                        className="w-40"
                        onChange={(e) => {
                          const updated = [...testimonials];
                          updated[i].name = e.target.value;
                          setTestimonials(updated);
                        }}
                      />
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => {
                              const updated = [...testimonials];
                              updated[i].rating = star;
                              setTestimonials(updated);
                            }}
                          >
                            <Star className={`h-4 w-4 ${star <= t.rating ? "fill-current text-yellow-500" : "text-muted-foreground/30"}`} />
                          </button>
                        ))}
                      </div>
                      <Button variant="ghost" size="sm" className="ml-auto" onClick={() => setTestimonials(testimonials.filter((_, j) => j !== i))}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                    <Textarea
                      placeholder="Depoimento do cliente..."
                      value={t.text}
                      rows={2}
                      onChange={(e) => {
                        const updated = [...testimonials];
                        updated[i].text = e.target.value;
                        setTestimonials(updated);
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <Button variant="solar" size="lg" className="w-full" onClick={() => { console.log('Salvar Todas as Configurações button clicked'); handleSave(); }}>
          <Save className="h-4 w-4 mr-2" />
          Salvar Todas as Configurações
        </Button>
      </div>
    </DashboardLayout>
  );
}
