import { Form } from "@easyblocks/app-utils";
import {
  CompiledComponentConfig,
  ComponentConfig,
  Resource,
  Template,
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
