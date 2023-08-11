import {
  Config,
  ImageVariant,
  LauncherPlugin,
  ResourceSchemaProp,
  ResourceTransformer,
} from "@easyblocks/core";
import { assertDefined } from "@easyblocks/utils";
import { createCompilationContext } from "./createCompilationContext";

const testPlugin: LauncherPlugin = {
  id: "test",
  launcher: {
    image: {
      resourceType: "test.image",
      transform: (value) => {
        return {
          alt: value.alt,
          aspectRatio: value.width / value.height,
          mimeType: "image/jpeg",
          srcset: [
            {
              h: value.height,
              url: `/images/${value.id}.jpeg`,
              w: value.width,
            },
          ],
          url: `/images/${value.id}.jpeg`,
        };
      },
    },
    onEditorLoad() {},
    video: {
      resourceType: "test.video",
      transform: (value) => {
        return {
          alt: value.alt,
          aspectRatio: value.width / value.height,
          url: `/videos/${value.id}`,
        };
      },
    },
  },
  resources: {
    "test.image": {
      defaultFetch: async (resources) => {
        return resources.map((r) => {
          return {
            ...r,
            value: {
              id: r.id,
              width: 1920,
              height: 1080,
              alt: `Image ${r.id}`,
            },
          };
        });
      },
      widget: () => ({
        type: "custom",
        component: () => {
          new Error("Not implemented");
        },
      }),
    },
  },
};

const basicConfig: Config = {
  plugins: [testPlugin],
  resourceTypes: {},
};

const defaults = {
  xs: {
    id: "xs",
    w: 375,
    h: 667,
    breakpoint: 568,
    label: "Mobile",
  },
  sm: {
    id: "sm",
    w: 667,
    h: 375,
    breakpoint: 768,
    label: "Mobile SM h",
    hidden: true,
  },
  md: {
    id: "md",
    w: 768,
    h: 1024,
    breakpoint: 992,
    label: "Tablet",
  },
  lg: {
    id: "lg",
    w: 1024,
    h: 768,
    breakpoint: 1280,
    label: "TabletH",
    hidden: true,
  },
  xl: {
    id: "xl",
    w: 1366,
    h: 768,
    breakpoint: 1600,
    label: "Desktop",
    isMain: true,
  },
  "2xl": {
    id: "2xl",
    w: 1920,
    h: 920,
    label: "Large desktop",
    breakpoint: null,
  },
};

describe("breakpoints", () => {
  test("no devices outputs default", () => {
    const result = createCompilationContext(
      { ...basicConfig },
      { locale: "en-US" }
    );
    expect(result.devices).toHaveLength(6);
    expect(result.devices[0]).toEqual(defaults.xs);
    expect(result.devices[1]).toEqual(defaults.sm);
    expect(result.devices[2]).toEqual(defaults.md);
    expect(result.devices[3]).toEqual(defaults.lg);
    expect(result.devices[4]).toEqual(defaults.xl);
    expect(result.devices[5]).toEqual(defaults["2xl"]);
  });

  test("devices properly overrides properties for selected breakpoints", () => {
    const result = createCompilationContext(
      {
        ...basicConfig,
        devices: {
          xs: {
            w: 300,
            h: 400,
            startsFrom: 10, // should be ignored
          },
          lg: {
            w: 1440,
            h: 800,
            startsFrom: 1300,
          },
        },
      },
      {
        locale: "en-US",
      }
    );

    expect(result.devices[0]).toEqual({
      ...defaults.xs,
      w: 300,
      h: 400,
    });

    expect(result.devices[1]).toEqual(defaults.sm);
    expect(result.devices[2]).toEqual({
      ...defaults.md,
      breakpoint: 1300,
    });
    expect(result.devices[3]).toEqual({
      ...defaults.lg,
      w: 1440,
      h: 800,
    });
    expect(result.devices[4]).toEqual(defaults.xl);

    expect(result.devices[5]).toEqual(defaults["2xl"]);
  });
});

