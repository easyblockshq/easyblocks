import type { InternalComponentDefinitions } from "@easyblocks/app-utils";
import { ComponentConfig } from "@easyblocks/core";
import { compileInternal } from "@easyblocks/core/_internals";
import { EditorContextType } from "./EditorContext";
import { buildTinaFields } from "./buildTinaFields";
import { createForm, testEditorContext } from "./utils/tests";

const testDefinitions: InternalComponentDefinitions = {
  components: [
    {
      id: "$TestRoot",
      schema: [
        {
          prop: "data",
          type: "component-collection",
          accepts: ["$TestComponent1", "$TestComponent2"],
        },
      ],
      tags: [],
      styles: () => {
        return {};
      },
    },
    {
      id: "$TestComponent1",
      schema: [
        {
          prop: "field1",
          type: "string",
        },
      ],
      tags: [],
      styles: () => {
        return {};
      },
    },
    {
      id: "$TestComponent2",
      schema: [
        {
          prop: "field2",
          type: "string",
        },
        {
          prop: "field3",
          type: "string",
        },
      ],
      tags: [],
      styles: () => {
        return {};
      },
    },
  ],
  actions: [],
  links: [],
  textModifiers: [],
};

test.skip('it resolves portal field of type "component"', () => {
  const editorContext: EditorContextType = {
    ...testEditorContext,
    isEditing: true,
    definitions: { ...testDefinitions },
    form: createForm({
      _id: "1",
      _template: "$TestRoot",
      data: [
        {
          _id: "2",
          _template: "$TestComponent1",
          field1: "",
        },
        {
          _id: "3",
          _template: "$TestComponent2",
          field2: "",
          field3: "",
        },
      ],
    }),
  };

  testDefinitions.components[1] = {
    ...testDefinitions.components[1],
    editing: ({ editingInfo }) => {
      return {
        fields: [...editingInfo.fields, { type: "fields", path: "data.1" }],
      };
    },
  };

  const { compiled } = compileInternal(
    editorContext.form.values as ComponentConfig,
    editorContext
  );
  editorContext.compiledComponentConfig = compiled;

  expect(buildTinaFields("data.0", editorContext)).toMatchInlineSnapshot(`
    Array [
      Object {
        "component": "identity",
        "hidden": false,
        "label": "Component type",
        "name": "data.0",
        "prop": "$myself",
        "schemaProp": Object {
          "definition": Object {
            "id": "$TestRoot",
            "schema": Array [
              Object {
                "accepts": Array [
                  "$TestComponent1",
                  "$TestComponent2",
                ],
                "prop": "data",
                "type": "component-collection",
              },
            ],
            "styles": [Function],
            "tags": Array [],
          },
          "group": "Component",
          "label": "Component type",
          "picker": undefined,
          "prop": "$myself",
          "required": false,
          "type": "component$$$",
        },
      },
      Object {
        "component": "text",
        "description": undefined,
        "group": "Properties",
        "hidden": false,
        "isLabelHidden": undefined,
        "label": "field1",
        "name": "data.0.field1",
        "normalize": undefined,
        "prop": "field1",
        "schemaProp": Object {
          "definition": Object {
            "editing": [Function],
            "id": "$TestComponent1",
            "schema": Array [
              Object {
                "prop": "field1",
                "type": "string",
              },
            ],
            "styles": [Function],
            "tags": Array [],
          },
          "prop": "field1",
          "type": "string",
        },
      },
      Object {
        "component": "text",
        "description": undefined,
        "group": "Properties",
        "hidden": false,
        "isLabelHidden": undefined,
        "label": "field2",
        "name": "data.1.field2",
        "normalize": undefined,
        "prop": "field2",
        "schemaProp": Object {
          "definition": Object {
            "id": "$TestComponent2",
            "schema": Array [
              Object {
                "prop": "field2",
                "type": "string",
              },
              Object {
                "prop": "field3",
                "type": "string",
              },
            ],
            "styles": [Function],
            "tags": Array [],
          },
          "prop": "field2",
          "type": "string",
        },
      },
      Object {
        "component": "text",
        "description": undefined,
        "group": "Properties",
        "hidden": false,
        "isLabelHidden": undefined,
        "label": "field3",
        "name": "data.1.field3",
        "normalize": undefined,
        "prop": "field3",
        "schemaProp": Object {
          "definition": Object {
            "id": "$TestComponent2",
            "schema": Array [
              Object {
                "prop": "field2",
                "type": "string",
              },
              Object {
                "prop": "field3",
                "type": "string",
              },
            ],
            "styles": [Function],
            "tags": Array [],
          },
          "prop": "field3",
          "type": "string",
        },
      },
    ]
  `);
});

