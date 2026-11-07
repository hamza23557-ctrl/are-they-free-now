import { useState } from "react";

const KEY = "quran-favorites";

function load(): number[] {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<number[]>(load);

  function toggle(num: number) {
    setFavorites((prev) => {
      const next = prev.includes(num) ? prev.filter((n) => n !== num) : [...prev, num];
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }

  return {
    favorites,
    isFavorite: (num: number) => favorites.includes(num),
    toggle,
  };
}
