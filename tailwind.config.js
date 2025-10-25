/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#00FF9D",
        danger: "#FF4C4C",
        bgDark: "#000000",
        textWhite: "#FFFFFF",
      },
      fontFamily: {
        sans: ["SF Pro Display", "Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
}