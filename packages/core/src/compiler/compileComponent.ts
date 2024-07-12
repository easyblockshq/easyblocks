import {
  assertDefined,
  bubbleDown,
  deepClone,
  deepCompare,
  dotNotationGet,
  dotNotationSet,
  entries,
  raiseError,
  toArray,
  uniqueId,
} from "@easyblocks/utils";
import { isComponentConfig } from "../checkers";
import {
  responsiveValueFill,
  responsiveValueNormalize,
} from "../responsiveness";
import {
  AnyEditingField,
  ChildComponentEditingInfo,
  CompilationMetadata,
  CompiledCustomComponentConfig,
  CompiledShopstoryComponentConfig,
  ComponentCollectionLocalisedSchemaProp,
  ComponentCollectionSchemaProp,
  ComponentSchemaProp,
  NoCodeComponentEntry,
  EditingField,
  EditingInfo,
  FieldPortal,
  NoCodeComponentEditingFunctionResult,
  SchemaProp,
  SerializedComponentDefinitions,
  SerializedRenderableComponentDefinition,
  SpaceSchemaProp,
  TrulyResponsiveValue,
  CompiledComponentConfig,
} from "../types";
import type {
  CompilationCache,
  CompilationCacheItemValue,
} from "./CompilationCache";
import { applyAutoUsingResponsiveTokens } from "./applyAutoUsingResponsiveTokens";
import { RichTextComponentConfig } from "./builtins/$richText/$richText";
import { compileComponentValues } from "./compileComponentValues";
import { compileFromSchema } from "./compileFromSchema";
import { ConfigComponentCompilationOutput } from "./definitions";
import { getDevicesWidths } from "./devices";
import {
  findComponentDefinition,
  findComponentDefinitionById,
} from "./findComponentDefinition";
import { getMostCommonValueFromRichTextParts } from "./getMostCommonValueFromRichTextParts";
import { linearizeSpace } from "./linearizeSpace";
import { parsePath } from "./parsePath";
import { resop2, scalarizeConfig } from "./resop";
import {
  Component$$$SchemaProp,
  isExternalSchemaProp,
  isSchemaPropActionTextModifier,
  isSchemaPropCollection,
  isSchemaPropComponent,
  isSchemaPropComponentCollectionLocalised,
  isSchemaPropComponentOrComponentCollection,
  isSchemaPropTextModifier,
} from "./schema";
import { getTinaField } from "./tinaFieldProviders";
import {
  CompilationContextType,
  ContextProps,
  EditingInfoComponent,
  EditingInfoComponentCollection,
  EditorContextType,
  InternalComponentDefinition,
  InternalEditingField,
  InternalEditingFunctionResult,
  InternalEditingInfo,
  InternalRenderableComponentDefinition,
} from "./types";
import { getFallbackLocaleForLocale } from "../locales";

import {
  build,
  buildTextPart,
  buildTextRoot,
} from "../stitches/stitches_build";

type ComponentCompilationArtifacts = {
  compiledComponentConfig: CompiledComponentConfig;
  configAfterAuto: NoCodeComponentEntry;
};

