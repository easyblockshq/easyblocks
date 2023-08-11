import { EditorContextType } from "../types";
import { getTinaField } from "./tinaFieldProviders";

describe("resource", () => {
  it("returns external field for given resource type", () => {
    const testEditorContext: EditorContextType = {
      resourceTypes: {
        "test.image": {
          widget: {
            type: "product",
          },
        },
      },
    } as unknown as EditorContextType;

    expect(
      getTinaField(
        {
          prop: "resource1",
          type: "resource",
          resourceType: "test.image",
        },
        testEditorContext,
        { id: null }
      )
    ).toEqual({
      label: "resource1",
      name: "resource1",
      group: "Properties",
      schemaProp: {
        prop: "resource1",
        type: "resource",
        resourceType: "test.image",
      },
      component: "external",
      externalField: {
        type: "product",
      },
    });
  });

  it("returns external field for given resource variant", () => {
    const testEditorContext: EditorContextType = {
      resourceTypes: {
        "test.image": {
          widget: {
            type: "product",
          },
        },
      },
    } as unknown as EditorContextType;

    expect(
      getTinaField(
        {
          prop: "resource1",
          type: "resource",
          variants: [
            {
              id: "variant1",
              resourceType: "test.image",
            },
          ],
        },
        testEditorContext,
        { id: null, variant: "variant1" }
      )
    ).toEqual({
      label: "resource1",
      name: "resource1",
      group: "Properties",
      schemaProp: {
        prop: "resource1",
        type: "resource",
        variants: [
          {
            id: "variant1",
            resourceType: "test.image",
          },
        ],
      },
      component: "external",
      externalField: {
        type: "product",
      },
    });
  });

  it("throws error when resource definition is missing for given resource type", () => {
    const testEditorContext: EditorContextType = {
      resourceTypes: {},
    } as unknown as EditorContextType;

    expect(() =>
      getTinaField(
        {
          prop: "resource1",
          type: "resource",
          resourceType: "test.image",
        },
        testEditorContext,
        { id: null }
      )
    ).toThrowErrorMatchingInlineSnapshot(
      `"Can't find resource definition for resource type \\"test.image\\""`
    );
  });

  it("throws error when resource definition is missing for given resource variant", () => {
    const testEditorContext: EditorContextType = {
      resourceTypes: {},
    } as unknown as EditorContextType;

    expect(() =>
      getTinaField(
        {
          prop: "resource1",
          type: "resource",
          variants: [
            {
              id: "variant1",
              resourceType: "test.image",
            },
          ],
        },
        testEditorContext,
        { id: null, variant: "variant1" }
      )
    ).toThrowErrorMatchingInlineSnapshot(
      `"Can't find resource definition for resource type \\"test.image\\""`
    );
  });

  it("throws error when widget is missing for given resource type", () => {
    const testEditorContext: EditorContextType = {
      resourceTypes: {
        "test.image": {},
      },
    } as unknown as EditorContextType;

    expect(() =>
      getTinaField(
        {
          prop: "resource1",
          type: "resource",
          resourceType: "test.image",
        },
        testEditorContext,
        { id: null }
      )
    ).toThrowErrorMatchingInlineSnapshot(
      `"Can't find widget named \\"test.image\\""`
    );
  });
});
