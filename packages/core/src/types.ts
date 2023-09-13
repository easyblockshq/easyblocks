import { ComponentType } from "react";
import { PartialDeep } from "type-fest";
import { IApiClient } from "./infrastructure/apiClient";
import { Locale } from "./locales";

type ScalarOrCollection<T> = T | Array<T>;

export type RefMap = { [key: string]: ConfigComponent };

export interface ConfigComponentIdentifier {
  id: string;
}

export interface ComponentConfigBase<Identifier extends string> {
  _template: Identifier;
  _id: string;
  traceId?: string;
}

export type ConfigComponent = {
  _template: string; // instance of the component (unique id)
  _ref?: string; // ref of the component,
  _id?: string; // optional because template items don't have ids, we could have separate types later for this to distinguish between them statically
  _projectId?: string; // optional because of backward compatibility
  $$$refs?: RefMap;
  [key: string]: any; // props
};

export type ComponentConfig = ConfigComponent;

export type LocalisedConfigs<
  T extends ConfigComponent | Array<ConfigComponent> = ConfigComponent
> = {
  [locale: string]: T;
};

export type Document = {
  documentId: string;
  projectId: string;
  rootContainer: string;
  /**
   * This field serves as a cache of document's content when used by `ShopstoryClient`.
   * It allows to avoid fetching the content of the document from the server when it's already available.
   * It shouldn't be used by editor. It's missing when the config was too big to be stored in the CMS.
   */
  config?: ConfigComponent;
  preview?: PreviewMetadata;
};

export type LocalisedDocument = Record<string, Document>;

export type ExternalReference = {
  type: string;
  id: string;
};

export type RefValue<T> = {
  value: T;
  ref?: string;
};

export type RefType = "dev" | "ds" | "map";

export type ThemeRefValue<T> = RefValue<T> & {
  type: RefType;
  label?: string;
  mapTo?: string | string[];
};

export type Spacing = string; // 10px, 0px, 10vw, etc

export type Font = object;

export type Color = string;

export type NumberOfItemsInRow = "1" | "2" | "3" | "4" | "5" | "6";

export type TrulyResponsiveValue<T> = {
  [key: string]: T | true | undefined;
  $res: true;
};

export type ResponsiveValue<T> = T | TrulyResponsiveValue<T>;

export type Theme = {
  space: {
    [key: string]: ThemeRefValue<ResponsiveValue<Spacing>>;
  };
  fonts: {
    [key: string]: ThemeRefValue<ResponsiveValue<Font>>;
  };
  colors: {
    [key: string]: ThemeRefValue<ResponsiveValue<Color>>;
  };
  icons: {
    [key: string]: ThemeRefValue<string>;
  };
  numberOfItemsInRow: {
    [key: string]: ThemeRefValue<ResponsiveValue<NumberOfItemsInRow>>;
  };
  aspectRatios: {
    [key: string]: ThemeRefValue<ResponsiveValue<string>>;
  };
  containerWidths: {
    [key: string]: ThemeRefValue<ResponsiveValue<string>>;
  };
  boxShadows: {
    [key: string]: ThemeRefValue<ResponsiveValue<string>>;
  };
};

export type ThemeSpaceScalar = number | string;

export type ThemeSpace = ThemeSpaceScalar | { [key: string]: ThemeSpaceScalar };

export type ThemeNumberOfItemsInRow =
  | NumberOfItemsInRow
  | { [key: string]: NumberOfItemsInRow };

export type ThemeColor = Color | { [key: string]: Color };

export type ThemeFont = { [key: string]: any };

interface GridConfig {
  containerMargin: ThemeSpace;
  horizontalGap: ThemeSpace;
  verticalGap: ThemeSpace;
  numberOfItemsInRow: ThemeNumberOfItemsInRow;
}

export type ButtonCustomComponent = CustomComponentShared & {
  builtinProps?: {
    label?: "on" | "off";
    symbol?: "on" | "off" | "optional";
  };
};

export type StringSchemaProp = SchemaPropShared<"string", string> & {
  normalize?: (x: string) => string | null;
};

export type String$SchemaProp = SchemaPropShared<
  "string$",
  ResponsiveValue<string>
> & {
  normalize?: (x: string) => string | null;
};

export type NumberSchemaProp = SchemaPropShared<"number", number> & {
  min?: number;
  max?: number;
};

export type BooleanSchemaProp = SchemaPropShared<"boolean", boolean>;

export type Boolean$SchemaProp = SchemaPropShared<
  "boolean$",
  ResponsiveValue<boolean>
