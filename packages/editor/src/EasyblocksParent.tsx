import {
  Config,
  ExternalDataChangeHandler,
  FetchOutputResources,
  InlineTypeWidgetComponentProps,
  WidgetComponentProps,
} from "@easyblocks/core";
import {
  SSModalContext,
  SSModalStyles,
  Toaster,
  TooltipProvider,
} from "@easyblocks/design-system";
import isPropValid from "@emotion/is-prop-valid";
import React, { ComponentType } from "react";
import { ShouldForwardProp, StyleSheetManager } from "styled-components";
import { Editor } from "./Editor";
import { ColorTokenWidget } from "./sidebar/ColorTokenWidget";
import { GlobalStyles } from "./tinacms/styles";
import { SpaceTokenWidget } from "./sidebar/SpaceTokenWidget";
// import { FontTokenWidget } from "./sidebar/FontTokenWidget";

export type EasyblocksParentProps = {
  config: Config;
  externalData: FetchOutputResources;
  onExternalDataChange: ExternalDataChangeHandler;
  widgets?: Record<
    string,
    | ComponentType<WidgetComponentProps<any>>
    | ComponentType<InlineTypeWidgetComponentProps<any>>
  >;
};

const shouldForwardProp: ShouldForwardProp<"web"> = (propName, target) => {
  if (typeof target === "string") {
    // For HTML elements, forward the prop if it is a valid HTML attribute
    return isPropValid(propName);
  }
  // For other elements, forward all props
  return true;
};

const builtinWidgets: EasyblocksParentProps["widgets"] = {
  color: ColorTokenWidget,
  // font: FontTokenWidget,
  space: SpaceTokenWidget,
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
            readOnly={editorSearchParams.readOnly ?? true}
            documentId={editorSearchParams.documentId}
            documentType={editorSearchParams.documentType ?? undefined}
            externalData={props.externalData}
            onExternalDataChange={props.onExternalDataChange}
            widgets={{
              ...builtinWidgets,
              ...props.widgets,
            }}
          />
        </TooltipProvider>
        <Toaster containerStyle={{ zIndex: 100100 }} />
      </SSModalContext.Provider>
    </StyleSheetManager>
  );
}

type EditorSearchParams = {
  readOnly: boolean | null;
  documentId: string | null;
  documentType: string | null;
  locale: string | null;
};

function parseEditorSearchParams() {
  const searchParams = new URLSearchParams(window.location.search);

  const readOnly =
    searchParams.get("readOnly") === "true"
      ? true
      : searchParams.get("readOnly") === "false"
      ? false
      : null;
  const documentId = searchParams.get("documentId");
  const documentType = searchParams.get("documentType");
  const locale = searchParams.get("locale");

  const editorSearchParams: EditorSearchParams = {
    readOnly,
    documentId,
    documentType,
    locale,
  };

  return editorSearchParams;
}
