import { Box, Card, Container, Flex, Heading } from "@radix-ui/themes";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import NextLink from "next/link";
import { redirect } from "next/navigation";
import { Fragment } from "react";
import { Database } from "../infrastructure/supabaseSchema";

async function HomePage() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/sign-in");
  }

  const organizations = await supabase
    .from("organizations")
    .select("id, name, projects(id, name)");

  return (
    <Container>
      <Flex justify="between" align="center">
        <Heading as="h1" size="8" mb="4">
          Hi {session.user.email}
        </Heading>
      </Flex>
      {organizations.data?.map((o) => {
        return (
          <Fragment key={o.id}>
            <Heading as="h2" size="4" mb="2">
              {o.name}
            </Heading>
            {o.projects.map((p) => {
              return (
                <Card key={p.id} asChild>
                  <NextLink href={`/organizations/${o.id}/projects/${p.id}`}>
                    {p.name}
                  </NextLink>
                </Card>
              );
            })}
          </Fragment>
        );
      }) ?? null}
    </Container>
  );
}

export default HomePage;
