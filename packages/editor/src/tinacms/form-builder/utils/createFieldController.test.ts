import {
  Form,
  InferShopstoryEditorEventData,
  InternalField,
  RichTextChangedEvent,
} from "@easyblocks/app-utils";
import {
  CompilationCache,
  CompilationCacheItemValue,
  compileInternal,
  normalize,
} from "@easyblocks/core/_internals";
import { AnyTinaField } from "@easyblocks/core";
import {
  actionTextModifier,
  buildRichTextBlockElementComponentConfig,
  buildRichTextComponentConfig,
  buildRichTextInlineWrapperElementComponentConfig,
  buildRichTextLineElementComponentConfig,
  buildRichTextPartComponentConfig,
} from "@easyblocks/editable-components";
import { dotNotationGet } from "@easyblocks/utils";
import { isFieldPortal } from "../../../buildTinaFields";
import { EditorContextType } from "../../../EditorContext";
import { FieldMixedValue } from "../../../types";
import { testEditorContext } from "../../../utils/tests";
import { createFieldController } from "./createFieldController";

let iframe: HTMLIFrameElement;

beforeAll(() => {
  iframe = document.createElement("iframe");
  iframe.id = "shopstory-canvas";
  document.body.appendChild(iframe);
});

const postMessageMock = jest.fn();

beforeEach(() => {
  postMessageMock.mockReset();
  iframe.contentWindow!.postMessage = postMessageMock;
});

afterAll(() => {
  iframe = document.getElementById("shopstory-canvas") as HTMLIFrameElement;
  iframe.remove();
});

describe("single field", () => {
  const fieldCustomValueField: InternalField = {
    component: "",
    name: "field.custom.value",
    schemaProp: {
      type: "string",
      prop: "value",
    },
  };

  const fieldLocalisedCollectionFirstValueField: InternalField = {
    component: "",
    name: "field.localisedCollection.[locale].0.value",
    schemaProp: {
      type: "string",
      prop: "value",
    },
  };

  test("updates field when given simple value", () => {
    const editorContext = createTestEditorContext();

    const { onChange, getValue } = createFieldController({
      field: fieldCustomValueField,
      editorContext,
    });

    onChange("new value");

    expect(getValue()).toBe("new value");
  });

  test("updates field when value is event-like object", () => {
    const editorContext = createTestEditorContext();

    const { onChange, getValue } = createFieldController({
      field: fieldCustomValueField,
      editorContext,
    });

    onChange({ currentTarget: { value: "new value" } });

    expect(getValue()).toBe("new value");
  });

  test("updates field when value is event-like object with 'checked' property", () => {
    const editorContext = createTestEditorContext();

    const { onChange, getValue } = createFieldController({
      field: fieldCustomValueField,
      editorContext,
    });

    onChange({
      currentTarget: { type: "checkbox", checked: true },
    });

    expect(getValue()).toBe(true);
  });

  test("updates field when its name is localised, value is a simple value and value for current locale is already defined", () => {
    const editorContext = createTestEditorContext();

    const { onChange, getValue } = createFieldController({
      field: fieldLocalisedCollectionFirstValueField,
      editorContext,
    });

    onChange("new value");

    expect(getValue()).toBe("new value");
  });

  test("updates field when its name is localised, value is a simple value and value for current locale isn't defined", () => {
    const editorContext = createTestEditorContext();
    editorContext.contextParams.locale = "pl";

    const { onChange, getValue } = createFieldController({
      field: {
        component: "",
        name: "field.localisedCollection.[locale].0.value",
        schemaProp: {
          type: "string",
          prop: "value",
        },
      },
      editorContext,
    });

    onChange("new value");

    expect(getValue()).toBe("new value");
  });

  test("updates field when the component has custom 'change' function", () => {
    const editorContext = createTestEditorContext();
    editorContext.form.change(
      "",
      normalize(
        {
          _template: "$ComponentWithCalculatedValue",
          prop1: {
            $res: true,
            b4: "1",
          },
          prop2: "2",
          propCalculated: {
            $res: true,
            b4: "3",
          },
        },
        editorContext
      )
    );

    const compiled = compileInternal(editorContext.form.values, editorContext);

    const fields = compiled.compiled.__editing!.fields!.filter(
      // @ts-expect-error
      (field): field is AnyTinaField => !isFieldPortal(field)
    );

    const field1Controller = createFieldController({
      // @ts-expect-error
      field: fields[0],
      editorContext,
    });
    const field2Controller = createFieldController({
      // @ts-expect-error
      field: fields[1],
      editorContext,
    });
    const fieldCalculatedController = createFieldController({
      // @ts-expect-error
      field: fields[2],
      editorContext,
    });

    field2Controller.onChange("3");
    expect(editorContext.form.values).toMatchObject({
      prop1: { $res: true, b4: "1" },
      prop2: "3",
      propCalculated: { $res: true, b4: "4" },
    });

    field2Controller.onChange("4");
    expect(editorContext.form.values).toMatchObject({
      prop1: { $res: true, b4: "1" },
      prop2: "4",
      propCalculated: { $res: true, b4: "5" },
    });

    field1Controller.onChange("4");
    expect(editorContext.form.values).toMatchObject({
      prop1: { $res: true, b4: "4" },
      prop2: "4",
      propCalculated: { $res: true, b4: "8" },
    });

    fieldCalculatedController.onChange("4");
    expect(editorContext.form.values).toMatchObject({
      prop1: { $res: true, b4: "4" },
      prop2: "4",
      propCalculated: { $res: true, b4: "8" },
    }); // no change

    fieldCalculatedController.onChange("2");
    expect(editorContext.form.values).toMatchObject({
      prop1: { $res: true, b4: "4" },
      prop2: "4",
      propCalculated: { $res: true, b4: "8" },
    }); // no change
  });
});