describe("max widths", () => {
  test("no devices outputs default", () => {
    const result = createCompilationContext(
      { ...basicConfig, containerWidths: [{ id: "small", value: 800 }] },
      { locale: "en-US" }
    );

    expect(result.theme.containerWidths.small).toMatchObject({
      type: "dev",
      value: "800",
    });
  });
});

describe("image variants", () => {
  test("returns array with only image variant based on launcher plugin if image sources are not provided", () => {
    const result = createCompilationContext(basicConfig, { locale: "en-US" });

    expect(result.imageVariants).toHaveLength(1);
    expect(result.imageVariants[0]).toEqual<ImageVariant>({
      id: "test.default",
      label: "Default",
      resourceType: "test.image",
      transform: basicConfig.plugins![0].launcher!.image.transform,
      transformHash: expect.any(String),
    });
  });

  test("returns array with image variant based on launcher plugin and custom variant if custom image variant is provided", () => {
    const customVariantTransform: ResourceTransformer<any, any> = (v) => v;

    const result = createCompilationContext(
      {
        ...basicConfig,
        imageVariants: [
          {
            id: "customImage",
            resourceType: "customImageResourceType",
            transform: customVariantTransform,
          },
        ],
      },
      { locale: "en-US" }
    );

    expect(result.imageVariants).toHaveLength(2);
    expect(result.imageVariants[0]).toEqual<ImageVariant>({
      id: "test.default",
      label: "Default",
      resourceType: "test.image",
      transform: basicConfig.plugins![0].launcher!.image.transform,
      transformHash: expect.any(String),
    });
    expect(result.imageVariants[1]).toEqual<ImageVariant>({
      id: "customImage",
      resourceType: "customImageResourceType",
      transform: customVariantTransform,
      transformHash: expect.any(String),
    });
  });

  test("params and fetchParams are passed through", () => {
    const result = createCompilationContext(
      {
        ...basicConfig,
        image: {
          ...testPlugin.launcher.image,
          params: {
            param1: "widget param",
          },
          fetchParams: {
            param1: "fetch param",
          },
        },
      },
      { locale: "en-US" }
    );

    expect(result.imageVariants).toHaveLength(1);
    expect(result.imageVariants[0]).toEqual<ImageVariant>({
      id: "test.default",
      label: "Default",
      resourceType: "test.image",
      transform: basicConfig.plugins![0].launcher!.image.transform,
      transformHash: expect.any(String),
      params: {
        param1: "widget param",
      },
      fetchParams: {
        param1: "fetch param",
      },
    });
  });

  test("throws an error when custom image variant matches the name of the image variant based on launcher plugin", () => {
    expect(() => {
      createCompilationContext(
        {
          ...basicConfig,
          imageVariants: [
            {
              id: "test.default",
              resourceType: "test.image",
              transform: (v) => v,
            },
          ],
        },
        { locale: "en-US" }
      );
    }).toThrowErrorMatchingInlineSnapshot(
      `"Image variant id \\"test.default\\" is reserved identifier and cannot be used."`
    );
  });

  test("throws an error when provided image variants have non unique ids", () => {
    expect(() => {
      createCompilationContext(
        {
          ...basicConfig,
          imageVariants: [
            {
              id: "variant1",
              resourceType: "test.image",
              transform: (v) => v,
            },
            {
              id: "variant1",
              resourceType: "test.image",
              transform: (v) => v,
            },
            {
              id: "variant2",
              resourceType: "test.image",
              transform: (v) => v,
            },
            {
              id: "variant2",
              resourceType: "test.image",
              transform: (v) => v,
            },
            {
              id: "variant3",
              resourceType: "test.image",
              transform: (v) => v,
            },
          ],
        },
        { locale: "en-US" }
      );
    }).toThrowErrorMatchingInlineSnapshot(
      `"All image variants must have a unique id. Image variants with non unique id: \\"variant1\\", \\"variant2\\"."`
    );
  });
});

