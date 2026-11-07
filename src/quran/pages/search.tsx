import { useState, useMemo, useEffect, useRef } from "react";
import { Link } from "@/quran/wouter-shim";
import {
  Search as SearchIcon, ChevronRight, BookOpen, Headphones, Loader2,
} from "lucide-react";
import { useSurahList } from "@/quran/hooks/useSurahList";

/* ── Arabic smart normalizer ──────────────────────────────────────── */
function normalizeArabic(text: string): string {
  return text
    .replace(/[\u064B-\u065F\u0670\u0640\u06D6-\u06ED]/g, "") // strip diacritics / tatweel
    .replace(/[أإآٱ]/g, "ا")                      // unify alef
    .replace(/ة/g, "ه")                           // taa marbuta → haa
    .replace(/ى/g, "ي")                           // alef maqsura → yaa
    .replace(/[ؤئ]/g, "ء")                        // hamza variants
    .trim();
}

/* ── Ayah search with smart fallback ──────────────────────────────── */
interface AyahMatch {
  number: number;
  text: string;
  surah: { number: number; name: string; englishName: string };
  numberInSurah: number;
  page: number;
}

type LocalAyah = { norm: string; match: AyahMatch };
let localQuran: Promise<LocalAyah[]> | null = null;
function loadLocalQuran() {
  if (!localQuran) {
    localQuran = Promise.all(
      Array.from({ length: 114 }, (_, i) =>
        fetch(`/data/quran/quran-uthmani/${i + 1}.json`).then((r) => r.json()),
      ),
    ).then((list) =>
      list.flatMap(({ data: s }: any) =>
        s.ayahs.map((a: any) => ({
          norm: normalizeArabic(a.text),
          match: {
            number: a.number,
            text: a.text,
            surah: { number: s.number, name: s.name, englishName: s.englishName },
            numberInSurah: a.numberInSurah,
            page: a.page,
          },
        })),
      ),
    ).catch((e) => { localQuran = null; throw e; });
  }
  return localQuran;
}

async function searchAyahs(query: string): Promise<AyahMatch[]> {
  const all = await loadLocalQuran();
  const tryQuery = async (q: string) => {
    const needle = normalizeArabic(q).trim();
    if (!needle) return [];
    return all.filter((a) => a.norm.includes(needle)).slice(0, 30).map((a) => a.match);
  };

  /* First try the original query */
  let results = await tryQuery(query);
  if (results.length > 0) return results.slice(0, 30);

  /* Fallback: normalized query */
  const norm = normalizeArabic(query);
  if (norm !== query) {
    results = await tryQuery(norm);
    if (results.length > 0) return results.slice(0, 30);
  }

  /* Fallback 2: search for first significant word of at least 4 chars */
  const words = norm.split(/\s+/).filter((w) => w.length >= 4);
  if (words.length > 0 && words[0] !== norm) {
    results = await tryQuery(words[0]);
    return results.slice(0, 30);
  }

  return [];
}

function useAyahSearch(query: string) {
  const [results, setResults] = useState<AyahMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim() || query.trim().length < 2) { setResults([]); return; }
    debounceRef.current = setTimeout(async () => {
      setLoading(true); setError(false);
      try {
        const r = await searchAyahs(query.trim());
        setResults(r);
      } catch { setError(true); }
      finally { setLoading(false); }
    }, 700);
  }, [query]);

  return { results, loading, error };
}

