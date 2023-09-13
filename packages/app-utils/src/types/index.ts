import {
  CompilationMetadata,
  CompiledComponentConfig,
  CompiledShopstoryComponentConfig,
  ComponentConfig,
  ComponentConfigBase,
  ComponentDefinitionShared,
  ConfigComponent,
  ContextParams,
  Devices,
  EditingFunction,
  EditingInfoBase,
  EventSink,
  FieldPortal,
  Locale,
  Metadata,
  RefMap,
  Resource,
  ResourceDefinition,
  ResponsiveValue,
  SchemaProp,
  Template,
  TemplateBase,
  Theme,
  TrulyResponsiveValue,
} from "@easyblocks/core";
import type { PartialDeep } from "type-fest";
import { InternalAnyTinaField } from "../schema";
import { Form } from "../tinacms";

export * from "./ConfigComponentIdentifier";
export * from "./ConfigModel";
export * from "./ConfigOrConfigArray";

export type UnwrapResponsiveValue<T> = T extends ResponsiveValue<infer Value>
  ? Value
  : never;

export type InternalRenderableComponentDefinition<
  Identifier extends string = string
> = ComponentDefinitionShared<Identifier> & {
  pasteSlots?: string[];
  componentCode?: string | { client: string; editor?: string }; // optional because it might be also an action or built-in component
  styles?: any;
  editing?: EditingFunction;
  auto?: AutoFunction;
};
export type InternalActionComponentDefinition = ComponentDefinitionShared;

export type InternalLinkDefinition = ComponentDefinitionShared;

export type InternalComponentDefinition =
  | InternalRenderableComponentDefinition
  | InternalActionComponentDefinition
  | InternalLinkDefinition
  | InternalTextModifierDefinition;

export type InternalComponentDefinitions = {
  components: InternalRenderableComponentDefinition[];
  actions: InternalActionComponentDefinition[];
  links: InternalLinkDefinition[];
  textModifiers: InternalTextModifierDefinition[];
};

export type InternalTextModifierDefinition = ComponentDefinitionShared & {
  apply: (props: Record<string, any>) => Record<string, any>;
  childApply?: (props: Record<string, any>) => Record<string, any>;
};

export type CompilationContextType = {
  devices: Devices;
  theme: Theme;
  resourceTypes: {
    [key: string]: ResourceDefinition;
  };
  definitions: InternalComponentDefinitions;
  mainBreakpointIndex: string;
  isEditing?: boolean;
  contextParams: ContextParams;
  eventSink?: EventSink;
  strict?: boolean;
  locales?: Array<Locale>;
  rootContainer: string;
  rootContainers: Array<CompilationRootContainer>;
};

export type CompilationRootContainer = {
  id: string;
  defaultConfig: ComponentConfig;
  widths?: Record<string, string | number>;
  resource?: {
    type: string;
  };
};

export type ComponentConfigChangeFunction = (arg: {
  value: any;
  closestDefinedValue: any;
  // closestDefinedValue: any;
  // /**
  //  * closestDefinedValue, why?
  //  *
  //  * 1. When change is called, the value can be undefined (resetting in auto).
  //  * 2. But sometimes we need to know what auto value will be applied for this new undefined val.
  //  * 3. We can't run auto here, it's too heavy. We just apply "responsiveValueGet" and this is our "guess" for now.
  //  * 4. Remember that if we had a real auto here, after change, auto values can change again, and that should trigger another change etc... Very bad recursions.
  //  * 5. That's why custom change is tricky, we must remember about that.
  //  *
  //  */
  fieldName: string;
  values: Record<string, any>;
  closestDefinedValues: Record<string, any>;
}) => Record<string, any>;

export type AutoFunction = (
  values: Record<string, any>,
  compilationContext: CompilationContextType,
  width: TrulyResponsiveValue<number>
) => Record<string, any>;

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
  getTemplates: (componentTypes: Array<string>) => Array<AnyTemplate>;
};

export type EditorContextType = CompilationContextType & {
  breakpointIndex: string;
  locales: Locale[];
  setBreakpointIndex: (breakpoint: string) => void;
  resources: Array<Resource>;
  form: Form;
  focussedField: Array<string>;
  setFocussedField: (focusedFields: string | Array<string>) => void;
  actions: EditorActions;
  activeRootContainer: CompilationRootContainer;
};

export type InternalCompilationOutput = {
  compiled: CompiledShopstoryComponentConfig;
  meta: CompilationMetadata;
};

export type EditorCompilationOutput = InternalCompilationOutput & {
  configAfterAuto: ConfigComponent;
};

export type EditorWindowAPI = {
  config: ConfigComponent;
  editorContext: EditorContextType;
  compilationOutput: EditorCompilationOutput;
  onUpdate?: () => void; // this function will be called by parent window when data is changed, child should "subscribe" to this function
  meta: Metadata;
  compiled: CompiledComponentConfig;
};

export type EditableComponentToComponentConfig<
  EditableComponent extends {
    id: string;
    label?: string;
    tags: string[];
    schema: Array<SchemaProp>;
  }
> = ComponentConfigBase<EditableComponent["id"]> & {
  $$$refs?: RefMap;
};

export type Alignment = "center" | "left" | "right";

export interface CompiledComponentCollectionValues {
  index: number;
  length: number;
}

export type SpecialTemplate = TemplateBase & {
  specialRole: "card";
};

export type AnyTemplate = SpecialTemplate | Template;

export type CompressedConfig = {
  __compressed: string;
};

export type ContextProps = Record<string, any>;