export function compileComponent(
  editableElement: NoCodeComponentEntry,
  compilationContext: CompilationContextType,
  contextProps: ContextProps, // contextProps are already compiled! They're result of compilation function.
  meta: any,
  cache: CompilationCache,
  parentComponentEditingInfo?:
    | EditingInfoComponent
    | EditingInfoComponentCollection,
  configPrefix = ""
): ComponentCompilationArtifacts {
  if (!isComponentConfig(editableElement)) {
    console.error(
      "[compile] wrong input for compileComponent",
      editableElement
    );

    throw new Error("[compile] wrong input for compileComponent");
  }

  if (contextProps.$width === undefined || contextProps.$width === -1) {
    throw new Error(
      `assertion failed: incorrect $width in compileComponent: ${contextProps.$width}, component: ${editableElement._id}, ${editableElement._component}`
    );
  }

  const cachedResult = cache.get(editableElement._id);

  let componentDefinition = findComponentDefinitionById(
    editableElement._component,
    compilationContext
  );

  if (!componentDefinition) {
    componentDefinition = assertDefined(
      findComponentDefinitionById(
        "@easyblocks/missing-component",
        compilationContext
      )
    );

    const error = `Easyblocks can’t find definition for component "${editableElement._component}" in your config. Please contact your developers to resolve this issue.`;

    editableElement = {
      _component: componentDefinition.id,
      _id: uniqueId(),
      error,
    };

    console.warn(error);

    parentComponentEditingInfo = undefined;
  }

  const ownProps = createOwnComponentProps({
    config: editableElement,
    contextProps,
    componentDefinition,
    compilationContext,
  });

  let hasComponentConfigChanged = true;

  let ownPropsAfterAuto: {
    values: { _id: string; _component: string } & Record<string, any>;
    params: Record<string, any>;
  };
  let compiled: CompiledComponentConfig = {
    _component: editableElement._component,
    _id: editableElement._id,
    props: {},
    components: {},
    styled: {},
  };
  let configAfterAuto: any;
  let editingInfo: InternalEditingInfo | undefined;
  let compiledValues: Record<string, any> = {};
  let subcomponentsContextProps: CompilationCacheItemValue["contextProps"] = {};
  let editingContextProps: CompilationCacheItemValue["editingContextProps"];

  if (cachedResult) {
    hasComponentConfigChanged = !deepCompare(ownProps, cachedResult.values);

    if (!hasComponentConfigChanged) {
      ownPropsAfterAuto = cachedResult.valuesAfterAuto;
      compiledValues = cachedResult.compiledValues;
      compiled = cachedResult.compiledConfig;
      configAfterAuto = deepClone({
        ...cachedResult.valuesAfterAuto.values,
        ...cachedResult.valuesAfterAuto.params,
      });
      subcomponentsContextProps = cachedResult.contextProps;
      editingContextProps = cachedResult.editingContextProps;
    }
  }

  addComponentToSerializedComponentDefinitions(
    editableElement,
    meta,
    "components",
    compilationContext
  );

  const { $width, $widthAuto } = calculateWidths(
    compilationContext,
    contextProps
  );

  if (hasComponentConfigChanged) {
    // We are going to mutate this object so let's disconnect it from its source object
    ownPropsAfterAuto = deepClone(ownProps);

    /**
     * APPLY AUTO
     */

    const DEFAULT_SPACE_AUTO_CONSTANT = 16;

    // linearize space
    componentDefinition.schema.forEach((schemaProp) => {
      if (isSchemaPropTokenized(schemaProp)) {
        ownPropsAfterAuto.values[schemaProp.prop] =
          applyAutoUsingResponsiveTokens(
            ownPropsAfterAuto.values[schemaProp.prop],
            compilationContext
          );
      }

      if (schemaProp.type === "space") {
        ownPropsAfterAuto.values[schemaProp.prop] = linearizeSpace(
          ownPropsAfterAuto.values[schemaProp.prop],
          compilationContext,
          $width,
          (schemaProp as SpaceSchemaProp).params?.autoConstant ??
            DEFAULT_SPACE_AUTO_CONSTANT
        );
      }
    });

    itemFieldsForEach(ownPropsAfterAuto.values, compilationContext, (arg) => {
      let value = arg.itemPropValue;
      if (isSchemaPropTokenized(arg.itemSchemaProp)) {
        value = applyAutoUsingResponsiveTokens(value, compilationContext);
      }

      if (arg.itemSchemaProp.type === "space") {
        value = linearizeSpace(
          value,
          compilationContext,
          $width,
          (arg.itemSchemaProp as SpaceSchemaProp).params?.autoConstant ??
            DEFAULT_SPACE_AUTO_CONSTANT
        );
      }

      dotNotationSet(ownPropsAfterAuto.values, arg.itemPropPath, value);
    });

    const autoFunction = (
      componentDefinition as InternalRenderableComponentDefinition
    ).auto;

    if (autoFunction) {
      const ownValuesAfterAuto = autoFunction({
        values: ownPropsAfterAuto.values,
        params: {
          ...ownPropsAfterAuto.params,
          $width,
          $widthAuto,
        },
        devices: compilationContext.devices,
      });

      ownPropsAfterAuto.values = ownValuesAfterAuto;
    }

    // Fill all responsive values. We can assume that values after auto for each breakpoint MUST be defined!!!
    // IMPORTANT: For now we make it realtive to device widths, so Webflow way
    for (const prop in ownPropsAfterAuto.values) {
      ownPropsAfterAuto.values[prop] = responsiveValueFill(
        ownPropsAfterAuto.values[prop],
        compilationContext.devices,
        getDevicesWidths(compilationContext.devices)
      );
    }

    for (const prop in ownPropsAfterAuto.params) {
      ownPropsAfterAuto.params[prop] = responsiveValueFill(
        ownPropsAfterAuto.params[prop],
        compilationContext.devices,
        getDevicesWidths(compilationContext.devices)
      );
    }

    itemFieldsForEach(ownPropsAfterAuto.values, compilationContext, (arg) => {
      dotNotationSet(
        ownPropsAfterAuto.values,
        arg.itemPropPath,
        responsiveValueFill(
          arg.itemPropValue,
          compilationContext.devices,
          getDevicesWidths(compilationContext.devices)
        )
      );
    });

    // First we compile all the props and store them in compiledValues
    const _compiledValues = compileComponentValues(
      ownPropsAfterAuto.values,
      componentDefinition,
      compilationContext,
      cache
    );

    compiledValues = {
      ...deepClone(ownPropsAfterAuto.values),
      ..._compiledValues,
    };

    // Compile item props
    itemFieldsForEach(
      ownPropsAfterAuto.values,
      compilationContext,
      ({ itemPropValue, itemIndex, itemSchemaProp, collectionSchemaProp }) => {
        const compiledValue: any = compileFromSchema(
          itemPropValue,
          itemSchemaProp,
          compilationContext,
          cache,
          {},
          meta
        );

        compiledValues[collectionSchemaProp.prop][itemIndex][
          itemSchemaProp.prop
        ] = compiledValue;
      }
    );

    // We want to style block element based on the most common values from all text parts within all lines.
    // Only for this component, we compile nested @easyblocks/rich-text-part components values.
    if (editableElement._component === "@easyblocks/rich-text") {
      if (compiledValues.isListStyleAuto) {
        const {
          mainColor = compiledValues.mainColor,
          mainFont = compiledValues.mainFont,
        } = compileRichTextValuesFromRichTextParts(
          editableElement as RichTextComponentConfig,
          compilationContext,
          cache
        );

        compiledValues.mainColor = mainColor;
        compiledValues.mainFont = mainFont;
      }

      compiledValues.mainFontSize = mapResponsiveFontToResponsiveFontSize(
        compiledValues.mainFont
      );
    }

    compiled = {
      ...compiled,
      components: {},
      styled: {},
    };

    const renderableComponentDefinition =
      componentDefinition as InternalRenderableComponentDefinition;

    if (compilationContext.isEditing) {
      /**
       * Let's build default editingOutput (fields and component output)
       */

      const editorContext = compilationContext as EditorContextType;

      editingInfo = buildDefaultEditingInfo(
        renderableComponentDefinition,
        configPrefix,
        editorContext,
        compiledValues,
        editableElement._component
      );

      /**
       * Let's run custom editing function
       */
      if (renderableComponentDefinition.editing) {
        const scalarizedConfig = scalarizeConfig(
          compiledValues,
          editorContext.breakpointIndex,
          editorContext.devices,
          renderableComponentDefinition.schema
        );

        const identityEditingField = assertDefined(
          editingInfo.fields.find((f) => f.prop === "$myself")
        );

        const editingInfoWithoutIdentityField: InternalEditingInfo = {
          ...editingInfo,
          // Filter out identity field, since it's not users responsibility to care of it.
          fields: editingInfo.fields.filter((f) => f.prop !== "$myself"),
        };

        const editingInfoInput = convertInternalEditingInfoToEditingInfo(
          editingInfoWithoutIdentityField,
          configPrefix
        );

        const editingInfoResult = renderableComponentDefinition.editing({
          values: scalarizedConfig,
          params: ownPropsAfterAuto.params,
          editingInfo: editingInfoInput,
          device: editorContext.devices.find(
            (device) => device.id === editorContext.breakpointIndex
          )!,
          ...(componentDefinition.id === "@easyblocks/rich-text" ||
          componentDefinition.id === "@easyblocks/rich-text-part"
            ? {
                __SECRET_INTERNALS__: {
                  pathPrefix: configPrefix,
                  editorContext,
                },
              }
            : {}),
        });

        if (editingInfoResult) {
          const internalEditingInfo = convertEditingInfoToInternalEditingInfo(
            editingInfoResult,
            editingInfo,
            componentDefinition,
            editorContext,
            configPrefix
          );

          internalEditingInfo.fields?.unshift(identityEditingField);
          deepObjectMergeWithoutArrays(editingInfo, internalEditingInfo);
        }
      }

      /**
       * Save to __editing
       */

      applyEditingInfoToCompiledConfig(
        compiled,
        editingInfo,
        parentComponentEditingInfo,
        {
          width: $width,
          auto: $widthAuto,
        }
      );

      editingContextProps = editingInfo.components;
    }

    const buildParams = {
      values: compiledValues,
      params: { ...ownPropsAfterAuto.params, $width, $widthAuto },
      isEditing: !!compilationContext.isEditing,
      devices: compilationContext.devices,
      definition: renderableComponentDefinition,
    };

    const { props, components } = build(buildParams);

    if (componentDefinition.id === "@easyblocks/rich-text") {
      props.__textRoot = buildTextRoot({
        values: {
          font: compiledValues.mainFont,
          color: compiledValues.mainColor,
          align: ownPropsAfterAuto.params.passedAlign ?? ownProps.values.align,
        },
        params: {},
        isEditing: !!compilationContext.isEditing,
        devices: compilationContext.devices,
        definition: renderableComponentDefinition,
      });
    }

    if (componentDefinition.id === "@easyblocks/rich-text-part") {
      props.__textPart = buildTextPart({
        values: { font: compiledValues.font, color: compiledValues.color },
        params: {},
        isEditing: !!compilationContext.isEditing,
        devices: compilationContext.devices,
        definition: renderableComponentDefinition,
      });
    }

    // font and color
    // if (
    //   componentDefinition.id === "@easyblocks/rich-text" ||
    //   componentDefinition.id === "@easyblocks/rich-text-part"
    // ) {
    //   const isPart = componentDefinition.id === "@easyblocks/rich-text-part";

    //   const fontAndColorPseudoDefinition = {
    //     id: "__fontAndColor__",
    //     schema: [
    //       {
    //         prop: "font",
    //         type: "font",
    //       },
    //       {
    //         prop: "color",
    //         type: "color",
    //       },
    //     ],
    //   };

    //   props.__fontAndColorArtifacts = buildFontAndColor({
    //     values: isPart
    //       ? { font: compiledValues.font, color: compiledValues.color }
    //       : { font: compiledValues.mainFont, color: compiledValues.mainColor },
    //     params: {},
    //     isEditing: !!compilationContext.isEditing,
    //     devices: compilationContext.devices,
    //     definition: fontAndColorPseudoDefinition,
    //   });

    //   // console.log(`result for ${componentDefinition.id}`, fontAndColor);
    // }

    validateStylesProps(props, componentDefinition);

    subcomponentsContextProps = components;

    componentDefinition.schema.forEach((schemaProp: SchemaProp) => {
      if ("buildOnly" in schemaProp && schemaProp.buildOnly) {
        return;
      }

      if (
        isExternalSchemaProp(schemaProp, compilationContext.types) ||
        schemaProp.type === "text"
      ) {
        // We simply copy ONLY the breakpoints which are defined in the raw data
        compiled.props[schemaProp.prop] = Object.fromEntries(
          Object.keys(editableElement[schemaProp.prop]).map((deviceId) => {
            return [deviceId, compiledValues[schemaProp.prop][deviceId]];
          })
        );
      } else {
        compiled.props[schemaProp.prop] = responsiveValueNormalize(
          compiledValues[schemaProp.prop],
          compilationContext.devices
        );
      }
    });

    // we also add __props to props
    compiled.props = {
      ...props,
      ...compiled.props,
    };

    // We are going to mutate this object so let's disconnect it from its source object
    configAfterAuto = deepClone({
      ...ownPropsAfterAuto.values,
      ...ownPropsAfterAuto.params,
    });
  }

  if (compilationContext.isEditing) {
    /**
     * Let's build default editingOutput (fields and component output)
     */

    const editorContext = compilationContext as EditorContextType;
    const renderableComponentDefinition =
      componentDefinition as InternalRenderableComponentDefinition;

    editingInfo = buildDefaultEditingInfo(
      renderableComponentDefinition,
      configPrefix,
      editorContext,
      compiledValues,
      editableElement._component
    );

    /**
     * Let's run custom editing function
     */
    if (renderableComponentDefinition.editing) {
      const scalarizedValues = scalarizeConfig(
        compiledValues,
        editorContext.breakpointIndex,
        editorContext.devices,
        renderableComponentDefinition.schema
      );

      const identityEditingField = assertDefined(
        editingInfo.fields.find((f) => f.prop === "$myself")
      );

      const editingInfoWithoutIdentityField: InternalEditingInfo = {
        ...editingInfo,
        // Filter out identity field, since it's not users responsibility to care of it.
        fields: editingInfo.fields.filter((f) => f.prop !== "$myself"),
      };

      const editingInfoInput = convertInternalEditingInfoToEditingInfo(
        editingInfoWithoutIdentityField,
        configPrefix
      );

      const editingInfoResult = renderableComponentDefinition.editing({
        values: scalarizedValues,
        params: ownPropsAfterAuto!.params,
        editingInfo: editingInfoInput,
        device: editorContext.devices.find(
          (device) => device.id === editorContext.breakpointIndex
        )!,
        ...(componentDefinition.id === "@easyblocks/rich-text" ||
        componentDefinition.id === "@easyblocks/rich-text-part"
          ? {
              __SECRET_INTERNALS__: {
                pathPrefix: configPrefix,
                editorContext,
              },
            }
          : {}),
      });

      if (editingInfoResult) {
        const internalEditingInfo = convertEditingInfoToInternalEditingInfo(
          editingInfoResult,
          editingInfo,
          componentDefinition,
          editorContext,
          configPrefix
        );

        internalEditingInfo.fields?.unshift(identityEditingField);
        deepObjectMergeWithoutArrays(editingInfo, internalEditingInfo);
      }
    }

    if (editingInfo)
      // Save to __editing
      applyEditingInfoToCompiledConfig(
        compiled,
        editingInfo,
        parentComponentEditingInfo,
        {
          width: $width,
          auto: $widthAuto,
        }
      );

    editingContextProps = editingInfo.components;
  }

  compileSubcomponents(
    editableElement,
    contextProps,
    subcomponentsContextProps,
    compilationContext,
    meta,
    editingContextProps,
    configPrefix,
    compiled,
    configAfterAuto,
    cache
  );

  cache.set(ownProps.values._id, {
    values: ownProps,
    valuesAfterAuto: ownPropsAfterAuto!,
    compiledValues,
    compiledConfig: compiled,
    contextProps: subcomponentsContextProps,
    editingContextProps,
  });

  if (process.env.SHOPSTORY_INTERNAL_COMPILATION_DEBUG === "true") {
    logCompilationDebugOutput({
      cachedResult,
      hasComponentConfigChanged,
      configPrefix,
      ownProps,
      compiled,
    });
  }

  return {
    compiledComponentConfig: compiled,
    configAfterAuto,
  };
}

