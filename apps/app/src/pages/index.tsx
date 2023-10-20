import { Card, Container, Flex, Heading } from "@radix-ui/themes";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import NextLink from "next/link";
import { Fragment } from "react";

function HomePage({
  user,
  organizations,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <Container>
      <Flex justify="between" align="center">
        <Heading as="h1" size="8" mb="4">
          Hi {user.email}
        </Heading>
      </Flex>
      {organizations.map((o) => {
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

export const getServerSideProps: GetServerSideProps = async (ctx) => {
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

  const organizations = await supabase
    .from("organizations")
    .select("id, name, projects(id, name)");

  return {
    props: {
      user: session.user,
      organizations: organizations.data ?? [],
    },
  };
};
