import { createFileRoute } from "@tanstack/react-router";
import Privacy from "@/quran/pages/privacy";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "سياسة الخصوصية | تقوى القلوب | محمد صديق المنشاوي | تطبيق متكامل" },
      { name: "description", content: "سياسة الخصوصية لتطبيق تقوى القلوب: البيانات والموقع والإشعارات والإعلانات" },
      { property: "og:title", content: "سياسة الخصوصية | تقوى القلوب" },
      { property: "og:description", content: "كيف يتعامل تطبيق تقوى القلوب مع بياناتك" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Privacy,
});
