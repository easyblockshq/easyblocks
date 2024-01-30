import { AuthError } from "@supabase/supabase-js";
import { useState } from "react";

function useAuthFormStatus() {
  const formState = useState<
    | { status: "idle"; error: null }
    | { status: "loading"; error: null }
    | { status: "success"; error: null }
    | { status: "error"; error: AuthError }
  >({
    status: "idle",
    error: null,
  });

  return formState;
}

export { useAuthFormStatus };