function validateStylesProps(
  props: Record<string, unknown>,
  componentDefinition: InternalComponentDefinition
) {
  for (const key of Object.keys(props)) {
    const schemaProp = componentDefinition.schema.find((s) => s.prop === key);

    if (!schemaProp || !("buildOnly" in schemaProp)) {
      continue;
    }

    if (!schemaProp.buildOnly) {
      throw new Error(
        `You've returned property "${key}" in "props" object that conflicts with the same prop in schema of component "${componentDefinition.id}". You can either change the property name or set the schema property as build-only (\`buildOnly: true\`).`
      );
    }
  }
}

function logCompilationDebugOutput({
  cachedResult,
  hasComponentConfigChanged,
  configPrefix,
  ownProps,
  compiled,
}: {
  cachedResult: CompilationCacheItemValue | undefined;
  hasComponentConfigChanged: boolean;
  configPrefix: string;
  ownProps: Record<string, any>;
  compiled: CompiledCustomComponentConfig | CompiledShopstoryComponentConfig;
}) {
  if (cachedResult && !hasComponentConfigChanged) {
    console.groupCollapsed("[cache] ", configPrefix ? configPrefix : "root");
  } else {
    console.groupCollapsed("[compiled] ", configPrefix ? configPrefix : "root");
  }

  console.log(ownProps);
  console.log(compiled);
  console.groupEnd();
}

