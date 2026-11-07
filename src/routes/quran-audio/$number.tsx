import { createFileRoute } from "@tanstack/react-router";
import QuranAudioPlayer from "@/quran/pages/quran-audio-player";
import { parseAyahSearch } from "@/quran/lib/quran-search";

export const Route = createFileRoute("/quran-audio/$number")({
  validateSearch: parseAyahSearch,
  head: () => ({
    meta: [
      { title: "مشغل التلاوة | تقوى القلوب | محمد صديق المنشاوي | تطبيق متكامل" },
      { name: "description", content: "الاستماع إلى تلاوة السورة" },
      { property: "og:title", content: "مشغل التلاوة | تقوى القلوب | محمد صديق المنشاوي | تطبيق متكامل" },
      { property: "og:description", content: "الاستماع إلى تلاوة السورة" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: QuranAudioPlayer,
});
