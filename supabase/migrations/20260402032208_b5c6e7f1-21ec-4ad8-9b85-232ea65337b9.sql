
CREATE TABLE public.platform_plans (
  id text PRIMARY KEY,
  name text NOT NULL,
  price numeric NOT NULL DEFAULT 0,
  budget_limit integer NOT NULL DEFAULT 100,
  description text,
  features jsonb DEFAULT '[]'::jsonb,
  active boolean DEFAULT true,
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.platform_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage plans" ON public.platform_plans FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Public can view active plans" ON public.platform_plans FOR SELECT USING (active = true);

INSERT INTO public.platform_plans (id, name, price, budget_limit, description) VALUES
  ('basic', 'Básico', 69.90, 100, 'Plano básico com 100 orçamentos/mês'),
  ('pro', 'Pro', 149.90, 250, 'Plano profissional com 250 orçamentos/mês');
