import { EasyblocksContent } from "@/app/components/EasyblocksContent";
import { LiveDataUpdater } from "@/app/LiveDataUpdater";
import { NoDocumentError } from "@/app/NoDocumentError";
import { buildDocument, ComponentOverrides } from "@easyblocks/core";
import { cookies } from "next/headers";
import { buildAppShellContent } from "../../easyblocks/buildAppShellContent";
import { easyblocksComponents } from "../../easyblocks/components";
import { easyblocksConfig } from "../../easyblocks/easyblocks.config";
import { fetchExternalData } from "../../easyblocks/fetchExternalData";

export default async function AssetsPage({
  params,
}: {
  params: { id: string };
}) {
  const cookieStore = cookies();
  const homeDocumentContent = await buildAppShellContent();
  const assetScreenDocumentId = cookieStore.get("assetScreenDocumentId");

  if (!homeDocumentContent) {
    return <NoDocumentError documentName={"AppShell"} />;
  }

  if (!assetScreenDocumentId) {
    return <NoDocumentError documentName={"AssetScreen"} />;
  }

  const componentOverrides: ComponentOverrides = {};

  if (assetScreenDocumentId) {
    const renderableAssetsScreenDocument = await buildDocument({
      documentId: assetScreenDocumentId.value,
      config: easyblocksConfig,
      locale: "en",
    });

    const assetsScreenExternalData = await fetchExternalData({
      ...renderableAssetsScreenDocument.externalData,
      "$.asset": {
        id: params.id,
        widgetId: "asset",
      },
    });

    componentOverrides.Main = (
      <EasyblocksContent
        renderableDocument={renderableAssetsScreenDocument.renderableDocument}
        externalData={assetsScreenExternalData}
        components={easyblocksComponents}
      />
    );
  }

  return (
    <main>
      <EasyblocksContent
        renderableDocument={homeDocumentContent.renderableDocument}
        externalData={homeDocumentContent.externalData}
        componentOverrides={componentOverrides}
        components={easyblocksComponents}
      />
      <LiveDataUpdater />
    </main>
  );
}
