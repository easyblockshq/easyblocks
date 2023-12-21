import { Database } from "@/infrastructure/supabaseSchema";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CopyIcon,
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
} from "@radix-ui/themes";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

function ProjectPage({
  project,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [pageNumber, setPageNumber] = useState(0);
  const pageSize = 20;

  const paginatedProjectDocuments = project.documents.slice(
    pageNumber * pageSize,
    (pageNumber + 1) * pageSize
  );

  const maxPageNumber = Math.floor(project.documents.length / pageSize);

  return (
    <Container>
      <Flex gap="2" align="baseline" mb="2">
        <Heading as="h1">{project.name}&nbsp;</Heading>
        <Button variant="ghost" asChild>
          <Link href="/">Back</Link>
        </Button>
      </Flex>
      <Flex gap="2" align="center" mb="6">
        <Text size="1" color="gray">
          {project.id}&nbsp;
        </Text>
        <CopyTextToClipboardButton text={project.id} />
      </Flex>

      <Flex
        direction={"column"}
        align={"start"}
        mb="8"
        style={{ maxWidth: 768, width: "100%" }}
      >
        <Heading as="h2" mb="1">
          Tokens
        </Heading>
        <TableRoot style={{ width: "100%" }} mb="3">
          <TableHeader>
            <TableRow>
              <TableRowHeaderCell>Key</TableRowHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {project.tokens.map((token) => {
              return (
                <TableRow key={token}>
                  <TableCell>
                    <Flex gap="2" align={"center"}>
                      {maskToken(token)}
                      <CopyTextToClipboardButton text={token} />
                    </Flex>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </TableRoot>
        <GenerateAccessTokenButton projectId={project.id} />
      </Flex>

      <Flex
        direction={"column"}
        align={"start"}
        mb="8"
        style={{ maxWidth: 768, width: "100%" }}
      >
        <Heading as="h2" mb="2">
          Documents
        </Heading>

        <TableRoot style={{ width: "100%" }} mb="3">
          <TableHeader>
            <TableRow>
              <TableRowHeaderCell>ID</TableRowHeaderCell>
              <TableRowHeaderCell>Document type</TableRowHeaderCell>
              <TableRowHeaderCell align="right">Updated at</TableRowHeaderCell>
              <TableRowHeaderCell align="right">Version</TableRowHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedProjectDocuments.map((project) => {
              return (
                <TableRow key={project.id}>
                  <TableCell>{project.id}</TableCell>
                  <TableCell>{project.documentType}</TableCell>
                  <TableCell align="right">
                    {project.updatedAt
                      ? new Intl.DateTimeFormat("en-US", {
                          day: "numeric",
                          month: "numeric",
                          year: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                        }).format(new Date(project.updatedAt))
                      : "-"}
                  </TableCell>
                  <TableCell align="right">{project.version}</TableCell>
                </TableRow>
              );
            })}
            {paginatedProjectDocuments.length === 0 && (
              <TableRow style={{ height: 2 * 44 }}>
                <TableCell colSpan={4}>
                  <Flex
                    width={"100%"}
                    height={"100%"}
                    justify={"center"}
                    align={"center"}
                  >
                    <Text align={"center"}>
                      No documents to display.
                      <br />
                      Learn more about about the editor{" "}
                      <RadixLink
                        href="https://docs.easyblocks.io/essentials/editor-page"
                        target="_blank"
                      >
                        here
                      </RadixLink>{" "}
                      to create your first document.
                    </Text>
                  </Flex>
                </TableCell>
              </TableRow>
            )}
            {paginatedProjectDocuments.length < pageSize && (
              <TableRow
                style={{
                  height: (pageSize - paginatedProjectDocuments.length) * 44,
                }}
              >
                <TableCell colSpan={4} style={{ boxShadow: "none" }}>
                  &nbsp;
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </TableRoot>

        <Flex width={"100%"} justify={"center"} align={"center"} gap="2">
          <Text size="2">
            {pageNumber * pageSize + 1}-
            {Math.min((pageNumber + 1) * pageSize, project.documents.length)} of{" "}
            {project.documents.length}
          </Text>
          <IconButton
            variant="ghost"
            onClick={() => {
              setPageNumber(Math.max(pageNumber - 1, 0));
            }}
            disabled={pageNumber === 0}
            aria-label="Previous page"
          >
            <ChevronLeftIcon />
          </IconButton>
          <IconButton
            variant="ghost"
            onClick={() => {
              setPageNumber(Math.min(pageNumber + 1, maxPageNumber));
            }}
            disabled={pageNumber === maxPageNumber}
            aria-label="Next page"
          >
            <ChevronRightIcon />
          </IconButton>
        </Flex>
      </Flex>
    </Container>
  );
}

export default ProjectPage;

export const getServerSideProps: GetServerSideProps<
  {
    project: Pick<
      Database["public"]["Tables"]["projects"]["Row"],
      "id" | "name" | "tokens"
    > & {
      documents: Array<{
        id: string;
        version: number;
        documentType: string;
        updatedAt: string;
      }>;
    };
  },
  { projectId: string }
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
      "id, name, tokens, documents(id, version, root_container, ...configs(updated_at))"
    )
    .match({
      id: ctx.params!.projectId,
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
        }>;
      }>
    >();

  if (!projectQueryResult.data || projectQueryResult.data.length === 0) {
    return {
      notFound: true,
    };
  }

  const project = projectQueryResult.data[0];

  return {
    props: {
      project: {
        id: project.id,
        name: project.name,
        tokens: project.tokens,
        documents: project.documents
          .map((d) => {
            return {
              id: d.id,
              version: d.version,
              documentType: d.root_container ?? "-",
              updatedAt: d.updated_at,
            };
          })
          // I have no idea how to sort correctly with Supabase query API by nested referenced table so we
          // perform sort here
          .sort(
            (d1, d2) =>
              new Date(d2.updatedAt).getTime() -
              new Date(d1.updatedAt).getTime()
          ),
      },
    },
  };
};

function maskToken(token: string) {
  return `${token.slice(0, 8)} ... ${token.slice(-8)}`;
}

function CopyTextToClipboardButton({ text }: { text: string }) {
  return (
    <IconButton
      variant="ghost"
      onClick={() => {
        window.navigator.clipboard.writeText(text).then(() => {
          alert("Copied to clipboard");
        });
      }}
      aria-label="Copy to clipboard"
    >
      <CopyIcon />
    </IconButton>
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
