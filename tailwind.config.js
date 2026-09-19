/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-outfit)", "system-ui", "sans-serif"],
        chalk: ["var(--font-caveat)", "cursive"],
      },
      colors: {
        tealGreen: {
          primary: "#005F56",
          accent: "#0D7A70",
          bright: "#00A896",
          lightBg: "#F0FDF4",
          border: "#86EFAC"
        },
        royalRed: {
          primary: "#8B0000",
          accent: "#A71D2A",
          deep: "#680000",
          lightBg: "#FFF1F2",
          border: "#FDA4AF"
        },
        earthyBrown: {
          primary: "#4A3525",
          accent: "#6D4C41",
          darkWood: "#3D2B1F",
          lightBg: "#FEF3C7",
          border: "#D97706"
        }
      }
    },
  },
  plugins: [],
};
