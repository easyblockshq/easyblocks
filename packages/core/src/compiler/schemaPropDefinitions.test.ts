import { mockConsoleMethod } from "@easyblocks/test-utils";
import { isTrulyResponsiveValue, responsiveValueFill } from "../responsiveness";
import {
  CompiledComponentConfig,
  Devices,
  ResponsiveValue,
  SchemaProp,
  UnresolvedResource,
} from "../types";
import { compileInternal } from "./compileInternal";
import { getSchemaDefinition, normalizeComponent } from "./definitions";
import { getDevicesWidths } from "./devices";
import { normalize } from "./normalize";
import { getTinaField } from "./tinaFieldProviders";
import {
  EditorContextType,
  InternalRenderableComponentDefinition,
} from "./types";
import { dotNotationSet } from "@easyblocks/utils";
import { createCompilationContext } from "./createCompilationContext";
import { EasyblocksBackend } from "../EasyblocksBackend";

const arrowLeftIcon = {
  type: "dev",
  // label: "Arrow left",
  value: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="red" width="100px" height="100px"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>`,
};

const arrowRightIcon = {
  type: "dev",
  // label: "Arrow right",
  value: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z"/></svg>`,
};

export const testDevices: Devices = [
  {
    id: "b1",
    w: 100,
    h: 100,
    breakpoint: 150,
  },
  {
    id: "b2",
    w: 200,
    h: 200,
    breakpoint: 250,
  },
  {
    id: "b3",
    w: 300,
    h: 300,
    breakpoint: 350,
  },
  {
    id: "b4",
    w: 400,
    h: 400,
    breakpoint: 450,
  },
  {
    id: "b5",
    w: 500,
    h: 500,
    breakpoint: null,
  },
];

const openComponentPicker: EditorContextType["actions"]["openComponentPicker"] =
  () => {
    return new Promise(() => {});
  };

export const testEditorContext: EditorContextType = {
  isFullScreen: false,
  definitions: {
    components: [],
  },
  breakpointIndex: "b1",
  setBreakpointIndex: () => null,
  devices: testDevices,
  types: {},
  contextParams: {
    locale: "en",
  },
  theme: {
    colors: {},
    fonts: {},
    space: {},
    numberOfItemsInRow: {},
    aspectRatios: {},
    icons: {},
    containerWidths: {},
    boxShadows: {},
  },
  mainBreakpointIndex: "b4",
  focussedField: [],
  setFocussedField: () => {},
  form: {
    values: {},
    change(path: string, value: any) {
      if (path === "") {
        this.values = value;
        return;
      }

      dotNotationSet(this.values, path, value);
    },
  },
  actions: {
    notify: () => {},
    openComponentPicker,
    insertItem: () => {},
    runChange: () => {},
    duplicateItems: () => {},
    moveItems: () => {},
    removeItems: () => {},
    replaceItems: () => {},
    pasteItems: () => {},
    logSelectedItems: () => {},
  },
  locales: [
    {
      code: "en",
      isDefault: true,
    },
    {
      code: "pl",
      fallback: "en",
    },
  ],
  rootComponent: {
    id: "",
    schema: [],
  },
};

beforeEach(() => {
  jest.restoreAllMocks();
});

/**
 * IMPORTANT!!!
 *
 * There's a heavy coupling between getTinaFields and builds.
 *
 * That's why we introduce new compound type that combines those two functions and we test both at the same time!
 */
function build<T extends SchemaProp>(
  schemaProp: T,
  editorContext: EditorContextType,
  value?: any
) {
  return {
    def: getSchemaDefinition<T>(schemaProp, editorContext) as any, // temporarily as any
    field: getTinaField(schemaProp, editorContext, value),
  };
}

const coreComponents: InternalRenderableComponentDefinition[] = [
  {
    id: "$TestSection",
    type: ["card"],
    editing: ({ values }) => {
      return {
        components: {
          Card2: {
            direction: values.isHorizontal ? "horizontal" : "vertical", // just to see if config is passed properly, doesn't make sense,
            selectable: false,
          },
          Cards: values.Cards.map(() => ({
            direction: values.isHorizontal ? "horizontal" : "vertical",
          })),
          CardsWithItemFields: values.CardsWithItemFields.map(() => ({
            direction: values.isHorizontal ? "horizontal" : "vertical",
          })),
        },
      };
    },
    styles: ({ values }) => {
      // Some extra checks for resop
      expect(isTrulyResponsiveValue(values.isHorizontal)).toBe(false);
      expect(isTrulyResponsiveValue(values.margin)).toBe(false);

      values.CardsWithItemFields.forEach((card: any) => {
        expect(isTrulyResponsiveValue(card.itemProp3Responsive)).toBe(false);
      });

      return {
        styled: {
          Item1: {
            display: "flex",
            flexDirection: values.isHorizontal ? "row" : "column",
            margin: values.margin,
          },
        },
        components: {
          Card2: {
            contextProp: "card2",
          },
          Cards: {
            itemProps: values.Cards.map((x: any) => ({
              contextProp: values.isHorizontal ? "h" : "v",
            })),
          },
          CardsWithItemFields: {
            itemProps: values.CardsWithItemFields.map((x: any) => ({
              something: {
                someProp: x.itemProp3Responsive,
              },
            })),
          },
        },
        props: {
          calculatedValue: `${values.x}${values.y}`,
          isHorizontal: values.isHorizontal,
          margin: values.margin,
        },
      };
    },
    schema: [
      {
        prop: "margin",
        type: "space",
      },
      {
        prop: "isHorizontal",
        type: "boolean",
      },
      {
        prop: "Card1",
        type: "component",
        accepts: ["card"],
      },
      {
        prop: "card1Width", // property shown in Card!
        type: "space",
      },
      {
        prop: "Card2",
        type: "component",
        accepts: ["card"],
      },
      {
        prop: "Card3Fixed",
        type: "component",
        accepts: ["$EmptyComponent"],
        required: true,
      },
      {
        prop: "Cards",
        type: "component-collection",
        accepts: ["card"],
      },
      {
        prop: "CardsLocalised",
        type: "component-collection-localised",
        accepts: ["card"],
      },
      {
        prop: "testAction",
        type: "component",
        accepts: ["action"],
      },
      {
        prop: "x",
        type: "select",
        responsive: true,
        params: {
          options: ["a", "b", "c", "x", "y", "z"],
        },
      },
      {
        prop: "y",
        type: "select",
        responsive: true,
        params: {
          options: ["a", "b", "c", "x", "y", "z"],
        },
      },
      {
        prop: "CardsWithItemFields",
        type: "component-collection",
        accepts: ["card"],
        itemFields: [
          {
            prop: "itemProp1",
            type: "select",
            params: {
              options: ["a", "b", "c", "x", "y", "z"],
            },
          },
          {
            prop: "itemProp2",
            type: "select",
            params: {
              options: ["a", "b", "c", "x", "y", "z"],
            },
          },
          {
            prop: "itemProp3Responsive",
            type: "select",
            responsive: true,
            params: {
              options: ["a", "b", "c", "x", "y", "z"],
            },
          },
        ],
      },
    ],
  },
  {
    id: "$TestCard",
    type: ["card"],
    styles: ({ values, params }) => {
      const props: Record<string, any> = {
        cardBool: values.cardBool,
      };

      if (params.contextProp) {
        props.contextProp = params.contextProp;
      }

      return {
        styled: {
          Box1: {
            display: "flex",
            padding: values.cardBool ? values.cardSpace : 100,
          },
        },
        props,
      };
    },
    schema: [
      {
        prop: "cardSpace",
        type: "space",
      },
      {
        prop: "cardBool",
        type: "boolean",
      },
    ],
  },
  {
    id: "$CardWithResponsiveToken",
    type: ["card"],
    schema: [
      {
        prop: "color",
        type: "color",
      },
    ],
    auto: ({ values }) => {
      const newValues = {
        ...values,
      };

      if (isTrulyResponsiveValue(values.color)) {
        editorContext.devices.forEach((device) => {
          if (values.color[device.id] === undefined) {
            newValues.color[device.id] = { value: "red" };
          }
        });
      }

      return newValues;
    },
  },
  {
    id: "$EmptyComponent",
    type: ["card"],
    styles: () => {
      return {
        styled: {
          Box1: {
            display: "block",
          },
        },
      };
    },
    schema: [
      {
        prop: "Card",
        type: "component",
        accepts: ["$EmptyComponent2"],
        required: true,
      },
    ],
  },
  {
    id: "$EmptyComponent2",
    type: ["card"],
    styles: () => {
      return {
        styled: {
          Box1: {
            display: "block",
          },
        },
      };
    },
    schema: [],
  },
  {
    id: "$ComponentWithAction",
    type: ["card"],
    schema: [
      {
        prop: "action",
        type: "component",
        accepts: ["action"],
        visible: true,
      },
    ],
  },
];

