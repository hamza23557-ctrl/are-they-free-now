import { createFileRoute } from "@tanstack/react-router";
import Tafsir from "@/quran/pages/tafsir";

export const Route = createFileRoute("/tafsir")({
  head: () => ({
    meta: [
      { title: "التفسير | تقوى القلوب | محمد صديق المنشاوي | تطبيق متكامل" },
      { name: "description", content: "تفسير آيات القرآن الكريم" },
      { property: "og:title", content: "التفسير | تقوى القلوب | محمد صديق المنشاوي | تطبيق متكامل" },
      { property: "og:description", content: "تفسير آيات القرآن الكريم" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Tafsir,
});
