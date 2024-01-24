import { Button } from "@radix-ui/themes";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Fragment, useState } from "react";
import { AuthPageLayout } from "../lib/AuthPageLayout";
import { useAuthFormStatus } from "../lib/useAuthFormStatus";
import {
  EmailAddressField,
  FormContainer,
  FormError,
} from "@/components/LoginComponents";

function PasswordResetPage() {
  const supabaseClient = createClientComponentClient();
  const [formStatus, setFormStatus] = useAuthFormStatus();
  const [email, setEmail] = useState("");

  return (
    <AuthPageLayout
      title={
        formStatus.status === "success" ? "Check your inbox" : "Reset password"
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

          supabaseClient.auth
            .resetPasswordForEmail(email, {
              redirectTo: `${window.location.origin}/update-password?email=${email}`,
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
              <EmailAddressField />

              {formStatus.status === "error" && (
                <FormError error={formStatus.error.message} />
              )}

              <Button
                type="submit"
                variant="solid"
                size="3"
                disabled={formStatus.status === "loading"}
              >
                Reset password
              </Button>
            </FormContainer>
          </Fragment>
        )}

        {formStatus.status === "success" && (
          <div className="text-md text-center mb-8">
            If an account exists for <span className="underline">{email}</span>,
            you will get an email with instructions on resetting your password.
            If it doesn&apos;t arrive, be sure to check your spam folder.
          </div>
        )}
      </form>
    </AuthPageLayout>
  );
}

export default PasswordResetPage;
