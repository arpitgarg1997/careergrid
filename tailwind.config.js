/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#EBF4FF",
          100: "#D6E8FF",
          200: "#ADC8FF",
          300: "#6B9CFF",
          400: "#3B7DFF",
          500: "#1E3A5F",
          600: "#1A3354",
          700: "#152B47",
          800: "#0F1F33",
          900: "#0A1520",
        },
        accent: {
          50: "#ECFDF5",
          100: "#D1FAE5",
          200: "#A7F3D0",
          300: "#6EE7B7",
          400: "#34D399",
          500: "#10B981",
          600: "#059669",
          700: "#047857",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
