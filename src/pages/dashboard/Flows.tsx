import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Plus, ArrowDown, Edit, Trash2, MessageSquare, Save, Eye, Type, Hash, ListOrdered, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

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

const typeIcons = { text: Type, number: Hash, options: ListOrdered, location: MapPin };
const typeLabels = { text: "Texto livre", number: "Número", options: "Opções", location: "Localização" };
const defaultNewQuestion = { question: "", type: "text" as const, variable: "", required: true, active: true, options: [] as string[] };

export default function DashboardFlows() {
  const { toast } = useToast();
  const { integratorId } = useAuth();
  const [questions, setQuestions] = useState<FlowQuestion[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<FlowQuestion | null>(null);
  const [formData, setFormData] = useState(defaultNewQuestion);
  const [optionInput, setOptionInput] = useState("");
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [closingMessage, setClosingMessage] = useState("");

  useEffect(() => { if (integratorId) loadData(); }, [integratorId]);

  const loadData = async () => {
    const [questionsRes, intRes] = await Promise.all([
      supabase.from("flow_questions").select("*").eq("integrator_id", integratorId!).order("question_order"),
      supabase.from("integrators").select("welcome_message, closing_message").eq("id", integratorId!).single(),
    ]);
    setQuestions((questionsRes.data || []).map((q: any) => ({
      id: q.id, order: q.question_order, question: q.question_text, type: q.question_type,
      options: q.options ? (Array.isArray(q.options) ? q.options : JSON.parse(q.options)) : [],
      variable: q.variable, required: q.required ?? true, active: q.active ?? true,
    })));
    if (intRes.data) {
      setWelcomeMessage(intRes.data.welcome_message || "");
      setClosingMessage(intRes.data.closing_message || "");
    }
  };

  const handleSaveQuestion = async () => {
    if (!formData.question || !formData.variable) { toast({ title: "Preencha todos os campos", variant: "destructive" }); return; }

    if (editingQuestion) {
      await supabase.from("flow_questions").update({
        question_text: formData.question, question_type: formData.type, variable: formData.variable,
        required: formData.required, active: formData.active,
        options: formData.type === "options" ? formData.options : null,
      }).eq("id", editingQuestion.id);
      toast({ title: "Pergunta atualizada! ✅" });
    } else {
      await supabase.from("flow_questions").insert({
        integrator_id: integratorId!, question_text: formData.question, question_type: formData.type,
        variable: formData.variable, required: formData.required, active: formData.active,
        question_order: questions.length + 1,
        options: formData.type === "options" ? formData.options : null,
      });
      toast({ title: "Pergunta adicionada! ✅" });
    }
    setFormData(defaultNewQuestion);
    setEditingQuestion(null);
    setIsDialogOpen(false);
    loadData();
  };

  const handleEdit = (q: FlowQuestion) => {
    setEditingQuestion(q);
    setFormData({ question: q.question, type: q.type, variable: q.variable, required: q.required, active: q.active, options: q.options || [] });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    await supabase.from("flow_questions").delete().eq("id", id);
    toast({ title: "Pergunta removida" });
    loadData();
  };

  const handleToggle = async (id: string, active: boolean) => {
    await supabase.from("flow_questions").update({ active: !active }).eq("id", id);
    loadData();
  };

  const addOption = () => { if (optionInput.trim()) { setFormData({ ...formData, options: [...formData.options, optionInput.trim()] }); setOptionInput(""); } };
  const removeOption = (i: number) => { setFormData({ ...formData, options: formData.options.filter((_, j) => j !== i) }); };

  const saveMessages = async () => {
    await supabase.from("integrators").update({ welcome_message: welcomeMessage, closing_message: closingMessage }).eq("id", integratorId!);
    toast({ title: "Mensagens salvas! ✅" });
  };

  const moveQuestion = async (id: string, direction: "up" | "down") => {
    const idx = questions.findIndex(q => q.id === id);
    if ((direction === "up" && idx === 0) || (direction === "down" && idx === questions.length - 1)) return;
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    await Promise.all([
      supabase.from("flow_questions").update({ question_order: questions[swapIdx].order }).eq("id", questions[idx].id),
      supabase.from("flow_questions").update({ question_order: questions[idx].order }).eq("id", questions[swapIdx].id),
    ]);
    loadData();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Fluxo de Conversa</h2>
            <p className="text-muted-foreground">Personalize as perguntas do chatbot</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(o) => { setIsDialogOpen(o); if (!o) { setEditingQuestion(null); setFormData(defaultNewQuestion); } }}>
            <DialogTrigger asChild><Button variant="solar"><Plus className="h-4 w-4 mr-2" />Nova Pergunta</Button></DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader><DialogTitle>{editingQuestion ? "Editar Pergunta" : "Nova Pergunta"}</DialogTitle></DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2"><Label>Pergunta *</Label><Textarea value={formData.question} onChange={(e) => setFormData({ ...formData, question: e.target.value })} rows={2} /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tipo</Label>
                    <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v as any })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Texto</SelectItem>
                        <SelectItem value="number">Número</SelectItem>
                        <SelectItem value="options">Opções</SelectItem>
                        <SelectItem value="location">Localização</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2"><Label>Variável *</Label><Input value={formData.variable} onChange={(e) => setFormData({ ...formData, variable: e.target.value.replace(/\s/g, "_").toLowerCase() })} /></div>
                </div>
                {formData.type === "options" && (
                  <div className="space-y-2">
                    <Label>Opções</Label>
                    <div className="flex gap-2"><Input value={optionInput} onChange={(e) => setOptionInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addOption())} /><Button variant="outline" onClick={addOption}><Plus className="h-4 w-4" /></Button></div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {formData.options.map((opt, i) => (
                        <span key={i} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-muted text-sm">{opt}<button onClick={() => removeOption(i)} className="ml-1 hover:text-destructive">×</button></span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><Switch checked={formData.required} onCheckedChange={(v) => setFormData({ ...formData, required: v })} /><Label>Obrigatória</Label></div>
                  <div className="flex items-center gap-2"><Switch checked={formData.active} onCheckedChange={(v) => setFormData({ ...formData, active: v })} /><Label>Ativa</Label></div>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button variant="outline" className="flex-1" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                  <Button variant="solar" className="flex-1" onClick={handleSaveQuestion}><Save className="h-4 w-4 mr-2" />{editingQuestion ? "Salvar" : "Adicionar"}</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-4">
          <div className="card-solar border-l-4 border-l-primary">
            <div className="flex items-center gap-2 mb-2"><MessageSquare className="h-4 w-4 text-primary" /><Label className="font-semibold">Mensagem de Boas-Vindas</Label></div>
            <Textarea value={welcomeMessage} onChange={(e) => setWelcomeMessage(e.target.value)} rows={3} className="text-sm" />
            <p className="text-xs text-muted-foreground mt-2">Variáveis: {"{empresa}"}</p>
          </div>

          {questions.map((q, index) => {
            const Icon = typeIcons[q.type] || Type;
            return (
              <div key={q.id} className={`card-solar transition-all ${!q.active ? "opacity-50" : ""}`}>
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center gap-1 pt-1">
                    <button onClick={() => moveQuestion(q.id, "up")} className="p-1 hover:bg-muted rounded disabled:opacity-30" disabled={index === 0}><ArrowDown className="h-3 w-3 rotate-180 text-muted-foreground" /></button>
                    <span className="text-xs font-bold text-muted-foreground">{q.order}</span>
                    <button onClick={() => moveQuestion(q.id, "down")} className="p-1 hover:bg-muted rounded disabled:opacity-30" disabled={index === questions.length - 1}><ArrowDown className="h-3 w-3 text-muted-foreground" /></button>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="h-4 w-4 text-primary" />
                      <span className="text-xs font-medium text-muted-foreground">{typeLabels[q.type] || q.type}</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-muted font-mono">{"{" + q.variable + "}"}</span>
                      {q.required && <span className="text-xs text-destructive">*</span>}
                    </div>
                    <p className="font-medium">{q.question}</p>
                    {q.options && q.options.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {q.options.map((opt, i) => <span key={i} className="text-xs px-2 py-1 rounded-full bg-muted">{i + 1}. {opt}</span>)}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Switch checked={q.active} onCheckedChange={() => handleToggle(q.id, q.active)} />
                    <button onClick={() => handleEdit(q)} className="p-2 hover:bg-muted rounded-lg"><Edit className="h-4 w-4 text-muted-foreground" /></button>
                    <button onClick={() => handleDelete(q.id)} className="p-2 hover:bg-destructive/10 rounded-lg"><Trash2 className="h-4 w-4 text-destructive" /></button>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="card-solar border-l-4 border-l-secondary">
            <div className="flex items-center gap-2 mb-2"><MessageSquare className="h-4 w-4 text-secondary" /><Label className="font-semibold">Mensagem de Encerramento</Label></div>
            <Textarea value={closingMessage} onChange={(e) => setClosingMessage(e.target.value)} rows={5} className="text-sm" />
            <p className="text-xs text-muted-foreground mt-2">Variáveis: {"{nome}"}, {"{consumo_kwh}"}, {"{kit_nome}"}, {"{kit_preco}"}, {"{economia}"}</p>
          </div>

          <Button variant="solar" size="lg" className="w-full" onClick={saveMessages}>
            <Save className="h-4 w-4 mr-2" />Salvar Fluxo
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
