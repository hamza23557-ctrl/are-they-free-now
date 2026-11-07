import type { SurahMeta } from "@/quran/hooks/useSurahList";

export interface AyahMatch {
  number: number;
  text: string;
  surah: { number: number; name: string; englishName: string };
  numberInSurah: number;
  page: number;
}

export function normalizeArabic(text: string): string {
  return text.replace(/([\u0621-\u064A])\u064E?\u0670/g, "$1ا")
    .replace(/[\u064B-\u065F\u0670\u0640\u06D6-\u06ED]/g, "")
    .replace(/[أإآٱ]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "ي")
    .replace(/[ؤئ]/g, "ء").replace(/\s+/g, " ").trim().toLowerCase();
}

export function filterSurahs(surahs: SurahMeta[], query: string) {
  const needle = normalizeArabic(query).replace(/^سوره\s+/, "");
  if (!needle) return surahs;
  return surahs.filter((surah) => [surah.name, surah.englishName, surah.englishNameTranslation, String(surah.number)]
    .some((value) => normalizeArabic(value).includes(needle)));
}

export function filterAyahs(ayahs: AyahMatch[], query: string): AyahMatch[] {
  const needle = normalizeArabic(query);
  if (needle.length < 2) return [];
  return ayahs.filter((ayah) => normalizeArabic(ayah.text).includes(needle));
}

let corpusPromise: Promise<AyahMatch[]> | null = null;
export function loadAyahCorpus(): Promise<AyahMatch[]> {
  if (!corpusPromise) {
    corpusPromise = Promise.all(Array.from({ length: 114 }, async (_, index) => {
      const response = await fetch(`/data/quran/quran-uthmani/${index + 1}.json`);
      if (!response.ok) throw new Error("تعذر تحميل الآيات");
      const { data } = await response.json() as { data: {
        number: number; name: string; englishName: string;
        ayahs: Omit<AyahMatch, "surah">[];
      } };
      return data.ayahs.map((ayah) => ({ ...ayah, surah: {
        number: data.number, name: data.name, englishName: data.englishName,
      } }));
    })).then((surahs) => surahs.flat()).catch((error: unknown) => {
      corpusPromise = null;
      throw error;
    });
  }
  return corpusPromise;
}

export function parseAyahSearch(search: Record<string, unknown>): { ayah?: number } {
  const ayah = Number(search["ayah"]);
  return Number.isInteger(ayah) && ayah > 0 && ayah <= 286 ? { ayah } : {};
}

export function getAyahMurattalUrl(surah: number, ayah: number) {
  return `https://everyayah.com/data/Minshawy_Murattal_128kbps/${String(surah).padStart(3, "0")}${String(ayah).padStart(3, "0")}.mp3`;
}