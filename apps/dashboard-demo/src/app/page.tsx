import { LiveDataUpdater } from "@/app/LiveDataUpdater";
import { NoDocumentError } from "@/app/NoDocumentError";
import { ComponentOverrides, buildDocument } from "@easyblocks/core";
import { cookies } from "next/headers";
import { EasyblocksContent } from "./components/EasyblocksContent";
import { buildAppShellContent } from "./easyblocks/buildAppShellContent";
import { easyblocksComponents } from "./easyblocks/components";
import { easyblocksConfig } from "./easyblocks/easyblocks.config";
import { fetchExternalData } from "./easyblocks/fetchExternalData";

export default async function HomePage() {
  const cookieStore = cookies();

  const appShellDocumentContent = await buildAppShellContent();
  const welcomeScreenDocumentId = cookieStore.get("welcomeScreenDocumentId");

  if (!appShellDocumentContent) {
    return <NoDocumentError documentName={"AppShell"} />;
  }

  if (!welcomeScreenDocumentId) {
    return <NoDocumentError documentName={"WelcomeScreen"} />;
  }

  let componentOverrides: ComponentOverrides = {};

  if (welcomeScreenDocumentId) {
    const renderableWelcomeScreenDocument = await buildDocument({
      documentId: welcomeScreenDocumentId.value,
      config: easyblocksConfig,
      locale: "en",
    });

    const welcomeScreenExternalData = await fetchExternalData(
      renderableWelcomeScreenDocument.externalData
    );

    componentOverrides.Main = (
      <EasyblocksContent
        renderableDocument={renderableWelcomeScreenDocument.renderableDocument}
        externalData={welcomeScreenExternalData}
        components={easyblocksComponents}
      />
    );
  }

  return (
    <main>
      <EasyblocksContent
        renderableDocument={appShellDocumentContent.renderableDocument}
        externalData={appShellDocumentContent.externalData}
        componentOverrides={componentOverrides}
        components={easyblocksComponents}
      />
      <LiveDataUpdater />
    </main>
  );
}
