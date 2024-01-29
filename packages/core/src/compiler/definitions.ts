import { uniqueId } from "@easyblocks/utils";
import { SetOptional } from "type-fest";
import { isLocalValue } from "..";
import { getFallbackForLocale, getFallbackLocaleForLocale } from "../locales";
import {
  isTrulyResponsiveValue,
  responsiveValueAt,
  responsiveValueFill,
  responsiveValueFlatten,
  responsiveValueMap,
} from "../responsiveness";
import {
  BooleanSchemaProp,
  CompiledComponentConfig,
  CompiledLocalTextReference,
  ComponentCollectionLocalisedSchemaProp,
  ComponentCollectionSchemaProp,
  ComponentSchemaProp,
  Devices,
  ExternalReference,
  ExternalReferenceEmpty,
  ExternalReferenceNonEmpty,
  ExternalSchemaProp,
  LocalSchemaProp,
  LocalTextReference,
  LocalValue,
  NoCodeComponentEntry,
  NumberSchemaProp,
  Option,
  Position,
  PositionSchemaProp,
  RadioGroupSchemaProp,
  ResponsiveValue,
  SchemaProp,
  SelectSchemaProp,
  SerializedComponentDefinitions,
  StringSchemaProp,
  TextSchemaProp,
  ThemeRefValue,
  TokenSchemaProp,
  TokenValue,
  TrulyResponsiveValue,
} from "../types";
import { CompilationCache } from "./CompilationCache";
import { buildRichTextNoCodeEntry } from "./builtins/$richText/builders";
import { compileComponent } from "./compileComponent";
import { getDevicesWidths } from "./devices";
import {
  findComponentDefinitionById,
  findComponentDefinitionsByType,
} from "./findComponentDefinition";
import { isContextEditorContext } from "./isContextEditorContext";
import { Component$$$SchemaProp } from "./schema";
import {
  CompilationContextType,
  ContextProps,
  EditingInfoComponent,
  EditingInfoComponentCollection,
} from "./types";

type SchemaPropDefinition<Type, CompiledType = Type> = {
  compile: (
    value: Type,
    contextProps: ContextProps,
    serializedDefinitions: SerializedComponentDefinitions,
    editingInfoComponent:
      | EditingInfoComponent
      | EditingInfoComponentCollection
      | undefined,
    configPrefix: string,
    cache: CompilationCache
  ) => CompiledType;
  normalize: (value: any) => Type; // produces valid internal type
  getHash: (
    value: Type,
    breakpointIndex: string,
    devices: Devices
  ) => string | undefined;
};

type TextSchemaPropDefinition = SchemaPropDefinition<
  LocalTextReference | ExternalReference<string>,
  CompiledLocalTextReference | ExternalReference<string>
>;

type StringSchemaPropDefinition = SchemaPropDefinition<
  ResponsiveValue<string>,
  ResponsiveValue<string>
>;

type NumberSchemaPropDefinition = SchemaPropDefinition<number, number>;

type BooleanSchemaPropDefinition = SchemaPropDefinition<
  ResponsiveValue<boolean>,
  ResponsiveValue<boolean>
>;

type SelectSchemaPropDefinition = SchemaPropDefinition<
  ResponsiveValue<string>,
  ResponsiveValue<string>
>;

type RadioGroupSchemaPropDefinition = SchemaPropDefinition<
  ResponsiveValue<string>,
  ResponsiveValue<string>
>;

export type ConfigComponentCompilationOutput = {
  compiledComponentConfig: CompiledComponentConfig;
  configAfterAuto: NoCodeComponentEntry;
};

type ComponentSchemaPropDefinition = SchemaPropDefinition<
  Array<NoCodeComponentEntry>,
  Array<ConfigComponentCompilationOutput>
>;

type ComponentCollectionSchemaPropDefinition = SchemaPropDefinition<
  Array<NoCodeComponentEntry>,
  Array<ConfigComponentCompilationOutput>
>;

type ComponentCollectionLocalisedSchemaPropDefinition = SchemaPropDefinition<
  { [locale: string]: NoCodeComponentEntry[] },
  Array<ConfigComponentCompilationOutput>
>;

type Component$$$SchemaPropDefinition = SchemaPropDefinition<
  NoCodeComponentEntry,
  NoCodeComponentEntry
