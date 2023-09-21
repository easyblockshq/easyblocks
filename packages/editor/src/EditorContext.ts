import {
  AnyTemplate,
  EditorContextType as BaseEditorContextType,
  Form,
  InternalAnyField,
} from "@easyblocks/app-utils";
import { CompilationCache } from "@easyblocks/compiler";
import {
  CompiledComponentConfig,
  ConfigComponent,
  Resource,
  ResourcesStore,
} from "@easyblocks/core";
import React, { useContext } from "react";
import { ActionsType, TextSyncers } from "./types";

export type EditorContextType = BaseEditorContextType & {
  templates?: Record<string, AnyTemplate[]>;
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
  configAfterAuto?: ConfigComponent;
  resources: Array<Resource>;
  compilationCache: CompilationCache;
  isAdminMode: boolean;
  project: {
    id: string;
    name: string;
    token: string;
  };
  isPlayground: boolean;
  resourcesStore: ResourcesStore;
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
