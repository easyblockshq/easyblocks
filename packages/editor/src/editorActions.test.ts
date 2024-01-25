// @ts-ignore
import { CompilationContextType } from "@easyblocks/core/_internals";
import { dotNotationGet } from "@easyblocks/utils";
import {
  duplicateItems,
  logItems,
  moveItems,
  pasteItems,
  removeItems,
  shiftPath,
  takeLastOfEachParent,
} from "./editorActions";
import { Form } from "./form";
import { destinationResolver } from "./paste/destinationResolver";
import { pasteManager } from "./paste/manager";

function createTestForm({
  initialValues = {},
}: {
  initialValues: Record<string, any>;
}): Form {
  const form = new Form({
    id: "test",
    label: "Test",
    onSubmit: () => {},
    initialValues,
  });

  Object.keys(form.mutators).forEach((key) => {
    jest.spyOn(form.mutators, key);
  });

  return form;
}

function createTestFormWithSingleParentElement() {
  return createTestForm({
    initialValues: {
      parent1: [
        { _component: "testComponent", name: "child1" },
        { _component: "testComponent", name: "child2" },
        { _component: "testComponent", name: "child3" },
        { _component: "testComponent", name: "child4" },
      ],
      _component: "parentTestComponent",
    },
  });
}

function createTestFormWithMultipleParentsElements() {
  return createTestForm({
    initialValues: {
      _component: "parentTestComponent",
      parent1: [
        { _component: "testComponent", name: "child1.1" },
        { _component: "testComponent", name: "child1.2" },
        { _component: "testComponent", name: "child1.3" },
      ],
      parent2: [
        { _component: "testComponent", name: "child2.1" },
        { _component: "testComponent", name: "child2.2" },
        { _component: "testComponent", name: "child2.3" },
      ],
    },
  });
}

const testCompilationContext: CompilationContextType = {
  devices: [],
  theme: {
    space: {},
    fonts: {},
    aspectRatios: {},
    colors: {},
    numberOfItemsInRow: {},
    icons: {},
    containerWidths: {},
    boxShadows: {},
  },
  contextParams: { locale: "en" },
  definitions: {
    components: [
      {
        id: "testComponent",
        schema: [],
      },
      {
        id: "testComponentWithComponentFixed",
        schema: [
          {
            prop: "fixedChild",
            type: "component",
            accepts: ["testComponent"],
            required: true,
          },
        ],
      },
      {
        id: "testComponentWithComponent",
        schema: [
          {
            prop: "componentChild",
            type: "component",
            accepts: ["testComponent"],
          },
          {
            prop: "componentRequiredChild",
            type: "component",
            required: true,
            accepts: ["testComponent"],
          },
        ],
      },
      {
        id: "testTemplate",
        schema: [
          {
            type: "string",
            prop: "name",
          },
        ],
      },
    ],
    links: [],
    actions: [],
    textModifiers: [],
  },
  image: {
    resourceType: "",
    transform: jest.fn(),
  },
  mainBreakpointIndex: "",
  text: {
    fetch: jest.fn(),
  },
  types: {},
  video: {
    resourceType: "",
    transform: jest.fn(),
  },
  imageVariants: [],
};