/* ── Component ─────────────────────────────────────────────────────── */
export default function Search() {
  const { surahs, loading: surahLoading } = useSurahList();
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"surah" | "ayah">("surah");

  /* surah filter */
  const filteredSurahs = useMemo(() => {
    if (!query.trim()) return surahs;
    const q = query.toLowerCase();
    return surahs.filter(
      (s) =>
        s.name.includes(query) ||
        normalizeArabic(s.name).includes(normalizeArabic(query)) ||
        s.englishName.toLowerCase().includes(q) ||
        s.englishNameTranslation.toLowerCase().includes(q)
    );
  }, [surahs, query]);

  const { results: ayahResults, loading: ayahLoading, error: ayahError } =
    useAyahSearch(tab === "ayah" ? query : "");

  return (
    <div className="space-y-4 pb-10" dir="rtl">
      {/* header */}
      <div className="flex items-center gap-3 pt-2">
        <Link href="/"
          className="text-muted-foreground hover:text-primary transition-colors"
          data-testid="link-back-home">
          <ChevronRight className="w-6 h-6" />
        </Link>
        <h1 className="font-serif text-2xl text-primary font-bold">البحث في القرآن</h1>
      </div>

      {/* tabs */}
      <div className="flex gap-2 bg-muted rounded-2xl p-1">
        {(["surah", "ayah"] as const).map((t) => (
          <button key={t} onClick={() => { setTab(t); setQuery(""); }}
            className={`flex-1 py-2.5 rounded-xl font-serif text-sm font-bold transition-all ${
              tab === t ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground"
            }`}>
            {t === "surah" ? "بحث عن سورة" : "بحث عن آية"}
          </button>
        ))}
      </div>

      {/* search input */}
      <div className="relative">
        <SearchIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="search"
          placeholder={
            tab === "surah"
              ? "اسم السورة بالعربية أو الإنجليزية…"
              : "ابحث عن نص آية (يدعم الكتابة بدون تشكيل)…"
          }
          className="w-full pr-12 pl-4 h-14 text-lg rounded-2xl bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary font-serif"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          data-testid="input-search"
          autoFocus
          dir="rtl"
        />
        {ayahLoading && (
          <Loader2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary animate-spin" />
        )}
      </div>

      {/* smart search hint */}
      {tab === "ayah" && !query && (
        <div className="flex items-start gap-2 px-1">
          <span className="text-primary text-sm mt-0.5">✦</span>
          <p className="text-muted-foreground font-sans text-xs leading-relaxed">
            البحث الذكي: يعمل بدون تشكيل ويتعامل مع الأخطاء الإملائية الشائعة
            (مثل: أ / ا / إ، ة / ه، ى / ي)
          </p>
        </div>
      )}

      {/* ── SURAH TAB ─────────────────────────────────────────────── */}
      {tab === "surah" && (
        <>
          {!surahLoading && query && filteredSurahs.length === 0 && (
            <p className="text-center py-8 text-muted-foreground font-serif text-lg">
              لم يُعثر على سورة
            </p>
          )}
          <div className="space-y-2">
            {filteredSurahs.map((surah) => (
              <div key={surah.number}
                className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-card"
                data-testid={`result-surah-${surah.number}`}>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="font-sans text-primary font-semibold text-sm">{surah.number}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-serif text-xl text-foreground">{surah.name}</p>
                  <p className="font-sans text-xs text-muted-foreground">
                    {surah.englishName} — {surah.englishNameTranslation}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link href={`/quran-audio/${surah.number}`}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-primary text-primary-foreground font-sans text-xs font-semibold hover:bg-primary/90 transition-colors"
                    data-testid={`link-audio-${surah.number}`}>
                    <Headphones className="w-3.5 h-3.5" />
                    استماع
                  </Link>
                  <Link href={`/quran-written/${surah.number}`}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-muted text-foreground font-sans text-xs font-semibold hover:bg-muted/80 transition-colors"
                    data-testid={`link-written-${surah.number}`}>
                    <BookOpen className="w-3.5 h-3.5" />
                    قراءة
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── AYAH TAB ──────────────────────────────────────────────── */}
      {tab === "ayah" && (
        <>
          {ayahError && (
            <p className="text-center py-4 text-red-500 font-sans text-sm">
              حدث خطأ في البحث، حاول مجدداً
            </p>
          )}
          {!ayahLoading && query.trim().length >= 2 && ayahResults.length === 0 && !ayahError && (
            <p className="text-center py-8 text-muted-foreground font-serif text-lg">
              لم يُعثر على آية مطابقة
            </p>
          )}
          {query.trim().length < 2 && !ayahLoading && (
            <p className="text-center py-6 text-muted-foreground font-sans text-sm">
              أدخل كلمتين على الأقل للبحث
            </p>
          )}

          <div className="space-y-4">
            {ayahResults.map((ayah) => (
              <AyahResultCard key={ayah.number} ayah={ayah} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ── Ayah result card ─────────────────────────────────────────────── */
function AyahResultCard({ ayah }: { ayah: AyahMatch }) {
  return (
    <div
      className="bg-card border border-border rounded-2xl overflow-hidden"
      data-testid={`result-ayah-${ayah.number}`}
    >
      {/* Surah / ayah label */}
      <div className="flex items-center justify-between px-4 pt-3 pb-1">
        <span className="font-sans text-xs text-muted-foreground">
          {ayah.surah.name}
        </span>
        <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-sans text-xs font-semibold">
          آية {ayah.numberInSurah}
        </span>
      </div>

      {/* Ayah text */}
      <div className="px-4 py-3">
        <p
          className="quran-text text-foreground leading-[2.5]"
          style={{ fontSize: "1.25rem" }}
          dir="rtl"
        >
          {ayah.text}
        </p>
      </div>

      {/* Divider */}
      <div className="mx-4 h-px bg-border" />

      {/* Action buttons */}
      <div className="flex" dir="rtl">
        {/* Listen */}
        <Link
          href={`/quran-audio/${ayah.surah.number}`}
          className="flex-1 flex items-center justify-center gap-2 py-3 text-primary font-sans text-sm font-semibold hover:bg-primary/5 transition-colors border-l border-border"
          data-testid={`btn-listen-${ayah.number}`}
        >
          <Headphones className="w-4 h-4" />
          استماع
        </Link>
        {/* Read — navigates to the Mushaf page containing this ayah */}
        <Link
          href={`/quran-written/${ayah.surah.number}?ayah=${ayah.numberInSurah}`}
          className="flex-1 flex items-center justify-center gap-2 py-3 text-foreground font-sans text-sm font-semibold hover:bg-muted/50 transition-colors"
          data-testid={`btn-read-${ayah.number}`}
        >
          <BookOpen className="w-4 h-4" />
          قراءة
        </Link>
      </div>
    </div>
  );
}
