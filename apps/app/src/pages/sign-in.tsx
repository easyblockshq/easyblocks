import { SSColors } from "@easyblocks/design-system";
import { Button, TextFieldInput } from "@radix-ui/themes";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { AuthError, SupabaseClient } from "@supabase/supabase-js";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import styled from "styled-components";

function SignInPage() {
  const supabaseClient = createClientComponentClient();

  const [formStatus, setFormStatus] = useState<
    | { status: "idle"; error: null }
    | { status: "loading"; error: null }
    | { status: "error"; error: AuthError }
  >({
    status: "idle",
    error: null,
  });

  const router = useRouter();

  return (
    <div
      css={`
        position: fixed;
        inset: 0;
        display: grid;
        place-items: center;
      `}
    >
      <div
        css={`
          max-width: 332px;
          width: 100%;
          color: #000;
          font-size: 16px;
        `}
      >
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
          <FormTitle>Log in to Easyblocks</FormTitle>

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

            <PasswordField autoComplete="current-password" />

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
            Log in
          </Button>

          <FormSecondaryActions>
            <FormLink href="/reset-password">Reset password</FormLink>
            <div>
              No account? <FormLink href="/sign-up">Create one</FormLink>
            </div>
          </FormSecondaryActions>
        </Form>
      </div>
    </div>
  );
}

export default SignInPage;

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

function GoogleSignInButton(props: {
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
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
        width="21px"
        height="21px"
      >
        <path
          fill="#FFC107"
          d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
        ></path>
        <path
          fill="#FF3D00"
          d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
        ></path>
        <path
          fill="#4CAF50"
          d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
        ></path>
        <path
          fill="#1976D2"
          d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
        ></path>
      </svg>
      Continue with Google
    </Button>
  );
}
