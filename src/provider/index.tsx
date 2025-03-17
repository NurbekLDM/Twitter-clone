"use client";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ReactNode } from "react";

interface ThemeProviderProps {
  children: ReactNode;
  attribute?: string;
  defaultTheme?: string;
  enableSystem?: boolean;
  themes?: string[];
  disableTransitionOnChange?: boolean;
}

export function ThemeProvider({
  children,
  attribute = "data-theme", // Changed from "class" to "data-theme"
  defaultTheme = "system",
  enableSystem = true,
  themes = ['light', 'dark', 'system', 'dimmed', 'neon', 'sepia', 'solarized', 'dracula', 'synthwave', 'retro', 'lava', 'glacier','pastel', 'midnight', 'forest','cyberpunk', 'valentine', 'halloween', 'garden', 'beach', 'forest', 'aqua', 'lofi', 'pastel', 'fantasy', 'wireframe', 'black', 'luxury', 'dracula', 'retro', 'cyberpunk',],
  disableTransitionOnChange = false,
}: ThemeProviderProps) {
  return (
    <SessionProvider>
    <NextThemesProvider
      attribute={attribute}
      defaultTheme={defaultTheme}
      enableSystem={enableSystem}
      themes={themes}
      disableTransitionOnChange={disableTransitionOnChange}
    >
      {children}
    </NextThemesProvider>
    </SessionProvider>
  );
}