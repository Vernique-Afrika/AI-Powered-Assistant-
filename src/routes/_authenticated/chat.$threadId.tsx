import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getThreadMessages, listThreads, createThread } from "@/lib/threads.functions";
import { sendChat } from "@/lib/ai.functions";
import { useEffect, useRef, useState } from "react";
import { PageShell } from "@/components/tool-page";
import { toast } from "sonner";
import { MessagesSquare, Send, Plus, Loader2, Sparkles } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/chat/$threadId")({
  head: () => ({ meta: [{ title: "Chat — Vernique Afrika" }] }),
  component: ChatThread,
});

function ChatThread() {
  const { threadId } = Route.useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const msgsFn = useServerFn(getThreadMessages);
  const listFn = useServerFn(listThreads);
  const createFn = useServerFn(createThread);
  const sendFn = useServerFn(sendChat);

  const { data: threads } = useQuery({ queryKey: ["threads"], queryFn: () => listFn() });
  const { data: messages } = useQuery({
    queryKey: ["messages", threadId],
    queryFn: () => msgsFn({ data: { threadId } }),
  });

  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [optimistic, setOptimistic] = useState<{ role: "user"; content: string } | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, [threadId]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, optimistic, pending]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || pending) return;
    setInput("");
    setOptimistic({ role: "user", content: text });
    setPending(true);
    try {
      await sendFn({ data: { threadId, message: text } });
      await qc.invalidateQueries({ queryKey: ["messages", threadId] });
      await qc.invalidateQueries({ queryKey: ["threads"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Chat failed");
    } finally {
      setOptimistic(null);
      setPending(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }

  async function newChat() {
    const { id } = await createFn();
    qc.invalidateQueries({ queryKey: ["threads"] });
    navigate({ to: "/chat/$threadId", params: { threadId: id } });
  }

  const isEmpty = !messages || messages.length === 0;

  return (
    <PageShell>
      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        {/* Thread list */}
        <aside className="glass-panel rounded-3xl p-3 lg:sticky lg:top-4 lg:h-[calc(100vh-6rem)] lg:overflow-y-auto">
          <button onClick={newChat} className="btn-luxe hover:[&]:btn-luxe-hover mb-2 flex w-full items-center justify-center gap-2 rounded-full py-2.5 text-sm">
            <Plus className="h-4 w-4" /> New chat
          </button>
          <div className="space-y-1">
            {threads?.map((t) => {
              const active = t.id === threadId;
              return (
                <Link key={t.id} to="/chat/$threadId" params={{ threadId: t.id }}
                  className={`block truncate rounded-xl px-3 py-2 text-sm ${active ? "gradient-luxe text-primary-foreground" : "hover:bg-accent/10"}`}>
                  {t.title}
                </Link>
              );
            })}
          </div>
        </aside>

        {/* Chat */}
        <section className="glass-panel flex flex-col rounded-3xl overflow-hidden min-h-[70vh]">
          <div className="border-b border-border/60 px-6 py-4 flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl gradient-gold text-[oklch(0.16_0.02_160)]">
              <MessagesSquare className="h-5 w-5" strokeWidth={1.75} />
            </div>
            <div>
              <div className="font-serif text-lg">Vernique Afrika Assistant</div>
              <div className="text-xs text-muted-foreground">Fashion · Marketing · Brand · Customer care</div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 md:px-8">
            {isEmpty && !optimistic && (
              <div className="mx-auto max-w-md text-center py-12">
                <Sparkles className="mx-auto mb-3 h-8 w-8 text-accent" />
                <h3 className="font-serif text-xl">Where would you like to begin?</h3>
                <p className="mt-2 text-sm text-muted-foreground">Try: "Give me 5 launch caption ideas for a kente-inspired blazer."</p>
              </div>
            )}
            {messages?.map((m) => <Bubble key={m.id} role={m.role} content={m.content} />)}
            {optimistic && <Bubble role="user" content={optimistic.content} />}
            {pending && (
              <div className="flex gap-3">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full gradient-gold"><Sparkles className="h-4 w-4" /></div>
                <div className="rounded-2xl bg-secondary px-4 py-3 text-sm text-muted-foreground flex items-center gap-2">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Thinking...
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <form onSubmit={send} className="border-t border-border/60 p-4 md:p-5">
            <div className="flex items-end gap-2 rounded-2xl border border-input bg-background p-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void send(e as unknown as React.FormEvent); }}}
                placeholder="Ask about marketing, captions, product copy, replies..."
                rows={2}
                className="flex-1 resize-none bg-transparent px-2 py-1 text-sm outline-none"
              />
              <button type="submit" disabled={pending || !input.trim()}
                className="btn-luxe hover:[&]:btn-luxe-hover grid h-10 w-10 shrink-0 place-items-center rounded-xl disabled:opacity-50">
                {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </button>
            </div>
          </form>
        </section>
      </div>
    </PageShell>
  );
}

function Bubble({ role, content }: { role: string; content: string }) {
  const isUser = role === "user";
  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : ""}`}>
      {!isUser && (
        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full gradient-gold text-[oklch(0.16_0.02_160)]">
          <Sparkles className="h-4 w-4" />
        </div>
      )}
      <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
        isUser ? "gradient-luxe text-primary-foreground" : "bg-secondary text-foreground"
      }`}>{content}</div>
    </div>
  );
}
