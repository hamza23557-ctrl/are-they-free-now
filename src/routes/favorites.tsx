import { createFileRoute } from "@tanstack/react-router";
import Favorites from "@/quran/pages/favorites";

export const Route = createFileRoute("/favorites")({
  component: Favorites,
  head: () => ({
    meta: [
      { title: "المفضلة | تقوى القلوب | محمد صديق المنشاوي | تطبيق متكامل" },
      { name: "description", content: "أدعيتك وأذكارك وتسابيحك المحفوظة في المفضلة" },
      { property: "og:title", content: "المفضلة | تقوى القلوب | محمد صديق المنشاوي | تطبيق متكامل" },
      { property: "og:description", content: "أدعيتك وأذكارك وتسابيحك المحفوظة في المفضلة" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});
