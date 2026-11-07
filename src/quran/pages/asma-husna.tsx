import { useState } from "react";
import { Link } from "@/quran/wouter-shim";
import { ChevronRight } from "lucide-react";
import { ASMA_HUSNA } from "@/quran/data/asmaHusna";

export default function AsmaHusna() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const filtered = search.trim()
    ? ASMA_HUSNA.filter(
        (a) =>
          a.name.includes(search) ||
          a.meaning.includes(search) ||
          a.transliteration.toLowerCase().includes(search.toLowerCase())
      )
    : ASMA_HUSNA;

  return (
    <div className="space-y-4 pb-10" dir="rtl">
      {/* header */}
      <div className="flex items-center gap-3 pt-2">
        <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
          <ChevronRight className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="font-serif text-2xl text-primary font-bold">أسماء الله الحسنى</h1>
          <p className="text-muted-foreground text-sm font-sans">٩٩ اسماً عظيماً مع الشرح والمعنى</p>
        </div>
      </div>
      {/* header card */}
      <div className="bg-primary/8 border border-primary/20 rounded-2xl p-4 text-center">
        <p className="quran-text text-primary text-lg leading-loose">
          وَلِلَّهِ الْأَسْمَاءُ الْحُسْنَىٰ فَادْعُوهُ بِهَا
        </p>
        <p className="font-sans text-xs text-muted-foreground mt-1">سورة الأعراف — ١٨٠</p>
      </div>
      {/* search */}
      <div className="relative">
        <input
          type="search"
          placeholder="ابحث عن اسم…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pr-4 pl-4 h-12 rounded-2xl bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary font-serif text-lg"
          dir="rtl"
        />
      </div>
      {/* count badge */}
      {!search && (
        <p className="font-sans text-xs text-center text-muted-foreground">
          اضغط على أي اسم لعرض شرحه
        </p>
      )}
      {/* grid of names */}
      <div className="space-y-2">
        {filtered.map((entry) => {
          const isOpen = expanded === entry.number;
          return (
            <div key={entry.number}
              className={`bg-card border rounded-2xl overflow-hidden transition-all ${
                isOpen ? "border-primary/50" : "border-border"
              }`}>
              <button
                onClick={() => setExpanded(isOpen ? null : entry.number)}
                className="w-full flex items-center gap-4 px-4 py-3 text-right hover:bg-muted/30 transition-colors"
              >
                {/* number circle */}
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="font-sans text-primary font-semibold text-sm">{entry.number}</span>
                </div>

                <div className="flex-1 min-w-0">
                  {/* name */}
                  <p className="font-serif text-2xl text-primary font-bold">{entry.name}</p>
                  {/* transliteration + short meaning */}
                  <p className="font-sans text-xs text-muted-foreground mt-0.5">
                    {entry.transliteration} — {entry.meaning}
                  </p>
                </div>

                <ChevronRight
                  className={`w-4 h-4 text-muted-foreground transition-transform flex-shrink-0 ${
                    isOpen ? "-rotate-90" : "rotate-90"
                  }`}
                />
              </button>
              {isOpen && (
                <>
                  <div className="mx-4 h-px bg-border" />
                  <div className="px-4 pt-3 pb-4">
                    <p className="font-serif text-foreground text-right text-[18px]">
                      {entry.explanation}
                    </p>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
      {filtered.length === 0 && (
        <p className="text-center py-8 text-muted-foreground font-serif text-lg">
          لم يُعثر على نتيجة
        </p>
      )}
    </div>
  );
}
