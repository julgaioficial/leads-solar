import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import {
  Plus,
  GripVertical,
  Edit,
  Trash2,
  MessageSquare,
  ArrowDown,
  Save,
  Eye,
  ToggleLeft,
  HelpCircle,
  ListOrdered,
  Type,
  Hash,
  MapPin,
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

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

const typeIcons = {
  text: Type,
  number: Hash,
  options: ListOrdered,
  location: MapPin,
};

const typeLabels = {
  text: "Texto livre",
  number: "Número",
  options: "Opções",
  location: "Localização",
};

const initialQuestions: FlowQuestion[] = [
  {
    id: "q1",
    order: 1,
    question: "Olá! 👋 Qual é o seu nome?",
    type: "text",
    variable: "nome",
    required: true,
    active: true,
  },
  {
    id: "q2",
    order: 2,
    question: "Em qual cidade você está?",
    type: "text",
    variable: "cidade",
    required: true,
    active: true,
  },
  {
    id: "q3",
    order: 3,
    question: "Qual o valor médio da sua conta de luz? (R$)",
    type: "number",
    variable: "valor_conta",
    required: true,
    active: true,
  },
  {
    id: "q4",
    order: 4,
    question: "Qual o seu consumo mensal em kWh? (está na sua conta de luz)",
    type: "number",
    variable: "consumo_kwh",
    required: true,
    active: true,
  },
  {
    id: "q5",
    order: 5,
    question: "Qual o tipo do seu telhado?",
    type: "options",
    options: ["Cerâmica", "Fibrocimento", "Metálico", "Laje", "Solo"],
    variable: "tipo_telhado",
    required: true,
    active: true,
  },
  {
    id: "q6",
    order: 6,
    question: "Você tem interesse em financiamento?",
    type: "options",
    options: ["Sim, com certeza", "Talvez", "Não, vou pagar à vista"],
    variable: "financiamento",
    required: false,
    active: true,
  },
];

const defaultNewQuestion: Omit<FlowQuestion, "id" | "order"> = {
  question: "",
  type: "text",
  variable: "",
  required: true,
  active: true,
  options: [],
};

export default function DashboardFlows() {
  const { toast } = useToast();
  const [questions, setQuestions] = useState<FlowQuestion[]>(initialQuestions);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<FlowQuestion | null>(null);
  const [formData, setFormData] = useState(defaultNewQuestion);
  const [optionInput, setOptionInput] = useState("");
  const [previewMode, setPreviewMode] = useState(false);
  const [previewStep, setPreviewStep] = useState(0);

  const [welcomeMessage, setWelcomeMessage] = useState(
    "Olá! 🌞 Sou o assistente da *{empresa}*. Vou te ajudar a descobrir quanto você pode economizar com energia solar! Vamos lá?"
  );
  const [closingMessage, setClosingMessage] = useState(
    "Perfeito, *{nome}*! 🎉 Com base no seu consumo de *{consumo_kwh} kWh*, o kit ideal para você é:\n\n☀️ *{kit_nome}*\n💰 Investimento: *R$ {kit_preco}*\n⚡ Economia mensal estimada: *R$ {economia}*\n\nEm breve um especialista entrará em contato! 📞"
  );

  const handleSaveQuestion = () => {
    if (!formData.question || !formData.variable) {
      toast({ title: "Preencha todos os campos obrigatórios", variant: "destructive" });
      return;
    }

    if (editingQuestion) {
      setQuestions(
        questions.map((q) =>
          q.id === editingQuestion.id ? { ...q, ...formData } : q
        )
      );
      toast({ title: "Pergunta atualizada! ✅" });
    } else {
      const newQ: FlowQuestion = {
        ...formData,
        id: `q${Date.now()}`,
        order: questions.length + 1,
      };
      setQuestions([...questions, newQ]);
      toast({ title: "Pergunta adicionada! ✅" });
    }

    setFormData(defaultNewQuestion);
    setEditingQuestion(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (q: FlowQuestion) => {
    setEditingQuestion(q);
    setFormData({
      question: q.question,
      type: q.type,
      variable: q.variable,
      required: q.required,
      active: q.active,
      options: q.options || [],
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id).map((q, i) => ({ ...q, order: i + 1 })));
    toast({ title: "Pergunta removida" });
  };

  const handleToggle = (id: string) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, active: !q.active } : q)));
  };

  const addOption = () => {
    if (optionInput.trim()) {
      setFormData({ ...formData, options: [...(formData.options || []), optionInput.trim()] });
      setOptionInput("");
    }
  };

  const removeOption = (index: number) => {
    setFormData({
      ...formData,
      options: (formData.options || []).filter((_, i) => i !== index),
    });
  };

  const moveQuestion = (id: string, direction: "up" | "down") => {
    const idx = questions.findIndex((q) => q.id === id);
    if ((direction === "up" && idx === 0) || (direction === "down" && idx === questions.length - 1)) return;
    const newQuestions = [...questions];
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    [newQuestions[idx], newQuestions[swapIdx]] = [newQuestions[swapIdx], newQuestions[idx]];
    setQuestions(newQuestions.map((q, i) => ({ ...q, order: i + 1 })));
  };

  const activeQuestions = questions.filter((q) => q.active);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Fluxo de Conversa</h2>
            <p className="text-muted-foreground">
              Personalize as perguntas que o chatbot faz aos seus leads
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setPreviewMode(!previewMode);
                setPreviewStep(0);
              }}
            >
              <Eye className="h-4 w-4 mr-2" />
              {previewMode ? "Fechar Preview" : "Preview"}
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={(o) => { setIsDialogOpen(o); if (!o) { setEditingQuestion(null); setFormData(defaultNewQuestion); } }}>
              <DialogTrigger asChild>
                <Button variant="solar">
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Pergunta
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>
                    {editingQuestion ? "Editar Pergunta" : "Nova Pergunta"}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>Pergunta *</Label>
                    <Textarea
                      value={formData.question}
                      onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                      placeholder="Ex: Qual é o seu nome?"
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Tipo de resposta</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(v) => setFormData({ ...formData, type: v as FlowQuestion["type"] })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">Texto livre</SelectItem>
                          <SelectItem value="number">Número</SelectItem>
                          <SelectItem value="options">Opções</SelectItem>
                          <SelectItem value="location">Localização</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Variável *</Label>
                      <Input
                        value={formData.variable}
                        onChange={(e) => setFormData({ ...formData, variable: e.target.value.replace(/\s/g, "_").toLowerCase() })}
                        placeholder="nome_cliente"
                      />
                    </div>
                  </div>

                  {formData.type === "options" && (
                    <div className="space-y-2">
                      <Label>Opções de resposta</Label>
                      <div className="flex gap-2">
                        <Input
                          value={optionInput}
                          onChange={(e) => setOptionInput(e.target.value)}
                          placeholder="Adicionar opção..."
                          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addOption())}
                        />
                        <Button variant="outline" onClick={addOption} type="button">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {(formData.options || []).map((opt, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-muted text-sm"
                          >
                            {i + 1}. {opt}
                            <button onClick={() => removeOption(i)} className="ml-1 hover:text-destructive">
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={formData.required}
                        onCheckedChange={(v) => setFormData({ ...formData, required: v })}
                      />
                      <Label>Obrigatória</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={formData.active}
                        onCheckedChange={(v) => setFormData({ ...formData, active: v })}
                      />
                      <Label>Ativa</Label>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button variant="outline" className="flex-1" onClick={() => setIsDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button variant="solar" className="flex-1" onClick={handleSaveQuestion}>
                      <Save className="h-4 w-4 mr-2" />
                      {editingQuestion ? "Salvar" : "Adicionar"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Questions List */}
          <div className="lg:col-span-2 space-y-4">
            {/* Welcome Message */}
            <div className="card-solar border-l-4 border-l-primary">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="h-4 w-4 text-primary" />
                <Label className="font-semibold">Mensagem de Boas-Vindas</Label>
              </div>
              <Textarea
                value={welcomeMessage}
                onChange={(e) => setWelcomeMessage(e.target.value)}
                rows={3}
                className="text-sm"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Variáveis: {"{empresa}"} = nome da sua empresa
              </p>
            </div>

            {/* Questions */}
            {questions.map((q, index) => {
              const Icon = typeIcons[q.type];
              return (
                <div
                  key={q.id}
                  className={`card-solar transition-all ${!q.active ? "opacity-50" : ""}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center gap-1 pt-1">
                      <button
                        onClick={() => moveQuestion(q.id, "up")}
                        className="p-1 hover:bg-muted rounded transition-colors disabled:opacity-30"
                        disabled={index === 0}
                      >
                        <ArrowDown className="h-3 w-3 rotate-180 text-muted-foreground" />
                      </button>
                      <span className="text-xs font-bold text-muted-foreground w-5 text-center">
                        {q.order}
                      </span>
                      <button
                        onClick={() => moveQuestion(q.id, "down")}
                        className="p-1 hover:bg-muted rounded transition-colors disabled:opacity-30"
                        disabled={index === questions.length - 1}
                      >
                        <ArrowDown className="h-3 w-3 text-muted-foreground" />
                      </button>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className="h-4 w-4 text-primary" />
                        <span className="text-xs font-medium text-muted-foreground">
                          {typeLabels[q.type]}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded bg-muted font-mono">
                          {"{" + q.variable + "}"}
                        </span>
                        {q.required && (
                          <span className="text-xs text-destructive">*</span>
                        )}
                      </div>
                      <p className="font-medium">{q.question}</p>
                      {q.options && q.options.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {q.options.map((opt, i) => (
                            <span
                              key={i}
                              className="text-xs px-2 py-1 rounded-full bg-muted"
                            >
                              {i + 1}. {opt}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <Switch
                        checked={q.active}
                        onCheckedChange={() => handleToggle(q.id)}
                      />
                      <button
                        onClick={() => handleEdit(q)}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                      >
                        <Edit className="h-4 w-4 text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => handleDelete(q.id)}
                        className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Closing Message */}
            <div className="card-solar border-l-4 border-l-secondary">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="h-4 w-4 text-secondary" />
                <Label className="font-semibold">Mensagem de Encerramento (com orçamento)</Label>
              </div>
              <Textarea
                value={closingMessage}
                onChange={(e) => setClosingMessage(e.target.value)}
                rows={5}
                className="text-sm"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Variáveis: {"{nome}"}, {"{consumo_kwh}"}, {"{kit_nome}"}, {"{kit_preco}"}, {"{economia}"}
              </p>
            </div>

            <Button variant="solar" size="lg" className="w-full" onClick={() => toast({ title: "Fluxo salvo! ✅", description: "As alterações serão aplicadas imediatamente." })}>
              <Save className="h-4 w-4 mr-2" />
              Salvar Fluxo Completo
            </Button>
          </div>

          {/* Preview Panel */}
          <div className="space-y-4">
            <div className="card-solar sticky top-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Preview do Chat
              </h3>
              <div className="bg-[hsl(var(--muted)/0.3)] rounded-2xl p-3 space-y-3 max-h-[500px] overflow-y-auto">
                {/* Welcome */}
                <div className="flex justify-start">
                  <div className="bg-card rounded-2xl rounded-tl-sm p-3 max-w-[85%] text-sm shadow-sm border border-border/50">
                    {welcomeMessage.replace("{empresa}", "Sua Empresa")}
                  </div>
                </div>

                {/* Active questions preview */}
                {activeQuestions.slice(0, previewMode ? previewStep + 1 : 2).map((q, i) => (
                  <div key={q.id}>
                    <div className="flex justify-start mb-2">
                      <div className="bg-card rounded-2xl rounded-tl-sm p-3 max-w-[85%] text-sm shadow-sm border border-border/50">
                        {q.question}
                        {q.options && (
                          <div className="mt-2 space-y-1">
                            {q.options.map((opt, oi) => (
                              <div
                                key={oi}
                                className="px-3 py-1.5 rounded-lg bg-primary/5 border border-primary/10 text-xs"
                              >
                                {oi + 1}. {opt}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    {i < (previewMode ? previewStep : 1) && (
                      <div className="flex justify-end">
                        <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm p-3 max-w-[85%] text-sm">
                          {q.type === "number" ? "350" : q.type === "options" ? q.options?.[0] || "Opção 1" : "Resposta exemplo"}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {previewMode && (
                <div className="flex gap-2 mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    disabled={previewStep === 0}
                    onClick={() => setPreviewStep(Math.max(0, previewStep - 1))}
                  >
                    ← Anterior
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    disabled={previewStep >= activeQuestions.length - 1}
                    onClick={() => setPreviewStep(Math.min(activeQuestions.length - 1, previewStep + 1))}
                  >
                    Próxima →
                  </Button>
                </div>
              )}

              <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/10">
                <p className="text-xs text-muted-foreground">
                  <HelpCircle className="h-3 w-3 inline mr-1" />
                  {activeQuestions.length} perguntas ativas • O chatbot sugere o kit
                  mais compatível com o consumo informado pelo lead
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