describe("duplicateItems", () => {
  it("duplicates single element", () => {
    const form = createTestFormWithSingleParentElement();

    const fieldsToFocus = duplicateItems(
      form,
      ["parent1.0"],
      testCompilationContext
    );

    expect(fieldsToFocus).toEqual(["parent1.1"]);
    expect(form.mutators.insert).toHaveBeenCalledTimes(1);
    expect(form.mutators.insert).toHaveBeenNthCalledWith(1, "parent1", 1, {
      _component: "testComponent",
      _id: expect.any(String),
      name: "child1",
    });
    expect(form.values).toEqual({
      _component: "parentTestComponent",
      parent1: [
        { _component: "testComponent", name: "child1" },
        {
          _component: "testComponent",
          _id: expect.any(String),
          name: "child1",
        },
        { _component: "testComponent", name: "child2" },
        { _component: "testComponent", name: "child3" },
        { _component: "testComponent", name: "child4" },
      ],
    });
  });

  it("duplicates multiple elements when given fields are next to each other", () => {
    const form = createTestFormWithSingleParentElement();
    const fieldsToFocus = duplicateItems(
      form,
      ["parent1.0", "parent1.1"],
      testCompilationContext
    );

    expect(fieldsToFocus).toEqual(["parent1.2", "parent1.3"]);
    expect(form.mutators.insert).toHaveBeenCalledTimes(2);
    expect(form.mutators.insert).toHaveBeenNthCalledWith(1, "parent1", 2, {
      _component: "testComponent",
      _id: expect.any(String),
      name: "child1",
    });
    expect(form.mutators.insert).toHaveBeenNthCalledWith(2, "parent1", 3, {
      _component: "testComponent",
      _id: expect.any(String),
      name: "child2",
    });
    expect(form.values).toEqual({
      _component: "parentTestComponent",
      parent1: [
        { _component: "testComponent", name: "child1" },
        { _component: "testComponent", name: "child2" },
        {
          _component: "testComponent",
          _id: expect.any(String),
          name: "child1",
        },
        {
          _component: "testComponent",
          _id: expect.any(String),
          name: "child2",
        },
        { _component: "testComponent", name: "child3" },
        { _component: "testComponent", name: "child4" },
      ],
    });
  });

  it("duplicates multiple elements when given fields are not next to each other", () => {
    const form = createTestFormWithSingleParentElement();
    const fieldsToFocus = duplicateItems(
      form,
      ["parent1.0", "parent1.2"],
      testCompilationContext
    );

    expect(fieldsToFocus).toEqual(["parent1.3", "parent1.4"]);
    expect(form.mutators.insert).toHaveBeenCalledTimes(2);
    expect(form.mutators.insert).toHaveBeenNthCalledWith(1, "parent1", 3, {
      _component: "testComponent",
      _id: expect.any(String),
      name: "child1",
    });
    expect(form.mutators.insert).toHaveBeenNthCalledWith(2, "parent1", 4, {
      _component: "testComponent",
      _id: expect.any(String),
      name: "child3",
    });
    expect(form.values).toEqual({
      _component: "parentTestComponent",
      parent1: [
        { _component: "testComponent", name: "child1" },
        { _component: "testComponent", name: "child2" },
        { _component: "testComponent", name: "child3" },
        {
          _component: "testComponent",
          _id: expect.any(String),
          name: "child1",
        },
        {
          _component: "testComponent",
          _id: expect.any(String),
          name: "child3",
        },
        { _component: "testComponent", name: "child4" },
      ],
    });
  });

  it("duplicates multiple elements when given fields are within different parents", () => {
    const form = createTestFormWithMultipleParentsElements();
    const fieldsToFocus = duplicateItems(
      form,
      ["parent1.0", "parent2.0"],
      testCompilationContext
    );

    expect(fieldsToFocus).toEqual(["parent1.1", "parent2.1"]);
    expect(form.mutators.insert).toHaveBeenCalledTimes(2);
    expect(form.mutators.insert).toHaveBeenNthCalledWith(1, "parent1", 1, {
      _component: "testComponent",
      _id: expect.any(String),
      name: "child1.1",
    });
    expect(form.mutators.insert).toHaveBeenNthCalledWith(2, "parent2", 1, {
      _component: "testComponent",
      _id: expect.any(String),
      name: "child2.1",
    });
    expect(form.values).toEqual({
      _component: "parentTestComponent",
      parent1: [
        { _component: "testComponent", name: "child1.1" },
        {
          _component: "testComponent",
          _id: expect.any(String),
          name: "child1.1",
        },
        { _component: "testComponent", name: "child1.2" },
        { _component: "testComponent", name: "child1.3" },
      ],
      parent2: [
        { _component: "testComponent", name: "child2.1" },
        {
          _component: "testComponent",
          _id: expect.any(String),
          name: "child2.1",
        },
        { _component: "testComponent", name: "child2.2" },
        { _component: "testComponent", name: "child2.3" },
      ],
    });
  });

  it("doesn't duplicate elements of type 'component' that's required", () => {
    const form = createTestForm({
      initialValues: {
        _component: "testComponentWithComponentFixed",
        fixedChild: [
          {
            _component: "testComponent",
            name: "child1",
          },
        ],
      },
    });

    const fieldsToFocus = duplicateItems(
      form,
      ["fixedChild.0"],
      testCompilationContext
    );

    expect(fieldsToFocus).toBeUndefined();
    expect(form.mutators.insert).toHaveBeenCalledTimes(0);
    expect(form.values).toEqual({
      _component: "testComponentWithComponentFixed",
      fixedChild: [
        {
          _component: "testComponent",
          name: "child1",
        },
      ],
    });
  });

  it("doesn't duplicate elements of type 'component' when it's required", () => {
    const form = createTestForm({
      initialValues: {
        _component: "testComponentWithComponent",
        componentRequiredChild: [
          {
            _component: "testComponent",
            name: "child1",
          },
        ],
      },
    });

    const fieldsToFocus = duplicateItems(
      form,
      ["componentRequiredChild.0"],
      testCompilationContext
    );

    expect(fieldsToFocus).toBeUndefined();
    expect(form.mutators.insert).toHaveBeenCalledTimes(0);
    expect(form.values).toEqual({
      _component: "testComponentWithComponent",
      componentRequiredChild: [
        {
          _component: "testComponent",
          name: "child1",
        },
      ],
    });
  });

  it("doesn't duplicate elements of type 'component' when it's not required", () => {
    const form = createTestForm({
      initialValues: {
        _component: "testComponentWithComponent",
        componentChild: [
          {
            _component: "testComponent",
            name: "child1",
          },
        ],
      },
    });

    const fieldsToFocus = duplicateItems(
      form,
      ["componentChild.0"],
      testCompilationContext
    );

    expect(fieldsToFocus).toEqual(["componentChild.1"]);
    expect(form.mutators.insert).toHaveBeenCalledTimes(1);
  });
});

