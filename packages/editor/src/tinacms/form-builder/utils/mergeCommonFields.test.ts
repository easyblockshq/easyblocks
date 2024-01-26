import { AnyField } from "@easyblocks/core";
import { last } from "@easyblocks/utils";
import type { MergeCommonFieldsParameters } from "./mergeCommonFields";
import { mergeCommonFields } from "./mergeCommonFields";

test("merges fields repeated at least 2 times", () => {
  const fields: MergeCommonFieldsParameters["fields"] = [
    [
      createTestField("data.0.Children.0.property1"),
      createTestField("data.0.Children.0.property2"),
      createTestField("data.0.Children.0.property3"),
    ],
    [
      createTestField("data.1.Children.0.property1"),
      createTestField("data.1.Children.0.property2"),
      createTestField("data.1.Children.0.property4"),
    ],
  ];

  const expected: ReturnType<typeof mergeCommonFields> = [
    createTestField([
      "data.0.Children.0.property1",
      "data.1.Children.0.property1",
    ]),
    createTestField([
      "data.0.Children.0.property2",
      "data.1.Children.0.property2",
    ]),
  ];

  expect(
    mergeCommonFields({
      fields,
    })
  ).toEqual(expected);
});

test("merges fields when one of fields is multi field", () => {
  const fields: MergeCommonFieldsParameters["fields"] = [
    [
      createTestField(
        "data.0.Component.0.Stack.0.Items.0.elements.en.0.elements.0.elements.0.font"
      ),
    ],
    [
      createTestField([
        "data.0.Component.0.Stack.0.Items.1.elements.en.0.elements.0.elements.0.font",
        "data.0.Component.0.Stack.0.Items.1.elements.en.0.elements.0.elements.1.elements.0.font",
        "data.0.Component.0.Stack.0.Items.1.elements.en.0.elements.0.elements.2.font",
      ]),
    ],
  ];

  const expected: ReturnType<typeof mergeCommonFields> = [
    createTestField([
      "data.0.Component.0.Stack.0.Items.0.elements.en.0.elements.0.elements.0.font",
      "data.0.Component.0.Stack.0.Items.1.elements.en.0.elements.0.elements.0.font",
      "data.0.Component.0.Stack.0.Items.1.elements.en.0.elements.0.elements.1.elements.0.font",
      "data.0.Component.0.Stack.0.Items.1.elements.en.0.elements.0.elements.2.font",
    ]),
  ];

  expect(
    mergeCommonFields({
      fields,
    })
  ).toEqual(expected);
});

test("filters fields for which `showWhen` method is defined and returns `false`", () => {
  const fields: MergeCommonFieldsParameters["fields"] = [
    [
      createTestField("data.0.Children.0.property1", {
        hidden: true,
      }),
      createTestField("data.0.Children.0.property2", {
        hidden: false,
      }),
      createTestField("data.0.Children.0.property3"),
    ],
    [
      createTestField("data.1.Children.0.property1", {
        hidden: false,
      }),
      createTestField("data.1.Children.0.property2", {
        hidden: true,
      }),
      createTestField("data.1.Children.0.property4"),
    ],
  ];

  const expected: ReturnType<typeof mergeCommonFields> = [
    createTestField("data.1.Children.0.property1", {
      hidden: false,
    }),
    createTestField("data.0.Children.0.property2", {
      hidden: false,
    }),
  ];

  expect(
    mergeCommonFields({
      fields,
    })
  ).toEqual(expected);
});

test("filter fields which shares same property name but have different schema id", () => {
  const fields: MergeCommonFieldsParameters["fields"] = [
    [
      createTestField("data.0.Children.0.property1", {
        // @ts-ignore
        schemaProp: {
          definition: {
            id: "$schema1",
            tags: [],
            schema: [],
          },
        },
      }),
      createTestField("data.0.Children.0.property2"),
      createTestField("data.0.Children.0.property3"),
    ],
    [
      createTestField("data.1.Children.0.property1", {
        // @ts-ignore
        schemaProp: {
          definition: {
            id: "$schema2",
            tags: [],
            schema: [],
          },
        },
      }),
      createTestField("data.1.Children.0.property2"),
      createTestField("data.1.Children.0.property4"),
    ],
  ];

  const expected: ReturnType<typeof mergeCommonFields> = [
    createTestField([
      "data.0.Children.0.property2",
      "data.1.Children.0.property2",
    ]),
  ];

  expect(
    mergeCommonFields({
      fields,
    })
  ).toEqual(expected);
});

test("uses string as the name if there is only single repeated visible field", () => {
  const fields: MergeCommonFieldsParameters["fields"] = [
    [
      createTestField("data.0.Children.0.property1", { hidden: true }),
      createTestField("data.0.Children.0.property2"),
      createTestField("data.0.Children.0.property3"),
    ],
    [
      createTestField("data.1.Children.0.property1"),
      createTestField("data.1.Children.0.property2"),
      createTestField("data.1.Children.0.property4"),
    ],
  ];

  const expected: ReturnType<typeof mergeCommonFields> = [
    createTestField("data.1.Children.0.property1"),
    createTestField([
      "data.0.Children.0.property2",
      "data.1.Children.0.property2",
    ]),
  ];

  expect(
    mergeCommonFields({
      fields,
    })
  ).toEqual(expected);
});

function createTestField(
  name: Array<string> | string,
  restProperties: Partial<Omit<AnyField, "name" | "component">> = {}
) {
  const propertyName = last((Array.isArray(name) ? name[0] : name).split("."));

  return {
    component: "testComponent",
    ...restProperties,
    schemaProp: {
      type: "string",
      prop: propertyName,
      definition: {
        id: propertyName,
        ...restProperties.schemaProp?.definition,
      },
    },
    name,
  };
}