describe("multiple fields", () => {
  const fieldCustomValueField: InternalField = {
    component: "",
    name: ["field.custom1.value", "field.custom2.value"],
    schemaProp: {
      type: "string",
      prop: "value",
    },
  };

  test("returns mixed value when fields have different values", () => {
    const editorContext = createTestEditorContext();

    const { getValue } = createFieldController({
      field: fieldCustomValueField,
      editorContext,
    });

    expect(getValue()).toEqual<FieldMixedValue>({ __mixed__: true });
  });

  test("updates field when given simple value", () => {
    const editorContext = createTestEditorContext();

    const { onChange, getValue } = createFieldController({
      field: fieldCustomValueField,
      editorContext,
    });

    onChange("value");

    expect(getValue()).toBe("value");
  });

  test("updates field when value is event-like object", () => {
    const editorContext = createTestEditorContext();

    const { onChange, getValue } = createFieldController({
      field: fieldCustomValueField,
      editorContext,
    });

    onChange({ currentTarget: { value: "new value" } });

    expect(getValue()).toBe("new value");
  });

  test("updates field when value is event-like object with 'checked' property", () => {
    const editorContext = createTestEditorContext();

    const { onChange, getValue } = createFieldController({
      field: fieldCustomValueField,
      editorContext,
    });

    onChange({
      currentTarget: { type: "checkbox", checked: true },
    });

    expect(getValue()).toBe(true);
  });

  test("updates each field with its own value when multiple values are passed", () => {
    const editorContext = createTestEditorContext();

    const { onChange } = createFieldController({
      field: fieldCustomValueField,
      editorContext,
    });

    expect(
      dotNotationGet(editorContext.form.values, fieldCustomValueField.name[0])
    ).toBe("old value 1");
    expect(
      dotNotationGet(editorContext.form.values, fieldCustomValueField.name[1])
    ).toBe("old value 2");

    onChange("new value 1", "new value 2");

    expect(
      dotNotationGet(editorContext.form.values, fieldCustomValueField.name[0])
    ).toBe("new value 1");
    expect(
      dotNotationGet(editorContext.form.values, fieldCustomValueField.name[1])
    ).toBe("new value 2");
  });
});

