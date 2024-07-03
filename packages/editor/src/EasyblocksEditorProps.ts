import {
  RequestedExternalData,
  Config,
  ContextParams,
  ExternalData,
  InlineTypeWidgetComponentProps,
  WidgetComponentProps,
} from "@easyblocks/core";
import React, { ComponentType } from "react";
import { TemplatePicker } from "./TemplatePicker";

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
  pickers?: Record<string, TemplatePicker>;
  __debug?: boolean;
};
