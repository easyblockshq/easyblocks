import { Button } from "@radix-ui/themes";
import { AuthError, SupabaseClient } from "@supabase/supabase-js";
import { GoogleIcon } from "./icons";

export function GoogleSignInButton(props: {
  supabaseClient: SupabaseClient;
  onSignInError: (error: AuthError) => void;
}) {
  return (
    <Button
      variant="outline"
      size="3"
      type="button"
      onClick={() => {
        props.supabaseClient.auth
          .signInWithOAuth({
            provider: "google",
            options: {
              ...(process.env.NODE_ENV === "development" && {
                queryParams: {
                  access_type: "offline",
                  prompt: "consent",
                },
              }),
            },
          })
          .then((authResponse) => {
            if (authResponse.error) {
              props.onSignInError(authResponse.error);
              return;
            }
          });
      }}
    >
      <GoogleIcon />
      Continue with Google
    </Button>
  );
}
