import { Form } from "@easyblocks/app-utils";
import {
  CompiledComponentConfig,
  ComponentConfig,
  Resource,
  Template,
  Document,
  Backend,
} from "@easyblocks/core";
import {
  EditorContextType as BaseEditorContextType,
  CompilationCache,
  InternalAnyField,
} from "@easyblocks/core/_internals";
import React, { useContext } from "react";
import { EditorWidget } from "./sidebar/types";
import { ActionsType, TextSyncers } from "./types";

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
  types: Record<string, { widgets: Array<EditorWidget> }>;
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
