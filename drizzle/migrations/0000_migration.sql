CREATE TABLE public.bots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id uuid NOT NULL DEFAULT auth.uid(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 80),
  image_url text CHECK (image_url IS NULL OR char_length(image_url) < 400000),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bots TO authenticated;
GRANT ALL ON public.bots TO service_role;
ALTER TABLE public.bots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own bots select" ON public.bots FOR SELECT TO authenticated USING (auth.uid() = mentor_id);
CREATE POLICY "own bots insert" ON public.bots FOR INSERT TO authenticated WITH CHECK (auth.uid() = mentor_id);
CREATE POLICY "own bots update" ON public.bots FOR UPDATE TO authenticated USING (auth.uid() = mentor_id);
CREATE POLICY "own bots delete" ON public.bots FOR DELETE TO authenticated USING (auth.uid() = mentor_id);

CREATE TABLE public.licences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id uuid NOT NULL DEFAULT auth.uid(),
  bot_id uuid NOT NULL REFERENCES public.bots(id) ON DELETE CASCADE,
  licence_key text NOT NULL UNIQUE DEFAULT ('NXP-' || upper(substr(md5(gen_random_uuid()::text),1,4)) || '-' || upper(substr(md5(gen_random_uuid()::text),1,4)) || '-' || upper(substr(md5(gen_random_uuid()::text),1,4)) || '-' || upper(substr(md5(gen_random_uuid()::text),1,4))),
  customer_name text CHECK (customer_name IS NULL OR char_length(customer_name) <= 100),
  expires_at timestamptz,
  activated_at timestamptz,
  revoked boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.licences TO authenticated;
GRANT ALL ON public.licences TO service_role;
ALTER TABLE public.licences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own lic select" ON public.licences FOR SELECT TO authenticated USING (auth.uid() = mentor_id);
CREATE POLICY "own lic insert" ON public.licences FOR INSERT TO authenticated WITH CHECK (auth.uid() = mentor_id AND EXISTS (SELECT 1 FROM public.bots b WHERE b.id = bot_id AND b.mentor_id = auth.uid()));
CREATE POLICY "own lic update" ON public.licences FOR UPDATE TO authenticated USING (auth.uid() = mentor_id);
CREATE POLICY "own lic delete" ON public.licences FOR DELETE TO authenticated USING (auth.uid() = mentor_id);

CREATE OR REPLACE FUNCTION public.activate_licence(_key text)
RETURNS TABLE(bot_name text, bot_image text, expires_at timestamptz)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE l public.licences%ROWTYPE;
BEGIN
  SELECT * INTO l FROM public.licences WHERE licence_key = upper(trim(_key));
  IF NOT FOUND THEN RAISE EXCEPTION 'Licence key not found'; END IF;
  IF l.revoked THEN RAISE EXCEPTION 'This licence has been revoked'; END IF;
  IF l.expires_at IS NOT NULL AND l.expires_at < now() THEN RAISE EXCEPTION 'This licence has expired'; END IF;
  UPDATE public.licences SET activated_at = coalesce(activated_at, now()) WHERE id = l.id;
  RETURN QUERY SELECT b.name, b.image_url, l.expires_at FROM public.bots b WHERE b.id = l.bot_id;
END $$;
REVOKE ALL ON FUNCTION public.activate_licence(text) FROM public;
GRANT EXECUTE ON FUNCTION public.activate_licence(text) TO anon, authenticated;