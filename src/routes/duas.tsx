import { createFileRoute } from "@tanstack/react-router";
import Duas from "@/quran/pages/duas";

export const Route = createFileRoute("/duas")({
  head: () => ({
    meta: [
      { title: "الأدعية | تقوى القلوب | محمد صديق المنشاوي | تطبيق متكامل" },
      { name: "description", content: "أدعية من القرآن والسنة" },
      { property: "og:title", content: "الأدعية | تقوى القلوب | محمد صديق المنشاوي | تطبيق متكامل" },
      { property: "og:description", content: "أدعية من القرآن والسنة" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Duas,
});