>;

export type SchemaPropDefinitionProviders = {
  text: (
    schemaProp: TextSchemaProp,
    compilationContext: CompilationContextType
  ) => TextSchemaPropDefinition;
  string: (
    schemaProp: StringSchemaProp,
    compilationContext: CompilationContextType
  ) => StringSchemaPropDefinition;
  number: (
    schemaProp: NumberSchemaProp,
    compilationContext: CompilationContextType
  ) => NumberSchemaPropDefinition;
  boolean: (
    schemaProp: BooleanSchemaProp,
    compilationContext: CompilationContextType
  ) => BooleanSchemaPropDefinition;
  select: (
    schemaProp: SelectSchemaProp,
    compilationContext: CompilationContextType
  ) => SelectSchemaPropDefinition;
  "radio-group": (
    schemaProp: RadioGroupSchemaProp,
    compilationContext: CompilationContextType
  ) => RadioGroupSchemaPropDefinition;
  component: (
    schemaProp: ComponentSchemaProp,
    compilationContext: CompilationContextType
  ) => ComponentSchemaPropDefinition;
  "component-collection": (
    schemaProp: ComponentCollectionSchemaProp,
    compilationContext: CompilationContextType
  ) => ComponentCollectionSchemaPropDefinition;
  "component-collection-localised": (
    schemaProp: ComponentCollectionLocalisedSchemaProp,
    compilationContext: CompilationContextType
  ) => ComponentCollectionLocalisedSchemaPropDefinition;
  component$$$: (
    schemaProp: Component$$$SchemaProp,
    compilationContext: CompilationContextType
  ) => Component$$$SchemaPropDefinition;
  // external: (
  //   schemaProp: ExternalSchemaProp,
  //   compilationContext: CompilationContextType
  // ) => ExternalSchemaPropDefinition;
  position: (
    schemaProp: PositionSchemaProp,
    compilationContext: CompilationContextType
  ) => SchemaPropDefinition<
    ResponsiveValue<Position>,
    ResponsiveValue<Position>
  >;
  custom: (
    schemaProp: ExternalSchemaProp | LocalSchemaProp | TokenSchemaProp,
    compilationContext: CompilationContextType
  ) => SchemaPropDefinition<
    ResponsiveValue<ExternalReference | LocalValue | TokenValue>,
    ExternalReference | string
  >;
};

type SchemaPropDefinitionProvider =
  SchemaPropDefinitionProviders[keyof SchemaPropDefinitionProviders];

const textProvider: SchemaPropDefinitionProviders["text"] = (
  schemaProp,
  compilationContext
) => {
  const checkIfValid = (x: any) => {
    if (typeof x !== "object" || x === null) {
      return false;
    }

    if (typeof x.id === "string") {
      if (x.id.startsWith("local.")) {
        // for local values "value" must be object
        if (typeof x.value !== "object" || x.value === null) {
          return false;
        }
      }
    }

    return true;
  };

  return {
    normalize: (x: any) => {
      if (x === undefined || x === null) {
        return {
          id: "local." + uniqueId(),
          value: {
            [compilationContext.contextParams.locale]:
              schemaProp.defaultValue ?? "Lorem ipsum",
          },
          widgetId: "@easyblocks/local-text",
        };
      }

      if (checkIfValid(x)) {
        return x;
      }

      throw new Error(`incorrect text type: ${x}`);
    },
    compile: (x) => {
      if ("value" in x) {
        const value = x.value[compilationContext.contextParams.locale];

        // Let's apply fallback when we're editing
        if (
          isContextEditorContext(compilationContext) &&
          compilationContext.locales &&
          typeof value !== "string"
        ) {
          const fallbackValue =
            getFallbackForLocale(
              x.value,
              compilationContext.contextParams.locale,
              compilationContext.locales
            ) ?? "";

          return {
            id: x.id,
            value: fallbackValue,
            widgetId: "@easyblocks/local-text",
          };
        }

        if (value === undefined) {
          const availableLocales = Object.keys(x.value)
            .map((locale) => `"${locale}"`)
            .join(",");

          throw new Error(
            `The content passed to ShopstoryClient is not available in a locale: "${compilationContext.contextParams.locale}" (available locales: ${availableLocales}). Please make sure to provide a valid locale code.`
          );
        }

        return {
          id: x.id,
          value,
          widgetId: "@easyblocks/local-text",
        };
      }

      return {
        id: x.id,
        widgetId: x.widgetId,
        ...(x.id !== null && { key: x.key }),
      };
    },
    getHash: (value) => {
      // TODO: those conditions will be removed after we merge external-local texts update
      if (typeof value === "string") {
        return value;
      }
      if (value === null) {
        return undefined;
      }

      return value.id ?? undefined;
    },
  };
};

