import { useState, useEffect } from "react";

export interface SurahMeta {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

// Module-level cache — fetched only once per browser session
let cachedSurahs: SurahMeta[] | null = null;
let fetchPromise: Promise<SurahMeta[]> | null = null;

async function fetchSurahs(): Promise<SurahMeta[]> {
  if (cachedSurahs) return cachedSurahs;
  if (!fetchPromise) {
    fetchPromise = fetch("/data/quran/surahs.json")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch surahs");
        return r.json();
      })
      .then((data) => {
        cachedSurahs = data.data as SurahMeta[];
        return cachedSurahs;
      })
      .catch((err) => {
        fetchPromise = null;
        throw err;
      });
  }
  return fetchPromise;
}

export function useSurahList() {
  const [surahs, setSurahs] = useState<SurahMeta[]>(cachedSurahs ?? []);
  const [loading, setLoading] = useState(!cachedSurahs);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (cachedSurahs) {
      setSurahs(cachedSurahs);
      setLoading(false);
      return;
    }
    fetchSurahs()
      .then((data) => {
        setSurahs(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err instanceof Error ? err : new Error("Unknown error"));
        setLoading(false);
      });
  }, []);

  return { surahs, loading, error };
}
