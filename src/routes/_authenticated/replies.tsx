import { createFileRoute } from "@tanstack/react-router";
import { Reply } from "lucide-react";
import { ToolForm } from "@/components/tool-page";

export const Route = createFileRoute("/_authenticated/replies")({
  head: () => ({ meta: [{ title: "Customer Reply Generator — Vernique Afrika" }] }),
  component: () => (
    <ToolForm
      tool="reply"
      icon={Reply}
      title="Customer Reply Generator"
      description="Warm, on-brand responses to common customer messages."
      system="You draft customer service replies for Vernique Afrika. Be warm, take responsibility where appropriate, offer a clear next step, and keep the luxury voice."
      fields={[
        { type: "select", name: "type", label: "Situation", options: ["Refund request", "Delivery delay", "Product enquiry", "Thank-you message"] },
        { type: "text", name: "customer", label: "Customer name (optional)", placeholder: "e.g. Amina" },
        { type: "textarea", name: "message", label: "Customer's message", rows: 8, required: true, placeholder: "Paste what the customer wrote..." },
      ]}
      buildPrompt={(v) => `Situation: ${v.type}\nCustomer name: ${v.customer || "Customer"}\n\nTheir message:\n${v.message}`}
    />
  ),
});
