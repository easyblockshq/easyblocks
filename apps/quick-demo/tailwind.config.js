/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
    colors: {
      "black-1": "#252525",
      "black-2": "#4f4f4f",
      "white-1": "#f9f8f3",
      "white-2": "#bdbdbd",
      beige: "#f1f0ea",
      "grey-1": "#a0a09d",
      "grey-2": "#4F4F4F",
      "neutral-50": "#fafafa",
      "neutral-100": "#f5f5f5",
      "neutral-200": "#e5e5e5",
      "neutral-300": "#d4d4d4",
      "neutral-400": "#a3a3a3",
      "neutral-500": "#737373",
      "neutral-600": "#525252",
      "neutral-700": "#404040",
      "neutral-800": "#262626",
      "neutral-900": "#171717",
      "neutral-950": "#0a0a0a",
    },
    fontFamily: {
      sans: ["test-national-2", "sans-serif"],
      serif: ["serif"],
      mono: ["test-soehne-mono"],
    },
  },
  plugins: [],
};
