import { useState } from "react";
import { Link, useSearch } from "@/quran/wouter-shim";
import { ChevronRight, Heart, Trash2 } from "lucide-react";
import { loadFavorites, saveFavorites, type FavoriteItem, type FavoriteType } from "@/quran/hooks/useDhikrFavorites";

const typeLabels: Record<FavoriteType, string> = {
  dua: "الأدعية",
  dhikr: "الأذكار",
  tasbeeh: "التسابيح",
};

const typeOrder: FavoriteType[] = ["dua", "dhikr", "tasbeeh"];

export default function Favorites() {
  const [items, setItems] = useState<FavoriteItem[]>(loadFavorites);

  function remove(key: string) {
    const next = items.filter((f) => f.key !== key);
    setItems(next);
    saveFavorites(next);
  }

  const search = useSearch();
  const filter = new URLSearchParams(search.startsWith("?") ? search : `?${search}`).get("type") as FavoriteType | null;
  const activeType = filter && typeOrder.includes(filter) ? filter : null;
  const backHref = activeType === "dua" ? "/duas" : activeType === "dhikr" ? "/adhkar" : activeType === "tasbeeh" ? "/tasbeeh" : "/";
  const visible = activeType ? items.filter((f) => f.type === activeType) : items;
  const groups = typeOrder
    .map((type) => ({ type, items: visible.filter((f) => f.type === type) }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="max-w-2xl mx-auto space-y-4 pb-10" dir="rtl">
      <div className="flex items-center gap-3 pt-2">
        <Link href={backHref} className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-back-home">
          <ChevronRight className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="font-serif text-primary font-bold text-[34px]">{activeType ? `مفضلة ${typeLabels[activeType]}` : "المفضلة"}</h1>
          <p className="font-sans text-muted-foreground text-[14px]">{visible.length} عنصر محفوظ</p>
        </div>
      </div>

      {visible.length === 0 && (
        <div className="text-center py-16 space-y-3">
          <Heart className="w-12 h-12 mx-auto text-muted-foreground" />
          <p className="font-serif text-muted-foreground text-xl">لا توجد عناصر في المفضلة بعد</p>
          <p className="font-sans text-sm text-muted-foreground">
            اضغط على القلب بجانب أي دعاء أو ذكر أو تسبيحة لحفظها هنا
          </p>
        </div>
      )}

      {groups.map((group) => (
        <div key={group.type} className="space-y-2">
          <h2 className="font-serif text-primary font-bold text-[24px] pt-2">{activeType ? null : typeLabels[group.type]}</h2>
          {group.items.map((item) => (
            <div
              key={item.key}
              className="bg-card border border-border rounded-2xl p-5 space-y-3 shadow-sm"
              data-testid={`card-favorite-${item.key}`}
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-serif text-primary font-bold text-[18px]">{item.title}</h3>
                <button
                  type="button"
                  aria-label="إزالة من المفضلة"
                  data-testid={`button-remove-favorite-${item.key}`}
                  onClick={() => remove(item.key)}
                  className="p-2 rounded-full text-muted-foreground hover:text-red-500 transition-colors flex-shrink-0"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              <p className="quran-text text-foreground text-[24px] font-semibold">{item.text}</p>
              {item.source && (
                <p className="font-sans text-muted-foreground text-[15px] font-medium">المصدر: {item.source}</p>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
