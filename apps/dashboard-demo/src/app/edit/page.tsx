import {
  Box,
  Flex,
  TableBody,
  TableCell,
  TableRoot,
  TableRow,
  Text,
} from "@radix-ui/themes";
import { cookies } from "next/headers";
import { EasyblocksEditorDialog } from "../components/EasyblocksEditorDialog";
import { RemoveDocumentButton } from "./RemoveDocumentButton";

const documents = [
  {
    id: "appShell",
    title: "App Shell",
    rootComponentId: "AppShell",
  },
  {
    id: "welcomeScreen",
    title: "Welcome Screen",
    rootComponentId: "WelcomeScreenContent",
  },
  {
    id: "assetScreen",
    title: "Asset Screen",
    rootComponentId: "AssetScreenContent",
  },
];

export default async function DocumentsPage() {
  const cookieStore = cookies();

  return (
    <main className="container mx-auto">
      <Box mb="4">
        <Text size="8">Documents</Text>
      </Box>
      <TableRoot>
        <TableBody>
          {documents.map((d) => {
            const documentCookieId = `${d.id}DocumentId`;
            const documentCookie = cookieStore.get(documentCookieId);
            const isDefined = !!documentCookie?.value;

            return (
              <TableRow key={d.id}>
                <TableCell className="py-3 px-4 text-right">
                  {d.title}
                </TableCell>

                <TableCell className="py-3 px-4">
                  <Flex gap={"3"}>
                    <EasyblocksEditorDialog
                      documentId={documentCookie?.value}
                      cookieId={documentCookieId}
                      rootComponentId={d.rootComponentId}
                    />
                    {isDefined && (
                      <>
                        {" "}
                        · <RemoveDocumentButton cookieId={documentCookieId} />
                      </>
                    )}
                  </Flex>
                </TableCell>

                <TableCell className="py-3 px-4 text-slate-500">
                  {documentCookie?.value ?? "-"}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </TableRoot>
    </main>
  );
}
