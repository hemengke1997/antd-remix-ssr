import type { Config } from 'tailwindcss'

const config = {
  darkMode: ['selector', '[data-theme="dark"]'],
  content: ['./components/**/*.{ts,tsx}', './app/**/*.{ts,tsx}'],
  theme: {
    // PC first
    screens: {
      desktop: {
        max: '1280px',
      },
      // => @media (max-width: 1280px) { ... }

      laptop: {
        max: '1024px',
      },
      // => @media (max-width: 1024px) { ... }

      tablet: {
        max: '640px',
      },
      // => @media (max-width: 640px) { ... }
    },
  },
  important: '#body',
  presets: [require('tailwind-antd-preset')],
  plugins: [require('tailwindcss-animate')],
  corePlugins: {
    preflight: false,
  },
} as Config

export default config
