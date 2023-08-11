import { CompilationContextType } from "@easyblocks/app-utils";
import { schemaPropDefinitions } from "./definitions";

const testCompilationContext: CompilationContextType = {
  devices: [],
  theme: {
    space: {
      "0": {
        type: "dev",
        value: "0px",
      },
    },
    fonts: {
      $body: {
        type: "dev",
        value: {
          $res: true,
        },
      },
    },
    aspectRatios: {
      $landscape: {
        type: "dev",
        value: "4:3",
      },
    },
    containerWidths: {},
    colors: {
      $dark: {
        type: "dev",
        value: "black",
      },
    },
    icons: {
      $sliderLeft: {
        type: "dev",
        value: "<svg></svg>",
      },
    },
    numberOfItemsInRow: {},
    boxShadows: {},
  },
  contextParams: {
    locale: "en",
  },
  image: {
    resourceType: "",
    transform: jest.fn(),
  },
  mainBreakpointIndex: "",
  text: {
    fetch: jest.fn(),
  },
  resourceTypes: {},
  video: {
    resourceType: "",
    transform: jest.fn(),
  },
  definitions: {
    links: [],
    actions: [],
    components: [],
    textModifiers: [],
  },
  imageVariants: [],
  videoVariants: [],
  rootContainers: [],
  rootContainer: "content",
};

type SchemaPropTestCaseArray<
  SchemaName extends keyof typeof schemaPropDefinitions
> = [
  Parameters<
    ReturnType<(typeof schemaPropDefinitions)[SchemaName]>["getHash"]
  >[0],
  string | undefined
];

describe("boolean schema", () => {
  const booleanSchemaTestCases: Array<SchemaPropTestCaseArray<"boolean">> = [
    [true, "true"],
    [false, "false"],
  ];

  test.each(booleanSchemaTestCases)(
    'for %s returns "%s"',
    (value, expected) => {
      expect(
        schemaPropDefinitions
          .boolean(
            {
              prop: "testProp",
              type: "boolean",
            },
            testCompilationContext
          )
          .getHash(value, "", [])
      ).toBe(expected);
    }
  );
});

describe("boolean$ schema", () => {
  const boolean$SchemaTestCases: Array<SchemaPropTestCaseArray<"boolean$">> = [
    [true, "true"],
    [false, "false"],
    [{ $res: true, xl: true }, "true"],
    [{ $res: true, xl: false }, "false"],
    [{ $res: true }, undefined],
  ];

  test.each(boolean$SchemaTestCases)(
    'for %j returns "%s"',
    (value, expected) => {
      expect(
        schemaPropDefinitions
          .boolean$(
            {
              prop: "testProp",
              type: "boolean$",
            },
            testCompilationContext
          )
          .getHash(value, "xl", [])
      ).toBe(expected);
    }
  );
});

describe("color schema", () => {
  const colorSchema = schemaPropDefinitions.color(
    {
      prop: "testProp",
      type: "color",
    },
    testCompilationContext
  );

  const colorSchemaTestCases: Array<SchemaPropTestCaseArray<"color">> = [
    [{ ref: "white", value: "#fff" }, "white"],
    [{ $res: true, xl: { ref: "white", value: "#fff" } }, "white"],
    [{ $res: true }, undefined],
    [{ $res: true, xl: { value: "#fff" } }, "#fff"],
  ];

  test.each(colorSchemaTestCases)('for %j returns "%s"', (value, expected) => {
    expect(colorSchema.getHash(value, "xl", [])).toBe(expected);
  });
});

describe("component schema", () => {
  const componentSchemaTestCases: Array<SchemaPropTestCaseArray<"component">> =
    [
      [[], "__BLOCK_EMPTY__"],
      [[{ _template: "test template" }], "test template"],
      [
        [{ _template: "test template1" }, { _template: "test template2" }],
        "test template1",
      ],
    ];

  test.each(componentSchemaTestCases)(
    'for %j returns "%s"',
    (value, expected) => {
      expect(
        schemaPropDefinitions
          .component(
            {
              prop: "testProp",
              type: "component",
              componentTypes: [""],
            },
            testCompilationContext
          )
          .getHash(value, "xl", [])
      ).toBe(expected);
    }
  );
});

