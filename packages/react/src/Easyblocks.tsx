"use client";
import type { ExternalData, RenderableDocument } from "@easyblocks/core";
import React, { ReactElement, useEffect } from "react";
import ComponentBuilder from "./ComponentBuilder/ComponentBuilder";
import { EasyblocksExternalDataProvider } from "./EasyblocksExternalDataProvider";
import { EasyblocksMetadataProvider } from "./EasyblocksMetadataProvider";

export type EasyblocksProps = {
  renderableDocument: RenderableDocument;
  externalData: ExternalData;
  componentOverrides?: ComponentOverrides;
};

export type ComponentOverrides = Record<string, ReactElement>;

function Easyblocks({
  renderableDocument,
  externalData,
  componentOverrides,
}: EasyblocksProps) {
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--shopstory-viewport-width",
      `calc(100vw - ${
        window.innerWidth - document.documentElement.clientWidth
      }px)`
    );
  });

  const renderableContent = renderableDocument.renderableContent;

  if (renderableContent === null) {
    return null;
  }

  if (componentOverrides) {
    const overridesEntries = Object.entries(componentOverrides);

    overridesEntries.forEach(([componentProp, componentOverride]) => {
      renderableContent.components[componentProp] = [componentOverride];
    });
  }

  return (
    <EasyblocksMetadataProvider meta={renderableDocument.meta}>
      <EasyblocksExternalDataProvider externalData={externalData}>
        <ComponentBuilder compiled={renderableContent} path={""} />
      </EasyblocksExternalDataProvider>
    </EasyblocksMetadataProvider>
  );
}

export { Easyblocks };
