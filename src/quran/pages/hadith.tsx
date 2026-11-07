import { useState, useEffect } from "react";
import { Link, useLocation } from "@/quran/wouter-shim";
import { ChevronRight, ChevronLeft, BookOpen, Download, Check, Heart, Star } from "lucide-react";
import { Skeleton } from "@/quran/components/ui/skeleton";

interface HadithEntry {
  hadithnumber: number;
  text: string;
}

interface BookMeta {
  id: string;
  name: string;
  description: string;
  count: number;
  apiKey: string;
}

const BOOKS: BookMeta[] = [
  {
    id: "nawawi40",
    name: "الأربعون النووية",
    description: "للإمام يحيى بن شرف النووي — ٤٢ حديثاً في أصول الإسلام",
    count: 42,
    apiKey: "ara-nawawi",
  },
  {
    id: "bukhari",
    name: "صحيح البخاري",
    description: "للإمام محمد بن إسماعيل البخاري — أصح كتاب بعد كتاب الله",
    count: 7563,
    apiKey: "ara-bukhari",
  },
  {
    id: "muslim",
    name: "صحيح مسلم",
    description: "للإمام مسلم بن الحجاج — ثاني أصح كتب الحديث",
    count: 3033,
    apiKey: "ara-muslim",
  },
  {
    id: "abudawud",
    name: "سنن أبي داود",
    description: "للإمام أبو داود السجستاني — من كتب السنن الأربعة",
    count: 5274,
    apiKey: "ara-abudawud",
  },
  {
    id: "tirmidhi",
    name: "جامع الترمذي",
    description: "للإمام محمد بن عيسى الترمذي — الجامع الصحيح",
    count: 3956,
    apiKey: "ara-tirmidhi",
  },
];