describe("rich text editor", () => {
  test("updates when setting value for @easyblocks/rich-text-part", () => {
    const editorContext = createTestEditorContext();

    editorContext.focussedField.push(
      "richText.elements.en.0.elements.0.elements.0"
    );

    const { onChange } = createFieldController({
      field: {
        component: "",
        name: "richText.elements.en.0.elements.0.elements.0.color",
        schemaProp: { prop: "color", type: "color" },
      },
      editorContext,
    });

    onChange("black");

    expect(postMessageMock).toHaveBeenCalledTimes(1);
    expect(postMessageMock).toHaveBeenLastCalledWith<
      [InferShopstoryEditorEventData<RichTextChangedEvent>, string]
    >(
      {
        type: "@shopstory-editor/rich-text-changed",
        payload: {
          prop: "color",
          schemaProp: { prop: "color", type: "color" },
          values: ["black"],
        },
      },
      "*"
    );
  });

  test("updates when setting value for @easyblocks/rich-text-part using event", () => {
    const editorContext = createTestEditorContext();

    editorContext.focussedField.push(
      "richText.elements.en.0.elements.0.elements.0"
    );

    const { onChange } = createFieldController({
      field: {
        component: "",
        name: "richText.elements.en.0.elements.0.elements.0.color",
        schemaProp: { prop: "color", type: "color" },
      },
      editorContext,
    });

    onChange({ currentTarget: { value: "black" } });

    expect(postMessageMock).toHaveBeenCalledTimes(1);
    expect(postMessageMock).toHaveBeenLastCalledWith<
      [InferShopstoryEditorEventData<RichTextChangedEvent>, string]
    >(
      {
        type: "@shopstory-editor/rich-text-changed",
        payload: {
          prop: "color",
          schemaProp: { prop: "color", type: "color" },
          values: ["black"],
        },
      },
      "*"
    );
  });

  test("updates when setting value for @easyblocks/rich-text-block-element", () => {
    const editorContext = createTestEditorContext();

    editorContext.focussedField.push("richText");

    const { onChange, getValue } = createFieldController({
      field: {
        component: "",
        name: "richText.elements.[locale].0.type",
        schemaProp: {
          prop: "type",
          type: "select",
          options: ["paragraph", "bulleted-list"],
        },
      },
      editorContext,
    });

    expect(getValue()).toBe("paragraph");
    onChange("bulleted-list");

    expect(postMessageMock).toHaveBeenCalledTimes(0);
    expect(getValue()).toBe("bulleted-list");
  });

  test("updates when setting multiple values for different @easyblocks/rich-text-part", () => {
    const editorContext = createTestEditorContext();

    editorContext.focussedField.push(
      ...[
        "richText.elements.en.0.elements.0.elements.0",
        "richText.elements.en.0.elements.0.elements.0",
      ]
    );

    const { onChange } = createFieldController({
      field: {
        component: "",
        name: [
          "richText.elements.en.0.elements.0.elements.0.color",
          "richText.elements.en.0.elements.0.elements.0.color",
        ],
        schemaProp: { prop: "color", type: "color" },
      },
      editorContext,
    });

    onChange("black", "red");

    expect(postMessageMock).toHaveBeenCalledTimes(1);
    expect(postMessageMock).toHaveBeenLastCalledWith<
      [InferShopstoryEditorEventData<RichTextChangedEvent>, string]
    >(
      {
        type: "@shopstory-editor/rich-text-changed",
        payload: {
          prop: "color",
          schemaProp: { prop: "color", type: "color" },
          values: ["black", "red"],
        },
      },
      "*"
    );
  });

  test("removes $ sign from prop name before invoking on change handler", () => {
    const editorContext = createTestEditorContext();

    editorContext.focussedField.push(
      ...["richText.elements.en.0.elements.0.elements.0"]
    );

    const { onChange } = createFieldController({
      field: {
        component: "",
        name: "richText.elements.en.0.elements.0.elements.0.$color",
        schemaProp: { prop: "$color", type: "color" },
      },
      editorContext,
    });

    onChange("black");

    expect(postMessageMock).toHaveBeenCalledTimes(1);
    expect(postMessageMock).toHaveBeenLastCalledWith<
      [InferShopstoryEditorEventData<RichTextChangedEvent>, string]
    >(
      {
        type: "@shopstory-editor/rich-text-changed",
        payload: {
          prop: "color",
          schemaProp: { prop: "$color", type: "color" },
          values: ["black"],
        },
      },
      "*"
    );
  });
});