>;

export type Option =
  | {
      value: string;
      label?: string;
      icon?: string | ComponentType<{ size?: number; isStroke?: boolean }>;
      hideLabel?: boolean;
    }
  | string;

export type SelectSchemaProp = SchemaPropShared<"select", string> & {
  options: Option[];
};

export type RadioGroupSchemaProp = SchemaPropShared<"radio-group", string> & {
  options: Option[];
};

export type Select$SchemaProp = SchemaPropShared<
  "select$",
  ResponsiveValue<string>
> & {
  options: Option[];
};

export type RadioGroup$SchemaProp = SchemaPropShared<
  "radio-group$",
  ResponsiveValue<string>
> & {
  options: Option[];
};

/**
 * Why do Space, Color and Font have ValueType ResponsiveValue<RefValue<ResponsiveValue<Color>>> type? It's complex! (T is Color / Space / Font).
 *
 * 1. For now values can be only RefValues (we don't have custom values, every space, color and font must be reference to a theme). Therefore RefValue.
 * 2. In a theme, fonts, spaces and colors (defined by developer) can be responsive. Therefore RefValue<ResponsiveValue<T>>
 * 3. User in editor can pick RESPONSIVELY different RefValues (that are responsive too). It's complex but makes sense.
 *
 * CompileType is obviously very simple because after compilation we just have "CSS output" which is basically responsive non-ref value (there's no concept of refs after compilation)
 */

export type ColorSchemaProp = SchemaPropShared<
  "color",
  ResponsiveValue<RefValue<Color>>
>;

export type StringTokenSchemaProp = SchemaPropShared<
  "stringToken",
  ResponsiveValue<RefValue<string>>
> & {
  tokenId:
    | "numberOfItemsInRow"
    | "aspectRatios"
    | "containerWidths"
    | "boxShadows";
  extraValues?: string[]; // extra values are usually non-token values that are displayed in the select as if they were tokens, the component must understand them
};

export type SpaceSchemaProp = SchemaPropShared<
  "space",
  ResponsiveValue<RefValue<Spacing>>
> & {
  prefix?: string;
  autoConstant?: number;
};

export type FontSchemaProp = SchemaPropShared<
  "font",
  ResponsiveValue<RefValue<Font>>
>;

export type IconSchemaProp = SchemaPropShared<"icon", RefValue<string>>;

export type CustomSchemaProp = SchemaPropShared<string, never> & {
  [key: string]: any;
  mapper?: (data: any) => any;
  optional?: boolean;
};

export type ComponentPickerType = "large" | "small";

export type PassedField =
  | { name: string; label: string; showWhen?: any; group?: string }
  | string;

export type ComponentSchemaProp = SchemaPropShared<
  "component",
  [] | [ConfigComponent]
> & {
  componentTypes: string[];
  picker?: ComponentPickerType;
  required?: boolean;
};

export type ComponentCollectionSchemaProp = SchemaPropShared<
  "component-collection",
  Array<ConfigComponent>
> & {
  componentTypes: string[];
  picker?: ComponentPickerType;
  hideFields?: string[];
  itemFields?: SchemaProp[];
  passFields?: PassedField[];
};

export type ComponentCollectionLocalisedSchemaProp = Omit<
  ComponentCollectionSchemaProp,
  "type"
> & { type: "component-collection-localised" };

export type ComponentFixedSchemaProp = SchemaPropShared<
  "component-fixed",
  Array<ConfigComponent>
> & {
  componentType: string;
  picker?: ComponentPickerType;
  hideFields?: string[];
  passFields?: PassedField[];
}; // we don't want to set default value for nested components

export type TextResourceSchemaProp = SchemaPropShared<"text", string> & {
  normalize?: (x: string) => string | null;
  [key: string]: any;
};

export type ResourceSchemaProp =
  | TextResourceSchemaProp
  | CustomResourceSchemaProp;

export type SchemaProp =
  | StringSchemaProp
  | String$SchemaProp
  | NumberSchemaProp
  | BooleanSchemaProp
  | Boolean$SchemaProp
  | SelectSchemaProp
  | Select$SchemaProp
  | RadioGroupSchemaProp
  | RadioGroup$SchemaProp
  | ColorSchemaProp
  | SpaceSchemaProp
  | FontSchemaProp
  | StringTokenSchemaProp
  | IconSchemaProp
  | TextResourceSchemaProp
  | CustomResourceSchemaProp
  | ComponentSchemaProp
  | ComponentCollectionSchemaProp
  | ComponentCollectionLocalisedSchemaProp
  | ComponentFixedSchemaProp;

