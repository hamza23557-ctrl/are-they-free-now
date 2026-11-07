import { describe, expect, it } from "vitest";
import { filterAyahs, filterSurahs, getAyahMurattalUrl, parseAyahSearch, type AyahMatch } from "@/quran/lib/quran-search";
import type { SurahMeta } from "@/quran/hooks/useSurahList";

const surahs: SurahMeta[] = [
  { number: 1, name: "سُورَةُ ٱلْفَاتِحَةِ", englishName: "Al-Faatiha", englishNameTranslation: "The Opening", numberOfAyahs: 7, revelationType: "Meccan" },
  { number: 2, name: "سُورَةُ ٱلْبَقَرَةِ", englishName: "Al-Baqara", englishNameTranslation: "The Cow", numberOfAyahs: 286, revelationType: "Medinan" },
];
const ayahs: AyahMatch[] = [
  { number: 2, numberInSurah: 2, text: "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ", page: 1, surah: { number: 1, name: "الفاتحة", englishName: "Al-Faatiha" } },
  { number: 3, numberInSurah: 3, text: "ٱلرَّحْمَٰنِ ٱلرَّحِيمِ", page: 1, surah: { number: 1, name: "الفاتحة", englishName: "Al-Faatiha" } },
];

describe("Quran search destinations", () => {
  it("finds a surah from its unvowelled Arabic name", () => {
    expect(filterSurahs(surahs, "الفاتحة").map((surah) => surah.number)).toEqual([1]);
  });
  it("finds the selected ayah without diacritics, not unrelated first-word matches", () => {
    expect(filterAyahs(ayahs, "الحمد لله رب العالمين").map((ayah) => ayah.numberInSurah)).toEqual([2]);
    expect(filterAyahs(ayahs, "الحمد لله كلام غير موجود")).toEqual([]);
  });
  it("retains the selected ayah for the written and murattal destinations", () => {
    expect(parseAyahSearch({ ayah: "255" })).toEqual({ ayah: 255 });
    expect(parseAyahSearch({ ayah: "bad" })).toEqual({});
  });
  it("listens to the selected verse recording rather than the whole surah", () => {
    expect(getAyahMurattalUrl(2, 255)).toBe("https://everyayah.com/data/Minshawy_Murattal_128kbps/002255.mp3");
    expect(getAyahMurattalUrl(1, 2)).toBe("https://everyayah.com/data/Minshawy_Murattal_128kbps/001002.mp3");
  });
});