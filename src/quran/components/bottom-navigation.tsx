import { Link, useLocation } from "@tanstack/react-router";
import { Bell, BookOpen, Headphones, House, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const items = [
  { to: "/", label: "الصفحة الرئيسية", icon: House },
  { to: "/illuminated-book", label: "الكتاب المضيئ", icon: BookOpen },
  { to: "/quran-audio", label: "القرآن المرتل", icon: Headphones },
  { to: "/notifications", label: "الإشعارات", icon: Bell },
  { to: "/search", label: "البحث", icon: Search },
] as const;

export function BottomNavigation() {
  const pathname = useLocation({ select: (location) => location.pathname });
  return (
    <nav className={`bottom-navigation ${pathname === "/" ? "bottom-navigation--home" : ""}`} aria-label="التنقل السفلي" dir="rtl">
      {items.map(({ to, label, icon: Icon }) => {
        const active = to === "/" ? pathname === to : pathname === to || pathname.startsWith(`${to}/`);
        return (
          <Button key={to} asChild variant="ghost" className={`bottom-navigation-item ${active ? "bottom-navigation-item--active" : ""}`}>
            <Link to={to} aria-current={active ? "page" : undefined} aria-label={label}>
              <Icon aria-hidden="true" />
              <span>{label}</span>
            </Link>
          </Button>
        );
      })}
    </nav>
  );
}