/* ── Main page: book list ──────────────────────────────────────────── */
export default function Hadith() {
  const [, setLocation] = useLocation();
  return (
    <div className="space-y-4 pb-10" dir="rtl">
      <div className="flex items-start gap-3 pt-2">
        <Link href="/" className="text-muted-foreground hover:text-primary transition-colors mt-1">
          <ChevronRight className="w-6 h-6" />
        </Link>
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h1 className="font-serif text-2xl text-primary font-bold">الأحاديث النبوية الشريفة</h1>
              <p className="text-muted-foreground text-sm font-sans">اختر كتاباً للقراءة</p>
            </div>
            <Link
              href="/hadith/favorites"
              className="flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-sans font-bold text-amber-700 hover:bg-amber-100 transition-colors whitespace-nowrap"
              data-testid="link-hadith-favorites"
            >
              <Star className="w-4 h-4" fill="currentColor" />
              أحاديثي المفضلة
            </Link>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {BOOKS.map((book) => (
          <button
            key={book.id}
            onClick={() => setLocation(`/hadith/${book.id}`)}
            className="w-full flex items-center gap-4 p-4 rounded-2xl border border-border bg-card hover:border-primary hover:bg-primary/5 transition-all text-right"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-7 h-7 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-serif text-xl text-foreground">{book.name}</p>
              <p className="font-sans text-xs text-muted-foreground mt-0.5 leading-relaxed">{book.description}</p>
            </div>
            <div className="flex-shrink-0 flex flex-col items-center gap-1">
              <span className="font-sans text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full">
                {book.count.toLocaleString("ar-EG")}
              </span>
              <span className="font-sans text-[10px] text-muted-foreground">حديث</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Favorite hadiths ───────────────────────────────────────────────── */
export function HadithFavorites() {
  const [favoriteKeys, setFavoriteKeys] = useState<Record<string, boolean>>(() => {
    try { return JSON.parse(localStorage.getItem("hadith-favorites") || "{}"); } catch { return {}; }
  });
  const [items, setItems] = useState<Array<HadithEntry & { book: BookMeta }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function loadFavorites() {
      const keys = Object.keys(favoriteKeys).filter((key) => favoriteKeys[key]);
      if (keys.length === 0) {
        setItems([]);
        setLoading(false);
        return;
      }
      try {
        const neededBooks = BOOKS.filter((book) => keys.some((key) => key.startsWith(`${book.id}:`)));
        const results = await Promise.all(neededBooks.map(async (book) => {
          const url = `/data/hadith/${book.apiKey}.json`;
          const response = await fetch(url);
          if (!response.ok) throw new Error();
          const data = await response.json();
          return (data.hadiths ?? data.hadith ?? []).map((hadith: any) => ({
            hadithnumber: hadith.hadithnumber,
            text: hadith.text ?? hadith.arab ?? "",
            book,
          }));
        }));
        if (active) {
          setItems(results.flat().filter((item) => favoriteKeys[`${item.book.id}:${item.hadithnumber}`]));
          setLoading(false);
        }
      } catch {
        if (active) setLoading(false);
      }
    }
    void loadFavorites();
    return () => { active = false; };
  }, [favoriteKeys]);

  function removeFavorite(item: HadithEntry & { book: BookMeta }) {
    const key = `${item.book.id}:${item.hadithnumber}`;
    setFavoriteKeys((current) => {
      const next = { ...current, [key]: false };
      localStorage.setItem("hadith-favorites", JSON.stringify(next));
      return next;
    });
  }

  function download(item: HadithEntry & { book: BookMeta }) {
    const blob = new Blob(
      [`${item.book.name}\nالحديث رقم ${item.hadithnumber}\n\n${item.text}`],
      { type: "text/plain;charset=utf-8" },
    );
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${item.book.id}-hadith-${item.hadithnumber}.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-4 pb-10" dir="rtl">
      <div className="flex items-center gap-3 pt-2">
        <Link href="/hadith" className="text-muted-foreground hover:text-primary transition-colors">
          <ChevronRight className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="font-serif text-2xl text-primary font-bold">الأحاديث المفضلة</h1>
          <p className="text-muted-foreground text-sm font-sans">الأحاديث التي حفظتها للرجوع إليها لاحقًا</p>
        </div>
      </div>
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-32 w-full rounded-2xl" />)}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 space-y-3">
          <Star className="w-12 h-12 mx-auto text-amber-400 opacity-70" />
          <p className="font-serif text-xl text-muted-foreground">لا توجد أحاديث مفضلة بعد</p>
          <Link href="/hadith" className="inline-block text-primary font-sans text-sm hover:underline">
            تصفح كتب الأحاديث لإضافة ما يعجبك
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <article key={`${item.book.id}-${item.hadithnumber}`} className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 pt-3 pb-1">
                <span className="text-xs font-sans text-primary bg-primary/10 rounded-full px-2 py-1">{item.book.name}</span>
                <span className="text-xs font-sans text-muted-foreground">حديث {item.hadithnumber}</span>
                <div className="flex-1" />
                <button onClick={() => download(item)} className="p-2 text-muted-foreground hover:text-primary" title="تحميل الحديث" aria-label="تحميل الحديث">
                  <Download className="w-4 h-4" />
                </button>
                <button onClick={() => removeFavorite(item)} className="p-2 text-amber-500 hover:text-red-500" title="إزالة من المفضلة" aria-label="إزالة من المفضلة">
                  <Star className="w-4 h-4" fill="currentColor" />
                </button>
              </div>
              <p className="quran-text px-4 pb-4 pt-2 text-foreground leading-[2.2] text-[1.05rem]">{item.text}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Book reader ───────────────────────────────────────────────────── */
export function HadithReader() {
  const [location] = useLocation();
  const bookId = location.split("/").pop() || "nawawi40";
  const book = BOOKS.find((b) => b.id === bookId) ?? BOOKS[0];

  const [hadiths, setHadiths] = useState<HadithEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [savedOffline, setSavedOffline] = useState(false);
  const [favoriteHadiths, setFavoriteHadiths] = useState<Record<string, boolean>>(() => {
    try { return JSON.parse(localStorage.getItem("hadith-favorites") || "{}"); } catch { return {}; }
  });
  const hadithUrl = `/data/hadith/${book.apiKey}.json`;

  useEffect(() => {
    setLoading(true); setError(false); setHadiths([]); setExpanded(null);
    setSavedOffline(false);
    const load = async () => {
      const cache = "caches" in window ? await window.caches.open("quran-hadith-v1") : null;
      const cached = cache ? await cache.match(hadithUrl) : null;
      const response = cached ?? (await fetch(hadithUrl));
      if (!response.ok) throw new Error();
      if (!cached && cache) await cache.put(hadithUrl, response.clone());
      return response.json();
    };
    load()
      .then((data) => {
        const list: HadithEntry[] = (data.hadiths ?? data.hadith ?? [])
          .slice(0, 300)
          .map((h: any) => ({ hadithnumber: h.hadithnumber, text: h.text ?? h.arab ?? "" }));
        setHadiths(list);
        setLoading(false);
      })
      .catch(() => { setError(true); setLoading(false); });
  }, [bookId, hadithUrl]);

  async function saveHadithsOffline() {
    try {
      const cache = await window.caches.open("quran-hadith-v1");
      const response = await fetch(hadithUrl, { cache: "no-store" });
      if (!response.ok) throw new Error();
      await cache.put(hadithUrl, response.clone());
      setSavedOffline(true);
    } catch {
      setSavedOffline(false);
    }
  }

  function toggleHadithFavorite(hadithNumber: number) {
    const key = `${book.id}:${hadithNumber}`;
    setFavoriteHadiths((current) => {
      const next = { ...current, [key]: !current[key] };
      localStorage.setItem("hadith-favorites", JSON.stringify(next));
      return next;
    });
  }

  function downloadSingleHadith(hadith: HadithEntry) {
    const text = `${book.name}\nالحديث رقم ${hadith.hadithnumber}\n\n${hadith.text}`;
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${book.id}-hadith-${hadith.hadithnumber}.txt`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  /* truncate long hadiths for list view */
  function preview(text: string): string {
    const clean = text.replace(/^\d+\s*[-–]\s*/, "").trim();
    return clean.length > 200 ? clean.slice(0, 200) + "…" : clean;
  }

  return (
    <div className="space-y-4 pb-10" dir="rtl">
      {/* header */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border px-2 py-2 mb-2">
        <div className="flex items-center gap-3">
          <Link href="/hadith" className="text-muted-foreground hover:text-primary transition-colors">
            <ChevronRight className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="font-serif text-primary font-bold text-[24px]">{book.name}</h1>
            <p className="text-muted-foreground font-sans font-bold text-[14px]">
              {loading ? "جارٍ التحميل…" : `${hadiths.length} حديث`}
              {book.count > 300 && !loading ? " (أول ٣٠٠ حديث)" : ""}
            </p>
          </div>
          <button onClick={saveHadithsOffline} disabled={loading}
            className="mr-auto flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 font-sans text-muted-foreground hover:border-primary hover:text-primary disabled:opacity-50 text-[14px] font-bold"
            data-testid="button-download-hadith">
            {savedOffline ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
            {savedOffline ? "محفوظ دون إنترنت" : "تحميل الأحاديث"}
          </button>
        </div>
      </div>
      {error && (
        <div className="mx-2 p-4 bg-red-50 text-red-600 rounded-xl text-center font-sans text-sm">
          تعذّر تحميل الأحاديث. يرجى المحاولة لاحقاً.
        </div>
      )}
      {loading && (
        <div className="space-y-3 px-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="border border-border rounded-2xl p-4 space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-16 w-full" />
            </div>
          ))}
        </div>
      )}
      <div className="space-y-3 px-1">
        {hadiths.map((h) => {
          const isOpen = expanded === h.hadithnumber;
          const text = h.text.replace(/^\d+\s*[-–]\s*/, "").trim();
          const isLong = text.length > 200;
           const favoriteKey = `${book.id}:${h.hadithnumber}`;
           const isFavorite = !!favoriteHadiths[favoriteKey];
          return (
            <div
              key={h.hadithnumber}
              className="bg-card border border-border rounded-2xl overflow-hidden"
            >
              {/* number badge */}
              <div className="flex items-center gap-2 px-4 pt-3 pb-1">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-sans font-semibold text-sm flex-shrink-0">
                  {h.hadithnumber}
                </span>
                <div className="h-px flex-1 bg-border" />
                <button
                  onClick={() => downloadSingleHadith(h)}
                   className="inline-flex items-center justify-center gap-1.5 h-8 px-2.5 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors font-sans text-xs"
                   title="تحميل هذا الحديث"
                   aria-label={`تحميل الحديث رقم ${h.hadithnumber}`}
                  data-testid={`button-download-single-hadith-${h.hadithnumber}`}>
                  <Download className="w-4 h-4" />
                   <span className="hidden sm:inline">تحميل</span>
                </button>
                <button
                  onClick={() => toggleHadithFavorite(h.hadithnumber)}
                   className={`inline-flex items-center justify-center gap-1.5 h-8 px-2.5 rounded-full transition-colors font-sans text-xs ${isFavorite ? "text-amber-500 bg-amber-50" : "text-muted-foreground hover:text-amber-500 hover:bg-amber-50"}`}
                   title={isFavorite ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
                  aria-label={isFavorite ? "إزالة الحديث من المفضلة" : "إضافة الحديث إلى المفضلة"}
                  data-testid={`button-favorite-hadith-${h.hadithnumber}`}>
                  {isFavorite ? <Star className="w-4 h-4" fill="currentColor" /> : <Heart className="w-4 h-4" />}
                   <span className="hidden sm:inline">{isFavorite ? "مفضّل" : "تفضيل"}</span>
                </button>
              </div>

              {/* hadith text */}
              <p className="quran-text px-4 pb-3 text-foreground leading-[2.2] text-[1.05rem]">
                {isLong && !isOpen ? preview(text) : text}
              </p>

              {isLong && (
                <button
                  onClick={() => setExpanded(isOpen ? null : h.hadithnumber)}
                  className="w-full flex items-center justify-center gap-1 py-2 text-primary font-sans text-xs font-semibold border-t border-border hover:bg-primary/5 transition-colors"
                >
                  {isOpen ? (
                    <><ChevronLeft className="w-3.5 h-3.5 rotate-90" /> عرض أقل</>
                  ) : (
                    <><ChevronLeft className="w-3.5 h-3.5 -rotate-90" /> قراءة كاملة</>
                  )}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { BOOKS };
