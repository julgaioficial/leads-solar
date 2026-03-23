
-- ============================================
-- LEADS SOLAR - SCHEMA COMPLETO
-- ============================================

-- 1. Enum para roles
CREATE TYPE public.app_role AS ENUM ('admin', 'integrator');

-- 2. Enum para status de licença
CREATE TYPE public.license_status AS ENUM ('active', 'expired', 'revoked', 'trial');

-- 3. Enum para status de assinatura
CREATE TYPE public.subscription_status AS ENUM ('trial', 'active', 'past_due', 'canceled', 'expired');

-- 4. Enum para plano
CREATE TYPE public.subscription_plan AS ENUM ('basic', 'pro');

-- 5. Enum para lead score
CREATE TYPE public.lead_score AS ENUM ('hot', 'warm', 'cold');

-- ============================================
-- TABELA: profiles
-- ============================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================
-- TABELA: user_roles
-- ============================================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- TABELA: licenses
-- ============================================
CREATE TABLE public.licenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  license_key TEXT NOT NULL UNIQUE,
  status license_status NOT NULL DEFAULT 'trial',
  plan subscription_plan NOT NULL DEFAULT 'basic',
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.licenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage licenses" ON public.licenses FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can view own license" ON public.licenses FOR SELECT USING (auth.uid() = assigned_to);

-- ============================================
-- TABELA: integrators (dados do integrador/assinante)
-- ============================================
CREATE TABLE public.integrators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  license_id UUID REFERENCES public.licenses(id),
  company_name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  email TEXT,
  phone TEXT,
  address TEXT,
  
  -- Branding
  logo_url TEXT,
  favicon_url TEXT,
  primary_color TEXT DEFAULT '#E88A1A',
  secondary_color TEXT DEFAULT '#2D9B83',
  accent_color TEXT DEFAULT '#F5C542',
  
  -- Landing page
  hero_title TEXT DEFAULT 'Descubra quanto você pode economizar com energia solar',
  hero_subtitle TEXT DEFAULT 'Faça uma simulação gratuita e receba seu orçamento personalizado em minutos.',
  cta_text TEXT DEFAULT 'Simular Agora',
  footer_text TEXT,
  
  -- Chatbot
  bot_name TEXT DEFAULT 'Assistente Solar',
  welcome_message TEXT DEFAULT 'Olá! 🌞 Sou o assistente da *{empresa}*. Vou te ajudar a descobrir quanto você pode economizar com energia solar!',
  closing_message TEXT DEFAULT 'Perfeito, *{nome}*! 🎉\n\n☀️ Kit recomendado: *{kit_nome}*\n⚡ Potência: *{kit_potencia}*\n💰 Investimento: *R$ {kit_preco}*\n📉 Economia estimada: *R$ {economia}/mês*',
  
  -- Assinatura
  subscription_status subscription_status DEFAULT 'trial',
  subscription_plan subscription_plan DEFAULT 'basic',
  monthly_budget_limit INT DEFAULT 100,
  budgets_used INT DEFAULT 0,
  budget_reset_date TIMESTAMPTZ DEFAULT now(),
  trial_ends_at TIMESTAMPTZ DEFAULT (now() + interval '7 days'),
  
  -- Social proof
  testimonials JSONB DEFAULT '[]'::jsonb,
  features JSONB DEFAULT '[]'::jsonb,
  
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.integrators ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Integrators can view own data" ON public.integrators FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Integrators can update own data" ON public.integrators FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Integrators can insert own data" ON public.integrators FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage all integrators" ON public.integrators FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Public can view active integrators by slug" ON public.integrators FOR SELECT USING (active = true);

-- ============================================
-- TABELA: kits
-- ============================================
CREATE TABLE public.kits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  integrator_id UUID REFERENCES public.integrators(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  power TEXT NOT NULL,
  panels INT NOT NULL,
  inverter TEXT,
  price NUMERIC(10,2) NOT NULL,
  install_price NUMERIC(10,2) DEFAULT 0,
  min_consumption INT NOT NULL DEFAULT 0,
  max_consumption INT NOT NULL DEFAULT 9999,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.kits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Integrators can manage own kits" ON public.kits FOR ALL USING (
  integrator_id IN (SELECT id FROM public.integrators WHERE user_id = auth.uid())
);
CREATE POLICY "Admins can manage all kits" ON public.kits FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Public can view active kits" ON public.kits FOR SELECT USING (active = true);

