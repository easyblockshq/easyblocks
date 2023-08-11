import toast, { Toaster } from "react-hot-toast";
import { SSFonts } from "./fonts";

export { Toaster };

export function useToaster() {
  const style = {
    borderRadius: "4px",
    ...SSFonts.body,
  };

  return {
    notify: (message: string) => {
      toast(message, {
        style,
      });
    },
    success: (message: string, options: { duration?: number } = {}) => {
      toast.success(message, {
        style,
        duration: options.duration,
      });
    },
    error: (message: string) => {
      toast.error(message, {
        style,
      });
    },
  };
}
