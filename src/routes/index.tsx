import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Apple, ChevronDown, DollarSign, Eye, EyeOff, LogIn, MessageSquare, RefreshCw, Smartphone, UserPlus, X, Zap } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import logo from "@/assets/nextrapro-logo.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NEXTRAPRO | Mobile EA Hosting Service" },
      { name: "description", content: "Host your Expert Advisors on mobile with NEXTRAPRO — low latency, 24/7 uptime, mentor licensing." },
      { property: "og:title", content: "NEXTRAPRO | Mobile EA Hosting Service" },
      { property: "og:description", content: "Powerful trading automation on-the-go with NEXTRAPRO." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

function Rings({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex aspect-square w-full max-w-[340px] items-center justify-center">
      {[100, 75, 50].map((s) => (
        <div key={s} className="absolute rounded-full border border-primary/25" style={{ width: `${s}%`, height: `${s}%` }} />
      ))}
      <div className="absolute size-1/2 rounded-full bg-primary/10 blur-3xl" />
      <div className="relative">{children}</div>
    </div>
  );
}

function LogoCard({ small }: { small?: boolean }) {
  return (
    <div className={`flex flex-col items-center justify-center rounded-2xl bg-foreground shadow-[0_10px_40px_var(--primary-glow)] ${small ? "h-36 w-44" : "h-32 w-48"}`}>
      <img src={logo} alt="NEXTRAPRO logo" className="size-20 object-contain" />
      <span className="-mt-2 text-sm font-bold italic text-background">NEXTRA<span className="text-primary">PRO</span></span>
    </div>
  );
}

function Landing() {
  const [view, setView] = useState<"home" | "signin">("home");
  const [showPw, setShowPw] = useState(false);
  const [ad, setAd] = useState(true);
  const [chat, setChat] = useState(true);
  const [howto, setHowto] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,var(--primary-glow),transparent_55%)]" />
      <header className="relative mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-5 py-4">
        <button onClick={() => setView("home")} className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-md border border-primary/40 bg-primary/10"><Zap className="size-4 text-primary" /></span>
          <span className="font-bold">NEXTRA<span className="text-primary">PRO</span></span>
        </button>
        <nav className="ml-auto hidden items-center gap-6 text-xs text-muted-foreground md:flex">
          <button className="flex items-center gap-1 hover:text-foreground"><RefreshCw className="size-3" />Renew Access</button>
          <button className="hover:text-foreground">Pricing</button>
          <button onClick={() => setView("signin")} className="flex items-center gap-1 hover:text-foreground"><UserPlus className="size-3" />Mentor Sign Up</button>
          <button onClick={() => setView("signin")} className="flex items-center gap-1 hover:text-foreground"><LogIn className="size-3" />Mentor Sign In</button>
        </nav>
        <div className="ml-auto flex gap-2 md:ml-0">
          <Button size="sm" className="rounded-full shadow-[0_6px_20px_var(--primary-glow)]"><Smartphone />Android</Button>
          <Button size="sm" variant="outline" className="rounded-full"><Apple />iOS</Button>
        </div>
      </header>

      {view === "home" ? (
        <main className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 py-10 lg:grid-cols-2">
          <section>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 font-mono text-[10px] tracking-widest text-primary"><Zap className="size-3" />MOBILE EA HOSTING</span>
            <h1 className="mt-6 text-5xl font-bold leading-tight sm:text-6xl">Mobile <span className="text-primary">EA</span><br /><span className="text-primary">Hosting</span> Service</h1>
            <p className="mt-4 max-w-md text-sm text-muted-foreground">Powerful trading automation on-the-go. Host your Expert Advisors on mobile for seamless trading with low latency and 24/7 uptime.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button className="rounded-full shadow-[0_6px_20px_var(--primary-glow)]"><Smartphone />Get Android Now</Button>
              <Button variant="outline" className="rounded-full"><Apple />Get iOS Now</Button>
            </div>
            <div className="mt-3 flex flex-wrap gap-3">
              <Button variant="outline" className="rounded-full border-primary/40 bg-primary/10 text-primary"><RefreshCw />Renew Access</Button>
              <Button variant="outline" className="rounded-full"><DollarSign />Become an Affiliate</Button>
            </div>
            <button onClick={() => setHowto(!howto)} className="mt-5 w-full max-w-md rounded-lg border border-border bg-card px-4 py-3 text-left text-xs">
              <span className="flex items-center gap-2"><Apple className="size-3" />How to install on iPhone or iPad<ChevronDown className={`ml-auto size-4 text-primary transition ${howto ? "rotate-180" : ""}`} /></span>
              {howto && <span className="mt-3 block text-muted-foreground">Open this site in Safari, tap Share, then "Add to Home Screen".</span>}
            </button>
          </section>

          <section className="relative flex flex-col items-center">
            {ad && (
              <div className="z-10 mb-4 w-64 overflow-hidden rounded-xl border border-primary/30 bg-card">
                <div className="flex items-center justify-between border-b border-border px-3 py-2">
                  <span className="rounded border border-primary/40 px-1.5 text-[9px] text-primary">AD</span>
                  <button onClick={() => setAd(false)} className="flex items-center gap-1 rounded bg-muted px-2 py-0.5 text-[10px]">Cancel <X className="size-3" /></button>
                </div>
                <div className="p-4 text-center">
                  <p className="font-mono text-[10px] tracking-widest text-primary">ACTIVE SERVER</p>
                  <Button onClick={() => setView("signin")} className="mt-3 w-full rounded-full"><UserPlus />Sign Up</Button>
                </div>
              </div>
            )}
            <Rings>
              <div className="relative rounded-2xl border border-primary/30 bg-card p-5">
                <LogoCard />
                <p className="mt-3 text-center font-mono text-[9px] tracking-widest text-muted-foreground">MOBILE VPS</p>
                <span className="absolute -left-20 -top-6 flex items-center gap-1.5 rounded-lg border border-border bg-card px-2 py-1 text-[10px]"><span className="size-1.5 rounded-full bg-success" />EA running</span>
                <span className="absolute -bottom-6 -right-16 rounded-lg border border-border bg-card px-2 py-1 text-[10px] text-muted-foreground">Latency <b className="font-mono text-foreground">1 ms</b></span>
              </div>
            </Rings>
          </section>
        </main>
      ) : (
        <main className="relative mx-auto max-w-4xl px-5 py-8">
          <div className="grid overflow-hidden rounded-2xl border border-primary/30 bg-card md:grid-cols-2">
            <div className="flex flex-col items-center justify-center border-b border-border p-8 md:border-b-0 md:border-r">
              <Rings>
                <div className="flex flex-col items-center">
                  <LogoCard small />
                  <p className="mt-4 font-mono text-[9px] tracking-widest text-muted-foreground">MOBILE EA HOSTING</p>
                  <span className="mt-3 flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[10px] text-primary"><span className="size-1.5 rounded-full bg-success" />Mentor portal</span>
                </div>
              </Rings>
            </div>
            <div className="p-8">
              <div className="flex items-center gap-3">
                <img src={logo} alt="" className="size-10 rounded-lg bg-foreground object-contain" />
                <div><p className="text-lg font-bold leading-none">Mentor</p><p className="font-mono text-[9px] tracking-widest text-muted-foreground">ADMIN DASHBOARD</p></div>
              </div>
              <h2 className="mt-6 font-bold">Sign in</h2>
              <form className="mt-4 space-y-4" onSubmit={(e) => { e.preventDefault(); navigate({ to: "/dashboard" }); }}>
                <label className="block text-xs font-semibold">Email address<Input type="email" required placeholder="you@example.com" className="mt-2 h-11 bg-background" /></label>
                <label className="block text-xs font-semibold">Password
                  <div className="relative mt-2">
                    <Input type={showPw ? "text" : "password"} required placeholder="Your password" className="h-11 bg-background pr-10" />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-3 text-muted-foreground" aria-label="Toggle password">{showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button>
                  </div>
                </label>
                <Button type="submit" className="h-11 w-full rounded-full shadow-[0_6px_20px_var(--primary-glow)]">Sign In</Button>
              </form>
              <p className="mt-4 text-center text-xs text-muted-foreground">Forgot password?</p>
              <div className="my-5 flex items-center gap-3 font-mono text-[9px] tracking-widest text-muted-foreground"><span className="h-px flex-1 bg-border" />ADMIN ACCESS ONLY<span className="h-px flex-1 bg-border" /></div>
              <p className="text-center text-xs">Do not have an account? <Link to="/dashboard" className="text-primary">Create account</Link></p>
              <p className="mt-4 text-center text-[10px] text-muted-foreground">Terms of Use · Privacy Policy</p>
            </div>
          </div>
        </main>
      )}

      <div className="fixed bottom-5 right-5 z-20 flex flex-col items-end gap-3">
        {chat && <div className="relative max-w-52 rounded-lg border border-border bg-card p-3 pr-6 text-[11px]">Hi! Need help with anything? Our AI agent is here 24/7.<button onClick={() => setChat(false)} className="absolute right-1.5 top-1.5" aria-label="Close"><X className="size-3" /></button></div>}
        <Button size="icon" className="size-12 rounded-full shadow-[0_6px_20px_var(--primary-glow)]" aria-label="Chat"><MessageSquare /></Button>
      </div>
    </div>
  );
}
