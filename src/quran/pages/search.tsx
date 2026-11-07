import { useState, useMemo, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Search as SearchIcon, BookOpen, Headphones, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSurahList } from "@/quran/hooks/useSurahList";
import { filterSurahs, filterAyahs, loadAyahCorpus, type AyahMatch } from "@/quran/lib/quran-search";

function useAyahSearch(query: string) {
  const [results, setResults] = useState<AyahMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  useEffect(() => {
    let active = true;
    setResults([]);
    setError(false);
    if (query.trim().length < 2) { setLoading(false); return; }
    setLoading(true);
    const timer = setTimeout(() => {
      loadAyahCorpus().then((corpus) => {
        if (active) setResults(filterAyahs(corpus, query));
      }).catch(() => { if (active) setError(true); })
        .finally(() => { if (active) setLoading(false); });
    }, 350);
    return () => { active = false; clearTimeout(timer); };
  }, [query]);
  return { results, loading, error };
}

function ResultActions({ surah, ayah }: { surah: number; ayah?: number }) {
  const search = ayah ? { ayah } : {};
  return (
    <div className="flex gap-2">
      <Button asChild variant="outline" size="sm" className="flex-1">
        <Link to="/quran-written/$number" params={{ number: String(surah) }} search={search}>
          <BookOpen />قراءة
        </Link>
      </Button>
      <Button asChild size="sm" className="flex-1">
        <Link to="/quran-audio/$number" params={{ number: String(surah) }} search={search}>
          <Headphones />استماع
        </Link>
      </Button>
    </div>
  );
}

export default function Search() {
  const { surahs, loading: surahLoading, error: surahError } = useSurahList();
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"surah" | "ayah">("surah");
  const [visibleCount, setVisibleCount] = useState(30);
  const filteredSurahs = useMemo(() => filterSurahs(surahs, query), [surahs, query]);
  const { results, loading, error } = useAyahSearch(tab === "ayah" ? query : "");
  useEffect(() => { setVisibleCount(30); }, [query, tab]);

  return (
    <div className="mx-auto max-w-2xl space-y-5 pb-6 pt-3" dir="rtl">
      <h1 className="font-serif text-3xl font-bold text-primary">البحث في القرآن</h1>
      <div className="grid grid-cols-2 gap-1 rounded-lg bg-muted p-1" role="tablist" aria-label="نوع البحث">
        {(["surah", "ayah"] as const).map((mode) => (
          <Button key={mode} role="tab" aria-selected={tab === mode} variant={tab === mode ? "default" : "ghost"}
            onClick={() => { setTab(mode); setQuery(""); }}>
            {mode === "surah" ? "بحث عن سورة" : "بحث عن آية"}
          </Button>
        ))}
      </div>
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <input type="search" aria-label={tab === "surah" ? "اسم السورة" : "نص الآية"}
          placeholder={tab === "surah" ? "اسم السورة أو رقمها…" : "نص الآية…"}
          className="h-12 w-full rounded-lg border border-border bg-card pr-12 pl-10 text-base text-foreground outline-none focus:ring-2 focus:ring-ring"
          value={query} onChange={(event) => setQuery(event.target.value)} data-testid="input-search" />
        {loading && <Loader2 className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 animate-spin text-primary" />}
      </div>
      {tab === "surah" ? (
        <>
          {surahLoading && <p role="status" className="text-center text-muted-foreground">جارٍ تحميل السور…</p>}
          {surahError && <p role="alert" className="text-center text-foreground">تعذر تحميل السور، حاول مجدداً.</p>}
          {!surahLoading && !surahError && filteredSurahs.length === 0 && <p className="py-8 text-center text-muted-foreground">لم يُعثر على سورة</p>}
          <div className="grid gap-3 sm:grid-cols-2">
            {filteredSurahs.map((surah) => (
              <article key={surah.number} className="space-y-3 rounded-lg border border-border bg-card p-4" data-testid={`result-surah-${surah.number}`}>
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-sm font-bold text-primary">{surah.number}</span>
                  <div className="min-w-0">
                    <h2 className="font-serif text-2xl text-foreground">{surah.name}</h2>
                    <p className="text-xs text-muted-foreground">{surah.numberOfAyahs} آية · {surah.revelationType === "Meccan" ? "مكية" : "مدنية"}</p>
                  </div>
                </div>
                <ResultActions surah={surah.number} />
              </article>
            ))}
          </div>
        </>
      ) : (
        <>
          {query.trim().length < 2 && <p className="py-8 text-center text-muted-foreground">أدخل نص الآية للبحث</p>}
          {loading && <p role="status" className="text-center text-muted-foreground">جارٍ البحث…</p>}
          {error && <p role="alert" className="text-center text-foreground">تعذر تحميل الآيات، حاول مجدداً.</p>}
          {!loading && !error && query.trim().length >= 2 && results.length === 0 && <p className="py-8 text-center text-muted-foreground">لم يُعثر على آية مطابقة</p>}
          {results.length > 0 && <p className="text-sm text-muted-foreground">{results.length} نتيجة</p>}
          <div className="space-y-3">
            {results.slice(0, visibleCount).map((ayah) => (
              <article key={ayah.number} className="space-y-3 rounded-lg border border-border bg-card p-4" data-testid={`result-ayah-${ayah.number}`}>
                <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
                  <h2 className="font-serif text-lg text-primary">{ayah.surah.name}</h2>
                  <span>آية {ayah.numberInSurah} · صفحة {ayah.page}</span>
                </div>
                <p className="quran-text text-2xl leading-loose text-foreground">{ayah.text}</p>
                <ResultActions surah={ayah.surah.number} ayah={ayah.numberInSurah} />
              </article>
            ))}
          </div>
          {results.length > visibleCount && <Button variant="outline" className="w-full" onClick={() => setVisibleCount((count) => count + 30)}>المزيد من النتائج</Button>}
        </>
      )}
    </div>
  );
}