function createOwnComponentProps({
  config,
  contextProps,
  componentDefinition,
  compilationContext,
}: {
  config: NoCodeComponentEntry;
  contextProps: ContextProps;
  componentDefinition: InternalComponentDefinition;
  compilationContext: CompilationContextType;
}) {
  // Copy all values and refs defined in schema, for component fields copy only _id, _component and its _itemProps but flattened
  const values = Object.fromEntries(
    componentDefinition.schema.map((schemaProp) => {
      if (isSchemaPropComponentOrComponentCollection(schemaProp)) {
        let configValue: Array<NoCodeComponentEntry> = config[schemaProp.prop];

        if (configValue.length === 0) {
          return [schemaProp.prop, []];
        }

        if (isSchemaPropComponent(schemaProp)) {
          return [
            schemaProp.prop,
            [
              {
                _id: configValue[0]._id,
                _component: configValue[0]._component,
              },
            ],
          ];
        }

        if (isSchemaPropComponentCollectionLocalised(schemaProp)) {
          configValue =
            resolveLocalisedValue(
              config[schemaProp.prop] as Record<
                string,
                Array<NoCodeComponentEntry>
              >,
              compilationContext
            )?.value ?? [];
        }

        const configValuesWithFlattenedItemProps = configValue.map((config) => {
          if (schemaProp.itemFields) {
            const flattenedItemProps = flattenItemProps(
              config,
              componentDefinition,
              schemaProp,
              schemaProp.itemFields
            );

            return {
              _id: config._id,
              _component: config._component,
              ...flattenedItemProps,
            };
          }

          return {
            _id: config._id,
            _component: config._component,
          };
        });

        return [schemaProp.prop, configValuesWithFlattenedItemProps];
      }

      return [schemaProp.prop, config[schemaProp.prop]];
    })
  );

  const ownValues: { _id: string; _component: string; [key: string]: any } = {
    // Copy id and component which uniquely identify component.
    _id: config._id,
    _component: config._component,
    ...values,
  };

  return {
    values: ownValues,
    params: contextProps,
  };
}

function flattenItemProps(
  config: NoCodeComponentEntry,
  componentDefinition: InternalComponentDefinition,
  collectionSchemaProp:
    | ComponentCollectionSchemaProp
    | ComponentCollectionLocalisedSchemaProp,
  itemsSchemas: Array<SchemaProp>
) {
  const itemProps = Object.fromEntries(
    itemsSchemas.map((itemSchemaProp) => {
      return [
        itemSchemaProp.prop,
        config._itemProps[componentDefinition.id][collectionSchemaProp.prop][
          itemSchemaProp.prop
        ],
      ];
    })
  );

  return itemProps;
}

function addComponentToSerializedComponentDefinitions(
  component: NoCodeComponentEntry,
  meta: CompilationMetadata,
  componentType: keyof SerializedComponentDefinitions,
  compilationContext: CompilationContextType
) {
  const definitions = meta.vars.definitions[componentType];

  if (definitions.find((def: any) => def.id === component._component)) {
    return;
  }

  const internalDefinition = findComponentDefinition(
    component,
    compilationContext
  ) as InternalRenderableComponentDefinition;

  const newDef: SerializedRenderableComponentDefinition = {
    id: internalDefinition.id,
    label: internalDefinition.label,
    schema: internalDefinition.schema,
    type: internalDefinition.type,
  };

  if (compilationContext.isEditing) {
    newDef.pasteSlots = internalDefinition.pasteSlots ?? [];
  }

  definitions.push(newDef);
}

