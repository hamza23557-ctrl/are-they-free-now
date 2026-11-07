import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/quran/components/theme-provider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "تفعيل الوضع النهاري" : "تفعيل الوضع الليلي"}
      className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-md"
      style={{
        background: isDark ? "rgba(255,255,255,0.12)" : "rgba(58,95,32,0.12)",
        border: `1.5px solid ${isDark ? "rgba(255,255,255,0.2)" : "rgba(58,95,32,0.25)"}`,
      }}
      data-testid="button-theme-toggle"
    >
      {isDark
        ? <Sun className="w-4 h-4" style={{ color: "#e8c37d" }} />
        : <Moon className="w-4 h-4" style={{ color: "#3a5f20" }} />
      }
    </button>
  );
}
