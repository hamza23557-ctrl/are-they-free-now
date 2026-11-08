import { Link } from "@/quran/wouter-shim";
import illuminatedBookAsset from "@/assets/home-buttons/illuminated-book-button.jpg.asset.json";
import minshawiHeaderAsset from "@/assets/minshawi-header-cream.jpg";

const homeBackground = `${import.meta.env.BASE_URL}quran-home-4k.jpg`;
const buttonAsset = (name: string) =>
  `${import.meta.env.BASE_URL}home-buttons/${name}.png`;

const homeButtons = [
  {
    href: "/quran-audio",
    image: "offline-new",
    label: "القرآن الكريم مرتل بدون نت",
    testid: "link-quran-audio",
  },
  {
    href: "/quran-tajweed",
    image: "tajweed-new",
    label: "القرآن الكريم مجود",
    testid: "link-quran-tajweed",
  },
  {
    href: "/asma-husna",
    image: "asma",
    label: "أسماء الله الحسنى",
    testid: "link-asma-husna",
  },
  {
    href: "/hadith",
    image: "hadith-new",
    label: "الأحاديث النبوية",
    testid: "link-hadith",
  },
  {
    href: "/quran-written",
    image: "written-new",
    label: "القرآن الكريم مكتوب",
    testid: "link-quran-written",
  },
  {
    href: "/prayer-times",
    image: "prayer-new",
    label: "مواقيت الصلاة",
    testid: "link-prayer-times",
  },
  {
    href: "/qibla",
    image: "qibla-new",
    label: "تحديد اتجاه القبلة",
    testid: "link-qibla",
  },
  {
    href: "/duas",
    image: "duas-new",
    label: "الدعاء",
    testid: "link-duas",
  },
  {
    href: "/adhkar",
    image: "adhkar-new",
    label: "الأذكار",
    testid: "link-adhkar",
  },
  {
    href: "/tasbeeh",
    image: "tasbeeh-new",
    label: "التسابيح",
    testid: "link-tasbeeh",
  },
] as const;

export default function Home() {
  return (
    <main
      className="quran-home-screen"
      dir="rtl"
      aria-label="الصفحة الرئيسية"
    >
      <div className="quran-home-art">
        <img
          className="quran-home-header"
          src={minshawiHeaderAsset}
          alt="فضيلة الشيخ محمد صديق المنشاوي"
          draggable={false}
        />
        <div
          className="quran-home-bottom-background"
          style={{ backgroundImage: `url(${homeBackground})` }}
          aria-hidden="true"
        />
        <nav className="home-button-stack" aria-label="أقسام التطبيق">
              <Link
                href="/illuminated-book"
                className="home-image-button"
                data-testid="link-illuminated-book"
                aria-label="الكتاب المضيئ"
              >
                <img src={illuminatedBookAsset.url} alt="الكتاب المضيئ — اسأل واعرف وتعلم" draggable={false} />
              </Link>
          {homeButtons.map((button) => (
            <Link
              key={button.href}
              href={button.href}
              className="home-image-button"
              data-testid={button.testid}
              aria-label={button.label}
            >
              <img
                src={buttonAsset(button.image)}
                alt={button.label}
                draggable={false}
              />
            </Link>
          ))}
          <Link href="/privacy" className="block py-2 text-center text-sm text-muted-foreground underline" data-testid="link-privacy">
            سياسة الخصوصية
          </Link>
        </nav>
      </div>
    </main>
  );
}