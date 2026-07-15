import { type ReactNode, useState } from "react";
import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard, Mail, FileText, ListChecks, Search, MessagesSquare,
  Megaphone, ShoppingBag, Hash, Reply, Settings, LogOut, Menu, X, Sparkles,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/vernique-logo.png";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/email", label: "Email Generator", icon: Mail },
  { to: "/meetings", label: "Meeting Notes", icon: FileText },
  { to: "/tasks", label: "Task Planner", icon: ListChecks },
  { to: "/research", label: "Research", icon: Search },
  { to: "/chat", label: "AI Chat", icon: MessagesSquare },
  { to: "/marketing", label: "Marketing", icon: Megaphone },
  { to: "/products", label: "Product Copy", icon: ShoppingBag },
  { to: "/captions", label: "Social Captions", icon: Hash },
  { to: "/replies", label: "Customer Replies", icon: Reply },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const navigate = useNavigate();

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-sidebar text-sidebar-foreground transition-transform lg:static lg:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex items-center justify-between gap-3 px-6 py-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3 min-w-0">
            <img src={logo} alt="Vernique Afrika" className="h-10 w-10 shrink-0 rounded-full ring-2 ring-[oklch(0.78_0.14_85_/_0.6)] object-cover" />
            <div className="min-w-0">
              <div className="font-serif text-lg truncate text-gold">Vernique Afrika Clothing Line</div>
              <div className="text-[10px] uppercase tracking-widest opacity-70">AI Assistant</div>
            </div>
          </div>
          <button onClick={() => setOpen(false)} className="lg:hidden"><X className="h-5 w-5" /></button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {nav.map((n) => {
            const active = pathname === n.to || pathname.startsWith(n.to + "/");
            return (
              <Link key={n.to} to={n.to} onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
                  active
                    ? "bg-sidebar-accent text-sidebar-primary-foreground shadow-inner border border-sidebar-primary/40"
                    : "hover:bg-sidebar-accent/60"
                )}>
                <n.icon className={cn("h-4 w-4", active && "text-sidebar-primary")} strokeWidth={1.75} />
                <span className="truncate">{n.label}</span>
                {active && <Sparkles className="ml-auto h-3 w-3 text-sidebar-primary" />}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-border p-3">
          <button onClick={signOut} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-sidebar-accent/60">
            <LogOut className="h-4 w-4" strokeWidth={1.75} /> Sign out
          </button>
          <p className="mt-3 px-2 text-[10px] text-sidebar-foreground/60">
            AI content should be reviewed before business use.
          </p>
        </div>
      </aside>

      {open && <div onClick={() => setOpen(false)} className="fixed inset-0 z-30 bg-black/40 lg:hidden" />}

      {/* Main */}
      <div className="flex flex-1 flex-col min-w-0">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-background/70 px-4 py-3 backdrop-blur lg:hidden">
          <button onClick={() => setOpen(true)}><Menu className="h-5 w-5" /></button>
          <div className="flex items-center gap-2">
            <img src={logo} alt="" className="h-7 w-7 rounded-full object-cover" />
            <span className="font-serif">Vernique Afrika Clothing Line</span>
          </div>
          <div className="w-5" />
        </header>
        <main className="flex-1 min-w-0">{children}</main>
        <footer className="border-t border-border/60 px-6 py-6 text-center text-xs text-muted-foreground">
          <div className="font-serif text-sm text-foreground">Vernique Afrika Clothing Line</div>
          <p className="italic">Where African Elegance Meets Modern Fashion</p>
          <p className="mt-2">AI-generated content should be reviewed before business use.</p>
        </footer>
      </div>
    </div>
  );
}
