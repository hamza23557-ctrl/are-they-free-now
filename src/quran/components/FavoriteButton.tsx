import { Heart } from "lucide-react";
import { useDhikrFavorites, type FavoriteItem } from "@/quran/hooks/useDhikrFavorites";

export function FavoriteButton({ item, className = "" }: { item: FavoriteItem; className?: string }) {
  const { isFavorite, toggle } = useDhikrFavorites();
  const active = isFavorite(item.key);
  return (
    <button
      type="button"
      aria-label={active ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
      data-testid={`button-favorite-${item.key}`}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        toggle(item);
      }}
      className={`p-2 rounded-full transition-colors ${
        active ? "text-red-500" : "text-muted-foreground hover:text-red-500"
      } ${className}`}
    >
      <Heart className={`w-5 h-5 ${active ? "fill-red-500" : ""}`} />
    </button>
  );
}
