import { useState, useEffect } from "react";
import { Link } from "@/quran/wouter-shim";
import { ChevronRight } from "lucide-react";

interface PrayerTimes {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

const prayerNames: Record<keyof PrayerTimes, string> = {
  Fajr: "الفجر",
  Sunrise: "الشروق",
  Dhuhr: "الظهر",
  Asr: "العصر",
  Maghrib: "المغرب",
  Isha: "العشاء",
};

const prayerOrder: (keyof PrayerTimes)[] = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function formatCountdown(minutes: number): string {
  if (minutes <= 0) return "الآن";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0) return `${h} ساعة و ${m} دقيقة`;
  return `${m} دقيقة`;
}

function getCurrentMinutes(): number {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

function getNextPrayer(times: PrayerTimes): { name: string; key: keyof PrayerTimes; minutesLeft: number } | null {
  const now = getCurrentMinutes();
  for (const key of prayerOrder) {
    const mins = timeToMinutes(times[key]);
    if (mins > now) {
      return { name: prayerNames[key], key, minutesLeft: mins - now };
    }
  }
  // next is Fajr tomorrow
  const fajrMins = timeToMinutes(times.Fajr);
  return { name: prayerNames.Fajr, key: "Fajr", minutesLeft: (24 * 60 - now) + fajrMins };
}

export default function PrayerTimes() {
  const [times, setTimes] = useState<PrayerTimes | null>(null);
  const [city, setCity] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState(getCurrentMinutes());
  const [date, setDate] = useState(() => {
    const d = new Date();
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  });

  useEffect(() => {
    const interval = setInterval(() => setNow(getCurrentMinutes()), 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          // Fetch prayer times
          const res = await fetch(
            `https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=4`
          );
          if (!res.ok) throw new Error();
          const data = await res.json();
          const t = data.data.timings as PrayerTimes;
          // Strip seconds from times
          const cleaned: Partial<PrayerTimes> = {};
          for (const key of prayerOrder) {
            cleaned[key] = t[key].substring(0, 5);
          }
          setTimes(cleaned as PrayerTimes);

          // Reverse geocode for city name
          try {
            const geoRes = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const geoData = await geoRes.json();
            const addr = geoData.address;
            setCity(addr.city || addr.town || addr.village || addr.county || "موقعك");
          } catch {
            setCity("موقعك");
          }
        } catch {
          setError("تعذّر تحميل أوقات الصلاة. يرجى المحاولة لاحقاً.");
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError("يرجى السماح بالوصول إلى الموقع الجغرافي لعرض أوقات الصلاة.");
        setLoading(false);
      }
    );
  }, []);

  const nextPrayer = times ? getNextPrayer(times) : null;

  return (
    <div className="max-w-md mx-auto space-y-6 pb-10" dir="rtl">
      <div className="flex items-center gap-3 pt-2">
        <Link href="/" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-back-home">
          <ChevronRight className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="font-serif text-2xl text-primary font-bold">أوقات الصلاة</h1>
          {city && <p className="font-sans text-xs text-muted-foreground">{city} — {date}</p>}
        </div>
      </div>

      {loading && (
        <div className="text-center py-16 space-y-3">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" style={{ borderWidth: 3 }} />
          <p className="font-sans text-muted-foreground text-sm">جارٍ تحديد الموقع وجلب الأوقات...</p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl font-sans text-sm text-center leading-relaxed">
          {error}
        </div>
      )}

      {nextPrayer && (
        <div className="bg-primary text-primary-foreground rounded-3xl p-6 text-center space-y-1 shadow-lg">
          <p className="font-sans text-sm opacity-80">الصلاة القادمة</p>
          <p className="font-serif text-4xl font-bold">{nextPrayer.name}</p>
          <p className="font-sans text-sm opacity-80">بعد {formatCountdown(nextPrayer.minutesLeft)}</p>
        </div>
      )}

      {times && (
        <div className="space-y-2">
          {prayerOrder.map((key) => {
            const mins = timeToMinutes(times[key]);
            const isPast = mins < now;
            const isNext = nextPrayer?.key === key;

            return (
              <div
                key={key}
                className={`flex items-center justify-between px-5 py-4 rounded-2xl border transition-all ${
                  isNext
                    ? "border-primary bg-primary/10 shadow-sm"
                    : isPast
                    ? "border-border bg-card opacity-60"
                    : "border-border bg-card"
                }`}
                data-testid={`prayer-${key.toLowerCase()}`}
              >
                <div className="flex items-center gap-3">
                  {isNext && (
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse flex-shrink-0" />
                  )}
                  {!isNext && <span className="w-2 h-2 rounded-full bg-transparent flex-shrink-0" />}
                  <p className={`font-serif text-xl ${isNext ? "text-primary font-bold" : "text-foreground"}`}>
                    {prayerNames[key]}
                  </p>
                </div>
                <p className={`font-sans text-lg font-semibold tabular-nums ${isNext ? "text-primary" : isPast ? "text-muted-foreground" : "text-foreground"}`} dir="ltr">
                  {times[key]}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {times && (
        <p className="font-sans text-xs text-center text-muted-foreground">
          الأوقات وفق طريقة أم القرى
        </p>
      )}
    </div>
  );
}
