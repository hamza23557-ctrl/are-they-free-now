import { createFileRoute } from "@tanstack/react-router";
import Hadith from "@/quran/pages/hadith";

export const Route = createFileRoute("/hadith/")({
  head: () => ({
    meta: [
      { title: "الحديث | تقوى القلوب | محمد صديق المنشاوي | تطبيق متكامل" },
      { name: "description", content: "كتب الحديث الشريف" },
      { property: "og:title", content: "الحديث | تقوى القلوب | محمد صديق المنشاوي | تطبيق متكامل" },
      { property: "og:description", content: "كتب الحديث الشريف" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Hadith,
});
