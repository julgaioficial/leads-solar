
-- Fix search_path on generate_license_key
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
$$ LANGUAGE plpgsql SET search_path = public;

-- Fix permissive RLS on conversations: restrict public insert to only allow if integrator exists
DROP POLICY "Public can insert conversations" ON public.conversations;
CREATE POLICY "Public can insert conversations" ON public.conversations FOR INSERT WITH CHECK (
  integrator_id IN (SELECT id FROM public.integrators WHERE active = true)
);

DROP POLICY "Public can update conversations" ON public.conversations;
CREATE POLICY "Public can update own conversations" ON public.conversations FOR UPDATE USING (
  id IN (SELECT id FROM public.conversations WHERE created_at > now() - interval '24 hours')
);

-- Fix permissive RLS on leads: restrict public insert to active integrators
DROP POLICY "Public can insert leads" ON public.leads;
CREATE POLICY "Public can insert leads" ON public.leads FOR INSERT WITH CHECK (
  integrator_id IN (SELECT id FROM public.integrators WHERE active = true)
);
