import {
  CompilationMetadata,
  CompiledShopstoryComponentConfig,
  NoCodeComponentEntry,
  ExternalData,
  ExternalReference,
  WidgetComponentProps,
} from "@easyblocks/core";
import { EditorContextType } from "./EditorContext";

export type OpenComponentPickerConfig = {
  path: string;
  componentTypes?: string[];
  domRect?: DOMRect;
};

export type MoveItemActionType = {
  from: number;
  to: number;
  name: string;
};

export type RemoveItemActionType = {
  index: number;
  name: string;
};

type InsertItemActionType = {
  name: string;
  index: number;
  block: NoCodeComponentEntry;
};

export type DuplicateItemActionType = {
  name: string;
  sourceIndex: number;
  targetIndex: number;
};

export type OpenTemplateModalActionCreate = {
  mode: "create";
  config: NoCodeComponentEntry;
  width?: number;
  widthAuto?: boolean;
};

type OpenTemplateModalActionEdit = {
  mode: "edit";
  template: Template;
};

export type OpenTemplateModalAction =
  | OpenTemplateModalActionCreate
  | OpenTemplateModalActionEdit;

export type ActionsType = {
  openComponentPicker: (
    config: OpenComponentPickerConfig
  ) => Promise<NoCodeComponentEntry | undefined>;
  openTemplateModal: (arg: OpenTemplateModalAction) => void;
  moveItems: (
    fieldNames: Array<string>,
    direction: "top" | "right" | "bottom" | "left"
  ) => void;
  replaceItems: (paths: Array<string>, newConfig: NoCodeComponentEntry) => void;
  removeItems: (fieldNames: Array<string>) => void;
  insertItem: (insertItemProps: InsertItemActionType) => void;
  duplicateItems: (fieldNames: Array<string>) => void;
  pasteItems: (items: Array<NoCodeComponentEntry>) => void;
  runChange: <Callback extends () => Array<string> | void>(
    configChangeCallback: Callback
  ) => void;
  logSelectedItems: () => void;
  notify: (message: string) => void;
};

type TemplateBase = {
  id?: string;
  label?: string;
  type?: string;
  previewImage?: string;
  group?: string;
  isRemoteUserDefined?: boolean;
};

export type Template = TemplateBase & {
  isGroupEmptyTemplate?: boolean;
  mapTo?: string | string[];
  isDefaultTextModifier?: boolean; // maybe to remove in the future. But we need to know which template is default text modifier!
  entry: NoCodeComponentEntry; // this includes type and id!!!
  configId?: string;
  isRemoteUserDefined?: boolean;
  previewSettings?: {
    width: number;
    widthAuto: boolean;
  };
};

export type FieldMixedValue = { __mixed__: true };

export type EditorWindowAPI = {
  editorContext: EditorContextType;
  onUpdate?: () => void; // this function will be called by parent window when data is changed, child should "subscribe" to this function
  meta: CompilationMetadata;
  compiled: CompiledShopstoryComponentConfig;
  externalData: ExternalData;
};

export type InternalWidgetComponentProps = Omit<
  WidgetComponentProps,
  "onChange"
> & {
  onChange: (id: ExternalReference["id"], key?: string) => void;
  resourceKey?: string;
  path: string;
};