function compileSubcomponents(
  editableElement: NoCodeComponentEntry,
  contextProps: ContextProps,
  subcomponentsContextProps: Record<string, Record<string, any>>,
  compilationContext: CompilationContextType,
  meta: any,
  editingInfoComponents: InternalEditingInfo["components"] | undefined,
  configPrefix: string,
  compiledComponentConfig: CompiledCustomComponentConfig,
  configAfterAuto: NoCodeComponentEntry | null, // null means that we don't want auto
  cache: CompilationCache
) {
  const componentDefinition = findComponentDefinition(
    editableElement,
    compilationContext
  )!;

  componentDefinition.schema.forEach((schemaProp: SchemaProp) => {
    if (isSchemaPropComponentOrComponentCollection(schemaProp)) {
      // Currently these are processed outside of compileSubcomponents
      if (
        isSchemaPropActionTextModifier(schemaProp) ||
        isSchemaPropTextModifier(schemaProp)
      ) {
        return;
      }

      const childContextProps =
        subcomponentsContextProps[schemaProp.prop] || {};

      // Subcomponents must always have $width and $widthAuto defined. If wasn't set explicitly then parent's one is used.
      childContextProps.$width =
        childContextProps.$width ?? contextProps.$width;
      childContextProps.$widthAuto =
        childContextProps.$widthAuto ?? contextProps.$widthAuto;

      if (
        schemaProp.type === "component-collection" ||
        schemaProp.type === "component-collection-localised"
      ) {
        childContextProps.itemProps = childContextProps.itemProps ?? [];

        let value: any[];
        if (schemaProp.type === "component-collection") {
          value = editableElement[schemaProp.prop];
        } else {
          const resolvedValue = resolveLocalisedValue(
            editableElement[schemaProp.prop],
            compilationContext
          );
          if (!resolvedValue) {
            throw new Error(
              `Can't resolve localised value for prop "${schemaProp.prop}" of component ${editableElement._component}`
            );
          }
          value = resolvedValue.value as any[];
        }

        value.forEach((_: any, index: number) => {
          childContextProps.itemProps[index] =
            childContextProps.itemProps[index] ?? {};
          const itemPropContextProps = childContextProps.itemProps[index];

          itemPropContextProps.$width =
            itemPropContextProps.$width ?? contextProps.$width;
          itemPropContextProps.$widthAuto =
            itemPropContextProps.$widthAuto ?? contextProps.$widthAuto;
        });
      }

      const compilationOutput = compileFromSchema(
        editableElement[schemaProp.prop],
        schemaProp,
        compilationContext,
        cache,
        childContextProps,
        meta,
        editingInfoComponents?.[schemaProp.prop],
        `${configPrefix}${configPrefix === "" ? "" : "."}${schemaProp.prop}`
      ) as ConfigComponentCompilationOutput[];

      compiledComponentConfig.components[schemaProp.prop] =
        compilationOutput.map(
          (compilationOutput) => compilationOutput.compiledComponentConfig
        );

      // Merge config after auto
      if (compilationContext.isEditing && configAfterAuto !== null) {
        if (schemaProp.type === "component") {
          configAfterAuto[schemaProp.prop] = [
            compilationOutput[0]?.configAfterAuto ?? [],
          ];
        } else if (
          schemaProp.type === "component-collection" ||
          schemaProp.type === "component-collection-localised"
        ) {
          const configsAfterAuto = compilationOutput.map(
            (compilationOutput, index) => {
              if (schemaProp.itemFields) {
                const itemPropsCollectionPath = `_itemProps.${editableElement._component}.${schemaProp.prop}`;

                const itemProps = Object.fromEntries(
                  schemaProp.itemFields.map((itemSchemaProp) => {
                    const itemPropValue =
                      configAfterAuto[schemaProp.prop][index][
                        itemSchemaProp.prop
                      ];

                    return [itemSchemaProp.prop, itemPropValue];
                  })
                );

                dotNotationSet(
                  compilationOutput.configAfterAuto,
                  itemPropsCollectionPath,
                  itemProps
                );
              }

              return compilationOutput.configAfterAuto;
            }
          );

          if (schemaProp.type === "component-collection-localised") {
            // We store after auto config within context of current locale only
            configAfterAuto[schemaProp.prop] = {
              [compilationContext.contextParams.locale]: configsAfterAuto,
            };
          } else {
            configAfterAuto[schemaProp.prop] = configsAfterAuto;
          }
        }
      }
    }
  });
}

function calculateWidths(
  compilationContext: CompilationContextType,
  contextProps: ContextProps
) {
  const $width: TrulyResponsiveValue<number> = { $res: true };
  const $widthAuto: TrulyResponsiveValue<boolean> = { $res: true };

  compilationContext.devices.forEach((device) => {
    $width[device.id] = contextProps.$width?.[device.id] ?? -1;
    $widthAuto[device.id] =
      contextProps.$widthAuto?.[device.id] ??
      ($width[device.id] === -1 ? true : false);
  });
  return { $width, $widthAuto };
}

function itemFieldsForEach(
  config: NoCodeComponentEntry,
  compilationContext: CompilationContextType,
  callback: (arg: {
    collectionSchemaProp:
      | ComponentCollectionLocalisedSchemaProp
      | ComponentCollectionSchemaProp;
    itemIndex: number;
    itemSchemaProp: SchemaProp;
    itemPropPath: string;
    itemPropValue: any;
  }) => void
) {
  const componentDefinition = findComponentDefinition(
    config,
    compilationContext
  )!;

  componentDefinition.schema.forEach((schemaProp) => {
    if (isSchemaPropCollection(schemaProp)) {
      const itemFields = (schemaProp as ComponentCollectionSchemaProp)
        .itemFields;

      let path = schemaProp.prop;

      if (schemaProp.type === "component-collection-localised") {
        const localizedValue = resolveLocalisedValue(
          config[schemaProp.prop],
          compilationContext
        );

        if (localizedValue) {
          path = `${path}.${localizedValue.locale}`;
        } else {
          path = `${path}.${compilationContext.contextParams.locale}`;
        }
      }

      const value: Array<NoCodeComponentEntry> =
        dotNotationGet(config, path) ?? [];

      value.forEach((_, index) => {
        if (itemFields) {
          itemFields.forEach((itemSchemaProp) => {
            const itemPath = `${path}.${index}.${itemSchemaProp.prop}`;
            const itemValue = dotNotationGet(config, itemPath);

            callback({
              collectionSchemaProp: schemaProp,
              itemIndex: index,
              itemSchemaProp,
              itemPropPath: itemPath,
              itemPropValue: itemValue,
            });
          });
        }
      });
    }
  });
}

function resolveLocalisedValue<T>(
  localisedValue: Record<string, T>,
  compilationContext: CompilationContextType
): { value: T; locale: string } | undefined {
  const locale = compilationContext.contextParams.locale;

  if (localisedValue[locale] !== undefined) {
    return {
      value: localisedValue[locale],
      locale,
    };
  }

  const fallbackLocale = getFallbackLocaleForLocale(
    locale,
    compilationContext.locales
  );

  if (!fallbackLocale) {
    return;
  }

  return {
    value: localisedValue[fallbackLocale],
    locale: fallbackLocale,
  };
}