describe("moveItems", () => {
  it("moves single item from top to bottom", () => {
    const form = createTestFormWithSingleParentElement();
    let fieldsToFocus = moveItems(form, ["parent1.0"], "bottom");

    expect(fieldsToFocus).toEqual(["parent1.1"]);
    expect(form.mutators.move).toHaveBeenCalledTimes(1);
    expect(form.mutators.move).toHaveBeenNthCalledWith(1, "parent1", 0, 1);
    expect(form.values).toEqual({
      _component: "parentTestComponent",
      parent1: [
        { _component: "testComponent", name: "child2" },
        { _component: "testComponent", name: "child1" },
        { _component: "testComponent", name: "child3" },
        { _component: "testComponent", name: "child4" },
      ],
    });

    fieldsToFocus = moveItems(form, ["parent1.1"], "bottom");

    expect(fieldsToFocus).toEqual(["parent1.2"]);
    expect(form.mutators.move).toHaveBeenCalledTimes(2);
    expect(form.mutators.move).toHaveBeenNthCalledWith(2, "parent1", 1, 2);
    expect(form.values).toEqual({
      _component: "parentTestComponent",
      parent1: [
        { _component: "testComponent", name: "child2" },
        { _component: "testComponent", name: "child3" },
        { _component: "testComponent", name: "child1" },
        { _component: "testComponent", name: "child4" },
      ],
    });

    fieldsToFocus = moveItems(form, ["parent1.2"], "bottom");

    expect(fieldsToFocus).toEqual(["parent1.3"]);
    expect(form.mutators.move).toHaveBeenCalledTimes(3);
    expect(form.mutators.move).toHaveBeenNthCalledWith(3, "parent1", 2, 3);
    expect(form.values).toEqual({
      _component: "parentTestComponent",
      parent1: [
        { _component: "testComponent", name: "child2" },
        { _component: "testComponent", name: "child3" },
        { _component: "testComponent", name: "child4" },
        { _component: "testComponent", name: "child1" },
      ],
    });

    fieldsToFocus = moveItems(form, ["parent1.3"], "bottom");

    expect(fieldsToFocus).toBeUndefined();
    expect(form.mutators.move).toHaveBeenCalledTimes(3);
    expect(form.values).toEqual({
      _component: "parentTestComponent",
      parent1: [
        { _component: "testComponent", name: "child2" },
        { _component: "testComponent", name: "child3" },
        { _component: "testComponent", name: "child4" },
        { _component: "testComponent", name: "child1" },
      ],
    });
  });

  it("moves single item from bottom to top", () => {
    const form = createTestFormWithSingleParentElement();
    let fieldsToFocus = moveItems(form, ["parent1.3"], "top");

    expect(fieldsToFocus).toEqual(["parent1.2"]);
    expect(form.mutators.move).toHaveBeenCalledTimes(1);
    expect(form.mutators.move).toHaveBeenNthCalledWith(1, "parent1", 3, 2);
    expect(form.values).toEqual({
      _component: "parentTestComponent",
      parent1: [
        { _component: "testComponent", name: "child1" },
        { _component: "testComponent", name: "child2" },
        { _component: "testComponent", name: "child4" },
        { _component: "testComponent", name: "child3" },
      ],
    });

    fieldsToFocus = moveItems(form, ["parent1.2"], "top");

    expect(fieldsToFocus).toEqual(["parent1.1"]);
    expect(form.mutators.move).toHaveBeenCalledTimes(2);
    expect(form.mutators.move).toHaveBeenNthCalledWith(2, "parent1", 2, 1);
    expect(form.values).toEqual({
      _component: "parentTestComponent",
      parent1: [
        { _component: "testComponent", name: "child1" },
        { _component: "testComponent", name: "child4" },
        { _component: "testComponent", name: "child2" },
        { _component: "testComponent", name: "child3" },
      ],
    });

    fieldsToFocus = moveItems(form, ["parent1.1"], "top");

    expect(fieldsToFocus).toEqual(["parent1.0"]);
    expect(form.mutators.move).toHaveBeenCalledTimes(3);
    expect(form.mutators.move).toHaveBeenNthCalledWith(3, "parent1", 1, 0);
    expect(form.values).toEqual({
      _component: "parentTestComponent",
      parent1: [
        { _component: "testComponent", name: "child4" },
        { _component: "testComponent", name: "child1" },
        { _component: "testComponent", name: "child2" },
        { _component: "testComponent", name: "child3" },
      ],
    });

    fieldsToFocus = moveItems(form, ["parent1.0"], "top");

    expect(fieldsToFocus).toBeUndefined();
    expect(form.mutators.move).toHaveBeenCalledTimes(3);
    expect(form.values).toEqual({
      _component: "parentTestComponent",
      parent1: [
        { _component: "testComponent", name: "child4" },
        { _component: "testComponent", name: "child1" },
        { _component: "testComponent", name: "child2" },
        { _component: "testComponent", name: "child3" },
      ],
    });
  });

  it("moves multiple elements from top to bottom", () => {
    const form = createTestFormWithSingleParentElement();
    let fieldsToFocus = moveItems(form, ["parent1.0", "parent1.1"], "bottom");

    expect(fieldsToFocus).toEqual(["parent1.2", "parent1.1"]);
    expect(form.mutators.move).toHaveBeenCalledTimes(2);
    expect(form.mutators.move).toHaveBeenNthCalledWith(1, "parent1", 1, 2);
    expect(form.mutators.move).toHaveBeenNthCalledWith(2, "parent1", 0, 1);
    expect(form.values).toEqual({
      _component: "parentTestComponent",
      parent1: [
        { _component: "testComponent", name: "child3" },
        { _component: "testComponent", name: "child1" },
        { _component: "testComponent", name: "child2" },
        { _component: "testComponent", name: "child4" },
      ],
    });

    fieldsToFocus = moveItems(form, ["parent1.1", "parent1.2"], "bottom");

    expect(fieldsToFocus).toEqual(["parent1.3", "parent1.2"]);
    expect(form.mutators.move).toHaveBeenCalledTimes(4);
    expect(form.mutators.move).toHaveBeenNthCalledWith(3, "parent1", 2, 3);
    expect(form.mutators.move).toHaveBeenNthCalledWith(4, "parent1", 1, 2);
    expect(form.values).toEqual({
      _component: "parentTestComponent",
      parent1: [
        { _component: "testComponent", name: "child3" },
        { _component: "testComponent", name: "child4" },
        { _component: "testComponent", name: "child1" },
        { _component: "testComponent", name: "child2" },
      ],
    });

    fieldsToFocus = moveItems(form, ["parent1.2", "parent1.3"], "bottom");

    expect(fieldsToFocus).toEqual(["parent1.3", "parent1.2"]);
    expect(form.mutators.move).toHaveBeenCalledTimes(4);
    expect(form.values).toEqual({
      _component: "parentTestComponent",
      parent1: [
        { _component: "testComponent", name: "child3" },
        { _component: "testComponent", name: "child4" },
        { _component: "testComponent", name: "child1" },
        { _component: "testComponent", name: "child2" },
      ],
    });
  });

  it("moves multiple elements from bottom to top", () => {
    const form = createTestFormWithSingleParentElement();
    let fieldsToFocus = moveItems(form, ["parent1.2", "parent1.3"], "top");

    expect(fieldsToFocus).toEqual(["parent1.1", "parent1.2"]);
    expect(form.mutators.move).toHaveBeenCalledTimes(2);
    expect(form.mutators.move).toHaveBeenNthCalledWith(1, "parent1", 2, 1);
    expect(form.mutators.move).toHaveBeenNthCalledWith(2, "parent1", 3, 2);
    expect(form.values).toEqual({
      _component: "parentTestComponent",
      parent1: [
        { _component: "testComponent", name: "child1" },
        { _component: "testComponent", name: "child3" },
        { _component: "testComponent", name: "child4" },
        { _component: "testComponent", name: "child2" },
      ],
    });

    fieldsToFocus = moveItems(form, ["parent1.1", "parent1.2"], "top");

    expect(fieldsToFocus).toEqual(["parent1.0", "parent1.1"]);
    expect(form.mutators.move).toHaveBeenCalledTimes(4);
    expect(form.mutators.move).toHaveBeenNthCalledWith(3, "parent1", 1, 0);
    expect(form.mutators.move).toHaveBeenNthCalledWith(4, "parent1", 2, 1);
    expect(form.values).toEqual({
      _component: "parentTestComponent",
      parent1: [
        { _component: "testComponent", name: "child3" },
        { _component: "testComponent", name: "child4" },
        { _component: "testComponent", name: "child1" },
        { _component: "testComponent", name: "child2" },
      ],
    });

    fieldsToFocus = moveItems(form, ["parent1.0", "parent1.1"], "top");

    expect(fieldsToFocus).toEqual(["parent1.0", "parent1.1"]);
    expect(form.mutators.move).toHaveBeenCalledTimes(4);
    expect(form.values).toEqual({
      _component: "parentTestComponent",
      parent1: [
        { _component: "testComponent", name: "child3" },
        { _component: "testComponent", name: "child4" },
        { _component: "testComponent", name: "child1" },
        { _component: "testComponent", name: "child2" },
      ],
    });
  });

  it("moves multiple elements to bottom when given fields are within different parents", () => {
    const form = createTestFormWithMultipleParentsElements();
    const fieldsToFocus = moveItems(form, ["parent1.0", "parent2.0"], "bottom");

    expect(fieldsToFocus).toEqual(["parent1.1", "parent2.1"]);
    expect(form.mutators.move).toHaveBeenCalledTimes(2);
    expect(form.mutators.move).toHaveBeenNthCalledWith(1, "parent1", 0, 1);
    expect(form.mutators.move).toHaveBeenNthCalledWith(2, "parent2", 0, 1);
    expect(form.values).toEqual({
      _component: "parentTestComponent",
      parent1: [
        { _component: "testComponent", name: "child1.2" },
        { _component: "testComponent", name: "child1.1" },
        { _component: "testComponent", name: "child1.3" },
      ],
      parent2: [
        { _component: "testComponent", name: "child2.2" },
        { _component: "testComponent", name: "child2.1" },
        { _component: "testComponent", name: "child2.3" },
      ],
    });
  });

  it("moves multiple elements to bottom only if given fields can be moved within different containers", () => {
    const form = createTestFormWithMultipleParentsElements();
    const fieldsToFocus = moveItems(form, ["parent1.2", "parent2.1"], "bottom");

    expect(fieldsToFocus).toEqual(["parent1.2", "parent2.2"]);
    expect(form.mutators.move).toHaveBeenCalledTimes(1);
    expect(form.mutators.move).toHaveBeenNthCalledWith(1, "parent2", 1, 2);
    expect(form.values).toEqual({
      _component: "parentTestComponent",
      parent1: [
        { _component: "testComponent", name: "child1.1" },
        { _component: "testComponent", name: "child1.2" },
        { _component: "testComponent", name: "child1.3" },
      ],
      parent2: [
        { _component: "testComponent", name: "child2.1" },
        { _component: "testComponent", name: "child2.3" },
        { _component: "testComponent", name: "child2.2" },
      ],
    });
  });

  it("moves multiple elements to top when given fields are within different parents", () => {
    const form = createTestFormWithMultipleParentsElements();
    const fieldsToFocus = moveItems(form, ["parent1.2", "parent2.2"], "top");

    expect(fieldsToFocus).toEqual(["parent1.1", "parent2.1"]);
    expect(form.mutators.move).toHaveBeenCalledTimes(2);
    expect(form.mutators.move).toHaveBeenNthCalledWith(1, "parent1", 2, 1);
    expect(form.mutators.move).toHaveBeenNthCalledWith(2, "parent2", 2, 1);
    expect(form.values).toEqual({
      _component: "parentTestComponent",
      parent1: [
        { _component: "testComponent", name: "child1.1" },
        { _component: "testComponent", name: "child1.3" },
        { _component: "testComponent", name: "child1.2" },
      ],
      parent2: [
        { _component: "testComponent", name: "child2.1" },
        { _component: "testComponent", name: "child2.3" },
        { _component: "testComponent", name: "child2.2" },
      ],
    });
  });

  it("moves multiple elements to top only if given fields can be moved within different containers", () => {
    const form = createTestFormWithMultipleParentsElements();
    const fieldsToFocus = moveItems(form, ["parent1.1", "parent2.0"], "top");

    expect(fieldsToFocus).toEqual(["parent1.0", "parent2.0"]);
    expect(form.mutators.move).toHaveBeenCalledTimes(1);
    expect(form.mutators.move).toHaveBeenNthCalledWith(1, "parent1", 1, 0);
    expect(form.values).toEqual({
      _component: "parentTestComponent",
      parent1: [
        { _component: "testComponent", name: "child1.2" },
        { _component: "testComponent", name: "child1.1" },
        { _component: "testComponent", name: "child1.3" },
      ],
      parent2: [
        { _component: "testComponent", name: "child2.1" },
        { _component: "testComponent", name: "child2.2" },
        { _component: "testComponent", name: "child2.3" },
      ],
    });
  });
});

