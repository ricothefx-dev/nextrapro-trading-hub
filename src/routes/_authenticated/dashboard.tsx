import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { BarChart3, Bot, CalendarDays, Check, Clipboard, Copy, ExternalLink, ImagePlus, Infinity as InfinityIcon, KeyRound, LayoutDashboard, LogOut, Menu, Plus, ShieldCheck, Trash2, TrendingUp, Users, X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { fetchBots, fetchLicences, isActive, resizeImage, type BotRow, type LicenceRow } from "@/lib/mentor-data";
import logo from "@/assets/nextrapro-logo.png";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Mentor Dashboard | NEXTRAPRO" },
      { name: "description", content: "Create your NEXTRAPRO bots, generate licence keys and manage your clients." },
      { property: "og:title", content: "NEXTRAPRO Mentor Dashboard" },
      { property: "og:description", content: "Bot and licence management for NEXTRAPRO mentors." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Section = "Dashboard" | "Generate Key" | "My Bots" | "Licences" | "Affiliate" | "Copy Trading";
const navigation: Array<{ label: Section; icon: typeof LayoutDashboard }> = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "My Bots", icon: Bot },
  { label: "Generate Key", icon: KeyRound },
  { label: "Licences", icon: BarChart3 },
  { label: "Affiliate", icon: Users },
  { label: "Copy Trading", icon: Copy },
];
const MAX = 500;
const today = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

function Index() {
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [section, setSection] = useState<Section>("Dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const bots = useQuery({ queryKey: ["bots"], queryFn: fetchBots });
  const licences = useQuery({ queryKey: ["licences"], queryFn: fetchLicences });
  const refresh = () => qc.invalidateQueries();
  const email = user.email ?? "";

  const logout = async () => { await supabase.auth.signOut(); qc.clear(); navigate({ to: "/" }); };
  const pick = (s: Section) => { setSection(s); setMenuOpen(false); };

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground lg:grid lg:grid-cols-[180px_1fr]">
      {menuOpen && <div className="fixed inset-0 z-40 bg-background/80 lg:hidden" onClick={() => setMenuOpen(false)} aria-hidden="true" />}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-[220px] flex-col border-r border-sidebar-border bg-sidebar transition-transform lg:static lg:w-[180px] lg:translate-x-0 ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-[58px] items-center gap-2 border-b border-sidebar-border px-3">
          <div className="flex size-9 items-center justify-center overflow-hidden rounded-md bg-primary/10"><img src={logo} alt="NEXTRAPRO logo" className="size-14 max-w-none object-contain" /></div>
          <div className="text-sm font-bold">NEXTRA<span className="text-primary">PRO</span></div>
          <Button variant="ghost" size="icon" className="ml-auto lg:hidden" onClick={() => setMenuOpen(false)} aria-label="Close menu"><X /></Button>
        </div>
        <div className="mx-2 mt-4 flex items-center gap-2 rounded-md border border-primary/30 bg-primary/5 p-2">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/15 text-xs font-bold uppercase text-primary">{email.slice(0, 2)}</div>
          <div className="min-w-0 flex-1"><p className="truncate text-[11px] font-semibold">{email}</p><p className="text-[9px] text-primary">Mentor</p></div>
        </div>
        <nav className="mt-4 flex-1">
          {navigation.map(({ label, icon: Icon }) => (
            <Button key={label} variant="ghost" onClick={() => pick(label)} className={`mb-1 h-10 w-full justify-start rounded-none border-l-2 px-3 text-[11px] ${section === label ? "border-primary bg-primary/10 text-primary" : "border-transparent text-sidebar-foreground"}`}><Icon className="size-3.5" />{label}</Button>
          ))}
        </nav>
        <Button variant="ghost" onClick={logout} className="m-2 h-10 justify-start border border-primary/25 text-[11px] text-primary"><LogOut /> Logout</Button>
      </aside>

      <main className="min-w-0">
        <header className="flex h-[58px] items-center border-b border-border px-3 sm:px-5">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMenuOpen(true)} aria-label="Open menu"><Menu /></Button>
          <div className="ml-auto flex items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-[10px]"><CalendarDays className="size-3 text-primary" />{today}</div>
        </header>
        <div className="p-3 sm:p-5">
          {(bots.error || licences.error) && <p className="mb-4 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">Could not load your data: {(bots.error ?? licences.error)?.message}</p>}
          {section === "Dashboard" && <Dashboard bots={bots.data ?? []} licences={licences.data ?? []} userId={user.id} />}
          {section === "My Bots" && <MyBots bots={bots.data ?? []} licences={licences.data ?? []} userId={user.id} onChange={refresh} />}
          {section === "Generate Key" && <GenerateKey bots={bots.data ?? []} used={licences.data?.length ?? 0} onChange={refresh} goBots={() => pick("My Bots")} />}
          {section === "Licences" && <Licences bots={bots.data ?? []} licences={licences.data ?? []} onChange={refresh} />}
          {section === "Affiliate" && <EmptyPanel icon={Users} title="Affiliate program" text="Affiliate commissions are not set up yet. Tell us your commission rules and we will add them." />}
          {section === "Copy Trading" && <CopyTrading bots={bots.data ?? []} />}
        </div>
      </main>
    </div>
  );
}

