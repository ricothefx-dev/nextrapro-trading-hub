import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

// Called by the mentor's NEXTRAPRO Sender EA. Authenticated by the bot's secret EA token.
const schema = z.object({
  action: z.enum(["open", "close", "modify"]),
  ticket: z.coerce.number().int().positive(),
  symbol: z.string().trim().min(1).max(30).regex(/^[A-Za-z0-9._#-]+$/),
  side: z.enum(["buy", "sell"]).optional(),
  volume: z.coerce.number().nonnegative().max(1000).optional(),
  price: z.coerce.number().nonnegative().optional(),
  sl: z.coerce.number().nonnegative().optional(),
  tp: z.coerce.number().nonnegative().optional(),
  ts: z.coerce.number().int().nonnegative().optional(),
});

export const Route = createFileRoute("/api/public/ea/signal")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const token = request.headers.get("x-ea-token") ?? "";
        if (!/^[a-f0-9]{48}$/.test(token)) return new Response("Unauthorized", { status: 401 });
        let body: unknown;
        try {
          const text = await request.text();
          body = Object.fromEntries(new URLSearchParams(text));
        } catch {
          return new Response("Bad request", { status: 400 });
        }
        const parsed = schema.safeParse(body);
        if (!parsed.success) return new Response("Invalid signal", { status: 400 });
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data: bot } = await supabaseAdmin.from("bots").select("id,mentor_id").eq("ea_token", token).maybeSingle();
        if (!bot) return new Response("Unauthorized", { status: 401 });
        const s = parsed.data;
        if (s.action === "open" && !s.side) return new Response("Side required", { status: 400 });
        // Duplicate protection: open/close are unique per ticket; modify is skipped when SL/TP are unchanged.
        const dup = supabaseAdmin.from("signals").select("id,sl,tp").eq("bot_id", bot.id).eq("ticket", s.ticket).eq("action", s.action).order("id", { ascending: false }).limit(1);
        const { data: prev } = await dup;
        const last = prev?.[0];
        if (last && (s.action !== "modify" || (Number(last.sl ?? 0) === (s.sl || 0) && Number(last.tp ?? 0) === (s.tp || 0)))) {
          return new Response("OK|DUPLICATE");
        }
        const { error } = await supabaseAdmin.from("signals").insert({
          bot_id: bot.id, mentor_id: bot.mentor_id, action: s.action, ticket: s.ticket, symbol: s.symbol.toUpperCase(),
          side: s.side ?? null, volume: s.volume ?? null, price: s.price ?? null, sl: s.sl || null, tp: s.tp || null,
        });
        if (error) { console.error("signal insert failed", error.message); return new Response("Server error", { status: 500 }); }
        return new Response("OK");
      },
    },
  },
});
