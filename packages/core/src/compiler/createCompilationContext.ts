import { responsiveValueMap } from "../responsiveness";
import { parseSpacing } from "../spacingToPx";
import {
  Config,
  ConfigDeviceRange,
  ContextParams,
  CustomTypeDefinition,
  Devices,
  NoCodeComponentDefinition,
  ResponsiveValue,
  Spacing,
  SchemaProp,
  TokenTypeDefinition,
  ExternalTypeDefinition,
} from "../types";
import { richTextEditableComponent } from "./builtins/$richText/$richText";
import { richTextBlockElementEditableComponent } from "./builtins/$richText/$richTextBlockElement/$richTextBlockElement";
import { richTextLineElementEditableComponent } from "./builtins/$richText/$richTextLineElement/$richTextLineElement";
import { richTextPartEditableComponent } from "./builtins/$richText/$richTextPart/$richTextPart";
import { textEditableComponent } from "./builtins/$text/$text";
import { actionTextModifier } from "./builtins/actionTextModifier";
import { DEFAULT_DEVICES } from "./devices";
import { themeScalarValueToResponsiveValue } from "./themeValueToResponsiveValue";
import { CompilationContextType, Theme } from "./types";
import { validateColor } from "./validate-color";

function normalizeSpace(
  space: ResponsiveValue<number | string>
): ResponsiveValue<Spacing> {
  return responsiveValueMap(space, (val) => {
    if (typeof val === "number") {
      return `${val}px`;
    }

    return val;
  });
}

function prepareDevices(configDevices: Config["devices"]): Devices {
  const devices: Devices = []; // let's make devices copy
  DEFAULT_DEVICES.forEach((defaultDevice) => {
    devices.push({
      ...defaultDevice,
    });
  });

  if (configDevices) {
    devices.forEach((device, index) => {
      const configDevice: ConfigDeviceRange | undefined = (
        configDevices as any
      )[device.id];
      if (configDevice) {
        device.w = configDevice.w ?? device.w;
        device.h = configDevice.h ?? device.h;
        device.hidden = configDevice.hidden ?? device.hidden;

        if (configDevice.startsFrom && index > 0) {
          const previousDevice = devices[index - 1];
          previousDevice.breakpoint = configDevice.startsFrom;
        }
      }
    });
  }

  return devices;
}

export function createCompilationContext(
  config: Config,
  contextParams: ContextParams,
  rootComponentId: string
): CompilationContextType {
  const devices = prepareDevices(config.devices);
  const mainDevice = devices.find((x) => x.isMain);

  if (!mainDevice) {
    throw new Error(`Missing main device in devices config.`);
  }

  const { space, ...customTokens } = config.tokens ?? {};

  const theme: Theme = {
    space: {},
  };

  // TODO: allow for custom breakpoints!!! What happens with old ones when the new ones show up?

  if (space) {
    space.forEach((space) => {
      let val = space.value;

      // If value is "vw" and is not responsive then we should responsify it.
      // Why? Because responsive token behaves differently from non-responsive in terms of auto.
      // Responsive token automatically "fills" all the breakpoints.
      // If someone does 10vw it is responsive in nature, it's NEVER a scalar.
      if (typeof val === "string" && parseSpacing(val).unit === "vw") {
        val = { $res: true, [mainDevice.id]: val };
      }

      const { id, ...rest } = space;

      theme.space[id] = {
        ...rest,
        type: "dev",
        value: normalizeSpace(themeScalarValueToResponsiveValue(val, devices)),
      };
    });
  }

  const types = {
    ...createCustomTypes(config.types),
    ...createBuiltinTypes(),
  };

  const allTypeIds = Object.keys(types);

  Object.entries(customTokens).forEach(([id, tokens]) => {
    const type = Object.values(types).find(
      (type) => type.type === "token" && type.token === id
    ) as TokenTypeDefinition;

    if (!type) {
      throw new Error(
        `Can't find a matching type for a token "${id}" (found in Config.tokens)`
      );
    }

    theme[id] = Object.fromEntries(
      tokens.map((token) => {
        if (type.validate) {
          if (type.validate(token.value) !== true) {
            throw new Error(
              `The value for token "${id}.${token.id}" (${token.value}) is incorrect. The validation function for its corresponding type must return 'true'. `
            );
          }
        }

        return [
          token.id,
          {
            type: "dev",
            label: token.label,
            value: token.value,
          },
        ];
      })
    );
  });

  const components: Array<NoCodeComponentDefinition<any, any>> = [
    textEditableComponent,
    richTextEditableComponent,
    richTextBlockElementEditableComponent,
    richTextLineElementEditableComponent,
    richTextPartEditableComponent,
    {
      id: "@easyblocks/missing-component",
      label: "Missing component",
      schema: [
        {
          prop: "error",
          type: "string",
          visible: false,
        },
      ],
    },
  ];

  const rootComponent = (config.components ?? []).find(
    (component) => component.id === rootComponentId
  );

  if (!rootComponent) {
    throw new Error(
      `createCompilationContext: rootComponentId "${rootComponentId}" doesn't exist in config.components`
    );
  }

  if (rootComponent.rootParams && rootComponent.rootParams.length > 0) {
    ensureDocumentDataWidgetForExternalTypes(types);
  }

  const builtinTypes = [
    "string",
    "number",
    "boolean",
    "select",
    "radio-group",
    "text",
    "component",
    "component-collection",
    "component-collection-localised",
    "position",
  ];

  // Validate if components have correct types
  if (config.components) {
    config.components.forEach((component) => {
      if (component.schema) {
        component.schema.forEach((prop) => {
          if (builtinTypes.includes(prop.type)) {
            return;
          }

          if (!allTypeIds.includes(prop.type)) {
            throw new Error(
              `The field "${component.id}.${prop.prop}" has an unrecognized type: "${prop.type}". Custom types can be added in Config.types object`
            );
          }
        });
      }
    });
  }

  if (config.components) {
    components.push(
      ...(config.components ?? []).map((component) => {
        // For root component with rootParams we should create special param types and move params to schema props
        if (component.id === rootComponent.id && rootComponent.rootParams) {
          const paramSchemaProps: SchemaProp[] = [];

          rootComponent.rootParams.forEach((param) => {
            const typeName = "param__" + param.prop;

            types[typeName] = {
              type: "external",
              widgets: param.widgets,
            };

            paramSchemaProps.push({
              prop: param.prop,
              label: param.label,
              type: typeName,
              group: "Parameters",
              optional: true,
            });
          });

          return {
            ...component,
            schema: [...paramSchemaProps, ...component.schema],
          };
        }

        return component;
      })
    );
  }

  if (!config.locales) {
    throw new Error(
      `Required property config.locales doesn't exist in your config.`
    );
  }

  if (
    config.locales.find((l) => l.code === contextParams.locale) === undefined
  ) {
    throw new Error(
      `You passed locale "${contextParams.locale}" which doesn't exist in your config.locales`
    );
  }

  // FIXME
  const textModifiers: Array<any> = [
    actionTextModifier,
    // {
    //   id: "$MissingTextModifier",
    //   type: "actionTextModifier",
    //   schema: [],
    //   apply: () => {
    //     return {};
    //   },
    // },
    // ...(config.textModifiers ?? []).map((modifier) => {
    //   return {
    //     ...modifier,
    //     type:
    //       modifier.type === "text"
    //         ? "textModifier"
    //         : `${modifier.type}TextModifier`,
    //   };
    // }),
  ];

  const compilationContext: CompilationContextType = {
    devices,
    theme,
    definitions: {
      components,
      textModifiers,
    },
    types,
    mainBreakpointIndex: mainDevice.id,
    contextParams,
    locales: config.locales,
    rootComponent,
  };

  return compilationContext;
}

