import { createFileRoute } from "@tanstack/react-router";
import Home from "@/quran/pages/home";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "الرئيسية | تقوى القلوب | محمد صديق المنشاوي | تطبيق متكامل" },
      { name: "description", content: "تطبيق تقوى القلوب: قراءة واستماع وتفسير وأذكار ومواقيت صلاة" },
      { property: "og:title", content: "الرئيسية | تقوى القلوب | محمد صديق المنشاوي | تطبيق متكامل" },
      { property: "og:description", content: "تطبيق تقوى القلوب: قراءة واستماع وتفسير وأذكار ومواقيت صلاة" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});
