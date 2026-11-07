import { useState, useEffect } from "react";

export interface Bookmark {
  surahNumber: number;
  ayahNumber?: number;
  surahName: string;
  timestamp: number;
}

export function useBookmarks() {
  const [bookmark, setBookmark] = useState<Bookmark | null>(() => {
    try {
      const item = localStorage.getItem("quran-bookmark");
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  });

  const saveBookmark = (b: Omit<Bookmark, "timestamp">) => {
    const newBookmark = { ...b, timestamp: Date.now() };
    setBookmark(newBookmark);
    localStorage.setItem("quran-bookmark", JSON.stringify(newBookmark));
  };

  return { bookmark, saveBookmark };
}
