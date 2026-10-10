import { useState } from "react";
import { Activity, Eye, EyeOff, LockKeyhole, Server, X, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import logo from "@/assets/nextrapro-logo.png";

export function TradingMetaConnect() {
  const [tab, setTab] = useState("connect");
  const [showPassword, setShowPassword] = useState(false);
  const [server, setServer] = useState("");
  const [message, setMessage] = useState("");
  return <section className="trading-meta min-h-[calc(100dvh-13rem)]">
    <h1 className="rounded-lg border border-primary/70 py-3 text-center text-xs font-bold uppercase tracking-widest text-primary">MT5 Account</h1>
    <p className="mt-4 flex items-center justify-center gap-2 text-[10px] font-semibold uppercase text-muted-foreground"><WifiOff className="size-3" />MT5 disconnected</p>
    <div className="mx-auto mb-6 mt-8 flex flex-col items-center">
      <div className="mt5-account-card flex aspect-[1.6] w-64 flex-col justify-between rounded-lg border border-primary/60 p-5 shadow-[var(--trading-glow)]"><div className="flex items-center gap-2"><img src={logo} alt="NEXTRAPRO" className="size-9 object-contain" /><span className="text-sm font-bold">NEXTRAPRO</span></div><LockKeyhole className="size-7 text-primary" /><div className="flex justify-between text-[9px] font-semibold uppercase tracking-widest"><span>MetaTrader 5</span><span>Account</span></div></div>
      <Activity className="mb-3 mt-5 size-7 text-primary" /><h2 className="text-xs font-bold uppercase">MT5 Login Details</h2>
    </div>
    <div role="tablist" aria-label="MT5 account views" className="mb-4 grid grid-cols-2 gap-2"><Button role="tab" aria-selected={tab === "connect"} variant="outline" className={tab === "connect" ? "border-primary text-primary" : "text-muted-foreground"} onClick={() => setTab("connect")}>Connect account</Button><Button role="tab" aria-selected={tab === "orders"} variant="outline" className={tab === "orders" ? "border-primary text-primary" : "text-muted-foreground"} onClick={() => setTab("orders")}>Orders</Button></div>
    {tab === "connect" ? <form className="space-y-3" onSubmit={e => { e.preventDefault(); const password = e.currentTarget.elements.namedItem("password"); if (password instanceof HTMLInputElement) password.value = ""; setMessage("Account linking is unavailable until the live MT5 service is connected. Your password was not sent or saved."); }}>
      <Input aria-label="MT5 account number" name="account" inputMode="numeric" pattern="[0-9]+" required placeholder="MT5 account number" autoComplete="off" className="h-12 border-primary/60" />
      <div className="relative"><Input aria-label="MT5 password" name="password" type={showPassword ? "text" : "password"} required placeholder="MT5 password" autoComplete="off" className="h-12 border-primary/60 pr-12" /><Button type="button" variant="ghost" size="icon" aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-1 top-1.5" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff /> : <Eye />}</Button></div>
      <div className="relative"><Server className="absolute left-3 top-4 size-4 text-muted-foreground" /><Input aria-label="Broker server" required value={server} onChange={e => setServer(e.target.value)} placeholder="Broker server, e.g. Broker-Live" className="h-12 border-primary/60 px-10" /><Button type="button" variant="ghost" size="icon" aria-label="Clear broker server" className="absolute right-1 top-1.5" onClick={() => setServer("")}><X /></Button></div>
      <Button variant="outline" type="submit" className="mt-4 h-12 w-full border-primary/70"><LockKeyhole />Link MT5 account details</Button>
      <p className="pt-3 text-center text-xs text-muted-foreground">Live MT5 service not connected. Do not enter your real password yet.</p>
      {message && <p role="status" className="rounded-md border border-primary/40 p-3 text-sm">{message}</p>}
    </form> : <div className="border-t border-border py-10 text-center"><Activity className="mx-auto mb-4 text-primary" /><h3 className="text-sm font-semibold">No connected account</h3><p className="mt-2 text-xs text-muted-foreground">Orders are unavailable until an MT5 account is linked.</p></div>}
  </section>;
}