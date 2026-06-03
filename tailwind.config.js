/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        ink: "#070907",
        steel: "#5f6b5d",
        lift: "#b7f34b",
        recovery: "#8fdc3f",
        panel: "#eef7df",
      },
    },
  },
  plugins: [],
};
