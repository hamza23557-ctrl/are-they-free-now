import { createFileRoute } from "@tanstack/react-router";
import PrayerTimes from "@/quran/pages/prayer-times";

export const Route = createFileRoute("/prayer-times")({
  head: () => ({
    meta: [
      { title: "مواقيت الصلاة | تقوى القلوب | محمد صديق المنشاوي | تطبيق متكامل" },
      { name: "description", content: "مواقيت الصلاة حسب موقعك" },
      { property: "og:title", content: "مواقيت الصلاة | تقوى القلوب | محمد صديق المنشاوي | تطبيق متكامل" },
      { property: "og:description", content: "مواقيت الصلاة حسب موقعك" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PrayerTimes,
});