export const schemaPropDefinitions: SchemaPropDefinitionProviders = {
  text: textProvider,
  number: (schemaProp, compilationContext): NumberSchemaPropDefinition => {
    const normalize = getNormalize(
      compilationContext,
      schemaProp.defaultValue,
      0,
      (x) => (typeof x === "number" ? x : undefined)
    );
    return {
      normalize,
      compile: (x) => x,
      getHash: (value) => {
        return value.toString();
      },
    };
  },

  string: (schemaProp, compilationContext): StringSchemaPropDefinition => {
    const normalize = schemaProp.responsive
      ? getResponsiveNormalize(
          compilationContext,
          schemaProp.defaultValue,
          "",
          (x) => (typeof x === "string" ? x : undefined)
        )
      : getNormalize(compilationContext, schemaProp.defaultValue, "", (x) =>
          typeof x === "string" ? x : undefined
        );

    return {
      normalize,
      compile: (x) => x,
      getHash: (value, breakpointIndex) => {
        if (isTrulyResponsiveValue(value)) {
          return responsiveValueAt(value, breakpointIndex);
        }

        return value;
      },
    };
  },

  boolean: (schemaProp, compilationContext): BooleanSchemaPropDefinition => {
    const normalize = schemaProp.responsive
      ? getResponsiveNormalize(
          compilationContext,
          schemaProp.defaultValue,
          false,
          (x) => (typeof x === "boolean" ? x : undefined)
        )
      : getNormalize(compilationContext, schemaProp.defaultValue, false, (x) =>
          typeof x === "boolean" ? x : undefined
        );

    return {
      normalize,
      compile: (x) => x,
      getHash: (value, breakpointIndex) => {
        if (isTrulyResponsiveValue(value)) {
          const breakpointValue = responsiveValueAt(value, breakpointIndex);
          return breakpointValue?.toString();
        }

        return value.toString();
      },
    };
  },

  select: getSelectSchemaPropDefinition(),

  "radio-group": getSelectSchemaPropDefinition(),

  component: (
    schemaProp,
    compilationContext: CompilationContextType
  ): ComponentSchemaPropDefinition => {
    // Here:
    // 1. if non-fixed => block field.
    // 2. if fixed => block field with "fixed" flag (no component picker).
    const normalize = (x: any) => {
      if (!Array.isArray(x) || x.length === 0) {
        if (schemaProp.required) {
          const accepts = schemaProp.accepts[0];
          const componentDefinition = findComponentDefinitionById(
            accepts,
            compilationContext
          );

          if (!componentDefinition) {
            const componentDefinitionsByType = findComponentDefinitionsByType(
              accepts,
              compilationContext
            );

            if (componentDefinitionsByType.length > 0) {
              return [
                normalizeComponent(
                  { _component: componentDefinitionsByType[0].id },
                  compilationContext
                ),
              ];
            }
          }

          return [
            normalizeComponent({ _component: accepts }, compilationContext),
          ];
        }

        return [];
      }
      return [normalizeComponent(x[0], compilationContext)];
    };

    return {
      normalize,
      compile: (
        arg,
        contextProps,
        serializedDefinitions,
        editingInfoComponent,
        configPrefix,
        cache
      ) => {
        if (arg.length === 0) {
          return [];
        }

        // FIXME: ?????
        const { configAfterAuto, compiledComponentConfig } = compileComponent(
          arg[0] as NoCodeComponentEntry,
          compilationContext,
          contextProps,
          serializedDefinitions || {
            components: [],
          },
          cache,
          editingInfoComponent,
          `${configPrefix}.0`
        );

        return [
          {
            configAfterAuto,
            compiledComponentConfig,
          },
        ];
      },
      getHash: (value) => {
        if (value.length > 0) {
          // For now, if the block's value contains elements, it will only contain single element
          if (process.env.NODE_ENV === "development") {
            console.assert(
              value.length === 1,
              "component prop should have only one element"
            );
          }

          return value[0]._component;
        }

        return "__BLOCK_EMPTY__";
      },
    };
  },

  "component-collection": (
    _,
    compilationContext: CompilationContextType
  ): ComponentCollectionSchemaPropDefinition => {
    const normalize = (x: any) => {
      if (!Array.isArray(x)) {
        return [];
      }
      const ret = (x || []).map((item: NoCodeComponentEntry) =>
        normalizeComponent(item, compilationContext)
      );

      return ret;
    };

    return {
      normalize,
      compile: (
        arr,
        contextProps,
        serializedDefinitions,
        editingInfoComponents,
        configPrefix,
        cache
      ) => {
        return arr.map((componentConfig, index) =>
          compileComponent(
            componentConfig as NoCodeComponentEntry,
            compilationContext,
            (contextProps.itemProps || [])[index] || {},
            serializedDefinitions,
            cache,
            (
              editingInfoComponents as
                | EditingInfoComponentCollection
                | undefined
            )?.items?.[index],
            `${configPrefix}.${index}`
          )
        );
      },
      getHash: (value) => {
        return value.map((v) => v._component).join(";");
      },
    };
  },

  "component-collection-localised": (
    schemaProp,
    compilationContext: CompilationContextType
  ): ComponentCollectionLocalisedSchemaPropDefinition => {
    const collectionSchemaPropDefinition = schemaPropDefinitions[
      "component-collection"
    ]({ ...schemaProp, type: "component-collection" }, compilationContext);

    return {
      normalize: (x: any) => {
        if (x === undefined) {
          return {};
        }
        const normalized: { [locale: string]: NoCodeComponentEntry[] } = {};
        for (const locale in x) {
          if (locale === "__fallback") {
            continue;
          }

          normalized[locale] = collectionSchemaPropDefinition.normalize(
            x[locale]
          );
        }

        return normalized;
      },
      compile: (
        value,
        contextProps,
        serializedDefinitions,
        editingInfoComponents,
        configPrefix,
        cache
      ) => {
        const resolvedLocalisedValue = resolveLocalisedValue(
          value,
          compilationContext
        );

        return collectionSchemaPropDefinition.compile(
          resolvedLocalisedValue?.value ?? [],
          contextProps,
          serializedDefinitions,
          editingInfoComponents,
          `${configPrefix}.${
            resolvedLocalisedValue?.locale ??
            compilationContext.contextParams.locale
          }`,
          cache
        );
      },
      getHash: (value, breakpoint, devices) => {
        return collectionSchemaPropDefinition.getHash(
          value[compilationContext.contextParams.locale] ?? [],
          breakpoint,
          devices
        );
      },
    };
  },

  component$$$: () => {
    return {
      normalize: (x) => x,
      compile: (x) => x,
      getHash: (x) => x._component,
    };
  },

  // external: (schemaProp, compilationContext) => {
  //   if (schemaProp.responsive) {
  //     const defaultValue: ExternalReferenceEmpty = {
  //       id: null,
  //       widgetId: compilationContext.isEditing
  //         ? compilationContext.types[schemaProp.type]?.widgets[0]?.id
  //         : "",
  //     };

  //     const normalize = getResponsiveNormalize<ExternalReference>(
  //       compilationContext,
  //       defaultValue,
  //       defaultValue,
  //       externalNormalize(schemaProp.type)
  //     );

  //     return {
  //       normalize,
  //       compile: (x) => x,
  //       getHash: externalReferenceGetHash,
  //     };
  //   }

  //   return {
  //     normalize: (value) => {
  //       const normalized = externalNormalize(schemaProp.type)(
  //         value,
  //         compilationContext
  //       );

  //       if (!normalized) {
  //         return {
  //           id: null,
  //           widgetId: compilationContext.types[schemaProp.type]?.widgets[0]?.id,
  //         };
  //       }

  //       return normalized;
  //     },
  //     compile: (value) => {
  //       return value;
  //     },
  //     getHash: (value) => {
  //       if (value.id === null) {
  //         return `${schemaProp.type}.${value.widgetId}`;
  //       }

  //       return `${schemaProp.type}.${value.widgetId}.${value.id}`;
  //     },
  //   };
  // },
  position: (schemaProp, compilationContext) => {
    return {
      normalize: getResponsiveNormalize<Position>(
        compilationContext,
        schemaProp.defaultValue,
        "top-left",
        (x) => {
          return typeof x === "string" ? (x as Position) : "top-left";
        }
      ),
      compile: (x) => x,
      getHash: (value, currentBreakpoint) => {
        if (isTrulyResponsiveValue(value)) {
          const breakpointValue = responsiveValueAt(value, currentBreakpoint);
          return breakpointValue?.toString();
        }

        return value;
      },
    };
  },
  custom: (schemaProp, compilationContext) => {
    const customTypeDefinition = compilationContext.types[schemaProp.type];

    return {
      normalize: (value) => {
        if (customTypeDefinition.type === "inline") {
          const defaultValue =
            schemaProp.defaultValue ?? customTypeDefinition.defaultValue;

          const normalizeScalar = (v: any) => {
            if (isLocalValue(v)) {
              if (customTypeDefinition.validate) {
                const isValueValid = customTypeDefinition.validate(v.value);

                if (isValueValid) {
                  return v;
                }

                return {
                  value: defaultValue,
                  widgetId: v.widgetId,
                };
              }

              return {
                value: v.value ?? defaultValue,
                widgetId: v.widgetId,
              };
            }

            return {
              value: v ?? defaultValue,
              widgetId: customTypeDefinition.widget.id,
            };
          };

          if (
            (customTypeDefinition.responsiveness === "optional" &&
              schemaProp.responsive) ||
            customTypeDefinition.responsiveness === "always"
          ) {
            const normalize = getResponsiveNormalize(
              compilationContext,
              defaultValue,
              defaultValue,
              normalizeScalar
            );

            return normalize(value);
          }

          if (
            customTypeDefinition.responsiveness === "never" &&
            schemaProp.responsive
          ) {
            console.warn(
              `Custom type "${schemaProp.type}" is marked as "never" responsive, but schema prop is marked as responsive. This is not supported and the value for this field is going to stay not responsive. Please change custom type definition or schema prop definition.`
            );
          }

          const result = normalizeScalar(value);

          if (result) {
            return result;
          }

          const defaultLocalValue: LocalValue = {
            value: defaultValue,
            widgetId: customTypeDefinition.widget.id,
          };

          return defaultLocalValue;
        }

        if (customTypeDefinition.type === "token") {
          const themeValues =
            compilationContext.theme[customTypeDefinition.token];
          const defaultValue =
            schemaProp.defaultValue ?? customTypeDefinition.defaultValue;
          const defaultWidgetId = customTypeDefinition.widget?.id;

          const createTokenNormalizer = (normalizeScalar?: (x: any) => any) => {
            return customTypeDefinition.responsiveness === "always" ||
              (customTypeDefinition.responsiveness === "optional" &&
                schemaProp.responsive)
              ? getResponsiveNormalize<any>(
                  compilationContext,
                  schemaProp.defaultValue,
                  customTypeDefinition.defaultValue,
                  (x: any) => {
                    return normalizeTokenValue(
                      x,
                      themeValues as ResponsiveValue<any>,
                      defaultValue,
                      defaultWidgetId,
                      normalizeScalar ?? ((x) => x)
                    );
                  }
                )
              : getNormalize(
                  compilationContext,
                  schemaProp.defaultValue,
                  customTypeDefinition.defaultValue,
                  (x: any) => {
                    return normalizeTokenValue(
                      x,
                      themeValues as ResponsiveValue<any>,
                      defaultValue,
                      defaultWidgetId,
                      normalizeScalar ?? ((x) => x)
                    );
                  }
                );
          };

          if (customTypeDefinition.token === "space") {
            const normalizeSpace = createTokenNormalizer((x) => {
              if (typeof x === "number") {
                return `${x}px`;
              }

              const isValidSpacing = customTypeDefinition.validate?.(x) ?? true;

              if (!isValidSpacing) {
                return;
              }

              return x;
            });

            return normalizeSpace(value);
          }

          if (customTypeDefinition.token === "icons") {
            const scalarValueNormalize = (x: any) => {
              if (typeof x === "string" && x.trim().startsWith("<svg")) {
                return x;
              }
              return;
            };

            const iconDefaultValue =
              normalizeTokenValue<string>(
                schemaProp.defaultValue,
                themeValues as Record<string, ThemeRefValue<string>>,
                customTypeDefinition.defaultValue,
                defaultWidgetId,
                scalarValueNormalize
              ) ?? customTypeDefinition.defaultValue;

            return (
              normalizeTokenValue<string>(
                value,
                themeValues as Record<string, ThemeRefValue<string>>,
                iconDefaultValue,
                defaultWidgetId,
                scalarValueNormalize
              ) ?? value
            );
          }

          const defaultTokenNormalizer = createTokenNormalizer();

          return defaultTokenNormalizer(value);
        }

        if (customTypeDefinition.type === "external") {
          if (schemaProp.responsive) {
            const defaultValue: ExternalReferenceEmpty = {
              id: null,
              widgetId: compilationContext.isEditing
                ? customTypeDefinition.widgets[0]?.id
                : "",
            };

            const normalize = getResponsiveNormalize<ExternalReference>(
              compilationContext,
              defaultValue,
              defaultValue,
              externalNormalize(schemaProp.type)
            );

            return normalize(value);
          }

          const normalized = externalNormalize(schemaProp.type)(
            value,
            compilationContext
          );

          if (!normalized) {
            return {
              id: null,
              widgetId: customTypeDefinition.widgets[0]?.id,
            };
          }

          return normalized;
        }

        throw new Error("Unknown type definition");
      },
      compile: (x) => {
        const val = responsiveValueMap(x, (y) => {
          if ("value" in y) {
            return y.value;
          }

          return y;
        });

        const flattened = responsiveValueFlatten(
          val,
          compilationContext.devices
        );

        return responsiveValueFill(
          flattened,
          compilationContext.devices,
          getDevicesWidths(compilationContext.devices)
        );
      },
      getHash: (value, breakpointIndex) => {
        function getTokenValue(value: TokenValue) {
          if (value.tokenId) {
            return value.tokenId;
          }

          if (typeof value.value === "object") {
            return JSON.stringify(value.value);
          }

          const scalarVal: any = value.value;

          if (scalarVal.toString) {
            return scalarVal.toString();
          }

          throw new Error("unreachable");
        }

        if (customTypeDefinition.type === "external") {
          return externalReferenceGetHash(
            value as ResponsiveValue<ExternalReference>,
            breakpointIndex
          );
        }

        if (isTrulyResponsiveValue(value)) {
          const breakpointValue = responsiveValueAt(
            value as TrulyResponsiveValue<LocalValue | TokenValue>,
            breakpointIndex
          );

          if (!breakpointValue) {
            return;
          }

          if ("tokenId" in breakpointValue) {
            return getTokenValue(breakpointValue);
          }

          return typeof breakpointValue.value === "object"
            ? JSON.stringify(breakpointValue.value)
            : breakpointValue.value;
        }

        if ("tokenId" in value) {
          return getTokenValue(value);
        }

        return typeof (value as LocalValue).value === "object"
          ? JSON.stringify((value as LocalValue).value)
          : (value as LocalValue).value;
      },
    };
  },
};

