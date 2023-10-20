import { Database } from "@/infrastructure/supabaseSchema";
import { Button, Container, Flex, Heading, Text } from "@radix-ui/themes";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { useRouter } from "next/router";

function ProjectPage({
  project,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <Container>
      <Heading as="h1">
        <Flex gap="2" align="center" mb="1">
          {project.name}&nbsp;
          <Button variant="ghost" asChild>
            <Link href="/">Back</Link>
          </Button>
        </Flex>
        <Flex gap="2" align="center" mb="4">
          <Text size="1" color="gray">
            {project.id}&nbsp;
          </Text>
          <CopyTextToClipboardButton text={project.id} />
        </Flex>
      </Heading>
      <Heading as="h2" mb="1">
        Tokens
      </Heading>
      {project.tokens.map((token) => {
        return (
          <Flex key={token} gap="3" align="center" mb="2">
            <Text>{maskToken(token)}</Text>
            <CopyTextToClipboardButton text={token} />
          </Flex>
        );
      })}
      <GenerateAccessTokenButton projectId={project.id} />
    </Container>
  );
}

export default ProjectPage;

export const getServerSideProps: GetServerSideProps<
  {
    project: Pick<
      Database["public"]["Tables"]["projects"]["Row"],
      "id" | "name" | "tokens"
    >;
  },
  { organizationId: string; projectId: string }
> = async (ctx) => {
  const supabase = createPagesServerClient(ctx);

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

  const projectQueryResult = await supabase
    .from("projects")
    .select("id, name, tokens")
    .match({
      organization_id: ctx.params!.organizationId,
      id: ctx.params!.projectId,
    });

  if (!projectQueryResult.data || projectQueryResult.data.length === 0) {
    return {
      notFound: true,
    };
  }

  const project = projectQueryResult.data[0];

  return {
    props: {
      project,
    },
  };
};

function maskToken(token: string) {
  return `${token.slice(0, 8)}...${token.slice(-8)}`;
}

function CopyTextToClipboardButton({ text }: { text: string }) {
  return (
    <Button
      variant="ghost"
      onClick={() => {
        window.navigator.clipboard.writeText(text).then(() => {
          alert("Copied to clipboard");
        });
      }}
    >
      Copy
    </Button>
  );
}

function GenerateAccessTokenButton({ projectId }: { projectId: string }) {
  const router = useRouter();

  return (
    <Button
      variant="outline"
      onClick={() => {
        fetch(`/api/projects/${projectId}/tokens`, {
          method: "POST",
        }).then((res) => {
          if (res.ok) {
            router.reload();
          }
        });
      }}
    >
      Generate new access token
    </Button>
  );
}
