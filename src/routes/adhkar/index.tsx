import { createFileRoute } from "@tanstack/react-router";
import AdhkarCategories from "@/quran/pages/adhkar";

export const Route = createFileRoute("/adhkar/")({
  head: () => ({
    meta: [
      { title: "الأذكار | تقوى القلوب | محمد صديق المنشاوي | تطبيق متكامل" },
      { name: "description", content: "أذكار الصباح والمساء وغيرها" },
      { property: "og:title", content: "الأذكار | تقوى القلوب | محمد صديق المنشاوي | تطبيق متكامل" },
      { property: "og:description", content: "أذكار الصباح والمساء وغيرها" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AdhkarCategories,
});