function getNormalize<T>(
  compilationContext: CompilationContextType,
  defaultValue: any,
  fallbackDefaultValue: T,
  normalize: (
    x: any,
    compilationContext: CompilationContextType
  ) => T | undefined = (x) => x
) {
  return (val: any): T => {
    const normalizedVal = normalize(val, compilationContext);
    if (normalizedVal !== undefined) {
      return normalizedVal;
    }

    const normalizedDefaultVal = normalize(defaultValue, compilationContext);
    if (normalizedDefaultVal !== undefined) {
      return normalizedDefaultVal;
    }

    return normalize(fallbackDefaultValue, compilationContext) as T;
  };
}

function getResponsiveNormalize<ScalarType>(
  compilationContext: CompilationContextType,
  defaultValue: any,
  fallbackDefaultValue: ScalarType,
  normalize: (
    x: any,
    compilationContext: CompilationContextType
  ) => ScalarType | undefined = (x) => x
) {
  if (isTrulyResponsiveValue(defaultValue)) {
    /**
     * Here we must decide how this behaves. It's not obvious. If default is responsive, we cannot easily use default breakpoints.
     * It's because auto might be different. Changing one breakpoint changes "context" for others.
     */
    throw new Error("default responsive values not yet supported");
  }

  return (val: any): TrulyResponsiveValue<ScalarType> => {
    const scalarNormalize = getNormalize(
      compilationContext,
      defaultValue,
      fallbackDefaultValue,
      normalize
    );

    // if value is not really responsive
    if (!isTrulyResponsiveValue(val)) {
      return {
        $res: true,
        [compilationContext.mainBreakpointIndex]: scalarNormalize(val),
      };
    }

    const responsiveVal = responsiveValueMap(val, (x) => {
      return normalize(x, compilationContext);
    });

    // main breakpoint always set
    if (responsiveVal[compilationContext.mainBreakpointIndex] === undefined) {
      responsiveVal[compilationContext.mainBreakpointIndex] =
        scalarNormalize(undefined);
    }

    return responsiveVal as TrulyResponsiveValue<ScalarType>;
  };
}

