import { createFileRoute } from "@tanstack/react-router";
import Qibla from "@/quran/pages/qibla";

export const Route = createFileRoute("/qibla")({
  head: () => ({
    meta: [
      { title: "القبلة | تقوى القلوب | محمد صديق المنشاوي | تطبيق متكامل" },
      { name: "description", content: "تحديد اتجاه القبلة" },
      { property: "og:title", content: "القبلة | تقوى القلوب | محمد صديق المنشاوي | تطبيق متكامل" },
      { property: "og:description", content: "تحديد اتجاه القبلة" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Qibla,
});
