import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BarChart3,
  Bell,
  Bot,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  Clipboard,
  Copy,
  Download,
  ExternalLink,
  Gauge,
  Infinity as InfinityIcon,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  TrendingUp,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import logo from "@/assets/nextrapro-logo.png";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard | NEXTRAPRO" },
      { name: "description", content: "Manage NEXTRAPRO licences, Expert Advisors, affiliates and copy trading." },
      { property: "og:title", content: "NEXTRAPRO Admin Dashboard" },
      { property: "og:description", content: "Licence and Expert Advisor management for NEXTRAPRO." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Section = "Dashboard" | "Generate Key" | "Affiliate" | "Manage EAs" | "Key Stats" | "Copy Trading";

const navigation: Array<{ label: Section; icon: typeof LayoutDashboard; group?: string }> = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Generate Key", icon: KeyRound },
  { label: "Affiliate", icon: Users },
  { label: "Manage EAs", icon: Bot },
  { label: "Key Stats", icon: BarChart3, group: "Management" },
  { label: "Copy Trading", icon: Copy, group: "Trading" },
];

function Index() {
  const [section, setSection] = useState<Section>("Dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const [eaDetail, setEaDetail] = useState(false);
  const [duration, setDuration] = useState("30 days");
  const [confirmed, setConfirmed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [symbol, setSymbol] = useState("");
  const [symbols, setSymbols] = useState(["XAUUSDm"]);

  const selectSection = (label: Section) => {
    setSection(label);
    setEaDetail(false);
    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground lg:grid lg:grid-cols-[164px_1fr]">
      {menuOpen && <div className="fixed inset-0 z-40 bg-background/80 lg:hidden" onClick={() => setMenuOpen(false)} aria-hidden="true" />}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-[220px] flex-col border-r border-sidebar-border bg-sidebar transition-transform lg:static lg:w-[164px] lg:translate-x-0 ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-[58px] items-center gap-2 border-b border-sidebar-border px-3">
          <div className="flex size-9 items-center justify-center overflow-hidden rounded-md bg-primary/10"><img src={logo} alt="NEXTRAPRO logo" className="size-14 max-w-none object-contain" /></div>
          <div className="text-sm font-bold">NEXTRA<span className="text-primary">PRO</span></div>
          <Button variant="ghost" size="icon" className="ml-auto lg:hidden" onClick={() => setMenuOpen(false)} aria-label="Close menu"><X /></Button>
        </div>
        <div className="mx-2 mt-4 flex items-center gap-2 rounded-md border border-primary/30 bg-primary/5 p-2">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/15 text-xs font-bold text-primary">RT</div>
          <div className="min-w-0 flex-1"><p className="truncate text-[11px] font-semibold">ricothefx@...</p><p className="text-[9px] text-primary">Mentor</p></div><ChevronRight className="size-3 text-muted-foreground" />
        </div>
        <nav className="mt-4 flex-1">
          {navigation.map(({ label, icon: Icon, group }, index) => (
            <div key={label}>
              {group && (index === 0 || navigation[index - 1]?.group !== group) && <p className="px-3 pb-2 pt-5 text-[8px] font-bold uppercase text-muted-foreground">{group}</p>}
              <Button variant="ghost" onClick={() => selectSection(label)} className={`mb-1 h-10 w-full justify-start rounded-none border-l-2 px-3 text-[10px] ${section === label ? "border-primary bg-primary/10 text-primary" : "border-transparent text-sidebar-foreground"}`}><Icon className="size-3.5" />{label}</Button>
            </div>
          ))}
        </nav>
        <Button asChild variant="ghost" className="m-2 h-10 justify-start border border-primary/25 text-[10px] text-primary"><Link to="/"><LogOut /> Logout</Link></Button>
      </aside>

      <main className="min-w-0">
        <header className="flex h-[58px] items-center border-b border-border px-3 sm:px-5">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMenuOpen(true)} aria-label="Open menu"><Menu /></Button>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="icon" aria-label="Notifications"><Bell /></Button>
            <div className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-[10px]"><CalendarDays className="size-3 text-primary" />01 Oct 2026</div>
          </div>
        </header>

        <div className="p-3 sm:p-5">
          <Notice />
          {section === "Dashboard" && <Dashboard />}
          {section === "Generate Key" && <GenerateKey duration={duration} setDuration={setDuration} confirmed={confirmed} setConfirmed={setConfirmed} />}
          {section === "Manage EAs" && (eaDetail ? <EaDetail copied={copied} setCopied={setCopied} symbol={symbol} setSymbol={setSymbol} symbols={symbols} setSymbols={setSymbols} /> : <ManageEas onOpen={() => setEaDetail(true)} />)}
          {section === "Affiliate" && <Affiliate />}
          {section === "Key Stats" && <KeyStats />}
          {section === "Copy Trading" && <CopyTrading />}
        </div>
      </main>
    </div>
  );
}

function Notice() {
  return <div className="mb-4 flex flex-col gap-3 rounded-md bg-primary px-4 py-3 text-primary-foreground shadow-[0_10px_35px_var(--primary-glow)] xl:flex-row xl:items-center">
    <div className="min-w-0 flex-1"><p className="text-xs font-bold">NEXTRAPRO tools are moving to the mobile app</p><p className="mt-1 text-[9px] opacity-85">In 30 days, all mentor functions move into the app. Open the app now and get set up before the switch.</p></div>
    <div className="flex flex-wrap items-center gap-1.5">{[["21","DAYS"],["20","HOURS"],["56","MIN"],["44","SEC"]].map(([n,l]) => <div key={l} className="min-w-10 rounded bg-primary-foreground/10 px-2 py-1 text-center"><b className="block text-sm">{n}</b><span className="text-[7px]">{l}</span></div>)}<Button size="sm" className="ml-1 bg-primary-foreground text-primary hover:bg-primary-foreground/90">Open the app</Button><span className="ml-1 text-[8px]">Android: coming soon</span></div>
  </div>;
}

function Dashboard() {
  const stats = [
    { label: "TOTAL LICENCES", value: "0", note: "All time EA users", icon: KeyRound, tone: "bg-stat-red" },
    { label: "ACTIVE SUBSCRIPTIONS", value: "0", note: "Current active EA users", icon: ShieldCheck, tone: "bg-stat-green" },
    { label: "TOTAL EAS", value: "0", note: "EAs you are licencing", icon: Bot, tone: "bg-stat-blue" },
    { label: "MAXIMUM LICENCES", value: "500", note: "Total licences you can generate", icon: InfinityIcon, tone: "bg-stat-orange" },
  ];
  return <>
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-5"><span className="rounded-full border border-success/25 bg-success/10 px-3 py-2 text-[9px] text-success">● All systems running smoothly</span><span className="rounded-full border border-border bg-card px-3 py-2 text-[9px]"><CalendarDays className="mr-2 inline size-3 text-primary" />Today — 01 Oct 2026</span></div>
    <section className="flex items-center gap-4 rounded-lg border border-border bg-card p-5 sm:p-7">
      <div className="flex size-14 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 shadow-[0_0_24px_var(--primary-glow)]"><ShieldCheck className="text-primary" /></div>
      <div><h1 className="text-xl font-bold">Welcome back!</h1><p className="mt-1 text-[11px] text-muted-foreground">You have <span className="text-primary">0 active licences</span> running on your account.</p><span className="mt-3 inline-flex rounded-full border border-primary/25 bg-primary/10 px-3 py-1.5 text-[9px] text-primary">Mentor ID: 14384</span></div>
    </section>
    <section className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{stats.map(({ label, value, note, icon: Icon, tone }) => <div key={label} className={`${tone} min-h-36 rounded-xl p-5 text-stat-foreground shadow-lg`}><div className="flex items-center justify-between"><span className="text-[9px] font-bold">{label}</span><span className="rounded-md bg-stat-foreground/15 p-2"><Icon className="size-4" /></span></div><div className="mt-4 text-3xl font-bold">{value}</div><p className="mt-5 text-[9px] opacity-80">{note}</p>{label === "MAXIMUM LICENCES" && <Button size="sm" className="mt-3 w-full border border-stat-foreground/40 bg-stat-foreground/10 text-stat-foreground hover:bg-stat-foreground/20">Request More Keys</Button>}</div>)}</section>
  </>;
}

function PageTitle({ icon: Icon, first, accent }: { icon: typeof KeyRound; first: string; accent: string }) {
  return <div className="mb-4 flex items-center gap-2"><span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground"><Icon className="size-4" /></span><h1 className="text-lg font-bold">{first} <span className="text-primary">{accent}</span></h1></div>;
}

function Field({ label, placeholder }: { label: string; placeholder: string }) {
  return <label className="block"><span className="mb-2 block text-[8px] font-bold uppercase text-muted-foreground">{label}</span><Input placeholder={placeholder} className="h-9 border-border bg-input text-[10px]" /></label>;
}

function GenerateKey({ duration, setDuration, confirmed, setConfirmed }: { duration: string; setDuration: (v: string) => void; confirmed: boolean; setConfirmed: (v: boolean) => void }) {
  const durations = ["3 days", "5 days", "30 days", "3 months", "6 months", "1 year", "Lifetime"];
  return <><PageTitle icon={KeyRound} first="Generate" accent="License Key" /><section className="overflow-hidden rounded-lg border border-border bg-card"><div className="flex items-center gap-3 border-b border-border p-4"><span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground"><KeyRound className="size-4" /></span><div><h2 className="text-xs font-bold">New License Key</h2><p className="text-[8px] text-muted-foreground">Enter user details and select the EA to authorize</p></div></div><div className="space-y-4 p-4">
    <Field label="User name" placeholder="Enter the user's name" /><Field label="Customer email" placeholder="The key is emailed here" /><Field label="Select EA" placeholder="Choose an Expert Advisor" />
    <div><p className="mb-2 text-[8px] font-bold uppercase text-muted-foreground">License duration</p><div className="grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-7">{durations.map(d => <Button key={d} variant="outline" onClick={() => setDuration(d)} className={`h-14 flex-col gap-1 text-xs ${duration === d ? "border-primary bg-primary/10 text-primary" : "bg-secondary"}`}>{d === "Lifetime" ? <InfinityIcon /> : <b>{d.split(" ")[0]}</b>}<span className="text-[7px] uppercase text-muted-foreground">{d.split(" ")[1] ?? "lifetime"}</span></Button>)}</div></div>
    <div className="rounded-md border border-info/30 bg-info/10 p-3 text-[9px] text-info">The license key will be generated automatically and can be shared with the user.</div>
    <div className="rounded-md border border-primary/25 bg-primary/5 p-3 text-[9px] text-muted-foreground"><Users className="mr-2 inline size-3 text-primary" /><span className="font-semibold text-primary">Earn as an affiliate:</span> share your referral code with this user and earn commission.</div>
    <label className="flex items-center gap-3 rounded-md border border-border bg-secondary p-3 text-[9px]"><Checkbox checked={confirmed} onCheckedChange={v => setConfirmed(v === true)} />I confirm that I want to generate this license key</label>
    <Button disabled={!confirmed} className="w-full"><KeyRound />Generate License Key</Button>
  </div></section></>;
}

function ManageEas({ onOpen }: { onOpen: () => void }) {
  return <><PageTitle icon={Bot} first="Manage" accent="Expert Advisors" /><section className="rounded-lg border border-border bg-card p-4"><h2 className="text-sm font-bold">New EA</h2><p className="mb-4 text-[9px] text-muted-foreground">Add a new Expert Advisor to licence</p><Field label="EA name" placeholder="Full EA name including version" /><label className="mt-3 flex items-center gap-3 rounded-md border border-border bg-secondary p-3 text-[9px]"><Checkbox />I confirm that I am an admin</label><div className="mt-4 flex gap-2"><Button size="sm"><Plus />Add EA</Button><Button variant="outline" size="sm">Cancel</Button></div></section>
  <section className="mt-3 overflow-hidden rounded-lg border border-border bg-card"><div className="border-b border-border p-4"><h2 className="text-sm font-bold">Your Expert Advisors</h2><p className="text-[9px] text-muted-foreground">All EAs registered under your account</p></div><div className="grid grid-cols-[1.5fr_.7fr_.7fr_1fr_auto] items-center gap-2 px-4 py-3 text-[8px] text-muted-foreground"><span>EA</span><span>USERS</span><span>ACTIVE</span><span>CREATED</span><span>ACTIONS</span></div><div className="grid grid-cols-[1.5fr_.7fr_.7fr_1fr_auto] items-center gap-2 border-t border-border px-4 py-3 text-[9px]"><button className="text-left font-semibold text-primary" onClick={onOpen}>Matrix Scalper AI</button><b>3</b><span className="w-fit rounded-full bg-primary/10 px-2 py-1 text-primary">0</span><span className="w-fit rounded-full bg-warning/15 px-2 py-1 text-warning">2026-07-22</span><Button size="sm" variant="outline" onClick={onOpen}>View</Button></div></section></>;
}

function EaDetail({ copied, setCopied, symbol, setSymbol, symbols, setSymbols }: { copied: boolean; setCopied: (v: boolean) => void; symbol: string; setSymbol: (v: string) => void; symbols: string[]; setSymbols: (v: string[]) => void }) {
  const addSymbol = () => { const value = symbol.trim().toUpperCase(); if (value && !symbols.includes(value)) setSymbols([...symbols, value]); setSymbol(""); };
  return <><section className="overflow-hidden rounded-lg border border-primary/25 bg-card"><div className="bg-detail-banner p-4"><div className="flex items-center justify-between"><div><p className="text-[8px] uppercase opacity-70">Expert Advisor</p><h1 className="mt-1 text-lg font-bold">Matrix Scalper AI</h1></div><span className="rounded-full border border-warning/35 bg-warning/15 px-3 py-1 text-[8px] text-warning">Keep code private</span></div><div className="mt-4 flex items-center rounded-md border border-detail-foreground/25 bg-detail-foreground/10 p-2"><code className="min-w-0 flex-1 truncate text-[9px]">f8b9c58a3a24f8b2987c3ca636d4949</code><Button size="sm" onClick={() => setCopied(true)} className="bg-detail-foreground/10 text-detail-foreground hover:bg-detail-foreground/20">{copied ? <Check /> : <Clipboard />}{copied ? "Copied" : "Copy"}</Button></div></div><div className="grid gap-4 p-4 lg:grid-cols-[1.1fr_1fr]"><p className="text-[9px] leading-5 text-muted-foreground">This is the EA code for <b className="text-foreground">Matrix Scalper AI</b>. Embed this inside your Expert Advisor source code. Do not share this secret code with anyone.</p><div className="space-y-2"><Button variant="outline" className="w-full justify-start text-[9px]"><Download className="text-info" />Download Self Hosting Files</Button><Button variant="outline" className="w-full justify-start border-primary/25 text-[9px] text-primary"><Trash2 />Delete this EA</Button></div></div></section>
  <section className="mt-3 overflow-hidden rounded-lg border border-border bg-card"><div className="flex items-center justify-between border-b border-border p-4"><div><h2 className="text-sm font-bold">Symbols</h2><p className="text-[9px] text-muted-foreground">Add trading symbols to Matrix Scalper AI</p></div><span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[8px] text-primary">{symbols.length} active</span></div><div className="flex gap-2 border-b border-border p-4"><Input value={symbol} onChange={e => setSymbol(e.target.value)} placeholder="e.g. USDMXN" className="h-8 max-w-xs bg-input text-[9px]" /><Button size="sm" onClick={addSymbol}><Plus />Add</Button></div><div className="p-4"><p className="mb-3 text-[8px] font-bold uppercase text-muted-foreground">Active symbols</p>{symbols.map(s => <div key={s} className="flex items-center border-t border-border py-3 text-[9px]"><span className="mr-2 size-1.5 rounded-full bg-primary" />{s}<Button variant="outline" size="sm" className="ml-auto" onClick={() => setSymbols(symbols.filter(item => item !== s))}>Remove</Button></div>)}<div className="mt-3 flex items-center gap-2 rounded-md border border-border bg-secondary px-3"><Search className="size-3 text-muted-foreground" /><Input placeholder="Search symbols (e.g. GOLD, NASDAQ, BTC...)" className="border-0 bg-transparent text-[9px] shadow-none" /></div>{["Forex major", "Forex minor", "Forex exotic", "Metals"].map((name, i) => <div key={name} className="flex items-center border-b border-border px-2 py-3 text-[8px] uppercase text-muted-foreground"><ChevronDown className="mr-2 size-3" />{name}<span className="ml-auto">{[27,40,40,24][i]}</span></div>)}</div></section></>;
}

function Affiliate() { return <><PageTitle icon={Users} first="Affiliate" accent="Program" /><EmptyPanel icon={Users} title="Your referral code" text="Share your unique NEXTRAPRO referral link and track commissions from every active renewal." action="Copy referral link" /></>; }
function KeyStats() { return <><PageTitle icon={BarChart3} first="License" accent="Statistics" /><div className="grid gap-3 sm:grid-cols-3"><MiniStat label="Keys generated" value="3" /><MiniStat label="Active this month" value="2" /><MiniStat label="Conversion rate" value="66.7%" /></div><div className="mt-3 h-64 rounded-lg border border-border bg-card p-5"><p className="text-xs font-bold">Key activity</p><div className="mt-8 flex h-36 items-end gap-3">{[35,62,48,82,56,92,68].map((h,i) => <div key={i} className="flex-1 rounded-t bg-primary/80" style={{height:`${h}%`}} />)}</div></div></>; }
function CopyTrading() { return <><PageTitle icon={Copy} first="Copy" accent="Trading" /><EmptyPanel icon={TrendingUp} title="Copy trading desk" text="Monitor connected strategies and manage automated trade execution from one place." action="Connect an account" /></>; }
function MiniStat({ label, value }: { label: string; value: string }) { return <div className="rounded-lg border border-border bg-card p-5"><p className="text-[9px] uppercase text-muted-foreground">{label}</p><p className="mt-4 text-3xl font-bold text-primary">{value}</p></div>; }
function EmptyPanel({ icon: Icon, title, text, action }: { icon: typeof Users; title: string; text: string; action: string }) { return <section className="flex min-h-72 flex-col items-center justify-center rounded-lg border border-border bg-card p-7 text-center"><div className="flex size-14 items-center justify-center rounded-full border border-primary/25 bg-primary/10"><Icon className="text-primary" /></div><h2 className="mt-5 text-base font-bold">{title}</h2><p className="mt-2 max-w-md text-[10px] leading-5 text-muted-foreground">{text}</p><Button className="mt-5">{action}<ExternalLink /></Button></section>; }