/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        ink: "#121417",
        steel: "#4b5563",
        lift: "#e23d28",
        recovery: "#2f855a",
        panel: "#f6f7f9",
      },
    },
  },
  plugins: [],
};
