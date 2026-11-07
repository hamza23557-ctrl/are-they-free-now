import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "@/quran/wouter-shim";
import { ChevronRight } from "lucide-react";
import { useSurahList } from "@/quran/hooks/useSurahList";
import { Skeleton } from "@/quran/components/ui/skeleton";

/* ── Surah list page ───────────────────────────────────────────────── */
export default function Tafsir() {
  const { surahs, loading, error } = useSurahList();

  return (
    <div className="max-w-2xl mx-auto space-y-4 pb-10" dir="rtl">
      <div className="flex items-center gap-3 pt-2">
        <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
          <ChevronRight className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="font-serif text-2xl text-primary font-bold">تفسير القرآن الكريم</h1>
          <p className="text-muted-foreground text-sm font-sans">التفسير الميسّر — مجمع الملك فهد</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-xl text-center font-sans text-sm">
          تعذّر تحميل القائمة.
        </div>
      )}

      <div className="space-y-2">
        {loading
          ? Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-4 rounded-xl border border-border">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))
          : surahs.map((surah) => (
              <Link
                key={surah.number}
                href={`/tafsir/${surah.number}`}
                className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-card hover:border-primary hover:bg-primary/5 transition-all group"
              >
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="font-sans text-primary font-semibold text-xs">{surah.number}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-serif text-xl text-foreground">{surah.name}</p>
                  <p className="font-sans text-xs text-muted-foreground">
                    {surah.englishName} — {surah.numberOfAyahs} آية
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors rotate-180 flex-shrink-0" />
              </Link>
            ))}
      </div>
    </div>
  );
}

/* ── Types ─────────────────────────────────────────────────────────── */
interface TafsirAyah {
  numberInSurah: number;
  text: string;       /* original arabic */
  tafsir: string;     /* ar.muyassar tafsir */
}

/* ── Tafsir reader ─────────────────────────────────────────────────── */
export function TafsirReader() {
  const [location] = useLocation();
  const number = parseInt(location.split("/").pop() || "1");

  const [surahName, setSurahName] = useState("");
  const [ayahs, setAyahs] = useState<TafsirAyah[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  useEffect(() => {
    setLoading(true); setError(false); setAyahs([]); setExpanded(new Set());
    Promise.all([
      fetch(`/data/quran/quran-uthmani/${number}.json`).then((r) => r.json()),
      fetch(`/data/quran/ar.muyassar/${number}.json`).then((r) => r.json()),
    ])
      .then(([arabicData, tafsirData]) => {
        setSurahName(arabicData.data.name);
        const arabicAyahs: any[] = arabicData.data.ayahs;
        const tafsirAyahs: any[] = tafsirData.data.ayahs;
        const merged: TafsirAyah[] = arabicAyahs.map((a, i) => ({
          numberInSurah: a.numberInSurah,
          text: a.text,
          tafsir: tafsirAyahs[i]?.text ?? "",
        }));
        setAyahs(merged);
        setLoading(false);
      })
      .catch(() => { setError(true); setLoading(false); });
  }, [number]);

  function toggle(n: number) {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(n) ? next.delete(n) : next.add(n);
      return next;
    });
  }

  const EASTERN = "٠١٢٣٤٥٦٧٨٩";
  function toEastern(n: number) {
    return String(n).replace(/\d/g, (d) => EASTERN[+d]);
  }

  return (
    <div className="space-y-4 pb-10" dir="rtl">
      {/* sticky header */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border px-2 py-2 mb-2">
        <div className="flex items-center gap-3">
          <Link href="/tafsir" className="text-muted-foreground hover:text-primary transition-colors">
            <ChevronRight className="w-6 h-6" />
          </Link>
          {surahName ? (
            <div>
              <h1 className="font-serif text-xl text-primary font-bold">{surahName}</h1>
              <p className="text-xs text-muted-foreground font-sans">التفسير الميسّر</p>
            </div>
          ) : <Skeleton className="h-6 w-32" />}
        </div>
      </div>

      {error && (
        <div className="mx-2 p-4 bg-red-50 text-red-600 rounded-xl text-center font-sans text-sm">
          تعذّر تحميل التفسير. يرجى المحاولة لاحقاً.
        </div>
      )}

      {loading && (
        <div className="space-y-3 px-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-border rounded-2xl p-4 space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ))}
        </div>
      )}

      <div className="space-y-3 px-1">
        {ayahs.map((ayah) => {
          const open = expanded.has(ayah.numberInSurah);
          return (
            <div key={ayah.numberInSurah}
              className="bg-card border border-border rounded-2xl overflow-hidden">

              {/* arabic text */}
              <p className="quran-text px-4 pt-4 pb-2 text-foreground leading-[2.6] text-[1.35rem]">
                {ayah.text}
                <span className="inline-flex items-center justify-center align-middle mx-1"
                  style={{ width: "1.4em", height: "1.4em" }}>
                  <svg viewBox="0 0 32 32" width="1.3em" height="1.3em">
                    <circle cx="16" cy="16" r="14" fill="none"
                      stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
                    <text x="16" y="21" textAnchor="middle"
                      fontFamily="Amiri,serif" fontSize="12" fill="currentColor" opacity="0.6">
                      {toEastern(ayah.numberInSurah)}
                    </text>
                  </svg>
                </span>
              </p>

              <div className="mx-4 h-px bg-border" />

              {/* tafsir toggle */}
              <button
                onClick={() => toggle(ayah.numberInSurah)}
                className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-sans hover:bg-muted/50 transition-colors"
              >
                <span className={`font-semibold ${open ? "text-primary" : "text-muted-foreground"}`}>
                  {open ? "إخفاء التفسير" : "عرض التفسير"}
                </span>
                <ChevronRight
                  className={`w-4 h-4 transition-transform ${open ? "-rotate-90" : "rotate-90"} text-muted-foreground`}
                />
              </button>

              {open && (
                <div className="px-4 pb-4 pt-1">
                  <div className="h-px bg-border mb-3" />
                  <p className="font-serif text-[1.05rem] text-foreground leading-[2] text-right">
                    {ayah.tafsir}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* prev / next surah */}
      {!loading && ayahs.length > 0 && (
        <div className="flex items-center justify-between px-2 pt-4 border-t border-border">
          {number > 1 ? (
            <Link href={`/tafsir/${number - 1}`}
              className="flex items-center gap-1 text-primary font-sans text-sm hover:underline">
              <ChevronRight className="w-4 h-4" /> السورة السابقة
            </Link>
          ) : <span />}
          {number < 114 ? (
            <Link href={`/tafsir/${number + 1}`}
              className="flex items-center gap-1 text-primary font-sans text-sm hover:underline">
              السورة التالية <ChevronRight className="w-4 h-4 rotate-180" />
            </Link>
          ) : <span />}
        </div>
      )}
    </div>
  );
}
