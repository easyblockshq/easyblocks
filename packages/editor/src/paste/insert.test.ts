import type {
  CompilationContextType,
  Form,
  InternalComponentDefinition,
} from "@easyblocks/app-utils";
import { ConfigComponent } from "@easyblocks/core";
import * as utilsModule from "@easyblocks/app-utils";
import { insertCommand } from "./insert";
import * as reconcile from "./reconcile";

jest.mock("@easyblocks/app-utils", () => {
  return {
    __esModule: true,
    ...jest.requireActual("@easyblocks/app-utils"),
  };
});

const createForm = (
  initialValues: Record<string, any> = { data: [] }
): Form => {
  const form = new utilsModule.Form({
    id: "test",
    label: "Test",
    onSubmit: () => {},
    initialValues,
  });

  Object.keys(form.mutators).forEach((key) => {
    jest.spyOn(form.mutators, key);
  });

  return form;
};

const createConfigComponent = (
  init: Partial<ConfigComponent> = {}
): ConfigComponent => ({
  _template: "",
  ...init,
});

const createComponentDefinition = (
  init: Partial<InternalComponentDefinition> = {}
): InternalComponentDefinition => ({
  id: "",
  schema: [],
  styles: {},
  tags: [],
  ...init,
});

describe("insert", () => {
  it.each`
    name                      | index   | schema                                                            | expectedResult
    ${"path.0.chldren"}       | ${0}    | ${{ accepts: ["$item"], type: "component-collection", prop: "" }} | ${"path.0.chldren.0"}
    ${"data.0.stack.0.items"} | ${1337} | ${{ accepts: ["$item"], type: "component", prop: "" }}            | ${"data.0.stack.0.items.1337"}
  `(
    "Should return path ($expectedResult) to inserted item",
    ({ name, index, expectedResult, schema }) => {
      const form = createForm();

      const item = createConfigComponent({
        _id: "1",
        _itemProps: { prop1: "" },
      });

      const reconciledItem = createConfigComponent({
        _id: "2",
        _itemProps: { prop2: "" },
      });

      const duplicatedItem = createConfigComponent({
        _id: "3",
        _itemProps: { prop2: "" },
      });

      jest.spyOn(utilsModule, "findComponentDefinition").mockImplementation(
        jest.fn().mockReturnValue({
          tags: [],
          id: "$item",
        })
      );

      jest
        .spyOn(utilsModule, "duplicateConfig")
        .mockImplementation(jest.fn().mockReturnValue(duplicatedItem));

      jest
        .spyOn(reconcile, "reconcile")
        .mockReturnValue(jest.fn().mockReturnValue(reconciledItem));

      const insert = insertCommand({
        context: {} as CompilationContextType,
        form: form,
        schema,
        templateId: "",
      });

      const result = insert(name, index, item);

      expect(result).toEqual(expectedResult);
      expect(form.mutators.insert).toHaveBeenCalledTimes(1);
      expect(form.mutators.insert).toHaveBeenCalledWith(
        name,
        index,
        duplicatedItem
      );
    }
  );

  it("Should return null when item definition cannot be found", () => {
    const form = createForm();

    jest
      .spyOn(utilsModule, "findComponentDefinition")
      .mockImplementation(jest.fn().mockReturnValue(undefined));

    jest
      .spyOn(utilsModule, "duplicateConfig")
      .mockReturnValue({ _template: "xxx" });

    const mockReconcile = jest.fn();
    jest.spyOn(reconcile, "reconcile").mockReturnValue(mockReconcile);

    const insert = insertCommand({
      context: {} as CompilationContextType,
      form: form,
      schema: {
        prop: "",
        type: "component-collection",
        accepts: ["$item"],
      },
      templateId: "",
    });

    const result = insert("name", 1, createConfigComponent());

    expect(result).toEqual(null);
    expect(form.mutators.insert).not.toHaveBeenCalled();
    expect(mockReconcile).not.toHaveBeenCalled();
  });

  it.each`
    definition                                        | schema
    ${createComponentDefinition({ tags: ["TAG_1"] })} | ${{ accepts: ["TAG_2"], type: "component", prop: "" }}
    ${createComponentDefinition({ id: "ID_1" })}      | ${{ accepts: ["ID_2"], type: "component-collection", prop: "" }}
    ${createComponentDefinition({ tags: ["TAG_3"] })} | ${{ componentType: "TAG_3", type: "component-fixed", prop: "" }}
  `(
    "Should return null when items does not match the schema",
    ({ definition, schema }) => {
      const item = createConfigComponent();

      const form = createForm();

      jest
        .spyOn(utilsModule, "findComponentDefinition")
        .mockImplementation(jest.fn().mockReturnValue(definition));

      jest.spyOn(utilsModule, "duplicateConfig").mockReturnValue(item);

      const mockReconcile = jest.fn();
      jest.spyOn(reconcile, "reconcile").mockReturnValue(mockReconcile);

      const insert = insertCommand({
        context: {} as CompilationContextType,
        form: form,
        schema,
        templateId: "",
      });

      const result = insert("name", 1, item);

      expect(result).toEqual(null);
      expect(form.mutators.insert).not.toHaveBeenCalled();
      expect(mockReconcile).not.toHaveBeenCalled();
    }
  );
});
