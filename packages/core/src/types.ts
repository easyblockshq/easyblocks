import { ComponentType, ReactElement } from "react";
import { PartialDeep } from "type-fest";
import { Locale } from "./locales";

export type ScalarOrCollection<T> = T | Array<T>;

export interface PlaceholderAppearance {
  width?: number;
  height?: number;
  aspectRatio?: number;
  label?: string;
}

export interface ComponentConfigBase<Identifier extends string> {
  _component: Identifier;
  _id: string;
}

export interface NoCodeComponentEntry {
  _component: string; // instance of the component (unique id)
  _id: string;
  [key: string]: any; // props
}

export interface ThemeTokenValue<T> {
  value: T;
  isDefault: boolean;
  label?: string;
}

export type Spacing = string; // 10px, 0px, 10vw, etc

export type Font = object;

export type Color = string;

export interface TrulyResponsiveValue<T> {
  [key: string]: T | true | undefined;
  $res: true;
}

export type ResponsiveValue<T> = T | TrulyResponsiveValue<T>;

export type ThemeSpaceScalar = number | string;

export type ThemeSpace = ResponsiveValue<ThemeSpaceScalar>;

export type ThemeColor = ResponsiveValue<Color>;

export type ThemeFont = ResponsiveValue<{ [key: string]: any }>;

export interface ButtonCustomComponent extends CustomComponentShared {
  builtinProps?: {
    label?: "on" | "off";
    symbol?: "on" | "off" | "optional";
  };
}

export type StringSchemaProp = ValueSchemaProp<"string", string, "optional"> &
  SchemaPropParams<{
    normalize?: (x: string) => string | null;
  }>;

export type NumberSchemaProp = ValueSchemaProp<"number", number, "optional"> &
  SchemaPropParams<{
    min?: number;
    max?: number;
  }>;

export type BooleanSchemaProp = ValueSchemaProp<"boolean", boolean, "optional">;

export type Option =
  | {
      value: string;
      label?: string;
      icon?: string | ComponentType<{ size?: number; isStroke?: boolean }>;
      hideLabel?: boolean;
    }
  | string;

export type SelectSchemaProp = ValueSchemaProp<"select", string, "optional"> &
  SchemaPropParams<
    {
      options: Option[];
    },
    true
  >;

export type RadioGroupSchemaProp = ValueSchemaProp<
  "radio-group",
  string,
  "optional"
> &
  SchemaPropParams<
    {
      options: Option[];
    },
    true
  >;

/**
 * Why do Space, Color and Font have ValueType ResponsiveValue<TokenValue<ResponsiveValue<Color>>> type? It's complex! (T is Color / Space / Font).
 *
 * 1. For now values can be only RefValues (we don't have custom values, every space, color and font must be reference to a theme). Therefore TokenValue.
 * 2. In a theme, fonts, spaces and colors (defined by developer) can be responsive. Therefore TokenValue<ResponsiveValue<T>>
 * 3. User in editor can pick RESPONSIVELY different RefValues (that are responsive too). It's complex but makes sense.
 *
 * CompileType is obviously very simple because after compilation we just have "CSS output" which is basically responsive non-ref value (there's no concept of refs after compilation)
 */

export type ColorSchemaProp = ValueSchemaProp<
  "color",
  ResponsiveValue<TokenValue<Color>>,
  "forced"
>;

export type StringTokenSchemaProp = ValueSchemaProp<
  "stringToken",
  ResponsiveValue<TokenValue<string>>,
  "forced"
> &
  SchemaPropParams<
    {
      tokenId:
        | "numberOfItemsInRow"
        | "aspectRatios"
        | "containerWidths"
        | "boxShadows";
      extraValues?: Array<string | { value: string; label: string }>; // extra values are usually non-token values that are displayed in the select as if they were tokens, the component must understand them
    },
    true
  >;

export interface SpaceSchemaProp
  extends ValueSchemaProp<
      "space",
      ResponsiveValue<TokenValue<Spacing>>,
      "forced"
    >,
    SchemaPropParams<{ prefix?: string; autoConstant?: number }> {}

export type FontSchemaProp = ValueSchemaProp<
  "font",
  ResponsiveValue<TokenValue<Font>>,
  "forced"
>;

export type IconSchemaProp = ValueSchemaProp<
  "icon",
  TokenValue<string>,
  "never"
>;

export type ComponentPickerType = "large" | "large-3" | "compact";

export type PassedField =
  | { name: string; label: string; showWhen?: any; group?: string }
  | string;