test.skip('it resolves portal field of type "field"', () => {
  const editorContext = {
    ...testEditorContext,
    isEditing: true,
    definitions: { ...testDefinitions },
    form: createForm({
      _id: "1",
      _template: "$TestRoot",
      data: [
        {
          _id: "2",
          _template: "$TestComponent1",
          field1: "",
        },
        {
          _id: "3",
          _template: "$TestComponent2",
          field2: "",
          field3: "",
        },
      ],
    }),
  };

  testDefinitions.components[2] = {
    ...testDefinitions.components[2],
    editing: ({ editingInfo }) => {
      return {
        fields: [...editingInfo.fields, { type: "field", path: "field3" }],
      };
    },
  };

  const { compiled } = compileInternal(
    editorContext.form.values as ComponentConfig,
    editorContext
  );
  editorContext.compiledComponentConfig = compiled;

  expect(buildTinaFields("data.0", editorContext)).toMatchInlineSnapshot(`
    Array [
      Object {
        "component": "identity",
        "hidden": false,
        "label": "Component type",
        "name": "data.0",
        "prop": "$myself",
        "schemaProp": Object {
          "definition": Object {
            "id": "$TestRoot",
            "schema": Array [
              Object {
                "accepts": Array [
                  "$TestComponent1",
                  "$TestComponent2",
                ],
                "prop": "data",
                "type": "component-collection",
              },
            ],
            "styles": [Function],
            "tags": Array [],
          },
          "group": "Component",
          "label": "Component type",
          "picker": undefined,
          "prop": "$myself",
          "required": false,
          "type": "component$$$",
        },
      },
      Object {
        "component": "text",
        "description": undefined,
        "group": "Properties",
        "hidden": false,
        "isLabelHidden": undefined,
        "label": "field1",
        "name": "data.0.field1",
        "normalize": undefined,
        "prop": "field1",
        "schemaProp": Object {
          "definition": Object {
            "editing": [Function],
            "id": "$TestComponent1",
            "schema": Array [
              Object {
                "prop": "field1",
                "type": "string",
              },
            ],
            "styles": [Function],
            "tags": Array [],
          },
          "prop": "field1",
          "type": "string",
        },
      },
      Object {
        "component": "text",
        "description": undefined,
        "group": "Properties",
        "hidden": false,
        "isLabelHidden": undefined,
        "label": "field3",
        "name": "data.1.field3",
        "normalize": undefined,
        "prop": "field3",
        "schemaProp": Object {
          "definition": Object {
            "id": "$TestComponent2",
            "schema": Array [
              Object {
                "prop": "field2",
                "type": "string",
              },
              Object {
                "prop": "field3",
                "type": "string",
              },
            ],
            "styles": [Function],
            "tags": Array [],
          },
          "prop": "field3",
          "type": "string",
        },
      },
    ]
  `);
});

test.skip('it resolves portal field of type "multi-field"', () => {
  const editorContext = {
    ...testEditorContext,
    isEditing: true,
    definitions: { ...testDefinitions },
    form: createForm({
      _id: "1",
      _template: "$TestRoot",
      data: [
        {
          _id: "2",
          _template: "$TestComponent1",
          field1: "",
        },
        {
          _id: "3",
          _template: "$TestComponent2",
          field2: "",
          field3: "",
        },
        {
          _id: "4",
          _template: "$TestComponent2",
          field2: "",
          field3: "",
        },
      ],
    }),
  };

  testDefinitions.components[1] = {
    ...testDefinitions.components[1],
    // @ts-expect-error This is a special case that is only used by $richText component
    editing: ({ editingInfo }) => {
      return {
        fields: [
          ...editingInfo.fields,
          {
            type: "field",
            path: ["data.1.field2", "data.2.field2"],
          },
        ],
      };
    },
  };

  const { compiled } = compileInternal(
    editorContext.form.values as ComponentConfig,
    editorContext
  );
  editorContext.compiledComponentConfig = compiled;

  expect(buildTinaFields("data.0", editorContext)).toMatchInlineSnapshot(`
    Array [
      Object {
        "component": "identity",
        "hidden": false,
        "label": "Component type",
        "name": "data.0",
        "prop": "$myself",
        "schemaProp": Object {
          "definition": Object {
            "id": "$TestRoot",
            "schema": Array [
              Object {
                "accepts": Array [
                  "$TestComponent1",
                  "$TestComponent2",
                ],
                "prop": "data",
                "type": "component-collection",
              },
            ],
            "styles": [Function],
            "tags": Array [],
          },
          "group": "Component",
          "label": "Component type",
          "picker": undefined,
          "prop": "$myself",
          "required": false,
          "type": "component$$$",
        },
      },
      Object {
        "component": "text",
        "description": undefined,
        "group": "Properties",
        "hidden": false,
        "isLabelHidden": undefined,
        "label": "field1",
        "name": "data.0.field1",
        "normalize": undefined,
        "prop": "field1",
        "schemaProp": Object {
          "definition": Object {
            "editing": [Function],
            "id": "$TestComponent1",
            "schema": Array [
              Object {
                "prop": "field1",
                "type": "string",
              },
            ],
            "styles": [Function],
            "tags": Array [],
          },
          "prop": "field1",
          "type": "string",
        },
      },
      Object {
        "component": "text",
        "description": undefined,
        "group": "Properties",
        "hidden": false,
        "isLabelHidden": undefined,
        "label": "field2",
        "name": Array [
          "data.1.field2",
          "data.2.field2",
        ],
        "normalize": undefined,
        "prop": "field2",
        "schemaProp": Object {
          "definition": Object {
            "id": "$TestComponent2",
            "schema": Array [
              Object {
                "prop": "field2",
                "type": "string",
              },
              Object {
                "prop": "field3",
                "type": "string",
              },
            ],
            "styles": [Function],
            "tags": Array [],
          },
          "prop": "field2",
          "type": "string",
        },
      },
    ]
  `);
});
