import { useState } from "react";
import { Link } from "@/quran/wouter-shim";
import { ChevronRight, Heart, Download, Check, Loader2 } from "lucide-react";
import { useSurahList } from "@/quran/hooks/useSurahList";
import { useFavorites } from "@/quran/hooks/useFavorites";
import { Skeleton } from "@/quran/components/ui/skeleton";
import { OfflineDownloadButton } from "@/quran/components/offline-download-button";
import { downloadAllRecitations } from "@/quran/lib/offline-audio";

export default function QuranTajweed() {
  const { surahs, loading, error } = useSurahList();
  const { isFavorite, toggle } = useFavorites();
  const [tab, setTab] = useState<"all" | "favorites">("all");
  const [allDownload, setAllDownload] = useState<"idle" | "downloading" | "done" | "error">("idle");
  const [allProgress, setAllProgress] = useState(0);
  const [allController, setAllController] = useState<AbortController | null>(null);

  const displayed = tab === "favorites"
    ? surahs.filter((s) => isFavorite(s.number))
    : surahs;

  async function downloadAll() {
    if (allDownload === "downloading") {
      const shouldCancel = window.confirm(
        "تحميل جميع السور قيد التنفيذ.\nهل تريد إلغاء التحميل؟\nاضغط «موافق» للإلغاء أو «إلغاء» لمتابعة التحميل.",
      );
      if (shouldCancel) {
        allController?.abort();
        setAllController(null);
        setAllDownload("idle");
        setAllProgress(0);
      }
      return;
    }
    if (surahs.length === 0) return;
    try {
      setAllDownload("downloading");
      setAllProgress(0);
      const controller = new AbortController();
      setAllController(controller);
      await downloadAllRecitations("tajweed", surahs.map((s) => s.number), (completed, total) => {
        setAllProgress(Math.round((completed / total) * 100));
      }, controller.signal);
      setAllController(null);
      setAllDownload("done");
    } catch (downloadError) {
      setAllController(null);
      if (downloadError instanceof DOMException && downloadError.name === "AbortError") {
        setAllDownload("idle");
        setAllProgress(0);
      } else {
        setAllDownload("error");
      }
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4 pb-10" dir="rtl">
      <div className="flex items-center gap-3 pt-2">
        <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
          <ChevronRight className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="font-serif text-2xl text-primary font-bold">القرآن الكريم المجوّد</h1>
          <p className="text-muted-foreground text-sm font-sans">بصوت الشيخ محمد صديق المنشاوي</p>
        </div>
      </div>

      <button
        onClick={downloadAll}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 rounded-2xl border border-primary/30 bg-primary/5 px-4 py-3 text-sm font-sans text-primary hover:bg-primary/10 disabled:opacity-60"
        data-testid="button-download-all-tajweed-surahs"
      >
        {allDownload === "downloading"
          ? <><Loader2 className="w-4 h-4 animate-spin" /> جارٍ تحميل السور {allProgress}%</>
          : allDownload === "done"
            ? <><Check className="w-4 h-4" /> تم تحميل السور بالكامل</>
            : allDownload === "error"
              ? <><Download className="w-4 h-4" /> إعادة تحميل السور</>
              : <><Download className="w-4 h-4" /> تحميل السور بالكامل للعمل دون إنترنت</>}
      </button>

      <div className="flex gap-2 bg-muted rounded-2xl p-1">
        <button onClick={() => setTab("all")}
          className={`flex-1 py-2.5 rounded-xl font-serif text-sm font-bold transition-all ${
            tab === "all" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground"
          }`}>
          كل السور
        </button>
        <button onClick={() => setTab("favorites")}
          className={`flex-1 py-2.5 rounded-xl font-serif text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
            tab === "favorites" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground"
          }`}>
          <Heart className="w-3.5 h-3.5" />
          المفضلة
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-xl text-center font-sans text-sm">
          تعذّر تحميل قائمة السور.
        </div>
      )}

      {tab === "favorites" && !loading && displayed.length === 0 && (
        <div className="text-center py-12 space-y-2">
          <Heart className="w-10 h-10 text-muted-foreground mx-auto opacity-40" />
          <p className="font-serif text-lg text-muted-foreground">لا توجد سور في المفضلة</p>
          <p className="font-sans text-sm text-muted-foreground">اضغط على القلب بجانب أي سورة لإضافتها</p>
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
          : displayed.map((surah) => (
              <div key={surah.number}
                className="flex items-center gap-3 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all group">
                <button
                  onClick={(e) => { e.stopPropagation(); toggle(surah.number); }}
                  className={`p-3 pl-4 transition-colors flex-shrink-0 ${
                    isFavorite(surah.number) ? "text-rose-500" : "text-border hover:text-rose-400"
                  }`}
                  title={isFavorite(surah.number) ? "إزالة من المفضلة" : "إضافة للمفضلة"}>
                  <Heart className="w-4 h-4" fill={isFavorite(surah.number) ? "currentColor" : "none"} />
                </button>
                 <OfflineDownloadButton type="tajweed" number={surah.number} />
                <Link href={`/quran-tajweed/${surah.number}`}
                  className="flex-1 flex items-center gap-3 py-3 pr-0 pl-4 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="font-sans text-primary font-semibold text-xs">{surah.number}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-serif text-xl text-foreground">{surah.name}</p>
                    <p className="font-sans text-xs text-muted-foreground">{surah.englishName} — {surah.englishNameTranslation}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="font-sans text-xs text-muted-foreground px-2 py-1 rounded-full bg-muted">
                      {surah.numberOfAyahs} آية
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 rotate-180" />
                </Link>
              </div>
            ))}
      </div>
    </div>
  );
}