function createCustomTypes(
  types: Record<string, CustomTypeDefinition> | undefined
): Record<string, CustomTypeDefinition> {
  if (!types) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(types).map(([id, definition]) => {
      return [
        id,
        {
          ...definition,
          responsiveness: definition.responsiveness ?? "never",
        },
      ];
    })
  );
}
function createBuiltinTypes(): Record<string, CustomTypeDefinition> {
  return {
    space: {
      type: "token",
      responsiveness: "always",
      token: "space",
      defaultValue: { value: "0px" },
      widget: { id: "@easyblocks/space", label: "Space" },
      allowCustom: true,
      validate(value) {
        return typeof value === "string" && !!parseSpacing(value);
      },
    },
    color: {
      type: "token",
      responsiveness: "always",
      token: "colors",
      defaultValue: { value: "#000000" },
      widget: { id: "@easyblocks/color", label: "Color" },
      allowCustom: true,
      validate(value) {
        return typeof value === "string" && validateColor(value);
      },
    },
    font: {
      type: "token",
      token: "fonts",
      responsiveness: "always",
      defaultValue: { value: { fontFamily: "sans-serif", fontSize: "16px" } },
    },
    aspectRatio: {
      type: "token",
      token: "aspectRatios",
      responsiveness: "always",
      widget: { id: "@easyblocks/aspectRatio", label: "Aspect ratio" },
      defaultValue: { value: "1:1" },
      allowCustom: true,
      validate(value) {
        return (
          typeof value === "string" &&
          (!!value.match(/[0-9]+:[0-9]+/) || value === "natural")
        );
      },
    },
    boxShadow: {
      type: "token",
      token: "boxShadows",
      responsiveness: "always",
      defaultValue: {
        value:
          "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
      },
    },
    icon: {
      type: "token",
      responsiveness: "never",
      token: "icons",
      defaultValue: {
        value: `<svg viewBox="0 -960 960 960"><path fill="currentColor" d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z"/></svg>`,
      },
      widget: { id: "@easyblocks/icon", label: "Icon" },
      allowCustom: true,
      validate(value) {
        return typeof value === "string" && value.trim().startsWith("<svg");
      },
    },
    text: {
      type: "external",
      widgets: [],
    },
  };
}

function ensureDocumentDataWidgetForExternalTypes(
  types: CompilationContextType["types"]
) {
  const externalTypesNames = new Set([
    ...Object.keys(types).filter((t) => types[t].type === "external"),
  ]);

  externalTypesNames.forEach((externalTypeName) => {
    const externalTypeDefinition = types[
      externalTypeName
    ] as ExternalTypeDefinition;

    const hasDocumentDataWidget = externalTypeDefinition.widgets.some(
      (w) => w.id === "@easyblocks/document-data"
    );

    if (!hasDocumentDataWidget) {
      externalTypeDefinition.widgets.push({
        id: "@easyblocks/document-data",
        label: "Document data",
      });
    }
  });
}