describe("component-collection schema", () => {
  const componentCollectionSchemaTestCases: Array<
    SchemaPropTestCaseArray<"component-collection">
  > = [
    [[], ""],
    [[{ _template: "test template" }], "test template"],
    [
      [{ _template: "test template1" }, { _template: "test template2" }],
      "test template1;test template2",
    ],
  ];

  test.each(componentCollectionSchemaTestCases)(
    'for %j returns "%s"',
    (value, expected) => {
      expect(
        schemaPropDefinitions["component-collection"](
          {
            prop: "testProp",
            type: "component-collection",
            componentTypes: [""],
          },
          testCompilationContext
        ).getHash(value, "xl", [])
      ).toBe(expected);
    }
  );
});

describe("component-fixed schema", () => {
  const componentFixedSchemaTestCases: Array<
    SchemaPropTestCaseArray<"component-fixed">
  > = [
    [[], ""],
    [[{ _template: "test template" }], "test template"],
    [
      [{ _template: "test template1" }, { _template: "test template2" }],
      "test template1;test template2",
    ],
  ];

  test.each(componentFixedSchemaTestCases)(
    'for %j returns "%s"',
    (value, expected) => {
      expect(
        schemaPropDefinitions["component-fixed"](
          {
            prop: "testProp",
            type: "component-fixed",
            componentType: "",
          },
          testCompilationContext
        ).getHash(value, "xl", [])
      ).toBe(expected);
    }
  );
});

describe("custom schema", () => {
  const customSchemaTestCases: Array<SchemaPropTestCaseArray<"custom">> = [
    [{ id: "testId" }, "testId"],
    [{ id: "testId" }, "testId"],
  ];

  test.each(customSchemaTestCases)(
    'for %s returns "%s""',
    (value, expected) => {
      expect(
        schemaPropDefinitions["custom"](
          {
            prop: "testProp",
            type: "custom",
          },
          testCompilationContext
        ).getHash(value, "xl", [])
      ).toBe(expected);
    }
  );
});

describe("font schema", () => {
  const fontSchema = schemaPropDefinitions.font(
    {
      prop: "testProp",
      type: "font",
    },
    testCompilationContext
  );

  const fontSchemaTestCases: Array<SchemaPropTestCaseArray<"font">> = [
    [
      {
        $res: true,
        xl: {
          ref: "font",
          value: {
            ref: "font",
          },
        },
      },
      "font",
    ],
    [
      {
        $res: true,
      },
      undefined,
    ],
    [
      {
        ref: "font",
        value: {
          ref: "font",
        },
      },
      "font",
    ],
    [
      {
        $res: true,
        xl: {
          value: {
            fontFamily: "serif",
          },
        },
      },
      `{"fontFamily":"serif"}`,
    ],
  ];

  test.each(fontSchemaTestCases)('for %j returns "%s"', (value, expected) => {
    expect(fontSchema.getHash(value, "xl", [])).toBe(expected);
  });
});

describe("icon schema", () => {
  const iconSchema = schemaPropDefinitions.icon(
    {
      prop: "testProp",
      type: "icon",
    },
    testCompilationContext
  );

  const iconSchemaTestCases: Array<SchemaPropTestCaseArray<"icon">> = [
    [{ ref: "icon", value: "" }, "icon"],
    [{ value: "blabla" }, "blabla"],
  ];

  test.each(iconSchemaTestCases)('for %j returns "%s"', (value, expected) => {
    expect(iconSchema.getHash(value, "xl", [])).toBe(expected);
  });
});

describe("image schema", () => {
  const imageSchema = schemaPropDefinitions.image(
    {
      prop: "testProp",
      type: "image",
    },
    testCompilationContext
  );

  const imageSchemaTestCases: Array<SchemaPropTestCaseArray<"image">> = [
    [{ id: "testImageId" }, "testImageId"],
    [{ $res: true }, undefined],
    [
      {
        $res: true,
        xl: {
          id: "testImageId",
        },
      },
      "testImageId",
    ],
    [{ $res: true, xl: { id: null } }, undefined],
    [{ id: "testImageId", variant: "testVariant" }, "testImageId.testVariant"],
    [
      { $res: true, xl: { id: "testImageId", variant: "testVariant" } },
      "testImageId.testVariant",
    ],
    [{ id: null, variant: "testVariant" }, "testVariant"],
    [{ $res: true, xl: { id: null, variant: "testVariant" } }, "testVariant"],
  ];

  test.each(imageSchemaTestCases)('for %j returns "%s"', (value, expected) => {
    expect(imageSchema.getHash(value, "xl", [])).toBe(expected);
  });
});

