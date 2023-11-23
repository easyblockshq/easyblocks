"use client";
import type { ExternalData, RenderableDocument } from "@easyblocks/core";
import {
  RichTextBlockElementClient,
  RichTextClient,
  RichTextInlineWrapperElementClient,
  RichTextLineElementClient,
  RichTextPartClient,
  TextClient,
} from "@easyblocks/editable-components";
import React, { ReactElement, useEffect } from "react";
import ComponentBuilder, {
  ComponentBuilderProps,
} from "./ComponentBuilder/ComponentBuilder";
import { EasyblocksExternalDataProvider } from "./EasyblocksExternalDataProvider";
import { EasyblocksMetadataProvider } from "./EasyblocksMetadataProvider";
import EditableComponentBuilderClient from "./EditableComponentBuilder/EditableComponentBuilder.client";
import { StandardImage } from "./StandardImage";

export type EasyblocksProps = {
  renderableDocument: RenderableDocument;
  externalData: ExternalData;
  components?: Record<string, React.ComponentType<any>>;
  componentOverrides?: ComponentOverrides;
};

export type ComponentOverrides = Record<string, ReactElement>;

const builtinComponents: ComponentBuilderProps["components"] = {
  "$richText.client": RichTextClient,
  $richTextBlockElement: RichTextBlockElementClient,
  $richTextInlineWrapperElement: RichTextInlineWrapperElementClient,
  $richTextLineElement: RichTextLineElementClient,
  $richTextPart: RichTextPartClient,
  "$text.client": TextClient,
  "EditableComponentBuilder.client": EditableComponentBuilderClient,
  Image: StandardImage,
};

function Easyblocks({
  renderableDocument,
  externalData,
  componentOverrides,
  components,
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
        <ComponentBuilder
          compiled={renderableContent}
          path={""}
          components={{
            ...components,
            ...builtinComponents,
            Image: components?.Image ?? StandardImage,
          }}
        />
      </EasyblocksExternalDataProvider>
    </EasyblocksMetadataProvider>
  );
}

export { Easyblocks };
