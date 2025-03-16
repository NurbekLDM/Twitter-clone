import { default as flattenColorPalette } from "tailwindcss/lib/util/flattenColorPalette";

/** @type {import('tailwindcss').Config} */
module.exports = {
   dark: 'class',
 content: ["./src/**/*.{ts,tsx}"],
  theme: {
    
    colors: {
      'blue': '#1fb6ff',
      'red': '#ff4949',
      'purple': '#7e5bef',
      'pink': '#ff49db',
      'orange': '#ff7849',
      'green': '#13ce66',
      'green-300': '#a7f3d0',
      'green-600': '#0fae9b',
      'green-700': '#0c8b7f',
      'green-800': '#0a6e67',
      'green-900': '#044e42',
      'yellow-400': '#ffea00',
      'yellow-500': '#ffc800',
      'yellow-600': '#ffab00',
      'yellow-700': '#ff8a00',
      'yellow-800': '#ff6a00',
      'yellow': '#ffc82c',
      'gray-dark': '#273444',
      'gray': '#8492a6',
      'gradient-to-br': 'linear-gradient(to bottom right, var(--tw-gradient-stops))',
      'gradient-to-bl': 'linear-gradient(to bottom left, var(--tw-gradient-stops))',
      'pointer': 'pointer',
      'opacity-0': '0',
      'group-hover': 'group-hover',
      'gray-900': '#1a202c',
      'gray-800': '#2d3748',
      'gray-700': '#4a5568',
      'gray-600': '#718096',
      'gray-500': '#a0aec0',
      'gray-light': '#d3dce6',
      'blur': 'rgba(37, 44, 54, 0.8)',
      'dark-blur': 'rgba(37, 44, 54, 0.96)',
      'transparent': 'transparent',
      'current': 'currentColor',
      'white': '#ffffff',
      'black': '#000000',
      'neutral-300': '#e2e8f0',
      'neutral-400': '#cbd5e0',
      'neutral-500': '#a0aec0',
      'neutral-600': '#718096',
      'neutral-700': '#4a5568',
      'neutral-800': '#2d3748',
      'neutral-900': '#1a202c',
      'xl': '1.5rem',
      '2xl': '1.75rem',
      '3xl': '2rem',
      '4xl': '2.25rem',
      '5xl': '2.5rem',
      'border': '1px solid var(--color-neutral-300)',


    },
    fontFamily: {
      sans: ['Graphik', 'sans-serif'],
      serif: ['Merriweather', 'serif'],
    },
    extend: {},
  },
  plugins: [addVariablesForColors],
}

function addVariablesForColors({ addBase, theme }: any) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );
 
  addBase({
    ":root": newVars,
  });
}