type CustomComponentShared = {
  id: string;
  hidden?: boolean;
  schema: SchemaProp[];
  label?: string;
  previewImage?: string;
};

export type SectionCustomComponent = CustomComponentShared & {
  type: "section";
};

export type CardCustomComponent = CustomComponentShared & { type: "card" };

export type ItemCustomComponent = CustomComponentShared & {
  type?: "item" | undefined;
};

export type CustomComponent =
  | SectionCustomComponent
  | CardCustomComponent
  | ItemCustomComponent;

export type CustomAction = CustomComponentShared;

export type CustomLink = CustomComponentShared;

type TextModifierType = "text" | "link" | "action";

export type CustomTextModifier = ComponentDefinitionShared & {
  type: TextModifierType;
  apply: (props: Record<string, any>) => Record<string, any>;
  childApply?: (props: Record<string, any>) => Record<string, any>;
};

export type ConfigDeviceRange = {
  startsFrom?: number;
  w?: number;
  h?: number;
  hidden?: boolean;
};

export type ConfigDevices = {
  xs?: ConfigDeviceRange;
  sm?: ConfigDeviceRange;
  md?: ConfigDeviceRange;
  lg?: ConfigDeviceRange;
  xl?: ConfigDeviceRange;
  "2xl"?: ConfigDeviceRange;
};

export type EventSourceType = "section" | "card" | "item" | "button";

export type EventSource = {
  type: EventSourceType;
  traceId?: string;
  component?: string;
  props: Record<string, any> | undefined;
};

export type EventType = "click" | "impression";

export interface TracingEvent {
  event: EventType;
  source: EventSource;
}

export type EventSink = (event: TracingEvent) => void;

export type Audience = {
  id: string;
  name: string;
  description?: string;
};

export type TemplateBase = {
  id?: string;
  label?: string;
  type?: string;
  previewImage?: string;
  group?: string;
};

export type Template = TemplateBase & {
  isGroupEmptyTemplate?: boolean;
  mapTo?: string | string[];
  isDefaultTextModifier?: boolean; // maybe to remove in the future. But we need to know which template is default text modifier!
  config: ConfigComponent;
  configId?: string;
  isRemoteUserDefined?: boolean;
  previewSettings?: {
    width: number;
    widthAuto: boolean;
  };
};

type RuntimeConfigThemeValue<T> = {
  id: string;
  label?: string;
  value: T;
  mapTo?: string | string[];
};

export type ResourceParams = Record<string, unknown>;

export type ContextParams = {
  locale: string;
  rootContainer: string;
  [key: string]: any;
};

export type PickerItem = {
  id: string;
  title: string;
  thumbnail?: string;
};

export interface PickerAPI {
  getItems: (query: string) => Promise<PickerItem[]>;
  getItemById: (id: string) => Promise<PickerItem>;
}

export type ExternalFieldItemPicker = {
  type: "item-picker";
} & PickerAPI;

export type ExternalFieldCustomComponentProps = {
  root: HTMLElement;
  value: UnresolvedResource;
  onChange: (newValue: { id: null } | { id: string; key?: string }) => void;
  apiClient: IApiClient;
  projectId: string;
  notify: {
    error: (message: string) => void;
  };
};

type CleanupFunction = () => void;

export type ExternalFieldCustom = {
  type: "custom";
  component: (
    props: ExternalFieldCustomComponentProps
  ) => void | CleanupFunction;
};

export type ExternalFieldType = ExternalFieldItemPicker | ExternalFieldCustom;

export type WidgetComponent =
  | ExternalFieldType
  | ((params: Record<string, any>) => ExternalFieldType);

export type Widget = {
  id: string;
  label: string;
  component: WidgetComponent;
};

export type ResourceDefinition = {
  widgets: Array<Widget>;
};

export type LocalizedText = {
  [locale: string]: string;
};

export type RootContainer = {
  defaultConfig: ComponentConfig;
  widths?: Array<number>;
  resource?: {
    type: string;
  };
};

type EditableComponentDefinition = {
  id: string;
  schema: Array<SchemaProp>;
  tags: Array<string>;
  label?: string;
  styles?: any;
  editing?: any;
  auto?: any;
  pasteSlots?: Array<string>;
};

