import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#111827',
        accent: '#3b82f6',
        success: '#22c55e',
        warn: '#f59e0b',
        danger: '#ef4444',
      },
      boxShadow: {
        card: '0 6px 20px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
}

export default config
