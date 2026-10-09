ALTER TABLE public.bots ADD COLUMN ea_token text NOT NULL UNIQUE DEFAULT encode(extensions.gen_random_bytes(24), 'hex');
ALTER TABLE public.licences ADD COLUMN risk_mode text NOT NULL DEFAULT 'percent' CHECK (risk_mode IN ('percent','fixed','multiplier')),
  ADD COLUMN risk_value numeric NOT NULL DEFAULT 1 CHECK (risk_value > 0 AND risk_value <= 100),
  ADD COLUMN max_trades_day integer NOT NULL DEFAULT 10 CHECK (max_trades_day BETWEEN 1 AND 500),
  ADD COLUMN copy_enabled boolean NOT NULL DEFAULT true;

CREATE TABLE public.signals (
  id bigserial PRIMARY KEY,
  bot_id uuid NOT NULL REFERENCES public.bots(id) ON DELETE CASCADE,
  mentor_id uuid NOT NULL,
  action text NOT NULL CHECK (action IN ('open','close','modify')),
  ticket bigint NOT NULL,
  symbol text NOT NULL CHECK (char_length(symbol) BETWEEN 1 AND 30),
  side text CHECK (side IN ('buy','sell')),
  volume numeric,
  price numeric,
  sl numeric,
  tp numeric,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.signals TO authenticated;
GRANT ALL ON public.signals TO service_role;
GRANT USAGE, SELECT ON SEQUENCE public.signals_id_seq TO service_role;
ALTER TABLE public.signals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own signals select" ON public.signals FOR SELECT TO authenticated USING (auth.uid() = mentor_id);
CREATE INDEX signals_bot_idx ON public.signals(bot_id, id);

CREATE OR REPLACE FUNCTION public.licence_copy_status(_key text)
RETURNS TABLE(risk_mode text, risk_value numeric, max_trades_day integer, copy_enabled boolean, recent jsonb)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE l public.licences%ROWTYPE;
BEGIN
  SELECT * INTO l FROM public.licences WHERE licence_key = upper(trim(_key));
  IF NOT FOUND OR l.revoked OR (l.expires_at IS NOT NULL AND l.expires_at < now()) THEN RAISE EXCEPTION 'Licence is not active'; END IF;
  RETURN QUERY SELECT l.risk_mode, l.risk_value, l.max_trades_day, l.copy_enabled,
    coalesce((SELECT jsonb_agg(s ORDER BY s.id DESC) FROM (SELECT id, action, symbol, side, volume, price, sl, tp, created_at FROM public.signals WHERE bot_id = l.bot_id ORDER BY id DESC LIMIT 15) s), '[]'::jsonb);
END $$;

CREATE OR REPLACE FUNCTION public.set_licence_risk(_key text, _mode text, _value numeric, _max integer, _enabled boolean)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF _mode NOT IN ('percent','fixed','multiplier') THEN RAISE EXCEPTION 'Invalid risk mode'; END IF;
  IF _value IS NULL OR _value <= 0 OR _value > 100 THEN RAISE EXCEPTION 'Risk value must be between 0 and 100'; END IF;
  IF _max IS NULL OR _max < 1 OR _max > 500 THEN RAISE EXCEPTION 'Max trades must be 1-500'; END IF;
  UPDATE public.licences SET risk_mode = _mode, risk_value = _value, max_trades_day = _max, copy_enabled = _enabled
  WHERE licence_key = upper(trim(_key)) AND NOT revoked AND (expires_at IS NULL OR expires_at > now());
  IF NOT FOUND THEN RAISE EXCEPTION 'Licence is not active'; END IF;
END $$;
REVOKE ALL ON FUNCTION public.licence_copy_status(text) FROM public;
REVOKE ALL ON FUNCTION public.set_licence_risk(text,text,numeric,integer,boolean) FROM public;
GRANT EXECUTE ON FUNCTION public.licence_copy_status(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.set_licence_risk(text,text,numeric,integer,boolean) TO anon, authenticated;