import {
  Button,
  Card,
  Container,
  Flex,
  Grid,
  Heading,
  Text,
} from "@radix-ui/themes";
import {
  createClientComponentClient,
  createPagesServerClient,
} from "@supabase/auth-helpers-nextjs";
import { AuthSession } from "@supabase/supabase-js";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import NextLink from "next/link";
import { Database } from "../infrastructure/supabaseSchema";
import { FileTextIcon, LockClosedIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";

function HomePage({
  user,
  projects,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const supabaseClient = createClientComponentClient();
  const router = useRouter();

  return (
    <Container>
      <Flex justify="between" align="center">
        <Heading as="h1" size="8" mb="5">
          Hi {user.email}
        </Heading>
        <Button
          variant="ghost"
          onClick={() => {
            supabaseClient.auth.signOut().then(() => {
              router.push("/sign-in");
            });
          }}
        >
          Logout
        </Button>
      </Flex>
      <Heading as="h2" size="5" mb={"3"}>
        Your projects
      </Heading>
      <Grid columns={"3"} gap="3">
        {projects.map((p) => {
          return (
            <Card key={p.id} size="2" asChild>
              <NextLink href={`/projects/${p.id}`}>
                <Heading as="h3" size="4" mb="2">
                  {p.name}
                </Heading>
                <Flex gap="2">
                  <Text size="2" color="gray">
                    <Flex align={"center"} gap="1">
                      <FileTextIcon />
                      {p.documentsCount} document
                      {p.documentsCount > 1 || p.documentsCount === 0
                        ? "s"
                        : ""}
                    </Flex>
                  </Text>
                  <Text size="2" color="gray">
                    <Flex align={"center"} gap="1">
                      <LockClosedIcon />
                      {p.tokensCount} token
                      {p.tokensCount > 1 || p.tokensCount === 0 ? "s" : ""}
                    </Flex>
                  </Text>
                </Flex>
              </NextLink>
            </Card>
          );
        })}
        <Card size="2">
          <Flex justify={"center"} align={"center"} height={"100%"}>
            <Text align={"center"}>
              To add more projects, <br />
              please contact us.
            </Text>
          </Flex>
        </Card>
      </Grid>
    </Container>
  );
}

export default HomePage;

export const getServerSideProps: GetServerSideProps<{
  user: AuthSession["user"];
  projects: Array<{
    id: string;
    name: string;
    tokensCount: number;
    documentsCount: number;
  }>;
}> = async (ctx) => {
  const supabase = createPagesServerClient<Database>(ctx);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return {
      redirect: {
        destination: "/sign-in",
        permanent: false,
      },
    };
  }

  const organizations = await supabase
    .from("organizations")
    .select("id, name, projects(id, name, tokens)");

  const documents = await supabase
    .from("documents")
    .select("id, project_id")
    .in(
      "project_id",
      organizations.data?.flatMap((o) => o.projects.map((p) => p.id)) ?? []
    );

  return {
    props: {
      user: session.user,
      projects:
        organizations.data?.flatMap((o) => {
          return o.projects.map((p) => {
            return {
              id: p.id,
              name: p.name,
              tokensCount: p.tokens.length,
              documentsCount:
                documents.data?.filter((d) => d.project_id === p.id).length ??
                0,
            };
          });
        }) ?? [],
    },
  };
};