describe("removeItems", () => {
  it("removes single element when element is the first child", () => {
    const form = createTestFormWithSingleParentElement();
    const fieldsToFocus = removeItems(
      form,
      ["parent1.0"],
      testCompilationContext
    );

    expect(fieldsToFocus).toEqual(["parent1.0"]);
    expect(form.mutators.remove).toHaveBeenCalledTimes(1);
    expect(form.mutators.remove).toHaveBeenNthCalledWith(1, "parent1", 0);
    expect(form.values).toEqual({
      _component: "parentTestComponent",
      parent1: [
        { _component: "testComponent", name: "child2" },
        { _component: "testComponent", name: "child3" },
        { _component: "testComponent", name: "child4" },
      ],
    });
  });

  it("removes single element when element is the middle child", () => {
    const form = createTestFormWithSingleParentElement();
    const fieldsToFocus = removeItems(
      form,
      ["parent1.1"],
      testCompilationContext
    );

    expect(fieldsToFocus).toEqual(["parent1.1"]);
    expect(form.mutators.remove).toHaveBeenCalledTimes(1);
    expect(form.mutators.remove).toHaveBeenNthCalledWith(1, "parent1", 1);
    expect(form.values).toEqual({
      _component: "parentTestComponent",
      parent1: [
        { _component: "testComponent", name: "child1" },
        { _component: "testComponent", name: "child3" },
        { _component: "testComponent", name: "child4" },
      ],
    });
  });

  it("removes single element when element is the last child", () => {
    const form = createTestFormWithSingleParentElement();
    const fieldsToFocus = removeItems(
      form,
      ["parent1.3"],
      testCompilationContext
    );

    expect(fieldsToFocus).toEqual(["parent1.2"]);
    expect(form.mutators.remove).toHaveBeenCalledTimes(1);
    expect(form.mutators.remove).toHaveBeenNthCalledWith(1, "parent1", 3);
    expect(form.values).toEqual({
      _component: "parentTestComponent",
      parent1: [
        { _component: "testComponent", name: "child1" },
        { _component: "testComponent", name: "child2" },
        { _component: "testComponent", name: "child3" },
      ],
    });
  });

  it("removes single element when element is the only child", () => {
    const form = createTestForm({
      initialValues: {
        _component: "parentTestComponent",
        parent1: [{ _component: "testTemplate", name: "child1" }],
      },
    });

    jest.spyOn(form, "change");

    const fieldsToFocus = removeItems(
      form,
      ["parent1.0"],
      testCompilationContext
    );

    expect(fieldsToFocus).toEqual([]);
    expect(form.mutators.remove).not.toHaveBeenCalled();
    expect(form.change).toHaveBeenCalledTimes(1);
    expect(form.change).toHaveBeenNthCalledWith(1, "parent1", []);
    expect(form.values).toEqual({
      _component: "parentTestComponent",
      parent1: [],
    });
  });

  it("removes multiple elements when elements are the first two", () => {
    const form = createTestFormWithSingleParentElement();
    const fieldsToFocus = removeItems(
      form,
      ["parent1.0", "parent1.1"],
      testCompilationContext
    );

    expect(fieldsToFocus).toEqual([]);
    expect(form.mutators.remove).toHaveBeenCalledTimes(2);
    expect(form.mutators.remove).toHaveBeenNthCalledWith(1, "parent1", 1);
    expect(form.mutators.remove).toHaveBeenNthCalledWith(2, "parent1", 0);
    expect(form.values).toEqual({
      _component: "parentTestComponent",
      parent1: [
        { _component: "testComponent", name: "child3" },
        { _component: "testComponent", name: "child4" },
      ],
    });
  });

  it("removes multiple elements when elements are the middle children", () => {
    const form = createTestFormWithSingleParentElement();
    const fieldsToFocus = removeItems(
      form,
      ["parent1.1", "parent1.2"],
      testCompilationContext
    );

    expect(fieldsToFocus).toEqual([]);
    expect(form.mutators.remove).toHaveBeenCalledTimes(2);
    expect(form.mutators.remove).toHaveBeenNthCalledWith(1, "parent1", 2);
    expect(form.mutators.remove).toHaveBeenNthCalledWith(2, "parent1", 1);
    expect(form.values).toEqual({
      _component: "parentTestComponent",
      parent1: [
        { _component: "testComponent", name: "child1" },
        { _component: "testComponent", name: "child4" },
      ],
    });
  });

  it("removes multiple elements when elements are the last two", () => {
    const form = createTestFormWithSingleParentElement();
    const fieldsToFocus = removeItems(
      form,
      ["parent1.2", "parent1.3"],
      testCompilationContext
    );

    expect(fieldsToFocus).toEqual([]);
    expect(form.mutators.remove).toHaveBeenCalledTimes(2);
    expect(form.mutators.remove).toHaveBeenNthCalledWith(1, "parent1", 3);
    expect(form.mutators.remove).toHaveBeenNthCalledWith(2, "parent1", 2);
    expect(form.values).toEqual({
      _component: "parentTestComponent",
      parent1: [
        { _component: "testComponent", name: "child1" },
        { _component: "testComponent", name: "child2" },
      ],
    });
  });

  it("removes multiple elements when elements are outermost", () => {
    const form = createTestFormWithSingleParentElement();
    const fieldsToFocus = removeItems(
      form,
      ["parent1.0", "parent1.3"],
      testCompilationContext
    );

    expect(fieldsToFocus).toEqual([]);
    expect(form.mutators.remove).toHaveBeenCalledTimes(2);
    expect(form.mutators.remove).toHaveBeenNthCalledWith(1, "parent1", 3);
    expect(form.mutators.remove).toHaveBeenNthCalledWith(2, "parent1", 0);
    expect(form.values).toEqual({
      _component: "parentTestComponent",
      parent1: [
        { _component: "testComponent", name: "child2" },
        { _component: "testComponent", name: "child3" },
      ],
    });
  });

  it("doesn't remove elements of type 'component' that're required", () => {
    const form = createTestForm({
      initialValues: {
        _component: "testComponentWithComponentFixed",
        fixedChild: [
          {
            _component: "testComponent",
            name: "child1",
          },
        ],
      },
    });

    const fieldsToFocus = removeItems(
      form,
      ["fixedChild.0"],
      testCompilationContext
    );

    expect(fieldsToFocus).toBeUndefined();
    expect(form.mutators.remove).toHaveBeenCalledTimes(0);
    expect(form.values).toEqual({
      _component: "testComponentWithComponentFixed",
      fixedChild: [
        {
          _component: "testComponent",
          name: "child1",
        },
      ],
    });
  });

  it("doesn't remove elements of type 'component' that is required", () => {
    const form = createTestForm({
      initialValues: {
        _component: "testComponentWithComponent",
        componentRequiredChild: [
          {
            _component: "testComponent",
            name: "child1",
          },
        ],
      },
    });

    const fieldsToFocus = removeItems(
      form,
      ["componentRequiredChild.0"],
      testCompilationContext
    );

    expect(fieldsToFocus).toBeUndefined();
    expect(form.mutators.remove).toHaveBeenCalledTimes(0);
    expect(form.values).toEqual({
      _component: "testComponentWithComponent",
      componentRequiredChild: [
        {
          _component: "testComponent",
          name: "child1",
        },
      ],
    });
  });

  it("does remove elements of type 'component' when it's not required", () => {
    const form = createTestForm({
      initialValues: {
        _component: "testComponentWithComponent",
        componentChild: [
          {
            _component: "testComponent",
            name: "child1",
          },
        ],
      },
    });

    jest.spyOn(form, "change");

    const fieldsToFocus = removeItems(
      form,
      ["componentChild.0"],
      testCompilationContext
    );

    expect(fieldsToFocus).toEqual([]);
    expect(form.change).toHaveBeenCalledTimes(1);
    expect(form.change).toHaveBeenNthCalledWith(1, "componentChild", []);
  });
});

