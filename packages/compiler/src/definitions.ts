import {
  CompilationContextType,
  Component$$$SchemaProp,
  ContextProps,
  EditingInfoComponent,
  EditingInfoComponentCollection,
  findComponentDefinitionById,
  generateDefaultTraceId,
  getDevicesWidths,
  getMappedToken,
  isContextEditorContext,
  isExternalSchemaProp,
  isTrulyResponsiveValue,
  parseSpacing,
  responsiveValueAt,
  responsiveValueFill,
  responsiveValueFlatten,
  responsiveValueMap,
  splitTemplateName,
} from "@easyblocks/app-utils";
import {
  BooleanSchemaProp,
  Color,
  ColorSchemaProp,
  CompiledCustomComponentConfig,
  CompiledLocalTextReference,
  CompiledShopstoryComponentConfig,
  ComponentCollectionLocalisedSchemaProp,
  ComponentCollectionSchemaProp,
  ComponentConfig,
  ComponentSchemaProp,
  ConfigComponent,
  Devices,
  ExternalReference,
  ExternalReferenceEmpty,
  ExternalReferenceNonEmpty,
  ExternalSchemaProp,
  Font,
  FontSchemaProp,
  getFallbackForLocale,
  getFallbackLocaleForLocale,
  IconSchemaProp,
  LocalTextReference,
  NumberSchemaProp,
  Option,
  Position,
  PositionSchemaProp,
  RadioGroupSchemaProp,
  RefMap,
  RefValue,
  ResponsiveValue,
  SchemaProp,
  SelectSchemaProp,
  SerializedComponentDefinitions,
  SpaceSchemaProp,
  Spacing,
  StringSchemaProp,
  StringTokenSchemaProp,
  TextSchemaProp,
  ThemeRefValue,
  TrulyResponsiveValue,
} from "@easyblocks/core";
import { buildRichTextNoCodeEntry } from "@easyblocks/editable-components";
import { uniqueId } from "@easyblocks/utils";
import { CompilationCache } from "./CompilationCache";
import { compileComponent } from "./compileComponent";

