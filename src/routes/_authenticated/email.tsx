import { createFileRoute } from "@tanstack/react-router";
import { Mail } from "lucide-react";
import { ToolForm } from "@/components/tool-page";

export const Route = createFileRoute("/_authenticated/email")({
  head: () => ({ meta: [{ title: "Email Generator — Vernique Afrika" }] }),
  component: () => (
    <ToolForm
      tool="email"
      icon={Mail}
      title="Smart Email Generator"
      description="Professional, on-brand emails in seconds."
      system="You draft polished business emails for Vernique Afrika. Include subject line, greeting, body, and sign-off. Adapt to the requested tone and audience."
      fields={[
        { type: "select", name: "tone", label: "Tone", options: ["Professional", "Friendly", "Luxury Brand", "Promotional"] },
        { type: "select", name: "audience", label: "Audience", options: ["Customers", "Suppliers", "Staff", "Business Partners"] },
        { type: "text", name: "subject", label: "Purpose / subject", placeholder: "e.g. Launch of Autumn Heritage Collection", required: true },
        { type: "textarea", name: "notes", label: "Key points to cover", rows: 6, placeholder: "Bullet the details, dates, offers...", required: true },
      ]}
      buildPrompt={(v) => `Write an email.
Tone: ${v.tone}
Audience: ${v.audience}
Subject/purpose: ${v.subject}

Key points:
${v.notes}`}
    />
  ),
});
