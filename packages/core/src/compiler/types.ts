import { PartialDeep, SetRequired } from "type-fest";
import { Locale } from "../locales";
import {
  Builder,
  ComponentConfigBase,
  ComponentDefinitionShared,
  ContextParams,
  Devices,
  EditingInfoBase,
  ExternalSchemaProp,
  ExternalTypeDefinition,
  FieldPortal,
  InlineTypeDefinition,
  NoCodeComponentAutoFunction,
  NoCodeComponentDefinition,
  NoCodeComponentEditingFunction,
  NoCodeComponentEntry,
  NoCodeComponentStylesFunction,
  ResponsiveValue,
  SchemaProp,
  Spacing,
  Template,
  ThemeTokenValue,
  TokenTypeDefinition,
} from "../types";
import { InternalAnyTinaField } from "./schema";

export type Theme = {
  space: {
    [key: string]: ThemeTokenValue<ResponsiveValue<Spacing>>;
  };
  [key: string]: {
    [key: string]: ThemeTokenValue<any>;
  };
};

export type CompilationDocumentType = {
  id: string;
  label?: string;
  entry: Omit<NoCodeComponentEntry, "_id">;
  widths: Record<string, number>;
  schema?: Array<ExternalSchemaProp>;
};

export type CompilationContextCustomTypeDefinition =
  | InlineTypeDefinition
  | SetRequired<ExternalTypeDefinition, "widgets">
  | TokenTypeDefinition;

export type CompilationContextType = {
  devices: Devices;
  theme: Theme;
  types: Record<string, CompilationContextCustomTypeDefinition>;
  // FIXME
  definitions: any;
  mainBreakpointIndex: string;
  isEditing?: boolean;
  contextParams: ContextParams;
  strict?: boolean;
  locales: Array<Locale>;
  rootComponent: NoCodeComponentDefinition;
  builder: Builder;
};

export type EditableComponentToComponentConfig<
  EditableComponent extends {
    id: string;
    label?: string;
    type?: string | string[];
    schema: Array<SchemaProp>;
  }
> = ComponentConfigBase<EditableComponent["id"]>;

export type CompiledNoCodeComponentProps<
  Identifier extends string = string,
  StateProps extends Record<string, any> = Record<string, any>,
  ContextProps extends Record<string, any> = Record<string, any>,
  Styles extends Record<string, unknown> = Record<string, unknown>
> = {
  _component: Identifier;
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
  rootParams?: NoCodeComponentDefinition["rootParams"];
};

export type InternalComponentDefinition = InternalRenderableComponentDefinition;

export type InternalComponentDefinitions = {
  components: InternalRenderableComponentDefinition<string, any, any>[];
};

type EditorActions = {
  notify: (message: string) => void;
  openComponentPicker: (config: {
    path: string;
    componentTypes?: string[];
  }) => Promise<NoCodeComponentEntry | undefined>;
  moveItems: (
    fieldNames: Array<string>,
    direction: "top" | "right" | "bottom" | "left"
  ) => void;
  replaceItems: (paths: Array<string>, newConfig: NoCodeComponentEntry) => void;
  removeItems: (fieldNames: Array<string>) => void;
  insertItem: (insertItemProps: {
    name: string;
    index: number;
    block: NoCodeComponentEntry;
  }) => void;
  duplicateItems: (fieldNames: Array<string>) => void;
  pasteItems: (items: Array<NoCodeComponentEntry>) => void;
  runChange: <Callback extends () => Array<string> | void>(
    configChangeCallback: Callback
  ) => void;
  logSelectedItems: () => void;
};

export type EditorContextType = CompilationContextType & {
  breakpointIndex: string;
  locales: Locale[];
  form: any;
  focussedField: Array<string>;
  setFocussedField: (focusedFields: string | Array<string>) => void;
  actions: EditorActions;
  templates?: Template[];
};
