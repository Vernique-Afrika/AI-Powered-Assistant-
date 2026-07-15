import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { toast } from "sonner";
import logo from "@/assets/vernique-logo.png";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard" });
    });
  }, [navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: window.location.origin, data: { display_name: name } },
        });
        if (error) throw error;
        toast.success("Welcome to Vernique Afrika");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      navigate({ to: "/dashboard" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setLoading(true);
    const res = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (res.error) { toast.error(res.error.message ?? "Google sign-in failed"); setLoading(false); return; }
    if (res.redirected) return;
    navigate({ to: "/dashboard" });
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 flex flex-col items-center">
          <img src={logo} alt="Vernique Afrika" className="h-16 w-16 rounded-full ring-2 ring-[oklch(0.78_0.14_85_/_0.5)] object-cover" />
          <h1 className="mt-4 font-serif text-3xl">Vernique Afrika</h1>
          <p className="text-sm text-muted-foreground">AI Business Assistant</p>
        </div>
        <div className="glass-panel rounded-3xl p-8">
          <div className="mb-6 flex gap-1 rounded-full bg-secondary p-1">
            {(["signin","signup"] as const).map((m) => (
              <button key={m} onClick={() => setMode(m)}
                className={`flex-1 rounded-full py-2 text-sm font-medium transition ${mode===m ? "gradient-luxe text-primary-foreground" : "text-muted-foreground"}`}>
                {m === "signin" ? "Sign in" : "Create account"}
              </button>
            ))}
          </div>

          <button onClick={handleGoogle} disabled={loading}
            className="mb-4 flex w-full items-center justify-center gap-2 rounded-full border border-border bg-card px-4 py-3 text-sm font-medium hover:bg-accent/10 disabled:opacity-50">
            <svg viewBox="0 0 24 24" className="h-4 w-4"><path fill="#4285F4" d="M22.5 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.9c-.26 1.37-1.04 2.53-2.21 3.31v2.75h3.57c2.09-1.92 3.24-4.75 3.24-8.07Z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.68l-3.57-2.75c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.28-1.93-6.14-4.53H2.18v2.84A11 11 0 0 0 12 23Z"/><path fill="#FBBC05" d="M5.86 14.1A6.62 6.62 0 0 1 5.5 12c0-.73.13-1.44.36-2.1V7.06H2.18A11 11 0 0 0 1 12c0 1.78.43 3.46 1.18 4.94l3.68-2.84Z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.68 2.84C6.72 7.31 9.14 5.38 12 5.38Z"/></svg>
            Continue with Google
          </button>

          <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="h-px flex-1 bg-border" /> or <div className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === "signup" && (
              <input type="text" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-accent" />
            )}
            <input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-accent" />
            <input type="password" required minLength={8} placeholder="Password (min 8)" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-accent" />
            <button type="submit" disabled={loading}
              className="btn-luxe hover:[&]:btn-luxe-hover w-full rounded-full py-3 text-sm font-medium disabled:opacity-60">
              {loading ? "Please wait..." : mode === "signin" ? "Sign in" : "Create account"}
            </button>
          </form>
        </div>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          AI-generated content should be reviewed before business use.
        </p>
      </div>
    </div>
  );
}