function PageTitle({ icon: Icon, first, accent }: { icon: typeof KeyRound; first: string; accent: string }) {
  return <div className="mb-4 flex items-center gap-2"><span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground"><Icon className="size-4" /></span><h1 className="text-lg font-bold">{first} <span className="text-primary">{accent}</span></h1></div>;
}
function Label({ children }: { children: React.ReactNode }) { return <span className="mb-2 block text-[9px] font-bold uppercase text-muted-foreground">{children}</span>; }

function Dashboard({ bots, licences, userId }: { bots: BotRow[]; licences: LicenceRow[]; userId: string }) {
  const active = licences.filter(isActive).length;
  const stats = [
    { label: "TOTAL LICENCES", value: licences.length, note: "All time keys generated", icon: KeyRound, tone: "bg-stat-red" },
    { label: "ACTIVE SUBSCRIPTIONS", value: active, note: "Keys not expired or revoked", icon: ShieldCheck, tone: "bg-stat-green" },
    { label: "TOTAL BOTS", value: bots.length, note: "Bots you are licensing", icon: Bot, tone: "bg-stat-blue" },
    { label: "MAXIMUM LICENCES", value: MAX, note: `${Math.max(0, MAX - licences.length)} keys remaining`, icon: InfinityIcon, tone: "bg-stat-orange" },
  ];
  return <>
    <section className="flex items-center gap-4 rounded-lg border border-border bg-card p-5 sm:p-7">
      <div className="flex size-14 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 shadow-[0_0_24px_var(--primary-glow)]"><ShieldCheck className="text-primary" /></div>
      <div><h1 className="text-xl font-bold">Welcome back!</h1><p className="mt-1 text-[11px] text-muted-foreground">You have <span className="text-primary">{active} active licences</span> running on your account.</p><span className="mt-3 inline-flex rounded-full border border-primary/25 bg-primary/10 px-3 py-1.5 text-[9px] text-primary">Mentor ID: {userId.slice(0, 8).toUpperCase()}</span></div>
    </section>
    <section className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{stats.map(({ label, value, note, icon: Icon, tone }) => <div key={label} className={`${tone} min-h-36 rounded-xl p-5 text-stat-foreground shadow-lg`}><div className="flex items-center justify-between"><span className="text-[9px] font-bold">{label}</span><span className="rounded-md bg-stat-foreground/15 p-2"><Icon className="size-4" /></span></div><div className="mt-4 text-3xl font-bold">{value}</div><p className="mt-5 text-[9px] opacity-80">{note}</p></div>)}</section>
  </>;
}