function getSelectSchemaPropDefinition() {
  return (
    schemaProp: SelectSchemaProp | RadioGroupSchemaProp,
    compilationContext: CompilationContextType
  ): SelectSchemaPropDefinition => {
    return {
      normalize: schemaProp.responsive
        ? getResponsiveNormalize(
            compilationContext,
            schemaProp.defaultValue,
            getFirstOptionValue(schemaProp),
            (x) => {
              return isSelectValueCorrect(x, schemaProp.params.options)
                ? x
                : undefined;
            }
          )
        : getNormalize(
            compilationContext,
            schemaProp.defaultValue,
            getFirstOptionValue(schemaProp),
            (x) => {
              return isSelectValueCorrect(x, schemaProp.params.options)
                ? x
                : undefined;
            }
          ),
      compile: (x) => x,
      getHash: (value, currentBreakpoint) => {
        if (isTrulyResponsiveValue(value)) {
          const breakpointValue = responsiveValueAt(value, currentBreakpoint);
          return breakpointValue?.toString();
        }

        return value;
      },
    };
  };
}

function isSelectValueCorrect(value: any, options: Array<Option | string>) {
  if (typeof value !== "string") {
    return false;
  }
  return options.map(getSelectValue).indexOf(value) > -1;
}

function getSelectValue(arg: string | Option): string {
  if (typeof arg === "string") {
    return arg;
  }

  return arg.value;
}