const testCompilationContext = createCompilationContext(
  {
    backend: new EasyblocksBackend({ accessToken: "" }),
    locales: [
      {
        code: "en",
        isDefault: true,
      },
      {
        code: "pl",
        fallback: "en",
      },
    ],
    types: {
      text: {
        type: "external",
        widgets: [
          {
            id: "@easyblocks/document-data",
            label: "Document data",
          },
        ],
      },
      product: {
        type: "external",
        widgets: [{ id: "product", label: "Product" }],
      },
    },
    components: [
      ...coreComponents,
      {
        id: "$CustomAction",
        type: ["action"],
        schema: [
          {
            prop: "someText",
            type: "text",
          },
          {
            prop: "someSelect",
            type: "select",
            params: {
              options: ["one", "two", "three"],
            },
            defaultValue: "two",
          },
        ],
      },
      {
        id: "MyButton",
        type: ["button"],
        schema: [
          {
            prop: "label",
            type: "text",
          },
          {
            prop: "isLight",
            type: "boolean",
          },
        ],
      },

      {
        id: "MyProductCard",
        type: ["card"],
        schema: [
          {
            prop: "product",
            type: "product",
          },
          {
            prop: "isLight",
            type: "boolean",
          },
          {
            prop: "number",
            type: "select",
            params: {
              options: ["one", "two", "three", "four", "five"],
            },
          },
          {
            prop: "test",
            type: "select",
            params: {
              options: ["test1", "test2", "test3"],
            },
            defaultValue: "test3",
          },
        ],
      },
    ],
  },
  { locale: "en" },
  "$TestSection"
);

const editorContext: EditorContextType = {
  ...testEditorContext,
  ...testCompilationContext,
  mainBreakpointIndex: "b4",
  isEditing: true,
  devices: [
    {
      id: "b1",
      w: 100,
      h: 100,
      breakpoint: 150,
    },
    {
      id: "b2",
      w: 200,
      h: 200,
      breakpoint: 250,
    },
    {
      id: "b3",
      w: 300,
      h: 300,
      breakpoint: 350,
    },
    {
      id: "b4",
      w: 400,
      h: 400,
      breakpoint: 450,
    },
    {
      id: "b5",
      w: 500,
      h: 500,
      breakpoint: null,
    },
  ],

  theme: {
    colors: {
      devRed: {
        type: "dev",
        value: "red",
      },
      devBlue: {
        type: "dev",
        value: "blue",
        mapTo: "$light",
      },
      devResponsive: {
        type: "dev",
        value: {
          $res: true,
          b1: "white",
          b3: "red",
        },
      },
    },
    icons: {},
    fonts: {
      devBody: {
        type: "dev",
        value: {
          fontFamily: "serif",
          fontSize: 12,
        },
      },
      devHeading: {
        type: "dev",
        value: {
          fontFamily: "serif",
          fontSize: 30,
        },
        mapTo: ["$heading1"],
      },
      devResponsive: {
        type: "dev",
        value: {
          $res: true,
          b1: {
            fontFamily: "serif",
            fontSize: 30,
          },
          b3: {
            fontFamily: "serif",
            fontSize: 50,
          },
        },
      },
    },
    space: {
      devSmall: {
        type: "dev",
        value: "10px",
      },
      devLarge: {
        type: "dev",
        value: "200px",
      },
      devResponsive: {
        type: "dev",
        value: {
          $res: true,
          b1: "100px",
          b3: "300px",
        },
      },

      s0: {
        type: "dev",
        value: "0px",
      },
      s1: {
        type: "dev",
        value: "1px",
      },
      s2: {
        type: "dev",
        value: "2px",
      },
      s3: {
        type: "dev",
        value: "4px",
      },
      s4: {
        type: "dev",
        value: "6px",
      },
      s5: {
        type: "dev",
        value: "8px",
      },
      s6: {
        type: "dev",
        value: "12px",
      },
      s7: {
        type: "dev",
        value: "16px",
      },
      s8: {
        type: "dev",
        value: "24px",
      },
      s9: {
        type: "dev",
        value: "32px",
      },
      s10: {
        type: "dev",
        value: "48px",
      },
      s11: {
        type: "dev",
        value: "64px",
      },
      s12: {
        type: "dev",
        value: "96px",
      },
      s13: {
        type: "dev",
        value: "128px",
      },
      s14: {
        type: "dev",
        value: "160px",
      },
    },
    numberOfItemsInRow: {},
    aspectRatios: {},
    containerWidths: {},
    boxShadows: {},
  },
};

type Values = {
  normalized: any;
  field: any;
  compiled: any;
};

// default responsive
function defres(x: any) {
  return {
    $res: true,
    b4: x,
  };
}

function defresFilled(x: any) {
  return {
    $res: true,
    b1: x,
    b2: x,
    b3: x,
    b4: x,
    b5: x,
  };
}

/**
 * This matcher is here on purpose. If we have space, then we really want to test with toMatchObject, because of linearization.
 */
function expectToMatchObjectOrEqual(
  input: any,
  output: any,
  useMatchObject?: boolean
) {
  if (typeof input === "object" && useMatchObject) {
    expect(input).toMatchObject(output);
  } else {
    expect(input).toEqual(output);
  }
}

function superTestWithoutCompileIntcompileInternal(
  { field, def }: ReturnType<typeof build>,
  rawValue: any,
  expectedNormalizedValue: any,
  expectedTinaFieldValue: any,
  useMatchObject?: boolean
) {
  // normalize works
  const normalizedValue = def.normalize(rawValue);

  expectToMatchObjectOrEqual(
    normalizedValue,
    expectedNormalizedValue,
    useMatchObject
  );
  // format works and tina field value is correct

  // @ts-ignore
  const tinaFieldValue = field.format
    ? field.format(normalizedValue)
    : normalizedValue;
  expectToMatchObjectOrEqual(
    tinaFieldValue,
    expectedTinaFieldValue,
    useMatchObject
  );

  // format + parse should always return properly normalized value

  // @ts-ignore
  const parsedTinaFieldValue = field.parse
    ? field.parse(tinaFieldValue)
    : tinaFieldValue;
  expectToMatchObjectOrEqual(
    parsedTinaFieldValue,
    expectedNormalizedValue,
    useMatchObject
  );

  // expect(parsed).toEqual(normalizedValue);
}

function superTest(
  { field, def }: ReturnType<typeof build>,
  rawValue: any,
  expectedNormalizedValue: any,
  expectedTinaFieldValue: any,
  expectedCompiledValue: any,
  useMatchObject?: boolean
) {
  superTestWithoutCompileIntcompileInternal(
    { field, def },
    rawValue,
    expectedNormalizedValue,
    expectedTinaFieldValue,
    useMatchObject
  );

  // compile works -> compile is always run on normalized content!!!
  expectToMatchObjectOrEqual(
    def.compile(
      responsiveValueFill(
        def.normalize(rawValue),
        editorContext.devices,
        getDevicesWidths(editorContext.devices)
      )
    ),
    expectedCompiledValue,
    useMatchObject
  );
}

// compiled, field and normalized are the same
function simpleTest(
  { field, def }: ReturnType<typeof build>,
  rawValue: any,
  outputValue: any,
  useMatchObject?: boolean
) {
  return superTest(
    { field, def },
    rawValue,
    outputValue,
    outputValue,
    responsiveValueFill(
      outputValue,
      editorContext.devices,
      getDevicesWidths(editorContext.devices)
    ),
    useMatchObject
  );
}

function localTextValue(id: string, value: Record<string, string>) {
  return {
    id,
    value,
    widgetId: "@easyblocks/local-text",
  };
}

describe.skip("text", () => {
  test("behaves correctly with correct default value", () => {
    const x = build(
      {
        prop: "blabla",
        type: "text",
        defaultValue: "Hello world",
      },
      editorContext,
      localTextValue("local.123", { en: "test" })
    );

    expect(x.field.label).toBe("blabla");
    expect(x.field.name).toBe("blabla");
    expect(x.field.component).toBe("text");

    const localValue = localTextValue("local.123", { en: "test" });

    superTest(x, localValue, localValue, localValue, {
      id: "local.123",
      value: "test",
      widgetId: "@easyblocks/local-text",
    });

    const externalValue = {
      id: "123",
      value: { en: "test" },
      widgetId: "text",
    };

    superTest(x, externalValue, externalValue, externalValue, {
      id: "123",
      value: "test",
      widgetId: "text",
    });
  });

  test("returns empty string when value for given locale is not defined and is editing", () => {
    const textSchemaProp = build(
      {
        type: "text",
        prop: "test",
      },
      editorContext,
      {
        id: "local.123",
        value: {
          pl: "test",
        },
        widgetId: "@easyblocks/local-text",
      }
    );

    expect(
      textSchemaProp.def.compile({
        id: "local.123",
        value: {
          pl: "test",
        },
      })
    ).toEqual({
      id: "local.123",
      value: "",
    });
  });

  test("throws an error when value for given locale is not defined and is not editing", () => {
    const testContext: EditorContextType = {
      ...editorContext,
    };

    delete testContext.form;

    const textSchemaProp = build(
      {
        type: "text",
        prop: "test",
      },
      testContext
    );

    expect(() =>
      textSchemaProp.def.compile({
        id: "local.123",
        value: {
          de: "test",
          pl: "test",
        },
      })
    ).toThrowError(
      `The content passed to ShopstoryClient is not available in a locale: "en" (available locales: "de","pl"). Please make sure to provide a valid locale code.`
    );
  });
});

test("[number] behaves correctly with correct default value", () => {
  const x = build(
    {
      prop: "blabla",
      type: "number",
      defaultValue: 10,
    },
    editorContext
  );

  expect(x.field.label).toBe("blabla");
  expect(x.field.name).toBe("blabla");
  expect(x.field.component).toBe("number");

  simpleTest(x, null, 10);
  simpleTest(x, undefined, 10);
  simpleTest(x, "xxx", 10);
  simpleTest(x, 200, 200);
});

