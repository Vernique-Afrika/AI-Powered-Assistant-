import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getDashboardStats, getRecentGenerations, createThread } from "@/lib/threads.functions";
import { PageShell, PageHeader } from "@/components/tool-page";
import {
  LayoutDashboard, Mail, FileText, ListChecks, Search, Megaphone,
  ShoppingBag, Hash, Reply, MessagesSquare, Sparkles, ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Vernique Afrika AI" }] }),
  component: Dashboard,
});

const shortcuts = [
  { to: "/email", label: "Email Generator", icon: Mail, desc: "Craft luxury correspondence" },
  { to: "/meetings", label: "Meeting Notes", icon: FileText, desc: "Summaries & action items" },
  { to: "/tasks", label: "Task Planner", icon: ListChecks, desc: "Prioritized daily plan" },
  { to: "/research", label: "Research", icon: Search, desc: "Trends & competitors" },
  { to: "/marketing", label: "Marketing", icon: Megaphone, desc: "Campaigns & promotions" },
  { to: "/products", label: "Product Copy", icon: ShoppingBag, desc: "Premium descriptions" },
  { to: "/captions", label: "Social Captions", icon: Hash, desc: "IG · FB · TikTok · LinkedIn" },
  { to: "/replies", label: "Customer Replies", icon: Reply, desc: "Refunds · delays · thanks" },
] as const;

function Dashboard() {
  const statsFn = useServerFn(getDashboardStats);
  const recentFn = useServerFn(getRecentGenerations);
  const createFn = useServerFn(createThread);
  const navigate = useNavigate();

  const { data: stats } = useQuery({ queryKey: ["stats"], queryFn: () => statsFn() });
  const { data: recent } = useQuery({ queryKey: ["recent"], queryFn: () => recentFn() });

  const kpis = [
    { label: "Total AI Requests", value: stats?.total ?? 0 },
    { label: "Emails Generated", value: stats?.emails ?? 0 },
    { label: "Summaries Created", value: stats?.summaries ?? 0 },
    { label: "Tasks Planned", value: stats?.tasks ?? 0 },
    { label: "Research Reports", value: stats?.research ?? 0 },
    { label: "Marketing Campaigns", value: stats?.marketing ?? 0 },
  ];

  async function startChat() {
    const { id } = await createFn();
    navigate({ to: "/chat/$threadId", params: { threadId: id } });
  }

  return (
    <PageShell>
      <PageHeader icon={LayoutDashboard} title="Studio Dashboard" description="Your AI atelier — every tool, one calm surface." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {kpis.map((k) => (
          <div key={k.label} className="glass-panel rounded-2xl p-5">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">{k.label}</div>
            <div className="mt-2 font-serif text-4xl text-gold">{k.value}</div>
          </div>
        ))}
      </div>

      <div className="glass-panel rounded-3xl p-6 md:p-8 gradient-luxe text-primary-foreground">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-widest opacity-70">AI Chat Assistant</div>
            <h2 className="mt-1 font-serif text-2xl md:text-3xl text-gold">
              Ask anything about fashion, marketing, or the brand.
            </h2>
          </div>
          <button onClick={startChat} className="inline-flex items-center gap-2 rounded-full gradient-gold px-6 py-3 text-sm font-semibold text-[oklch(0.16_0.02_160)]">
            <MessagesSquare className="h-4 w-4" /> Start a new chat
          </button>
        </div>
      </div>

      <div>
        <h2 className="mb-4 font-serif text-2xl">AI Tools</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {shortcuts.map((s) => (
            <Link key={s.to} to={s.to} className="group glass-panel rounded-2xl p-5 transition hover:-translate-y-1">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-gold text-[oklch(0.16_0.02_160)]">
                <s.icon className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <div className="mt-4 flex items-center justify-between font-serif">
                <span>{s.label}</span>
                <ArrowRight className="h-4 w-4 opacity-0 transition group-hover:opacity-100" />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{s.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-4 font-serif text-2xl">Recent generations</h2>
        <div className="glass-panel divide-y divide-border/60 rounded-2xl">
          {(!recent || recent.length === 0) && (
            <div className="p-8 text-center text-sm text-muted-foreground">
              <Sparkles className="mx-auto mb-2 h-6 w-6 text-accent" />
              Nothing yet — generate your first piece of copy from a tool above.
            </div>
          )}
          {recent?.map((r) => (
            <div key={r.id} className="flex items-center justify-between gap-4 p-4">
              <div className="min-w-0">
                <div className="font-serif truncate">{r.title ?? r.tool}</div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">{r.tool}</div>
              </div>
              <div className="shrink-0 text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
