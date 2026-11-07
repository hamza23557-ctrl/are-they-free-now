import { useState, useEffect } from "react";
import { Link } from "@/quran/wouter-shim";
import { ChevronRight, RotateCcw, Heart } from "lucide-react";
import { FavoriteButton } from "@/quran/components/FavoriteButton";

const tasbeehList = [
  { id: 1,  text: "سُبْحَانَ اللَّهِ",                                         target: 33,  note: "بعد الصلاة" },
  { id: 2,  text: "الْحَمْدُ لِلَّهِ",                                          target: 33,  note: "بعد الصلاة" },
  { id: 3,  text: "اللَّهُ أَكْبَرُ",                                           target: 34,  note: "بعد الصلاة" },
  { id: 4,  text: "لَا إِلَهَ إِلَّا اللَّهُ",                                 target: 100, note: "سيد الذكر" },
  { id: 5,  text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",                            target: 100, note: "تمحو الخطايا" },
  { id: 6,  text: "سُبْحَانَ اللَّهِ الْعَظِيمِ",                             target: 100, note: "حبيبتان إلى الرحمن" },
  { id: 7,  text: "أَسْتَغْفِرُ اللَّهَ",                                       target: 100, note: "الاستغفار" },
  { id: 8,  text: "أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ",                  target: 70,  note: "كان النبي ﷺ يقولها" },
  { id: 9,  text: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",               target: 100, note: "كنز من كنوز الجنة" },
  { id: 10, text: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ",                          target: 100, note: "الصلاة على النبي ﷺ" },
  { id: 11, text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ سُبْحَانَ اللَّهِ الْعَظِيمِ", target: 100, note: "أحب الكلام إلى الله" },
  { id: 12, text: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ", target: 100, note: "أفضل الذكر" },
  { id: 13, text: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ",                     target: 21,  note: "عدد الفاتحة" },
  { id: 14, text: "حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ", target: 7, note: "من قالها كفاه الله" },
  { id: 15, text: "اللَّهُمَّ اغْفِرْ لِي وَارْحَمْنِي وَاهْدِنِي وَارْزُقْنِي", target: 100, note: "دعاء جامع" },
  { id: 16, text: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ", target: 33, note: "أكثر دعاء النبي ﷺ" },
  { id: 17, text: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ",    target: 100, note: "من خير ما يُسأل" },
  { id: 18, text: "سُبْحَانَ اللَّهِ الْعَظِيمِ وَبِحَمْدِهِ",               target: 100, note: "غرست نخلة في الجنة" },
  { id: 19, text: "اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ", target: 33, note: "بعد السلام من الصلاة" },
  { id: 20, text: "يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ",         target: 100, note: "من أسماء الله الحسنى" },
  { id: 21, text: "سُبْحَانَ اللَّهِ، وَالْحَمْدُ لِلَّهِ، وَلَا إِلَهَ إِلَّا اللَّهُ، وَاللَّهُ أَكْبَرُ", target: 100, note: "أحب الكلام إلى الله" },
  { id: 22, text: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", target: 100, note: "تملأ الميزان" },
  { id: 23, text: "سُبْحَانَ اللَّهِ وَالْحَمْدُ لِلَّهِ", target: 100, note: "تملآن ما بين السماء والأرض" },
  { id: 24, text: "الْحَمْدُ لِلَّهِ حَمْدًا كَثِيرًا طَيِّبًا مُبَارَكًا فِيهِ", target: 33, note: "ابتدرها بضعة عشر ملكًا" },
  { id: 25, text: "اللَّهُ أَكْبَرُ كَبِيرًا، وَالْحَمْدُ لِلَّهِ كَثِيرًا، وَسُبْحَانَ اللَّهِ بُكْرَةً وَأَصِيلًا", target: 33, note: "فُتحت لها أبواب السماء" },
  { id: 26, text: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، يُحْيِي وَيُمِيتُ، وَهُوَ حَيٌّ لَا يَمُوتُ، بِيَدِهِ الْخَيْرُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ", target: 10, note: "دعاء دخول السوق" },
];

function CircleProgress({ count, target }: { count: number; target: number }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(count / target, 1);
  return (
    <svg width="130" height="130" className="mx-auto -rotate-90">
      <circle cx="65" cy="65" r={radius} fill="none" stroke="hsl(var(--border))" strokeWidth="8" />
      <circle cx="65" cy="65" r={radius} fill="none" stroke="hsl(var(--primary))" strokeWidth="8"
        strokeLinecap="round" strokeDasharray={circumference}
        strokeDashoffset={circumference * (1 - progress)} className="transition-all duration-300" />
    </svg>
  );
}

function RosaryBeads({ count, target }: { count: number; target: number }) {
  const beadCount = Math.min(target, 33);
  const filled = Math.round((count / target) * beadCount);
  return (
    <div className="flex flex-wrap justify-center gap-2 py-2">
      {Array.from({ length: beadCount }).map((_, i) => (
        <div key={i} className={`w-4 h-4 rounded-full transition-all duration-200 ${i < filled ? "bg-primary scale-110" : "bg-border"}`} />
      ))}
    </div>
  );
}

function TasbeehCounter({ item, count, onIncrement, onReset, onClose }:
  { item: typeof tasbeehList[0]; count: number; onIncrement: () => void; onReset: () => void; onClose: () => void }) {
  const done = count >= item.target;
  return (
    <div className="fixed inset-0 z-[1000] bg-background flex flex-col items-center overflow-y-auto px-6 pb-24 pt-6" dir="rtl">
      <button onClick={onClose} aria-label="رجوع" className="self-start flex items-center gap-1 px-3 py-2 rounded-full bg-muted text-foreground hover:text-primary mb-4 font-sans text-sm" data-testid="button-close-tasbeeh">
        <ChevronRight className="w-6 h-6" /> رجوع
      </button>
      <div className="w-full max-w-sm space-y-5 text-center flex flex-col items-center my-auto">
        <p className="font-serif text-primary text-[34px] font-bold">{item.text}</p>
        {item.note && <p className="font-sans text-xs text-muted-foreground">{item.note}</p>}

        <div className="relative inline-block">
          <CircleProgress count={count} target={item.target} />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-sans text-4xl font-bold text-primary">{count}</span>
          </div>
        </div>
        <p className="font-sans text-muted-foreground text-[18px]">الهدف: {item.target}</p>
        <RosaryBeads count={count} target={item.target} />

        {done ? (
          <div className="space-y-4">
            <p className="font-serif text-2xl text-primary animate-pulse">الله يبارك فيك ويجزيك خيراً</p>
            <button onClick={onReset}
              className="flex items-center gap-2 mx-auto px-6 py-3 rounded-full bg-primary text-primary-foreground font-sans text-sm hover:bg-primary/90 transition-all"
              data-testid="button-reset-tasbeeh">
              <RotateCcw className="w-4 h-4" />إعادة
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <button onClick={onIncrement}
              className="w-40 h-40 rounded-full bg-primary text-primary-foreground shadow-xl hover:bg-primary/90 transition-all active:scale-95 mx-auto flex items-center justify-center"
              data-testid="button-increment-tasbeeh">
              <span className="font-serif text-xl leading-relaxed px-4 text-center">{item.text}</span>
            </button>
            <button onClick={onReset} className="text-muted-foreground hover:text-primary text-xs font-sans flex items-center gap-1 mx-auto" data-testid="button-reset-tasbeeh">
              <RotateCcw className="w-3 h-3" /> إعادة
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Tasbeeh() {
  const [activeId, setActiveId] = useState<number | null>(null);
  const [counts, setCounts] = useState<Record<number, number>>({});

  useEffect(() => {
    const saved = localStorage.getItem("tasbeeh-counts");
    if (saved) { try { setCounts(JSON.parse(saved)); } catch {} }
  }, []);

  function saveCounts(next: Record<number, number>) {
    setCounts(next);
    localStorage.setItem("tasbeeh-counts", JSON.stringify(next));
  }

  function handleIncrement(id: number) {
    const item = tasbeehList.find((t) => t.id === id);
    if (!item) return;
    const current = counts[id] || 0;
    if (current < item.target) saveCounts({ ...counts, [id]: current + 1 });
  }

  function handleReset(id: number) {
    saveCounts({ ...counts, [id]: 0 });
  }

  const activeItem = tasbeehList.find((t) => t.id === activeId);
  const totalCompleted = tasbeehList.filter((t) => (counts[t.id] || 0) >= t.target).length;

  return (
    <div className="max-w-2xl mx-auto space-y-4 pb-10" dir="rtl">
      <div className="flex items-center gap-3 pt-2">
        <Link href="/" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-back-home">
          <ChevronRight className="w-6 h-6" />
        </Link>
        <div className="flex-1">
          <h1 className="font-serif text-primary font-bold text-[30px]">التسابيح</h1>
          <p className="font-sans text-muted-foreground text-[14px] font-bold">{totalCompleted} مكتمل من {tasbeehList.length}</p>
        </div>
        <Link href="/favorites?type=tasbeeh" className="text-muted-foreground hover:text-red-500 transition-colors" data-testid="link-favorites" aria-label="المفضلة">
          <Heart className="w-6 h-6" />
        </Link>
      </div>
      <div className="space-y-2">
        {tasbeehList.map((item) => {
          const count = counts[item.id] || 0;
          const done = count >= item.target;
          const progress = Math.min((count / item.target) * 100, 100);
          return (
            <button key={item.id} onClick={() => setActiveId(item.id)}
              className="w-full text-right bg-card border border-border rounded-2xl px-5 py-4 hover:border-primary hover:bg-primary/5 transition-all shadow-sm space-y-2"
              data-testid={`button-tasbeeh-${item.id}`}>
              <div className="flex items-start justify-between gap-3">
                <span className={`font-sans text-sm font-bold px-3 py-1 rounded-full flex-shrink-0 ${done ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  {count} / {item.target}
                </span>
                <div className="flex-1 text-right">
                  <p className="font-serif text-foreground font-medium text-[25px]">{item.text}</p>
                  {item.note && <p className="font-sans text-xs text-muted-foreground mt-0.5">{item.note}</p>}
                </div>
                <FavoriteButton
                  item={{ key: `tasbeeh-${item.id}`, type: "tasbeeh", title: item.text, text: item.text, source: item.note }}
                />
              </div>
              <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
              {done && <p className="font-serif text-xs text-primary">✓ الله يبارك فيك</p>}
            </button>
          );
        })}
      </div>
      {activeId !== null && activeItem && (
        <TasbeehCounter
          item={activeItem}
          count={counts[activeItem.id] || 0}
          onIncrement={() => handleIncrement(activeItem.id)}
          onReset={() => handleReset(activeItem.id)}
          onClose={() => setActiveId(null)}
        />
      )}
    </div>
  );
}