export type SchemaPropDefinition<Type, CompiledType> = {
  compile: (
    value: Type,
    contextProps: ContextProps,
    serializedDefinitions: SerializedComponentDefinitions,
    refMap: RefMap,
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

export type TextSchemaPropDefinition = SchemaPropDefinition<
  LocalTextReference | ExternalReference,
  CompiledLocalTextReference | ExternalReference
>;

export type StringSchemaPropDefinition = SchemaPropDefinition<
  ResponsiveValue<string>,
  ResponsiveValue<string>
>;

export type NumberSchemaPropDefinition = SchemaPropDefinition<number, number>;

export type BooleanSchemaPropDefinition = SchemaPropDefinition<
  ResponsiveValue<boolean>,
  ResponsiveValue<boolean>
>;

export type SelectSchemaPropDefinition = SchemaPropDefinition<
  ResponsiveValue<string>,
  ResponsiveValue<string>
>;

export type RadioGroupSchemaPropDefinition = SchemaPropDefinition<
  ResponsiveValue<string>,
  ResponsiveValue<string>
>;

export type ColorSchemaPropDefinition = SchemaPropDefinition<
  /*explained above*/ ResponsiveValue<RefValue<ResponsiveValue<Color>>>,
  ResponsiveValue<Color>
>;

export type StringTokenSchemaPropDefinition = SchemaPropDefinition<
  /*explained above*/ ResponsiveValue<RefValue<ResponsiveValue<string>>>,
  ResponsiveValue<string>
>;

export type SpaceSchemaPropDefinition = SchemaPropDefinition<
  /*explained above*/ ResponsiveValue<RefValue<ResponsiveValue<Spacing>>>,
  ResponsiveValue<Spacing>
>;

export type FontSchemaPropDefinition = SchemaPropDefinition<
  /*explained above*/ ResponsiveValue<RefValue<ResponsiveValue<Font>>>,
  ResponsiveValue<Font>
>;

export type IconSchemaPropDefinition = SchemaPropDefinition<
  RefValue<string>,
  string
>;

export type ConfigComponentCompilationOutput = {
  compiledComponentConfig:
    | CompiledShopstoryComponentConfig
    | CompiledCustomComponentConfig;
  configAfterAuto: ConfigComponent;
};

export type ComponentSchemaPropDefinition = SchemaPropDefinition<
  Array<ConfigComponent>,
  Array<ConfigComponentCompilationOutput>
>;

export type ComponentCollectionSchemaPropDefinition = SchemaPropDefinition<
  Array<ConfigComponent>,
  Array<ConfigComponentCompilationOutput>
>;

export type ComponentCollectionLocalisedSchemaPropDefinition =
  SchemaPropDefinition<
    { [locale: string]: ConfigComponent[] },
    Array<ConfigComponentCompilationOutput>
  >;

export type ComponentFixedSchemaPropDefinition = SchemaPropDefinition<
  Array<ConfigComponent>,
  Array<ConfigComponentCompilationOutput>
>;

type ExternalSchemaPropDefinition = SchemaPropDefinition<
  ResponsiveValue<ExternalReference>,
  ResponsiveValue<ExternalReference>
>;

export type Component$$$SchemaPropDefinition = SchemaPropDefinition<
  ComponentConfig,
  ComponentConfig
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
  color: (
    schemaProp: ColorSchemaProp,
    compilationContext: CompilationContextType
  ) => ColorSchemaPropDefinition;
  stringToken: (
    schemaProp: StringTokenSchemaProp,
    compilationContext: CompilationContextType
  ) => StringTokenSchemaPropDefinition;
  space: (
    schemaProp: SpaceSchemaProp,
    compilationContext: CompilationContextType
  ) => SpaceSchemaPropDefinition;
  font: (
    schemaProp: FontSchemaProp,
    compilationContext: CompilationContextType
  ) => FontSchemaPropDefinition;
  icon: (
    schemaProp: IconSchemaProp,
    compilationContext: CompilationContextType
  ) => IconSchemaPropDefinition;
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
  external: (
    schemaProp: ExternalSchemaProp,
    compilationContext: CompilationContextType
  ) => ExternalSchemaPropDefinition;
  position: (
    schemaProp: PositionSchemaProp,
    compilationContext: CompilationContextType
  ) => SchemaPropDefinition<
    ResponsiveValue<Position>,
    ResponsiveValue<Position>
  >;
};

export type SchemaPropDefinitionProvider =
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

  color: (schemaProp, compilationContext): ColorSchemaPropDefinition => {
    // @ts-ignore
    return {
      ...buildThemeDefinition(
        compilationContext.theme.colors,
        { value: "#000000" },
        schemaProp,
        compilationContext,
        (x: any) => {
          if (typeof x !== "string") {
            return;
          }

          // right now we assume that user gives correct CSS color!
          return x;
        }
      ),
      getHash: (value, breakpointIndex) => {
        if (isTrulyResponsiveValue(value)) {
          const breakpointValue = responsiveValueAt(value, breakpointIndex);
          return breakpointValue ? getRef(breakpointValue) : undefined;
        }

        return getRef(value);
      },
    };
  },

  stringToken: (
    schemaProp,
    compilationContext
  ): StringTokenSchemaPropDefinition => {
    const { tokenId } = schemaProp.params;
    const themeValues = compilationContext.theme[tokenId];
    if (!themeValues) {
      throw new Error(
        `string token with ID "${tokenId}" doesn't have any values.`
      );
    }

    let defaultKey: string | RefValue<string>;

    if (tokenId === "numberOfItemsInRow") {
      defaultKey = "4";
    } else if (tokenId === "aspectRatios") {
      defaultKey = { value: "1:1" }; //$landscape";
    } else if (tokenId === "containerWidths") {
      defaultKey = "none";
    } else if (tokenId === "boxShadows") {
      defaultKey = "none";
    } else {
      throw new Error("unknown token Id: " + tokenId);
    }

    // @ts-ignore
    return {
      ...buildThemeDefinition(
        themeValues,
        defaultKey,
        schemaProp,
        compilationContext,
        (x: any) => {
          if (typeof x !== "string") {
            return;
          }

          // right now we assume that user gives correct CSS color!
          return x;
        }
      ),
      getHash: (value, breakpointIndex) => {
        if (isTrulyResponsiveValue(value)) {
          const breakpointValue = responsiveValueAt(value, breakpointIndex);

          if (!breakpointValue) {
            return breakpointValue;
          }

          if (breakpointValue.ref) {
            return breakpointValue.ref;
          }

          if (isTrulyResponsiveValue(breakpointValue.value)) {
            const nestedBreakpointValue = responsiveValueAt(
              breakpointValue.value,
              breakpointIndex
            );
            return nestedBreakpointValue;
          }

          return breakpointValue.value;
        }

        if (value.ref) {
          return value.ref;
        }

        if (isTrulyResponsiveValue(value.value)) {
          const breakpointValue = responsiveValueAt(
            value.value,
            breakpointIndex
          );

          return breakpointValue;
        }

        return value.value;
      },
    };
  },

  // @ts-ignore TODO: temporary, we need to fix those types
  font: (schemaProp, compilationContext): FontSchemaPropDefinition => {
    // @ts-ignore
    return {
      ...buildThemeDefinition(
        compilationContext.theme.fonts,
        { value: { fontFamily: "sans-serif", fontSize: "16px" } },
        schemaProp,
        compilationContext,
        (x: any) => {
          if (typeof x !== "object" || x === null) {
            return;
          }

          return x;
        }
      ),
      getHash: (value, breakpointIndex) => {
        if (isTrulyResponsiveValue(value)) {
          const breakpointValue = responsiveValueAt(value, breakpointIndex);
          return breakpointValue ? getRef(breakpointValue) : undefined;
        }

        return getRef(value);
      },
    };
  },

  // @ts-ignore TODO: temporary, we need to fix those types
  space: (schemaProp, compilationContext): SpaceSchemaPropDefinition => {
    // @ts-ignore
    return {
      ...buildThemeDefinition(
        compilationContext.theme.space,
        {
          value: "10vw",
        },
        schemaProp,
        compilationContext,
        (x: any) => {
          if (typeof x === "number") {
            return `${x}px`;
          }

          if (typeof x !== "string") {
            return;
          }

          try {
            parseSpacing(x);
            return x;
          } catch (error) {
            return;
          }
        }
      ),
      getHash: (value, breakpointIndex) => {
        if (isTrulyResponsiveValue(value)) {
          const breakpointValue = responsiveValueAt(value, breakpointIndex);
          return breakpointValue ? getRef(breakpointValue) : undefined;
        }

        return getRef(value);
      },
    };
  },

  icon: (schemaProp, compilationContext): IconSchemaPropDefinition => {
    const ultimateDefaultValue = {
      value: `<svg viewBox="0 -960 960 960"><path fill="currentColor" d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z"/></svg>`,
    };

    const scalarValueNormalize = (x: any) => {
      if (typeof x === "string" && x.trim().startsWith("<svg")) {
        return x;
      }
      return;
    };

    const defaultValue =
      normalizeTokenValue<string>(
        schemaProp.defaultValue,
        compilationContext.theme.icons,
        ultimateDefaultValue,
        scalarValueNormalize
      ) || ultimateDefaultValue;

    return {
      normalize: (x: any) => {
        const normalized = normalizeTokenValue<string>(
          x,
          compilationContext.theme.icons,
          defaultValue,
          scalarValueNormalize
        );

        if (!normalized) {
          return defaultValue;
        }

        return normalized;
      },
      compile: (x) => {
        return x.value;
      },
      getHash: (x) => {
        return getRef(x);
      },
    };
  },

  component: (
    _,
    compilationContext: CompilationContextType
  ): ComponentSchemaPropDefinition => {
    // Here:
    // 1. if non-fixed => ss-block field.
    // 2. if fixed => ss-block field with "fixed" flag (no component picker).
    const normalize = (x: any) => {
      if (!Array.isArray(x) || x.length === 0) {
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
        refMap,
        editingInfoComponent,
        configPrefix,
        cache
      ) => {
        if (arg.length === 0) {
          return [];
        }

        // FIXME: ?????
        const { configAfterAuto, compiledComponentConfig } = compileComponent(
          arg[0] as ConfigComponent,
          compilationContext,
          contextProps,
          serializedDefinitions || {
            actions: [],
            components: [],
            links: [],
            textModifiers: [],
          },
          refMap,
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

          return value[0]._template;
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
      const ret = (x || []).map((item: ConfigComponent) =>
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
        refMap,
        editingInfoComponents,
        configPrefix,
        cache
      ) => {
        // pass index here!!!
        return arr.map((componentConfig, index) =>
          compileComponent(
            componentConfig as ConfigComponent,
            compilationContext,
            {
              ...((contextProps.itemProps || [])[index] || {}),
              index,
              length: arr.length,
            },
            serializedDefinitions,
            refMap,
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
        return value.map((v) => v._template).join(";");
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
        const normalized: { [locale: string]: ConfigComponent[] } = {};
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
        refMap,
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
          refMap,
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
      getHash: (x) => x._template,
    };
  },

  external: (schemaProp, compilationContext) => {
    if (schemaProp.responsive) {
      const normalize = getResponsiveNormalize<ExternalReference>(
        compilationContext,
        {},
        {
          id: null,
          widgetId: compilationContext.isEditing
            ? compilationContext.types[schemaProp.type]?.widgets[0]?.id
            : "",
        },
        externalNormalize(schemaProp.type)
      );

      return {
        normalize,
        compile: (x) => x,
        getHash: externalReferenceGetHash,
      };
    }

    return {
      normalize: (value) => {
        const normalized = externalNormalize(schemaProp.type)(
          value,
          compilationContext
        );

        if (!normalized) {
          return {
            id: null,
            widgetId: compilationContext.types[schemaProp.type]?.widgets[0]?.id,
          };
        }

        return normalized;
      },
      compile: (value) => {
        return value;
      },
      getHash: (value) => {
        if (value.id === null) {
          return `${schemaProp.type}.${schemaProp.type}`;
        }

        return `${schemaProp.type}.${schemaProp.type}.${value.id}`;
      },
    };
  },
  position: function (schemaProp, compilationContext) {
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

function buildThemeDefinition<T>(
  themeValues: { [key: string]: ThemeRefValue<ResponsiveValue<T>> },
  defaultValue: any, // we must make sure that defaultKey is always correct
  schemaProp:
    | ColorSchemaProp
    | SpaceSchemaProp
    | FontSchemaProp
    | StringTokenSchemaProp,
  compilationContext: CompilationContextType,
  scalarValueNormalize: (x: any) => T | undefined = (x) => undefined // normalizes scalar value
  // shouldLinearize?: boolean
) {
  // Create default value
  // const defaultValue = Object.values(themeValues)[0];

  /**
   * TODO:
   * - getResponsiveNormalize and helpers take into account recursion now!
   * - only thing we need to do is to write compile properly
   */

  const normalize = getResponsiveNormalize(
    compilationContext,
    schemaProp.defaultValue,
    defaultValue,
    (x: any) => {
      return normalizeTokenValue(
        x,
        themeValues,
        defaultValue,
        scalarValueNormalize
      );
    }
  );

  return {
    normalize,

    // FIXME: input of compile should be output of normalize.
    compile: (x: ReturnType<typeof normalize>) => {
      // /**
      //  * We need to run this normalization here. Why?
      //  *
      //  * Although compiled config is promised to be normalized, but in case of theme can change under the hood.
      //  * And this will cause Tina state to be invalid (ref not conformant with value). That's why we normalize here.
      //  *
      //  * That could probably go from here.
      //  */
      //
      // // x = normalize(x);

      const val = responsiveValueMap(x, (y) => {
        return y?.value;
      });

      const flattened = responsiveValueFlatten(val, compilationContext.devices);
      return responsiveValueFill(
        flattened,
        compilationContext.devices,
        getDevicesWidths(compilationContext.devices)
      );
    },
  };
}

function normalizeTokenValue<T>(
  x: any,
  themeValues: { [key: string]: ThemeRefValue<T> },
  defaultValue: RefValue<T>,
  scalarValueNormalize: (x: any) => T | undefined = (x) => undefined
) {
  // Mapping of legacy value of string (now not possible)
  if (typeof x === "string" && themeValues[x]) {
    // If string value exist as a theme key
    x = {
      value: themeValues[x].value,
      ref: x,
    };
  }

  // Mapping of legacy value of type object which could be a font (now not possible)
  // The test below is shitty but this code should stay.
  if (
    !(
      (
        typeof x === "object" &&
        x !== null &&
        (x.value !== undefined || typeof x.ref === "string")
      ) /* this is primitive test if this is ThemeRef value (either ref or value defined). It can also be object for Font! */
    )
  ) {
    x = {
      value: x,
    };
  }

  if (typeof x.ref === "string") {
    // Mapping
    x = getMappedToken(x.ref, themeValues) ?? x;

    // If ref is defined
    const val = themeValues[x.ref];

    // If ref exists in a theme we just take ref value
    if (val) {
      return {
        value: val.value,
        ref: x.ref,
      };
    }

    // If ref is defined but doesn't exist in a theme it means that it was probably removed
    // In that case we simply pass the non-existent ref name (it can be later brought back).
    // The value is scalar-normalized! We'll never get incorrect value after normalization.

    const normalizedVal = scalarValueNormalize(x.value);

    if (normalizedVal === undefined) {
      return {
        value: defaultValue.value, // if value was incorrect, we apply default value
        ref: x.ref,
      };
    } else {
      return {
        value: normalizedVal, // if value was correct, it stays
        ref: x.ref,
      };
    }
  }
  // If ref is not defined
  else {
    const normalizedVal = scalarValueNormalize(x.value);
    if (normalizedVal === undefined) {
      return;
    } else {
      return {
        value: normalizedVal,
      };
    }
  }
}

function getRef<T>(value: RefValue<T>): string {
  if (value.ref) {
    return value.ref;
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

function externalNormalize(
  externalType: string
): (
  x: any,
  compilationContext: CompilationContextType
) => ExternalReference | undefined {
  return (x, compilationContext) => {
    if (typeof x === "object" && x !== null) {
      if (typeof x.id === "string") {
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
            : compilationContext.types[externalType]?.widgets[0]?.id,
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
  configComponent: Omit<ConfigComponent, "_id"> & { _id?: string },
  compilationContext: CompilationContextType,
  isRef?: boolean
): ConfigComponent {
  const ret: ConfigComponent = {
    _id: configComponent._id ?? uniqueId(),
    _template: configComponent._template,
    _master: configComponent._master,
    $$$refs: configComponent.$$$refs,
    traceId: configComponent.traceId,
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
    splitTemplateName(configComponent._template).name,
    compilationContext
  );

  if (!componentDefinition) {
    console.warn(`[normalize] Unknown _template ${configComponent._template}`);
    return ret;
  }

  componentDefinition.schema.forEach((schemaProp) => {
    if (!isRef) {
      const { ref } = splitTemplateName(configComponent._template);
      if (ref) {
        if (!isExternalSchemaProp(schemaProp)) {
          return;
        }
      }
    } else {
      if (isExternalSchemaProp(schemaProp)) {
        return;
      }
    }

    ret[schemaProp.prop] = getSchemaDefinition(
      schemaProp,
      compilationContext
    ).normalize(configComponent[schemaProp.prop]);
  });

  // Normalize refs
  if (configComponent.$$$refs) {
    ret.$$$refs = {};
    for (const refName in configComponent.$$$refs) {
      ret.$$$refs[refName] = normalizeComponent(
        configComponent.$$$refs![refName],
        compilationContext,
        true
      );
    }
  }

  if (!ret.traceId) {
    ret.traceId = generateDefaultTraceId(ret);
  }

  // RichText is a really specific component. It must have concrete shape to work properly.
  // When using prop of type `component` with `componentTypes: ["$richText"]` it's going to be initialized with empty
  // `elements` property which in result will cause RichText to not work properly. To fix this, we're going
  // to initialize `elements` with default template - the same that's being added when user adds RichText to Stack manually.
  if (ret._template === "$richText") {
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
  const provider = isExternalSchemaProp(schemaProp)
    ? schemaPropDefinitions.external
    : schemaPropDefinitions[schemaProp.type];

  return provider(schemaProp as any, compilationContext);
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

  if (isContextEditorContext(compilationContext)) {
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
  } else {
    return;
  }
}
