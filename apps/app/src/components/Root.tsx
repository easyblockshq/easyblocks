import { Button } from "@radix-ui/themes";
import { Container } from "./Container";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/router";
import { ExitIcon } from "@radix-ui/react-icons";

type RootProps = {
  children: React.ReactNode | React.ReactNode[];
};

export function Root(props: RootProps) {
  const supabaseClient = createClientComponentClient();
  const router = useRouter();

  return (
    <div>
      <div className="border-b mb-12">
        <Container>
          <div className="flex items-center space-x-0 h-12 justify-between">
            <div>EASYBLOCKS</div>
            <Button
              variant="ghost"
              onClick={() => {
                supabaseClient.auth.signOut().then(() => {
                  router.push("/sign-in");
                });
              }}
            >
              Logout <ExitIcon />
            </Button>
          </div>
        </Container>
      </div>

      <Container>{props.children}</Container>
    </div>
  );
}
