import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { ToolForm } from "@/components/tool-page";

export const Route = createFileRoute("/_authenticated/research")({
  head: () => ({ meta: [{ title: "AI Research Assistant — Vernique Afrika" }] }),
  component: () => (
    <ToolForm
      tool="research"
      icon={Search}
      title="AI Research Assistant"
      description="Trends, suppliers, competitors — synthesized into actionable insight."
      system="You are a research analyst for a luxury African fashion brand. Structure output as: ## Overview, ## Key Findings, ## Opportunities for Vernique Afrika, ## Recommended Next Steps. Use bullets."
      fields={[
        { type: "select", name: "type", label: "Type of research", options: ["Fashion trend summary", "Clothing supplier research", "Competitor analysis", "Business insights"] },
        { type: "text", name: "topic", label: "Topic / market", placeholder: "e.g. AW26 African-inspired streetwear", required: true },
        { type: "textarea", name: "notes", label: "Context / questions", rows: 6, placeholder: "What specifically do you want to know?" },
      ]}
      buildPrompt={(v) => `${v.type} on: ${v.topic}\n\nAdditional context:\n${v.notes || "(none)"}`}
    />
  ),
});
