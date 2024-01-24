import { Button  } from "@radix-ui/themes";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/navigation";
import { AuthPageLayout } from "../lib/AuthPageLayout";
import { useAuthFormStatus } from "../lib/useAuthFormStatus";
import { FormContainer, FormError, PasswordField } from "@/components/LoginComponents";

function PasswordUpdatePage({
  email,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const supabaseClient = createClientComponentClient();
  const [formStatus, setFormStatus] = useAuthFormStatus();
  const router = useRouter();

  return (
    <AuthPageLayout title="Enter new password">
      <form
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
        <FormContainer>
          <input
            type="text"
            name="email"
            value={email}
            hidden
            autoComplete="email"
            readOnly
          />

          <PasswordField autoComplete="new-password" />

          {formStatus.status === "error" && (
            <FormError error={formStatus.error.message} />
          )}

          <Button variant="solid" size="3" type="submit">
            Change password
          </Button>
        </FormContainer>
      </form>
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