test("[boolean] behaves correctly with correct default value", () => {
  const x = build(
    {
      prop: "blabla",
      type: "boolean",
      defaultValue: true,
    },
    editorContext
  );

  expect(x.field.label).toBe("blabla");
  expect(x.field.name).toBe("blabla");
  expect(x.field.component).toBe("toggle");

  simpleTest(x, null, true);
  simpleTest(x, undefined, true);
  simpleTest(x, "xxx", true);
  simpleTest(x, false, false);
});

describe.skip("boolean responsive field", () => {
  describe.skip("with correct default value", () => {
    const defaultTrueCompiled: ResponsiveValue<boolean> = {
      b4: true,
      $res: true,
    };

    const x = build(
      {
        prop: "blabla",
        type: "boolean",
        responsive: true,
        defaultValue: true,
      },
      editorContext
    );

    expect(x.field.label).toBe("blabla");
    expect(x.field.name).toBe("blabla");
    expect(x.field.component).toBe("responsive2");
    expect(x.field.subComponent).toBe("toggle");

    // incorrect values

    test("if incorrect scalar input, we default to default value set for main breakpoint", () => {
      simpleTest(x, null, defaultTrueCompiled);
      simpleTest(x, undefined, defaultTrueCompiled);
      simpleTest(x, "xxx", defaultTrueCompiled);
      simpleTest(x, ["xxx", null, true], defaultTrueCompiled);
    });

    test("if incorrect responsive input, bad breakpoints are reset", () => {
      simpleTest(x, { b1: "xxx", b3: "yyy", $res: true }, defaultTrueCompiled);
      simpleTest(
        x,
        { b4: true, b3: "yyy", $res: true },
        { $res: true, b4: true }
      );
      simpleTest(
        x,
        { b4: false, b3: "yyy", $res: true },
        { $res: true, b4: false }
      );
    });

    test("if correct scalar input, then value is set for main breakpoint", () => {
      simpleTest(x, false, { $res: true, b4: false });
      simpleTest(x, true, { $res: true, b4: true });
    });

    test("if correct responsive input and main breakpoint not set, it's gonna be set", () => {
      simpleTest(
        x,
        { b3: true, $res: true },
        { b3: true, b4: true, $res: true }
      );
    });

    test("if correct responsive input and main breakpoint set, then it's OK", () => {
      simpleTest(
        x,
        { b3: true, b4: false, $res: true },
        { b3: true, b4: false, $res: true }
      );
    });
  });
});

const STRING_OPTIONS = ["one", "two", "three"];
const OBJECT_OPTIONS = [
  { value: "one", label: "1" },
  { value: "two", label: "2" },
  { value: "three", label: "3" },
];

function testSelect(type: "radio-group" | "select", isResponsive: boolean) {
  let tinaComponent: string = type;
  let subComponent: string | undefined = undefined;

  const defaultValue = (val: string) => {
    if (isResponsive) {
      return { $res: true, b4: val };
    } else {
      return val;
    }
  };

  if (isResponsive) {
    tinaComponent = "responsive2";
    subComponent = type;
  }

  test(`[${type}] throws when empty array`, () => {
    const call = () => {
      build(
        {
          prop: "blabla",
          type: type,
          responsive: isResponsive,
          params: {
            options: [],
          },
        },
        editorContext
      );
    };

    expect(call).toThrow();
  });

  test(`[${type}] empty defaultValue + options as strings`, () => {
    const x = build(
      {
        prop: "blabla",
        type: type,
        responsive: isResponsive,
        params: {
          options: STRING_OPTIONS,
        },
      },
      editorContext
    );

    expect(x.field.label).toBe("blabla");
    expect(x.field.name).toBe("blabla");
    expect(x.field.component).toBe(tinaComponent);
    expect(x.field.options).toMatchObject(STRING_OPTIONS);

    simpleTest(x, null, defaultValue("one"));
    simpleTest(x, undefined, defaultValue("one"));
    simpleTest(x, "xxx", defaultValue("one"));
    simpleTest(x, "two", defaultValue("two"));
  });

  test(`[${type}] empty defaultValue + options as objects`, () => {
    const x = build(
      {
        prop: "blabla",
        type: type,
        responsive: isResponsive,
        params: {
          options: OBJECT_OPTIONS,
        },
      },
      editorContext
    );

    expect(x.field.label).toBe("blabla");
    expect(x.field.name).toBe("blabla");
    expect(x.field.component).toBe(tinaComponent);
    expect(x.field.options).toMatchObject(OBJECT_OPTIONS);

    simpleTest(x, null, defaultValue("one"));
    simpleTest(x, undefined, defaultValue("one"));
    simpleTest(x, "xxx", defaultValue("one"));
    simpleTest(x, "two", defaultValue("two"));
  });

  test(`[${type}] correct defaultValue + options as strings`, () => {
    const x = build(
      {
        prop: "blabla",
        type: type,
        responsive: isResponsive,
        params: {
          options: STRING_OPTIONS,
        },
        defaultValue: "two",
      },
      editorContext
    );

    simpleTest(x, null, defaultValue("two"));
  });

  test(`[${type}] correct defaultValue + options as objects`, () => {
    const x = build(
      {
        prop: "blabla",
        type: type,
        responsive: isResponsive,
        params: {
          options: OBJECT_OPTIONS,
        },
        defaultValue: "two",
      },
      editorContext
    );

    simpleTest(x, null, defaultValue("two"));
  });

  test(`[${type}] incorrect defaultValue + options as strings`, () => {
    const x = build(
      {
        prop: "blabla",
        type: type,
        responsive: isResponsive,
        params: {
          options: STRING_OPTIONS,
        },
        defaultValue: "xxx",
      },
      editorContext
    );

    simpleTest(x, null, defaultValue("one"));
  });

  test(`[${type}] incorrect defaultValue + options as objects`, () => {
    const x = build(
      {
        prop: "blabla",
        type: type,
        responsive: isResponsive,
        params: {
          options: OBJECT_OPTIONS,
        },
        defaultValue: "xxx",
      },
      editorContext
    );

    simpleTest(x, null, defaultValue("one"));
  });

  if (isResponsive) {
    test(`[${type}] responsive values`, () => {
      const x = build(
        {
          prop: "blabla",
          type: type,
          responsive: isResponsive,
          params: {
            options: STRING_OPTIONS,
          },
        },
        editorContext
      );

      // incorrect scalars
      simpleTest(x, null, defaultValue("one"));
      simpleTest(x, undefined, defaultValue("one"));
      simpleTest(x, "xxxx", defaultValue("one"));

      // incorrect breakpoints in responsive
      simpleTest(x, { b1: "xxx", b4: "two", $res: true }, defaultValue("two"));

      // incorrect breakpoints, main breakpoint always set to default
      simpleTest(x, { b1: "xxx", b3: null, $res: true }, defaultValue("one"));

      // correct scalar
      simpleTest(x, "three", defaultValue("three"));

      // correct breakpoints without main
      simpleTest(
        x,
        { b1: "two", b3: "three", $res: true },
        { b1: "two", b3: "three", b4: "one", $res: true }
      );

      // correct
      simpleTest(
        x,
        { b1: "two", b3: "one", b4: "three", $res: true },
        {
          b1: "two",
          b3: "one",
          b4: "three",
          $res: true,
        }
      );
    });
  }
}

testSelect("select", false);
testSelect("radio-group", false);

testSelect("select", true);
testSelect("radio-group", true);

/**
 * Color, Font, Space
 *
 * !!! important !!!
 *
 * For now we use "Select" widget which means that we only can show references.
 *
 * This means that the value like { value: "sth" } which is NOT a ref is always treated as INCORRECT VALUE.
 *
 * What if reference is missing? We set first available reference from the list.
 *
 * FIXME: It will break masters!!! If master template is presented with the reference to mapping that doesn't exist it
 * will CHANGE the reference. We obviously don't want that. FIXME: Masters actually should have fixed set of variables
 * always
 *
 * In the future we don't want to change references. In case of incorrect reference:
 * - we just show the widget in "value mode" (we can say "incorrect reference" or sth).
 * - if user doesn't make any change, ref stays. If ref shows up later, then bam, it updates.
 * - if user does any change, then we just forget about reference because well, it chagned. It's either new ref, or
 * plain value.
 *
 * Default values for now don't make much sense, the field doesn't know what kind of refs are there.
 * If we had "CANONICAL REFS", which means that refs that ALWAYS exist, then it would make sense.
 * Actually we SHOULD have them. Like black, white, transparent (unchangable, but overrideable).
 * Or like s0 -> s15 in space.
 * In fonts? Don't think we need them. But we could have #heading, #body?
 *
 * They can be set as "dev" (set from external).
 *
 * In this case default values will make sense even as refs. Just for now.
 *
 */

