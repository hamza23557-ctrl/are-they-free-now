import { createFileRoute } from "@tanstack/react-router";
import QuranWritten from "@/quran/pages/quran-written";

export const Route = createFileRoute("/quran-written/")({
  head: () => ({
    meta: [
      { title: "المصحف | تقوى القلوب | محمد صديق المنشاوي | تطبيق متكامل" },
      { name: "description", content: "قراءة المصحف الشريف" },
      { property: "og:title", content: "المصحف | تقوى القلوب | محمد صديق المنشاوي | تطبيق متكامل" },
      { property: "og:description", content: "قراءة المصحف الشريف" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: QuranWritten,
});
