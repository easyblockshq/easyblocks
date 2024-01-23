import {
  FileTextIcon,
  LockClosedIcon,
  PlusIcon,
  ExitIcon,
} from "@radix-ui/react-icons";
import {
  AlertDialog,
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Text,
  Link,
} from "@radix-ui/themes";
import {
  createClientComponentClient,
  createPagesServerClient,
} from "@supabase/auth-helpers-nextjs";
import { AuthSession } from "@supabase/supabase-js";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Database } from "../infrastructure/supabaseSchema";
import { Container } from "@/components/Container";
import { ProjectCard } from "@/components/Card";
import { Root } from "@/components/Root";

function HomePage({
  user,
  projects,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const code = searchParams.get("code");

  useEffect(() => {
    // If we sign in with Google, we get redirected with search param code that's exchanged for a session
    // After that, we should remove the code to prevent error when someone refreshes the page with already used code.
    if (code !== null) {
      router.replace("/");
    }
  }, [code, router]);

  return (
    <Root>
      <div className="mb-5 font-sans text-2xl font-semibold">
        Hello {user.email}!
      </div>

      <p className="max-w-lg text-sm text-slate-500">
        Welcome to Easyblocks. In this panel you can manage your projects, each
        project is a storage and version control for your documents. Easyblocks
        is open-source so you can build your own backend if you want, however,
        it's the simplest way to start. Enjoy!
      </p>

      <div className="mt-12 mb-6 flex flex-row gap-2 items-center justify-between">
        <div className=" font-sans text-2xl font-semibold">Your projects</div>

        <AlertDialog.Root>
          <AlertDialog.Trigger>
            <Button size={"2"} onClick={() => {}}>
              <PlusIcon />
              New project
            </Button>
          </AlertDialog.Trigger>

          <AlertDialog.Content style={{ maxWidth: 450 }}>
            <AlertDialog.Title>Upsss, sorry!</AlertDialog.Title>
            <AlertDialog.Description size="2">
              This is an early version of Easyblocks panel and adding new
              projects is not yet supported. If you want more projects, contact
              us via email, we'll handle it:{" "}
              <Link href="mailto:andrzej@easyblocks.io">
                andrzej@easyblocks.io
              </Link>
            </AlertDialog.Description>

            <Flex gap="3" mt="4" justify="end">
              <AlertDialog.Cancel>
                <Button variant="soft" color="gray">
                  Cancel
                </Button>
              </AlertDialog.Cancel>
            </Flex>
          </AlertDialog.Content>
        </AlertDialog.Root>
      </div>

      <div className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {projects.map((p) => (
          <ProjectCard
            link={`/projects/${p.id}`}
            title={p.name}
            documentsCount={p.documentsCount}
            key={p.id}
          />
        ))}
      </div>
    </Root>
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

  let {
    data: { session },
  } = await supabase.auth.getSession();

  const code = ctx.query.code as string;

  if (code) {
    const {
      data: { session: exchangedSession },
    } = await supabase.auth.exchangeCodeForSession(code);
    session = exchangedSession;
  }

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
