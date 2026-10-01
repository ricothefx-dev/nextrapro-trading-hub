import { createFileRoute } from "@tanstack/react-router";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  Bot,
  ChevronDown,
  CircleDollarSign,
  Copy,
  Gauge,
  HelpCircle,
  LayoutDashboard,
  LineChart,
  Menu,
  MoreHorizontal,
  Power,
  Search,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/nextrapro-logo.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Copy Trading Dashboard | NEXTRAPRO" },
      { name: "description", content: "Monitor, control and grow your automated copy-trading portfolio with NEXTRAPRO." },
      { property: "og:title", content: "NEXTRAPRO Copy Trading" },
      { property: "og:description", content: "A focused command center for automated copy trading." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const navItems = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Copy Trading", icon: Copy, active: true },
  { label: "Strategies", icon: LineChart },
  { label: "Accounts", icon: Wallet },
  { label: "Analytics", icon: BarChart3 },
];

const leaders = [
  { name: "Apex Momentum", handle: "@apex.fx", return: "+18.42%", risk: "Medium", followers: "1,284", drawdown: "4.8%", initials: "AM" },
  { name: "Orion Quant", handle: "@orion.quant", return: "+14.19%", risk: "Low", followers: "932", drawdown: "2.1%", initials: "OQ" },
  { name: "Northstar Gold", handle: "@northstar", return: "+11.86%", risk: "High", followers: "647", drawdown: "8.6%", initials: "NG" },
];