export interface ComponentSchemaProp extends SchemaPropShared<"component"> {
  accepts: string[];
  picker?: ComponentPickerType;
  required?: boolean;
  noInline?: boolean;
  placeholderAppearance?: PlaceholderAppearance;
}

export interface ComponentCollectionSchemaProp
  extends SchemaPropShared<"component-collection"> {
  accepts: string[];
  picker?: ComponentPickerType;
  hideFields?: string[];
  itemFields?: SchemaProp[];
  passFields?: PassedField[];
  noInline?: boolean;
  placeholderAppearance?: PlaceholderAppearance;
}

export type ComponentCollectionLocalisedSchemaProp = Omit<
  ComponentCollectionSchemaProp,
  "type"
> & {
  type: "component-collection-localised";
  noInline?: boolean;
  placeholderAppearance?: PlaceholderAppearance;
};

export interface TextSchemaProp
  extends ValueSchemaProp<
    "text",
    LocalTextReference | ExternalReference | string,
    "never"
  > {
  normalize?: (x: string) => string | null;
  [key: string]: any;
}

export type PositionVertical = "top" | "center" | "bottom";

export type PositionHorizontal = "left" | "center" | "right";

export type Position = `${PositionVertical}-${PositionHorizontal}`;

export type PositionSchemaProp = ValueSchemaProp<
  "position",
  ResponsiveValue<Position>,
  "forced"
>;

export interface ExternalSchemaProp
  extends ValueSchemaProp<
    string & Record<never, never>,
    ExternalReference,
    "optional"
  > {
  params?: ExternalParams;
  optional?: boolean;
}

export type LocalSchemaProp = ValueSchemaProp<
  string & Record<never, never>,
  any,
  "optional"
>;

export interface TokenSchemaProp
  extends ValueSchemaProp<string & Record<never, never>, any, "forced">,
    SchemaPropParams<{
      extraValues: Array<any | { value: any; label: string }>;
    }> {}

export type SchemaProp =
  | StringSchemaProp
  | NumberSchemaProp
  | BooleanSchemaProp
  | SelectSchemaProp
  | RadioGroupSchemaProp
  | ColorSchemaProp
  | SpaceSchemaProp
  | FontSchemaProp
  | StringTokenSchemaProp
  | IconSchemaProp
  | TextSchemaProp
  | ComponentSchemaProp
  | ComponentCollectionSchemaProp
  | ComponentCollectionLocalisedSchemaProp
  | PositionSchemaProp
  | ExternalSchemaProp
  | LocalSchemaProp
  | TokenSchemaProp;

export type AnyValueSchemaProp =
  | StringSchemaProp
  | NumberSchemaProp
  | BooleanSchemaProp
  | SelectSchemaProp
  | RadioGroupSchemaProp
  | ColorSchemaProp
  | SpaceSchemaProp
  | FontSchemaProp
  | StringTokenSchemaProp
  | IconSchemaProp
  | TextSchemaProp
  | PositionSchemaProp
  | ExternalSchemaProp;

interface CustomComponentShared {
  id: string;
  hidden?: boolean;
  schema: SchemaProp[];
  label?: string;
  previewImage?: string;
}

export interface ConfigDeviceRange {
  startsFrom?: number;
  w?: number;
  h?: number | null;
  hidden?: boolean;
}

export interface ConfigDevices {
  xs?: ConfigDeviceRange;
  sm?: ConfigDeviceRange;
  md?: ConfigDeviceRange;
  lg?: ConfigDeviceRange;
  xl?: ConfigDeviceRange;
  "2xl"?: ConfigDeviceRange;
}

export interface UserDefinedTemplate {
  id: string;
  label: string;
  thumbnail?: string;
  thumbnailLabel?: string;
  entry: NoCodeComponentEntry;
  isUserDefined: true;
  width?: number;
  widthAuto?: boolean;
}

export interface InternalTemplate {
  id: string;
  label?: string;
  thumbnail?: string;
  thumbnailLabel?: string;
  entry: NoCodeComponentEntry;
  isUserDefined?: false;
  width?: number;
  widthAuto?: boolean;
}

export type Template = InternalTemplate | UserDefinedTemplate;

export interface ConfigTokenValue<T> {
  id: string;
  label?: string;
  value: T;
  isDefault?: boolean;
}

export type ExternalParams = Record<string, unknown>;

export interface ContextParams {
  locale: string;
  [key: string]: any;
}

export interface WidgetComponentProps<
  Identifier extends NonNullish = NonNullish
