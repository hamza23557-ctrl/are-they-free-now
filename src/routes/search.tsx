import { createFileRoute } from "@tanstack/react-router";
import Search from "@/quran/pages/search";

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title: "البحث | تقوى القلوب | محمد صديق المنشاوي | تطبيق متكامل" },
      { name: "description", content: "البحث في القرآن الكريم" },
      { property: "og:title", content: "البحث | تقوى القلوب | محمد صديق المنشاوي | تطبيق متكامل" },
      { property: "og:description", content: "البحث في القرآن الكريم" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Search,
});
