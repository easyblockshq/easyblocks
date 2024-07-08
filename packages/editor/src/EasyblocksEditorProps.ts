import {
  RequestedExternalData,
  Config,
  ContextParams,
  ExternalData,
  InlineTypeWidgetComponentProps,
  WidgetComponentProps,
} from "@easyblocks/core";
import React, { ComponentType } from "react";
import { Form } from "./form";
import { InternalAnyField } from "@easyblocks/core/_internals";

export type ExternalDataChangeHandler = (
  externalData: RequestedExternalData,
  contextParams: ContextParams
) => void;

export type EditorSidebarLeftProps = {
  focussedField: string[];
  form: Form<any, InternalAnyField>;
};

export type EasyblocksEditorPlugins = {
  components?: {
    sidebarLeft?: ComponentType<EditorSidebarLeftProps>;
  };
};

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
  plugins?: EasyblocksEditorPlugins;
  __debug?: boolean;
};
