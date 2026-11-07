import { Link } from "@/quran/wouter-shim";
import { SurahMeta } from "@/quran/hooks/useSurahList";

export function SurahCard({ surah }: { surah: SurahMeta }) {
  return (
    <Link 
      href={`/surah/${surah.number}`}
      className="group relative flex items-center justify-between rounded-xl border border-card-border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-md hover:shadow-primary/5"
      data-testid={`card-surah-${surah.number}`}
    >
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-medium">
          {surah.number}
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
            {surah.englishName}
          </span>
          <span className="text-xs text-muted-foreground uppercase tracking-wider">
            {surah.englishNameTranslation} • {surah.numberOfAyahs} Ayahs
          </span>
        </div>
      </div>
      <div className="font-serif text-xl text-foreground text-right" dir="rtl">
        {surah.name}
      </div>
    </Link>
  );
}
