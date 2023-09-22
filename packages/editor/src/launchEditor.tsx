import {
  Config,
  ContextParams,
  ExternalDataChangeHandler,
  FetchOutputResources,
  getDefaultLocale,
} from "@easyblocks/core";
import {
  SSModalContext,
  SSModalStyles,
  Toaster,
} from "@easyblocks/design-system";
import { raiseError } from "@easyblocks/utils";
import isPropValid from "@emotion/is-prop-valid";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React from "react";
import { createRoot, Root } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { ShouldForwardProp, StyleSheetManager } from "styled-components";
import { Editor } from "./Editor";
import { GlobalStyles } from "./tinacms/styles";

type LaunchEditorProps = {
  config: Config;
  externalData: FetchOutputResources;
  onExternalDataChange: ExternalDataChangeHandler;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const shouldForwardProp: ShouldForwardProp<"web"> = (propName, target) => {
  if (typeof target === "string") {
    // For HTML elements, forward the prop if it is a valid HTML attribute
    return isPropValid(propName);
  }
  // For other elements, forward all props
  return true;
};

let reactRoot: Root | null = null;

export function launchEditor(props: LaunchEditorProps) {
  const rootNode = document.getElementById("shopstory-main-window");

  if (!rootNode) {
    throw new Error("Can't find #shopstory-main-window element");
  }

  const locales = props.config.locales ?? raiseError("Missing locales");
  const editorSearchParams = parseEditorSearchParams();
  const contextParams = editorSearchParams.contextParams ?? {
    locale: getDefaultLocale(locales).code,
  };
  const rootContainer =
    editorSearchParams.rootContainer ?? raiseError("Missing rootContainer");
  const mode = editorSearchParams.mode ?? "playground";

  if (!reactRoot) {
    reactRoot = createRoot(rootNode);
  }

  reactRoot.render(
    <QueryClientProvider client={queryClient}>
      <HashRouter>
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
              rootContainer={rootContainer}
              externalData={props.externalData}
              onExternalDataChange={props.onExternalDataChange}
            />
            <Toaster containerStyle={{ zIndex: 100100 }} />
          </SSModalContext.Provider>
        </StyleSheetManager>
      </HashRouter>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

type EditorSearchParams = {
  mode: "app" | "playground" | null;
  documentId: string | null;
  source: string | null;
  uniqueSourceIdentifier: string | null;
  rootContainer: "content" | "grid" | (string & Record<never, never>) | null;
  contextParams: ContextParams | null;
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
  const rootContainer = searchParams.get("rootContainer");
  const contextParamsSearchParam = searchParams.get("contextParams");

  let contextParams: ContextParams | null = null;

  if (contextParamsSearchParam) {
    try {
      const parsedContextParams = JSON.parse(contextParamsSearchParam);

      contextParams = {
        locale:
          typeof parsedContextParams.locale === "string"
            ? parsedContextParams.locale
            : raiseError(
                `Missing "locale" value in "contextParams" search param`
              ),
      };
    } catch {
      contextParams = null;
    }
  }

  const editorSearchParams: EditorSearchParams = {
    mode,
    documentId,
    rootContainer,
    source,
    uniqueSourceIdentifier,
    contextParams,
  };

  return editorSearchParams;
}
