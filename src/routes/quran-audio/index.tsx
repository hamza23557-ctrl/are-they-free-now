import { createFileRoute } from "@tanstack/react-router";
import QuranAudio from "@/quran/pages/quran-audio";

export const Route = createFileRoute("/quran-audio/")({
  head: () => ({
    meta: [
      { title: "القرآن صوتاً | تقوى القلوب | محمد صديق المنشاوي | تطبيق متكامل" },
      { name: "description", content: "الاستماع إلى تلاوات القرآن الكريم" },
      { property: "og:title", content: "القرآن صوتاً | تقوى القلوب | محمد صديق المنشاوي | تطبيق متكامل" },
      { property: "og:description", content: "الاستماع إلى تلاوات القرآن الكريم" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: QuranAudio,
});