function MyBots({ bots, licences, userId, onChange }: { bots: BotRow[]; licences: LicenceRow[]; userId: string; onChange: () => void }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [busy, setBusy] = useState(false);
  const file = useRef<HTMLInputElement>(null);

  const onFile = async (f?: File) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) { toast.error("Please choose an image file"); return; }
    try { setImage(await resizeImage(f)); } catch (e) { toast.error((e as Error).message); }
  };
  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    const n = name.trim();
    if (!n || n.length > 80) { toast.error("Bot name must be 1–80 characters"); return; }
    if (!image) { toast.error("Add a picture of your bot"); return; }
    setBusy(true);
    const { error } = await supabase.from("bots").insert({ name: n, image_url: image, mentor_id: userId });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success(`${n} created`); setName(""); setImage(""); onChange();
  };
  const remove = async (b: BotRow) => {
    if (!confirm(`Delete ${b.name}? All its licence keys will stop working.`)) return;
    const { error } = await supabase.from("bots").delete().eq("id", b.id);
    if (error) { toast.error(error.message); return; }
    toast.success("Bot deleted"); onChange();
  };

  return <><PageTitle icon={Bot} first="My" accent="Bots" />
    <form onSubmit={create} className="rounded-lg border border-border bg-card p-4">
      <h2 className="text-sm font-bold">Create a new bot</h2><p className="mb-4 text-[10px] text-muted-foreground">Your clients see this name and picture in the app after activating a licence.</p>
      <div className="flex flex-col gap-4 sm:flex-row">
        <button type="button" onClick={() => file.current?.click()} className="flex size-28 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-primary/50 bg-primary/5" aria-label="Upload bot picture">
          {image ? <img src={image} alt="Bot preview" className="size-full object-cover" /> : <ImagePlus className="text-primary" />}
        </button>
        <input ref={file} type="file" accept="image/*" hidden onChange={e => onFile(e.target.files?.[0])} />
        <div className="flex-1 space-y-3"><label className="block"><Label>Bot name</Label><Input value={name} maxLength={80} onChange={e => setName(e.target.value)} placeholder="e.g. Gold Sniper v1" className="h-10 bg-input text-xs" /></label>
          <Button type="submit" disabled={busy}><Plus />{busy ? "Creating…" : "Create bot"}</Button></div>
      </div>
    </form>
    <section className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {bots.length === 0 && <p className="col-span-full rounded-lg border border-border bg-card p-6 text-center text-xs text-muted-foreground">No bots yet. Create your first one above.</p>}
      {bots.map(b => <div key={b.id} className="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
        {b.image_url ? <img src={b.image_url} alt={b.name} className="size-14 rounded-full border border-primary/40 object-cover" /> : <div className="size-14 rounded-full bg-muted" />}
        <div className="min-w-0 flex-1"><p className="truncate font-semibold">{b.name}</p><p className="text-[10px] text-muted-foreground">{licences.filter(l => l.bot_id === b.id).length} keys · {licences.filter(l => l.bot_id === b.id && isActive(l)).length} active</p></div>
        <Button size="icon" variant="outline" onClick={() => remove(b)} aria-label={`Delete ${b.name}`}><Trash2 /></Button>
      </div>)}
    </section></>;
}

const durations: Array<{ label: string; days: number | null }> = [
  { label: "3 days", days: 3 }, { label: "5 days", days: 5 }, { label: "30 days", days: 30 }, { label: "3 months", days: 90 },
  { label: "6 months", days: 180 }, { label: "1 year", days: 365 }, { label: "Lifetime", days: null }, { label: "Custom", days: -1 },
];

function GenerateKey({ bots, used, onChange, goBots }: { bots: BotRow[]; used: number; onChange: () => void; goBots: () => void }) {
  const [botId, setBotId] = useState("");
  const [customer, setCustomer] = useState("");
  const [duration, setDuration] = useState("30 days");
  const [customDate, setCustomDate] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [created, setCreated] = useState<{ key: string; bot: string; expires: string | null } | null>(null);

  if (bots.length === 0) return <><PageTitle icon={KeyRound} first="Generate" accent="Licence Key" /><EmptyPanel icon={Bot} title="Create a bot first" text="A licence key unlocks one of your bots. Create a bot with its picture, then come back here." action="Go to My Bots" onAction={goBots} /></>;

  const generate = async () => {
    const bot = bots.find(b => b.id === botId);
    if (!bot) { toast.error("Choose a bot"); return; }
    if (used >= MAX) { toast.error("You have reached your licence limit"); return; }
    const d = durations.find(x => x.label === duration)!;
    let expires: string | null = null;
    if (d.days === -1) {
      if (!customDate) { toast.error("Pick an expiry date"); return; }
      const dt = new Date(`${customDate}T23:59:59`);
      if (dt <= new Date()) { toast.error("Expiry date must be in the future"); return; }
      expires = dt.toISOString();
    } else if (d.days) expires = new Date(Date.now() + d.days * 86400000).toISOString();
    setBusy(true);
    const { data, error } = await supabase.from("licences").insert({ bot_id: bot.id, customer_name: customer.trim().slice(0, 100) || null, expires_at: expires }).select("licence_key").single();
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    setCreated({ key: data.licence_key, bot: bot.name, expires }); setConfirmed(false); setCustomer(""); onChange();
  };

  return <><PageTitle icon={KeyRound} first="Generate" accent="Licence Key" />
    {created && <CreatedKey {...created} onClose={() => setCreated(null)} />}
    <section className="space-y-4 rounded-lg border border-border bg-card p-4">
      <div><Label>Choose your bot</Label><div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">{bots.map(b => <button key={b.id} type="button" onClick={() => setBotId(b.id)} className={`flex items-center gap-3 rounded-md border p-2 text-left text-xs ${botId === b.id ? "border-primary bg-primary/10" : "border-border bg-secondary"}`}>{b.image_url && <img src={b.image_url} alt="" className="size-9 rounded-full object-cover" />}<span className="truncate font-semibold">{b.name}</span>{botId === b.id && <Check className="ml-auto size-4 text-primary" />}</button>)}</div></div>
      <label className="block"><Label>Client name (optional)</Label><Input value={customer} maxLength={100} onChange={e => setCustomer(e.target.value)} placeholder="Who is this key for?" className="h-10 bg-input text-xs" /></label>
      <div><Label>Expiry</Label><div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{durations.map(d => <Button key={d.label} type="button" variant="outline" onClick={() => setDuration(d.label)} className={`h-12 text-xs ${duration === d.label ? "border-primary bg-primary/10 text-primary" : "bg-secondary"}`}>{d.label}</Button>)}</div>
        {duration === "Custom" && <Input type="date" value={customDate} onChange={e => setCustomDate(e.target.value)} className="mt-2 h-10 max-w-xs bg-input text-xs" />}</div>
      <label className="flex items-center gap-3 rounded-md border border-border bg-secondary p-3 text-[10px]"><Checkbox checked={confirmed} onCheckedChange={v => setConfirmed(v === true)} />I confirm that I want to generate this licence key</label>
      <Button disabled={!confirmed || busy || !botId} onClick={generate} className="w-full"><KeyRound />{busy ? "Generating…" : "Generate Licence Key"}</Button>
    </section></>;
}

