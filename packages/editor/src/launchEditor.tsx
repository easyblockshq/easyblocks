import {
  Config,
  ContextParams,
  EditorMode,
  ExternalReference,
  Locale,
} from "@easyblocks/core";
import {
  SSModalContext,
  SSModalStyles,
  Toaster,
} from "@easyblocks/design-system";
import { raiseError } from "@easyblocks/utils";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { Editor } from "./Editor";
import { supabaseClient } from "./infrastructure/supabaseClient";
import { GlobalStyles } from "./tinacms/styles";
import { CMSInput } from "./types";
import isPropValid from "@emotion/is-prop-valid";
import { StyleSheetManager } from "styled-components";

type EditorLauncherProps = {
  config: Config;
  configs?: CMSInput;
  save?: (
    contentPiece: CMSInput,
    externals: ExternalReference[]
  ) => Promise<void>;
  locales?: Locale[];
  contextParams?: ContextParams;
  onClose?: () => void;
  mode?: EditorMode;
  rootContainer?: "content" | "grid" | (string & Record<never, never>);
  container?: HTMLElement;
  heightMode?: "viewport" | "parent";
  canvasUrl?: string;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

export function launchEditor(props: EditorLauncherProps) {
  const rootNode =
    props.container ?? document.getElementById("shopstory-main-window");

  if (!rootNode) {
    throw new Error("Can't find #shopstory-main-window element");
  }

  const locales =
    props.config.locales ?? props.locales ?? raiseError("Missing locales");
  const editorSearchParams = parseEditorSearchParams();
  const contextParams =
    editorSearchParams.contextParams ??
    props.contextParams ??
    raiseError(`Missing "contextParams" value.`);
  const rootContainer =
    editorSearchParams.rootContainer ?? props.rootContainer ?? props.mode;
  const mode = editorSearchParams.mode ?? "playground";

  if (!rootContainer) {
    throw new Error(`Missing "rootContainer" prop`);
  }

  const reactRoot = createRoot(rootNode);

  reactRoot.render(
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider supabaseClient={supabaseClient}>
        <HashRouter>
          <StyleSheetManager shouldForwardProp={isPropValid}>
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
                configs={props.configs}
                save={props.save}
                onClose={props.onClose}
                canvasUrl={props.canvasUrl}
                container={props.container}
                heightMode={props.heightMode}
              />
              <Toaster containerStyle={{ zIndex: 100100 }} />
            </SSModalContext.Provider>
          </StyleSheetManager>
        </HashRouter>
      </SessionContextProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );

  return () => {
    reactRoot.unmount();
  };
}

type EditorSearchParams = {
  mode: "app" | "playground" | null;
  documentId: string | null;
  source: string | null;
  uniqueSourceIdentifier: string | null;
  rootContainer: EditorLauncherProps["rootContainer"] | null;
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
