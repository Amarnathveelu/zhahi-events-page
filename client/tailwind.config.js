/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#1a1f35",
          dark: "#111827",
          light: "#252d4a",
        },
        gold: {
          DEFAULT: "#C9A876",
          light: "#DEC9A0",
          dark: "#B08D57",
        },
        ink: "#0E1730",
        indigo: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
        },
        purple: {
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
        },
      },
      fontFamily: {
        display: ['"Bebas Neue"', "sans-serif"],
        heading: ['"Playfair Display"', "serif"],
        body: ['"Poppins"', "sans-serif"],
      },
      boxShadow: {
        card: "0 20px 50px -20px rgba(0, 0, 0, 0.3)",
        goldGlow: "0 0 0 1px rgba(201,168,118,0.3), 0 20px 40px -18px rgba(201,168,118,0.35)",
      },
      backgroundImage: {
        "radial-fade": "radial-gradient(circle at 30% 20%, rgba(108,92,231,0.12), transparent 60%)",
      },
      keyframes: {
        floatSlow: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        spinSlow: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        floatSlow: "floatSlow 6s ease-in-out infinite",
        spinSlow: "spinSlow 40s linear infinite",
      },
    },
  },
  plugins: [],
}