function testThemeValue(
  x: ReturnType<typeof build>,
  defaultValue: any, // Correct normalized default value
  globalDefaultValue: any,
  refVal1: any, // { value: "red", ref: "devRed"}
  refVal2: any, // { value: "blue", ref: "devBlue" }
  refVal3: any, // { value: "white", ref: "white" }
  refValResponsive: any, // like { value: responsiveVal, ref: "devResponsive" }
  inCorrectScalarValue: any,
  correctScalarValue: any, // like "#fafafa
  mapping?: {
    master: any;
    mapped: any;
    unmappedMaster: any;
  },
  useMatchObject?: true
) {
  // null -> default

  test("null -> default value", () => {
    superTest(
      x,
      null,
      defres(defaultValue),
      defres(defaultValue),
      defresFilled(defaultValue.value),
      useMatchObject
    );
  });

  test("undefined -> default", () => {
    // undefined -> default
    superTest(
      x,
      undefined,
      defres(defaultValue),
      defres(defaultValue),
      defresFilled(defaultValue.value),
      useMatchObject
    );
  });

  test("incorrect scalar value -> default", () => {
    superTest(
      x,
      inCorrectScalarValue,
      defres(defaultValue),
      defres(defaultValue),
      defresFilled(defaultValue.value),
      useMatchObject
    );
  });

  test("string that is correct token name -> the token represented by this string", () => {
    superTest(
      x,
      refVal1.ref,
      defres(refVal1),
      defres(refVal1),
      defresFilled(refVal1.value),
      useMatchObject
    );
  });

  test("correct scalar value that is NOT a string representing correct token -> correct scalar value", () => {
    superTest(
      x,
      correctScalarValue,
      defres({
        value: correctScalarValue,
      }),
      defres({
        value: correctScalarValue,
      }),
      defresFilled(correctScalarValue),
      useMatchObject
    );
  });

  test("non-existent ref with incorrect scalar value -> non-existent ref with correct scalar value (global default)", () => {
    superTest(
      x,
      {
        value: inCorrectScalarValue,
        ref: "nonExistentRef",
      },
      defres({
        value: globalDefaultValue.value,
        ref: "nonExistentRef",
      }),
      defres({
        value: globalDefaultValue.value,
        ref: "nonExistentRef",
      }),
      defresFilled(globalDefaultValue.value),
      useMatchObject
    );
  });

  test("non-existent ref with correct scalar value -> non-existent ref with correct scalar value", () => {
    superTest(
      x,
      {
        value: correctScalarValue,
        ref: "nonExistentRef",
      },
      defres({
        value: correctScalarValue,
        ref: "nonExistentRef",
      }),
      defres({
        value: correctScalarValue,
        ref: "nonExistentRef",
      }),
      defresFilled(correctScalarValue),
      useMatchObject
    );
  });

  test("no ref, incorrect value", () => {
    superTest(
      x,
      { value: inCorrectScalarValue },
      defres(defaultValue),
      defres(defaultValue),
      defresFilled(defaultValue.value),
      useMatchObject
    );
  });

  test("no ref, correct value", () => {
    superTest(
      x,
      { value: correctScalarValue },
      defres({ value: correctScalarValue }),
      defres({ value: correctScalarValue }),
      defresFilled(correctScalarValue),
      useMatchObject
    );
  });

  test("incorrect breakpoint are reset", () => {
    superTest(
      x,
      { b1: refVal1, b3: inCorrectScalarValue, $res: true },
      {
        b1: refVal1,
        b4: defaultValue,
        $res: true,
      },
      {
        b1: refVal1,
        b4: defaultValue,
        $res: true,
      },
      {
        b1: refVal1.value,
        b2: defaultValue.value,
        b3: defaultValue.value,
        b4: defaultValue.value,
        b5: defaultValue.value,
        $res: true,
      },
      useMatchObject
    );
  });

  test("correct scalar values", () => {
    superTest(
      x,
      refVal2,
      defres(refVal2),
      defres(refVal2),
      defresFilled(refVal2.value),
      useMatchObject
    );
    superTest(
      x,
      refVal3,
      defres(refVal3),
      defres(refVal3),
      defresFilled(refVal3.value),
      useMatchObject
    );
  });

  test("correcting value for ref!!!", () => {
    superTest(
      x,
      { value: inCorrectScalarValue, ref: refVal2.ref },
      defres(refVal2),
      defres(refVal2),
      defresFilled(refVal2.value),
      useMatchObject
    );
  });

  test("correct responsive value + filling main breakpoint", () => {
    superTest(
      x,
      { b1: refVal1, b3: refVal3, $res: true },
      { b1: refVal1, b3: refVal3, b4: defaultValue, $res: true },
      { b1: refVal1, b3: refVal3, b4: defaultValue, $res: true },
      {
        b1: refVal1.value,
        b2: refVal3.value,
        b3: refVal3.value,
        b4: defaultValue.value,
        b5: defaultValue.value,
        $res: true,
      },
      useMatchObject
    );
  });

  test("correcting responsive", () => {
    superTest(
      x,
      {
        b1: { ...refVal1, value: inCorrectScalarValue },
        b4: refVal3,
        $res: true,
      },
      { b1: refVal1, b4: refVal3, $res: true },
      { b1: refVal1, b4: refVal3, $res: true },
      {
        b1: refVal1.value,
        b2: refVal3.value,
        b3: refVal3.value,
        b4: refVal3.value,
        b5: refVal3.value,
        $res: true,
      },
      useMatchObject
    );
  });

  /**
   * Nested responsive values!
   *
   * responsive values (devResponsive) have always b1 and b3 defined
   *
   * Maybe we could test more complex cases for internal flatten?:
   * 1. Setting responsive value with X breakpoint unset for X breakpoint, etc.
   *
   * But it is super annoying to test with linearity of space. So let's leave this right now as it is.
   *
   */
  test("nested responsive value as not main breakpoint (main will get default) + correcting", () => {
    superTest(
      x,
      {
        $res: true,
        b3: { ...refValResponsive, value: inCorrectScalarValue },
      },
      {
        $res: true,
        b3: refValResponsive,
        b4: defaultValue,
      },
      {
        $res: true,
        b3: refValResponsive,
        b4: defaultValue,
      },
      {
        $res: true,
        b1: refValResponsive.value.b1,
        b2: refValResponsive.value.b3,
        b3: refValResponsive.value.b3,
        b4: defaultValue.value,
        b5: defaultValue.value,
      },
      useMatchObject
    );
  });

  /**
   * Mapping
   */
  if (mapping) {
    test("mapping of master tokens works", () => {
      superTest(
        x,
        {
          $res: true,
          b4: mapping.master,
        },
        {
          $res: true,
          b4: mapping.mapped,
        },
        {
          $res: true,
          b4: mapping.mapped,
        },
        {
          $res: true,
          b1: mapping.mapped.value,
          b2: mapping.mapped.value,
          b3: mapping.mapped.value,
          b4: mapping.mapped.value,
          b5: mapping.mapped.value,
        },
        useMatchObject
      );
    });

    test("tokens without mapping are untouched", () => {
      superTest(
        x,
        {
          $res: true,
          b4: mapping.unmappedMaster,
        },
        {
          $res: true,
          b4: mapping.unmappedMaster,
        },
        {
          $res: true,
          b4: mapping.unmappedMaster,
        },
        {
          $res: true,
          b1: mapping.unmappedMaster.value,
          b2: mapping.unmappedMaster.value,
          b3: mapping.unmappedMaster.value,
          b4: mapping.unmappedMaster.value,
          b5: mapping.unmappedMaster.value,
        },
        useMatchObject
      );
    });
  }
}

// global color default value
const globalColorDefault = {
  value: "#000000",
  ref: "$dark",
};

// example values
const colorRefVal1 = {
  value: editorContext.theme.colors.devRed.value,
  ref: "devRed",
};
const colorRefVal2 = {
  value: editorContext.theme.colors.devBlue.value,
  ref: "devBlue",
};
const colorRefVal3 = { value: "white", ref: "white" }; // built-in
const colorRefResponsiveVal1 = {
  value: editorContext.theme.colors.devResponsive.value,
  ref: "devResponsive",
};
const colorScalarVal1 = "#fafafa";
const colorIncorrectScalarVal = 123; // number is not correct color

const colorMappingFixture = {
  master: {
    ref: "$light",
    value: "#FFFFFF",
  },
  mapped: colorRefVal2,
  unmappedMaster: {
    ref: "$dark",
    value: "#000000",
  },
};

describe.skip("color field", () => {
  test("field is correct", () => {
    const x = build(
      {
        prop: "blabla",
        type: "color",
      },
      editorContext
    );

    expect(x.field.label).toBe("blabla");
    expect(x.field.name).toBe("blabla");
    expect(x.field.component).toBe("responsive2");
    expect(x.field.subComponent).toBe("token");

    const colors = {
      ...editorContext.theme.colors,
    };
    delete colors.$light; // $light is mapped

    expect(x.field.tokens).toMatchObject(colors);
  });

  describe.skip("with no default value", () => {
    const x = build(
      {
        prop: "blabla",
        type: "color",
      },
      editorContext
    );

    testThemeValue(
      x,
      globalColorDefault,
      globalColorDefault,
      colorRefVal1,
      colorRefVal2,
      colorRefVal3,
      colorRefResponsiveVal1,
      colorIncorrectScalarVal,
      colorScalarVal1,
      colorMappingFixture
    );
  });

  describe.skip("with default value as a (non-existent ref)", () => {
    const defaultValue = {
      value: "white",
      ref: "non-existent",
    };

    const x = build(
      {
        prop: "blabla",
        type: "color",
        defaultValue,
      },
      editorContext
    );

    testThemeValue(
      x,
      defaultValue,
      globalColorDefault,
      colorRefVal1,
      colorRefVal2,
      colorRefVal3,
      colorRefResponsiveVal1,
      colorIncorrectScalarVal,
      colorScalarVal1,
      colorMappingFixture
    );
  });

  describe.skip("with correct default value", () => {
    const defaultValue = {
      value: "white",
      ref: "white",
    };

    const x = build(
      {
        prop: "blabla",
        type: "color",
        defaultValue,
      },
      editorContext
    );

    testThemeValue(
      x,
      defaultValue,
      globalColorDefault,
      colorRefVal1,
      colorRefVal2,
      colorRefVal3,
      colorRefResponsiveVal1,
      colorIncorrectScalarVal,
      colorScalarVal1,
      colorMappingFixture
    );
  });
});

