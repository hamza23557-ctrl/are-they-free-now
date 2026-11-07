import { useState, useEffect, useRef } from "react";
import { Link } from "@/quran/wouter-shim";
import { ChevronRight, Compass } from "lucide-react";
import { Button } from "@/quran/components/ui/button";

const MECCA_LAT = 21.4225;
const MECCA_LON = 39.8262;
const toRad = (deg: number) => deg * Math.PI / 180;
const toDeg = (rad: number) => rad * 180 / Math.PI;
const normalize = (angle: number) => (angle % 360 + 360) % 360;
type CompassEvent = DeviceOrientationEvent & { webkitCompassHeading?: number; webkitCompassAccuracy?: number };
type OrientationPermission = { requestPermission?: () => Promise<string> };

function calcQibla(lat: number, lon: number) {
  const dLon = toRad(MECCA_LON - lon);
  const lat1 = toRad(lat);
  const lat2 = toRad(MECCA_LAT);
  return normalize(toDeg(Math.atan2(Math.cos(lat2) * Math.sin(dLon), Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon))));
}

export default function Qibla() {
  const [qiblaAngle, setQiblaAngle] = useState<number | null>(null);
  const [compass, setCompass] = useState(0);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [orientationEnabled, setOrientationEnabled] = useState(false);
  const [needsPermission, setNeedsPermission] = useState(false);
  const [permissionPending, setPermissionPending] = useState(false);
  const [hasHeading, setHasHeading] = useState(false);
  const [orientationError, setOrientationError] = useState<string | null>(null);
  const headingRef = useRef<number | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError("هذا الجهاز لا يدعم تحديد الموقع الجغرافي.");
      return;
    }
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      setQiblaAngle(calcQibla(latitude, longitude));
      const a = Math.sin(toRad(MECCA_LAT - latitude) / 2) ** 2 + Math.cos(toRad(latitude)) * Math.cos(toRad(MECCA_LAT)) * Math.sin(toRad(MECCA_LON - longitude) / 2) ** 2;
      setDistance(Math.round(6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(Math.max(0, 1 - a)))));
    }, () => setLocationError("تعذّر الحصول على موقعك. يرجى السماح بالوصول إلى الموقع الجغرافي."), { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 });

    if (typeof DeviceOrientationEvent === "undefined") {
      setOrientationError("البوصلة غير متاحة على هذا الجهاز؛ الزاوية المعروضة محسوبة من الشمال حسب موقعك.");
      return;
    }
    const requiresPermission = typeof (DeviceOrientationEvent as unknown as OrientationPermission).requestPermission === "function";
    setNeedsPermission(requiresPermission);
    if (!requiresPermission) setOrientationEnabled(true);
  }, []);

  useEffect(() => {
    if (!orientationEnabled) return;
    const timer = window.setTimeout(() => setOrientationError("لم تصل قراءة البوصلة. تأكد من تفعيل المستشعرات؛ الزاوية المعروضة محسوبة من الشمال."), 6000);
    function handleOrientation(event: DeviceOrientationEvent) {
      const e = event as CompassEvent;
      let heading: number;
      if (typeof e.webkitCompassHeading === "number" && Number.isFinite(e.webkitCompassHeading)) {
        if (typeof e.webkitCompassAccuracy === "number" && e.webkitCompassAccuracy < 0) return;
        heading = e.webkitCompassHeading;
      } else if ((e.absolute || e.type === "deviceorientationabsolute") && e.alpha !== null && Number.isFinite(e.alpha)) {
        heading = 360 - e.alpha;
      } else {
        // Relative orientation has no north reference and cannot locate the Qibla reliably.
        return;
      }
      heading = normalize(heading + (window.screen.orientation?.angle ?? 0));
      const previous = headingRef.current;
      const next = previous === null ? heading : previous + normalize(heading - normalize(previous) + 180) - 180;
      headingRef.current = next;
      setCompass(next);
      setHasHeading(true);
      setOrientationError(null);
      window.clearTimeout(timer);
    }
    window.addEventListener("deviceorientationabsolute", handleOrientation, true);
    window.addEventListener("deviceorientation", handleOrientation, true);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("deviceorientationabsolute", handleOrientation, true);
      window.removeEventListener("deviceorientation", handleOrientation, true);
    };
  }, [orientationEnabled]);

  async function enableCompass() {
    if (typeof DeviceOrientationEvent === "undefined") return;
    const request = (DeviceOrientationEvent as unknown as OrientationPermission).requestPermission;
    if (!request) return;
    setPermissionPending(true);
    try {
      const result = await request.call(DeviceOrientationEvent);
      if (result === "granted") {
        setOrientationEnabled(true);
        setNeedsPermission(false);
        setOrientationError(null);
      } else {
        setOrientationError("لم يُسمح باستخدام البوصلة. اسمح بالوصول إلى الحركة والاتجاه لتحديد اتجاه القبلة أثناء دوران الجهاز.");
      }
    } catch {
      setOrientationError("تعذّر تفعيل البوصلة. افتح التطبيق في متصفح يدعم مستشعرات الحركة ثم حاول مجددًا.");
    } finally {
      setPermissionPending(false);
    }
  }

  const needleAngle = (qiblaAngle ?? 0) - compass;
  return (
    <div className="max-w-md mx-auto space-y-8 pb-10" dir="rtl">
      <div className="flex items-center gap-3 pt-2">
        <Link href="/" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-back-home" aria-label="العودة للرئيسية">
          <ChevronRight className="w-6 h-6" />
        </Link>
        <h1 className="font-sans text-2xl text-primary font-bold">اتجاه القبلة</h1>
      </div>
      {locationError && <p role="alert" className="p-4 bg-muted border border-border text-foreground rounded-lg text-center font-sans text-sm leading-relaxed">{locationError}</p>}
      {qiblaAngle === null && !locationError && (
        <div className="text-center py-12 space-y-3" role="status">
          <div className="w-12 h-12 border-3 border-primary border-t-transparent rounded-full motion-safe:animate-spin mx-auto" />
          <p className="font-sans text-muted-foreground text-sm">جارٍ تحديد موقعك...</p>
        </div>
      )}
      {needsPermission && (
        <div className="text-center">
          <Button onClick={enableCompass} disabled={permissionPending}><Compass />{permissionPending ? "جارٍ تفعيل البوصلة..." : "تفعيل البوصلة"}</Button>
        </div>
      )}
      {orientationError && <p role="status" className="text-center text-sm text-muted-foreground leading-relaxed">{orientationError}</p>}
      {qiblaAngle !== null && (
        <>
          {distance !== null && <p className="font-sans text-muted-foreground text-sm text-center">المسافة إلى مكة المكرمة: <span className="font-semibold text-primary">{distance.toLocaleString("ar-SA")} كم</span></p>}
          <div className="flex items-center justify-center py-4">
            <div className="relative w-72 h-72 shrink-0" role="img" aria-label="بوصلة اتجاه القبلة">
              <svg viewBox="0 0 288 288" className="absolute inset-0 w-full h-full" aria-hidden="true">
                <circle cx="144" cy="144" r="138" fill="none" stroke="hsl(var(--border))" strokeWidth="2" />
                <circle cx="144" cy="144" r="120" fill="hsl(var(--card))" />
              </svg>
              <div data-testid="compass-dial" className="absolute inset-0 motion-safe:transition-transform motion-safe:duration-150 motion-safe:ease-linear" style={{ transform: `rotate(${-compass}deg)` }}>
                <svg viewBox="0 0 288 288" className="w-full h-full" aria-hidden="true">
                  {Array.from({ length: 36 }, (_, i) => {
                    const angle = toRad(i * 10);
                    const inner = i % 9 === 0 ? 108 : i % 3 === 0 ? 112 : 116;
                    return <line key={i} x1={144 + 126 * Math.sin(angle)} y1={144 - 126 * Math.cos(angle)} x2={144 + inner * Math.sin(angle)} y2={144 - inner * Math.cos(angle)} stroke="hsl(var(--border))" strokeWidth={i % 9 === 0 ? 2 : 1} />;
                  })}
                  {[{ label: "ش", angle: 0 }, { label: "ق", angle: 90 }, { label: "ج", angle: 180 }, { label: "غ", angle: 270 }].map(({ label, angle }) => (
                    <text key={label} x={144 + 97 * Math.sin(toRad(angle))} y={148 - 97 * Math.cos(toRad(angle))} textAnchor="middle" fontSize="14" className="font-sans" fill="hsl(var(--muted-foreground))" fontWeight="600">{label}</text>
                  ))}
                </svg>
              </div>
              <div data-testid="qibla-needle" className="absolute inset-0 motion-safe:transition-transform motion-safe:duration-150 motion-safe:ease-linear" style={{ transform: `rotate(${needleAngle}deg)` }}>
                <svg viewBox="0 0 288 288" className="w-full h-full" aria-hidden="true">
                  <rect x="134" y="25" width="20" height="20" rx="3" fill="hsl(var(--primary))" />
                  <rect x="134" y="30" width="20" height="3" fill="hsl(var(--accent))" />
                  <polygon points="144,48 151,144 137,144" fill="hsl(var(--primary))" />
                  <polygon points="144,237 151,144 137,144" fill="hsl(var(--muted-foreground))" opacity="0.4" />
                  <circle cx="144" cy="144" r="8" fill="hsl(var(--primary))" />
                  <circle cx="144" cy="144" r="4" fill="hsl(var(--primary-foreground))" />
                </svg>
              </div>
              <span className="absolute inset-x-0 top-40 text-center font-sans text-xs text-primary font-bold pointer-events-none">الكعبة</span>
            </div>
          </div>
          <div className="border-t border-border pt-5 text-center space-y-2">
            <p className="font-sans text-3xl text-primary"><bdi>{Math.round(qiblaAngle).toLocaleString("ar-SA")}°</bdi></p>
            <p className="font-sans text-sm text-muted-foreground">اتجاه القبلة من الشمال</p>
            {!hasHeading && !orientationError && !needsPermission && <p role="status" className="text-sm text-muted-foreground">بانتظار قراءة البوصلة...</p>}
          </div>
          <p className="border-t border-border pt-4 text-center font-sans text-xs text-muted-foreground leading-relaxed">للحصول على أفضل دقة، أمسك الجهاز أفقياً وابتعد عن المعادن والأجهزة الإلكترونية</p>
        </>
      )}
    </div>
  );
}