function getFirstOptionValue(
  schemaProp: SelectSchemaProp | RadioGroupSchemaProp
) {
  if (schemaProp.params.options.length === 0) {
    throw new Error("Select field can't have 0 options");
  }

  const firstOption: string | Option = schemaProp.params.options[0];
  const firstOptionValue: string =
    typeof firstOption === "object" ? firstOption.value : firstOption;

  return firstOptionValue;
}

function normalizeTokenValue<T>(
  x: any,
  themeValues: { [key: string]: ThemeRefValue<T> },
  defaultValue: { tokenId: string } | { value: any },
  defaultWidgetId: string | undefined,
  scalarValueNormalize: (x: any) => T | undefined = (x) => undefined
): TokenValue<T> | undefined {
  const input = x ?? defaultValue;
  const widgetId = input.widgetId ?? defaultWidgetId;

  // if (typeof input !== "object" && "value" in defaultValue) {
  //   const normalizedVal = scalarValueNormalize(defaultValue.value);

  //   if (normalizedVal !== undefined) {
  //     return {
  //       value: normalizedVal,
  //       widgetId,
  //     };
  //   }

  //   return;
  // }

  const hasTokenId = "tokenId" in input && typeof input.tokenId === "string";

  if (hasTokenId) {
    const val = themeValues[input.tokenId];

    if (val !== undefined) {
      return {
        value: val.value,
        tokenId: input.tokenId,
        widgetId,
      };
    }
  }

  if ("value" in input) {
    const normalizedVal = scalarValueNormalize(input.value);

    if (normalizedVal !== undefined) {
      return {
        tokenId: hasTokenId ? input.tokenId : undefined,
        value: normalizedVal,
        widgetId,
      };
    }
  }

  return;
}

