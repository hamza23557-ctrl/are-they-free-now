import { createFileRoute } from "@tanstack/react-router";
import AsmaHusna from "@/quran/pages/asma-husna";

export const Route = createFileRoute("/asma-husna")({
  head: () => ({
    meta: [
      { title: "أسماء الله الحسنى | تقوى القلوب | محمد صديق المنشاوي | تطبيق متكامل" },
      { name: "description", content: "تعرف على أسماء الله الحسنى" },
      { property: "og:title", content: "أسماء الله الحسنى | تقوى القلوب | محمد صديق المنشاوي | تطبيق متكامل" },
      { property: "og:description", content: "تعرف على أسماء الله الحسنى" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AsmaHusna,
});