> {
  id: ExternalReference<Identifier>["id"];
  onChange: (newId: ExternalReference<Identifier>["id"]) => void;
  params?: Record<string, any>;
}

export interface InlineTypeWidgetComponentProps<
  Type extends NonNullish = NonNullish
> {
  value: Type;
  onChange: (newValue: Type) => void;
  params?: Record<string, any>;
}

export type TokenTypeWidgetComponentProps<
  Type extends NonNullish = NonNullish
> = InlineTypeWidgetComponentProps<Type>;

export interface Widget {
  id: string;
  label: string;
}

export interface ExternalDefinition {
  widgets: Array<Widget>;
}

export interface LocalizedText {
  [locale: string]: string;
}

export interface NoCodeComponentStylesFunctionInput<
  Values extends Record<string, any> = Record<string, any>,
  Params extends Record<string, any> = Record<string, any>
> {
  values: Values;
  params: { $width: number; $widthAuto: boolean } & Params;
  device: DeviceRange;
  isEditing: boolean;
}

export type InferNoCodeComponentStylesFunctionInput<T> =
  T extends NoCodeComponentDefinition<infer Values, infer Params>
    ? NoCodeComponentStylesFunctionInput<Values, Params>
    : never;

export interface NoCodeComponentStylesFunctionResult {
  props?: Record<string, any>;
  components?: Record<
    string,
    {
      /**
       * `itemProps` can only be set if component prop is a collection.
       */
      itemProps?: Array<Record<string, any>>;
      [key: string]: any;
    }
  >;
  styled?: Record<string, ScalarOrCollection<Record<string, any>>>;
}

export type NoCodeComponentStylesFunction<
  Values extends Record<string, any> = Record<string, any>,
  Params extends Record<string, any> = Record<string, any>
> = (
  input: NoCodeComponentStylesFunctionInput<Values, Params>
) => NoCodeComponentStylesFunctionResult;

export interface NoCodeComponentEditingFunctionInput<
  Values extends Record<string, any> = Record<string, any>,
  Params extends Record<string, any> = Record<string, any>
> {
  values: Values;
  params: Params;
  editingInfo: EditingInfo;
  device: DeviceRange;
}

export type NoCodeComponentEditingFunction<
  Values extends Record<string, any> = Record<string, any>,
  Params extends Record<string, any> = Record<string, any>
> = (
  input: NoCodeComponentEditingFunctionInput<Values, Params>
) => NoCodeComponentEditingFunctionResult;

export interface NoCodeComponentAutoFunctionInput<
  Values extends Record<string, any> = Record<string, any>,
  Params extends Record<string, any> = Record<string, any>
> {
  values: { [key in keyof Values]: ResponsiveValue<Values[key]> };
  params: { [key in keyof Params]: ResponsiveValue<Params[key]> };
  devices: Devices;
}

export type NoCodeComponentAutoFunction<
  Values extends Record<string, any> = Record<string, any>,
  Params extends Record<string, any> = Record<string, any>
> = (
  input: NoCodeComponentAutoFunctionInput<Values, Params> & {
    params: { $width: TrulyResponsiveValue<number> };
  }
) => any;

export interface RootParameter {
  prop: string;
  label: string;
  widgets: Array<Widget>;
}

export interface NoCodeComponentDefinition<
  Values extends Record<string, any> = Record<string, any>,
  Params extends Record<string, any> = Record<string, any>
> {
  id: string;
  schema: Array<SchemaProp>;
  type?: string | string[];
  label?: string;
  styles?: NoCodeComponentStylesFunction<Values, Params>;
  editing?: NoCodeComponentEditingFunction<Values, Params>;
  auto?: NoCodeComponentAutoFunction<Values, Params>;
  change?: NoCodeComponentChangeFunction;
  pasteSlots?: Array<string>;
  thumbnail?: string;
  preview?: (input: {
    values: Values;
    externalData: ExternalData;
  }) => SidebarPreviewVariant | undefined;
  allowSave?: boolean;
  rootParams?: RootParameter[];
}

/**
 * @internal
 */
interface ConfigTokens {
  aspectRatios: string;
  boxShadows: string;
  containerWidths: number;
  colors: ThemeColor;
  fonts: ThemeFont;
  icons: string;
  space: ThemeSpace;
}

export interface InlineTypeDefinition<Value extends NonNullish = any> {
  widget: Widget;
  responsiveness?: "always" | "optional" | "never";
  type: "inline";
  defaultValue: Value;
  validate?: (value: any) => boolean;
}

