/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      keyframes: {
        "scale-bounce": {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" },
          "100%": { transform: "scale(1.03)" },
        },
      },
      animation: {
        "scale-bounce": "scale-bounce 0.6s ease-in-out 2",
      },
      screens: {
        touch: { raw: "(pointer: coarse)" },
      },
    },
  },
  plugins: [],
};
