import {
  AnyTinaField,
  Boolean$SchemaProp,
  BooleanSchemaProp,
  ColorSchemaProp,
  ComponentCollectionLocalisedSchemaProp,
  ComponentCollectionSchemaProp,
  ComponentFixedSchemaProp,
  ComponentSchemaProp,
  ExternalSchemaProp,
  FontSchemaProp,
  IconSchemaProp,
  LocalTextReference,
  NumberSchemaProp,
  PositionSchemaProp,
  RadioGroup$SchemaProp,
  RadioGroupSchemaProp,
  ResponsiveValue,
  SchemaProp,
  Select$SchemaProp,
  SelectSchemaProp,
  SpaceSchemaProp,
  String$SchemaProp,
  StringSchemaProp,
  StringTokenSchemaProp,
  TextSchemaProp,
  ThemeRefValue,
} from "@easyblocks/core";
import { getMappedToken } from "../getMappedToken";
import { responsiveValueGet } from "../responsive";
import { isExternalSchemaProp } from "../schema";
import { EditorContextType } from "../types";
import validateColor from "./validate-color";

function getCommonFieldProps(
  schemaProp: SchemaProp
): Pick<
  AnyTinaField,
  "label" | "name" | "group" | "schemaProp" | "description" | "isLabelHidden"
> {
  const label = schemaProp.label || schemaProp.prop;
  const group = schemaProp.group || "Properties";

  return {
    label,
    name: schemaProp.prop,
    group,
    schemaProp,
    description: schemaProp.description,
    isLabelHidden: schemaProp.isLabelHidden,
  };
}

function buildThemeDefinition<T>(
  themeValues: { [key: string]: ThemeRefValue<ResponsiveValue<T>> },
  schemaProp: SchemaProp & Partial<{ prefix: string }>,
  allowCustom?: boolean,
  normalizeCustomValue: (value: string) => any = (x) => x
) {
  const outputThemeValues = { ...themeValues };
  if (schemaProp.prefix) {
    for (const key in outputThemeValues) {
      if (!key.startsWith((schemaProp as any).prefix + ".")) {
        delete outputThemeValues[key];
      } else {
        outputThemeValues[key] = {
          ...outputThemeValues[key],
          label: key.split(`${schemaProp.prefix}.`)[1],
        };
      }
    }
  }

  for (const key in outputThemeValues) {
    if (getMappedToken(key, themeValues)) {
      delete outputThemeValues[key];
    }
  }

  return {
    ...getCommonFieldProps(schemaProp),
    component: "responsive2",
    subComponent: "token",
    /**
     * For now we force "hasAuto: false", because auto logic is not yet decided.
     * 1. We must decide if we set 100px on desktop and go to mobile if we should show "auto" or "100px". Or "(auto) 100px".
     * 2. To show sth like "(auto) 100px" we must have access to compiled field (right now we have only access to compiled).
     * 3. This causes a bug, that when linearity is on, show value from higher breakpoint which is basically not true (the value is different).
     */
    hasAuto: false,
    tokens: outputThemeValues,
    extraValues: (schemaProp as StringTokenSchemaProp).extraValues, // other fields might ignore it
    normalizeCustomValue,
    allowCustom,
    format: (x: any) => {
      return x;
    },
    parse: (x: any) => {
      return x;
    },
  };
}

type FieldProvider<
  S extends SchemaProp,
  Value = Exclude<S["defaultValue"], undefined>
> = (
  schemaProp: S,
  editorContext: EditorContextType,
  value: Value
) => AnyTinaField;

export type TinaFieldProviders = {
  text: FieldProvider<TextSchemaProp>;
  string: FieldProvider<StringSchemaProp>;
  string$: FieldProvider<String$SchemaProp>;
  number: FieldProvider<NumberSchemaProp>;
  boolean: FieldProvider<BooleanSchemaProp>;
  boolean$: FieldProvider<Boolean$SchemaProp>;
  select: FieldProvider<SelectSchemaProp>;
  select$: FieldProvider<Select$SchemaProp>;
  "radio-group": FieldProvider<RadioGroupSchemaProp>;
  "radio-group$": FieldProvider<RadioGroup$SchemaProp>;
  color: FieldProvider<ColorSchemaProp>;
  stringToken: FieldProvider<StringTokenSchemaProp>;
  space: FieldProvider<SpaceSchemaProp>;
  font: FieldProvider<FontSchemaProp>;
  icon: FieldProvider<IconSchemaProp>;
  component: FieldProvider<ComponentSchemaProp>;
  "component-collection": FieldProvider<ComponentCollectionSchemaProp>;
  "component-collection-localised": FieldProvider<ComponentCollectionLocalisedSchemaProp>;
  "component-fixed": FieldProvider<ComponentFixedSchemaProp>;
  component$$$: FieldProvider<ComponentFixedSchemaProp>;
  external: FieldProvider<ExternalSchemaProp>;
  position: FieldProvider<PositionSchemaProp>;
};