export interface ExternalTypeDefinition {
  widgets?: Array<Widget>;
  responsiveness?: "always" | "optional" | "never";
  type: "external";
}

export interface TokenTypeDefinition<Value extends NonNullish = any> {
  widget?: Widget;
  responsiveness?: "always" | "optional" | "never";
  type: "token";
  token: keyof ConfigTokens | (string & Record<never, never>);
  defaultValue: { value: Value } | { tokenId: string };
  extraValues?: Array<Value | { value: Value; label: string }>;
  allowCustom?: boolean;
  validate?: (value: any) => boolean;
}

export type CustomTypeDefinition =
  | InlineTypeDefinition
  | ExternalTypeDefinition
  | TokenTypeDefinition;

/**
 * Backend types
 */

export interface Document {
  id: string;
  version: number;
  entry: NoCodeComponentEntry;
}

export interface Backend {
  documents: {
    get: (payload: { id: string; locale?: string }) => Promise<Document>;
    create: (payload: Omit<Document, "id" | "version">) => Promise<Document>;
    update: (payload: Omit<Document, "type">) => Promise<Document>;
  };
  templates: {
    get(payload: { id: string }): Promise<UserDefinedTemplate>;
    getAll: () => Promise<UserDefinedTemplate[]>;
    create: (payload: {
      label: string;
      entry: NoCodeComponentEntry;
      width?: number;
      widthAuto?: boolean;
    }) => Promise<UserDefinedTemplate>;
    update: (payload: {
      id: string;
      label: string;
    }) => Promise<Omit<UserDefinedTemplate, "entry">>;
    delete: (payload: { id: string }) => Promise<void>;
  };
}

/**
 * Config
 */

export interface Config {
  backend: Backend;
  components?: Array<NoCodeComponentDefinition<any, any>>;
  devices?: ConfigDevices;
  locales: Array<Locale>;
  types?: Record<string, CustomTypeDefinition>;
  disableCustomTemplates?: boolean;
  hideCloseButton?: boolean;
  templates?: Template[];
  tokens?: {
    [key in keyof ConfigTokens]?: Array<ConfigTokenValue<ConfigTokens[key]>>;
  } & {
    [key: string & Record<never, never>]: Array<ConfigTokenValue<any>>;
  };
}

export interface SchemaPropShared<Type extends string> {
  type: Type;
  prop: string;
  label?: string;
  isLabelHidden?: boolean;
  visible?:
    | boolean
    | ((
        allValues: any,
        options: {
          editorContext: any;
        }
      ) => boolean);
  description?: string;
  group?: string;
  layout?: "row" | "column";
}

type ValueSchemaProp<
  Type extends string,
  ValueType,
  Responsiveness extends "optional" | "forced" | "never"
> = SchemaPropShared<Type> & {
  defaultValue?: Responsiveness extends "optional" | "forced"
    ? ResponsiveValue<ValueType>
    : ValueType;
  buildOnly?: boolean;
  responsive?: Responsiveness extends "optional"
    ? boolean
    : Responsiveness extends "never"
    ? false
    : never;
};

export type SchemaPropParams<
  T extends Record<string, unknown>,
  Required extends boolean = false
> = Required extends true ? { params: T } : { params?: T };

export interface DeviceRange {
  id: string;
  w: number;
  h: number | null;
  breakpoint: number | null;
  hidden?: boolean;
  label?: string;
  isMain?: boolean;
}

export type Devices = DeviceRange[];

export type NoCodeComponentChangeFunction = (arg: {
  newValue: any;
  prop: string;
  values: Record<string, any>;
  valuesAfterAuto: Record<string, any>;
}) => Record<string, any> | undefined;

export interface SidebarPreviewVariant {
  description?: string;
  thumbnail?:
    | {
        type: "image";
        src: string;
      }
    | { type: "color"; color: string };
}

export interface ComponentDefinitionShared<Identifier extends string = string> {
  id: Identifier;
  label?: string;
  type?: string | string[];
  schema: SchemaProp[];
  thumbnail?: string;

  change?: NoCodeComponentChangeFunction;
  icon?: "link" | "grid_3x3";
  preview?: (input: {
    values: Record<string, any>;
    externalData: ExternalData;
  }) => SidebarPreviewVariant | undefined;
  previewImage?: string;

  hideTemplates?: boolean;
  allowSave?: boolean;
}

export interface NoCodeComponentProps {
  __easyblocks: {
    id: string;
    isEditing: boolean;
    isSelected?: boolean;
  };
}

