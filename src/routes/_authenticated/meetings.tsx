import { createFileRoute } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import { ToolForm } from "@/components/tool-page";

export const Route = createFileRoute("/_authenticated/meetings")({
  head: () => ({ meta: [{ title: "Meeting Notes Summarizer — Vernique Afrika" }] }),
  component: () => (
    <ToolForm
      tool="meeting"
      icon={FileText}
      title="Meeting Notes Summarizer"
      description="Turn raw notes into a clear summary, action items, deadlines, and owners."
      system="You summarize business meeting notes. Return sections: ## Summary, ## Action Items (with owners), ## Deadlines, ## Responsibilities."
      fields={[
        { type: "text", name: "topic", label: "Meeting topic", placeholder: "e.g. Q4 supplier review" },
        { type: "textarea", name: "notes", label: "Paste meeting notes", rows: 14, required: true },
      ]}
      buildPrompt={(v) => `Meeting topic: ${v.topic || "Untitled"}\n\nNotes:\n${v.notes}`}
    />
  ),
});
