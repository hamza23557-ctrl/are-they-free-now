import { createFileRoute } from "@tanstack/react-router";
import Surah from "@/quran/pages/surah";

export const Route = createFileRoute("/surah/$number")({
  head: () => ({
    meta: [
      { title: "سورة | تقوى القلوب | محمد صديق المنشاوي | تطبيق متكامل" },
      { name: "description", content: "قراءة السورة مع الترجمة والاستماع" },
      { property: "og:title", content: "سورة | تقوى القلوب | محمد صديق المنشاوي | تطبيق متكامل" },
      { property: "og:description", content: "قراءة السورة مع الترجمة والاستماع" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Surah,
});