/**
 * SPACE
 */

const globalSpaceDefault = { value: "0px", widgetId: "@easyblocks/space" };

const spaceRefVal1 = {
  value: editorContext.theme.space.devSmall.value,
  ref: "devSmall",
};
const spaceRefVal2 = { value: "200px", ref: "devLarge" };
const spaceRefVal3 = { value: "1px", ref: "1" };
const spaceRefResponsiveVal1 = {
  value: editorContext.theme.space.devResponsive.value,
  ref: "devResponsive",
};
const spaceScalarVal1 = "300px";
const spaceIncorrectScalarVal = "xxx";

describe.skip("space field", () => {
  test("field is correct", () => {
    const x = build(
      {
        prop: "blabla",
        type: "space",
      },
      editorContext
    );

    expect(x.field.label).toBe("blabla");
    expect(x.field.name).toBe("blabla");
    expect(x.field.component).toBe("responsive2");
    expect(x.field.subComponent).toBe("token");
    expect(x.field.tokens).toMatchObject(editorContext.theme.space);
  });

  describe.skip("without default value", () => {
    const definition = build(
      {
        prop: "blabla",
        type: "space",
      },
      editorContext
    );

    testThemeValue(
      definition,
      globalSpaceDefault,
      globalSpaceDefault,
      spaceRefVal1,
      spaceRefVal2,
      spaceRefVal3,
      spaceRefResponsiveVal1,
      spaceIncorrectScalarVal,
      spaceScalarVal1,
      undefined,
      true
    );
  });

  describe.skip("with default value as non-existent ref", () => {
    const defaultValue = {
      value: "111px",
      ref: "non-existent",
    };

    const definition = build(
      {
        prop: "blabla",
        type: "space",
        defaultValue,
      },
      editorContext
    );

    testThemeValue(
      definition,
      defaultValue,
      globalSpaceDefault,
      spaceRefVal1,
      spaceRefVal2,
      spaceRefVal3,
      spaceRefResponsiveVal1,
      spaceIncorrectScalarVal,
      spaceScalarVal1,
      undefined,
      true
    );
  });

  describe.skip("with correct default value", () => {
    const defaultValue = {
      value: "1px",
      ref: "1",
    };
    const definition = build(
      {
        prop: "blabla",
        type: "space",
        defaultValue,
      },
      editorContext
    );

    testThemeValue(
      definition,
      defaultValue,
      globalSpaceDefault,
      spaceRefVal1,
      spaceRefVal2,
      spaceRefVal3,
      spaceRefResponsiveVal1,
      spaceIncorrectScalarVal,
      spaceScalarVal1,
      undefined,
      true
    );
  });

  test("respects custom values", () => {
    const x = build(
      {
        prop: "blabla",
        type: "space",
        // Value here is only for TS to stop crying
        defaultValue: { ref: "containerMargin.default", value: "0px" },
      },
      editorContext
    );

    const normalized = x.def.normalize({
      b1: { value: "16px" },
      b4: { value: "0px" },
      $res: true,
    });

    expect(normalized.b1.value).toBe("16px");
    expect(normalized.b4.value).toBe("0px");

    const compiled = x.def.compile(normalized);

    expect(compiled.b1).toBe("16px");
    expect(compiled.b4).toBe("0px");
  });

  test("if value is number and token is not existent then number should be transformed to px value (backward compatibility!)", () => {
    const x = build(
      {
        prop: "blabla",
        type: "space",
      },
      editorContext
    );

    const normalized = x.def.normalize({
      b1: { value: 16 },
      b4: { value: 10, ref: "non-existent" },
      $res: true,
    });

    expect(normalized.b1.value).toBe("16px");
    expect(normalized.b4.value).toBe("10px");
  });
});

/**
 * FONT
 */

const globalFontDefault = {
  value: { fontFamily: "sans-serif", fontSize: 16 },
  widgetId: "@easyblocks/font",
};

const fontRefVal1 = {
  value: editorContext.theme.fonts.devBody.value,
  ref: "devBody",
};
const fontRefVal2 = {
  value: editorContext.theme.fonts.devHeading.value,
  ref: "devHeading",
};
const fontRefVal3 = {
  value: {},
  ref: "$body",
};
const fontRefResponsiveVal1 = {
  value: editorContext.theme.fonts.devResponsive.value,
  ref: "devResponsive",
};

const fontScalarVal1 = editorContext.theme.fonts.devBody.value;
const fontIncorrectScalarVal = 1234;

const fontMappingFixture = {
  master: {
    ref: "$heading1",
    value: {},
  },
  mapped: fontRefVal2,
  unmappedMaster: fontRefVal3,
};

describe.skip("font field", () => {
  test("field is correct", () => {
    const x = build(
      {
        prop: "blabla",
        type: "font",
      },
      editorContext
    );

    expect(x.field.label).toBe("blabla");
    expect(x.field.name).toBe("blabla");
    expect(x.field.component).toBe("responsive2");
    expect(x.field.subComponent).toBe("token");

    const fonts = {
      ...editorContext.theme.fonts,
    };
    delete fonts.$heading1; // mapped token is gone from the list
    expect(x.field.tokens).toMatchObject(fonts);
  });

  describe.skip("without default value", () => {
    const definition = build(
      {
        prop: "blabla",
        type: "font",
      },
      editorContext
    );

    testThemeValue(
      definition,
      globalFontDefault,
      globalFontDefault,
      fontRefVal1,
      fontRefVal2,
      fontRefVal3,
      fontRefResponsiveVal1,
      fontIncorrectScalarVal,
      fontScalarVal1,
      fontMappingFixture
    );
  });
});

/**
 * ICON
 */
function testIconWithDefaultIconAsResult(x: ReturnType<typeof build>) {
  const DEFAULT_ICON = arrowLeftIcon.value;
  const DEFAULT_ICON_VALUE = {
    tokenId: "$sliderLeft",
    value: DEFAULT_ICON,
  };

  expect(x.field.label).toBe("blabla");
  expect(x.field.name).toBe("blabla");
  expect(x.field.component).toBe("token");

  // incorrect values
  test("incorrect values fall back to default value", () => {
    superTest(x, null, DEFAULT_ICON_VALUE, DEFAULT_ICON_VALUE, DEFAULT_ICON);
    superTest(
      x,
      undefined,
      DEFAULT_ICON_VALUE,
      DEFAULT_ICON_VALUE,
      DEFAULT_ICON
    );
    superTest(x, 123, DEFAULT_ICON_VALUE, DEFAULT_ICON_VALUE, DEFAULT_ICON);
    superTest(
      x,
      { value: 123 },
      DEFAULT_ICON_VALUE,
      DEFAULT_ICON_VALUE,
      DEFAULT_ICON
    );
  });

  // non-existent ref
  test("incorrect ref value outputs last saved value", () => {
    const nonExistentRef = { value: "<svg>cat</svg>", tokenId: "emptyRef" };
    superTest(
      x,
      nonExistentRef,
      { ...nonExistentRef, widgetId: "@easyblocks/icon" },
      { ...nonExistentRef, widgetId: "@easyblocks/icon" },
      "<svg>cat</svg>"
    );
  });

  // correct values + correcting
  test("correct non-ref values work correctly", () => {
    // TODO: for now SVGs are not kept in a theme

    const rawValue = "<svg>test</svg>";
    const value = {
      value: rawValue,
      widgetId: "@easyblocks/icon",
    };

    superTest(x, value, value, value, rawValue);
  });
}

describe.skip("Icon field", () => {
  describe.skip("no default value", () => {
    const definition = build(
      {
        prop: "blabla",
        type: "icon",
      },
      editorContext
    );

    testIconWithDefaultIconAsResult(definition);
  });

  describe.skip("incorrect default value", () => {
    const definition = build(
      // @ts-ignore Incorrect defaultValue type added on purpose
      {
        prop: "blabla",
        type: "icon",
        defaultValue: 111,
      },
      editorContext
    );

    testIconWithDefaultIconAsResult(definition);
  });

  describe.skip("correct default value", () => {
    const defaultValueRaw = arrowRightIcon.value;
    const defaultValue = {
      value: defaultValueRaw,
      widgetId: "@easyblocks/icon",
    };

    const x = build(
      {
        prop: "blabla",
        type: "icon",
        defaultValue,
      },
      editorContext
    );

    test("incorrect values falls back to default", () => {
      superTest(x, null, defaultValue, defaultValue, defaultValueRaw);
      superTest(x, undefined, defaultValue, defaultValue, defaultValueRaw);
      superTest(x, 123, defaultValue, defaultValue, defaultValueRaw);
      superTest(x, { value: 123 }, defaultValue, defaultValue, defaultValueRaw);
    });

    // non-existent ref
    test("incorrect ref value outputs last saved value", () => {
      const nonExistentRef = {
        value: "<svg>cat</svg>",
        tokenId: "emptyRef",
        widgetId: "@easyblocks/icon",
      };
      superTest(
        x,
        nonExistentRef,
        nonExistentRef,
        nonExistentRef,
        "<svg>cat</svg>"
      );
    });

    // correct values + correcting
    test("correct non-ref values work correctly", () => {
      const rawValue = "<svg>test</svg>";
      const value = {
        value: rawValue,
        widgetId: "@easyblocks/icon",
      };

      superTest(x, value, value, value, rawValue);
    });
  });
});

/**
 * PRODUCT
 */

