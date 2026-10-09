import { supabase } from "@/integrations/supabase/client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Activity, ArrowLeft, ArrowRight, Bell, Check, ChevronRight, Home, KeyRound, Play, Plus, ScanLine, Settings, ShieldCheck, Square, Trash2, Upload, Volume2, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import botImage from "@/assets/robot-apex.jpg";

type Screen = "start" | "activate" | "home" | "symbols" | "scanner" | "meta";
type SymbolConfig = { symbol: string; lot: string; execution: string; trades: string };
const initialSymbols = ["EURUSD", "GBPUSD", "USDJPY", "XAUUSD", "US30", "NAS100", "BTCUSD", "ETHUSD"];
function Choice({ value, onChange, options, label }: { value: string; onChange: (value: string) => void; options: string[]; label: string }) {
  return <Select value={value} onValueChange={onChange}><SelectTrigger aria-label={label}><SelectValue placeholder={label} /></SelectTrigger><SelectContent className="trading-theme">{options.map(option => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent></Select>;
}
function Field({ title, children }: { title: string; children: ReactNode }) {
  return <label className="grid gap-2 text-xs font-semibold text-muted-foreground">{title}{children}</label>;
}

export function TradingApp({ onExit }: { onExit: () => void }) {
  const [screen, setScreen] = useState<Screen>("home");
  const [licensed, setLicensed] = useState(false);
  const [robot, setRobot] = useState(false);
  const [running, setRunning] = useState(false);
  const [key, setKey] = useState("");
  const [notice, setNotice] = useState("");
  const [settings, setSettings] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [voice, setVoice] = useState(true);
  const [dark, setDark] = useState(false);
  const [color, setColor] = useState("pink");
  const [shape, setShape] = useState("Circle");
  const [font, setFont] = useState("Modern");
  const [symbolTab, setSymbolTab] = useState("selected");
  const [allowed, setAllowed] = useState(initialSymbols);
  const [configs, setConfigs] = useState<SymbolConfig[]>([]);
  const [editing, setEditing] = useState<SymbolConfig | null>(null);
  const [adding, setAdding] = useState(false);
  const [newSymbol, setNewSymbol] = useState("");
  const [broker, setBroker] = useState("");
  const [server, setServer] = useState("");
  const [accountType, setAccountType] = useState("");
  const [connection, setConnection] = useState<"disconnected" | "connecting" | "connected">("disconnected");
  const [chart, setChart] = useState("");
  const [mode, setMode] = useState("First Scalp");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(false);
  const [customImage, setCustomImage] = useState("");
  const [activating, setActivating] = useState(false);
  const [botName, setBotName] = useState("NEXTRAPRO Assistant");
  const [botImg, setBotImg] = useState("");
  const [expires, setExpires] = useState<string | null>(null);
  const upload = useRef<HTMLInputElement>(null);
  const imageUpload = useRef<HTMLInputElement>(null);
  const scanTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const connectionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (scanTimer.current) clearTimeout(scanTimer.current); if (connectionTimer.current) clearTimeout(connectionTimer.current); }, []);
  const theme = `trading-theme ${dark ? "trading-dark" : ""} trading-${color} ${font === "Technical" ? "font-mono" : ""}`;
  const go = (next: Screen) => { setNotice(""); setScreen(next); setSettings(false); };
  const speak = (name = botName) => { if (voice && "speechSynthesis" in window) window.speechSynthesis.speak(new SpeechSynthesisUtterance(`${name} activated`)); };
  const activate = async (raw: string, silent = false) => {
    const k = raw.trim().toUpperCase();
    if (!k) return;
    setActivating(true);
    const { data, error } = await supabase.rpc("activate_licence", { _key: k });
    setActivating(false);
    const row = data?.[0];
    if (error || !row) {
      if (silent) localStorage.removeItem("nextrapro-licence");
      else setNotice(error?.message ?? "Licence could not be activated.");
      setLicensed(false); setRobot(false); setRunning(false);
      return;
    }
    localStorage.setItem("nextrapro-licence", k);
    setBotName(row.bot_name); setBotImg(row.bot_image ?? ""); setExpires(row.expires_at);
    setLicensed(true); setRobot(true);
    if (!silent) { go("home"); speak(row.bot_name); }
  };
  useEffect(() => { const saved = localStorage.getItem("nextrapro-licence"); if (saved) void activate(saved, true); }, []);
  const loadImage = (file: File | undefined, target: "chart" | "bot") => {
    if (!file) return;
    if (!file.type.startsWith("image/")) { setNotice("Please choose an image file."); return; }
    if (file.size > 10 * 1024 * 1024) { setNotice("Choose an image smaller than 10 MB."); return; }
    const reader = new FileReader();
    reader.onload = () => { if (typeof reader.result !== "string") return; if (target === "chart") { setChart(reader.result); setResult(false); } else setCustomImage(reader.result); setNotice(""); };
    reader.readAsDataURL(file);
  };
  return <div className={`${theme} min-h-screen bg-background text-foreground`}>
    <header className="flex h-16 items-center justify-between border-b border-border px-4 sm:px-8">
      <Button size="icon" variant="ghost" aria-label={screen === "start" || screen === "home" ? "Back to website" : "Back to app home"} onClick={() => screen === "start" || screen === "home" ? onExit() : go("home")}><ArrowLeft /></Button>
      <span className="flex items-center gap-2 text-sm font-bold"><Zap className="size-4 text-primary" />NEXTRA<span className="text-primary">PRO</span></span>
      <Button size="icon" variant="ghost" aria-label="Notifications" onClick={() => setNotice(notifications ? "No new notifications." : "Notifications are turned off.")}><Bell /></Button>
    </header>
    <main className="mx-auto min-h-[calc(100dvh-144px)] max-w-6xl px-4 pb-28 pt-6 sm:px-8">
      {notice && <div role="status" className="mb-5 flex items-center gap-3 rounded-md border border-primary/30 bg-primary/10 px-4 py-3 text-sm"><span className="flex-1">{notice}</span><Button variant="ghost" size="icon" aria-label="Dismiss notice" onClick={() => setNotice("")}><X /></Button></div>}
      {(screen === "start" || screen === "activate") && <section className="mx-auto flex max-w-md flex-col items-center pt-10 text-center sm:pt-16">
        <div className="mb-7 flex size-24 items-center justify-center rounded-full border border-primary/40 bg-primary/10"><KeyRound className="size-9 text-primary" /></div>
        <span className="text-xs font-semibold uppercase tracking-widest text-primary">Trading assistant</span>
        <h1 className="mt-3 text-4xl font-bold">{screen === "start" ? "NEXTRAPRO" : "Activate licence"}</h1>
        <p className="mt-4 text-sm text-muted-foreground">{screen === "start" ? "Your licence. Your assistant." : "Enter your NEXTRAPRO licence key."}</p>
        {screen === "start" ? <Button className="mt-8 h-12 w-full" onClick={() => go("activate")}>Start<ArrowRight /></Button> : <form className="mt-8 w-full space-y-4 text-left" onSubmit={e => { e.preventDefault(); void activate(key); }}>
          <Field title="Licence key"><Input value={key} maxLength={40} onChange={e => setKey(e.target.value)} required placeholder="NXP-XXXX-XXXX-XXXX-XXXX" className="h-12 font-mono" /></Field>
          <p className="text-xs text-muted-foreground">Paste the key your mentor sent you.</p>
          <Button type="submit" disabled={activating} className="h-12 w-full"><ShieldCheck />{activating ? "Checking…" : "Activate licence"}</Button>
        </form>}
        <p className="mt-6 text-xs text-muted-foreground">Demo preview · No live trades or account connections</p>
      </section>}

      {screen === "home" && <>
        <section className="flex flex-col items-center py-4 text-center">
          <span className="mb-4 text-xs font-semibold uppercase tracking-widest text-primary">{robot ? "Licence activated" : licensed ? "No assistant installed" : "Licence not activated"}</span>
          {robot ? <img src={customImage || botImg || botImage} alt="NEXTRAPRO activated assistant" className={`size-40 border-2 border-primary object-cover shadow-[var(--trading-glow)] sm:size-44 ${shape === "Circle" ? "rounded-full" : "rounded-lg"}`} /> : <div className="flex size-40 items-center justify-center rounded-full border border-dashed border-primary/50"><Plus className="size-10 text-primary" /></div>}
          <h1 className="mt-5 text-2xl font-bold">{robot ? botName : licensed ? "Choose your assistant" : "NEXTRAPRO"}</h1>
          {licensed ? <span className="mt-3 rounded-full border border-primary/40 px-4 py-1 text-[11px] font-semibold text-primary">{running ? "Running" : robot ? (expires ? `Licence until ${new Date(expires).toLocaleDateString()}` : "Lifetime licence") : "Licence active"}</span> : <Button className="mt-4 h-11" onClick={() => go("activate")}><KeyRound />Activate licence</Button>}
        </section>
        <div className="my-6 grid grid-cols-3 overflow-hidden rounded-lg border border-primary/40 bg-secondary p-1">
          <Button variant="ghost" disabled={!robot} onClick={() => { setRobot(false); setRunning(false); }}><X /><span>Remove</span></Button>
          <Button variant={running ? "default" : "ghost"} disabled={licensed && !robot} onClick={() => { if (!licensed) { go("activate"); return; } setRunning(!running); if (!running) setNotice("Assistant started in demo mode. No trades will be placed."); }}>{running ? <Square /> : <Play />}{running ? "Stop" : "Start"}</Button>
          <Button variant="ghost" disabled={!robot} onClick={() => go("symbols")}><Activity />Symbols</Button>
        </div>
        <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">Robots list</h2>
        <div className="space-y-2">
          {licensed ? <Button variant="outline" className="h-16 w-full justify-start rounded-lg border-primary/40 px-4" onClick={() => { if (!robot) { setRobot(true); speak(); } else setNotice(`${botName} is selected.`); }}><img src={customImage || botImg || botImage} alt="" className="size-10 rounded-full object-cover" /><span className="flex-1 text-left"><span className="block font-semibold">{botName}</span><span className="block text-xs text-primary">{robot ? "Active licence" : "Available to install"}</span></span>{robot ? <Check className="text-primary" /> : <Plus />}</Button> : <p className="rounded-lg border border-primary/30 p-5 text-center text-sm text-muted-foreground">No robot activated</p>}
          <Button variant="outline" className="h-16 w-full justify-start rounded-lg border-primary/40 px-4" onClick={() => go(licensed ? "scanner" : "activate")}><span className="flex size-10 items-center justify-center rounded-full border border-primary/30"><ScanLine className="text-primary" /></span><span className="flex-1 text-left"><span className="block font-semibold">Chart Scanner</span><span className="block text-xs text-primary">AI chart analysis · Demo</span></span><ChevronRight /></Button>
        </div>
        {running && <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground"><span className="size-2 rounded-full bg-success" />Assistant running · {configs.length} configured symbols · {connection === "connected" ? "Demo MT5 connected" : "MT5 disconnected"}</div>}
      </>}

      {screen === "symbols" && <>
        <h1 className="text-center text-lg font-bold">NEXTRAPRO Assistant</h1>
        <div role="tablist" aria-label="Symbol lists" className="mx-auto my-6 grid max-w-sm grid-cols-2 rounded-full border border-primary/40 p-1"><Button role="tab" aria-selected={symbolTab === "selected"} variant={symbolTab === "selected" ? "default" : "ghost"} className="rounded-full text-xs" onClick={() => setSymbolTab("selected")}>Selected symbols</Button><Button role="tab" aria-selected={symbolTab === "allowed"} variant={symbolTab === "allowed" ? "default" : "ghost"} className="rounded-full text-xs" onClick={() => setSymbolTab("allowed")}>Allowed symbols</Button></div>
        {symbolTab === "selected" ? configs.length ? <div className="space-y-3">{configs.map(config => <article key={config.symbol} className="rounded-lg border border-primary/40 p-4"><div className="flex items-center justify-between"><Button variant="ghost" size="icon" aria-label={`Edit ${config.symbol}`} onClick={() => setEditing(config)}><Settings /></Button><h2 className="font-semibold">{config.symbol}</h2><Button variant="ghost" size="icon" aria-label={`Remove ${config.symbol}`} onClick={() => setConfigs(configs.filter(item => item.symbol !== config.symbol))}><Trash2 /></Button></div><dl className="mt-3 grid grid-cols-3 text-center text-xs"><div><dt className="text-muted-foreground">Lot size</dt><dd className="mt-1 font-mono font-bold">{config.lot}</dd></div><div><dt className="text-muted-foreground">Execution</dt><dd className="mt-1 font-bold">{config.execution}</dd></div><div><dt className="text-muted-foreground">Trades</dt><dd className="mt-1 font-mono font-bold">{config.trades}</dd></div></dl></article>)}</div> : <p className="py-16 text-center text-sm text-muted-foreground">No symbols configured yet</p> : <><div className="grid grid-cols-3 justify-items-center gap-y-6 py-5">{allowed.map(symbol => <Button key={symbol} variant="outline" className="size-20 rounded-full border-primary/50 text-[11px] text-primary sm:size-24" onClick={() => setEditing(configs.find(config => config.symbol === symbol) || { symbol, lot: "0.01", execution: "Both", trades: "10" })}>{symbol}{configs.some(config => config.symbol === symbol) && <Check className="size-3" />}</Button>)}</div><Button variant="outline" className="mt-6 h-11 w-full border-primary/50 text-primary" onClick={() => setAdding(true)}><Plus />Add symbol</Button></>}
      </>}

      {screen === "scanner" && <section className="mx-auto max-w-3xl">
        <h1 className="text-center text-2xl font-bold">Chart Scanner</h1><p className="mt-2 text-center text-xs text-muted-foreground">Demo analysis · Not financial advice</p>
        <div className="my-6 grid grid-cols-2 gap-2 sm:grid-cols-4">{["First Scalp", "Super Scalp", "Swing", "Day"].map(item => <Button key={item} variant={mode === item ? "default" : "outline"} onClick={() => { setMode(item); setResult(false); }}>{item}</Button>)}</div>
        <input ref={upload} type="file" accept="image/*" className="hidden" aria-label="Upload chart" onChange={e => loadImage(e.target.files?.[0], "chart")} />
        {chart ? <div className="relative overflow-hidden rounded-lg border border-border"><img src={chart} alt="Uploaded trading chart" className="max-h-[420px] w-full object-contain" /></div> : <div className="flex h-60 flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-primary/40"><Upload className="size-8 text-primary" /><Button variant="outline" onClick={() => upload.current?.click()}>Upload chart</Button></div>}
        <div className="mt-4 flex flex-wrap gap-3">{chart && <Button variant="outline" onClick={() => upload.current?.click()}><Upload />Replace chart</Button>}<Button disabled={!chart || scanning} onClick={() => { setScanning(true); setResult(false); scanTimer.current = setTimeout(() => { setScanning(false); setResult(true); }, 900); }}><ScanLine />{scanning ? "Scanning…" : "Scan chart"}</Button></div>
        {result && <div role="status" className="mt-6 border-t border-border pt-5"><span className="text-xs font-bold uppercase text-primary">{mode} · Demo result</span><h2 className="mt-2 text-lg font-semibold">No confirmed setup</h2><p className="mt-2 text-sm text-muted-foreground">Live chart analysis is not connected. Entry, stop loss and take profit are unavailable; no trade levels have been invented.</p></div>}
      </section>}

      {screen === "meta" && <section className="mx-auto max-w-sm">
        <h1 className="text-center text-2xl font-bold">MT5 Login</h1><p className="mt-2 text-center text-xs text-primary">{connection === "connected" ? "Demo connected" : connection === "connecting" ? "Connecting…" : "Disconnected"}</p>
        <form className="mt-7 space-y-5 rounded-lg border border-primary/40 p-5" onSubmit={e => { e.preventDefault(); if (!broker || !server || !accountType) { setNotice("Choose a broker, server and account type."); return; } e.currentTarget.reset(); setConnection("connecting"); connectionTimer.current = setTimeout(() => setConnection("connected"), 900); }}>
          <Field title="Select broker"><Choice value={broker} label="Select broker" options={["Demo Broker", "IC Markets", "Exness", "Deriv", "Other"]} onChange={value => { setBroker(value); setServer(""); }} /></Field>
          <Field title="Select server"><Choice value={server} label={broker ? "Select server" : "Select a broker first"} options={broker ? [`${broker}-Demo`, `${broker}-Live`] : []} onChange={setServer} /></Field>
          <Field title="Account type"><Choice value={accountType} label="Select account type" options={["Demo", "Live"]} onChange={setAccountType} /></Field>
          <Field title="Login"><Input name="account" required inputMode="numeric" pattern="[0-9]+" placeholder="Account number" autoComplete="off" disabled={connection !== "disconnected"} /></Field>
          <Field title="Password"><Input name="password" required type="password" placeholder="MT5 password" autoComplete="off" disabled={connection !== "disconnected"} /></Field>
          {connection === "connected" ? <Button type="button" variant="outline" className="h-11 w-full" onClick={() => { setConnection("disconnected"); setRunning(false); }}>Disconnect account</Button> : <Button type="submit" className="h-11 w-full" disabled={connection === "connecting"}>{connection === "connecting" ? "Connecting…" : "Connect account"}</Button>}
        </form><p className="mt-4 text-center text-xs text-muted-foreground">Simulation only. Use dummy details, not real credentials. Passwords are discarded and never transmitted.</p>
      </section>}
    </main>

    <nav aria-label="App navigation" className="fixed inset-x-0 bottom-0 z-30 grid h-20 grid-cols-3 items-center border-t border-primary/40 bg-background px-3 shadow-[var(--trading-nav-shadow)]">
      <Button variant="ghost" className={`mx-auto h-14 flex-col gap-1 text-[10px] ${screen === "meta" ? "text-primary" : "text-muted-foreground"}`} onClick={() => licensed ? go("meta") : go("activate")}><Activity />MetaTrader</Button>
      <Button variant="ghost" className="mx-auto size-16 flex-col gap-1 rounded-full border border-primary/40 text-[10px] text-primary" onClick={() => go("home")}><Home />Home</Button>
      <Button variant="ghost" className="mx-auto h-14 flex-col gap-1 text-[10px] text-muted-foreground" onClick={() => setSettings(true)}><Settings />Settings</Button>
    </nav>

    <Dialog open={Boolean(editing)} onOpenChange={open => { if (!open) setEditing(null); }}><DialogContent className={`${theme} w-[calc(100%-2rem)] max-w-sm rounded-lg border-primary/50`}><DialogTitle className="text-center">{editing?.symbol}</DialogTitle><DialogDescription>Symbol configuration</DialogDescription>{editing && <form className="space-y-4" onSubmit={e => { e.preventDefault(); setConfigs([...configs.filter(item => item.symbol !== editing.symbol), editing]); setEditing(null); setSymbolTab("selected"); }}><Field title="Lot size"><Input type="number" min="0.01" max="100" step="0.01" required value={editing.lot} onChange={e => setEditing({ ...editing, lot: e.target.value })} /></Field><Field title="Execution type"><Choice value={editing.execution} label="Execution type" options={["Both", "Buy only", "Sell only"]} onChange={execution => setEditing({ ...editing, execution })} /></Field><Field title="Number of trades"><Input type="number" min="1" max="100" step="1" required value={editing.trades} onChange={e => setEditing({ ...editing, trades: e.target.value })} /></Field><Button className="h-11 w-full" type="submit">Configure symbol</Button></form>}</DialogContent></Dialog>
    <Dialog open={adding} onOpenChange={setAdding}><DialogContent className={`${theme} w-[calc(100%-2rem)] max-w-sm rounded-lg`}><DialogTitle>Add symbol</DialogTitle><DialogDescription>Broker symbol name</DialogDescription><form className="space-y-4" onSubmit={e => { e.preventDefault(); const symbol = newSymbol.trim().toUpperCase(); if (!symbol) return; if (!allowed.includes(symbol)) setAllowed([...allowed, symbol]); setNewSymbol(""); setAdding(false); }}><Input aria-label="Symbol name" required pattern="[A-Za-z0-9._-]{2,20}" placeholder="e.g. AUDUSD" value={newSymbol} onChange={e => setNewSymbol(e.target.value)} /><Button type="submit" className="w-full"><Plus />Add symbol</Button></form></DialogContent></Dialog>
    <Dialog open={settings} onOpenChange={setSettings}><DialogContent className={`${theme} inset-y-0 left-auto right-0 flex h-dvh w-[min(360px,100%)] max-w-none translate-x-0 translate-y-0 flex-col overflow-y-auto rounded-none border-l border-primary/30 pt-9`}><DialogTitle>NEXTRAPRO</DialogTitle><DialogDescription>Configuration</DialogDescription>
      <div className="flex items-center justify-between rounded-md border border-border p-3 text-sm">Notifications<Switch checked={notifications} onCheckedChange={setNotifications} aria-label="Notifications enabled" /></div>
      <div className="flex items-center justify-between rounded-md border border-border p-3 text-sm">Activation voice<Switch checked={voice} onCheckedChange={setVoice} aria-label="Activation voice" /></div>
      <Button variant="outline" disabled={!robot} onClick={() => speak()}><Volume2 />Listen to assistant</Button>
      <div className="flex items-center justify-between rounded-md border border-border p-3 text-sm">Dark interface<Switch checked={dark} onCheckedChange={setDark} aria-label="Dark interface" /></div>
      <Field title="Interface colour"><div className="flex gap-3">{["pink", "green", "blue"].map(item => <Button key={item} size="icon" variant="outline" className={`trading-${item} rounded-full border-primary bg-primary text-primary-foreground`} aria-label={`${item} accent`} aria-pressed={color === item} onClick={() => setColor(item)}>{color === item && <Check />}</Button>)}</div></Field>
      <Field title="Interface shape"><Choice value={shape} onChange={setShape} label="Interface shape" options={["Circle", "Square"]} /></Field>
      <Field title="Interface font"><Choice value={font} onChange={setFont} label="Interface font" options={["Modern", "Technical"]} /></Field>
      <input type="file" ref={imageUpload} className="hidden" accept="image/*" aria-label="Assistant image" onChange={e => loadImage(e.target.files?.[0], "bot")} />
      <Button variant="outline" disabled={!licensed} onClick={() => imageUpload.current?.click()}><Upload />Custom assistant image</Button>
      {customImage && <Button variant="ghost" onClick={() => setCustomImage("")}>Restore original image</Button>}
      <Button variant="outline" onClick={() => licensed ? go("scanner") : (setSettings(false), go("activate"))}><ScanLine />Intelligence scanner<ChevronRight /></Button>
      <div className="rounded-md border border-border p-3 text-xs"><h3 className="font-semibold">Executed / Signals</h3><p className="mt-2 text-muted-foreground">0 trades · No signals</p></div>
      <Button variant="outline" onClick={onExit}><ArrowLeft />Return to website</Button>
    </DialogContent></Dialog>
  </div>;
}