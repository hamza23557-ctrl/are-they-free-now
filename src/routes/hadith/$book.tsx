import { createFileRoute } from "@tanstack/react-router";
import { HadithReader } from "@/quran/pages/hadith";

export const Route = createFileRoute("/hadith/$book")({
  head: () => ({
    meta: [
      { title: "كتاب الحديث | تقوى القلوب | محمد صديق المنشاوي | تطبيق متكامل" },
      { name: "description", content: "قراءة أحاديث الكتاب" },
      { property: "og:title", content: "كتاب الحديث | تقوى القلوب | محمد صديق المنشاوي | تطبيق متكامل" },
      { property: "og:description", content: "قراءة أحاديث الكتاب" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HadithReader,
});
