import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const MODEL = "google/gemini-2.5-flash";
const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";

const BRAND = `You are the AI Business Assistant for Vernique Afrika — a luxury African fashion brand. Voice: elegant, warm, confident, premium. Weave in subtle references to African heritage, artisanship, and modern luxury where appropriate. Never sound generic. Keep formatting clean with markdown headings and bullets when helpful.`;

async function callAI(system: string, user: string): Promise<string> {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("Missing LOVABLE_API_KEY");
  const res = await fetch(GATEWAY, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: `${BRAND}\n\n${system}` },
        { role: "user", content: user },
      ],
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    if (res.status === 429) throw new Error("Rate limit — please retry in a moment.");
    if (res.status === 402) throw new Error("AI credits exhausted. Please add credits in Lovable settings.");
    throw new Error(`AI request failed [${res.status}]: ${body}`);
  }
  const json = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
  return json.choices?.[0]?.message?.content ?? "";
}

const RunSchema = z.object({
  tool: z.string(),
  title: z.string().optional(),
  system: z.string(),
  user: z.string(),
});

export const runTool = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => RunSchema.parse(raw))
  .handler(async ({ data, context }) => {
    const output = await callAI(data.system, data.user);
    const { error } = await context.supabase.from("generations").insert({
      user_id: context.userId,
      tool: data.tool,
      title: data.title ?? null,
      input: { user: data.user },
      output,
    });
    if (error) console.error("save generation failed", error);
    return { output };
  });

const ChatSchema = z.object({
  threadId: z.string().uuid(),
  message: z.string().min(1),
});

export const sendChat = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => ChatSchema.parse(raw))
  .handler(async ({ data, context }) => {
    // Verify thread ownership
    const { data: thread } = await context.supabase
      .from("threads").select("id, title").eq("id", data.threadId).maybeSingle();
    if (!thread) throw new Error("Thread not found");

    // Save user message
    await context.supabase.from("messages").insert({
      thread_id: data.threadId, user_id: context.userId, role: "user", content: data.message,
    });

    // Fetch full history
    const { data: history } = await context.supabase
      .from("messages").select("role, content").eq("thread_id", data.threadId).order("created_at");

    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const res = await fetch(GATEWAY, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: `${BRAND}\n\nYou answer questions about marketing ideas, product descriptions, customer service replies, clothing branding, social media captions, and fashion business advice.` },
          ...(history ?? []),
        ],
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      if (res.status === 429) throw new Error("Rate limit — please retry in a moment.");
      if (res.status === 402) throw new Error("AI credits exhausted.");
      throw new Error(`AI request failed [${res.status}]: ${body}`);
    }
    const json = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const reply = json.choices?.[0]?.message?.content ?? "";

    await context.supabase.from("messages").insert({
      thread_id: data.threadId, user_id: context.userId, role: "assistant", content: reply,
    });

    // Auto-title thread from first user message
    if (thread.title === "New conversation") {
      const title = data.message.slice(0, 60);
      await context.supabase.from("threads").update({ title, updated_at: new Date().toISOString() }).eq("id", data.threadId);
    } else {
      await context.supabase.from("threads").update({ updated_at: new Date().toISOString() }).eq("id", data.threadId);
    }

    return { reply };
  });
