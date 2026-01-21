"use client";

import { useEffect, useState } from "react";
import { useThemeStore } from "@/stores/theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useThemeStore((state) => state.theme);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);

    // Update color-scheme for native elements
    root.style.colorScheme = theme;
  }, [theme, mounted]);

  // During SSR and initial hydration, render children without theme
  // The CSS defaults to dark, so there's no flash
  return <>{children}</>;
}
