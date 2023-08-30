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
  LocalizedText,
  Resource,
  ResourceDefinition,
} from "@easyblocks/core";
import React, { useContext } from "react";
import { ActionsType, TextSyncers, VariantsManager } from "./types";

export type EditorContextType = BaseEditorContextType & {
  templates?: Record<string, AnyTemplate[]>;
  syncTemplates: () => void;
  focussedField: Array<string>;
  setFocussedField: (field: Array<string> | string) => void;
  form: Form<any, InternalAnyField>;
  isMaster?: boolean;
  isEditing?: boolean;
  actions: ActionsType;
  text?: ResourceDefinition<LocalizedText> & TextSyncers;
  save: (document: {
    id: string;
    version: number;
    updatedAt: number;
    projectId: string;
  }) => Promise<void>;
  compiledComponentConfig?: CompiledComponentConfig;
  configAfterAuto?: ConfigComponent;
  variantsManager?: VariantsManager;
  resources: Array<Resource>;
  compilationCache: CompilationCache;
  isAdminMode: boolean;
  launcher?: {
    id: string;
    icon?: string;
  };
  project?: {
    id: string;
    name: string;
    token: string;
  };
  isPlayground: boolean;
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
