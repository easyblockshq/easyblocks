import formatRelative from "date-fns/formatRelative";
import { Fragment } from "react";
import { DocumentPreview } from "./document-preview";
import { EditDocumentButton } from "./edit-document-button";
import { accessToken, createApiClient } from "./lib/apiClient";
import { NewDocument } from "./new-document-button";

export default async function Home() {
  const apiClient = createApiClient();

  if (!process.env.NEXT_PUBLIC_EASYBLOCKS_PROJECT_ID) {
    throw new Error("Missing NEXT_PUBLIC_EASYBLOCKS_PROJECT_ID");
  }

  const documents = await apiClient.documents.getDocuments({
    projectId: process.env.NEXT_PUBLIC_EASYBLOCKS_PROJECT_ID,
  });

  return (
    <Fragment>
      <header className="container mx-auto flex justify-between p-16">
        <a className="text-2xl">ACME Company Software</a>
        <div>
          <div className="text-right">John Doe</div>
          <div>john.doe@acme.com</div>
        </div>
      </header>
      <main className="container mx-auto p-16">
        {documents.length >= 0 && (
          <div className="text-right mb-3">
            <NewDocument />
          </div>
        )}

        <div className="grid grid-cols-4 gap-4">
          {[...documents]
            .sort(
              (a, b) =>
                new Date(b.updated_at).getTime() -
                new Date(a.updated_at).getTime()
            )
            .map((document) => {
              return (
                <div className="w-full" key={document.id}>
                  <DocumentPreview
                    configId={document.config_id}
                    accessToken={accessToken}
                    version={document.version}
                  />
                  <div className="flex justify-between gap-2">
                    <div>
                      <h2>{document.title}</h2>
                      <div>
                        {formatRelative(
                          new Date(document.updated_at),
                          new Date(),
                          {
                            weekStartsOn: 1,
                          }
                        )}
                      </div>
                    </div>
                    <div className="shrink-0">
                      <EditDocumentButton documentId={document.id} />
                    </div>
                  </div>
                </div>
              );
            })}

          {documents.length === 0 && (
            <h2 className="text-center">
              <div>No documents</div>
            </h2>
          )}
        </div>
      </main>
    </Fragment>
  );
}

export const revalidate = 0;
