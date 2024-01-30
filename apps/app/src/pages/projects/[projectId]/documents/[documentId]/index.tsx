import { Root } from "@/components/Root";
import { Database } from "@/infrastructure/supabaseSchema";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CopyIcon,
  ArrowLeftIcon,
  ReloadIcon,
} from "@radix-ui/react-icons";
import {
  Button,
  Container,
  Flex,
  Heading,
  IconButton,
  Link as RadixLink,
  TableBody,
  TableCell,
  TableHeader,
  TableRoot,
  TableRow,
  TableRowHeaderCell,
  Text,
  Tooltip,
} from "@radix-ui/themes";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

function ProjectPage(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  console.log(props);

  return (
    <Root>
      <div className="mb-4">
        <Button variant="ghost">
          <ArrowLeftIcon />
          <Link href="/">Project details</Link>
        </Button>
      </div>

      <div className="mb-5 flex flex-col items-start gap-6">
        <div className="font-sans text-2xl font-semibold">Document</div>
      </div>
    </Root>
  );
}

export default ProjectPage;

export const getServerSideProps: GetServerSideProps<
  {
    project: Pick<
      Database["public"]["Tables"]["projects"]["Row"],
      "id" | "name" | "tokens"
    > & {
      document: {
        id: string;
        version: number;
        documentType: string;
        updatedAt: string;
        entry: any;
      };
    };
  },
  { projectId: string; documentId: string }
> = async (ctx) => {
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

  const projectQueryResult = await supabase
    .from("projects")
    .select(
      "id, name, tokens, documents(id, version, root_container, ...configs(updated_at, config))"
    )
    .match({
      id: ctx.params!.projectId,
      "documents.id": ctx.params!.documentId,
    })
    // Because we're using a new spread operator in the query, we need to help Supabase's query parser until it supports it on it's own
    .returns<
      Array<{
        id: string;
        name: string;
        tokens: Array<string>;
        documents: Array<{
          id: string;
          version: number;
          root_container: string | null;
          updated_at: string;
          config: any;
        }>;
      }>
    >();

  if (!projectQueryResult.data || projectQueryResult.data.length === 0) {
    return {
      notFound: true,
    };
  }

  const project = projectQueryResult.data[0];

  if (project.documents.length === 0) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      project: {
        id: project.id,
        name: project.name,
        tokens: project.tokens,
        document: {
          id: project.documents[0].id,
          version: project.documents[0].version,
          documentType: project.documents[0].root_container ?? "-",
          updatedAt: project.documents[0].updated_at,
          entry: project.documents[0].config,
        },
      },
    },
  };
};
