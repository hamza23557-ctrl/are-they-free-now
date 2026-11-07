import { Link } from "@/quran/wouter-shim";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useSurahList } from "@/quran/hooks/useSurahList";
import { Skeleton } from "@/quran/components/ui/skeleton";

export default function QuranWritten() {
  const { surahs, loading, error } = useSurahList();

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-10" dir="rtl">
      <div className="flex items-center gap-3 pt-2">
        <Link href="/" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-back-home">
          <ChevronRight className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="font-serif text-primary font-bold text-[32px]">القرآن المكتوب</h1>
          <p className="text-muted-foreground text-sm font-sans">اختر سورة للقراءة</p>
        </div>
      </div>
      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-xl text-center font-sans text-sm">
          تعذّر تحميل قائمة السور. يرجى المحاولة لاحقاً.
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
                href={`/quran-written/${surah.number}`}
                className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all group"
                data-testid={`link-surah-written-${surah.number}`}
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="font-sans text-primary font-semibold text-sm">{surah.number}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-serif text-foreground text-[26px]">{surah.name}</p>
                  <p className="font-sans text-muted-foreground text-[14px]">{surah.englishName} — {surah.englishNameTranslation}</p>
                </div>
                <div className="text-left flex-shrink-0">
                  <span className="font-sans text-muted-foreground px-2 py-1 rounded-full bg-muted text-[15px]">
                    {surah.numberOfAyahs} آية
                  </span>
                </div>
                <ChevronLeft className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
              </Link>
            ))}
      </div>
    </div>
  );
}