export type SerializedRenderableComponentDefinition =
  ComponentDefinitionShared & {
    pasteSlots?: Array<string>;
  };

export type SerializedActionComponentDefinition = ComponentDefinitionShared;

export type SerializedLinkComponentDefinition = ComponentDefinitionShared;

export type SerializedTextModifierDefinition = ComponentDefinitionShared;

export interface SerializedComponentDefinitions {
  components: SerializedRenderableComponentDefinition[];
  actions: SerializedActionComponentDefinition[];
  links: SerializedLinkComponentDefinition[];
  textModifiers: SerializedTextModifierDefinition[];
}

export type SerializedComponentDefinition =
  | SerializedRenderableComponentDefinition
  | SerializedActionComponentDefinition
  | SerializedLinkComponentDefinition;

export interface NonEmptyRenderableContent {
  renderableContent: CompiledShopstoryComponentConfig;
  configAfterAuto?: any;
}

export interface EmptyRenderableContent {
  renderableContent: null;
}

export type RenderableContent =
  | EmptyRenderableContent
  | NonEmptyRenderableContent;

export interface RenderableDocument {
  renderableContent: CompiledShopstoryComponentConfig | null;
  meta: CompilationMetadata;
  configAfterAuto?: NoCodeComponentEntry;
}

export type AnyField = Field & { [key: string]: any };

export type AnyTinaField = AnyField;

export interface Field<
  F extends Field = AnyField,
  SchemaPropValue extends SchemaProp = SchemaProp
> {
  name: Array<string> | string;
  label?: string;
  description?: string;
  component: React.FC<any> | string | null;
  parse?: (value: any, name: string, field: F) => any;
  format?: (value: any, name: string, field: F) => any;
  defaultValue?: any;
  fields?: F[];
  group?: string;
  schemaProp: SchemaPropValue;
  hidden?: boolean;
  layout?: "row" | "column";
}

export type FieldPortal =
  | {
      portal: "component";
      source: string;
      includeHeader?: boolean;
      groups?: string[];
    }
  | {
      portal: "field";
      source: string;
      fieldName: string;
      overrides?: any; //Omit<Partial<TinaField>, "name">;
      hidden?: boolean;
    }
  | {
      portal: "multi-field";
      sources: Array<string>;
      fieldName: string;
      overrides?: any; //Omit<Partial<TinaField>, "name">;
      hidden?: boolean;
    };

export interface CompiledComponentConfigBase<
  Identifier extends string = string,
  Props extends Record<string, any> = Record<string, any>
> {
  _component: Identifier; // instance of the component (unique id)
  _id: string;
  props: Props;
}

export interface EditingInfoBase {
  direction?: "horizontal" | "vertical";
  noInline?: boolean;
}

export interface WidthInfo {
  auto: TrulyResponsiveValue<boolean>;
  width: TrulyResponsiveValue<number>;
}

export interface CompiledCustomComponentConfig
  extends CompiledComponentConfigBase {
  components: {
    [key: string]: (CompiledComponentConfig | ReactElement)[];
  };
  __editing?: EditingInfoBase & {
    widthInfo?: WidthInfo;
    fields: Array<AnyField | FieldPortal>;
    components: {
      [name: string]: {
        noInline?: boolean; // This is the only property that needs to stay here for the sake of Placeholder. The rest can be passed (like direction).
      };
    };
  };
}

export interface CompiledStyled {
  [key: string]: any;
}

export interface CompiledShopstoryComponentConfig
  extends CompiledCustomComponentConfig {
  styled: Record<string, CompiledStyled>;
}

export type CompiledComponentConfig = CompiledShopstoryComponentConfig;

export interface ComponentPlaceholder {
  width: number;
  height: number;
  label?: string;
}

export interface EditorSidebarPreviewOptions {
  breakpointIndex: string;
  devices: Devices;
  contextParams: ContextParams;
}

export interface ConfigModel {
  id: string;
  parent_id: string | null;
  config: NoCodeComponentEntry;
  project_id: string;
  created_at: string;
}

export interface ExternalWithSchemaProp {
  id: string;
  externalReference: ExternalReference;
  schemaProp: ExternalSchemaProp;
}

export interface CompilationMetadata {
  vars: {
    devices: Devices;
    locale: string;
    definitions: SerializedComponentDefinitions;
    [key: string]: any;
  };
}

export interface CompilerModule {
  compile: (
    content: NoCodeComponentEntry,
    config: Config,
    contextParams: ContextParams
  ) => {
    compiled: CompiledShopstoryComponentConfig;
    configAfterAuto?: any;
    meta: CompilationMetadata;
  };

