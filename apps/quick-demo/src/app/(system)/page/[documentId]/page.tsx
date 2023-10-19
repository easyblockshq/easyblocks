import { easyblocksConfig } from "@/app/easyblocks/easyblocks.config";
import { createMyCustomFetch } from "@/app/easyblocks/myCustomFetch";
import { QuickDemoEasyblocksProvider } from "@/app/easyblocks/QuickDemoEasyblocksProvider";
import { buildDocument } from "@easyblocks/core";
import { EasyblocksContent } from "./EasyblocksContent";

const fetch = createMyCustomFetch(
  process.env.NEXT_PUBLIC_EASYBLOCKS_ACCESS_TOKEN!
);

export default async function Page({
  params,
}: {
  params: { documentId: string };
}) {
  const { renderableDocument, externalData } = await buildDocument({
    documentId: params.documentId,
    config: easyblocksConfig,
    locale: "en-US",
  });

  const fetchedExternalData = await fetch(externalData);

  return (
    <div>
      <div
        className={
          "container mx-auto text-center my-28 p-5 flex justify-center flex-col items-center"
        }
      >
        <div className={"text-xl font-semibold mb-3"}>Easyblocks demo</div>
        <div className={"text-md text-neutral-700 max-w-xl"}>
          Below we're rendering the content you built in Easyblocks demo.
          Easyblocks content can be rendered anywhere within your project.
        </div>
      </div>
      <QuickDemoEasyblocksProvider>
        <EasyblocksContent
          renderableDocument={renderableDocument}
          externalData={fetchedExternalData}
        />
      </QuickDemoEasyblocksProvider>
    </div>
  );
}

export const revalidate = 0;
