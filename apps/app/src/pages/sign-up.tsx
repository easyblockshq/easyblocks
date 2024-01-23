import { Button, TextFieldInput, Link } from "@radix-ui/themes";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Fragment, useState } from "react";
import { AuthPageLayout } from "../lib/AuthPageLayout";
import { GoogleSignInButton } from "../lib/GoogleSignInButton";
import { useAuthFormStatus } from "../lib/useAuthFormStatus";
import {
  EmailAddressField,
  FormContainer,
  FormError,
  OrSeparator,
  PasswordField,
} from "@/components/LoginComponents";

function SignUpPage() {
  const supabaseClient = createClientComponentClient();
  const [formStatus, setFormStatus] = useAuthFormStatus();
  const [email, setEmail] = useState("");

  return (
    <AuthPageLayout
      title={
        formStatus.status === "success"
          ? "Check your inbox"
          : "Sign up to Easyblocks"
      }
    >
      <form
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
            .signUp({
              email,
              password,
              options: {
                emailRedirectTo: `${window.location.origin}/api/auth/confirm`,
              },
            })
            .then((authResponse) => {
              if (authResponse.error) {
                setFormStatus({
                  status: "error",
                  error: authResponse.error,
                });
                return;
              }

              setFormStatus({
                status: "success",
                error: null,
              });

              setEmail(email);
            });
        }}
      >
        {formStatus.status !== "success" && (
          <Fragment>
            <FormContainer>
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

              <EmailAddressField />

              <PasswordField autoComplete="new-password" />

              {formStatus.status === "error" && (
                <FormError error={formStatus.error.message} />
              )}

              <Button
                size="3"
                type="submit"
                disabled={formStatus.status === "loading"}
              >
                Create account
              </Button>
            </FormContainer>

            <div className="text-xs text-center mt-2">
              By joining, you agree to our{" "}
              <Link
                href="https://www.shopstory.app/terms-of-service"
                target="_blank"
                rel="noopener noreferrer"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="https://www.shopstory.app/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </Link>
            </div>

            <div className="text-center mt-5">
              Already have an account? <Link href="/sign-in">Log in</Link>
            </div>
          </Fragment>
        )}

        {formStatus.status === "success" && (
          <div className="text-md text-center mb-8">
            Click on the link we sent to to finish your account setup.
          </div>
        )}
      </form>
    </AuthPageLayout>
  );
}

export default SignUpPage;
