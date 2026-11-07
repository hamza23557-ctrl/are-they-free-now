import { createFileRoute } from "@tanstack/react-router";
import AdhkarDetail from "@/quran/pages/adhkar-category";

export const Route = createFileRoute("/adhkar/$category")({
  head: () => ({
    meta: [
      { title: "الأذكار | تقوى القلوب | محمد صديق المنشاوي | تطبيق متكامل" },
      { name: "description", content: "أذكار حسب الفئة" },
      { property: "og:title", content: "الأذكار | تقوى القلوب | محمد صديق المنشاوي | تطبيق متكامل" },
      { property: "og:description", content: "أذكار حسب الفئة" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AdhkarDetail,
});
