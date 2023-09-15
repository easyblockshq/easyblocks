"use client";
import { ExternalData, RenderableDocument, Resource } from "@easyblocks/core";
import React, { useEffect } from "react";
import ComponentBuilder from "./ComponentBuilder/ComponentBuilder";
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

  const resources = Object.entries(externalData).map<Resource>(
    ([id, resource]) => {
      if ("values" in resource) {
        return {
          id,
          type: resource.type,
          status: "success",
          error: null,
          value: resource.values,
        };
      } else {
        if (resource.value !== undefined) {
          return {
            id,
            type: resource.type,
            status: "success",
            value: resource.value,
            error: null,
          };
        } else {
          return {
            id,
            type: resource.type,
            status: "error",
            value: undefined,
            error: resource.error,
          };
        }
      }
    }
  );

  return (
    <EasyblocksMetadataProvider
      meta={{ ...renderableDocument.meta, resources }}
    >
      <ComponentBuilder
        compiled={renderableDocument.renderableContent}
        path={""}
      />
    </EasyblocksMetadataProvider>
  );
}

export { Easyblocks };
