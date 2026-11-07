import { createFileRoute } from "@tanstack/react-router";
import Tasbeeh from "@/quran/pages/tasbeeh";

export const Route = createFileRoute("/tasbeeh")({
  head: () => ({
    meta: [
      { title: "التسبيح | تقوى القلوب | محمد صديق المنشاوي | تطبيق متكامل" },
      { name: "description", content: "عداد التسبيح الإلكتروني" },
      { property: "og:title", content: "التسبيح | تقوى القلوب | محمد صديق المنشاوي | تطبيق متكامل" },
      { property: "og:description", content: "عداد التسبيح الإلكتروني" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Tasbeeh,
});