function testExternalFieldAgainstDefault(
  x: any,
  defaultVal: UnresolvedResource
) {
  simpleTest(x, undefined, defaultVal);
  simpleTest(x, 100, defaultVal);
  simpleTest(x, {}, defaultVal);
  simpleTest(x, null, defaultVal);
  simpleTest(x, "someId", {
    id: null,
    widgetId: "product",
  });

  simpleTest(
    x,
    { id: "someId", widgetId: "product" },
    {
      id: "someId",
      widgetId: "product",
    }
  );
}

test("[external] behaves correctly with empty default", () => {
  const x = build(
    {
      prop: "blabla",
      type: "product",
    },
    editorContext,
    { id: null, widgetId: "product" }
  );

  expect(x.field.label).toBe("blabla");
  expect(x.field.name).toBe("blabla");
  expect(x.field.component).toBe("external");

  testExternalFieldAgainstDefault(x, { id: null, widgetId: "product" });
});

/**
 * IMAGE
 */

test.skip("[image] behaves correctly with empty default", () => {
  const x = build(
    {
      prop: "blabla",
      type: "image",
    },
    editorContext
  );

  expect(x.field.label).toBe("blabla");
  expect(x.field.name).toBe("blabla");
  expect(x.field.component).toBe("responsive2");
  expect(x.field.subComponent).toBe("external");
  expect(x.field.externalField.type).toBe("custom");

  /**
   * Important assumptions:
   * 1. Image can be of any type.
   * 2. We assume every image value to be correct. No matter if string, object, etc.
   * 3. null value is special. It's default for "empty image", but breakpoint is set.
   */

  // scalar incorrect value mapping to {} on mainBreakpoint: { id: undefined, value: undefined }}
  simpleTest(x, undefined, defres({ id: null }));
  simpleTest(x, 100, defres({ id: null }));
  simpleTest(x, {}, defres({ id: null }));
  simpleTest(x, { xxx: "xxx" }, defres({ id: null }));
  simpleTest(x, { id: undefined }, defres({ id: null }));
  simpleTest(x, { id: null }, defres({ id: null }));
  simpleTest(x, { id: 100 }, defres({ id: null }));

  // correct scalar value
  simpleTest(x, { id: "test" }, defres({ id: "test" }));

  // responsive value - all breakpoints incorrect
  simpleTest(x, { b2: 100, b4: "xxx", $res: true }, defres({ id: null }));

  // responsive value some breakpoints incorrect
  simpleTest(
    x,
    { b1: "www", b4: { id: "xxx" }, $res: true },
    { b4: { id: "xxx" }, $res: true }
  );

  // responsive value incorrect main breakpoint
  simpleTest(
    x,
    { b1: { id: "xxx" }, b4: 111, $res: true },
    { b1: { id: "xxx" }, b4: { id: null }, $res: true }
  );

  // responsive value all breakpoints correct, empty main
  simpleTest(
    x,
    { b1: { id: "test" }, b3: { id: "xxx" }, $res: true },
    { b1: { id: "test" }, b3: { id: "xxx" }, b4: { id: null }, $res: true }
  );
});

/**
 * VIDEO
 */

test.skip("[video] behaves correctly with empty default", () => {
  const x = build(
    {
      prop: "blabla",
      type: "video",
    },
    editorContext
  );

  expect(x.field.label).toBe("blabla");
  expect(x.field.name).toBe("blabla");
  expect(x.field.component).toBe("responsive2");
  expect(x.field.subComponent).toBe("external");
  expect(x.field.externalField.type).toBe("custom");

  /**
   * Every object is treated as correct image value. It's not normalized, it's just passed to the field. We fully
   * rely on the field. Therefore, sometimes when incorrect object is passed to the field, null will be rendered.
   */

  const defaultResponsive = defres({ id: null });

  simpleTest(x, undefined, defaultResponsive);
  simpleTest(x, 100, defaultResponsive);
  simpleTest(x, {}, defaultResponsive);
  simpleTest(x, { xxx: "xxx" }, defaultResponsive);
  simpleTest(x, { id: undefined }, defaultResponsive);
  simpleTest(x, defaultResponsive, defaultResponsive);
  simpleTest(x, { id: 100 }, defaultResponsive);

  // correct value
  simpleTest(x, { id: "test" }, defres({ id: "test" }));
});

/**
 *
 * COMPONENTS
 */

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      toBeTemplateId(): boolean;
    }
  }
}

expect.extend({
  toBeTemplateId(x) {
    return {
      pass: typeof x === "string" && x.length > 5,
      message: () => `${x} is not template ID`,
    };
  },
});

/**
 * TODO: Component tests should be cleaned up
 */

// This test is done in hurry just to test, all component tests should be claned up
describe.skip("component normalize with context props", () => {
  test("doesn't normalize context props if they're not there in input", () => {
    const normalized = normalize(
      {
        _component: "$TestCard",
      },
      editorContext
    );

    expect(normalized._component).toBe("$TestCard");
    expect(normalized.cardSpace).toBeDefined();
    expect(normalized.cardBool).toBeDefined();
    expect(normalized._itemProps).toBeUndefined();
  });

  test("properly normalize context props if given context", () => {
    const normalized = normalize(
      {
        _component: "$TestCard",
        _itemProps: {
          $TestSection: {
            CardsWithItemFields: {},
          },
        },
      },
      editorContext
    );

    expect(normalized._component).toBe("$TestCard");
    expect(normalized.cardSpace).toBeDefined();
    expect(normalized.cardBool).toBeDefined();
    expect(
      normalized._itemProps.$TestSection.CardsWithItemFields.itemProp1
    ).toBe("a");
    expect(
      normalized._itemProps.$TestSection.CardsWithItemFields.itemProp2
    ).toBe("a");
    expect(
      normalized._itemProps.$TestSection.CardsWithItemFields.itemProp3Responsive
    ).toEqual({ $res: true, b4: "a" });
  });

  test("compilation", () => {
    const card = {
      _component: "$TestCard",
      _itemProps: {
        $TestSection: {
          CardsWithItemFields: {
            itemProp1: "a",
            itemProp2: "b",
            itemProp3: {
              $res: true,
              b1: "a",
              b4: "b",
            },
          },
        },
      },
    };

    const normalized = normalize(
      {
        _component: "$TestSection",
        CardsWithItemFields: [card, card, card],
        CardsLocalised: {
          en: [{ _component: "$TestCard" }],
        },
      },
      editorContext
    );

    testEditorContext.form.change("", normalized);

    compileInternal(normalized, editorContext).compiled;

    /**
     * This test actually DOES something. By calling compile, internal compile tests will run that check whether itemProp3 is or is not (shouldn't be) responsive. It's about scalarizing item field values.
     */

    expect(true).toBe(true);
  });
});

describe.skip("[component field] no parent context", () => {
  const x = build(
    {
      prop: "blabla",
      type: "component",
      accepts: ["$EmptyComponent", "$TestCard"],
    },
    editorContext
  );

  test("field created correctly", () => {
    expect(x.field.label).toBe("blabla");
    expect(x.field.name).toBe("blabla");
    expect(x.field.component).toBe("ss-block");
  });

  test("incorrect values are interpreted correctly", () => {
    simpleTest(x, null, []);
    simpleTest(x, undefined, []);
    simpleTest(x, "xxx", []);
  });

  test("empty stays empty", () => {
    simpleTest(x, [], []);
  });

  test("empty stays empty", () => {
    simpleTest(x, [], []);
  });

  test("tina field value is produced properly", () => {
    superTestWithoutCompileIntcompileInternal(
      x,
      [{ _component: "$TestCard", _id: "abcd" }],
      [
        {
          _component: "$TestCard",
          _id: "abcd",
          cardBool: false,
          cardSpace: defres(globalSpaceDefault),
        },
      ],
      [
        {
          _component: "$TestCard",
          _id: "abcd",
          cardBool: false,
          cardSpace: defres(globalSpaceDefault),
        },
      ]
    );
    // TODO: compilations are tested below
  });
});

describe.skip("[component field required] no parent context", () => {
  const x = build(
    {
      prop: "blabla",
      type: "component",
      accepts: ["$TestCard"],
      required: true,
    },
    editorContext
  );

  const DEFAULT_VALUE = [
    {
      _component: "$TestCard",
      cardBool: false,
      cardSpace: defres(globalSpaceDefault),
    },
  ];

  test("incorrect values are interpreted correctly", () => {
    expect(x.def.normalize(null)).toMatchObject(DEFAULT_VALUE);
    expect(x.def.normalize(null)[0]._id).toBeTemplateId();

    expect(x.def.normalize(undefined)).toMatchObject(DEFAULT_VALUE);
    expect(x.def.normalize(undefined)[0]._id).toBeTemplateId();

    expect(x.def.normalize("xxx")).toMatchObject(DEFAULT_VALUE);
    expect(x.def.normalize("xxx")[0]._id).toBeTemplateId();
  });

  test("empty stays empty", () => {
    expect(x.def.normalize([])).toMatchObject(DEFAULT_VALUE);
    expect(x.def.normalize([])[0]._id).toBeTemplateId();
  });

  test("tina field value is produced properly", () => {
    expect(x.def.normalize([{ _component: "$TestCard" }])).toMatchObject(
      DEFAULT_VALUE
    );
    expect(
      x.def.normalize([{ _component: "$TestCard" }])[0]._id
    ).toBeTemplateId();
  });

  test("_id is preserved", () => {
    expect(
      x.def.normalize([{ _component: "$TestCard", _id: "abc" }])[0]._id
    ).toBe("abc");
  });
});

