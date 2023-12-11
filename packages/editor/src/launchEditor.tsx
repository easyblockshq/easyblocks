import {
  Config,
  ExternalDataChangeHandler,
  FetchOutputResources,
  WidgetComponentProps,
  getDefaultLocale,
} from "@easyblocks/core";
import {
  SSModalContext,
  SSModalStyles,
  Toaster,
  TooltipProvider,
} from "@easyblocks/design-system";
import { raiseError } from "@easyblocks/utils";
import isPropValid from "@emotion/is-prop-valid";
import React, { ComponentType } from "react";
import { ShouldForwardProp, StyleSheetManager } from "styled-components";
import { Editor } from "./Editor";
import { GlobalStyles } from "./tinacms/styles";

export type LaunchEditorProps = {
  config: Config;
  externalData: FetchOutputResources;
  onExternalDataChange: ExternalDataChangeHandler;
  widgets?: Record<string, ComponentType<WidgetComponentProps>>;
};

const shouldForwardProp: ShouldForwardProp<"web"> = (propName, target) => {
  if (typeof target === "string") {
    // For HTML elements, forward the prop if it is a valid HTML attribute
    return isPropValid(propName);
  }
  // For other elements, forward all props
  return true;
};

export function EasyblocksParent(props: LaunchEditorProps) {
  const locales = props.config.locales ?? raiseError("Missing locales");
  const editorSearchParams = parseEditorSearchParams();
  const contextParams = {
    locale: editorSearchParams.locale ?? getDefaultLocale(locales).code,
  };
  const documentType =
    editorSearchParams.documentType ??
    raiseError("Missing documentType search param");
  const mode = editorSearchParams.mode ?? "playground";

  return (
    <StyleSheetManager
      shouldForwardProp={shouldForwardProp}
      enableVendorPrefixes
    >
      <SSModalContext.Provider
        value={() => {
          return document.querySelector("#modalContainer");
        }}
      >
        <GlobalStyles />
        <SSModalStyles />
        <TooltipProvider>
          <div
            id={"modalContainer"}
            style={{ position: "fixed", left: 0, top: 0, zIndex: 100000 }}
          />
          <Editor
            config={props.config}
            contextParams={contextParams}
            locales={locales}
            mode={mode}
            documentId={editorSearchParams.documentId}
            documentType={documentType}
            externalData={props.externalData}
            onExternalDataChange={props.onExternalDataChange}
            widgets={props.widgets}
          />
        </TooltipProvider>
        <Toaster containerStyle={{ zIndex: 100100 }} />
      </SSModalContext.Provider>
    </StyleSheetManager>
  );
}

type EditorSearchParams = {
  mode: "app" | "playground" | null;
  documentId: string | null;
  source: string | null;
  uniqueSourceIdentifier: string | null;
  documentType: string | null;
  locale: string | null;
};

function parseEditorSearchParams() {
  const searchParams = new URLSearchParams(window.location.search);

  const modeSearchParam = searchParams.get("mode");

  if (modeSearchParam && !["app", "playground"].includes(modeSearchParam)) {
    raiseError(
      `Invalid "mode" value in search params. Valid values are "app" and "playground".`
    );
  }

  const mode = modeSearchParam
    ? (modeSearchParam as "app" | "playground")
    : null;
  const documentId = searchParams.get("documentId");
  const source = searchParams.get("source");
  const uniqueSourceIdentifier = searchParams.get("uniqueSourceIdentifier");
  const documentType = searchParams.get("documentType");
  const locale = searchParams.get("locale");

  const editorSearchParams: EditorSearchParams = {
    mode,
    documentId,
    documentType,
    source,
    uniqueSourceIdentifier,
    locale,
  };

  return editorSearchParams;
}
