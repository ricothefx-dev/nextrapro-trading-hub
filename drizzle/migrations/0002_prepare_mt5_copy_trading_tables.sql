CREATE TYPE public.app_role AS ENUM ('admin', 'provider', 'client');

CREATE TABLE public.user_profiles (
  user_id uuid PRIMARY KEY,
  full_name text,
  email text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
REVOKE ALL ON TABLE public.user_profiles FROM PUBLIC, anon, authenticated;
GRANT SELECT ON TABLE public.user_profiles TO authenticated;
GRANT INSERT (user_id, full_name) ON TABLE public.user_profiles TO authenticated;
GRANT UPDATE (full_name) ON TABLE public.user_profiles TO authenticated;
GRANT ALL ON TABLE public.user_profiles TO service_role;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users read own profile" ON public.user_profiles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "users create own profile" ON public.user_profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users update own profile name" ON public.user_profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
REVOKE ALL ON TABLE public.user_roles FROM PUBLIC, anon, authenticated;
GRANT SELECT ON TABLE public.user_roles TO authenticated;
GRANT ALL ON TABLE public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_app_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;
REVOKE ALL ON FUNCTION public.has_app_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_app_role(uuid, public.app_role) TO authenticated, service_role;

CREATE TABLE public.provider_accounts (
  provider_id uuid PRIMARY KEY,
  provider_name text NOT NULL,
  unique_ea_code text NOT NULL UNIQUE DEFAULT encode(extensions.gen_random_bytes(24), 'hex'),
  connection_status text NOT NULL DEFAULT 'disconnected' CHECK (connection_status IN ('pending', 'connected', 'disconnected', 'error')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
REVOKE ALL ON TABLE public.provider_accounts FROM PUBLIC, anon, authenticated;
GRANT SELECT ON TABLE public.provider_accounts TO authenticated;
GRANT ALL ON TABLE public.provider_accounts TO service_role;
ALTER TABLE public.provider_accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "providers read own provider account" ON public.provider_accounts FOR SELECT TO authenticated USING (auth.uid() = provider_id AND public.has_app_role(auth.uid(), 'provider'));

CREATE TABLE public.client_mt5_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL,
  unique_connection_code text NOT NULL UNIQUE DEFAULT encode(extensions.gen_random_bytes(24), 'hex'),
  broker_name text,
  mt5_account_number text,
  connection_status text NOT NULL DEFAULT 'disconnected' CHECK (connection_status IN ('pending', 'connected', 'disconnected', 'error')),
  last_heartbeat timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
REVOKE ALL ON TABLE public.client_mt5_connections FROM PUBLIC, anon, authenticated;
GRANT SELECT ON TABLE public.client_mt5_connections TO authenticated;
GRANT ALL ON TABLE public.client_mt5_connections TO service_role;
ALTER TABLE public.client_mt5_connections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "clients read own mt5 connections" ON public.client_mt5_connections FOR SELECT TO authenticated USING (auth.uid() = client_id);
CREATE INDEX client_mt5_connections_client_idx ON public.client_mt5_connections(client_id);

CREATE TABLE public.trade_signals (
  id bigserial PRIMARY KEY,
  provider_id uuid NOT NULL REFERENCES public.provider_accounts(provider_id),
  master_ticket bigint NOT NULL,
  action text NOT NULL CHECK (action IN ('open', 'modify', 'close')),
  symbol text NOT NULL CHECK (char_length(symbol) BETWEEN 1 AND 30),
  direction text NOT NULL CHECK (direction IN ('buy', 'sell')),
  lot_size numeric NOT NULL CHECK (lot_size > 0),
  entry_price numeric,
  stop_loss numeric,
  take_profit numeric,
  created_at timestamptz NOT NULL DEFAULT now()
);
REVOKE ALL ON TABLE public.trade_signals FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT ON TABLE public.trade_signals TO authenticated;
GRANT ALL ON TABLE public.trade_signals TO service_role;
REVOKE ALL ON SEQUENCE public.trade_signals_id_seq FROM PUBLIC, anon;
GRANT USAGE, SELECT ON SEQUENCE public.trade_signals_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.trade_signals_id_seq TO service_role;
ALTER TABLE public.trade_signals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "providers read own trade signals" ON public.trade_signals FOR SELECT TO authenticated USING (auth.uid() = provider_id AND public.has_app_role(auth.uid(), 'provider'));
CREATE POLICY "authorized providers submit own trade signals" ON public.trade_signals FOR INSERT TO authenticated WITH CHECK (
  auth.uid() = provider_id
  AND public.has_app_role(auth.uid(), 'provider')
  AND EXISTS (SELECT 1 FROM public.provider_accounts pa WHERE pa.provider_id = auth.uid())
);
CREATE INDEX trade_signals_provider_created_idx ON public.trade_signals(provider_id, created_at DESC);

CREATE TABLE public.trade_executions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  signal_id bigint NOT NULL REFERENCES public.trade_signals(id),
  client_id uuid NOT NULL,
  client_ticket bigint,
  execution_status text NOT NULL DEFAULT 'pending' CHECK (execution_status IN ('pending', 'executed', 'failed', 'skipped')),
  error_message text,
  execution_timestamp timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
REVOKE ALL ON TABLE public.trade_executions FROM PUBLIC, anon, authenticated;
GRANT SELECT ON TABLE public.trade_executions TO authenticated;
GRANT ALL ON TABLE public.trade_executions TO service_role;
ALTER TABLE public.trade_executions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "clients read own trade executions" ON public.trade_executions FOR SELECT TO authenticated USING (auth.uid() = client_id);
CREATE INDEX trade_executions_client_idx ON public.trade_executions(client_id, created_at DESC);
CREATE INDEX trade_executions_signal_idx ON public.trade_executions(signal_id);