  /**
   * We need findResources function that also comes from the cloud.
   * Without it we would have to analyse the config in ShopstoryClient in order to find resources to be fetched.
   * This is very internal logic and should stay in the cloud to be able to be updated live.
   */
  findExternals: (
    rawContent: any,
    config: Config,
    contextParams: ContextParams
  ) => ExternalWithSchemaProp[];

  validate: (input: unknown) =>
    | {
        isValid: true;
        input: Document | NoCodeComponentEntry | null | undefined;
      }
    | { isValid: false };
}

export interface EditingField {
  type: "field";
  path: string;
  label?: string;
  group?: string;
  visible?: boolean;
}

export interface EditingComponentFields {
  type: "fields";
  path: string;
  filters?: {
    group?: ScalarOrCollection<string>;
  };
}

export type AnyEditingField = EditingField | EditingComponentFields;

export interface ChildComponentEditingInfo {
  selectable?: boolean;
  direction?: "horizontal" | "vertical";
  fields: Array<EditingField>;
}

export interface EditingInfo {
  fields: Array<EditingField>;
  components: Record<string, ScalarOrCollection<ChildComponentEditingInfo>>;
}

export interface NoCodeComponentEditingFunctionResult {
  fields?: Array<AnyEditingField>;
  components?: {
    [field: string]: ScalarOrCollection<PartialDeep<ChildComponentEditingInfo>>;
  };
}

export interface FetchResourceResolvedResult<T> {
  type: string & Record<never, never>;
  value: T;
}

interface FetchResourceRejectedResult {
  error: Error;
}

// {} in TS means any non nullish value and it's used on purpose here
// eslint-disable-next-line @typescript-eslint/ban-types
export type NonNullish = {};

export type FetchResourceResult<T extends NonNullish = NonNullish> =
  | FetchResourceResolvedResult<T>
  | FetchResourceRejectedResult;

export type FetchOutputBasicResources = Record<string, FetchResourceResult>;

export interface FetchCompoundResourceResultValue<
  Type extends string = string,
  Value extends NonNullish = NonNullish
> {
  type: Type;
  value: Value;
  label?: string;
}

export type FetchCompoundTextResourceResultValue =
  FetchCompoundResourceResultValue<"text", string>;

export type FetchCompoundResourceResultValues = Record<
  string,
  | FetchCompoundTextResourceResultValue
  | FetchCompoundResourceResultValue<string & Record<never, never>, NonNullish>
>;

export interface ExternalDataCompoundResourceResolvedResult {
  type: "object";
  value: FetchCompoundResourceResultValues;
}

export interface ExternalDataCompoundResourceRejectedResult {
  error: Error;
}

export type FetchOutputCompoundResources = Record<
  string,
  | ExternalDataCompoundResourceResolvedResult
  | ExternalDataCompoundResourceRejectedResult
>;

export type FetchOutputResources = Record<
  string,
  (FetchOutputBasicResources | FetchOutputCompoundResources)[string]
>;

export interface RequestedExternalDataValue {
  id: ExternalReference["id"];
  widgetId: string;
  params?: ExternalParams;
}

export type RequestedExternalData = Record<string, RequestedExternalDataValue>;

export type ExternalData = Record<
  string,
  (FetchOutputBasicResources | FetchOutputCompoundResources)[string]
>;

export interface LocalReference<Value = unknown> {
  id: string;
  value: Value;
  widgetId: string;
}

export type LocalTextReference = Omit<
  LocalReference<LocalizedText>,
  "id" | "widgetId"
> & { id: `local.${string}`; widgetId: "@easyblocks/local-text" };

export type CompiledLocalTextReference = Omit<
  LocalReference<string>,
  "id" | "widgetId"
> & { id: `local.${string}`; widgetId: "@easyblocks/local-text" };

export interface ExternalReferenceEmpty {
  id: null;
  widgetId: string;
}

export interface ExternalReferenceNonEmpty<
  Identifier extends NonNullish = NonNullish
> {
  id: Identifier;
  widgetId: string;
  key?: string;
}

export type ExternalReference<Identifier extends NonNullish = NonNullish> =
  | ExternalReferenceEmpty
  | ExternalReferenceNonEmpty<Identifier>;

export interface LocalValue<T = any> {
  value: T;
  widgetId: string;
}

export interface TokenValue<T = any> {
  value: T;
  tokenId?: string;
  widgetId?: string;
}