describe("number schema", () => {
  const numberSchema = schemaPropDefinitions.number(
    {
      prop: "testProp",
      type: "number",
    },
    testCompilationContext
  );

  const numberSchemaTestCases: Array<SchemaPropTestCaseArray<"number">> = [
    [5, "5"],
    [-5, "-5"],
    [0.7, "0.7"],
  ];

  test.each(numberSchemaTestCases)('for %j returns "%s"', (value, expected) => {
    expect(numberSchema.getHash(value, "xl", [])).toBe(expected);
  });
});

describe("radio-group schema", () => {
  const radioGroupSchema = schemaPropDefinitions["radio-group"](
    {
      prop: "testProp",
      type: "radio-group",
      options: ["option1", "option2"],
    },
    testCompilationContext
  );

  const radioGroupSchemaTestCases: Array<
    SchemaPropTestCaseArray<"radio-group">
  > = [
    ["", ""],
    ["value", "value"],
  ];

  test.each(radioGroupSchemaTestCases)(
    'for "%s" returns "%s"',
    (value, expected) => {
      expect(radioGroupSchema.getHash(value, "xl", [])).toBe(expected);
    }
  );
});

describe("radio-group$ schema", () => {
  const radioGroup$Schema = schemaPropDefinitions["radio-group$"](
    {
      prop: "testProp",
      type: "radio-group$",
      options: ["option1", "option2"],
    },
    testCompilationContext
  );

  const radioGroup$SchemaTestCases: Array<
    SchemaPropTestCaseArray<"radio-group$">
  > = [
    ["", ""],
    ["value", "value"],
    [{ $res: true }, undefined],
    [{ $res: true, xl: "" }, ""],
    [{ $res: true, xl: "testValue" }, "testValue"],
  ];

  test.each(radioGroup$SchemaTestCases)(
    'for "%s" returns "%s"',
    (value, expected) => {
      expect(radioGroup$Schema.getHash(value, "xl", [])).toBe(expected);
    }
  );
});

describe("select schema", () => {
  const selectSchema = schemaPropDefinitions.select(
    {
      prop: "testProp",
      type: "select",
      options: ["option1", "option2"],
    },
    testCompilationContext
  );

  const selectSchemaTestCases: Array<SchemaPropTestCaseArray<"select">> = [
    ["", ""],
    ["value", "value"],
  ];

  test.each(selectSchemaTestCases)(
    'for "%s" returns "%s"',
    (value, expected) => {
      expect(selectSchema.getHash(value, "xl", [])).toBe(expected);
    }
  );
});

describe("select$ schema", () => {
  const select$Schema = schemaPropDefinitions.select$(
    {
      prop: "testProp",
      type: "select$",
      options: ["option1", "option2"],
    },
    testCompilationContext
  );

  const select$SchemaTestCases: Array<SchemaPropTestCaseArray<"select$">> = [
    ["", ""],
    ["value", "value"],
    [{ $res: true }, undefined],
    [{ $res: true, xl: "" }, ""],
    [{ $res: true, xl: "testValue" }, "testValue"],
  ];

  test.each(select$SchemaTestCases)(
    'for "%s" returns "%s"',
    (value, expected) => {
      expect(select$Schema.getHash(value, "xl", [])).toBe(expected);
    }
  );
});

