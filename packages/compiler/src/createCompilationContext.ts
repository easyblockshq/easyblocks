import {
  CompilationContextType,
  CompilationRootContainer,
  DEFAULT_DEVICES,
  InternalTextModifierDefinition,
  parseSpacing,
  responsiveValueMap,
} from "@easyblocks/app-utils";
import {
  Config,
  ConfigDeviceRange,
  ContextParams,
  createFetchingContext,
  Devices,
  EditorLauncherProps,
  ExternalSchemaProp,
  ResponsiveValue,
  RootContainer,
  Spacing,
  Theme,
} from "@easyblocks/core";
import { actionTextModifier } from "@easyblocks/editable-components";
import { buildFullTheme } from "./buildFullTheme";
import {
  themeObjectValueToResponsiveValue,
  themeScalarValueToResponsiveValue,
} from "./themeValueToResponsiveValue";

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
  rootContainer: NonNullable<EditorLauncherProps["rootContainer"]>
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
  const rootContainers = buildRootContainers(config.rootContainers, devices);

  const components = config.components ?? [];

  const activeRootContainer = rootContainers.find(
    (r) => r.id === rootContainer
  );

  if (!activeRootContainer) {
    throw new Error(`Root container "${rootContainer}" doesn't exist.`);
  }

  if (activeRootContainer.schema) {
    const rootComponentDefinition = components.find(
      (c) => c.id === activeRootContainer.defaultConfig._template
    );

    if (!rootComponentDefinition) {
      throw new Error(
        `Missing definition for component "${activeRootContainer.defaultConfig._template}".`
      );
    }

    activeRootContainer.schema.forEach((schemaProp) => {
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

  const textModifiers: Array<InternalTextModifierDefinition> = [
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
    rootContainer,
    rootContainers,
  };

  return compilationContext;
}

function buildRootContainers(
  rootContainers: Config["rootContainers"],
  devices: Devices
): CompilationContextType["rootContainers"] {
  const resultRootContainers: CompilationContextType["rootContainers"] = [];

  if (rootContainers) {
    for (const [id, rootContainer] of Object.entries(rootContainers)) {
      const resultRootContainer: CompilationRootContainer = {
        id,
        label: rootContainer.label,
        defaultConfig: rootContainer.defaultConfig,
        schema: rootContainer.schema,
        widths: buildRootContainerWidths(id, rootContainer, devices),
      };

      resultRootContainers.push(resultRootContainer);
    }
  }

  return resultRootContainers;
}

function buildRootContainerWidths(
  id: string,
  rootContainer: RootContainer,
  devices: Devices
) {
  let widths: CompilationRootContainer["widths"];

  if (rootContainer.widths) {
    if (rootContainer.widths.length !== devices.length) {
      throw new Error(
        `Invalid number of widths for root container "${id}". Expected ${devices.length} widths, got ${rootContainer.widths.length}.`
      );
    }

    widths = Object.fromEntries(
      rootContainer.widths.map((containerWidth, index) => {
        const currentDevice = devices[index];
        return [currentDevice.id, Math.min(containerWidth, currentDevice.w)];
      })
    );
  } else {
    widths = Object.fromEntries(devices.map((device) => [device.id, device.w]));
  }

  return widths;
}
