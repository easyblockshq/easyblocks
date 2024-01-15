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
} from "@easyblocks/core";
import {
  EditorContextType as BaseEditorContextType,
  CompilationCache,
  InternalAnyField,
} from "@easyblocks/core/_internals";
import React, { ComponentType, useContext } from "react";
import { ActionsType, TextSyncers } from "./types";

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
  templates?: Template[];
  syncTemplates: () => void;
  focussedField: Array<string>;
  setFocussedField: (field: Array<string> | string) => void;
  form: Form<any, InternalAnyField>;
  isMaster?: boolean;
  isEditing?: boolean;
  actions: ActionsType;
  text?: TextSyncers;
  save: (document: {
    id: string;
    version: number;
    updatedAt: number;
    projectId: string;
  }) => Promise<void>;
  compiledComponentConfig?: CompiledComponentConfig;
  configAfterAuto?: ComponentConfig;
  resources: Array<Resource>;
  compilationCache: CompilationCache;
  isAdminMode: boolean;
  project: {
    id: string;
    name: string;
    token: string;
  };
  isPlayground: boolean;
  disableCustomTemplates: boolean;
  isFullScreen: boolean;
  types: Record<
    string,
    | EditorExternalTypeDefinition
    | EditorInlineTypeDefinition
    | EditorTokenTypeDefinition
  >;
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