function buildDefaultEditingInfo(
  definition: InternalComponentDefinition,
  configPrefix: string,
  editorContext: EditorContextType,
  compiledValues: Record<string, any>,
  templateId: string
) {
  const scalarizedConfig = scalarizeConfig(
    compiledValues,
    editorContext.breakpointIndex,
    editorContext.devices,
    definition.schema
  );

  const schema = [...definition.schema];

  let defaultFields: Array<InternalEditingField> = schema
    // Right now, component-collection schema prop isn't shown in the sidebar
    .filter((schemaProp) => !isSchemaPropCollection(schemaProp))
    .filter((schemaProp) => {
      if (compiledValues.noTrace && schemaProp.prop.startsWith("trace")) {
        return false;
      }
      return true;
    })
    .map((schemaProp) =>
      getDefaultFieldDefinition(
        schemaProp,
        configPrefix,
        definition,
        editorContext,
        scalarizedConfig,
        templateId
      )
    );

  // noAction is a special property
  if (compiledValues.noAction) {
    defaultFields = defaultFields.filter((field) => field.path !== "action");
  }

  const pathInfo = parsePath(configPrefix, editorContext.form);
  const parentInfo = pathInfo.parent;

  if (parentInfo) {
    const parentDefinition = findComponentDefinitionById(
      parentInfo.templateId,
      editorContext
    );

    if (!parentDefinition) {
      throw new Error(`Can't find parent definition: ${parentInfo.templateId}`);
    }
    const parentSchemaProp = parentDefinition.schema.find(
      (schemaProp) => schemaProp.prop === parentInfo.fieldName
    ) as
      | ComponentSchemaProp
      | ComponentCollectionSchemaProp
      | ComponentCollectionLocalisedSchemaProp;

    if (!parentSchemaProp) {
      throw new Error(
        `Can't find parent schemaProp: ${parentInfo.templateId} > ${parentInfo.fieldName}`
      );
    }

    let required: boolean;

    if (parentSchemaProp.type === "component") {
      required = !!parentSchemaProp.required;
    } else {
      required = false;
    }

    const headerSchemaProp: Component$$$SchemaProp = {
      prop: "$myself",
      label: "Component type",
      type: "component$$$",
      picker: parentSchemaProp.picker,
      definition: parentDefinition,
      required,
      group: "Component",
    };

    const headerField: InternalEditingField = {
      component: "identity",
      hidden: false,
      label: "Component type",
      name: configPrefix,
      prop: "$myself",
      schemaProp: headerSchemaProp,
    };

    defaultFields.unshift(headerField);
  } else {
    const rootComponentDefinition = assertDefined(
      findComponentDefinitionById(
        dotNotationGet(editorContext.form.values, "")._component,
        editorContext
      )
    );

    const headerSchemaProp: Component$$$SchemaProp = {
      prop: "$myself",
      label: "Component type",
      type: "component$$$",
      definition: rootComponentDefinition,
      required: true,
      group: "Component",
    };

    const headerField: InternalEditingField = {
      component: "identity",
      hidden: false,
      label: "Component type",
      name: "",
      prop: "$myself",
      schemaProp: headerSchemaProp,
    };

    defaultFields.unshift(headerField);
  }

  const fields = bubbleDown((x) => x.prop === "Analytics", defaultFields);

  const editingInfo: InternalEditingInfo = {
    fields,
    components: {},
  };

  definition.schema.forEach((schemaProp) => {
    if (isSchemaPropCollection(schemaProp)) {
      editingInfo.components[schemaProp.prop] = {
        items: scalarizedConfig[schemaProp.prop].map(
          (x: any, index: number) => ({
            fields: (schemaProp.itemFields ?? []).map((itemSchemaProp) =>
              getDefaultFieldDefinition(
                itemSchemaProp,
                `${configPrefix}${configPrefix === "" ? "" : "."}${
                  schemaProp.prop
                }.${index}._itemProps.${definition.id}.${schemaProp.prop}`,
                definition,
                editorContext,
                scalarizedConfig,
                templateId
              )
            ),
          })
        ),
      };
    } else if (isSchemaPropComponent(schemaProp)) {
      editingInfo.components[schemaProp.prop] = {
        fields: [],
      };
    }
  });

  return editingInfo;
}

function applyEditingInfoToCompiledConfig(
  compiledComponentConfig: CompiledCustomComponentConfig,
  editingInfo: InternalEditingInfo,
  parentEditingInfo:
    | EditingInfoComponent
    | EditingInfoComponentCollection
    | undefined,
  widthInfo: {
    width: TrulyResponsiveValue<number>;
    auto: TrulyResponsiveValue<boolean>;
  }
) {
  const headerFields = editingInfo.fields.filter(
    (field) => field.prop === "$myself"
  );

  const nonHeaderFields = editingInfo.fields.filter(
    (field) => field.prop !== "$myself"
  );

  const fields = [
    ...headerFields,
    ...(parentEditingInfo && "fields" in parentEditingInfo
      ? parentEditingInfo.fields
      : []),
    ...nonHeaderFields,
  ];

  compiledComponentConfig.__editing = {
    ...parentEditingInfo,
    fields,
    components: {},
    widthInfo,
  };

  for (const fieldName in editingInfo.components) {
    compiledComponentConfig.__editing.components[fieldName] = {};
    const childComponentEditingInfo = editingInfo.components[fieldName];

    // Here we copy only noInline. It's the only flag we need in parent component. It's only because we need noInline info even if there is no component in array (to know that we shouldn't render placeholder)
    if (
      "noInline" in childComponentEditingInfo &&
      childComponentEditingInfo.noInline !== undefined
    ) {
      compiledComponentConfig.__editing.components[fieldName].noInline =
        childComponentEditingInfo.noInline;
    }
  }
}

const deepObjectMergeWithoutArrays = (target: any, source: any) => {
  // Iterate through `source` properties and if an `Object` set property to merge of `target` and `source` properties
  for (const key of Object.keys(source)) {
    if (source[key] instanceof Object && !Array.isArray(source[key]))
      Object.assign(
        source[key],
        deepObjectMergeWithoutArrays(target[key], source[key])
      );
  }

  // Join `target` and modified `source`
  Object.assign(target || {}, source);
  return target;
};

