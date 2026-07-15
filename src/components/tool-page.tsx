import { useState, type ReactNode } from "react";
import { useServerFn } from "@tanstack/react-start";
import { runTool } from "@/lib/ai.functions";
import { toast } from "sonner";
import { Copy, Sparkles, Loader2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export function PageHeader({ icon: Icon, title, description }: { icon: LucideIcon; title: string; description: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl gradient-gold text-[oklch(0.16_0.02_160)] shadow-[var(--shadow-gold)]">
        <Icon className="h-6 w-6" strokeWidth={1.5} />
      </div>
      <div className="min-w-0">
        <h1 className="font-serif text-3xl md:text-4xl">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

export function PageShell({ children }: { children: ReactNode }) {
  return <div className="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-10 space-y-8">{children}</div>;
}

export type Field =
  | { type: "text"; name: string; label: string; placeholder?: string; required?: boolean }
  | { type: "textarea"; name: string; label: string; placeholder?: string; rows?: number; required?: boolean }
  | { type: "select"; name: string; label: string; options: string[] };

export function ToolForm({
  tool,
  icon,
  title,
  description,
  fields,
  buildPrompt,
  system,
}: {
  tool: string;
  icon: LucideIcon;
  title: string;
  description: string;
  fields: Field[];
  system: string;
  buildPrompt: (values: Record<string, string>) => string;
}) {
  const run = useServerFn(runTool);
  const [values, setValues] = useState<Record<string, string>>(
    () => Object.fromEntries(fields.map((f) => [f.name, f.type === "select" ? f.options[0] : ""])),
  );
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setOutput("");
    try {
      const res = await run({
        data: { tool, title: title, system, user: buildPrompt(values) },
      });
      setOutput(res.output);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  }

  function copyOutput() {
    navigator.clipboard.writeText(output);
    toast.success("Copied to clipboard");
  }

  return (
    <PageShell>
      <PageHeader icon={icon} title={title} description={description} />

      <div className="grid gap-6 lg:grid-cols-5">
        <form onSubmit={submit} className="glass-panel rounded-3xl p-6 space-y-4 lg:col-span-2">
          {fields.map((f) => (
            <div key={f.name}>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {f.label}
              </label>
              {f.type === "text" && (
                <input
                  required={f.required}
                  placeholder={f.placeholder}
                  value={values[f.name]}
                  onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
                  className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent"
                />
              )}
              {f.type === "textarea" && (
                <textarea
                  required={f.required}
                  placeholder={f.placeholder}
                  rows={f.rows ?? 5}
                  value={values[f.name]}
                  onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
                  className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent"
                />
              )}
              {f.type === "select" && (
                <select
                  value={values[f.name]}
                  onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
                  className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent"
                >
                  {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              )}
            </div>
          ))}
          <button type="submit" disabled={loading}
            className="btn-luxe hover:[&]:btn-luxe-hover flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-medium disabled:opacity-60">
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Generating...</> : <><Sparkles className="h-4 w-4" /> Generate</>}
          </button>
        </form>

        <div className="glass-panel rounded-3xl p-6 lg:col-span-3 min-h-[400px]">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-serif text-lg">Output</h3>
            {output && (
              <button onClick={copyOutput} className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs hover:bg-accent/10">
                <Copy className="h-3 w-3" /> Copy
              </button>
            )}
          </div>
          {loading && (
            <div className="space-y-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-3 rounded-full bg-muted/60 animate-pulse" style={{ width: `${60 + (i * 5) % 40}%` }} />
              ))}
            </div>
          )}
          {!loading && !output && (
            <div className="flex h-[340px] flex-col items-center justify-center text-center text-sm text-muted-foreground">
              <Sparkles className="mb-3 h-8 w-8 text-accent" />
              Your AI-crafted output will appear here.
            </div>
          )}
          {!loading && output && (
            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground">{output}</pre>
          )}
        </div>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        AI-generated content should be reviewed before business use.
      </p>
    </PageShell>
  );
}
