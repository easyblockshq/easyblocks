import { EasyblocksBackend } from "../EasyblocksBackend";
import { createCompilationContext } from "./createCompilationContext";
import { schemaPropDefinitions } from "./definitions";

const testCompilationContext = createCompilationContext(
  {
    backend: new EasyblocksBackend({ accessToken: "" }),
    locales: [{ code: "en-US", isDefault: true }],
    types: {
      custom: {
        type: "external",
        widgets: [],
      },
    },
    components: [
      {
        id: "RootComponent",
        schema: [],
      },
    ],
  },
  { locale: "en-US" },
  "RootComponent"
);

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
  const boolean$SchemaTestCases: Array<SchemaPropTestCaseArray<"boolean">> = [
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
          .boolean(
            {
              prop: "testProp",
              type: "boolean",
            },
            testCompilationContext
          )
          .getHash(value, "xl", [])
      ).toBe(expected);
    }
  );
});

describe("color schema", () => {
  const colorSchema = schemaPropDefinitions.custom(
    {
      prop: "testProp",
      type: "color",
    },
    testCompilationContext
  );

  const colorSchemaTestCases: Array<SchemaPropTestCaseArray<"custom">> = [
    [{ tokenId: "white", value: "#fff", widgetId: "" }, "white"],
    [
      { $res: true, xl: { tokenId: "white", value: "#fff", widgetId: "" } },
      "white",
    ],
    [{ $res: true }, undefined],
    [{ $res: true, xl: { value: "#fff", widgetId: "" } }, "#fff"],
  ];

  test.each(colorSchemaTestCases)('for %j returns "%s"', (value, expected) => {
    expect(colorSchema.getHash(value, "xl", [])).toBe(expected);
  });
});

describe("component schema", () => {
  const componentSchemaTestCases: Array<SchemaPropTestCaseArray<"component">> =
    [
      [[], "__BLOCK_EMPTY__"],
      [[{ _template: "test template", _id: "" }], "test template"],
      [
        [
          { _template: "test template1", _id: "" },
          { _template: "test template2", _id: "" },
        ],
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
              accepts: [""],
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
    [[{ _template: "test template", _id: "" }], "test template"],
    [
      [
        { _template: "test template1", _id: "" },
        { _template: "test template2", _id: "" },
      ],
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
            accepts: [""],
          },
          testCompilationContext
        ).getHash(value, "xl", [])
      ).toBe(expected);
    }
  );
});

describe("custom schema", () => {
  const customSchemaTestCases: Array<SchemaPropTestCaseArray<"custom">> = [
    [{ id: "testId", widgetId: "custom" }, "testId.custom"],
    [{ id: "testId", widgetId: "custom" }, "testId.custom"],
  ];

  test.each(customSchemaTestCases)(
    'for %s returns "%s""',
    (value, expected) => {
      expect(
        schemaPropDefinitions
          .custom(
            {
              prop: "testProp",
              type: "custom",
            },
            testCompilationContext
          )
          .getHash(value, "xl", [])
      ).toBe(expected);
    }
  );
});