function CopyBtn({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return <Button size="sm" variant="outline" onClick={async () => { await navigator.clipboard.writeText(text); setDone(true); toast.success("Copied"); setTimeout(() => setDone(false), 1500); }}>{done ? <Check /> : <Clipboard />}{done ? "Copied" : "Copy"}</Button>;
}

function CreatedKey({ key: k, bot, expires, onClose }: { key: string; bot: string; expires: string | null; onClose: () => void }) {
  const message = `Your NEXTRAPRO licence for ${bot}\nKey: ${k}\nExpires: ${expires ? new Date(expires).toLocaleDateString() : "Never"}\nOpen the NEXTRAPRO app, tap Activate licence and paste this key.`;
  return <section className="mb-4 rounded-lg border border-primary/40 bg-primary/5 p-4">
    <div className="flex items-center justify-between"><p className="text-xs font-bold text-primary">Licence key ready</p><Button size="icon" variant="ghost" onClick={onClose} aria-label="Close"><X /></Button></div>
    <div className="mt-2 flex items-center gap-2 rounded-md border border-border bg-background p-2"><code className="min-w-0 flex-1 truncate font-mono text-sm">{k}</code><CopyBtn text={k} /></div>
    <p className="mt-2 text-[10px] text-muted-foreground">Send this key to your client. They paste it in the app under "Activate licence" to unlock {bot}.</p>
    <div className="mt-3 flex flex-wrap gap-2"><CopyBtn text={message} />
      <Button size="sm" variant="outline" asChild><a href={`https://wa.me/?text=${encodeURIComponent(message)}`} target="_blank" rel="noreferrer">Send on WhatsApp<ExternalLink /></a></Button></div>
  </section>;
}

function Licences({ bots, licences, onChange }: { bots: BotRow[]; licences: LicenceRow[]; onChange: () => void }) {
  const name = (id: string) => bots.find(b => b.id === id)?.name ?? "—";
  const toggle = async (l: LicenceRow) => {
    const { error } = await supabase.from("licences").update({ revoked: !l.revoked }).eq("id", l.id);
    if (error) { toast.error(error.message); return; }
    onChange();
  };
  return <><PageTitle icon={BarChart3} first="Your" accent="Licences" />
    <section className="overflow-x-auto rounded-lg border border-border bg-card">
      {licences.length === 0 ? <p className="p-6 text-center text-xs text-muted-foreground">No licence keys yet.</p> :
      <table className="w-full min-w-[640px] text-left text-[11px]"><thead className="text-[9px] uppercase text-muted-foreground"><tr>{["Key", "Bot", "Client", "Expires", "Status", ""].map(h => <th key={h} className="p-3">{h}</th>)}</tr></thead>
        <tbody>{licences.map(l => <tr key={l.id} className="border-t border-border">
          <td className="p-3 font-mono">{l.licence_key}</td><td className="p-3">{name(l.bot_id)}</td><td className="p-3">{l.customer_name ?? "—"}</td>
          <td className="p-3">{l.expires_at ? new Date(l.expires_at).toLocaleDateString() : "Lifetime"}</td>
          <td className="p-3"><span className={`rounded-full px-2 py-1 text-[9px] ${isActive(l) ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"}`}>{l.revoked ? "Revoked" : isActive(l) ? (l.activated_at ? "Active · in use" : "Active · unused") : "Expired"}</span></td>
          <td className="flex gap-2 p-3"><CopyBtn text={l.licence_key} /><Button size="sm" variant="outline" onClick={() => toggle(l)}>{l.revoked ? "Restore" : "Revoke"}</Button></td>
        </tr>)}</tbody></table>}
    </section></>;
}

function EmptyPanel({ icon: Icon, title, text, action, onAction }: { icon: typeof Users; title: string; text: string; action?: string; onAction?: () => void }) {
  return <section className="flex min-h-72 flex-col items-center justify-center rounded-lg border border-border bg-card p-7 text-center"><div className="flex size-14 items-center justify-center rounded-full border border-primary/25 bg-primary/10"><Icon className="text-primary" /></div><h2 className="mt-5 text-base font-bold">{title}</h2><p className="mt-2 max-w-md text-[11px] leading-5 text-muted-foreground">{text}</p>{action && <Button className="mt-5" onClick={onAction}>{action}</Button>}</section>;
}

function CopyTrading({ bots }: { bots: BotRow[] }) {
  const tokens = useQuery({ queryKey: ["ea-tokens"], queryFn: async () => {
    const { data, error } = await supabase.from("bots").select("id,name,ea_token");
    if (error) throw error; return data;
  } });
  const copy = (t: string) => { navigator.clipboard.writeText(t); toast.success("Copied"); };
  return <div className="space-y-4">
    <PageTitle icon={TrendingUp} first="Copy" accent="Trading" />
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-lg border border-border bg-card p-5">
        <h3 className="text-sm font-bold">1. Mentor: Sender EA</h3>
        <p className="mt-2 text-xs text-muted-foreground">Put this on your MT5. Every trade you open, close or change is sent to your clients.</p>
        <Button asChild className="mt-4"><a href="/ea/NEXTRAPRO_Sender.mq5" download>Download Sender EA</a></Button>
      </div>
      <div className="rounded-lg border border-border bg-card p-5">
        <h3 className="text-sm font-bold">2. Client: Receiver EA</h3>
        <p className="mt-2 text-xs text-muted-foreground">Clients put this on their MT5 (PC or VPS) with their licence key. It copies your trades using their own risk.</p>
        <Button asChild className="mt-4"><a href="/ea/NEXTRAPRO_Receiver.mq5" download>Download Receiver EA</a></Button>
      </div>
    </div>
    <div className="rounded-lg border border-border bg-card p-5">
      <h3 className="text-sm font-bold">Your bot EA tokens</h3>
      <p className="mt-1 text-xs text-muted-foreground">Paste a bot's token into the Sender EA. Keep it private.</p>
      <div className="mt-3 space-y-2">
        {bots.length === 0 && <p className="text-xs text-muted-foreground">Create a bot first.</p>}
        {(tokens.data ?? []).map(b => <div key={b.id} className="flex items-center gap-2 rounded-md border border-border p-2">
          <span className="w-32 truncate text-xs font-semibold">{b.name}</span>
          <code className="flex-1 truncate text-[10px] text-muted-foreground">{b.ea_token}</code>
          <Button size="icon" variant="ghost" aria-label="Copy token" onClick={() => copy(b.ea_token)}><Copy /></Button>
        </div>)}
      </div>
    </div>
    <div className="rounded-lg border border-border bg-card p-5 text-xs text-muted-foreground">
      <h3 className="mb-2 text-sm font-bold text-foreground">Setup in MT5</h3>
      <ol className="list-decimal space-y-1 pl-4">
        <li>Open MetaEditor, paste the file into Experts, press Compile.</li>
        <li>Tools → Options → Expert Advisors → tick "Allow WebRequest" and add https://nextra-pro-trader.lovable.app</li>
        <li>Drag the EA onto any chart, turn on Algo Trading, enter the token (mentor) or licence key (client).</li>
        <li>MT5 must stay open — use a VPS for 24/7 copying.</li>
      </ol>
    </div>
  </div>;
}
