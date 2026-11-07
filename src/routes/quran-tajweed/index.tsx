import { createFileRoute } from "@tanstack/react-router";
import QuranTajweed from "@/quran/pages/quran-tajweed";

export const Route = createFileRoute("/quran-tajweed/")({
  head: () => ({
    meta: [
      { title: "التجويد | تقوى القلوب | محمد صديق المنشاوي | تطبيق متكامل" },
      { name: "description", content: "تلاوات القرآن الكريم بأحكام التجويد" },
      { property: "og:title", content: "التجويد | تقوى القلوب | محمد صديق المنشاوي | تطبيق متكامل" },
      { property: "og:description", content: "تلاوات القرآن الكريم بأحكام التجويد" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: QuranTajweed,
});
