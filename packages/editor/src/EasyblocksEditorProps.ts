import {
  RequestedExternalData,
  Config,
  ContextParams,
  ExternalData,
  InlineTypeWidgetComponentProps,
  WidgetComponentProps,
  Renderer,
} from "@easyblocks/core";
import React, { ComponentType } from "react";

export type ExternalDataChangeHandler = (
  externalData: RequestedExternalData,
  contextParams: ContextParams
) => void;

export type EasyblocksEditorProps = {
  config: Config;
  externalData?: ExternalData;
  onExternalDataChange?: ExternalDataChangeHandler;
  components?: Record<string, React.ComponentType<any>>;
  widgets?: Record<
    string,
    | ComponentType<WidgetComponentProps<any>>
    | ComponentType<InlineTypeWidgetComponentProps<any>>
  >;
  renderer?: Renderer;
  __debug?: boolean;
};
