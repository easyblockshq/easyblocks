import { easyblocksConfig } from "@/app/easyblocks/easyblocks.config";
import { createMyCustomFetch } from "@/app/easyblocks/myCustomFetch";
import { components } from "@/app/easyblocks/components";
import { buildDocument } from "@easyblocks/core";
import { EasyblocksContent } from "./EasyblocksContent";
import { useSearchParams } from "next/navigation";

const fetch = createMyCustomFetch();

export default async function Page({
  params,
  searchParams,
}: {
  params: { documentId: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const locale =
    typeof searchParams?.locale === "string" ? searchParams.locale : "en-US";

  const { renderableDocument, externalData } = await buildDocument({
    documentId: params.documentId,
    config: easyblocksConfig,
    locale,
  });

  const fetchedExternalData = await fetch(externalData);

  return (
    <div className={"bg-white-1"}>
      <div
        className={
          "container mx-auto text-center py-28 px-5 flex justify-center flex-col items-center"
        }
      >
        <div className={"text-xl font-semibold mb-3"}>Easyblocks demo</div>
        <div className={"text-md text-neutral-700 max-w-xl"}>
          Below we are rendering the content you built in Easyblocks demo.
          Easyblocks content can be rendered anywhere within your project.
        </div>
      </div>
      <EasyblocksContent
        renderableDocument={renderableDocument}
        externalData={fetchedExternalData}
        components={components}
      />
    </div>
  );
}

export const revalidate = 0;
