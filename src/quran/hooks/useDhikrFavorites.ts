import { useState } from "react";

export type FavoriteType = "dua" | "dhikr" | "tasbeeh";

export interface FavoriteItem {
  key: string;
  type: FavoriteType;
  title: string;
  text: string;
  source?: string;
}

const KEY = "dhikr-favorites";

export function loadFavorites(): FavoriteItem[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveFavorites(items: FavoriteItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function useDhikrFavorites() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>(loadFavorites);

  function toggle(item: FavoriteItem) {
    const current = loadFavorites();
    const exists = current.some((f) => f.key === item.key);
    const next = exists ? current.filter((f) => f.key !== item.key) : [...current, item];
    saveFavorites(next);
    setFavorites(next);
  }

  function remove(key: string) {
    const next = loadFavorites().filter((f) => f.key !== key);
    saveFavorites(next);
    setFavorites(next);
  }

  return {
    favorites,
    isFavorite: (key: string) => favorites.some((f) => f.key === key),
    toggle,
    remove,
  };
}
