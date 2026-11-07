import { useState, useEffect } from "react";

export interface Ayah {
  numberInSurah: number;
  textAr: string;
  textEn: string;
}

export interface SurahData {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
  ayahs: Ayah[];
}

// Module-level cache keyed by surah number
const cache: Record<number, SurahData> = {};
const pendingFetches: Record<number, Promise<SurahData>> = {};

function withoutBasmala(text: string): string {
  const plain = text.replace(/[\u064B-\u065F\u0670]/g, "");
  const basmala = "بسم الله الرحمن الرحيم";
  return plain.startsWith(basmala) ? plain.slice(basmala.length).trimStart() : text;
}

async function fetchSurah(number: number): Promise<SurahData> {
  if (cache[number]) return cache[number];
  if (!pendingFetches[number]) {
    pendingFetches[number] = Promise.all([
      fetch(`/data/quran/quran-uthmani/${number}.json`).then((r) => {
        if (!r.ok) throw new Error("Failed to fetch surah");
        return r.json();
      }),
      fetch(`/data/quran/en.asad/${number}.json`).then((r) => {
        if (!r.ok) throw new Error("Failed to fetch translation");
        return r.json();
      }),
    ])
      .then(([arData, enData]) => {
        const ayahs: Ayah[] = arData.data.ayahs.map((ayah: any, idx: number) => ({
          numberInSurah: ayah.numberInSurah,
          textAr: withoutBasmala(ayah.text),
          textEn: enData.data.ayahs[idx].text,
        }));
        const result: SurahData = {
          number: arData.data.number,
          name: arData.data.name,
          englishName: arData.data.englishName,
          englishNameTranslation: arData.data.englishNameTranslation,
          numberOfAyahs: arData.data.numberOfAyahs ?? ayahs.length,
          revelationType: arData.data.revelationType,
          ayahs,
        };
        cache[number] = result;
        return result;
      })
      .catch((err) => {
        delete pendingFetches[number];
        throw err;
      });
  }
  return pendingFetches[number];
}

export function useSurah(number: number | string) {
  const num = typeof number === "string" ? parseInt(number) : number;
  const [surah, setSurah] = useState<SurahData | null>(cache[num] ?? null);
  const [loading, setLoading] = useState(!cache[num]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!num) return;
    if (cache[num]) {
      setSurah(cache[num]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setSurah(null);
    fetchSurah(num)
      .then((data) => {
        setSurah(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err instanceof Error ? err : new Error("Unknown error"));
        setLoading(false);
      });
  }, [num]);

  return { surah, loading, error };
}
