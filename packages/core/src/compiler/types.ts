import { PartialDeep } from "type-fest";
import { Locale } from "../locales";
import {
  Devices,
  ExternalDefinition,
  ContextParams,
  EventSink,
  ComponentConfig,
  ExternalSchemaProp,
  SchemaProp,
  ComponentConfigBase,
  RefMap,
  EditingInfoBase,
  FieldPortal,
  ComponentDefinitionShared,
  NoCodeComponentStylesFunction,
  NoCodeComponentEditingFunction,
  NoCodeComponentAutoFunction,
  Resource,
  Template,
} from "../types";
import { Theme } from "./theme";
import { InternalAnyTinaField } from "./schema";

export type CompilationDocumentType = {
  id: string;
  label?: string;
  defaultConfig: Omit<ComponentConfig, "_id">;
  widths: Record<string, number>;
  schema?: Array<ExternalSchemaProp>;
};

export type CompilationContextType = {
  devices: Devices;
  theme: Theme;
  types: {
    [key: string]: ExternalDefinition;
  };
  // FIXME
  definitions: any;
  mainBreakpointIndex: string;
  isEditing?: boolean;
  contextParams: ContextParams;
  eventSink?: EventSink;
  strict?: boolean;
  locales?: Array<Locale>;
  documentType: string;
  documentTypes: Array<CompilationDocumentType>;
};

export type EditableComponentToComponentConfig<
  EditableComponent extends {
    id: string;
    label?: string;
    type?: string | string[];
    schema: Array<SchemaProp>;
  }
> = ComponentConfigBase<EditableComponent["id"]> & {
  $$$refs?: RefMap;
};

export type CompiledNoCodeComponentProps<
  Identifier extends string = string,
  StateProps extends Record<string, any> = Record<string, any>,
  ContextProps extends Record<string, any> = Record<string, any>,
  Styles extends Record<string, unknown> = Record<string, unknown>
> = {
  _template: Identifier;
  _id: string;
  path: string;
  runtime: any;
  isEditing: boolean;
} & StateProps & {
    [key in keyof Omit<Styles, "__props">]: React.ReactElement;
  } & ContextProps;

export type EditingInfoComponent = EditingInfoBase & {
  fields: any[]; //AnyTinaField[];
};

export type EditingInfoComponentCollection = {
  items: EditingInfoComponent[];
};

// When calculating editing info, field ALWAYS points to single path.
// It's not aware of selection made within the editor.
export type InternalEditingField = Omit<InternalAnyTinaField, "name"> & {
  name: string;
};

export type InternalEditingInfo = {
  fields: Array<InternalEditingField>;
  components: {
    [field: string]: EditingInfoComponent | EditingInfoComponentCollection;
  };
};

export type InternalEditingFunctionResult = {
  fields?: Array<InternalEditingField | FieldPortal>;
  components?: {
    [field: string]: PartialDeep<
      EditingInfoComponent | EditingInfoComponentCollection
    >;
  };
};

export type ContextProps = Record<string, any>;

export type InternalRenderableComponentDefinition<
  Identifier extends string = string,
  Values extends Record<string, any> = Record<string, any>,
  Params extends Record<string, any> = Record<string, any>
> = ComponentDefinitionShared<Identifier> & {
  pasteSlots?: string[];
  styles?: NoCodeComponentStylesFunction<Values, Params>;
  editing?: NoCodeComponentEditingFunction<Values, Params>;
  auto?: NoCodeComponentAutoFunction<Values, Params>;
};
export type InternalActionComponentDefinition = ComponentDefinitionShared;

export type InternalLinkDefinition = ComponentDefinitionShared;

export type InternalComponentDefinition =
  | InternalRenderableComponentDefinition
  | InternalActionComponentDefinition
  | InternalLinkDefinition
  | InternalTextModifierDefinition;

export type InternalComponentDefinitions = {
  components: InternalRenderableComponentDefinition<string, any, any>[];
  actions: InternalActionComponentDefinition[];
  links: InternalLinkDefinition[];
  textModifiers: InternalTextModifierDefinition[];
};

export type InternalTextModifierDefinition = ComponentDefinitionShared & {
  apply: (props: Record<string, any>) => Record<string, any>;
  childApply?: (props: Record<string, any>) => Record<string, any>;
};

type EditorActions = {
  notify: (message: string) => void;
  openComponentPicker: (config: {
    path: string;
    componentTypes?: string[];
  }) => Promise<ComponentConfig | undefined>;
  moveItems: (
    fieldNames: Array<string>,
    direction: "top" | "right" | "bottom" | "left"
  ) => void;
  replaceItems: (paths: Array<string>, newConfig: ComponentConfig) => void;
  removeItems: (fieldNames: Array<string>) => void;
  insertItem: (insertItemProps: {
    name: string;
    index: number;
    block: ComponentConfig;
  }) => void;
  duplicateItems: (fieldNames: Array<string>) => void;
  pasteItems: (items: Array<ComponentConfig>) => void;
  runChange: <Callback extends () => Array<string> | void>(
    configChangeCallback: Callback
  ) => void;
  logSelectedItems: () => void;
};

export type EditorContextType = CompilationContextType & {
  breakpointIndex: string;
  locales: Locale[];
  setBreakpointIndex: (breakpoint: string) => void;
  resources: Array<Resource>;
  form: any;
  focussedField: Array<string>;
  setFocussedField: (focusedFields: string | Array<string>) => void;
  actions: EditorActions;
  activeDocumentType: CompilationDocumentType;
  templates?: Template[];
  isFullScreen: boolean;
};