describe("cache invalidation", () => {
  test("removes cached results of all $richText ancestors and $richText itself when $richText changes", () => {
    const editorContext = createTestEditorContext();

    // We can safely cast empty object to `CompilationCacheItemValue` because we don't care in this test about
    // the actual cache item content. We need only the keys.
    editorContext.compilationCache.set(
      editorContext.form.values.richText._id,
      {} as CompilationCacheItemValue
    );
    editorContext.compilationCache.set(
      editorContext.form.values.richText.elements.en[0]._id,
      {} as CompilationCacheItemValue
    );
    editorContext.compilationCache.set(
      editorContext.form.values.richText.elements.en[0].elements[0]._id,
      {} as CompilationCacheItemValue
    );
    editorContext.compilationCache.set(
      editorContext.form.values.richText.elements.en[0].elements[0].elements[0]
        ._id,
      {} as CompilationCacheItemValue
    );
    editorContext.compilationCache.set(
      editorContext.form.values.richText.elements.en[0].elements[0].elements[1]
        ._id,
      {} as CompilationCacheItemValue
    );

    jest.spyOn(editorContext.compilationCache, "remove");

    const { onChange } = createFieldController({
      field: {
        component: "noop",
        name: "richText.isListStyleAuto",
        schemaProp: { prop: "isListStyleAuto", type: "boolean" },
      },
      editorContext,
    });

    onChange(false);

    expect(editorContext.compilationCache.remove).toHaveBeenCalledTimes(5);
    expect(editorContext.compilationCache.remove).toHaveBeenCalledWith(
      editorContext.form.values.richText._id
    );
    expect(editorContext.compilationCache.remove).toHaveBeenCalledWith(
      editorContext.form.values.richText.elements.en[0]._id
    );
    expect(editorContext.compilationCache.remove).toHaveBeenCalledWith(
      editorContext.form.values.richText.elements.en[0].elements[0]._id
    );
    expect(editorContext.compilationCache.remove).toHaveBeenCalledWith(
      editorContext.form.values.richText.elements.en[0].elements[0].elements[0]
        ._id
    );
    expect(editorContext.compilationCache.remove).toHaveBeenCalledWith(
      editorContext.form.values.richText.elements.en[0].elements[0].elements[1]
        ._id
    );
  });

  test("removes cached results of all $richText ancestors and $richText itself when child of $richText changes", () => {
    const editorContext = createTestEditorContext();

    // We can safely cast empty object to `CompilationCacheItemValue` because we don't care in this test about
    // the actual cache item content. We need only the keys.
    editorContext.compilationCache.set(
      editorContext.form.values.richTextWithTextModifier._id,
      {} as CompilationCacheItemValue
    );
    editorContext.compilationCache.set(
      editorContext.form.values.richTextWithTextModifier.elements.en[0]._id,
      {} as CompilationCacheItemValue
    );
    editorContext.compilationCache.set(
      editorContext.form.values.richTextWithTextModifier.elements.en[0]
        .elements[0]._id,
      {} as CompilationCacheItemValue
    );
    editorContext.compilationCache.set(
      editorContext.form.values.richTextWithTextModifier.elements.en[0]
        .elements[0].elements[0]._id,
      {} as CompilationCacheItemValue
    );
    editorContext.compilationCache.set(
      editorContext.form.values.richTextWithTextModifier.elements.en[0]
        .elements[0].elements[0].elements[0]._id,
      {} as CompilationCacheItemValue
    );
    editorContext.compilationCache.set(
      editorContext.form.values.richTextWithTextModifier.elements.en[0]
        .elements[0].elements[1]._id,
      {} as CompilationCacheItemValue
    );

    jest.spyOn(editorContext.compilationCache, "remove");

    const { onChange } = createFieldController({
      field: {
        component: "noop",
        name: "richTextWithTextModifier.elements.en.0.elements.0.elements.0.actionTextModifier.0.underline",
        schemaProp: { prop: "underline", type: "select", options: [] },
      },
      editorContext,
    });

    onChange("hideOnHover");

    expect(editorContext.compilationCache.remove).toHaveBeenCalledTimes(6);
    expect(editorContext.compilationCache.remove).toHaveBeenCalledWith(
      editorContext.form.values.richTextWithTextModifier._id
    );
    expect(editorContext.compilationCache.remove).toHaveBeenCalledWith(
      editorContext.form.values.richTextWithTextModifier.elements.en[0]._id
    );
    expect(editorContext.compilationCache.remove).toHaveBeenCalledWith(
      editorContext.form.values.richTextWithTextModifier.elements.en[0]
        .elements[0]._id
    );
    expect(editorContext.compilationCache.remove).toHaveBeenCalledWith(
      editorContext.form.values.richTextWithTextModifier.elements.en[0]
        .elements[0].elements[0]._id
    );
    expect(editorContext.compilationCache.remove).toHaveBeenCalledWith(
      editorContext.form.values.richTextWithTextModifier.elements.en[0]
        .elements[0].elements[0].elements[0]._id
    );
    expect(editorContext.compilationCache.remove).toHaveBeenCalledWith(
      editorContext.form.values.richTextWithTextModifier.elements.en[0]
        .elements[0].elements[1]._id
    );
  });

  test("removes cached compilation result of $RootSection component when $SectionWrapper changes", () => {
    const editorContext = createTestEditorContext();

    jest.spyOn(editorContext.compilationCache, "remove");

    const { onChange } = createFieldController({
      field: {
        component: "noop",
        name: "root.data.0.hide",
        schemaProp: { prop: "boolean$", type: "boolean" },
      },
      editorContext,
    });

    onChange(true);

    expect(editorContext.compilationCache.remove).toHaveBeenCalledTimes(1);
    expect(editorContext.compilationCache.remove).toHaveBeenCalledWith("xxx");
  });
});