function compileRichTextValuesFromRichTextParts(
  richTextConfig: RichTextComponentConfig,
  compilationContext: CompilationContextType,
  cache: CompilationCache
): { mainColor: any; mainFont: any } {
  const mainColor = getMostCommonValueFromRichTextParts(
    richTextConfig,
    "color",
    compilationContext,
    cache
  );

  const mainFont = getMostCommonValueFromRichTextParts(
    richTextConfig,
    "font",
    compilationContext,
    cache
  );

  return { mainColor, mainFont };
}

function mapResponsiveFontToResponsiveFontSize(
  responsiveFontValue: Record<string, any>
) {
  return Object.fromEntries(
    entries(responsiveFontValue).map(([breakpoint, fontValue]) => {
      if (breakpoint === "$res") {
        return [breakpoint, fontValue];
      }

      return [breakpoint, fontValue.fontSize];
    })
  );
}

function getDefaultFieldDefinition(
  schemaProp: SchemaProp,
  configPrefix: string,
  definition: InternalComponentDefinition,
  editorContext: EditorContextType,
  compiledValues: Record<string, any>,
  templateId: string
): InternalEditingField {
  const tinaField = getTinaField(
    {
      ...schemaProp,
      definition,
    },
    editorContext,
    compiledValues[schemaProp.prop]
  );

  let visible = !isSchemaPropComponentOrComponentCollection(schemaProp);

  if (typeof schemaProp.visible === "boolean") {
    visible = schemaProp.visible;
  } else if (typeof schemaProp.visible === "function") {
    visible = schemaProp.visible(compiledValues, { editorContext });
  }

  return {
    ...tinaField,
    prop: schemaProp.prop,
    name: createFieldName(schemaProp, configPrefix),
    hidden: !visible,
  };
}

function createFieldName(schemaProp: SchemaProp, configPrefix: string): string {
  return schemaProp.prop === "$myself"
    ? configPrefix
    : `${configPrefix}${configPrefix === "" ? "" : "."}${schemaProp.prop}`;
}

function convertInternalEditingInfoToEditingInfo(
  editingInfo: InternalEditingInfo,
  configPrefix: string | undefined
): EditingInfo {
  const fields = editingInfo.fields.map((f) => {
    return convertInternalEditingFieldToEditingInfoField(f, configPrefix);
  });

  const components: EditingInfo["components"] = Object.fromEntries(
    Object.entries(editingInfo.components).map(([name, childEditingInfo]) => {
      if ("items" in childEditingInfo) {
        const adaptedChildEditingInfo =
          childEditingInfo.items.map<ChildComponentEditingInfo>((item) => {
            return {
              fields: item.fields.map((f) =>
                convertInternalEditingFieldToEditingInfoField(f, configPrefix)
              ),
              direction: item.direction,
              selectable: item.noInline,
            };
          });

        return [name, adaptedChildEditingInfo];
      }

      return [
        name,
        {
          fields: childEditingInfo.fields.map((f) =>
            convertInternalEditingFieldToEditingInfoField(f, configPrefix)
          ),
          direction: childEditingInfo.direction,
          selectable: childEditingInfo.noInline,
        },
      ];
    })
  );

  return {
    fields,
    components,
  };
}

function convertInternalEditingFieldToEditingInfoField(
  field: InternalEditingField,
  configPrefix: string | undefined
): EditingField {
  const path =
    field.schemaProp.prop === "$myself"
      ? field.schemaProp.prop
      : toRelativeFieldPath(field.name, configPrefix);

  return {
    path,
    type: "field",
    visible: typeof field.hidden === "boolean" ? !field.hidden : true,
    group: field.group,
    label: field.label,
  };
}

function toRelativeFieldPath(path: string, configPrefix: string | undefined) {
  let adjustedPath = path;

  if (path.includes("_itemProps")) {
    const pathFragments = path.split(".");
    const itemPropsFragmentIndex = pathFragments.indexOf("_itemProps");
    const adjustedPathFragments = [
      ...pathFragments.slice(0, itemPropsFragmentIndex),
      pathFragments.at(-1),
    ];
    adjustedPath = adjustedPathFragments.join(".");
  }

  return configPrefix
    ? adjustedPath.replace(`${configPrefix}.`, "")
    : adjustedPath;
}

function convertEditingInfoToInternalEditingInfo(
  editingInfo: NoCodeComponentEditingFunctionResult,
  internalEditingInfo: InternalEditingInfo,
  componentDefinition: InternalRenderableComponentDefinition,
  editorContext: EditorContextType,
  configPrefix: string | undefined
): InternalEditingFunctionResult {
  let internalEditingInfoFields:
    | InternalEditingFunctionResult["fields"]
    | undefined;

  if (editingInfo.fields) {
    if (!internalEditingInfoFields) {
      internalEditingInfoFields = [];
    }

    for (const field of editingInfo.fields) {
      const internalEditingInfoField =
        convertEditingFieldToInternalEditingField(
          field,
          internalEditingInfo,
          componentDefinition,
          editorContext,
          configPrefix
        );

      internalEditingInfoFields.push(internalEditingInfoField);
    }
  }

  let internalEditingInfoComponents:
    | InternalEditingFunctionResult["components"]
    | undefined;

  if (editingInfo.components) {
    internalEditingInfoComponents = {};

    for (const [name, childEditingInfo] of Object.entries(
      editingInfo.components
    )) {
      const sourceInternalEditingInfoComponent =
        internalEditingInfo.components[name];

      if (!sourceInternalEditingInfoComponent) {
        throw new Error(
          `Found component at path ${configPrefix} but it's not defined in the schema`
        );
      }

      if (Array.isArray(childEditingInfo)) {
        internalEditingInfoComponents[name] = {
          items: childEditingInfo.map((editingInfoItem, index) => {
            const sourceInternalFields = (
              sourceInternalEditingInfoComponent as EditingInfoComponentCollection
            ).items[index].fields;

            const internalFields = editingInfoItem.fields?.map((field) => {
              const internalEditingInfoField =
                convertEditingFieldToInternalEditingField(
                  field,
                  internalEditingInfo,
                  componentDefinition,
                  editorContext,
                  configPrefix
                );

              return internalEditingInfoField;
            });

            const result: EditingInfoComponent = {
              fields: internalFields ?? sourceInternalFields,
            };

            if (editingInfoItem.direction) {
              result.direction = editingInfoItem.direction;
            }

            if (editingInfoItem.selectable !== undefined) {
              result.noInline = !editingInfoItem.selectable;
            }

            return result;
          }),
        };
      } else {
        const result: Partial<EditingInfoComponent> = {};

        if (childEditingInfo.fields) {
          result.fields = childEditingInfo.fields.map((field) => {
            const internalEditingInfoField =
              convertEditingFieldToInternalEditingField(
                field,
                internalEditingInfo,
                componentDefinition,
                editorContext,
                configPrefix
              );

            return internalEditingInfoField;
          });
        }

        if (childEditingInfo.direction) {
          result.direction = childEditingInfo.direction;
        }

        if (childEditingInfo.selectable !== undefined) {
          result.noInline = !childEditingInfo.selectable;
        }

        internalEditingInfoComponents[name] = result;
      }
    }
  }

  const result: InternalEditingFunctionResult = {};

  if (internalEditingInfoFields) {
    result.fields = internalEditingInfoFields;
  }

  if (internalEditingInfoComponents) {
    result.components = internalEditingInfoComponents;
  }

  return result;
}

