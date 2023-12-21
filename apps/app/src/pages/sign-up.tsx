import { SSColors, Stack } from "@easyblocks/design-system";
import { Button, TextFieldInput } from "@radix-ui/themes";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import { Fragment, useState } from "react";
import styled from "styled-components";
import { AuthPageLayout } from "../lib/AuthPageLayout";
import { GoogleSignInButton } from "../lib/GoogleSignInButton";
import { GmailIcon, OutlookIcon } from "../lib/icons";
import { useAuthFormStatus } from "../lib/useAuthFormStatus";

function SignUpPage() {
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
            <FormTitle>Create your Easyblocks account</FormTitle>

            <FormBody>
              <GoogleSignInButton
                supabaseClient={supabaseClient}
                onSignInError={(error) => {
                  setFormStatus({
                    status: "error",
                    error,
                  });
                }}
              />

              <SocialAndEmailProvidersSeparator />

              <EmailAddressField />

              <PasswordField autoComplete="new-password" />

              {formStatus.status === "error" && (
                <FormError error={formStatus.error.message} />
              )}
            </FormBody>

            <Stack gap={24}>
              <Button
                size="3"
                type="submit"
                disabled={formStatus.status === "loading"}
              >
                Create account
              </Button>

              <div
                css={`
                  font-size: 12px;
                  line-height: 1.4;
                  color: #999999;
                  text-align: center;

                  & a {
                    color: #333333;
                    text-underline: none;

                    &:visited {
                      color: #333333;
                    }
                  }
                `}
              >
                By joining, you agree to our{" "}
                <a
                  href="https://www.shopstory.app/terms-of-service"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="https://www.shopstory.app/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </a>
              </div>
            </Stack>

            <FormSecondaryActions>
              <div>
                Already have an account?{" "}
                <FormLink href="/sign-in">Login</FormLink>
              </div>
            </FormSecondaryActions>
          </Fragment>
        )}

        {formStatus.status === "success" && (
          <Fragment>
            <Stack gap={24}>
              <FormTitle>Check your inbox</FormTitle>

              <div
                css={`
                  text-align: center;
                `}
              >
                Click on the link we sent to{" "}
                <span
                  css={`
                    font-weight: 700;
                  `}
                >
                  {email}
                </span>{" "}
                to finish your account setup.
              </div>
            </Stack>

            <Stack gap={24}>
              <Button
                variant="outline"
                size="3"
                type="button"
                style={{ width: "100%" }}
                asChild
              >
                <a
                  href="https://mail.google.com/mail/u/0/"
                  target="_blank"
                  rel="noopener nofollow noreferrer"
                >
                  <GmailIcon />
                  Open Gmail
                </a>
              </Button>

              <Button
                variant="outline"
                size="3"
                type="button"
                style={{ width: "100%" }}
                asChild
              >
                <a
                  href="https://outlook.live.com/mail/0/inbox"
                  target="_blank"
                  rel="noopener nofollow noreferrer"
                >
                  <OutlookIcon />
                  Open Outlook
                </a>
              </Button>
            </Stack>

            <div>Can&apos;t find your email? Check your spam folder!</div>
          </Fragment>
        )}
      </Form>
    </AuthPageLayout>
  );
}

export default SignUpPage;

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

function PasswordField(props: {
  autoComplete: "current-password" | "new-password";
}) {
  return (
    <TextFieldInput
      size="3"
      name="password"
      autoComplete={props.autoComplete}
      type="password"
      placeholder="Password"
      aria-label="Password"
    />
  );
}

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

function SocialAndEmailProvidersSeparator() {
  return (
    <div
      css={`
        font-size: 16;
        line-height: 1.16;
        text-align: center;
        color: #999;
      `}
    >
      or
    </div>
  );
}
