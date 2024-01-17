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
      'rock-400': '#1a1b20',
      'rock-200': '#2d2e33',
      'text': '#dedede',
      'text-secondary': '#d0d0d0',
      'text-disabled': '#777777',
      'text-header': '#ffffff',
      'rock-100': '#4e536e',
      'rock-300': '#26282e',
      ...colors
    }
  },
  plugins: [],
}