import { Colors } from "@easyblocks/design-system";
import { Button, Flex, TextFieldInput } from "@radix-ui/themes";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import { AuthPageLayout } from "../lib/AuthPageLayout";
import { useAuthFormStatus } from "../lib/useAuthFormStatus";

function PasswordUpdatePage({
  email,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
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
          const password = formData.get("password") as string;

          supabaseClient.auth
            .updateUser({
              password,
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

              router.replace("/");
            });
        }}
      >
        <FormTitle>Enter your new password</FormTitle>

        <Flex direction={"column"} gap="6">
          <input
            type="text"
            name="email"
            value={email}
            hidden
            autoComplete="email"
            readOnly
          />

          <TextFieldInput
            name="password"
            autoComplete="new-password"
            type="password"
            placeholder="Password"
            aria-label="Password"
          />

          {formStatus.status === "error" && (
            <FormError error={formStatus.error.message} />
          )}
        </Flex>

        <Button variant="solid" size="3" type="submit">
          Change password
        </Button>
      </Form>
    </AuthPageLayout>
  );
}

export default PasswordUpdatePage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const email = ctx.query.email as string;

  return {
    props: {
      email,
    },
  };
};

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
