import { createTailwindcss } from "@mhsdesign/jit-browser-tailwindcss";

export function traverseAndExtractClasses(obj: any): string {
  let result = "";
  function traverse(obj: any) {
    if (Array.isArray(obj)) {
      obj.forEach(traverse);
    } else if (typeof obj === "object" && obj !== null) {
      for (const key in obj) {
        if (key.startsWith("__className") || key.startsWith("tw")) {
          const value = obj[key];
          if (typeof value === "string") {
            result += ` ${value}`;
          } else if (typeof value === "object" || Array.isArray(value)) {
            result += ` ${JSON.stringify(value)}`;
          }
        } else {
          traverse(obj[key]);
        }
      }
    }
  }

  traverse(obj);
  return result;
}

export const tailwind = createTailwindcss({
  tailwindConfig: {
    // disable normalize css
    theme: {
      extend: {
        screens: {
          sm: `568px`,
          md: `768px`,
          lg: `992px`,
          xl: `1280px`,
          "2xl": `1600px`,
        },
      },
    },
    corePlugins: { preflight: false },
  },
});
