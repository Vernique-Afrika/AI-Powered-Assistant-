import { createFileRoute } from "@tanstack/react-router";
import { Hash } from "lucide-react";
import { ToolForm } from "@/components/tool-page";

export const Route = createFileRoute("/_authenticated/captions")({
  head: () => ({ meta: [{ title: "Social Caption Generator — Vernique Afrika" }] }),
  component: () => (
    <ToolForm
      tool="caption"
      icon={Hash}
      title="Social Caption Generator"
      description="Captions tuned to each platform, complete with hashtags."
      system="You write social media captions for a luxury African fashion brand. Match platform voice and length. Always end with a relevant hashtag block."
      fields={[
        { type: "select", name: "platform", label: "Platform", options: ["Instagram", "Facebook", "TikTok", "LinkedIn"] },
        { type: "text", name: "topic", label: "Post topic", placeholder: "e.g. Behind-the-scenes at Accra studio", required: true },
        { type: "textarea", name: "details", label: "Details & CTA", rows: 5, placeholder: "Product, offer, link, what action to take..." },
      ]}
      buildPrompt={(v) => `Write a ${v.platform} caption about: ${v.topic}\n\nDetails:\n${v.details}\n\nInclude 8-12 relevant hashtags at the end.`}
    />
  ),
});