function convertEditingFieldToInternalEditingField(
  field: AnyEditingField,
  internalEditingInfo: InternalEditingInfo,
  componentDefinition: InternalRenderableComponentDefinition,
  editorContext: EditorContextType,
  configPrefix: string | undefined
): NonNullable<InternalEditingFunctionResult["fields"]>[number] {
  if (
    componentDefinition.id === "@easyblocks/rich-text" ||
    componentDefinition.id === "@easyblocks/rich-text-part"
  ) {
    // This is a special case. Rich text components have a really nasty `editing` function implementation
    // relying on `editorContext`, absolute paths and multi field portals. Ideally it would best to address this,
    // but right now let's keep it as it is and treat it like an exception

    // Even though the type definition for field doesn't allow `path` to be an array, $richText component
    // returns an array of paths.
    if (Array.isArray(field.path)) {
      const fieldName =
        field.path[0]?.split(".").at(-1) ??
        raiseError("Expected field name to be present");
      const sources = field.path.map((p) =>
        p.split(".").slice(0, -1).join(".")
      );

      return {
        portal: "multi-field",
        fieldName,
        sources,
      };
    }

    const isAbsolutePath = isFieldPathAbsolutePath(field, editorContext);

    if (isAbsolutePath) {
      if (field.type === "fields") {
        const groups = field.filters?.group
          ? toArray(field.filters.group)
          : undefined;

        return {
          portal: "component",
          source: field.path,
          groups,
        };
      }

      const pathFragments = field.path.split(".");
      const fieldName =
        pathFragments.at(-1) ?? raiseError("Expected field name to be present");
      const source = pathFragments.slice(0, -1).join(".");

      return {
        portal: "field",
        source,
        fieldName,
      };
    }
  }

  if (field.type === "field") {
    let sourceInternalEditingInfoField = internalEditingInfo.fields.find(
      (f) => {
        return (
          f.name === toAbsolutePath(field.path, configPrefix) ||
          field.path === "$myself"
        );
      }
    );

    if (!sourceInternalEditingInfoField) {
      const pathFragments = field.path.split(".");
      const isPathToComponentField = pathFragments.length > 1;

      if (isPathToComponentField) {
        const componentSchemaProp = componentDefinition.schema.find(
          isSchemaPropComponentOrComponentCollection
        );

        if (componentSchemaProp) {
          if (isSchemaPropCollection(componentSchemaProp)) {
            const itemField = componentSchemaProp.itemFields?.find(
              (f) => f.prop === pathFragments.at(-1)
            );

            if (itemField) {
              const componentItemIndex = +pathFragments[1];
              sourceInternalEditingInfoField = (
                internalEditingInfo.components[
                  componentSchemaProp.prop
                ] as EditingInfoComponentCollection
              ).items[componentItemIndex].fields.find(
                (f) => f.prop === itemField.prop
              );
            }
          }

          if (
            componentSchemaProp.type === "component" &&
            componentSchemaProp.required
          ) {
            const absoluteFieldPath = toAbsolutePath(
              pathFragments.slice(0, -1).join("."),
              configPrefix
            );

            const overrides: Extract<
              FieldPortal,
              { portal: "field" }
            >["overrides"] = {};

            if (field.label !== undefined) {
              overrides.label = field.label;
            }

            if (field.group !== undefined) {
              overrides.group = field.group;
            }

            return {
              portal: "field",
              fieldName: pathFragments.at(-1)!,
              source: absoluteFieldPath,
              overrides,
            };
          }
        }
      }

      if (!sourceInternalEditingInfoField) {
        throw new Error(
          `Field "${field.path}" for component "${componentDefinition.id}" not found.`
        );
      }
    }

    return {
      ...sourceInternalEditingInfoField,
      label: field.label,
      group: field.group,
      hidden: !field.visible,
    };
  }

  if (field.type === "fields") {
    const absoluteFieldPath = toAbsolutePath(field.path, configPrefix);

    return {
      portal: "component",
      source: absoluteFieldPath,
      ...(field.filters?.group !== undefined && {
        groups: toArray(field.filters.group),
      }),
    };
  }

  throw new Error(`Unknown field type`);
}

function isFieldPathAbsolutePath(
  field: AnyEditingField,
  editorContext: EditorContextType
) {
  const pathFragments = field.path.split(".");
  const rootValue = dotNotationGet(editorContext.form.values, "");
  let currentPathFragmentIndex = 0;

  let currentValue = dotNotationGet(
    rootValue,
    pathFragments[currentPathFragmentIndex]
  );

  while (currentValue !== undefined) {
    if (pathFragments.length - 1 === currentPathFragmentIndex) {
      return true;
    }

    currentValue = dotNotationGet(
      currentValue,
      pathFragments[++currentPathFragmentIndex]
    );
  }

  return false;
}

function toAbsolutePath(path: string, configPrefix: string | undefined) {
  if (configPrefix) {
    return `${configPrefix}.${path}`;
  }

  return path;
}

function isSchemaPropTokenized(schemaProp: SchemaProp) {
  return (
    schemaProp.type === "color" ||
    schemaProp.type === "space" ||
    schemaProp.type === "font" ||
    schemaProp.type === "aspectRatio" ||
    schemaProp.type === "boxShadow" ||
    schemaProp.type === "containerWidth"
  );
}
