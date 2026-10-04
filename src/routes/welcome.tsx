import { createFileRoute, Link } from "@tanstack/react-router";
import { Bot, KeyRound, Users, Copy, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import logo from "@/assets/nextrapro-logo.png";

export const Route = createFileRoute("/welcome")({
  head: () => ({
    meta: [
      { title: "NEXTRAPRO | Expert Advisor Licensing Platform" },
      { name: "description", content: "Sign in to NEXTRAPRO to license Expert Advisors, manage keys, affiliates and copy trading." },
      { property: "og:title", content: "NEXTRAPRO | Expert Advisor Licensing" },
      { property: "og:description", content: "License, manage and grow your Expert Advisors with NEXTRAPRO." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Welcome,
});

const features = [
  { icon: KeyRound, title: "License keys", text: "Generate keys with flexible durations in seconds." },
  { icon: Bot, title: "Manage EAs", text: "Secret codes and symbol control for every Expert Advisor." },
  { icon: Users, title: "Affiliate program", text: "Earn commission on every referred licence." },
  { icon: Copy, title: "Copy trading", text: "Monitor and run automated trade execution." },
];

function Welcome() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <header className="flex h-16 items-center border-b border-border px-5">
        <img src={logo} alt="NEXTRAPRO logo" className="size-10 object-contain" />
        <span className="ml-2 text-base font-bold">NEXTRA<span className="text-primary">PRO</span></span>
        <Button asChild size="sm" className="ml-auto"><Link to="/">Open dashboard</Link></Button>
      </header>
      <main className="mx-auto grid max-w-6xl gap-10 px-5 py-12 lg:grid-cols-[1.2fr_1fr] lg:items-center">
        <section>
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs text-primary"><ShieldCheck className="size-3" />Mentor licensing platform</span>
          <h1 className="mt-5 text-4xl font-bold leading-tight sm:text-5xl">License your Expert Advisors with <span className="text-primary">NEXTRAPRO</span></h1>
          <p className="mt-4 max-w-xl text-sm text-muted-foreground">Generate keys, manage EAs, grow through affiliates and run copy trading from one dark, fast admin panel.</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {features.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-lg border border-border bg-card p-4">
                <Icon className="size-5 text-primary" />
                <h2 className="mt-3 text-sm font-bold">{title}</h2>
                <p className="mt-1 text-xs text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="rounded-xl border border-primary/25 bg-card p-6 shadow-[0_10px_35px_var(--primary-glow)]">
          <h2 className="text-xl font-bold">Sign in</h2>
          <p className="mb-5 mt-1 text-xs text-muted-foreground">Access your mentor account</p>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <Input type="email" placeholder="Email address" className="bg-input" />
            <Input type="password" placeholder="Password" className="bg-input" />
            <Button asChild className="w-full"><Link to="/">Sign in</Link></Button>
          </form>
        </section>
      </main>
    </div>
  );
}
