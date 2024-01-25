import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      xs: "568px",
      sm: "768px",
      md: "992px",
      lg: "1280px",
      xl: "1600px",
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
export default config;
