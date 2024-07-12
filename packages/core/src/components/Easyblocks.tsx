"use client";
import React, { ReactElement, useEffect } from "react";
import { RichTextClient } from "../compiler/builtins/$richText/$richText.client";
import { RichTextBlockElementClient } from "../compiler/builtins/$richText/$richTextBlockElement/$richTextBlockElement.client";
import { RichTextLineElementClient } from "../compiler/builtins/$richText/$richTextLineElement/$richTextLineElement.client";
import { RichTextPartClient } from "../compiler/builtins/$richText/$richTextPart/$richTextPart.client";
import { TextClient } from "../compiler/builtins/$text/$text.client";
import { ExternalData, RenderableDocument, Renderer } from "../types";
import {
  ComponentBuilder,
  ComponentBuilderProps,
} from "./ComponentBuilder/ComponentBuilder";
import { EasyblocksExternalDataProvider } from "./EasyblocksExternalDataProvider";
import { EasyblocksMetadataProvider } from "./EasyblocksMetadataProvider";
import { MissingComponent } from "./MissingComponent";

export type EasyblocksProps = {
  renderableDocument: RenderableDocument;
  externalData?: ExternalData;
  components?: Record<string, React.ComponentType<any>>;
  componentOverrides?: ComponentOverrides;
  renderer?: Renderer;
};

export type ComponentOverrides = Record<string, ReactElement>;

const builtinComponents: ComponentBuilderProps["components"] = {
  "@easyblocks/missing-component": MissingComponent,
  "@easyblocks/rich-text.client": RichTextClient,
  "@easyblocks/rich-text-block-element": RichTextBlockElementClient,
  "@easyblocks/rich-text-line-element": RichTextLineElementClient,
  "@easyblocks/rich-text-part": RichTextPartClient,
  "@easyblocks/text.client": TextClient,
  "EditableComponentBuilder.client": ComponentBuilder,
};

// cursor: !isEnabled ? "inherit" : "text",
// "& *": {
//   pointerEvents: isEnabled ? "auto" : "none",
//   userSelect: isEnabled ? "auto" : "none",
// },
// "& *::selection": {
//   backgroundColor: "#b4d5fe",
// },
// ...(isDecorationActive && {
//   "& *::selection": {
//     backgroundColor: "transparent",
//   },
//   "& *[data-easyblocks-rich-text-selection]": {
//     backgroundColor: "#b4d5fe",
//   },
// }),
// ...(isFallbackValueShown && {
//   opacity: 0.5,
// }),
// // Remove any text decoration from slate nodes that are elements. We only need text decoration on text elements.
// "[data-slate-node]": {
//   textDecoration: "none",
// },

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
      <EasyblocksExternalDataProvider externalData={externalData ?? {}}>
        <ComponentBuilder
          compiled={renderableContent}
          path={""}
          components={{
            ...components,
            ...builtinComponents,
          }}
        />
      </EasyblocksExternalDataProvider>
    </EasyblocksMetadataProvider>
  );
}

export { Easyblocks };