describe("space schema", () => {
  const spaceSchema = schemaPropDefinitions.space(
    {
      prop: "testProp",
      type: "space",
    },
    testCompilationContext
  );

  const spaceSchemaTestCases: Array<SchemaPropTestCaseArray<"space">> = [
    [{ ref: "s-3", value: "8px" }, "s-3"],
    [{ ref: "s-3", value: { $res: true } }, "s-3"],
    [{ ref: "s-3", value: { $res: true, xl: "8px" } }, "s-3"],
    [{ $res: true }, undefined],
    [{ $res: true, xl: { ref: "s-3", value: "8px" } }, "s-3"],
    [
      {
        $res: true,
        xl: {
          ref: "s-3",
          value: {
            $res: true,
            xl: "8px",
          },
        },
      },
      "s-3",
    ],
    [{ $res: true, xl: { value: "8px" } }, "8px"],
  ];

  test.each(spaceSchemaTestCases)(
    'for "%j" returns "%s"',
    (value, expected) => {
      expect(spaceSchema.getHash(value, "xl", [])).toBe(expected);
    }
  );
});

describe("string schema", () => {
  const stringSchema = schemaPropDefinitions.string(
    {
      prop: "testProp",
      type: "string",
    },
    testCompilationContext
  );

  const stringSchemaTestCases: Array<SchemaPropTestCaseArray<"string">> = [
    ["", ""],
    ["test", "test"],
  ];

  test.each(stringSchemaTestCases)(
    'for "%j" returns "%s"',
    (value, expected) => {
      expect(stringSchema.getHash(value, "xl", [])).toBe(expected);
    }
  );
});

describe("stringToken schema", () => {
  const stringTokenSchema = schemaPropDefinitions.stringToken(
    {
      prop: "testProp",
      type: "stringToken",
      tokenId: "aspectRatios",
    },
    testCompilationContext
  );

  const stringTokenSchemaTestCases: Array<
    SchemaPropTestCaseArray<"stringToken">
  > = [
    [{ $res: true }, undefined],
    [
      { $res: true, xl: { ref: "testAspectRatio", value: "4:3" } },
      "testAspectRatio",
    ],
    [
      {
        $res: true,
        xl: { value: { $res: true, xl: "4:3" } },
      },
      "4:3",
    ],
    [
      {
        $res: true,
        xl: { value: "4:3" },
      },
      "4:3",
    ],
    [{ ref: "testAspectRatio", value: "4:3" }, "testAspectRatio"],
    [{ value: { $res: true, xl: "4:3" } }, "4:3"],
    [{ value: "4:3" }, "4:3"],
  ];

  test.each(stringTokenSchemaTestCases)(
    'for "%j" returns "%s"',
    (value, expected) => {
      expect(stringTokenSchema.getHash(value, "xl", [])).toBe(expected);
    }
  );
});

describe("text schema", () => {
  const textSchema = schemaPropDefinitions.text(
    {
      prop: "testProp",
      type: "text",
    },
    testCompilationContext
  );

  const textSchemaTestCases: Array<SchemaPropTestCaseArray<"text">> = [
    [{ id: "test" }, "test"],
    [{ id: "testId" }, "testId"],
    [{ id: "testId" }, "testId"],
    [{ id: null }, undefined],
  ];

  test.each(textSchemaTestCases)('for %j returns "%s"', (value, expected) => {
    expect(textSchema.getHash(value, "xl", [])).toBe(expected);
  });
});

describe("video schema", () => {
  const videoSchema = schemaPropDefinitions.video(
    {
      prop: "testProp",
      type: "video",
    },
    testCompilationContext
  );

  const videoSchemaTestCases: Array<SchemaPropTestCaseArray<"video">> = [
    [{ id: "test" }, "test"],
    [{ id: null }, undefined],
  ];

  test.each(videoSchemaTestCases)('for %j returns "%s"', (value, expected) => {
    expect(videoSchema.getHash(value, "xl", [])).toBe(expected);
  });
});

describe("resource schema", () => {
  const resourceSchema = schemaPropDefinitions.resource(
    {
      prop: "testProp",
      type: "resource",
      resourceType: "customResource",
    },
    testCompilationContext
  );

  const resourceSchemaTestCases: Array<SchemaPropTestCaseArray<"resource">> = [
    [{ id: "test" }, "resource.customResource.test"],
    [{ id: null }, "resource.customResource"],
  ];

  test.each(resourceSchemaTestCases)(
    'for %j returns "%s"',
    (value, expected) => {
      expect(resourceSchema.getHash(value, "xl", [])).toBe(expected);
    }
  );
});