describe("takeLastOfEachParent", () => {
  it.each`
    input                                                     | expectedOutput
    ${["data.1", "data.4", "data.2", "data.3"]}               | ${["data.4"]}
    ${["data.0", "data.0.item.0", "data.0.item.0.subitem.0"]} | ${["data.0", "data.0.item.0", "data.0.item.0.subitem.0"]}
  `("Should return last path of each parent", ({ input, expectedOutput }) => {
    const result = takeLastOfEachParent(input);
    expect(result).toEqual(expectedOutput);
  });
});

describe("shiftPath", () => {
  describe("downward", () => {
    it.each`
      shifting            | original            | expectedResult
      ${"data.0"}         | ${"data.1"}         | ${"data.2"}
      ${"data.0"}         | ${"data.1.child.0"} | ${"data.2.child.0"}
      ${"data.0.child.1"} | ${"data.0.child.2"} | ${"data.0.child.3"}
      ${"data.0.child.3"} | ${"data.1.child.1"} | ${"data.1.child.1"}
    `(
      "Should shift original path by one if shifting path if before the original",
      ({ shifting, original, expectedResult }) => {
        const result = shiftPath(original, shifting);
        expect(result).toEqual(expectedResult);
      }
    );

    it.each`
      shifting                                | original                                | expectedResult
      ${"data.1"}                             | ${"data.0"}                             | ${"data.0"}
      ${"data.0.child.3"}                     | ${"data.0.child.2"}                     | ${"data.0.child.2"}
      ${"data.2.child.1"}                     | ${"data.0"}                             | ${"data.0"}
      ${"data.0.Component.0.Stack.0.Items.3"} | ${"data.0.Component.0.Stack.0.Items.3"} | ${"data.0.Component.0.Stack.0.Items.3"}
      ${"data.1.Component.0.Stack.0.Items.0"} | ${"data.0.Component.0.Stack.0.Items.3"} | ${"data.0.Component.0.Stack.0.Items.3"}
    `(
      "Should NOT shift original path if shifting path if after original or lower in the tree",
      ({ shifting, original, expectedResult }) => {
        const result = shiftPath(original, shifting);
        expect(result).toEqual(expectedResult);
      }
    );
  });

  describe("upward", () => {
    it.each`
      shifting                                | original                                | expectedResult
      ${"data.0"}                             | ${"data.1"}                             | ${"data.0"}
      ${"data.0.Component.0.Stack.0.Items.1"} | ${"data.0.Component.0.Stack.0.Items.3"} | ${"data.0.Component.0.Stack.0.Items.2"}
    `("Should shift path upward", ({ shifting, original, expectedResult }) => {
      const result = shiftPath(original, shifting, "upward");
      expect(result).toEqual(expectedResult);
    });
  });
});