describe("components", () => {
  const context = createCompilationContext(
    {
      ...basicConfig,
      components: [
        {
          id: "TestComponent",
          schema: [
            {
              prop: "text1",
              type: "text",
            },
            {
              prop: "image1",
              type: "image",
            },
            {
              prop: "video1",
              type: "video",
            },
            {
              prop: "resource1",
              type: "resource",
              resourceType: "testResource1",
              transform: (value) => value,
            },
            {
              prop: "resource2",
              type: "resource",
              resourceType: "testResource1",
            },
          ],
          type: "item",
        },
      ],
    },
    { locale: "en-US" }
  );

  const testComponentDefinition = assertDefined(
    context.definitions.components.find((c) => c.id === "TestComponent")
  );

  test("adds transform hash to resource schema props when transform function is given", () => {
    const resource1SchemaProp = testComponentDefinition.schema.find(
      (s) => s.prop === "resource1"
    );

    expect(resource1SchemaProp).toEqual<ResourceSchemaProp>({
      prop: "resource1",
      type: "resource",
      resourceType: "testResource1",
      transform: expect.any(Function),
      transformHash: expect.any(String),
    });

    const resource2SchemaProp = testComponentDefinition.schema.find(
      (s) => s.prop === "resource2"
    );

    expect(resource2SchemaProp).toEqual<ResourceSchemaProp>({
      prop: "resource2",
      type: "resource",
      resourceType: "testResource1",
    });
  });

  test("adds traceId, traceImpressions, and traceClicks schema props", () => {
    expect(testComponentDefinition.schema).toEqual(
      expect.arrayContaining([
        {
          type: "string",
          prop: "traceId",
          label: "Trace Id",
          group: "Analytics",
          normalize: expect.any(Function),
        },
        {
          type: "boolean",
          prop: "traceImpressions",
          label: "Trace Impressions",
          group: "Analytics",
        },
        {
          type: "boolean",
          prop: "traceClicks",
          label: "Trace clicks",
          group: "Analytics",
          visible: expect.any(Function),
        },
      ])
    );
  });
});

describe("root containers", () => {
  test('returns empty root containers when "rootContainers" is not defined in config', () => {
    const context = createCompilationContext(basicConfig, { locale: "en-US" });

    expect(context.rootContainers).toEqual([]);
  });

  test('returns root containers when "rootContainers" is defined in config', () => {
    const context = createCompilationContext(
      {
        ...basicConfig,
        rootContainers: {
          rootContainer1: {
            widths: [100, 200, 300, 400, 500, 600],
          },
        },
      },
      { locale: "en-US" }
    );

    expect(context.rootContainers).toEqual([
      {
        id: "rootContainer1",
        widths: {
          xs: 100,
          sm: 200,
          md: 300,
          lg: 400,
          xl: 500,
          "2xl": 600,
        },
      },
    ]);
  });

  test("replaces width of given root container with 100% if width is bigger than breakpoint for which it's defined", () => {
    const context = createCompilationContext(
      {
        ...basicConfig,
        rootContainers: {
          rootContainer1: {
            widths: [1000, 900, 800, 700, 600, 500],
          },
        },
      },
      { locale: "en-US" }
    );

    expect(context.rootContainers).toEqual([
      {
        id: "rootContainer1",
        widths: {
          xs: "100%",
          sm: "100%",
          md: "100%",
          lg: 700,
          xl: 600,
          "2xl": 500,
        },
      },
    ]);
  });

  test("throws an error when number of widths of given root container is less than number of devices", () => {
    expect(() => {
      createCompilationContext(
        {
          ...basicConfig,
          rootContainers: {
            rootContainer1: {
              widths: [100, 200, 300, 400, 500],
            },
          },
        },
        { locale: "en-US" }
      );
    }).toThrowErrorMatchingInlineSnapshot(
      `"Invalid number of widths for root container \\"rootContainer1\\". Expected 6 widths, got 5."`
    );
  });
});
