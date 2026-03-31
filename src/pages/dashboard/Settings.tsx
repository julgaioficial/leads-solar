import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Palette, Image, Save, ExternalLink, Globe, MessageSquare, Star, Link2, Copy, Lock, Plus, Trash2, Upload,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface Feature { title: string; description: string; }
interface Testimonial { name: string; text: string; rating: number; }

export default function DashboardSettings() {
  const { toast } = useToast();
  const { integratorId } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isActive, setIsActive] = useState(false);

  const [settings, setSettings] = useState({
    companyName: "", slug: "", tagline: "", primaryColor: "#E88A1A", secondaryColor: "#2D9B83", accentColor: "#F5C542",
    logoUrl: "", faviconUrl: "", heroTitle: "", heroSubtitle: "", ctaText: "Simular Agora",
    footerText: "", whatsappNumber: "", email: "", address: "", botName: "Assistente Solar",
    welcomeMessage: "", closingMessage: "",
  });
  const [features, setFeatures] = useState<Feature[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => { if (integratorId) loadSettings(); }, [integratorId]);

  const loadSettings = async () => {
    const { data } = await supabase.from("integrators").select("*").eq("id", integratorId!).single();
    if (data) {
      const isLicenseActive = data.subscription_status === "active" || data.subscription_status === "trial";
      setIsActive(isLicenseActive);
      setSettings({
        companyName: data.company_name, slug: data.slug, tagline: "",
        primaryColor: data.primary_color || "#E88A1A", secondaryColor: data.secondary_color || "#2D9B83",
        accentColor: data.accent_color || "#F5C542", logoUrl: data.logo_url || "", faviconUrl: data.favicon_url || "",
        heroTitle: data.hero_title || "", heroSubtitle: data.hero_subtitle || "", ctaText: data.cta_text || "Simular Agora",
        footerText: data.footer_text || "", whatsappNumber: data.phone || "", email: data.email || "",
        address: data.address || "", botName: data.bot_name || "Assistente Solar",
        welcomeMessage: data.welcome_message || "", closingMessage: data.closing_message || "",
      });
      setFeatures(Array.isArray(data.features) ? (data.features as unknown as Feature[]) : [
        { title: "Economia Real", description: "Reduza até 95% da sua conta de energia" },
        { title: "Retorno Garantido", description: "Investimento que se paga em 3-5 anos" },
        { title: "25 Anos de Garantia", description: "Painéis com garantia de fábrica" },
      ]);
      setTestimonials(Array.isArray(data.testimonials) ? (data.testimonials as unknown as Testimonial[]) : []);
    }
    setLoading(false);
  };

  const handleChange = (field: string, value: string) => setSettings(prev => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    const { error } = await supabase.from("integrators").update({
      company_name: settings.companyName, slug: settings.slug,
      primary_color: settings.primaryColor, secondary_color: settings.secondaryColor, accent_color: settings.accentColor,
      logo_url: settings.logoUrl || null, favicon_url: settings.faviconUrl || null,
      hero_title: settings.heroTitle, hero_subtitle: settings.heroSubtitle, cta_text: settings.ctaText,
      footer_text: settings.footerText, phone: settings.whatsappNumber, email: settings.email, address: settings.address,
      bot_name: settings.botName, welcome_message: settings.welcomeMessage, closing_message: settings.closingMessage,
      features: features as any, testimonials: testimonials as any,
    }).eq("id", integratorId!);

    if (error) { toast({ title: "Erro ao salvar", variant: "destructive" }); return; }
    toast({ title: "Configurações salvas! ✅", description: "Sua página white-label foi atualizada." });
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.split(".").pop();
    const path = `${integratorId}/logo.${ext}`;
    const { error } = await supabase.storage.from("logos").upload(path, file, { upsert: true });
    if (error) { toast({ title: "Erro no upload", variant: "destructive" }); return; }
    const { data } = supabase.storage.from("logos").getPublicUrl(path);
    handleChange("logoUrl", data.publicUrl);
    toast({ title: "Logo enviado! ✅" });
  };

  const pageUrl = `${window.location.origin}/s/${settings.slug}`;
  const copyLink = () => { navigator.clipboard.writeText(pageUrl); toast({ title: "Link copiado! 📋" }); };

  if (loading) return <DashboardLayout><div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div></DashboardLayout>;

  if (!isActive) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Lock className="h-16 w-16 text-muted-foreground" />
          <h2 className="text-2xl font-bold">Página bloqueada</h2>
          <p className="text-muted-foreground text-center max-w-md">Ative seu plano para desbloquear a personalização da sua página white-label.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-5xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div><h2 className="text-2xl font-bold">Configurações</h2><p className="text-muted-foreground">Personalize sua página, marca e chatbot</p></div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => window.open(pageUrl, "_blank")}><ExternalLink className="h-4 w-4 mr-2" />Ver Página</Button>
            <Button variant="solar" onClick={handleSave}><Save className="h-4 w-4 mr-2" />Salvar</Button>
          </div>
        </div>

        <div className="card-solar">
          <div className="flex items-center gap-2 mb-3"><Link2 className="h-5 w-5 text-primary" /><h3 className="font-semibold">Seu Link Exclusivo</h3></div>
          <div className="flex gap-2">
            <div className="flex-1 flex items-center">
              <span className="px-3 py-2 bg-muted rounded-l-lg border border-r-0 text-sm text-muted-foreground">{window.location.origin}/s/</span>
              <Input value={settings.slug} onChange={(e) => handleChange("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))} className="rounded-l-none flex-1 font-mono" />
            </div>
            <Button variant="outline" onClick={copyLink}><Copy className="h-4 w-4" /></Button>
          </div>
        </div>

        <Tabs defaultValue="brand" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="brand"><Palette className="h-4 w-4 mr-1.5" /> Marca</TabsTrigger>
            <TabsTrigger value="page"><Globe className="h-4 w-4 mr-1.5" /> Página</TabsTrigger>
            <TabsTrigger value="chat"><MessageSquare className="h-4 w-4 mr-1.5" /> Chatbot</TabsTrigger>
            <TabsTrigger value="social"><Star className="h-4 w-4 mr-1.5" /> Social</TabsTrigger>
          </TabsList>

          <TabsContent value="brand" className="space-y-6">
            <div className="card-solar">
              <h3 className="text-lg font-semibold mb-4">Identidade Visual</h3>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2"><Label>Nome da Empresa</Label><Input value={settings.companyName} onChange={(e) => handleChange("companyName", e.target.value)} /></div>
              </div>
              <div className="grid sm:grid-cols-3 gap-6 mt-6">
                {[{ label: "Cor Primária", field: "primaryColor" }, { label: "Cor Secundária", field: "secondaryColor" }, { label: "Cor de Destaque", field: "accentColor" }].map(({ label, field }) => (
                  <div key={field} className="space-y-2">
                    <Label>{label}</Label>
                    <div className="flex gap-2">
                      <input type="color" value={(settings as any)[field]} onChange={(e) => handleChange(field, e.target.value)} className="w-10 h-10 rounded-lg border border-input cursor-pointer" />
                      <Input value={(settings as any)[field]} onChange={(e) => handleChange(field, e.target.value)} className="flex-1 font-mono" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="card-solar">
              <div className="flex items-center gap-2 mb-4"><Image className="h-5 w-5 text-primary" /><h3 className="font-semibold">Logo</h3></div>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Upload do Logo</Label>
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                  {settings.logoUrl && (
                    <div className="w-full h-32 rounded-xl border flex items-center justify-center bg-muted/30 mt-2">
                      <img src={settings.logoUrl} alt="Logo" className="max-h-24 max-w-full object-contain" />
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>URL do Logo (ou cole aqui)</Label>
                  <Input value={settings.logoUrl} onChange={(e) => handleChange("logoUrl", e.target.value)} placeholder="https://..." />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="page" className="space-y-6">
            <div className="card-solar">
              <h3 className="text-lg font-semibold mb-4">Seção Hero</h3>
              <div className="space-y-4">
                <div className="space-y-2"><Label>Título Principal</Label><Input value={settings.heroTitle} onChange={(e) => handleChange("heroTitle", e.target.value)} /></div>
                <div className="space-y-2"><Label>Subtítulo</Label><Textarea value={settings.heroSubtitle} onChange={(e) => handleChange("heroSubtitle", e.target.value)} rows={3} /></div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Texto do CTA</Label><Input value={settings.ctaText} onChange={(e) => handleChange("ctaText", e.target.value)} /></div>
                  <div className="space-y-2"><Label>Texto do Rodapé</Label><Input value={settings.footerText} onChange={(e) => handleChange("footerText", e.target.value)} /></div>
                </div>
              </div>
            </div>
            <div className="card-solar">
              <h3 className="text-lg font-semibold mb-4">Contato</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-2"><Label>WhatsApp</Label><Input value={settings.whatsappNumber} onChange={(e) => handleChange("whatsappNumber", e.target.value)} /></div>
                <div className="space-y-2"><Label>Email</Label><Input value={settings.email} onChange={(e) => handleChange("email", e.target.value)} /></div>
                <div className="space-y-2"><Label>Endereço</Label><Input value={settings.address} onChange={(e) => handleChange("address", e.target.value)} /></div>
              </div>
            </div>
            <div className="card-solar">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Diferenciais</h3>
                <Button variant="outline" size="sm" onClick={() => setFeatures([...features, { title: "", description: "" }])}><Plus className="h-4 w-4 mr-1" /> Adicionar</Button>
              </div>
              <div className="space-y-4">
                {features.map((f, i) => (
                  <div key={i} className="flex gap-3 items-start p-3 rounded-lg bg-muted/50">
                    <div className="flex-1 grid sm:grid-cols-2 gap-3">
                      <Input placeholder="Título" value={f.title} onChange={(e) => { const u = [...features]; u[i].title = e.target.value; setFeatures(u); }} />
                      <Input placeholder="Descrição" value={f.description} onChange={(e) => { const u = [...features]; u[i].description = e.target.value; setFeatures(u); }} />
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setFeatures(features.filter((_, j) => j !== i))}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="chat" className="space-y-6">
            <div className="card-solar">
              <h3 className="text-lg font-semibold mb-4">Configurações do Chatbot</h3>
              <div className="space-y-4">
                <div className="space-y-2"><Label>Nome do Bot</Label><Input value={settings.botName} onChange={(e) => handleChange("botName", e.target.value)} /></div>
                <div className="space-y-2"><Label>Mensagem de Boas-Vindas</Label><Textarea value={settings.welcomeMessage} onChange={(e) => handleChange("welcomeMessage", e.target.value)} rows={3} /><p className="text-xs text-muted-foreground">Variável: {"{empresa}"}</p></div>
                <div className="space-y-2"><Label>Mensagem de Encerramento</Label><Textarea value={settings.closingMessage} onChange={(e) => handleChange("closingMessage", e.target.value)} rows={6} /><p className="text-xs text-muted-foreground">Variáveis: {"{nome}"}, {"{consumo_kwh}"}, {"{kit_nome}"}, {"{kit_potencia}"}, {"{kit_paineis}"}, {"{kit_preco}"}, {"{economia}"}</p></div>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 text-sm text-muted-foreground">
              <p><strong>💡 Dica:</strong> As perguntas do chatbot são editadas em <strong>Fluxo de Conversa</strong> e os kits em <strong>Kits</strong>.</p>
            </div>
          </TabsContent>

          <TabsContent value="social" className="space-y-6">
            <div className="card-solar">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Depoimentos</h3>
                <Button variant="outline" size="sm" onClick={() => setTestimonials([...testimonials, { name: "", text: "", rating: 5 }])}><Plus className="h-4 w-4 mr-1" /> Adicionar</Button>
              </div>
              <div className="space-y-4">
                {testimonials.map((t, i) => (
                  <div key={i} className="p-4 rounded-lg bg-muted/50 space-y-3">
                    <div className="flex gap-3 items-center">
                      <Input placeholder="Nome" value={t.name} className="w-40" onChange={(e) => { const u = [...testimonials]; u[i].name = e.target.value; setTestimonials(u); }} />
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button key={star} onClick={() => { const u = [...testimonials]; u[i].rating = star; setTestimonials(u); }}>
                            <Star className={`h-4 w-4 ${star <= t.rating ? "fill-current text-yellow-500" : "text-muted-foreground/30"}`} />
                          </button>
                        ))}
                      </div>
                      <Button variant="ghost" size="sm" className="ml-auto" onClick={() => setTestimonials(testimonials.filter((_, j) => j !== i))}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                    <Textarea placeholder="Depoimento..." value={t.text} rows={2} onChange={(e) => { const u = [...testimonials]; u[i].text = e.target.value; setTestimonials(u); }} />
                  </div>
                ))}
                {testimonials.length === 0 && <p className="text-muted-foreground text-sm text-center py-4">Nenhum depoimento. Clique em "Adicionar" para começar.</p>}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <Button variant="solar" size="lg" className="w-full" onClick={handleSave}><Save className="h-4 w-4 mr-2" />Salvar Todas as Configurações</Button>
      </div>
    </DashboardLayout>
  );
}
