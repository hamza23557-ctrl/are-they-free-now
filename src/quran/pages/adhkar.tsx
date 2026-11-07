import { Link } from "@/quran/wouter-shim";
import { ChevronRight, ChevronLeft, Heart } from "lucide-react";

const categories = [
  { slug: "fadl", label: "فضل الذكر", desc: "آيات وأحاديث في فضل ذكر الله" },
  { slug: "morning", label: "أذكار الصباح", desc: "أذكار تُقال عند الصباح" },
  { slug: "evening", label: "أذكار المساء", desc: "أذكار تُقال عند المساء" },
  { slug: "sleep", label: "أذكار النوم", desc: "أذكار تُقال عند النوم" },
  { slug: "wakeup", label: "أذكار الاستيقاظ", desc: "أذكار تُقال عند الاستيقاظ" },
  { slug: "after-prayer", label: "أذكار بعد الصلاة", desc: "أذكار تُقال عقب الصلوات" },
  { slug: "enter-home", label: "أذكار دخول المنزل", desc: "دعاء دخول البيت" },
  { slug: "exit-home", label: "أذكار الخروج من المنزل", desc: "دعاء الخروج من البيت" },
  { slug: "food", label: "أذكار الأكل والشرب", desc: "أذكار الطعام والشراب" },
  { slug: "toilet", label: "أذكار الخلاء", desc: "عند دخول الخلاء والخروج منه" },
  { slug: "eating", label: "أذكار الطعام", desc: "قبل الطعام وبعده" },
  { slug: "drinking", label: "أذكار الشراب", desc: "قبل الشرب وبعده" },
  { slug: "hajj", label: "أذكار الحج والعمرة", desc: "التلبية والطواف والسعي" },
  { slug: "mosque", label: "أذكار المسجد", desc: "الذهاب والدخول والخروج" },
  { slug: "wudu", label: "أذكار الوضوء", desc: "قبل الوضوء وبعده" },
  { slug: "misc", label: "أذكار متفرقة", desc: "العطاس والغضب والسفر وغيرها" },
];

export default function Adhkar() {
  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-10" dir="rtl">
      <div className="flex items-center gap-3 pt-2">
        <Link href="/" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-back-home">
          <ChevronRight className="w-6 h-6" />
        </Link>
        <h1 className="font-serif text-primary font-bold text-[38px] flex-1">الأذكار</h1>
        <Link href="/favorites?type=dhikr" className="text-muted-foreground hover:text-red-500 transition-colors" data-testid="link-favorites" aria-label="المفضلة">
          <Heart className="w-6 h-6" />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/adhkar/${cat.slug}`}
            className="flex items-center justify-between p-5 bg-card border border-border rounded-2xl hover:border-primary hover:bg-primary/5 transition-all group shadow-sm"
            data-testid={`link-adhkar-${cat.slug}`}
          >
            <div className="space-y-1">
              <p className="font-serif text-foreground text-[26px]">{cat.label}</p>
              <p className="font-sans text-xs text-muted-foreground">{cat.desc}</p>
            </div>
            <ChevronLeft className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  );
}