describe.skip("component field", () => {
  describe.skip("with parent context", () => {
    build(
      {
        prop: "Card1",
        type: "component",
        accepts: ["$EmptyComponent", "$TestCard", "MyButton"],
      },
      editorContext
    );
  });

  describe.skip("with custom component", () => {
    const normalized = normalize(
      {
        _component: "MyButton",
        label: {
          id: "local.123",
          value: {
            en: "Lorem ipsum",
          },
        },
      },
      editorContext
    );

    editorContext.form.change("", normalized);

    const ret = compileInternal(normalized, editorContext);

    const compiled = ret.compiled;

    test("has proper default values set", () => {
      expect(compiled.props.label.value).toBe("Lorem ipsum");
    });
  });
});

test("[component] works with empty subcomponents", () => {
  const ret = compileInternal(
    normalize(
      {
        _component: "$TestSection",
        _id: "abc",
        margin: { $res: true, b1: { value: "10px" }, b4: { value: "20px" } },
        isHorizontal: true,
        Card3Fixed: [
          {
            _component: "$EmptyComponent",
            Card: [
              {
                _component: "$EmptyComponent2",
              },
            ],
          },
        ],
        testAction: [
          {
            _component: "$CustomAction",
            someText: {
              id: "local.123",
              value: {
                en: "Lorem ipsum",
              },
              widgetId: "@easyblocks/local-text",
            },
          },
        ],
        x: { b1: "a", b4: "b", $res: true },
        y: { b1: "x", b2: "y", b4: "z", $res: true },
        CardsLocalised: {
          en: [
            {
              _component: "$TestCard",
            },
          ],
        },
      },
      editorContext
    ),
    editorContext
  );

  const item = ret.compiled;

  expect(item._component).toBe("$TestSection");
  expect(item._id).toBe("abc");

  expect(item.components.Card1).toMatchObject([]);
  expect(item.__editing!.components.Card1).toEqual({});

  expect(item.components.Card2).toMatchObject([]);

  // Test calculated value (resop works when running style function))
  expect(item.__editing!.components.Card2).toEqual({
    noInline: true,
  });

  expect(item.props.calculatedValue).toEqual({
    b1: "ax",
    b2: "by",
    b3: "bz",
    $res: true,
  });
  expect(item.props.isHorizontal).toBe(true);

  // default value for component fixed
  const card3Fixed: any = item.components.Card3Fixed[0];

  expect(card3Fixed._component).toBe("$EmptyComponent");
  expect(card3Fixed._id).toBeTemplateId();

  // default value for nested fixed component
  expect(card3Fixed.components.Card[0]._component).toBe("$EmptyComponent2");
  expect(card3Fixed.components.Card[0]._id).toBeTemplateId();
  expect(typeof card3Fixed.components.Card[0].styled.Box1).toBe("object");

  expect(item.components.Cards).toMatchObject([]);

  expect(item.__editing!.components.Cards).toMatchObject({});

  expect(typeof item.styled.Item1).toBe("object"); // for now we're not testing boxes themselves, they're gonna change

  // styles can't be included in output format (we could extend test to checking JSON serializability)

  // Action items are compiled

  expect(
    (item.components.testAction[0] as CompiledComponentConfig)._component
  ).toBe("$CustomAction");
  expect(
    (item.components.testAction[0] as CompiledComponentConfig)._id
  ).toBeTemplateId();
  expect(item.components.testAction[0].props.someText.value).toBe(
    "Lorem ipsum"
  );
  expect(item.components.testAction[0].props.someSelect).toBe("two");
});

function expectCorrectTestCard(input: any, output: any) {
  expect(output._component).toBe(input._component);
  expect(output.props.cardBool).toBe(input.cardBool);
  expect(output.props.cardSpace).toBe(input.cardSpace.value + "px");
  expect(typeof output.styled.Box1).toBe("object");
}

test("[component] works with nesting", () => {
  const card1 = {
    _component: "$TestCard",
    cardSpace: { value: 1, tokenId: "1" },
    cardBool: true,
  };

  const card2 = {
    _component: "$TestCard",
    cardSpace: { value: 2, tokenId: "2" },
    cardBool: false,
  };

  const card3 = {
    _component: "$TestCard",
    cardSpace: { value: 4, tokenId: "4" },
    cardBool: false,
  };

  const card4 = {
    _component: "$TestCard",
    cardSpace: { value: 6, tokenId: "6" },
    cardBool: true,
  };

  const card5 = {
    _component: "$TestCard",
    cardSpace: { value: 8, tokenId: "8" },
    cardBool: true,
  };

  const ret = compileInternal(
    normalize(
      {
        _component: "$TestSection",
        margin: {
          value: 1,
          tokenId: "1",
        },
        isHorizontal: false,
        Card1: [card1],
        Card2: [card2],
        Cards: [card3, card4, card5],
        Card3Fixed: [
          {
            _component: "$EmptyComponent",
            Card: [
              {
                _component: "$EmptyComponent2",
              },
            ],
          },
        ],
        CardsLocalised: {
          en: [{ _component: "$TestCard" }],
        },
      },
      editorContext
    ),
    editorContext
  );

  const item = ret.compiled;
  expect(item._component).toBe("$TestSection");

  expect(item.__editing!.components.Card1).toEqual({});
  expect(
    (item.components.Card1[0] as CompiledComponentConfig).__editing!.direction
  ).toBeUndefined();
  expect(
    (item.components.Card1[0] as CompiledComponentConfig).__editing!.noInline
  ).toBeUndefined();

  expect(item.__editing!.components.Card2).toMatchObject({
    noInline: true,
  });
  expect(
    (item.components.Card2[0] as CompiledComponentConfig).__editing!.direction
  ).toBe("vertical");
  expect(
    (item.components.Card2[0] as CompiledComponentConfig).__editing!.noInline
  ).toBe(true);

  expect(item.__editing!.components.Cards).toEqual({});
  expect(
    (item.components.Cards[0] as CompiledComponentConfig).__editing!.direction
  ).toBe("vertical");
  expect(
    (item.components.Cards[0] as CompiledComponentConfig).__editing!.noInline
  ).toBeUndefined();
  expect(
    (item.components.Cards[1] as CompiledComponentConfig).__editing!.direction
  ).toBe("vertical");
  expect(
    (item.components.Cards[1] as CompiledComponentConfig).__editing!.noInline
  ).toBeUndefined();
  expect(
    (item.components.Cards[2] as CompiledComponentConfig).__editing!.direction
  ).toBe("vertical");
  expect(
    (item.components.Cards[2] as CompiledComponentConfig).__editing!.noInline
  ).toBeUndefined();

  expect(item.props.isHorizontal).toBe(false);
  expect(item.props.margin).toEqual("1px");

  // expect(item.__editing!.components.Cards).toMatchObject({
  //   direction: "v",
  // });

  expect(typeof item.styled.Item1).toBe("object"); // for now we're not testing boxes themselves, they're gonna change

  // Test nesting
  expectCorrectTestCard(card1, item.components.Card1[0]);
  expect(item.components.Card1[0].props.contextProp).toBeUndefined();

  expectCorrectTestCard(card2, item.components.Card2[0]);
  expect(item.components.Card2[0].props.contextProp).toBe("card2");

  expectCorrectTestCard(card3, item.components.Cards[0]);
  expect(item.components.Cards[0].props.contextProp).toBe("v");

  expectCorrectTestCard(card4, item.components.Cards[1]);
  expect(item.components.Cards[1].props.contextProp).toBe("v");

  expectCorrectTestCard(card5, item.components.Cards[2]);
  expect(item.components.Cards[2].props.contextProp).toBe("v");
});

