import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useSearch } from "@/quran/wouter-shim";
import { ChevronRight } from "lucide-react";
import { Skeleton } from "@/quran/components/ui/skeleton";

/* ── Types ─────────────────────────────────────────────────────────── */
interface MushafAyah {
  numberInSurah: number;
  text: string;
  page: number;
  juz: number;
  hizbQuarter: number;
  sajda: boolean;
}

interface MushafSurah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  numberOfAyahs: number;
  ayahs: MushafAyah[];
}

interface PageGroup {
  pageNum: number;
  juz: number;
  ayahs: MushafAyah[];
}

/* ── Data fetching ─────────────────────────────────────────────────── */
const _cache: Record<number, MushafSurah> = {};
const _pending: Record<number, Promise<MushafSurah>> = {};

function withoutBasmala(text: string): string {
  const plain = text.replace(/[\u064B-\u065F\u0670]/g, "");
  const basmala = "بسم الله الرحمن الرحيم";
  return plain.startsWith(basmala) ? plain.slice(basmala.length).trimStart() : text;
}

async function fetchMushaf(n: number): Promise<MushafSurah> {
  if (_cache[n]) return _cache[n];
  if (!_pending[n]) {
    _pending[n] = fetch(`/data/quran/quran-uthmani/${n}.json`)
      .then((r) => { if (!r.ok) throw new Error("fetch failed"); return r.json(); })
      .then(({ data }) => {
        const result: MushafSurah = {
          number: data.number,
          name: data.name,
          englishName: data.englishName,
          englishNameTranslation: data.englishNameTranslation,
          revelationType: data.revelationType,
          numberOfAyahs: data.numberOfAyahs,
          ayahs: data.ayahs.map((a: any): MushafAyah => ({
            numberInSurah: a.numberInSurah,
            text: withoutBasmala(a.text),
            page: a.page,
            juz: a.juz,
            hizbQuarter: a.hizbQuarter,
            sajda: !!a.sajda,
          })),
        };
        _cache[n] = result;
        delete _pending[n];
        return result;
      })
      .catch((err) => { delete _pending[n]; throw err; });
  }
  return _pending[n];
}

function useMushaf(number: number) {
  const [surah, setSurah] = useState<MushafSurah | null>(_cache[number] ?? null);
  const [loading, setLoading] = useState(!_cache[number]);
  const [error, setError] = useState<Error | null>(null);
  useEffect(() => {
    if (!number) return;
    if (_cache[number]) { setSurah(_cache[number]); setLoading(false); return; }
    setLoading(true); setSurah(null); setError(null);
    fetchMushaf(number)
      .then((d) => { setSurah(d); setLoading(false); })
      .catch((e) => { setError(e); setLoading(false); });
  }, [number]);
  return { surah, loading, error };
}

/* ── Helpers ───────────────────────────────────────────────────────── */
function groupByPage(ayahs: MushafAyah[]): PageGroup[] {
  const map = new Map<number, { juz: number; ayahs: MushafAyah[] }>();
  for (const a of ayahs) {
    if (!map.has(a.page)) map.set(a.page, { juz: a.juz, ayahs: [] });
    map.get(a.page)!.ayahs.push(a);
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => a - b)
    .map(([pageNum, v]) => ({ pageNum, ...v }));
}

const EASTERN = "٠١٢٣٤٥٦٧٨٩";
function toEastern(n: number): string {
  return String(n).replace(/\d/g, (d) => EASTERN[+d]);
}

/* Hizb quarter indicator shown at quarter-hizb boundaries */
const HIZB_LABELS: Record<number, string> = { 1: "ربع", 2: "نصف", 3: "ثلاثة أرباع" };
function hizbLabel(hq: number): string | null {
  const q = hq % 4;
  if (q === 0 && hq > 0) return "حزب";
  return HIZB_LABELS[q] ?? null;
}

/* ── Ayah end-marker ──────────────────────────────────────────────── */
function AyahMarker({ n }: { n: number }) {
  return (
    <span
      className="inline-flex items-center justify-center align-middle mx-[3px]"
      style={{ width: "1.6em", height: "1.6em", verticalAlign: "middle" }}
    >
      <svg viewBox="0 0 32 32" width="1.5em" height="1.5em">
        <circle cx="16" cy="16" r="15" fill="none"
          stroke="currentColor" strokeWidth="1.4" opacity="0.5" />
        <text x="16" y="21" textAnchor="middle"
          fontFamily="Amiri,serif" fontSize="13" fill="currentColor" opacity="0.75">
          {toEastern(n)}
        </text>
      </svg>
    </span>
  );
}

/* ── Page ornament divider ─────────────────────────────────────────── */
function PageDivider({ label }: { label?: string }) {
  return (
    <div className="flex items-center gap-2 my-1">
      <div className="flex-1 h-px bg-primary/15" />
      {label ? (
        <span className="font-serif text-xs text-primary/50 px-2">{label}</span>
      ) : (
        <svg width="12" height="12" viewBox="0 0 12 12" className="text-primary/30">
          <polygon points="6,0 8,4 12,4.5 9,7.5 9.5,12 6,10 2.5,12 3,7.5 0,4.5 4,4" fill="currentColor" />
        </svg>
      )}
      <div className="flex-1 h-px bg-primary/15" />
    </div>
  );
}

