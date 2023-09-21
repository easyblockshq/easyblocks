"use client";
import type { ExternalData, RenderableDocument } from "@easyblocks/core";
import React, { useEffect } from "react";
import ComponentBuilder from "./ComponentBuilder/ComponentBuilder";
import { EasyblocksExternalDataProvider } from "./EasyblocksExternalDataProvider";
import { EasyblocksMetadataProvider } from "./EasyblocksMetadataProvider";

export type EasyblocksProps = {
  renderableDocument: RenderableDocument;
  externalData: ExternalData;
};

function Easyblocks({ renderableDocument, externalData }: EasyblocksProps) {
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--shopstory-viewport-width",
      `calc(100vw - ${
        window.innerWidth - document.documentElement.clientWidth
      }px)`
    );
  });

  if (renderableDocument.renderableContent === null) {
    return null;
  }

  return (
    <EasyblocksMetadataProvider meta={renderableDocument.meta}>
      <EasyblocksExternalDataProvider externalData={externalData}>
        <ComponentBuilder
          compiled={renderableDocument.renderableContent}
          path={""}
        />
      </EasyblocksExternalDataProvider>
    </EasyblocksMetadataProvider>
  );
}

export { Easyblocks };
