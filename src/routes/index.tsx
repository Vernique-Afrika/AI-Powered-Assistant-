import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, Mail, FileText, ListChecks, MessagesSquare, Megaphone } from "lucide-react";
import logo from "@/assets/vernique-logo.png";

export const Route = createFileRoute("/")({
  component: Landing,
});

const features = [
  { icon: Mail, title: "Smart Emails", desc: "Professional, luxury, promotional — instantly." },
  { icon: FileText, title: "Meeting Summaries", desc: "Action items, deadlines, ownership." },
  { icon: ListChecks, title: "AI Task Planner", desc: "Daily & weekly plans that prioritize impact." },
  { icon: MessagesSquare, title: "Chat Assistant", desc: "Marketing, product, branding, replies." },
  { icon: Megaphone, title: "Marketing Studio", desc: "Campaigns, captions, promotions." },
  { icon: Sparkles, title: "Research & Insights", desc: "Trends, suppliers, competitors." },
];

function Landing() {
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Vernique Afrika" className="h-11 w-11 rounded-full ring-2 ring-[oklch(0.78_0.14_85_/_0.5)] object-cover" />
          <div className="font-serif text-lg">Vernique Afrika Clothing Line</div>
        </div>
        <Link to="/auth" className="btn-luxe hover:[&]:btn-luxe-hover rounded-full px-5 py-2 text-sm font-medium">
          Sign in
        </Link>
      </header>

      <main className="mx-auto max-w-7xl px-6 pb-24">
        <section className="mt-14 grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs uppercase tracking-widest text-emerald">
              <span className="h-1.5 w-1.5 rounded-full gradient-gold" /> AI Business Assistant
            </div>
            <h1 className="mt-5 font-serif text-5xl leading-tight md:text-6xl">
              Where <span className="text-gold">African elegance</span> meets modern AI.
            </h1>
            <p className="mt-5 max-w-lg text-lg text-muted-foreground">
              A curated productivity suite for Vernique Afrika — draft emails, plan campaigns, describe collections, and chat with an assistant that understands luxury fashion.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/auth" className="btn-luxe hover:[&]:btn-luxe-hover rounded-full px-7 py-3 text-sm font-medium">
                Enter the studio
              </Link>
              <a href="#features" className="rounded-full border border-border bg-card/60 px-7 py-3 text-sm font-medium hover:bg-accent/10">
                Explore features
              </a>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-6 rounded-[2rem] gradient-luxe opacity-30 blur-3xl" />
            <div className="glass-panel relative overflow-hidden rounded-[2rem] p-6">
              <img src={logo} alt="Vernique Afrika logo" className="w-full rounded-2xl" />
            </div>
          </div>
        </section>

        <section id="features" className="mt-24 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="group glass-panel rounded-2xl p-6 transition hover:-translate-y-1">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl gradient-gold text-[oklch(0.16_0.02_160)]">
                <f.icon className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <h3 className="mt-4 font-serif text-xl">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </section>
      </main>

      <footer className="border-t border-border/60 bg-[oklch(0.18_0.03_162)] text-[oklch(0.94_0.02_90)]">
        <div className="mx-auto max-w-7xl px-6 py-10 text-center">
          <div className="font-serif text-2xl text-gold">Vernique Afrika Clothing Line</div>
          <p className="mt-1 text-sm opacity-80">Where African Elegance Meets Modern Fashion</p>
          <p className="mt-4 text-xs opacity-60">AI-generated content should be reviewed before business use.</p>
        </div>
      </footer>
    </div>
  );
}