describe("font schema", () => {
  const fontSchema = schemaPropDefinitions.custom(
    {
      prop: "testProp",
      type: "font",
    },
    testCompilationContext
  );

  const fontSchemaTestCases: Array<SchemaPropTestCaseArray<"custom">> = [
    [
      {
        $res: true,
        xl: {
          tokenId: "font",
          value: {
            ref: "font",
          },
          widgetId: "",
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
        tokenId: "font",
        value: {
          ref: "font",
        },
        widgetId: "",
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
          widgetId: "",
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
  const iconSchema = schemaPropDefinitions.custom(
    {
      prop: "testProp",
      type: "icon",
    },
    testCompilationContext
  );

  const iconSchemaTestCases: Array<SchemaPropTestCaseArray<"custom">> = [
    [{ tokenId: "icon", value: "", widgetId: "" }, "icon"],
    [{ value: "blabla", widgetId: "" }, "blabla"],
  ];

  test.each(iconSchemaTestCases)('for %j returns "%s"', (value, expected) => {
    expect(iconSchema.getHash(value, "xl", [])).toBe(expected);
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
      params: {
        options: ["option1", "option2"],
      },
    },
    testCompilationContext
  );

  const radioGroupSchemaTestCases: Array<
    SchemaPropTestCaseArray<"radio-group">
  > = [
    ["", ""],
    ["value", "value"],
    [{ $res: true }, undefined],
    [{ $res: true, xl: "" }, ""],
    [{ $res: true, xl: "testValue" }, "testValue"],
  ];

  test.each(radioGroupSchemaTestCases)(
    'for "%s" returns "%s"',
    (value, expected) => {
      expect(radioGroupSchema.getHash(value, "xl", [])).toBe(expected);
    }
  );
});

describe("select schema", () => {
  const selectSchema = schemaPropDefinitions.select(
    {
      prop: "testProp",
      type: "select",
      params: {
        options: ["option1", "option2"],
      },
    },
    testCompilationContext
  );

  const selectSchemaTestCases: Array<SchemaPropTestCaseArray<"select">> = [
    ["", ""],
    ["value", "value"],
    [{ $res: true }, undefined],
    [{ $res: true, xl: "" }, ""],
    [{ $res: true, xl: "testValue" }, "testValue"],
  ];

  test.each(selectSchemaTestCases)(
    'for "%s" returns "%s"',
    (value, expected) => {
      expect(selectSchema.getHash(value, "xl", [])).toBe(expected);
    }
  );
});

describe("space schema", () => {
  const spaceSchema = schemaPropDefinitions.custom(
    {
      prop: "testProp",
      type: "space",
    },
    testCompilationContext
  );

  const spaceSchemaTestCases: Array<SchemaPropTestCaseArray<"custom">> = [
    [{ tokenId: "s-3", value: "8px", widgetId: "" }, "s-3"],
    [{ tokenId: "s-3", value: { $res: true }, widgetId: "" }, "s-3"],
    [{ tokenId: "s-3", value: { $res: true, xl: "8px" }, widgetId: "" }, "s-3"],
    [{ $res: true }, undefined],
    [{ $res: true, xl: { tokenId: "s-3", value: "8px", widgetId: "" } }, "s-3"],
    [
      {
        $res: true,
        xl: {
          tokenId: "s-3",
          value: {
            $res: true,
            xl: "8px",
          },
          widgetId: "",
        },
      },
      "s-3",
    ],
    [{ $res: true, xl: { value: "8px", widgetId: "" } }, "8px"],
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

describe("aspectRatio schema", () => {
  const stringTokenSchema = schemaPropDefinitions.custom(
    {
      prop: "testProp",
      type: "aspectRatio",
    },
    testCompilationContext
  );

  const stringTokenSchemaTestCases: Array<SchemaPropTestCaseArray<"custom">> = [
    [{ $res: true }, undefined],
    [
      {
        $res: true,
        xl: { tokenId: "testAspectRatio", value: "4:3", widgetId: "" },
      },
      "testAspectRatio",
    ],
    [
      {
        $res: true,
        xl: { value: "4:3", widgetId: "" },
      },
      "4:3",
    ],
    [
      { tokenId: "testAspectRatio", value: "4:3", widgetId: "" },
      "testAspectRatio",
    ],
    [{ value: "4:3", widgetId: "" }, "4:3"],
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
    [{ id: "test", widgetId: "" }, "test"],
    [{ id: "testId", widgetId: "" }, "testId"],
    [{ id: "testId", widgetId: "" }, "testId"],
    [{ id: null, widgetId: "" }, undefined],
  ];

  test.each(textSchemaTestCases)('for %j returns "%s"', (value, expected) => {
    expect(textSchema.getHash(value, "xl", [])).toBe(expected);
  });
});