function externalNormalize(
  externalType: string
): (
  x: any,
  compilationContext: CompilationContextType
) => ExternalReference | undefined {
  return (x, compilationContext) => {
    if (typeof x === "object" && x !== null) {
      if ("id" in x && x.id !== null) {
        const normalized: ExternalReferenceNonEmpty = {
          id: x.id,
          widgetId: x.widgetId,
          key: x.key,
        };

        return normalized;
      }

      const normalized: ExternalReferenceEmpty = {
        id: null,
        widgetId:
          typeof x.widgetId === "string"
            ? x.widgetId
            : (
                compilationContext.types[externalType] as
                  | Extract<
                      CompilationContextType["types"][string],
                      { type: "external" }
                    >
                  | undefined
              )?.widgets[0]?.id,
      };

      return normalized;
    }
  };
}

function externalReferenceGetHash(
  value: ResponsiveValue<ExternalReference>,
  breakpointIndex: string
): string | undefined {
  if (isTrulyResponsiveValue(value)) {
    const breakpointValue = responsiveValueAt(value, breakpointIndex);

    if (breakpointValue) {
      return externalReferenceGetHash(breakpointValue, breakpointIndex);
    }

    return;
  }

  if (value.id) {
    return `${value.id}.${value.widgetId}`;
  }
}

