import { Form } from "@easyblocks/app-utils";
import {
  CompiledComponentConfig,
  ComponentConfig,
  ExternalTypeDefinition,
  InlineTypeDefinition,
  InlineTypeWidgetComponentProps,
  Resource,
  Template,
  TokenTypeDefinition,
  TokenTypeWidgetComponentProps,
  Widget,
  WidgetComponentProps,
  Document,
  Backend,
} from "@easyblocks/core";
import {
  EditorContextType as BaseEditorContextType,
  CompilationCache,
  InternalAnyField,
  InternalComponentDefinition,
} from "@easyblocks/core/_internals";
import React, { ComponentType, useContext } from "react";
import { ActionsType } from "./types";

export type EditorExternalTypeDefinition = Omit<
  ExternalTypeDefinition,
  "widgets"
> & {
  widgets: Array<
    Widget & {
      component?: ComponentType<WidgetComponentProps<any>>;
    }
  >;
};

export type EditorInlineTypeDefinition = Omit<
  InlineTypeDefinition,
  "widgets"
> & {
  widget: Widget & {
    component?: ComponentType<InlineTypeWidgetComponentProps<any>>;
  };
};

export type EditorTokenTypeDefinition = Omit<TokenTypeDefinition, "widgets"> & {
  widget: Widget & {
    component?: ComponentType<TokenTypeWidgetComponentProps<any>>;
  };
};

export type EditorContextType = Omit<BaseEditorContextType, "types"> & {
  backend: Backend;
  templates?: Template[];
  syncTemplates: () => void;
  focussedField: Array<string>;
  setFocussedField: (field: Array<string> | string) => void;
  form: Form<any, InternalAnyField>;
  isMaster?: boolean;
  isEditing?: boolean;
  actions: ActionsType;
  save: (document: Document) => Promise<void>;
  compiledComponentConfig?: CompiledComponentConfig;
  configAfterAuto?: ComponentConfig;
  resources: Array<Resource>;
  compilationCache: CompilationCache;
  isAdminMode: boolean;
  readOnly: boolean;
  disableCustomTemplates: boolean;
  isFullScreen: boolean;
  types: Record<
    string,
    | EditorExternalTypeDefinition
    | EditorInlineTypeDefinition
    | EditorTokenTypeDefinition
  >;
  components: Record<string, ComponentType<any>>;
};

export const EditorContext = React.createContext<EditorContextType | null>(
  null
);

export function useEditorContext() {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("EditorContext not defined");
  }
  return context;
}