export type Config = {
  accessToken: string;
  projectId?: string;
  resourceTypes?: Record<string, ResourceDefinition>;
  text?: ResourceDefinition;
  space?: RuntimeConfigThemeValue<ThemeSpace>[];
  colors?: RuntimeConfigThemeValue<ThemeColor>[];
  fonts?: RuntimeConfigThemeValue<ThemeFont>[];
  icons?: RuntimeConfigThemeValue<string>[];
  aspectRatios?: RuntimeConfigThemeValue<string>[];
  boxShadows?: RuntimeConfigThemeValue<string>[];
  containerWidths?: RuntimeConfigThemeValue<number>[];
  mainGrid?: GridConfig;
  grids?: Record<string, Partial<GridConfig>>;
  buttons?: ButtonCustomComponent[];
  components?: Array<EditableComponentDefinition | CustomComponent>;
  actions?: CustomAction[];
  links?: CustomLink[];
  devices?: ConfigDevices;
  eventSink?: EventSink;
  textModifiers?: Array<CustomTextModifier>;
  audiences?: () => Promise<Audience[]>;
  __masterEnvironment?: boolean;
  strict?: boolean;
  locales?: Array<Locale>;
  rootContainers?: Record<string, RootContainer>;
  fetch: FetchFunction;
};

export type PreviewMetadata =
  | {
      mode: "grid";
      extraCardsCount: number;
    }
  | {
      mode: "content" | (string & Record<never, never>);
      sectionsCount: number;
    };

type EditorProps = {
  configs?: LocalisedConfigs | LocalisedDocument;
  uniqueSourceIdentifier?: string;
  save: (
    documents: LocalisedDocument,
    externals: ExternalReference[]
  ) => Promise<void>;
  locales: Locale[];
  config: Config;
  contextParams: ContextParams;
  onClose: () => void;
  rootContainer: string;
  container?: HTMLElement;
  heightMode?: "viewport" | "parent";
  canvasUrl?: string;
};

export type EditorLauncherProps = Omit<EditorProps, "config">;

export type SchemaPropShared<Type extends string, ValueType> = {
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
  defaultValue?: ValueType;
};

export type UnresolvedResource =
  | UnresolvedResourceNonEmpty
  | UnresolvedResourceEmpty;

export type UnresolvedResourceNonEmpty = {
  id: string;
  widgetId: string;
  /**
   * This property is an exception and it's only available within local text resource.
   * TODO: Move local text resources to other place
   */
  value?: LocalizedText;
  key?: string;
};

export type UnresolvedResourceEmpty = {
  id: null;
  widgetId?: string;
};

export type CustomResourceSchemaProp = SchemaPropShared<
  "resource",
  UnresolvedResource
> & {
  /**
   * Name of the custom resource to use for resource field.
   */
  resourceType: string;
  /**
   * Parameters passed to the widget.
   */
  params?: ResourceParams;
  /**
   * Parameters passed to the fetch function.
   */
  fetchParams?: ResourceParams;
  /**
   * If `true`, the resource becomes optional and the component using it can render without it.
   */
  optional?: boolean;
};

export type ImageSrcSetEntry = {
  w: number;
  h: number;
  url: string;
};

export type ImageSrc = {
  alt: string;
  url: string; // original URL
  aspectRatio: number;
  srcset: ImageSrcSetEntry[];
  mimeType: string;
};

export type VideoSrc = {
  alt: string;
  url: string;
  aspectRatio: number;
};

export type ResourceIdentity = {
  id: string;
  type: string;
};

export type PendingResource = ResourceIdentity & {
  status: "loading";
  value: undefined;
  error: null;
};

export type ResolvedResource<Value = unknown> = ResourceIdentity & {
  status: "success";
  value: Value;
  error: null;
  key?: string;
};

export type RejectedResource = ResourceIdentity & {
  status: "error";
  value: undefined;
  error: Error;
};

export type Resource<Value = unknown> =
  | PendingResource
  | ResolvedResource<Value>
  | RejectedResource;

export type LocalResource<T = unknown> = Omit<Resource<T>, "status">;

export type ImageResource = Resource<ImageSrc>;

export type VideoResource = Resource<VideoSrc>;

export type TextResource = Resource<LocalizedText>;

export type SerializableResource =
  | Omit<PendingResource, "values">
  | ResolvedResource
  | Omit<RejectedResource, "values">;

export type DeviceRange = {
  id: string;
  w: number;
  h: number;
  breakpoint: number | null;
  hidden?: boolean;
  label?: string;
  isMain?: boolean;
};

export type Devices = DeviceRange[];

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

