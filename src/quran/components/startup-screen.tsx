import { useEffect, useState } from "react";
import startupImage from "@/assets/quran-startup.jpg";

/** Present in the initial HTML, including the offline SPA shell. */
export function StartupScreen() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    const images = Array.from(document.images);
    const imageReady = (image: HTMLImageElement) => {
      if (image.complete) return Promise.resolve();
      return new Promise<void>((resolve) => {
        image.addEventListener("load", () => resolve(), { once: true });
        image.addEventListener("error", () => resolve(), { once: true });
      });
    };
    Promise.all([document.fonts.ready, ...images.map(imageReady)]).then(() => {
      requestAnimationFrame(() => {
        if (!active) return;
        document.documentElement.dataset.appReady = "true";
        setReady(true);
      });
    });
    return () => { active = false; };
  }, []);

  if (ready) return null;
  return (
    <div className="startup-screen" role="status" aria-label="جارٍ فتح التطبيق">
      <div className="startup-art">
        <img src={startupImage} alt="القرآن الكريم — Quran Kareem" fetchPriority="high" />
        <span className="startup-spinner" aria-hidden="true" />
      </div>
    </div>
  );
}