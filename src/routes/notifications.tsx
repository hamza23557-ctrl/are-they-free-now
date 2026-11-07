import { createFileRoute } from "@tanstack/react-router";
import Notifications from "@/quran/pages/notifications";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "الإشعارات | تقوى القلوب | محمد صديق المنشاوي | تطبيق متكامل" },
      { name: "description", content: "تذكير بأذكار الصباح والمساء وتسبيحة كل نصف ساعة" },
      { property: "og:title", content: "الإشعارات | تقوى القلوب | محمد صديق المنشاوي | تطبيق متكامل" },
      { property: "og:description", content: "تذكير بأذكار الصباح والمساء وتسبيحة كل نصف ساعة" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Notifications,
});