type SidebarPreviewVariant = { description?: string } & (
  | {
      type: "image";
      url: string;
    }
  | { type: "solid"; color: string }
  | { type: "icon"; icon?: "link" | "grid_3x3" }
);

export type ComponentDefinitionShared<Identifier extends string = string> = {
  id: Identifier;
  label?: string;
  tags: string[];
  schema: SchemaProp[];
  change?: ComponentConfigChangeFunction;
  icon?: "link" | "grid_3x3";
  getEditorSidebarPreview?: (
    config: ConfigComponent,
    editorContext: EditorSidebarPreviewOptions
  ) => SidebarPreviewVariant | undefined;
  previewImage?: string;
};

export type SerializedRenderableComponentDefinition =
  ComponentDefinitionShared & {
    componentCode?: string; // optional because it might be also an action or built-in component
  };

export type SerializedActionComponentDefinition = ComponentDefinitionShared;

export type SerializedLinkComponentDefinition = ComponentDefinitionShared;

export type SerializedTextModifierDefinition = ComponentDefinitionShared;

export type SerializedComponentDefinitions = {
  components: SerializedRenderableComponentDefinition[];
  actions: SerializedActionComponentDefinition[];
  links: SerializedLinkComponentDefinition[];
  textModifiers: SerializedTextModifierDefinition[];
};

export type SerializedComponentDefinition =
  | SerializedRenderableComponentDefinition
  | SerializedActionComponentDefinition
  | SerializedLinkComponentDefinition;

export type NonEmptyRenderableContent = {
  renderableContent: CompiledShopstoryComponentConfig;
  configAfterAuto?: any;
};

export type EmptyRenderableContent = {
  renderableContent: null;
};

export type RenderableContent =
  | EmptyRenderableContent
  | NonEmptyRenderableContent;

