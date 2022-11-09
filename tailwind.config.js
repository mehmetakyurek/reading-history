/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors")
module.exports = {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {},
    colors: {
      "border-color": "#1A1D24",
      "disabled": "#9f9f9f",
      "transparent": "transparent",
      ...colors
    }
  },
  plugins: [],
}
