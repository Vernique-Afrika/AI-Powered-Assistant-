import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

export const listThreads = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("threads").select("id, title, updated_at").order("updated_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  });

export const createThread = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("threads").insert({ user_id: context.userId, title: "New conversation" })
      .select("id").single();
    if (error) throw error;
    return { id: data.id as string };
  });

export const deleteThread = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => z.object({ id: z.string().uuid() }).parse(raw))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("threads").delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

export const getThreadMessages = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => z.object({ threadId: z.string().uuid() }).parse(raw))
  .handler(async ({ data, context }) => {
    const { data: msgs, error } = await context.supabase
      .from("messages").select("id, role, content, created_at").eq("thread_id", data.threadId).order("created_at");
    if (error) throw error;
    return msgs ?? [];
  });

export const getDashboardStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: gens } = await context.supabase.from("generations").select("tool");
    const { data: threads } = await context.supabase.from("threads").select("id");
    const list = gens ?? [];
    const count = (t: string) => list.filter((g) => g.tool === t).length;
    return {
      total: list.length,
      emails: count("email"),
      summaries: count("meeting"),
      tasks: count("tasks"),
      research: count("research"),
      marketing: count("marketing"),
      products: count("product"),
      captions: count("caption"),
      replies: count("reply"),
      chats: threads?.length ?? 0,
    };
  });

export const getRecentGenerations = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("generations").select("id, tool, title, created_at").order("created_at", { ascending: false }).limit(8);
    return data ?? [];
  });
