import { createFileRoute } from "@tanstack/react-router";
import QuranWrittenReader from "@/quran/pages/quran-written-reader";

export const Route = createFileRoute("/quran-written/$number")({
  head: () => ({
    meta: [
      { title: "قراءة المصحف | تقوى القلوب | محمد صديق المنشاوي | تطبيق متكامل" },
      { name: "description", content: "قراءة السورة من المصحف" },
      { property: "og:title", content: "قراءة المصحف | تقوى القلوب | محمد صديق المنشاوي | تطبيق متكامل" },
      { property: "og:description", content: "قراءة السورة من المصحف" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: QuranWrittenReader,
});
