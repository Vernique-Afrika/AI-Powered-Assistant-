import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader, PageShell } from "@/components/tool-page";
import { Settings as SettingsIcon, LogOut } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({ meta: [{ title: "Settings — Vernique Afrika" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? "");
      setName((data.user?.user_metadata?.display_name as string) ?? "");
    });
  }, []);

  async function save() {
    const { error } = await supabase.auth.updateUser({ data: { display_name: name } });
    if (error) toast.error(error.message);
    else toast.success("Profile updated");
  }

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  }

  return (
    <PageShell>
      <PageHeader icon={SettingsIcon} title="Settings" description="Manage your Vernique Afrika account." />

      <div className="glass-panel space-y-4 rounded-3xl p-6 max-w-xl">
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-widest text-muted-foreground">Email</label>
          <input value={email} disabled className="w-full rounded-xl border border-input bg-muted px-4 py-2.5 text-sm" />
        </div>
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-widest text-muted-foreground">Display name</label>
          <input value={name} onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent" />
        </div>
        <div className="flex justify-between pt-2">
          <button onClick={save} className="btn-luxe hover:[&]:btn-luxe-hover rounded-full px-5 py-2.5 text-sm">Save</button>
          <button onClick={signOut} className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm hover:bg-destructive/10 hover:text-destructive">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </div>

      <div className="glass-panel rounded-3xl p-6 max-w-xl text-sm text-muted-foreground">
        <div className="font-serif text-foreground text-base mb-1">Responsible AI</div>
        AI-generated content should be reviewed before business use. It may contain inaccuracies and does not replace human judgement.
      </div>
    </PageShell>
  );
}