export function normalizeComponent(
  configComponent: SetOptional<NoCodeComponentEntry, "_id">,
  compilationContext: CompilationContextType
): NoCodeComponentEntry {
  const ret: NoCodeComponentEntry = {
    _id: configComponent._id ?? uniqueId(),
    _component: configComponent._component,
  };

  // Normalize itemProps (before own props). If component definition is missing, we still normalize item props
  if (configComponent._itemProps) {
    ret._itemProps = {};

    for (const templateId in configComponent._itemProps) {
      ret._itemProps[templateId] = {};

      for (const fieldName in configComponent._itemProps[templateId]) {
        ret._itemProps[templateId][fieldName] = {};

        const values = configComponent._itemProps[templateId][fieldName];

        const ownerDefinition = findComponentDefinitionById(
          templateId,
          compilationContext
        )!;
        const ownerSchemaProp = ownerDefinition.schema.find(
          (x) => x.prop === fieldName
        ) as ComponentCollectionSchemaProp | undefined;

        if (!ownerSchemaProp) {
          continue;
        }

        (ownerSchemaProp.itemFields || []).forEach((itemFieldSchemaProp) => {
          ret._itemProps[templateId][fieldName][itemFieldSchemaProp.prop] =
            getSchemaDefinition(
              itemFieldSchemaProp,
              compilationContext
            ).normalize(values[itemFieldSchemaProp.prop]);
        });
      }
    }
  }

  const componentDefinition = findComponentDefinitionById(
    configComponent._component,
    compilationContext
  );

  if (!componentDefinition) {
    console.warn(
      `[normalize] Unknown _component ${configComponent._component}`
    );
    return ret;
  }

  componentDefinition.schema.forEach((schemaProp) => {
    ret[schemaProp.prop] = getSchemaDefinition(
      schemaProp,
      compilationContext
    ).normalize(configComponent[schemaProp.prop]);
  });

  // RichText is a really specific component. It must have concrete shape to work properly.
  // When using prop of type `component` with `accepts: ["@easyblocks/rich-text"]` it's going to be initialized with empty
  // `elements` property which in result will cause RichText to not work properly. To fix this, we're going
  // to initialize `elements` with default template - the same that's being added when user adds RichText to Stack manually.
  if (ret._component === "@easyblocks/rich-text") {
    if (
      Object.keys(ret.elements).length === 0 ||
      ret.elements[compilationContext.contextParams.locale]?.length === 0
    ) {
      const richTextConfig = buildRichTextNoCodeEntry({
        locale: compilationContext.contextParams.locale,
      });

      ret.elements = richTextConfig.elements;
    }
  }

  return ret;
}

export function getSchemaDefinition<
  T extends SchemaProp | Component$$$SchemaProp
>(
  schemaProp: T,
  compilationContext: CompilationContextType
): ReturnType<SchemaPropDefinitionProvider> {
  const provider =
    compilationContext.types[schemaProp.type] && schemaProp.type !== "text"
      ? schemaPropDefinitions.custom
      : // @ts-expect-error
        schemaPropDefinitions[schemaProp.type];

  return provider(schemaProp as any, compilationContext);
}

export function resolveLocalisedValue<T>(
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