const tinaFieldProviders: TinaFieldProviders = {
  text: (schemaProp, editorContext, value) => {
    if (!isValueLocalTextReference(value) && typeof value !== "string") {
      const resourceDefinition = editorContext.types["text"];

      const fieldWidget = resourceDefinition.widgets.find(
        (w) => w.id === value.widgetId
      );

      if (!fieldWidget) {
        throw new Error(
          `Can't find widget named "${
            value.widgetId ?? resourceDefinition.widgets[0].id
          }"`
        );
      }

      return {
        ...getCommonFieldProps(schemaProp),
        component: "external",
        externalField: fieldWidget.component,
      };
    }

    return {
      ...getCommonFieldProps(schemaProp),
      component: "text",
      name: schemaProp.prop,
      normalize: schemaProp.normalize,
    };
  },
  number: (schemaProp) => {
    return {
      ...getCommonFieldProps(schemaProp),
      component: "number",
      step: 1,
      min: schemaProp.min,
      max: schemaProp.max,
    };
  },
  string: (schemaProp) => {
    return {
      ...getCommonFieldProps(schemaProp),
      component: "text",
      normalize: schemaProp.normalize,
    };
  },
  string$: (schemaProp) => {
    return {
      ...getCommonFieldProps(schemaProp),
      component: "responsive2",
      subComponent: "text",
      normalize: schemaProp.normalize,
    };
  },
  boolean: (schemaProp) => {
    return {
      ...getCommonFieldProps(schemaProp),
      component: "toggle",
    };
  },
  boolean$: (schemaProp) => {
    return {
      ...getCommonFieldProps(schemaProp),
      component: "responsive2",
      subComponent: "toggle",
    };
  },
  select: (schemaProp) => {
    return {
      ...getCommonFieldProps(schemaProp),
      component: "select",
      options: schemaProp.options,
    };
  },
  "radio-group": (schemaProp) => {
    return {
      ...getCommonFieldProps(schemaProp),
      component: "radio-group",
      options: schemaProp.options,
    };
  },
  select$: (schemaProp) => {
    return {
      ...getCommonFieldProps(schemaProp),
      component: "responsive2",
      subComponent: "select",
      options: schemaProp.options,
    };
  },
  "radio-group$": (schemaProp) => {
    return {
      ...getCommonFieldProps(schemaProp),
      component: "responsive2",
      subComponent: "radio-group",
      options: schemaProp.options,
    };
  },

  color: (schemaProp, editorContext) => {
    return buildThemeDefinition(
      editorContext.theme.colors,
      schemaProp,
      true,
      (x: string) => {
        if (validateColor(x)) {
          return x;
        }
        // "fafafa" should be a correct color!
        if (validateColor("#" + x)) {
          return "#" + x;
        }
        return "#999999";
      }
    );
  },
  stringToken: (schemaProp, editorContext) => {
    let allowCustom;
    let normalizeFunction;

    if (schemaProp.tokenId === "aspectRatios") {
      allowCustom = true;
      normalizeFunction = (x: any) => {
        const defaultValue = "3:2";
        if (typeof x !== "string") {
          return defaultValue;
        }

        if (!x.match(/[0-9]+:[0-9]+/)) {
          return defaultValue;
        }
        return x;
      };
    } else if (schemaProp.tokenId === "containerWidths") {
      allowCustom = true;
      normalizeFunction = (x: any) => {
        if (x === "none") {
          return x;
        }

        const defaultValue = "1600";
        if (typeof x !== "string") {
          return defaultValue;
        }

        let parsed = parseInt(x);
        if (isNaN(parsed)) {
          return defaultValue;
        }

        parsed = Math.max(parsed, 500);
        parsed = Math.min(parsed, 3000);

        return parsed.toString();
      };
    }

    return buildThemeDefinition(
      {
        ...editorContext.theme[schemaProp.tokenId]!,
      },
      schemaProp,
      allowCustom,
      normalizeFunction
    );
  },
  font: (schemaProp, editorContext) => {
    return {
      ...buildThemeDefinition(editorContext.theme.fonts, schemaProp),
      subComponent: "fontToken",
    };
  },
  space: (schemaProp, editorContext) => {
    return buildThemeDefinition(
      editorContext.theme.space,
      schemaProp,
      true,
      (x: string) => {
        const int = Math.round(parseInt(x));
        if (isNaN(int) || int < 0) {
          return "0px";
        }
        return `${int}px`;
      }
    );
  },
  icon: (schemaProp, editorContext) => {
    return {
      ...getCommonFieldProps(schemaProp),
      component: "token",
      /**
       * For now we force "hasAuto: false", because auto logic is not yet decided.
       * 1. We must decide if we set 100px on desktop and go to mobile if we should show "auto" or "100px". Or "(auto) 100px".
       * 2. To show sth like "(auto) 100px" we must have access to compiled field (right now we have only access to compiled).
       * 3. This causes a bug, that when linearity is on, show value from higher breakpoint which is basically not true (the value is different).
       */
      hasAuto: false,
      tokens: editorContext.theme.icons,
      normalizeCustomValue: (x: any) => {
        return x;
      },
      allowCustom: true,
    };
  },

  component: (schemaProp) => {
    return {
      ...getCommonFieldProps(schemaProp),
      component: "ss-block",
      schemaProp,
    };
  },
  "component-fixed": (schemaProp) => {
    return {
      ...getCommonFieldProps(schemaProp),
      component: "ss-block",
      schemaProp,
    };
  },
  "component-collection": () => {
    throw new Error("component-collection is not yet supported in sidebar");
  },

  "component-collection-localised": () => {
    throw new Error(
      "component-collection-localised is not yet supported in sidebar"
    );
  },
  component$$$: (schemaProp) => {
    return {
      ...getCommonFieldProps(schemaProp),
      component: "identity",
      schemaProp,
    };
  },
  external: (schemaProp, editorContext, value) => {
    const externalTypeDefinition = editorContext.types[schemaProp.type];

    if (!externalTypeDefinition) {
      throw new Error(`Can't find definition for type "${schemaProp.type}"`);
    }

    // TODO: Right now only image and video can hold responsive external reference
    // After introducing `responsive` property for type definition of external we should look at it
    if (schemaProp.type === "image" || schemaProp.type === "video") {
      const currentDeviceValue =
        responsiveValueGet(value, editorContext.breakpointIndex) ?? value;

      const fieldWidget = externalTypeDefinition.widgets.find(
        (w) => w.id === currentDeviceValue.widgetId
      );

      if (!fieldWidget) {
        throw new Error(`Can't find widget named "${schemaProp.type}"`);
      }

      return {
        ...getCommonFieldProps(schemaProp),
        component: "responsive2",
        subComponent: "external",
        externalField: fieldWidget.component,
      };
    }

    const fieldWidget = externalTypeDefinition.widgets.find(
      (w) => w.id === value.widgetId
    );

    return {
      ...getCommonFieldProps(schemaProp),
      component: "external",
      externalField: fieldWidget?.component,
    };
  },
  position: (schemaProp) => {
    return {
      ...getCommonFieldProps(schemaProp),
      component: "responsive2",
      subComponent: "position",
    };
  },
};

export function getTinaField<T extends SchemaProp>(
  schemaProp: T,
  editorContext: EditorContextType,
  value: any
) {
  if (isExternalSchemaProp(schemaProp)) {
    return tinaFieldProviders.external(schemaProp, editorContext, value);
  }

  const fieldProvider = (tinaFieldProviders as any)[schemaProp.type];

  return fieldProvider(schemaProp, editorContext, value);
}

function isValueLocalTextReference(
  value: unknown
): value is LocalTextReference {
  if (!(typeof value === "object" && value !== null)) {
    return false;
  }

  if (
    !(
      "id" in value &&
      typeof (value as { id: unknown }).id === "string" &&
      (value as { id: string }).id.startsWith("local.")
    )
  ) {
    return false;
  }

  if (!("value" in value)) {
    return false;
  }

  if (
    !(
      "widgetId" in value &&
      typeof (value as { widgetId: unknown }).widgetId === "string" &&
      (value as { widgetId: string }).widgetId === "@easyblocks/local-text"
    )
  ) {
    return false;
  }

  return true;
}
