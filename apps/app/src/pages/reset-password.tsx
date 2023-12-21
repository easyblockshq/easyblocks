import { SSColors, Stack } from "@easyblocks/design-system";
import { Button, TextFieldInput } from "@radix-ui/themes";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import { Fragment, useState } from "react";
import styled from "styled-components";
import { AuthPageLayout } from "../lib/AuthPageLayout";
import { useAuthFormStatus } from "../lib/useAuthFormStatus";
import { GmailIcon, OutlookIcon } from "../lib/icons";

function PasswordResetPage() {
  const supabaseClient = createClientComponentClient();
  const [formStatus, setFormStatus] = useAuthFormStatus();
  const [email, setEmail] = useState("");

  return (
    <AuthPageLayout>
      <Form
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
            <FormTitle>Enter your email to reset password</FormTitle>

            <FormBody>
              <EmailAddressField />

              {formStatus.status === "error" && (
                <FormError error={formStatus.error.message} />
              )}
            </FormBody>

            <Button
              type="submit"
              variant="solid"
              size="3"
              disabled={formStatus.status === "loading"}
            >
              Reset password
            </Button>

            <FormSecondaryActions>
              <FormLink href="/sign-up">Cancel</FormLink>
            </FormSecondaryActions>
          </Fragment>
        )}

        {formStatus.status === "success" && (
          <Fragment>
            <Stack gap={24}>
              <FormTitle>Check your inbox</FormTitle>

              <div
                css={`
                  line-height: 1.4;
                `}
              >
                If an account exists for {email}, you will get an email with
                instructions on resetting your password. If it doesn&apos;t
                arrive, be sure to check your spam folder.
              </div>
            </Stack>

            <Stack gap={24}>
              <Button type="submit" variant="outline" size="3" asChild>
                <Link
                  href="https://mail.google.com/mail/u/0/"
                  target="_blank"
                  rel="noopener nofollow noreferrer"
                >
                  <GmailIcon />
                  Open Gmail
                </Link>
              </Button>

              <Button type="submit" variant="outline" size="3" asChild>
                <Link
                  href="https://outlook.live.com/mail/0/inbox"
                  target="_blank"
                  rel="noopener nofollow noreferrer"
                >
                  <OutlookIcon />
                  Open Outlook
                </Link>
              </Button>
            </Stack>
          </Fragment>
        )}
      </Form>
    </AuthPageLayout>
  );
}

export default PasswordResetPage;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 44px;
`;

const FormTitle = styled.h2`
  font-size: 24px;
  line-height: 1.16;
  color: #000;
  text-align: center;
`;

const FormBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const FormSecondaryActions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
`;

const FormLink = styled(Link)`
  color: #0b75f0;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }

  &:visited {
    color: #0b75f0;
  }
`;

function FormError(props: { error: string }) {
  return (
    <div
      css={`
        color: ${SSColors.red};
      `}
    >
      {props.error}
    </div>
  );
}

function EmailAddressField() {
  return (
    <TextFieldInput
      size="3"
      name="email"
      autoComplete="email"
      placeholder="Email"
      aria-label="Email"
    />
  );
}
