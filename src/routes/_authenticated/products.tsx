import { createFileRoute } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import { ToolForm } from "@/components/tool-page";

export const Route = createFileRoute("/_authenticated/products")({
  head: () => ({ meta: [{ title: "Product Description Generator — Vernique Afrika" }] }),
  component: () => (
    <ToolForm
      tool="product"
      icon={ShoppingBag}
      title="Product Description Generator"
      description="Premium copy that captures fabric, craft, and story."
      system="You write luxury e-commerce product descriptions for Vernique Afrika. Structure: evocative headline, 90-120 word main description (sensory, story-led), 4 short bullet features, care note. Elegant but never florid."
      fields={[
        { type: "select", name: "category", label: "Category", options: ["Dress", "Hoodie", "T-shirt", "Jacket", "Accessory"] },
        { type: "text", name: "name", label: "Product name", placeholder: "e.g. Amani Wrap Dress", required: true },
        { type: "text", name: "materials", label: "Materials / fabric", placeholder: "e.g. Ghanaian kente-inspired silk twill" },
        { type: "textarea", name: "features", label: "Details & features", rows: 6, placeholder: "Cut, colours, occasion, sustainability..." },
      ]}
      buildPrompt={(v) => `Product: ${v.category} — ${v.name}\nMaterials: ${v.materials}\nDetails:\n${v.features}`}
    />
  ),
});