/* ── Page card ─────────────────────────────────────────────────────── */
function MushafPage({
  page,
  surahName,
  highlightAyah,
  ayahRefs,
}: {
  page: PageGroup;
  surahName: string;
  highlightAyah: number | null;
  ayahRefs: React.MutableRefObject<Record<number, HTMLSpanElement | null>>;
}) {
  return (
    <div className="bg-card border border-border/60 rounded-2xl overflow-hidden shadow-sm">
      {/* Header row: juz | surah name | page number */}
      <div className="flex items-center justify-between px-5 pt-3 pb-1 text-xs text-muted-foreground font-sans">
        <span className="text-[18px]">جزء {toEastern(page.juz)}</span>
        <span className="font-serif text-primary/80 font-bold text-[28px]">{surahName}</span>
        <span className="text-[18px]">صفحة {toEastern(page.pageNum)}</span>
      </div>
      <div className="px-4">
        <PageDivider />
      </div>
      {/* Continuous ayah text (Mushaf style) */}
      <p
        className="quran-text px-5 pb-4 text-foreground leading-[2.8] text-justify"
        style={{ fontSize: "1.5rem" }}
      >
        {page.ayahs.map((ayah) => {
          const isHL = highlightAyah === ayah.numberInSurah;
          const hq = hizbLabel(ayah.hizbQuarter);
          return (
            <span key={ayah.numberInSurah}>
              {hq && (
                <span className="inline-block text-[0.6rem] text-primary/50 font-sans align-top translate-y-1 ml-1">
                  {hq}
                </span>
              )}
              <span
                ref={(el) => { ayahRefs.current[ayah.numberInSurah] = el; }}
                className="transition-colors duration-500 rounded text-[28px]"
              >
                {ayah.text}
                {ayah.sajda && (
                  <span className="text-primary/40 text-base mx-0.5">۩</span>
                )}
                <AyahMarker n={ayah.numberInSurah} />
              </span>
            </span>
          );
        })}
      </p>
      {/* Bottom: page number centered */}
      <div className="px-4 mb-3">
        <PageDivider label={toEastern(page.pageNum)} />
      </div>
    </div>
  );
}

/* ── Main component ────────────────────────────────────────────────── */
export default function QuranWrittenReader() {
  const [location] = useLocation();
  const searchStr = useSearch();
  const number = parseInt(location.split("/").pop() || "1");
  const targetAyah = parseInt(new URLSearchParams(searchStr).get("ayah") || "0");

  const { surah, loading, error } = useMushaf(number);
  const ayahRefs = useRef<Record<number, HTMLSpanElement | null>>({});
  const [highlightAyah, setHighlightAyah] = useState<number | null>(
    targetAyah > 0 ? targetAyah : null
  );

  const pages = surah ? groupByPage(surah.ayahs) : [];
  /* Scroll to & highlight target ayah */
  useEffect(() => {
    if (!highlightAyah || !surah || pages.length === 0) return;
    const attempt = () => {
      const el = ayahRefs.current[highlightAyah];
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(() => setHighlightAyah(null), 3500);
        return true;
      }
      return false;
    };
    if (!attempt()) setTimeout(attempt, 500);
  }, [highlightAyah, surah]);

  return (
    <div className="pb-10" dir="rtl">
      {/* Sticky header */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border px-2 py-2 mb-4">
        <div className="flex items-center gap-3 flex-row text-[#2d241b]">
          <Link href="/quran-written"
            className="text-muted-foreground hover:text-primary transition-colors"
            data-testid="link-back-list">
            <ChevronRight className="w-6 h-6" />
          </Link>
          {surah ? (
            <div>
              <h1 className="font-serif text-primary font-bold text-[25px] text-center">
                {surah.name}
              </h1>
              <p className="text-muted-foreground font-sans text-[16px]">
                {surah.englishName} — {surah.numberOfAyahs} آية —{" "}
                {surah.revelationType === "Meccan" ? "مكية" : "مدنية"}
              </p>
            </div>
          ) : (
            <Skeleton className="h-6 w-32" />
          )}
        </div>
      </div>
      {/* Loading */}
      {loading && (
        <div className="space-y-4 px-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-border rounded-2xl p-6 space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-28 w-full" />
              <Skeleton className="h-4 w-1/2 mx-auto" />
            </div>
          ))}
        </div>
      )}
      {/* Error */}
      {error && (
        <div className="mx-2 p-4 bg-red-50 text-red-600 rounded-xl text-center font-sans text-sm">
          تعذّر تحميل السورة. يرجى المحاولة لاحقاً.
        </div>
      )}
      {/* Pages */}
      {surah && (
        <div className="space-y-4 px-2">
          {pages.map((page, idx) => (
            <MushafPage
              key={page.pageNum}
              page={page}
              surahName={surah.name}
              highlightAyah={highlightAyah}
              ayahRefs={ayahRefs}
            />
          ))}

          {/* Surah navigation */}
          <div className="flex items-center justify-between pt-4 pb-2 border-t border-border px-1">
            {number > 1 ? (
              <Link href={`/quran-written/${number - 1}`}
                className="flex items-center gap-1 text-primary font-sans text-sm hover:underline"
                data-testid="link-prev-surah">
                <ChevronRight className="w-4 h-4" />
                السورة السابقة
              </Link>
            ) : <span />}
            {number < 114 ? (
              <Link href={`/quran-written/${number + 1}`}
                className="flex items-center gap-1 text-primary font-sans hover:underline text-[22px]"
                data-testid="link-next-surah">
                السورة التالية
                <ChevronRight className="w-4 h-4 rotate-180" />
              </Link>
            ) : <span />}
          </div>
        </div>
      )}
    </div>
  );
}
