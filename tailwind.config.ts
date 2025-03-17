// tailwind.config.js
import { default as flattenColorPalette } from "tailwindcss/lib/util/flattenColorPalette";
import plugin from "tailwindcss/plugin";

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        blue: "#1fb6ff",
        red: "#ff4949",
        purple: "#7e5bef",
        pink: "#ff49db",
        orange: "#ff7849",
        cyan: "#18dcff",
        teal: "#5eead4",
        lime: "#84ff49",
        emerald: "#49ff7c",
        indigo: "#4953ff",
        violet: "#7c49ff",
        rose: "#ff49db",
        transparent: "transparent",
        current: "currentColor",
        green: {
          300: "#a7f3d0",
          600: "#0fae9b",
          700: "#0c8b7f",
          800: "#0a6e67",
          900: "#044e42",
        },
        yellow: {
          400: "#ffea00",
          500: "#ffc800",
          600: "#ffab00",
          700: "#ff8a00",
          800: "#ff6a00",
          DEFAULT: "#ffc82c",
        },
        gray: {
          dark: "#273444",
          DEFAULT: "#8492a6",
          900: "#1a202c",
          800: "#2d3748",
          700: "#4a5568",
          600: "#718096",
          500: "#a0aec0",
          light: "#d3dce6",
        },
        neutral: {
          300: "#e2e8f0",
          400: "#cbd5e0",
          500: "#a0aec0",
          600: "#718096",
          700: "#4a5568",
          800: "#2d3748",
          900: "#1a202c",
        },
        
        white: "#ffffff",
        black: "#000000",
        
          system: {
            light: "#f5f5f5",
            dark: "#1c1c1c",
            text: { light: "#222222", dark: "#cccccc" }
          },
          dimmed: {
            light: "#e5e5e5",
            dark: "#bbbbbb",
            text: { light: "#222222", dark: "#555555" }
          },
          neon: {
            light: "#00ffff",
            dark: "#ff00ff",
            text: { light: "#ffffff", dark: "#00ff00" }
          },
          sepia: {
            light: "#f5e1c0",
            dark: "#8b5a2b",
            text: { light: "#4a2c2a", dark: "#5e3d34" }
          },
          solarized: {
            light: "#fdf6e3",
            dark: "#073642",
            text: { light: "#002b36", dark: "#586e75" }
          },
          dracula: {
            light: "#282a36",
            dark: "#44475a",
            text: { light: "#f8f8f2", dark: "#bd93f9" }
          },
          synthwave: {
            light: "#2d0634",
            dark: "#1a0121",
            text: { light: "#ff77a8", dark: "#f5c5f8" }
          },
          retro: {
            light: "#4A148C",
            dark: "#311B92",
            text: { light: "#FF4081", dark: "#FFEB3B" }
          },
          lava: {
            light: "#FF5722",
            dark: "#4E0000",
            text: { light: "#FF9800", dark: "#D50000" }
          },
          glacier: {
            light: "#E3F2FD",
            dark: "#1565C0",
            text: { light: "#42A5F5", dark: "#81D4FA" }
          },
          pastel: {
            light: "#F5F5F5",
            dark: "#D7CCC8",
            text: { light: "#81D4FA", dark: "#F8BBD0" }
          },
          midnight: {
            light: "#0D47A1",
            dark: "#263238",
            text: { light: "#ffffff", dark: "#B0BEC5" }
          },
          forest: {
            light: "#1B5E20",
            dark: "#003300",
            text: { light: "#A5D6A7", dark: "#5D4037" }
          },
          cyberpunk: {
            light: "#00eaff",
            dark: "#000000",
            text: { light: "#39ff14", dark: "#ff00ff" }
          },
          valentine: {
            light: "#ffcbdb",
            dark: "#d81b60",
            text: { light: "#ff4081", dark: "#880e4f" }
          },
          halloween: {
            light: "#3E2723",
            dark: "#1a0c0c",
            text: { light: "#FF6F00", dark: "#DD2C00" }
          },
          garden: {
            light: "#C8E6C9",
            dark: "#388E3C",
            text: { light: "#4CAF50", dark: "#1B5E20" }
          },
          beach: {
            light: "#ffebcd",
            dark: "#f4a460",
            text: { light: "#ff4500", dark: "#ffa500" }
          },
          aqua: {
            light: "#00FFFF",
            dark: "#008B8B",
            text: { light: "#20B2AA", dark: "#005f5f" }
          },
          lofi: {
            light: "#F5F5F5",
            dark: "#CCCCCC",
            text: { light: "#333333", dark: "#666666" }
          },
          fantasy: {
            light: "#8E44AD",
            dark: "#5E3370",
            text: { light: "#ECF0F1", dark: "#9B59B6" }
          },
          wireframe: {
            light: "#ffffff",
            dark: "#e0e0e0",
            text: { light: "#000000", dark: "#555555" }
          },
          luxury: {
            light: "#D4AF37",
            dark: "#1A1A1D",
            text: { light: "#A67C00", dark: "#FFD700" }
          }
        
      },
      fontFamily: {
        sans: ["Graphik", "sans-serif"],
        serif: ["Merriweather", "serif"],
      },
      borderColor: {
        DEFAULT: "var(--color-neutral-300)",
      },
    },
  },
  plugins: [
    plugin(function ({ addBase, theme }) {
      let allColors = flattenColorPalette(theme("colors"));
      let newVars = Object.fromEntries(
        Object.entries(allColors).map(([key, val]) => [`--color-${key}`, val])
      );

      addBase({
        ":root": newVars,
      });
    }),
    plugin(function({ addUtilities, theme }) {
      const themeUtilities = {};
      
      // Generate theme utility classes
      ['solarized', 'sepia', 'neon', 'dimmed'].forEach(themeName => {
        themeUtilities[`.theme-${themeName}`] = {
          backgroundColor: theme(`colors.${themeName}.light`),
          color: theme(`colors.${themeName}.text.light`),
        };
        
        themeUtilities[`.dark .theme-${themeName}`] = {
          backgroundColor: theme(`colors.${themeName}.dark`),
          color: theme(`colors.${themeName}.text.dark`),
        };
      });
      
      addUtilities(themeUtilities);
    }),
  ],
};