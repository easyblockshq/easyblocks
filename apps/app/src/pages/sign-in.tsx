import { Button, Link } from "@radix-ui/themes";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { AuthPageLayout } from "../lib/AuthPageLayout";
import { useAuthFormStatus } from "../lib/useAuthFormStatus";
import { GoogleSignInButton } from "../lib/GoogleSignInButton";
import {
  EmailAddressField,
  PasswordField,
  FormError,
  OrSeparator,
  FormContainer,
} from "@/components/LoginComponents";

function SignInPage() {
  const supabaseClient = createClientComponentClient();
  const [formStatus, setFormStatus] = useAuthFormStatus();
  const router = useRouter();

  return (
    <AuthPageLayout title="Log in to Easyblocks">
      <form
        className="flex flex-col items-stretch"
        onSubmit={(event) => {
          event.preventDefault();

          setFormStatus({
            status: "loading",
            error: null,
          });

          const formData = new FormData(event.target as HTMLFormElement);
          const email = formData.get("email") as string;
          const password = formData.get("password") as string;

          supabaseClient.auth
            .signInWithPassword({ email, password })
            .then((authResponse) => {
              if (authResponse.error) {
                setFormStatus({
                  status: "error",
                  error: authResponse.error,
                });
                return;
              }

              router.replace("/");
            });
        }}
      >
        <GoogleSignInButton
          supabaseClient={supabaseClient}
          onSignInError={(error) => {
            setFormStatus({
              status: "error",
              error,
            });
          }}
        />

        <OrSeparator />

        <FormContainer>
          <EmailAddressField />
          <PasswordField autoComplete="current-password" />

          {formStatus.status === "error" && (
            <FormError error={formStatus.error.message} />
          )}

          <Button
            type="submit"
            variant="solid"
            size="3"
            disabled={formStatus.status === "loading"}
          >
            Log in
          </Button>

          <Link href="/reset-password" className="text-center mb-3">
            Reset password
          </Link>

          <div className="text-center">
            No account? <Link href="/sign-up">Create one</Link>
          </div>
        </FormContainer>
      </form>
    </AuthPageLayout>
  );
}

export default SignInPage;