-- ============================================
-- TABELA: flow_questions (perguntas editáveis do chatbot)
-- ============================================
CREATE TABLE public.flow_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  integrator_id UUID REFERENCES public.integrators(id) ON DELETE CASCADE NOT NULL,
  question_order INT NOT NULL,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL DEFAULT 'text',
  options JSONB,
  variable TEXT NOT NULL,
  required BOOLEAN DEFAULT true,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.flow_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Integrators can manage own questions" ON public.flow_questions FOR ALL USING (
  integrator_id IN (SELECT id FROM public.integrators WHERE user_id = auth.uid())
);
CREATE POLICY "Admins can manage all questions" ON public.flow_questions FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Public can view active questions" ON public.flow_questions FOR SELECT USING (active = true);

-- ============================================
-- TABELA: leads
-- ============================================
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  integrator_id UUID REFERENCES public.integrators(id) ON DELETE CASCADE NOT NULL,
  name TEXT,
  phone TEXT,
  email TEXT,
  city TEXT,
  monthly_bill NUMERIC(10,2),
  consumption_kwh INT,
  roof_type TEXT,
  recommended_kit_id UUID REFERENCES public.kits(id),
  score lead_score DEFAULT 'cold',
  answers JSONB DEFAULT '{}'::jsonb,
  converted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Integrators can manage own leads" ON public.leads FOR ALL USING (
  integrator_id IN (SELECT id FROM public.integrators WHERE user_id = auth.uid())
);
CREATE POLICY "Admins can view all leads" ON public.leads FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Public can insert leads" ON public.leads FOR INSERT WITH CHECK (true);

-- ============================================
-- TABELA: conversations (histórico do chat)
-- ============================================
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE NOT NULL,
  integrator_id UUID REFERENCES public.integrators(id) ON DELETE CASCADE NOT NULL,
  messages JSONB DEFAULT '[]'::jsonb,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Integrators can view own conversations" ON public.conversations FOR SELECT USING (
  integrator_id IN (SELECT id FROM public.integrators WHERE user_id = auth.uid())
);
CREATE POLICY "Public can insert conversations" ON public.conversations FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update conversations" ON public.conversations FOR UPDATE USING (true);

-- ============================================
-- TABELA: budget_transactions (controle de pré-orçamentos)
-- ============================================
CREATE TABLE public.budget_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  integrator_id UUID REFERENCES public.integrators(id) ON DELETE CASCADE NOT NULL,
  lead_id UUID REFERENCES public.leads(id),
  type TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.budget_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Integrators can view own transactions" ON public.budget_transactions FOR ALL USING (
  integrator_id IN (SELECT id FROM public.integrators WHERE user_id = auth.uid())
);
CREATE POLICY "Admins can view all transactions" ON public.budget_transactions FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- TRIGGERS para updated_at
-- ============================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_licenses_updated_at BEFORE UPDATE ON public.licenses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_integrators_updated_at BEFORE UPDATE ON public.integrators FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_kits_updated_at BEFORE UPDATE ON public.kits FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON public.leads FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON public.conversations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- TRIGGER: auto-criar profile no signup
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- FUNCTION: gerar chave de licença
-- ============================================
CREATE OR REPLACE FUNCTION public.generate_license_key()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result TEXT := 'LS-';
  i INT;
BEGIN
  FOR i IN 1..5 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  END LOOP;
  result := result || '-';
  FOR i IN 1..5 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Storage bucket para logos
-- ============================================
INSERT INTO storage.buckets (id, name, public) VALUES ('logos', 'logos', true);

CREATE POLICY "Anyone can view logos" ON storage.objects FOR SELECT USING (bucket_id = 'logos');
CREATE POLICY "Authenticated users can upload logos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'logos' AND auth.role() = 'authenticated');
CREATE POLICY "Users can update own logos" ON storage.objects FOR UPDATE USING (bucket_id = 'logos' AND auth.role() = 'authenticated');
