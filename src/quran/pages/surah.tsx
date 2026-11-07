import { useEffect, useRef } from "react";
import { useParams, Link, useLocation } from "@/quran/wouter-shim";
import { useSurah } from "@/quran/hooks/useSurah";
import { useBookmarks } from "@/quran/hooks/useBookmarks";
import { Skeleton } from "@/quran/components/ui/skeleton";
import { ChevronRight, ChevronLeft, Bookmark } from "lucide-react";
import { Button } from "@/quran/components/ui/button";

function withoutBasmala(text: string): string {
  const plain = text.replace(/[\u064B-\u065F\u0670]/g, "");
  const basmala = "بسم الله الرحمن الرحيم";
  return plain.startsWith(basmala) ? plain.slice(basmala.length).trimStart() : text;
}

export default function Surah() {
  const { number } = useParams();
  const [, setLocation] = useLocation();
  const surahNum = parseInt(number || "1", 10);
  
  const { surah, loading, error } = useSurah(surahNum);
  const { saveBookmark } = useBookmarks();
  
  const ayahRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  useEffect(() => {
    // Reset state on surah change
    window.scrollTo(0, 0);
  }, [surahNum]);

  if (error) {
    return (
      <div className="text-center py-20 text-destructive">
        <p>Failed to load Surah. It might not exist or there is a network issue.</p>
        <Button onClick={() => setLocation("/")} className="mt-4">Return Home</Button>
      </div>
    );
  }

  if (loading || !surah) {
    return (
      <div className="max-w-3xl mx-auto space-y-8 py-8">
        <div className="text-center space-y-4 pb-8 border-b border-border/40">
          <Skeleton className="h-12 w-48 mx-auto" />
          <Skeleton className="h-6 w-32 mx-auto" />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="space-y-4 py-6 border-b border-border/20">
            <Skeleton className="h-8 w-full max-w-2xl ml-auto" />
            <Skeleton className="h-8 w-3/4 ml-auto" />
            <Skeleton className="h-4 w-full mt-8" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        ))}
      </div>
    );
  }

  const handleBookmark = (ayahIndex: number) => {
    saveBookmark({
      surahNumber: surahNum,
      ayahNumber: surah.ayahs[ayahIndex].numberInSurah,
      surahName: surah.englishName,
    });
  };

  return (
    <div className="max-w-3xl mx-auto pb-32">
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border/40 text-center space-y-4 py-5 mb-8">
        <h1 className="quran-text text-4xl md:text-5xl text-primary" dir="rtl">{surah.name}</h1>
        <h2 className="text-2xl font-bold font-sans">{surah.englishName}</h2>
        <p className="text-muted-foreground uppercase tracking-widest text-sm">
          {surah.englishNameTranslation} • {surah.revelationType} • {surah.numberOfAyahs} Ayahs
        </p>
      </div>

      <div className="space-y-12">
        {surah.ayahs.map((ayah, index) => (
          <div 
            key={ayah.numberInSurah} 
            id={`ayah-${ayah.numberInSurah}`}
            ref={el => { ayahRefs.current[index] = el; }}
            className={`group py-6 px-4 -mx-4 rounded-2xl transition-colors hover:bg-muted/30`}
          >
            <div className="flex flex-col items-end gap-6 mb-6">
              <div className="w-full flex items-center justify-between mb-2">
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
                    onClick={() => handleBookmark(index)}
                    title="Bookmark this Ayah"
                  >
                    <Bookmark className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground text-sm font-medium">
                  {ayah.numberInSurah}
                </div>
              </div>
              <p className="quran-text" dir="rtl">
                {withoutBasmala(ayah.textAr)}
              </p>
            </div>
            <p className="text-muted-foreground text-lg leading-relaxed font-sans pr-4 pl-4 md:pl-12 border-l-2 border-border group-hover:border-primary/30 transition-colors">
              {ayah.textEn}
            </p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mt-16 pt-8 border-t border-border/40">
        {surahNum > 1 ? (
          <Link href={`/surah/${surahNum - 1}`} className="flex items-center gap-2 text-primary hover:underline font-medium">
            <ChevronLeft className="h-5 w-5" /> Previous Surah
          </Link>
        ) : <div />}
        
        {surahNum < 114 ? (
          <Link href={`/surah/${surahNum + 1}`} className="flex items-center gap-2 text-primary hover:underline font-medium">
            Next Surah <ChevronRight className="h-5 w-5" />
          </Link>
        ) : <div />}
      </div>

    </div>
  );
}