export interface Tracing {
  traceClicks?: boolean;
  traceImpressions?: boolean;
  traceId?: string;
  type?: EventSourceType;
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

export type CompiledComponentConfigBase<
  Identifier extends string = string,
  Props extends Record<string, any> = Record<string, any>
> = {
  _template: Identifier; // instance of the component (unique id)
  _id: string;
  props: Props;
  tracing?: Tracing;
};

export type CompiledActionComponentConfig = CompiledComponentConfigBase & {
  __editing?: {
    fields: Array<AnyField | FieldPortal>;
  };
};

export interface CompiledTextModifier {
  _template: string;
  _id: string;
  elements: Array<Record<string, any>>;
  [key: string]: any;
}

export type EditingInfoBase = {
  direction?: "horizontal" | "vertical";
  noInline?: boolean;
};

export type WidthInfo = {
  auto: TrulyResponsiveValue<boolean>;
  width: TrulyResponsiveValue<number>;
};

export type CompiledCustomComponentConfig = CompiledComponentConfigBase & {
  actions: {
    [key: string]: CompiledActionComponentConfig[];
  };
  components: {
    [key: string]: (
      | CompiledShopstoryComponentConfig
      | CompiledCustomComponentConfig
    )[];
  };
  textModifiers: Record<string, [CompiledTextModifier]>;
  __editing?: EditingInfoBase & {
    widthInfo?: WidthInfo;
    fields: Array<AnyField | FieldPortal>;
    components: {
      [name: string]: {
        noInline?: boolean; // This is the only property that needs to stay here for the sake of Placeholder. The rest can be passed (like direction).
      };
    };
  };
};

export type CompiledStyled = {
  [key: string]: any;
};

export type CompiledShopstoryComponentConfig = CompiledCustomComponentConfig & {
  styled: {
    [key: string]: CompiledStyled;
  };
};

export type CompiledComponentConfig =
  | CompiledActionComponentConfig
  | CompiledShopstoryComponentConfig
  | CompiledCustomComponentConfig;

export type ComponentPlaceholder = {
  width: number;
  height: number;
  label?: string;
};

/**
 * @public
 */
export type ShopstoryClientInput = ComponentConfig | null | undefined;

/**
 * @public
 */
export type ShopstoryClientAddOptions = {
  rootContainer: string;
  [key: string]: unknown;
};

export interface IShopstoryClient {
  add(
    config: ShopstoryClientInput,
    options: ShopstoryClientAddOptions
  ): RenderableContent;
  build(): Promise<Metadata>;
}

export type EditorSidebarPreviewOptions = {
  breakpointIndex: string;
  contextParams: ContextParams;
  resources: Array<Resource>;
};

export interface ConfigModel {
  id: string;
  parent_id: string | null;
  config: ConfigComponent;
  project_id: string;
  created_at: string;
}

export type ResourceWithSchemaProp = {
  id: string;
  resource: UnresolvedResource;
  schemaProp: ResourceSchemaProp;
};

/**
 * This is sacred API. It "fixes" current library version to what is available for compilation from our cloud script.
 */

export type CompilationMetadata = {
  vars: {
    devices: Devices;
    locale: string;
    [key: string]: any;
  };
  code: {
    ComponentBuilder?: string;
    CanvasRoot?: string;
  } & {
    [key: string]: string;
  };
};

export type Metadata = CompilationMetadata & {
  resources: Array<Resource>;
};

export type ShopstoryClientDependencies = {
  compile: (
    items: Array<{
      content: unknown;
      /**
       * nested flag is for the purpose of nested <Shopstory /> components.
       * If compiler knows that content is nested then it knows that this content
       * should be compiled in non-editing mode. No unnecessary __editing flag and no
       * SelectionFrame in the editor.
       */
      options: ShopstoryClientAddOptions & { nested: boolean };
    }>,
    config: Config,
    contextParams: ContextParams
  ) => {
    items: Array<{
      compiled: CompiledShopstoryComponentConfig;
      configAfterAuto?: any;
    }>;
    meta: CompilationMetadata;
  };
  /**
   * We need findResources function that also comes from the cloud.
   * Without it we would have to analyse the config in ShopstoryClient in order to find resources to be fetched.
   * This is very internal logic and should stay in the cloud to be able to be updated live.
   */
  findResources: (
    rawContent: any,
    config: Config,
    contextParams: ContextParams
  ) => ResourceWithSchemaProp[];
  validate: (input: unknown) =>
    | {
        isValid: true;
        input: Document | ComponentConfig | null | undefined;
      }
    | { isValid: false };
};

export type EditingField = {
  type: "field";
  path: string;
  label?: string;
  group?: string;
  visible?: boolean;
};

export type EditingComponentFields = {
  type: "fields";
  path: string;
  filters?: {
    group?: ScalarOrCollection<string>;
  };
};

export type AnyEditingField = EditingField | EditingComponentFields;

export type ChildComponentEditingInfo = {
  selectable?: boolean;
  direction?: "horizontal" | "vertical";
  fields: Array<EditingField>;
};

export type EditingInfo = {
  fields: Array<EditingField>;
  components: Record<string, ScalarOrCollection<ChildComponentEditingInfo>>;
};

export type EditingFunctionInput<
  Values extends Record<string, any> = Record<string, any>
> = { values: Values; editingInfo: EditingInfo };

export type EditingFunctionResult = {
  fields?: Array<AnyEditingField>;
  components?: {
    [field: string]: PartialDeep<ScalarOrCollection<ChildComponentEditingInfo>>;
  };
};

export type EditingFunction = (
  input: EditingFunctionInput
) => EditingFunctionResult | undefined;

export type FetchInputResource = {
  externalId: string;
  type: string;
  widgetId: string;
  fetchParams?: ResourceParams;
};

export type FetchInputResources = Record<string, FetchInputResource>;

type FetchResourceResolvedResult<T> = { value: T; error: null };

type FetchResourceRejectedResult = { value: undefined; error: Error };

// {} in TS means any non nullish value and it's used on purpose here
// eslint-disable-next-line @typescript-eslint/ban-types
type NonNullable = {};

export type FetchResourceResult<T extends NonNullable = NonNullable> =
  | FetchResourceResolvedResult<T>
  | FetchResourceRejectedResult;

export type FetchOutputBasicResources = Record<
  string,
  {
    type: string & Record<never, never>;
  } & FetchResourceResult
>;

export type FetchCompoundResourceResultValue = {
  type: string;
  value: NonNullable;
  label?: string;
};

export type FetchCompoundResourceResultValues = Record<
  string,
  FetchCompoundResourceResultValue
>;

export type FetchCompoundResourceResult =
  | {
      values: FetchCompoundResourceResultValues;
      error: null;
    }
  | {
      values: undefined;
      error: Error;
    };

export type FetchOutputCompoundResources = Record<
  string,
  {
    type: "object";
  } & FetchCompoundResourceResult
>;

export type FetchOutputResources = Record<
  string,
  (FetchOutputBasicResources | FetchOutputCompoundResources)[string]
>;

export type FetchFunction = (
  resources: FetchInputResources,
  contextParams: ContextParams
) => Promise<FetchOutputResources>;
