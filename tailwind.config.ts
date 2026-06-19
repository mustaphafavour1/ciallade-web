import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'nature-brown': '#CE8400',
        'dark-wood': '#1C1004',
        'coffee-brown': '#75492B',
        'maroon-brown': '#7C1C12',
        'ochre-brown': '#CC7722',
        'almond-cream': '#FFEBCD',
        'autumn-orange': '#FE7017',
      },
      fontFamily: {
        display: ['Argue', 'serif'],
        body: ['Plus Jakarta Sans', 'sans-serif'],
      },
      fontSize: {
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
        '10xl': ['10rem', { lineHeight: '0.9' }],
      },
    },
  },
  plugins: [],
};
export default config;
