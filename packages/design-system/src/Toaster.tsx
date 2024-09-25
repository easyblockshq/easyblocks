import toast from "react-hot-toast";

import { Fonts } from "./fonts";

export { Toaster } from "react-hot-toast";

const style = {
  borderRadius: "4px",
  ...Fonts.body,
};

const toaster = Object.freeze({
  notify(message: string) {
    toast(message, {
      style,
    });
  },
  success(message: string, options: { duration?: number } = {}) {
    toast.success(message, {
      style,
      duration: options.duration,
    });
  },
  error(message: string) {
    toast.error(message, {
      style,
    });
  },
});

export function useToaster() {
  return toaster;
}