describe("pasteAction", () => {
  const pasteActionTestCompilationContext = { ...testCompilationContext };
  pasteActionTestCompilationContext.definitions.components = [
    ...testCompilationContext.definitions.components,
    {
      id: "$RootSection",
      type: ["root"],
      schema: [
        {
          prop: "data",
          type: "component-collection",
          accepts: ["section"],
        },
      ],
      pasteSlots: ["Component"],
    },
    {
      id: "$Grid",
      type: ["section"],
      schema: [
        {
          prop: "Component",
          type: "component",
          accepts: ["$GridCard"],
          required: true,
        },
      ],
      pasteSlots: ["Component"],
    },
    {
      id: "$GridCard",
      schema: [
        {
          prop: "Cards",
          type: "component-collection",
          accepts: ["card"],
        },
      ],
      pasteSlots: ["Cards"],
    },
    {
      id: "$BannerCard",
      type: ["card"],
      schema: [],
    },
    {
      id: "$ProductCard",
      type: ["card"],
      schema: [],
    },
    {
      id: "$CustomSection",
      type: ["section"],
      schema: [
        {
          prop: "Slot1",
          type: "component",
          accepts: ["customText"],
        },
        {
          prop: "Slot2",
          type: "component",
          accepts: ["customImage"],
        },
        {
          prop: "Slot3",
          type: "component-collection",
          accepts: ["customCard"],
        },
      ],
      pasteSlots: ["Slot1", "Slot2", "Slot3"],
    },
    {
      id: "$CustomText",
      type: ["customText"],
      schema: [],
    },
    {
      id: "$CustomImage",
      type: ["customImage"],
      schema: [],
    },
    {
      id: "$CustomCard",
      type: ["customCard", "card"],
      schema: [],
    },
    {
      id: "$VoidSection",
      type: ["section"],
      schema: [
        {
          prop: "VoidSlot",
          type: "component-collection",
          accepts: [],
        },
      ],
      pasteSlots: ["VoidSlot"],
    },
  ];

  describe("Paste single item into single destination", () => {
    it.each`
      item                                              | destination             | expectedInsertedPath
      ${{ _id: "id-2134", _component: "$BannerCard" }}  | ${"data.0"}             | ${"data.0.Component.0.Cards.0"}
      ${{ _id: "id-4444", _component: "$ProductCard" }} | ${"data.0.Component.0"} | ${"data.0.Component.0.Cards.0"}
      ${{ _id: "id-4444", _component: "$CustomCard" }}  | ${"data.1"}             | ${"data.1.Component.0.Cards.1"}
      ${{ _id: "id-456", _component: "$CustomCard" }}   | ${"data.1.Component.0"} | ${"data.1.Component.0.Cards.1"}
      ${{ _id: "id-1", _component: "$Grid" }}           | ${"data.0"}             | ${"data.1"}
      ${{ _id: "id-2", _component: "$Grid" }}           | ${"data.1"}             | ${"data.2"}
    `(
      "Paste $item into $destination",
      ({ item, destination, expectedInsertedPath }) => {
        const form = createTestForm({
          initialValues: {
            data: [
              {
                _component: "$Grid",
                Component: [
                  {
                    _component: "$GridCard",
                    Cards: [],
                  },
                ],
              },
              {
                _component: "$Grid",
                Component: [
                  {
                    _component: "$GridCard",
                    Cards: [{ _component: "$BannerCard" }],
                  },
                ],
              },
            ],
            _component: "$RootSection",
          },
        });

        const what = [item];
        const where = [destination];

        const result = pasteItems({
          what,
          where,
          pasteCommand: pasteManager(),
          resolveDestination: destinationResolver({
            form,
            context: testCompilationContext,
          }),
        });

        expect(result).toEqual([expectedInsertedPath]);

        const insertedItem = dotNotationGet(form.values, result?.[0] ?? "");
        expect(insertedItem._id).not.toEqual(item._id);
      }
    );
  });

  describe("Paste multiple items into single destination", () => {
    it.each`
      items                                                                                        | destination | expectedInsertedPaths
      ${[{ _id: "id-1", _component: "$CustomText" }, { _id: "id-2", _component: "$CustomImage" }]} | ${"data.0"} | ${["data.0.Slot1.0", "data.0.Slot2.0"]}
    `(
      "Paste $item into $destination",
      ({ items, destination, expectedInsertedPaths }) => {
        const form = createTestForm({
          initialValues: {
            data: [
              {
                _component: "$CustomSection",
                Slot1: [{ _id: "id-2", _component: "$CustomText" }],
                Slot2: [],
              },
            ],
            _component: "$RootSection",
          },
        });

        const what = items;
        const where = [destination];

        const result = pasteItems({
          what,
          where,
          pasteCommand: pasteManager(),
          resolveDestination: destinationResolver({
            form,
            context: testCompilationContext,
          }),
        });

        expect(result).toEqual(expectedInsertedPaths);
      }
    );
  });

  describe("Paste single item into multiple destinations", () => {
    it.each`
      item                                          | destinations                        | expectedInsertedPaths
      ${{ _id: "id-1", _component: "$CustomCard" }} | ${["data.0", "data.1.Component.0"]} | ${["data.0.Slot3.0", "data.1.Component.0.Cards.0"]}
    `(
      "Paste $item into $destination",
      ({ item, destinations, expectedInsertedPaths }) => {
        const form = createTestForm({
          initialValues: {
            data: [
              {
                _component: "$CustomSection",
                Slot1: [],
                Slot2: [],
                Slot3: [],
              },
              {
                _component: "$Grid",
                Component: [
                  {
                    _component: "$GridCard",
                    Cards: [],
                  },
                ],
              },
            ],
            _component: "$RootSection",
          },
        });

        const what = [item];
        const where = destinations;

        const result = pasteItems({
          what,
          where,
          pasteCommand: pasteManager(),
          resolveDestination: destinationResolver({
            form,
            context: testCompilationContext,
          }),
        });

        expect(result).toEqual(expectedInsertedPaths);

        const insertedItem1 = dotNotationGet(
          form.values,
          expectedInsertedPaths[0]
        );
        expect(insertedItem1._id).not.toEqual(item._id);

        const insertedItem2 = dotNotationGet(
          form.values,
          expectedInsertedPaths[1]
        );
        expect(insertedItem2._id).not.toEqual(item._id);
      }
    );
  });

  it.each`
    items                                                              | destination            | expectedInsertedPaths
    ${[{ _component: "$CustomText" }, { _component: "$CustomImage" }]} | ${"data.0"}            | ${["data.0"]}
    ${[{ _component: "$CustomText" }]}                                 | ${"data.0.VoidSlot.0"} | ${["data.0.VoidSlot.0"]}
  `(
    "Paste into destination that nothing can be paste into",
    ({ items, destination, expectedInsertedPaths }) => {
      const voidComponent = {
        _component: "$VoidSection",
        VoidSlot: [],
      };

      const form = createTestForm({
        initialValues: {
          data: [voidComponent],
          _component: "$RootSection",
        },
      });

      const what = items;
      const where = [destination];

      const result = pasteItems({
        what,
        where,
        pasteCommand: pasteManager(),
        resolveDestination: destinationResolver({
          form,
          context: testCompilationContext,
        }),
      });

      expect(result).toEqual(expectedInsertedPaths);

      const destinationComponent = dotNotationGet(form.values, "data.0");
      expect(destinationComponent).toEqual(voidComponent);
    }
  );
});

describe("logItems", () => {
  it("logs config values for given config paths", () => {
    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    const testForm = createTestFormWithSingleParentElement();

    logItems(testForm, ["parent1.0", "parent1.2"]);

    expect(logSpy).toHaveBeenCalledTimes(2);
    expect(logSpy).toHaveBeenNthCalledWith(1, "Config for", "parent1.0", {
      _component: "testComponent",
      name: "child1",
    });
    expect(logSpy).toHaveBeenNthCalledWith(2, "Config for", "parent1.2", {
      _component: "testComponent",
      name: "child3",
    });

    logSpy.mockRestore();
  });
});
