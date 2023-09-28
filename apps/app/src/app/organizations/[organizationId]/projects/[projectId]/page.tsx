import { Database } from "@/infrastructure/supabaseSchema";
import { Button, Container, Flex, Heading, Text } from "@radix-ui/themes";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CopyTextToClipboardButton } from "./copy-text-to-clipboard-button";
import { GenerateAccessTokenButton } from "./generate-access-token-button";

async function ProjectPage({
  params,
}: {
  params: { organizationId: string; projectId: string };
}) {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/sign-in");
  }

  const projectQueryResult = await supabase
    .from("projects")
    .select("id, name, tokens")
    .match({
      organization_id: params.organizationId,
      id: params.projectId,
    });

  if (!projectQueryResult.data || projectQueryResult.data.length === 0) {
    notFound();
  }

  const project = projectQueryResult.data[0];

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

function maskToken(token: string) {
  return `${token.slice(0, 8)}...${token.slice(-8)}`;
}

export const dynamic = "force-dynamic";
