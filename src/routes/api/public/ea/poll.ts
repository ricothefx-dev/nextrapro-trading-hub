import { createFileRoute } from "@tanstack/react-router";

// Called by the client's NEXTRAPRO Receiver EA with their licence key.
// Plain-text format so MQL5 can parse it without a JSON library:
//   RISK|mode|value|max_trades_day|enabled
//   LAST|id                      (first poll: start from now, don't copy old trades)
//   S|id|action|ticket|symbol|side|volume|price|sl|tp
export const Route = createFileRoute("/api/public/ea/poll")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const key = (url.searchParams.get("key") ?? "").trim().toUpperCase();
        const after = Number(url.searchParams.get("after") ?? "0");
        if (!/^NXP-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}$/.test(key) || !Number.isFinite(after) || after < 0) {
          return new Response("ERR|Invalid licence key", { status: 400 });
        }
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data: lic } = await supabaseAdmin.from("licences")
          .select("bot_id,revoked,expires_at,risk_mode,risk_value,max_trades_day,copy_enabled").eq("licence_key", key).maybeSingle();
        if (!lic || lic.revoked || (lic.expires_at && new Date(lic.expires_at) < new Date())) {
          return new Response("ERR|Licence is not active", { status: 403 });
        }
        const lines = [`RISK|${lic.risk_mode}|${lic.risk_value}|${lic.max_trades_day}|${lic.copy_enabled ? 1 : 0}`];
        if (after === 0) {
          const { data } = await supabaseAdmin.from("signals").select("id").eq("bot_id", lic.bot_id).order("id", { ascending: false }).limit(1);
          lines.push(`LAST|${data?.[0]?.id ?? 0}`);
        } else {
          const { data } = await supabaseAdmin.from("signals").select("id,action,ticket,symbol,side,volume,price,sl,tp")
            .eq("bot_id", lic.bot_id).gt("id", after).order("id").limit(50);
          for (const s of data ?? []) lines.push(["S", s.id, s.action, s.ticket, s.symbol, s.side ?? "", s.volume ?? 0, s.price ?? 0, s.sl ?? 0, s.tp ?? 0].join("|"));
        }
        return new Response(lines.join("\n"), { headers: { "content-type": "text/plain", "cache-control": "no-store" } });
      },
    },
  },
});
