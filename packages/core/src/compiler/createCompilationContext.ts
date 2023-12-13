import { createFetchingContext } from "../createFetchingContext";
import { responsiveValueMap } from "../responsiveness";
import { parseSpacing } from "../spacingToPx";
import {
  Config,
  ConfigDeviceRange,
  ContextParams,
  Devices,
  EditorLauncherProps,
  ExternalSchemaProp,
  NoCodeComponentDefinition,
  ResponsiveValue,
  DocumentType,
  Spacing,
} from "../types";
import { buildFullTheme } from "./buildFullTheme";
import { richTextEditableComponent } from "./builtins/$richText/$richText";
import { richTextBlockElementEditableComponent } from "./builtins/$richText/$richTextBlockElement/$richTextBlockElement";
import { richTextInlineWrapperElementEditableComponent } from "./builtins/$richText/$richTextInlineWrapperElement/$richTextInlineWrapperElement";
import { richTextLineElementEditableComponent } from "./builtins/$richText/$richTextLineElement/$richTextLineElement";
import { richTextPartEditableComponent } from "./builtins/$richText/$richTextPart/$richTextPart";
import { textEditableComponent } from "./builtins/$text/$text";
import { actionTextModifier } from "./builtins/actionTextModifier";
import { DEFAULT_DEVICES } from "./devices";
import { Theme } from "./theme";
import {
  themeObjectValueToResponsiveValue,
  themeScalarValueToResponsiveValue,
} from "./themeValueToResponsiveValue";
import { CompilationContextType, CompilationDocumentType } from "./types";

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
  documentType: NonNullable<EditorLauncherProps["documentType"]>
): CompilationContextType {
  const devices = prepareDevices(config.devices);
  const mainDevice = devices.find((x) => x.isMain);

  if (!mainDevice) {
    throw new Error(`Missing main device in devices config.`);
  }

  const theme: Theme = {
    colors: {},
    fonts: {},
    space: {},
    numberOfItemsInRow: {},
    aspectRatios: {},
    icons: {},
    containerWidths: {},
    boxShadows: {},
  };

  // TODO: allow for custom breakpoints!!! What happens with old ones when the new ones show up?

  if (config.space) {
    config.space.forEach((space) => {
      let val = space.value;

      // If value is "vw" and is not responsive then we should responsify it.
      // Why? Because responsive token behaves differently from non-responsive in terms of auto.
      // Responsive token automatically "fills" all the breakpoints.
      // If someone does 10vw it is responsive in nature, it's NEVER a scalar.
      if (typeof val === "string" && parseSpacing(val).unit === "vw") {
        val = { [`@${mainDevice.id}`]: val };
      }

      const { id, ...rest } = space;

      theme.space[id] = {
        ...rest,
        type: "dev",
        value: normalizeSpace(themeScalarValueToResponsiveValue(val, devices)),
      };
    });
  }

  if (config.colors) {
    config.colors.forEach((color) => {
      const { id, ...rest } = color;

      theme.colors[id] = {
        ...rest,
        type: "dev",
        value: themeScalarValueToResponsiveValue(color.value, devices),
      };
    });
  }

  if (config.fonts) {
    // fonts are a bit more complex because they're objects
    config.fonts.forEach((font) => {
      const { id, ...rest } = font;

      theme.fonts[id] = {
        ...rest,
        type: "dev",
        value: themeObjectValueToResponsiveValue(font.value, devices),
      };
    });
  }

  if (config.aspectRatios) {
    config.aspectRatios.forEach((aspectRatio) => {
      const { id, ...rest } = aspectRatio;

      theme.aspectRatios[id] = {
        ...rest,
        type: "dev",
        value: themeScalarValueToResponsiveValue(aspectRatio.value, devices),
      };
    });
  }

  if (config.boxShadows) {
    config.boxShadows.forEach((boxShadow) => {
      const { id, ...rest } = boxShadow;

      theme.boxShadows[id] = {
        ...rest,
        type: "dev",
        value: themeScalarValueToResponsiveValue(boxShadow.value, devices),
      };
    });
  }

  if (config.containerWidths) {
    config.containerWidths.forEach((containerWidth) => {
      const { id, ...rest } = containerWidth;

      theme.containerWidths[id] = {
        ...rest,
        type: "dev",
        value: themeScalarValueToResponsiveValue(
          containerWidth.value.toString(),
          devices
        ),
      };
    });
  }

  if (config.icons) {
    config.icons.forEach((icon) => {
      const { id, ...rest } = icon;

      theme.icons[id] = {
        ...rest,
        type: "dev",
        value: icon.value,
      };
    });
  }

  const fetchingContext = createFetchingContext(config);
  const documentTypes = buildDocumentTypes(config.documentTypes, devices);

  const components: Array<NoCodeComponentDefinition<any, any>> = [
    textEditableComponent,
    richTextEditableComponent,
    richTextBlockElementEditableComponent,
    richTextLineElementEditableComponent,
    richTextInlineWrapperElementEditableComponent,
    richTextPartEditableComponent,
  ];

  if (config.components) {
    components.push(...config.components);
  }

  const activeDocument = documentTypes.find((r) => r.id === documentType);

  if (!activeDocument) {
    throw new Error(`Document type "${documentType}" doesn't exist.`);
  }

  if (activeDocument.schema) {
    const rootComponentDefinition = components.find(
      (c) => c.id === activeDocument.entry._template
    );

    if (!rootComponentDefinition) {
      throw new Error(
        `Missing definition for component "${activeDocument.entry._template}".`
      );
    }

    activeDocument.schema.forEach((schemaProp) => {
      if (
        !rootComponentDefinition.schema.some((s) => s.prop === schemaProp.prop)
      ) {
        const rootExternalSchemaProp: ExternalSchemaProp = {
          ...schemaProp,
          group: "Preview data",
          optional: true,
        };

        rootComponentDefinition.schema.push(rootExternalSchemaProp);
      }
    });
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
    theme: buildFullTheme(theme),
    definitions: {
      components,
      actions: [],
      links: [],
      textModifiers,
    },
    types: fetchingContext.types,
    mainBreakpointIndex: mainDevice.id,
    contextParams,
    strict: fetchingContext.strict,
    locales: config.locales,
    documentType,
    documentTypes,
  };

  return compilationContext;
}

function buildDocumentTypes(
  documentTypes: Config["documentTypes"],
  devices: Devices
): CompilationContextType["documentTypes"] {
  const resultDocumentTypes: CompilationContextType["documentTypes"] = [];

  if (documentTypes) {
    for (const [id, documentType] of Object.entries(documentTypes)) {
      const resultDocumentType: CompilationDocumentType = {
        id,
        label: documentType.label,
        entry: documentType.entry,
        schema: documentType.schema,
        widths: buildDocumentTypesWidths(id, documentType, devices),
      };

      resultDocumentTypes.push(resultDocumentType);
    }
  }

  return resultDocumentTypes;
}

function buildDocumentTypesWidths(
  id: string,
  documentType: DocumentType,
  devices: Devices
) {
  let widths: CompilationDocumentType["widths"];

  if (documentType.widths) {
    if (documentType.widths.length !== devices.length) {
      throw new Error(
        `Invalid number of widths for root container "${id}". Expected ${devices.length} widths, got ${documentType.widths.length}.`
      );
    }

    widths = Object.fromEntries(
      documentType.widths.map((containerWidth, index) => {
        const currentDevice = devices[index];
        return [currentDevice.id, Math.min(containerWidth, currentDevice.w)];
      })
    );
  } else {
    widths = Object.fromEntries(devices.map((device) => [device.id, device.w]));
  }

  return widths;
}
