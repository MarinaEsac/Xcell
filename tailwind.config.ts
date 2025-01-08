import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    // Uncomment below line if you want to include all JS/TS files recursively
    // "./**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        "dark-green": "#00292d",
        "dark-blue": "#00222e",
      },
      backgroundImage: {
        custom: "url('/background.svg')",
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'], 
      },
    },
  },
  plugins: [],
};

export default config;
