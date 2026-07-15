import { createFileRoute } from "@tanstack/react-router";
import { ListChecks } from "lucide-react";
import { ToolForm } from "@/components/tool-page";

export const Route = createFileRoute("/_authenticated/tasks")({
  head: () => ({ meta: [{ title: "AI Task Planner — Vernique Afrika" }] }),
  component: () => (
    <ToolForm
      tool="tasks"
      icon={ListChecks}
      title="AI Task Planner"
      description="Turn a brain-dump into a prioritized daily or weekly plan."
      system="You are a productivity planner for Vernique Afrika. Produce a schedule with prioritized tasks (High/Med/Low), suggested time blocks, and 3 short productivity tips at the end. Use markdown headings and checklists."
      fields={[
        { type: "select", name: "range", label: "Plan for", options: ["Today", "This week"] },
        { type: "text", name: "focus", label: "Main focus", placeholder: "e.g. Launch campaign & studio shoot" },
        { type: "textarea", name: "tasks", label: "Tasks / commitments", rows: 10, placeholder: "One per line", required: true },
      ]}
      buildPrompt={(v) => `Create a ${v.range} plan. Focus: ${v.focus || "general"}.\nTasks:\n${v.tasks}`}
    />
  ),
});