function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [copying, setCopying] = useState(true);
  const [range, setRange] = useState("1M");

  return (
    <div className="min-h-screen bg-background text-foreground lg:grid lg:grid-cols-[244px_1fr]">
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-[244px] flex-col border-r border-sidebar-border bg-sidebar transition-transform lg:static lg:translate-x-0 ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-20 items-center justify-between border-b border-sidebar-border px-5">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center overflow-hidden rounded-md bg-secondary">
              <img src={logo} alt="NEXTRAPRO" width={1024} height={1024} className="size-16 max-w-none object-contain" />
            </div>
            <div><div className="text-sm font-bold">NEXTRAPRO</div><div className="text-[10px] font-medium uppercase text-muted-foreground">Trading desk</div></div>
          </div>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMenuOpen(false)} aria-label="Close menu"><X /></Button>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-6">
          <p className="px-3 pb-2 text-[10px] font-semibold uppercase text-muted-foreground">Workspace</p>
          {navItems.map(({ label, icon: Icon, active }) => (
            <Button key={label} variant="ghost" className={`h-11 w-full justify-start px-3 ${active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground"}`}>
              <Icon />{label}{active && <span className="ml-auto size-1.5 rounded-full bg-primary" />}
            </Button>
          ))}
          <p className="px-3 pb-2 pt-7 text-[10px] font-semibold uppercase text-muted-foreground">Manage</p>
          <Button variant="ghost" className="h-11 w-full justify-start px-3 text-sidebar-foreground"><Users /> Community</Button>
          <Button variant="ghost" className="h-11 w-full justify-start px-3 text-sidebar-foreground"><Settings /> Settings</Button>
        </nav>
        <div className="m-3 border border-sidebar-border bg-secondary p-4">
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold"><ShieldCheck className="text-primary" /> Protection active</div>
          <p className="text-[11px] leading-5 text-muted-foreground">Equity guard is monitoring your copied positions.</p>
        </div>
        <div className="flex items-center gap-3 border-t border-sidebar-border p-4">
          <div className="flex size-9 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">RT</div>
          <div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold">Rico Thefx</p><p className="text-[10px] text-muted-foreground">Pro account</p></div>
          <MoreHorizontal className="size-4 text-muted-foreground" />
        </div>
      </aside>

      <main className="min-w-0">
        <header className="flex h-20 items-center gap-3 border-b border-border px-4 sm:px-7">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMenuOpen(true)} aria-label="Open menu"><Menu /></Button>
          <div className="hidden items-center gap-2 text-sm text-muted-foreground sm:flex"><span>Workspace</span><span>/</span><span className="text-foreground">Copy Trading</span></div>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="sm" className="hidden sm:flex"><HelpCircle /> Support</Button>
            <Button variant="outline" size="icon" aria-label="Notifications"><Bell /></Button>
            <Button size="sm"><CircleDollarSign /> Deposit</Button>
          </div>
        </header>

        <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-7 sm:py-8">
          <section className="mb-7 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div><p className="mb-2 text-xs font-semibold uppercase text-primary">Copy desk</p><h1 className="text-3xl font-bold sm:text-4xl">Your strategy, multiplied.</h1><p className="mt-2 max-w-2xl text-sm text-muted-foreground">Follow proven traders, control your exposure, and monitor every copied position from one focused workspace.</p></div>
            <div className="flex gap-2"><Button variant="outline"><SlidersHorizontal /> Risk controls</Button><Button><Search /> Find a trader</Button></div>
          </section>

          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[
              ["Portfolio value", "$24,680.40", "+4.82%", Wallet],
              ["Copy profit", "+$2,184.12", "+$286 this week", ArrowUpRight],
              ["Active strategies", "03", "Across 4 markets", Activity],
              ["Risk allocation", "38%", "Within your limit", Gauge],
            ].map(([label, value, foot, Icon]) => (
              <div key={String(label)} className="border border-border bg-card p-5">
                <div className="flex items-center justify-between"><span className="text-xs text-muted-foreground">{label as string}</span><Icon className="size-4 text-primary" /></div>
                <div className="mt-5 text-2xl font-bold">{value as string}</div><div className="mt-2 text-[11px] text-muted-foreground">{foot as string}</div>
              </div>
            ))}
          </section>

          <section className="mt-3 grid gap-3 xl:grid-cols-[1.65fr_1fr]">
            <div className="border border-border bg-card p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div><h2 className="font-semibold">Copy performance</h2><p className="mt-1 text-xs text-muted-foreground">Net result from followed strategies</p></div>
                <div className="flex border border-border bg-secondary p-1">{["1W", "1M", "3M", "1Y"].map(item => <Button key={item} size="sm" variant="ghost" onClick={() => setRange(item)} className={range === item ? "bg-background text-foreground" : "text-muted-foreground"}>{item}</Button>)}</div>
              </div>
              <div className="mt-7 flex items-end justify-between"><div><span className="text-3xl font-bold">+$2,184.12</span><span className="ml-3 text-xs font-semibold text-success">+9.72%</span></div><span className="text-[11px] text-muted-foreground">{range} view</span></div>
              <div className="relative mt-5 h-56 overflow-hidden border-b border-border bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:20%_25%]">
                <svg viewBox="0 0 800 220" preserveAspectRatio="none" className="absolute inset-0 size-full" aria-label="Performance increased over the selected period" role="img">
                  <defs><linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="var(--primary)" stopOpacity=".32"/><stop offset="1" stopColor="var(--primary)" stopOpacity="0"/></linearGradient></defs>
                  <path d="M0 180 C55 174 70 140 125 148 S210 178 255 124 S332 102 375 116 S452 88 493 94 S566 52 610 68 S690 22 800 30 L800 220 L0 220 Z" fill="url(#area)" />
                  <path d="M0 180 C55 174 70 140 125 148 S210 178 255 124 S332 102 375 116 S452 88 493 94 S566 52 610 68 S690 22 800 30" fill="none" stroke="var(--primary)" strokeWidth="3" />
                </svg>
              </div>
            </div>

            <div className="border border-border bg-card p-5 sm:p-6">
              <div className="flex items-start justify-between"><div><h2 className="font-semibold">Copy engine</h2><p className="mt-1 text-xs text-muted-foreground">Live execution status</p></div><span className={`mt-1 size-2 rounded-full ${copying ? "animate-pulse-dot bg-success" : "bg-muted-foreground"}`} /></div>
              <div className="my-7 flex items-center justify-center"><div className="relative flex size-32 items-center justify-center rounded-full border border-primary/30 bg-accent"><Bot className="size-11 text-primary" /><div className="absolute inset-3 rounded-full border border-primary/20" /></div></div>
              <div className="text-center"><p className="text-lg font-semibold">{copying ? "Copying is active" : "Copying is paused"}</p><p className="mt-1 text-xs text-muted-foreground">{copying ? "3 strategies synced · 12 positions" : "No new trades will be copied"}</p></div>
              <Button className="mt-6 h-11 w-full" variant={copying ? "outline" : "default"} onClick={() => setCopying(!copying)}><Power /> {copying ? "Pause copy engine" : "Resume copy engine"}</Button>
              <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-xs"><span className="text-muted-foreground">Execution latency</span><span className="font-semibold text-success">24 ms</span></div>
            </div>
          </section>

          <section className="mt-3 border border-border bg-card">
            <div className="flex flex-col gap-3 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-semibold">Top strategy leaders</h2><p className="mt-1 text-xs text-muted-foreground">Ranked by consistent risk-adjusted performance</p></div><Button variant="ghost" size="sm">View all <ArrowUpRight /></Button></div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-xs">
                <thead className="text-muted-foreground"><tr className="border-b border-border"><th className="px-5 py-3 font-medium">Trader</th><th className="px-5 py-3 font-medium">30D return</th><th className="px-5 py-3 font-medium">Risk</th><th className="px-5 py-3 font-medium">Drawdown</th><th className="px-5 py-3 font-medium">Copiers</th><th className="px-5 py-3 font-medium"></th></tr></thead>
                <tbody>{leaders.map((leader) => <tr key={leader.name} className="border-b border-border last:border-0 hover:bg-secondary/50"><td className="px-5 py-4"><div className="flex items-center gap-3"><div className="flex size-9 items-center justify-center rounded-full bg-accent font-bold text-primary">{leader.initials}</div><div><p className="font-semibold">{leader.name}</p><p className="mt-0.5 text-[10px] text-muted-foreground">{leader.handle}</p></div></div></td><td className="px-5 py-4 font-semibold text-success">{leader.return}</td><td className="px-5 py-4"><span className="border border-border bg-secondary px-2 py-1">{leader.risk}</span></td><td className="px-5 py-4">{leader.drawdown}</td><td className="px-5 py-4">{leader.followers}</td><td className="px-5 py-4 text-right"><Button size="sm">Copy</Button></td></tr>)}</tbody>
              </table>
            </div>
          </section>

          <section className="mt-3 grid gap-3 md:grid-cols-2">
            <div className="flex items-center gap-4 border border-border bg-card p-5"><div className="flex size-10 items-center justify-center rounded-full bg-accent"><ArrowUpRight className="text-primary" /></div><div><p className="text-xs text-muted-foreground">Best position</p><p className="mt-1 text-sm font-semibold">XAUUSD · +$384.20</p></div><span className="ml-auto text-xs text-success">+6.2%</span></div>
            <div className="flex items-center gap-4 border border-border bg-card p-5"><div className="flex size-10 items-center justify-center rounded-full bg-secondary"><ArrowDownRight className="text-destructive" /></div><div><p className="text-xs text-muted-foreground">Equity guard</p><p className="mt-1 text-sm font-semibold">Daily loss limit</p></div><span className="ml-auto text-xs text-muted-foreground">2.1 / 5%</span></div>
          </section>
        </div>
      </main>
    </div>
  );
}