describe.skip("[component] with local refs", () => {
  const card1 = {
    _component: "MyProductCard",
    _id: "card1",
    product: { id: "shoes" },
    isLight: true,
    number: "one",
  };

  const card2 = {
    _component: "MyProductCard",
    _id: "card2",
    product: { id: "pants" },
    isLight: false,
    number: "two",
  };

  const card3 = {
    _id: "card3",
    _component: "MyProductCard$$$local.ref1",
    product: { id: "top" },
  };

  const card4 = {
    _id: "card4",
    _component: "MyProductCard$$$local.ref2",
    product: { id: "shoes" },
  };

  const card5 = {
    _id: "card5",
    _component: "MyProductCard$$$local.ref1",
  };

  const ref1 = {
    _id: "ref1",
    _component: "MyProductCard",
  };

  const ref2 = {
    _id: "ref2",
    _component: "MyProductCard",
    product: { id: "ref-product" },
    isLight: false,
    number: "four",
  };

  const normalized = normalize(
    {
      _component: "$TestSection",
      margin: {
        value: 1,
        ref: "s1",
      },
      isHorizontal: false,
      Card1: [card1],
      Card2: [card3],
      Cards: [card2, card4, card5],
      Card3Fixed: [card4],
      $$$refs: {
        ref1,
        ref2,
      },
      CardsLocalised: {
        en: [
          {
            _component: "$TestCard",
          },
        ],
      },
    },
    editorContext
  );

  // Normalisation for refs works
  test("visual properties inside of $$$refs are normalized", () => {
    expect(normalized.$$$refs!.ref1.number).toBe("one");
    expect(normalized.$$$refs!.ref1.isLight).toBe(false);
  });

  test("data properties inside of $$$refs are NOT normalized", () => {
    expect(normalized.$$$refs!.ref1.product).toBe(undefined);
  });

  test("visual properties in ref instances are NOT normalized", () => {
    expect(normalized.Cards[2].number).toBe(undefined);
    expect(normalized.Cards[2].isLight).toBe(undefined);
  });

  test("data properties in ref instances are normalized", () => {
    expect(normalized.Cards[2].product).toEqual({
      id: null,
      widgetId: "product",
    });
  });

  describe.skip("compilation works", () => {
    test.each([true, false])(`in mode isEditing=%s`, async (isEditing) => {
      const testEditorContext = {
        ...editorContext,
        isEditing,
      };

      testEditorContext.form.change("", normalized);

      const compiled = compileInternal(normalized, testEditorContext);
      const item = compiled.compiled;

      // we call here syncDatainconfig to make products already fetched!
      expect(item._component).toBe("$TestSection");

      if (isEditing) {
        expect(item.__editing!.components.Card1).toEqual({});
        expect(
          (item.components.Card1[0] as CompiledComponentConfig).__editing!
            .direction
        ).toBeUndefined();
        expect(
          (item.components.Card1[0] as CompiledComponentConfig).__editing!
            .noInline
        ).toBeUndefined();

        expect(item.__editing!.components.Card2).toMatchObject({
          noInline: true,
        });
        expect(
          (item.components.Card2[0] as CompiledComponentConfig).__editing!
            .direction
        ).toBe("vertical");
        expect(
          (item.components.Card2[0] as CompiledComponentConfig).__editing!
            .noInline
        ).toBe(true);

        expect(item.__editing!.components.Cards).toEqual({});
        expect(
          (item.components.Cards[0] as CompiledComponentConfig).__editing!
            .direction
        ).toBe("vertical");
        expect(
          (item.components.Cards[0] as CompiledComponentConfig).__editing!
            .noInline
        ).toBeUndefined();
        expect(
          (item.components.Cards[1] as CompiledComponentConfig).__editing!
            .direction
        ).toBe("vertical");
        expect(
          (item.components.Cards[1] as CompiledComponentConfig).__editing!
            .noInline
        ).toBeUndefined();
        expect(
          (item.components.Cards[2] as CompiledComponentConfig).__editing!
            .direction
        ).toBe("vertical");
        expect(
          (item.components.Cards[2] as CompiledComponentConfig).__editing!
            .noInline
        ).toBeUndefined();

        expect((compiled as any).configAfterAuto).toBeDefined();
      } else {
        expect(item.__editing).toBeUndefined();
        expect((compiled as any).configAfterAuto).toBeUndefined();
      }

      expect(item.components.Card1[0]).toMatchObject({
        _component: card1._component,
        _id: card1._id,
        props: {
          product: {
            id: card1.product.id,
          },
          isLight: card1.isLight,
          number: card1.number,
        },
      });

      expect(item.components.Card2[0]).toMatchObject({
        _component: card3._component,
        _id: card3._id,
        props: {
          product: {
            id: card3.product.id,
          },
        },
      });

      expect(item.components.Cards[0]).toMatchObject({
        _component: card2._component,
        _id: card2._id,
        props: {
          product: {
            id: "pants",
          },
          isLight: false,
          number: "two",
          test: "test3",
        },
      });

      expect(item.components.Cards[1]).toMatchObject({
        _id: card4._id,
        _component: card4._component,
        props: {
          product: {
            id: card4.product.id,
          },
          isLight: ref2.isLight,
          number: ref2.number,
        },
      });

      expect(item.components.Cards[2]).toMatchObject({
        ...card5,
        props: {
          product: {
            id: null,
          },
          isLight: false,
          number: "one",
          test: "test3",
        },
      });

      expect(item.components.Card3Fixed[0]).toMatchObject({
        _component: card4._component,
        _id: card4._id,
        props: {
          product: {
            id: card4.product.id,
          },
          isLight: ref2.isLight,
          number: ref2.number,
        },
      });
    });
  });
});

describe.skip("[component-collection-localised]", () => {
  test("returns fallback value when value for locale is empty", () => {
    const compiledTestCollection = compileInternal(
      normalize(
        {
          _component: "$TestSection",
          _id: "123",
          CardsLocalised: {
            en: [
              {
                _component: "$TestCard",
              },
            ],
          },
        },
        editorContext
      ),
      { ...editorContext, contextParams: { locale: "pl" } }
    );

    expect(
      compiledTestCollection.compiled.components.CardsLocalised
    ).toHaveLength(1);
  });

  test("it throws when there is no data for any locale", () => {
    expect(() =>
      compileInternal(
        normalize(
          {
            _component: "$TestSection",
            _id: "123",
            CardsLocalised: {},
          },
          editorContext
        ),
        editorContext
      )
    ).toThrowError(
      'Can\'t resolve localised value for prop "CardsLocalised" of component $TestSection'
    );
  });
});

describe.skip("Missings", () => {
  let consoleWarnSpy: jest.SpyInstance;

  beforeEach(() => {
    const originalConsoleWarn = globalThis.console.warn;
    consoleWarnSpy = jest
      .spyOn(console, "warn")
      .mockImplementation((...chunks: Array<string>) => {
        // TODO: Make this a part of implementation of `mockConsoleMethod` function from test utils.
        // We shouldn't blindly ignore all messages, we should only ignore the ones that we expect, unless there is a
        // good reason to ignore all of them.
        if (chunks.join(" ").match(/\[normalize\] Unknown _component/)) {
          return;
        }

        originalConsoleWarn(...chunks);
      });
  });

  afterAll(() => {
    consoleWarnSpy.mockRestore();
  });

  it.each`
    missingTemplate
    ${"NotInTheSchema"}
    ${"WrongComponent"}
  `(
    "given component of template '$missingTemplate' should compile it as @easyblocks/missing-component",
    ({ missingTemplate }) => {
      const { compiled } = compileInternal(
        {
          _component: missingTemplate,
          _id: "123",
        },
        editorContext
      );

      expect(compiled).toMatchObject({
        _id: expect.any(String),
        _component: "@easyblocks/missing-component",
        components: {},
        props: {},
        styled: {},
      });
    }
  );

  test("item props are normalized for components with missing definition", () => {
    const { unmock } = mockConsoleMethod("warn");

    const card = {
      _component: "MissingCardDefinition",
      _itemProps: {
        $TestSection: {
          CardsWithItemFields: {
            itemProp1: 1000, // wrong value
            itemProp2: null, // wrong value
            // itemProp3 // no value
          },
        },
      },
    };

    const normalized = normalize(
      {
        _component: "$TestSection",
        CardsWithItemFields: [card, card],
      },
      editorContext
    );

    unmock();

    expect(
      normalized.CardsWithItemFields[0]._itemProps.$TestSection
        .CardsWithItemFields.itemProp1
    ).toBe("a");
    expect(
      normalized.CardsWithItemFields[0]._itemProps.$TestSection
        .CardsWithItemFields.itemProp2
    ).toBe("a");
    expect(
      normalized.CardsWithItemFields[0]._itemProps.$TestSection
        .CardsWithItemFields.itemProp3Responsive
    ).toEqual({ $res: true, b4: "a" });

    expect(
      normalized.CardsWithItemFields[1]._itemProps.$TestSection
        .CardsWithItemFields.itemProp1
    ).toBe("a");
    expect(
      normalized.CardsWithItemFields[1]._itemProps.$TestSection
        .CardsWithItemFields.itemProp2
    ).toBe("a");
    expect(
      normalized.CardsWithItemFields[1]._itemProps.$TestSection
        .CardsWithItemFields.itemProp3Responsive
    ).toEqual({ $res: true, b4: "a" });
  });
});

describe.skip("when responsive token is used, it should take precedence over auto", () => {
  test("single responsive value fills everything", () => {
    const card = normalizeComponent(
      {
        _component: "$CardWithResponsiveToken",
        color: {
          $res: true,
          b4: {
            tokenId: "devResponsive",
          },
        },
      },
      editorContext
    );

    const normalizedColor = card.color.b4;

    const { configAfterAuto } = compileInternal(card, editorContext);

    if (!configAfterAuto) {
      throw new Error();
    }

    expect(configAfterAuto.color.b1).toEqual(normalizedColor);
    expect(configAfterAuto.color.b2).toEqual(normalizedColor);
    expect(configAfterAuto.color.b3).toEqual(normalizedColor);
    expect(configAfterAuto.color.b4).toEqual(normalizedColor);
    expect(configAfterAuto.color.b5).toEqual(normalizedColor);
  });

  test("scalar value 'resets' responsive token so that auto can be applied to remaining unset breakpoints", () => {
    const card = normalizeComponent(
      {
        _component: "$CardWithResponsiveToken",
        color: {
          $res: true,
          b2: { tokenId: "devBlue" },
          b4: {
            tokenId: "devResponsive",
          },
        },
      },
      editorContext
    );

    const normalizedScalarColor = card.color.b2;
    const normalizedResponsiveColor = card.color.b4;

    const { configAfterAuto } = compileInternal(card, editorContext);

    if (!configAfterAuto) {
      throw new Error();
    }

    expect(configAfterAuto.color.b1).toEqual({ value: "red" }); // auto value
    expect(configAfterAuto.color.b2).toEqual(normalizedScalarColor);
    expect(configAfterAuto.color.b3).toEqual(normalizedResponsiveColor);
    expect(configAfterAuto.color.b4).toEqual(normalizedResponsiveColor);
    expect(configAfterAuto.color.b5).toEqual(normalizedResponsiveColor);
  });
});
