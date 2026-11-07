import { ReactNode, useEffect } from "react";
import { useLocation } from "@/quran/wouter-shim";
import { onPageChange, setBanner } from "@/quran/lib/ads";
import { BottomNavigation } from "./bottom-navigation";

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const isHome = location === "/";

  useEffect(() => {
    void setBanner(!isHome);
    void onPageChange();
  }, [location, isHome]);

  if (isHome) {
    return (
      <div className="w-full min-h-[100dvh] bg-background transition-colors duration-300 overflow-x-clip relative">
        <main className="w-full">
          {children}
        </main>
        <BottomNavigation />
      </div>
    );
  }

  // Extra bottom space so the bottom banner ad never covers content.
  return (
    <div className="min-h-[100dvh] flex flex-col w-full bg-background transition-colors duration-300">
      <main className="app-content flex-1 w-full px-4 py-2">
        {children}
      </main>
      <BottomNavigation />
    </div>
  );
}
