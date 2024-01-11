import {
  Config,
  ExternalDataChangeHandler,
  FetchOutputResources,
  WidgetComponentProps,
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

export type EasyblocksParentProps = {
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

export function EasyblocksParent(props: EasyblocksParentProps) {
  const editorSearchParams = parseEditorSearchParams();

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
            locale={editorSearchParams.locale ?? undefined}
            mode={editorSearchParams.mode ?? "playground"}
            documentId={editorSearchParams.documentId}
            documentType={editorSearchParams.documentType ?? undefined}
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
  const documentType = searchParams.get("documentType");
  const locale = searchParams.get("locale");

  const editorSearchParams: EditorSearchParams = {
    mode,
    documentId,
    documentType,
    locale,
  };

  return editorSearchParams;
}
