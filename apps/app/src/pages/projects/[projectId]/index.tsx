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
  const [pageNumber, setPageNumber] = useState(0);
  const pageSize = 50;

  const { project } = props;

  const paginatedProjectDocuments = project.documents.slice(
    pageNumber * pageSize,
    (pageNumber + 1) * pageSize
  );

  const maxPageNumber = Math.ceil(project.documents.length / pageSize) - 1;

  return (
    <Root>
      <div className="mb-4">
        <Button variant="ghost">
          <ArrowLeftIcon />
          <Link href="/">All Projects</Link>
        </Button>
      </div>

      <div className="mb-5 flex flex-col items-start gap-6">
        <div className="font-sans text-2xl font-semibold">{project.name}</div>
      </div>

      <div className="max-w-lg text-sm flex flex-col gap-2">
        <div className="flex flex-row">
          <div className="basis-32 text-black">Identifier</div>
          <div className="text-slate-500">{project.id}</div>
        </div>

        <div className="flex flex-row">
          <div className="basis-32 text-black">Access Token</div>
          <div className="text-slate-500 flex flex-row justify-start items-center gap-2">
            {maskToken(project.tokens[0])}
            <CopyTextToClipboardButton text={project.tokens[0]} />
            <RegenerateTokenButton projectId={project.id} />
          </div>
        </div>
      </div>

      <div className="font-sans text-2xl font-semibold mt-14 mb-5">
        Documents
      </div>

      <TableRoot style={{ width: "100%" }} mb="3">
        <TableHeader>
          <TableRow>
            <TableRowHeaderCell className="text-sm font-semibold">
              ID
            </TableRowHeaderCell>
            <TableRowHeaderCell className="text-sm font-semibold">
              Root component
            </TableRowHeaderCell>
            <TableRowHeaderCell className="text-sm font-semibold">
              Updated at
            </TableRowHeaderCell>
            <TableRowHeaderCell className="text-sm font-semibold">
              Version
            </TableRowHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedProjectDocuments.map((project) => {
            return (
              <TableRow key={project.id}>
                <TableCell>{project.id}</TableCell>
                <TableCell>{project.documentType}</TableCell>
                <TableCell>
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
                <TableCell>{project.version}</TableCell>
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
        </TableBody>
      </TableRoot>

      {project.documents.length > pageSize && (
        <Flex
          width={"100%"}
          justify={"center"}
          align={"center"}
          gap="2"
          className="mt-8"
        >
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
      )}
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
            router.refresh();
          }
        });
      }}
    >
      Generate new access token
    </Button>
  );
}

function RegenerateTokenButton({ projectId }: { projectId: string }) {
  const router = useRouter();

  return (
    <Tooltip content="Regenerate token">
      <IconButton
        variant="ghost"
        onClick={() => {
          fetch(`/api/projects/${projectId}/tokens`, {
            method: "POST",
          }).then((res) => {
            if (res.ok) {
              router.refresh();
            }
          });
        }}
        aria-label="Regenerate token"
      >
        <ReloadIcon />
      </IconButton>
    </Tooltip>
  );
}
