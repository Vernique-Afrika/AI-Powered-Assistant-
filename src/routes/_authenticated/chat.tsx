import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { createThread, deleteThread, listThreads } from "@/lib/threads.functions";
import { PageHeader, PageShell } from "@/components/tool-page";
import { MessagesSquare, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/chat")({
  head: () => ({ meta: [{ title: "AI Chat — Vernique Afrika" }] }),
  component: ChatIndex,
});

function ChatIndex() {
  const listFn = useServerFn(listThreads);
  const createFn = useServerFn(createThread);
  const delFn = useServerFn(deleteThread);
  const navigate = useNavigate();
  const { data: threads, refetch } = useQuery({ queryKey: ["threads"], queryFn: () => listFn() });

  async function newChat() {
    const { id } = await createFn();
    navigate({ to: "/chat/$threadId", params: { threadId: id } });
  }

  async function remove(id: string) {
    await delFn({ data: { id } });
    toast.success("Conversation deleted");
    refetch();
  }

  return (
    <PageShell>
      <div className="flex items-center justify-between gap-4">
        <PageHeader icon={MessagesSquare} title="AI Chat Assistant" description="Marketing, product, branding, replies — ask anything." />
        <button onClick={newChat} className="btn-luxe hover:[&]:btn-luxe-hover inline-flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium">
          <Plus className="h-4 w-4" /> New chat
        </button>
      </div>

      <div className="glass-panel divide-y divide-border/60 rounded-3xl">
        {(!threads || threads.length === 0) && (
          <div className="p-10 text-center text-sm text-muted-foreground">
            No conversations yet. Start one to get advice, captions, or ideas.
          </div>
        )}
        {threads?.map((t) => (
          <div key={t.id} className="flex items-center justify-between gap-3 p-4 hover:bg-accent/5">
            <Link to="/chat/$threadId" params={{ threadId: t.id }} className="min-w-0 flex-1">
              <div className="font-serif truncate">{t.title}</div>
              <div className="text-xs text-muted-foreground">{new Date(t.updated_at).toLocaleString()}</div>
            </Link>
            <button onClick={() => remove(t.id)} className="rounded-full p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
