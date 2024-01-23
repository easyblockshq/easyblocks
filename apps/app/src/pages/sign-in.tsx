import { Colors } from "@easyblocks/design-system";
import { Button, TextFieldInput } from "@radix-ui/themes";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import { useRouter } from "next/router";
import styled from "styled-components";
import { AuthPageLayout } from "../lib/AuthPageLayout";
import { useAuthFormStatus } from "../lib/useAuthFormStatus";
import { GoogleSignInButton } from "../lib/GoogleSignInButton";

function SignInPage() {
  const supabaseClient = createClientComponentClient();
  const [formStatus, setFormStatus] = useAuthFormStatus();
  const router = useRouter();

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
    </AuthPageLayout>
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
        color: ${Colors.red};
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
