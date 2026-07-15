import { createFileRoute } from "@tanstack/react-router";
import { Megaphone } from "lucide-react";
import { ToolForm } from "@/components/tool-page";

export const Route = createFileRoute("/_authenticated/marketing")({
  head: () => ({ meta: [{ title: "Marketing Campaign Generator — Vernique Afrika" }] }),
  component: () => (
    <ToolForm
      tool="marketing"
      icon={Megaphone}
      title="Marketing Campaign Generator"
      description="Campaign concepts, promotions, seasonal sales, and email flows."
      system="You are a luxury fashion marketing strategist. Produce: ## Campaign Concept, ## Positioning, ## Channels & Assets, ## Promotion Mechanics, ## 4-week Timeline, ## Email Flow (3 emails with subject lines)."
      fields={[
        { type: "select", name: "type", label: "Campaign type", options: ["Campaign idea", "Promotion", "Seasonal sale", "Email campaign"] },
        { type: "text", name: "product", label: "Product / collection", placeholder: "e.g. Heritage Hoodie drop", required: true },
        { type: "text", name: "audience", label: "Target audience", placeholder: "e.g. Diaspora women 25-40" },
        { type: "textarea", name: "goals", label: "Goals & context", rows: 5, placeholder: "Budget, dates, KPIs, must-includes..." },
      ]}
      buildPrompt={(v) => `Create a ${v.type} for: ${v.product}\nAudience: ${v.audience || "general Vernique Afrika customers"}\nContext:\n${v.goals}`}
    />
  ),
});
