import { createFileRoute } from "@tanstack/react-router";
import { HadithFavorites } from "@/quran/pages/hadith";

export const Route = createFileRoute("/hadith/favorites")({
  head: () => ({
    meta: [
      { title: "الأحاديث المفضلة | تقوى القلوب | محمد صديق المنشاوي | تطبيق متكامل" },
      { name: "description", content: "الأحاديث المحفوظة في المفضلة" },
      { property: "og:title", content: "الأحاديث المفضلة | تقوى القلوب | محمد صديق المنشاوي | تطبيق متكامل" },
      { property: "og:description", content: "الأحاديث المحفوظة في المفضلة" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HadithFavorites,
});
