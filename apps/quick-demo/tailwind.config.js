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
    },
    fontFamily: {
      sans: ["test-national-2", "sans-serif"],
      serif: ["serif"],
      mono: ["test-soehne-mono"],
    },
  },
  plugins: [],
};
