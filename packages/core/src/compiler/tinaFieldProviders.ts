import { assertDefined } from "@easyblocks/utils";
import { responsiveValueGet } from "../responsiveness";
import {
  AnyTinaField,
  BooleanSchemaProp,
  ComponentCollectionLocalisedSchemaProp,
  ComponentCollectionSchemaProp,
  ComponentConfig,
  ComponentSchemaProp,
  ExternalSchemaProp,
  ExternalTypeDefinition,
  LocalSchemaProp,
  LocalTextReference,
  NumberSchemaProp,
  PositionSchemaProp,
  RadioGroupSchemaProp,
  SchemaProp,
  SelectSchemaProp,
  StringSchemaProp,
  TextSchemaProp,
  TokenSchemaProp,
} from "../types";
import { EditorContextType } from "./types";

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

type FieldProvider<
  S extends Exclude<
    SchemaProp,
    | ComponentSchemaProp
    | ComponentCollectionSchemaProp
    | ComponentCollectionLocalisedSchemaProp
  >,
  Value = Exclude<S["defaultValue"], undefined>
> = (
  schemaProp: S,
  editorContext: EditorContextType,
  value: Value
) => AnyTinaField;

export type TinaFieldProviders = {
  text: FieldProvider<TextSchemaProp>;
  string: FieldProvider<StringSchemaProp>;
  number: FieldProvider<NumberSchemaProp>;
  boolean: FieldProvider<BooleanSchemaProp>;
  select: FieldProvider<SelectSchemaProp>;
  "radio-group": FieldProvider<RadioGroupSchemaProp>;
  component: FieldProvider<ComponentSchemaProp, [] | [ComponentConfig]>;
  "component-collection": FieldProvider<
    ComponentCollectionSchemaProp,
    Array<ComponentConfig>
  >;
  "component-collection-localised": FieldProvider<ComponentCollectionLocalisedSchemaProp>;
  component$$$: FieldProvider<ComponentSchemaProp>;
  external: FieldProvider<ExternalSchemaProp>;
  custom: FieldProvider<ExternalSchemaProp | LocalSchemaProp | TokenSchemaProp>;
  position: FieldProvider<PositionSchemaProp>;
};

const tinaFieldProviders: TinaFieldProviders = {
  text: (schemaProp, editorContext, value) => {
    if (!isValueLocalTextReference(value) && typeof value !== "string") {
      const resourceDefinition = editorContext.types[
        "text"
      ] as ExternalTypeDefinition;

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
        // @ts-expect-error
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
      min: schemaProp.params?.min,
      max: schemaProp.params?.max,
    };
  },
  string: (schemaProp) => {
    if (schemaProp.responsive) {
      return {
        ...getCommonFieldProps(schemaProp),
        component: "responsive2",
        subComponent: "text",
        normalize: schemaProp.params?.normalize,
      };
    }

    return {
      ...getCommonFieldProps(schemaProp),
      component: "text",
      normalize: schemaProp.params?.normalize,
    };
  },
  boolean: (schemaProp) => {
    if (schemaProp.responsive) {
      return {
        ...getCommonFieldProps(schemaProp),
        component: "responsive2",
        subComponent: "toggle",
      };
    }

    return {
      ...getCommonFieldProps(schemaProp),
      component: "toggle",
    };
  },
  select: (schemaProp) => {
    if (schemaProp.responsive) {
      return {
        ...getCommonFieldProps(schemaProp),
        component: "responsive2",
        subComponent: "select",
        options: schemaProp.params.options,
      };
    }

    return {
      ...getCommonFieldProps(schemaProp),
      component: "select",
      options: schemaProp.params.options,
    };
  },
  "radio-group": (schemaProp) => {
    if (schemaProp.responsive) {
      return {
        ...getCommonFieldProps(schemaProp),
        component: "responsive2",
        subComponent: "radio-group",
        options: schemaProp.params.options,
      };
    }

    return {
      ...getCommonFieldProps(schemaProp),
      component: "radio-group",
      options: schemaProp.params.options,
    };
  },
  component: (schemaProp) => {
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
    const externalTypeDefinition = editorContext.types[schemaProp.type] as
      | ExternalTypeDefinition
      | undefined;

    if (!externalTypeDefinition) {
      throw new Error(`Can't find definition for type "${schemaProp.type}"`);
    }

    if (schemaProp.responsive) {
      const currentDeviceValue =
        responsiveValueGet(value, editorContext.breakpointIndex) ?? value;

      const fieldWidget = externalTypeDefinition.widgets.find(
        (w) => w.id === currentDeviceValue.widgetId
      );

      return {
        ...getCommonFieldProps(schemaProp),
        component: "responsive2",
        subComponent: "external",
        // @ts-expect-error
        externalField: fieldWidget?.component,
      };
    }

    const fieldWidget = externalTypeDefinition.widgets.find(
      (w) => w.id === value.widgetId
    );

    return {
      ...getCommonFieldProps(schemaProp),
      component: "external",
      // @ts-expect-error
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
  custom: (schemaProp, editorContext, value) => {
    const customTypeDefinition = editorContext.types[schemaProp.type];

    if (!customTypeDefinition) {
      throw new Error(`Can't find definition for type "${schemaProp.type}"`);
    }

    if (customTypeDefinition.type === "external") {
      return tinaFieldProviders.external(schemaProp, editorContext, value);
    }

    if (customTypeDefinition.type === "token") {
      let tokens = assertDefined(
        editorContext.theme[customTypeDefinition.token],
        `Missing token values within the Easyblocks config for "${customTypeDefinition.token}"`
      );

      if (
        "params" in schemaProp &&
        schemaProp.params &&
        "prefix" in schemaProp.params &&
        typeof schemaProp.params.prefix === "string"
      ) {
        // Copy tokens to prevent mutating original tokens
        tokens = { ...tokens };

        for (const key in tokens) {
          if (!key.startsWith(schemaProp.params.prefix + ".")) {
            delete tokens[key];
          } else {
            tokens[key] = {
              ...tokens[key],
              label: key.split(`${schemaProp.params.prefix}.`)[1],
            };
          }
        }
      }

      const commonTokenFieldProps = {
        tokens,
        allowCustom: !!customTypeDefinition.allowCustom,
        extraValues:
          "params" in schemaProp &&
          schemaProp.params &&
          "extraValues" in schemaProp.params
            ? schemaProp.params.extraValues
            : undefined,
      };

      if (customTypeDefinition.responsiveness === "never") {
        return {
          ...getCommonFieldProps(schemaProp),
          component: "token",
          ...commonTokenFieldProps,
        };
      }

      return {
        ...getCommonFieldProps(schemaProp),
        // Token fields are always responsive
        component: "responsive2",
        subComponent: "token",
        ...commonTokenFieldProps,
      };
    }

    return {
      ...getCommonFieldProps(schemaProp),
      ...(customTypeDefinition.responsiveness === "always" ||
      (customTypeDefinition.responsiveness === "optional" &&
        schemaProp.responsive)
        ? {
            component: "responsive2",
            subComponent: "local",
          }
        : {
            component: "local",
          }),
    };
  },
};

export function getTinaField<T extends SchemaProp>(
  schemaProp: T,
  editorContext: EditorContextType,
  value: any
) {
  const fieldProvider =
    editorContext.types[schemaProp.type] && schemaProp.type !== "text"
      ? tinaFieldProviders.custom
      : (tinaFieldProviders as any)[schemaProp.type];

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
