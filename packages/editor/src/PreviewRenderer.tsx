import {
  RequestedExternalData,
  Easyblocks,
  getDefaultLocale,
  type RenderableDocument,
} from "@easyblocks/core";
import React, { useEffect, useState } from "react";
import { parseQueryParams } from "./parseQueryParams";
import { EasyblocksEditorProps } from "./EasyblocksEditorProps";
import { serialize } from "@easyblocks/utils";

export const PreviewRenderer: React.FC<EasyblocksEditorProps> = (props) => {
  const config = props.config;

  const [data, setData] = useState<{
    renderableDocument: RenderableDocument;
    externalData: RequestedExternalData;
  } | null>(null);

  const [width, setWidth] = useState<number>(-1);
  const [widthAuto, setWidthAuto] = useState<boolean>(false);

  useEffect(() => {
    const { documentId, templateId, locale } = parseQueryParams();

    let mode: "template" | "document";

    if (documentId && templateId) {
      console.warn(
        `'template' parameter ignored because 'document' parameter is specified`
      );
      mode = "document";
    } else if (!documentId && templateId) {
      mode = "template";
    } else if (documentId && !templateId) {
      mode = "document";
    } else {
      throw new Error(
        "You must specify 'document' or 'template' parameter in preview mode"
      );
    }

    const localeWithDefault =
      locale ?? getDefaultLocale(config.locales ?? []).code;

    (async () => {
      const { buildDocument, buildEntry } = await import("@easyblocks/core");

      if (mode === "document") {
        const { renderableDocument, externalData } = await buildDocument({
          documentId: documentId!,
          config,
          locale: localeWithDefault,
        });

        props.onExternalDataChange?.(externalData, {
          locale: localeWithDefault,
        });

        setData({
          renderableDocument,
          externalData,
        });
      } else {
        const template = await config.backend.templates.get({
          id: templateId!,
        });

        const { renderableContent, meta, externalData } = buildEntry({
          entry: {
            ...template.entry,
            _itemProps: {},
          },
          config,
          locale: localeWithDefault,
        });

        props.onExternalDataChange?.(externalData, {
          locale: localeWithDefault,
        });

        setWidth(template.width ?? -1);
        setWidthAuto(template.widthAuto ?? false);

        setData({
          renderableDocument: {
            renderableContent,
            meta: serialize(meta),
          },
          externalData,
        });
      }
    })();
  }, []);

  if (!data) {
    return null;
  }

  const requestedExternalDataLength = Object.keys(data.externalData).length;
  const givenExternalDataLength = Object.keys(props.externalData ?? {}).length;

  if (requestedExternalDataLength !== givenExternalDataLength) {
    return null;
  }

  return (
    <div
      style={{
        position: "relative",
        display: widthAuto ? "inline-flex" : "block",
        maxWidth: width === -1 ? "auto" : `${width}px`,
      }}
      id={"__easyblocks-preview-container"}
    >
      <Easyblocks
        renderableDocument={data.renderableDocument}
        externalData={props.externalData}
        components={props.components}
      />
    </div>
  );
};