function createTestEditorContext(): EditorContextType {
  const testForm = createTestForm();

  const runChangeMock = jest.fn((fn) => {
    fn();
  });

  return {
    ...testEditorContext,
    focussedField: [],
    actions: {
      ...testEditorContext.actions,
      runChange: runChangeMock,
    },
    compilationCache: new CompilationCache(),
    isEditing: true,
    definitions: {
      actions: [],
      components: [
        ...testEditorContext.definitions.components,
        {
          id: "$ComponentWithCalculatedValue",
          tags: [],
          schema: [
            {
              prop: "prop1",
              type: "select$",
              options: ["1", "2", "3", "4"],
            },
            {
              prop: "prop2",
              type: "select",
              options: ["1", "2", "3", "4"],
            },
            {
              prop: "propCalculated",
              type: "select$",
              options: ["1", "2", "3", "4", "5", "6", "7", "8"],
            },
          ],
          styles: () => {
            return {};
          },
          change: ({ value, fieldName, values }) => {
            if (fieldName === "propCalculated") {
              return {}; // we ignore changes of propCalculated
            } else if (fieldName === "prop1" || fieldName === "prop2") {
              // propCalculated is a sum of prop1 and prop2
              const prop1 = parseInt(
                fieldName === "prop1" ? value : values.prop1
              );
              const prop2 = parseInt(
                fieldName === "prop2" ? value : values.prop2
              );

              return {
                [fieldName]: value,
                propCalculated: (prop1 + prop2).toString(),
              };
            } else {
              return {
                [fieldName]: value,
              };
            }
          },
        },
        {
          id: "CustomComponent",
          tags: [],
          schema: [
            {
              type: "string",
              prop: "value",
            },
            {
              type: "select",
              prop: "option",
              options: ["one", "two", "three"],
            },
          ],
        },
      ],
      links: [],
      textModifiers: [actionTextModifier],
    },
    contextParams: {
      ...testEditorContext.contextParams,
    },
    form: testForm,
    breakpointIndex: "b4",
  };
}

