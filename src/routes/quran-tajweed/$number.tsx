import { createFileRoute } from "@tanstack/react-router";
import QuranTajweedPlayer from "@/quran/pages/quran-tajweed-player";

export const Route = createFileRoute("/quran-tajweed/$number")({
  head: () => ({
    meta: [
      { title: "مشغل التجويد | تقوى القلوب | محمد صديق المنشاوي | تطبيق متكامل" },
      { name: "description", content: "الاستماع إلى التلاوة المجودة" },
      { property: "og:title", content: "مشغل التجويد | تقوى القلوب | محمد صديق المنشاوي | تطبيق متكامل" },
      { property: "og:description", content: "الاستماع إلى التلاوة المجودة" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: QuranTajweedPlayer,
});