function createTestForm() {
  return new Form({
    id: "test",
    label: "Test",
    onSubmit: () => {},
    initialValues: {
      field: {
        custom: {
          _template: "CustomComponent",
          value: "old value",
          option: "one",
        },
        custom1: {
          _template: "CustomComponent",
          value: "old value 1",
          option: "one",
        },
        custom2: {
          _template: "CustomComponent",
          value: "old value 2",
          option: "two",
        },
        localisedCollection: {
          [testEditorContext.contextParams.locale]: [
            {
              _template: "CustomComponent",
              value: "old value",
            },
          ],
        },
      },
      richText: buildRichTextComponentConfig({
        compilationContext: testEditorContext,
        elements: [
          buildRichTextBlockElementComponentConfig("paragraph", [
            buildRichTextLineElementComponentConfig({
              elements: [
                buildRichTextPartComponentConfig({
                  color: { $res: true },
                  font: { $res: true },
                  value: "Lorem ipsum",
                }),
                buildRichTextPartComponentConfig({
                  color: { $res: true },
                  font: { $res: true },
                  value: "dolor sit amet",
                }),
              ],
            }),
          ]),
        ],
        mainColor: { $res: true },
        mainFont: { $res: true },
      }),
      richTextWithTextModifier: buildRichTextComponentConfig({
        compilationContext: testEditorContext,
        elements: [
          buildRichTextBlockElementComponentConfig("paragraph", [
            buildRichTextLineElementComponentConfig({
              elements: [
                buildRichTextInlineWrapperElementComponentConfig({
                  elements: [
                    buildRichTextPartComponentConfig({
                      color: { $res: true },
                      font: { $res: true },
                      value: "Lorem ipsum",
                    }),
                  ],
                  actionTextModifier: [
                    {
                      _template: "$StandardActionStyles",
                      _id: "bf78f7e9-3b5c-461e-8fc9-f9460860aee1",
                      isColorOverwriteEnabled: true,
                      color: {
                        $res: true,
                        xl: {
                          value: "#0166cc",
                        },
                      },
                      hoverColor: {
                        $res: true,
                        xl: {
                          ref: "black",
                          value: "black",
                        },
                      },
                      isHoverColorEnabled: false,
                      underline: "showOnHover",
                      opacity: "1",
                      hoverOpacity: "1",
                      hoverOpacityAnimationDuration: "100ms",
                    },
                  ],
                }),
                buildRichTextPartComponentConfig({
                  color: { $res: true },
                  font: { $res: true },
                  value: "dolor sit amet",
                }),
              ],
            }),
          ]),
        ],
        mainColor: { $res: true },
        mainFont: { $res: true },
      }),
      root: {
        _template: "$RootSections",
        _id: "xxx",
        data: [
          {
            _template: "$SectionBanner",
            _id: "yyy",
            hide: false,
          },
        ],
      },
    },
  });
}
