import { ComponentConfig } from "@easyblocks/core";
import { dotNotationSet } from "@easyblocks/utils";
import { createEvent, fireEvent, render } from "@testing-library/react";
import React from "react";
import { Form } from "./form";
import { useEditorGlobalKeyboardShortcuts } from "./useEditorGlobalKeyboardShortcuts";

jest.spyOn(console, "error").mockImplementation();

function renderTestComponent(
  overrides: Partial<
    Parameters<typeof useEditorGlobalKeyboardShortcuts>["0"]
  > = {},
  wrapper?: React.JSXElementConstructor<{ children: React.ReactElement }>
) {
  const editorContext: Parameters<typeof useEditorGlobalKeyboardShortcuts> = [
    {
      definitions: {
        actions: [],
        components: [
          {
            id: "$component",
            schema: [],
            tags: [],
          },
        ],
        links: [],
        textModifiers: [],
      },
      actions: {
        notify: jest.fn(),
        insertItem: jest.fn(),
        openComponentPicker: jest.fn(),
        runChange: jest.fn((fn) => fn()),
        duplicateItems: jest.fn(),
        pasteItems: jest.fn(),
        moveItems: jest.fn(),
        removeItems: jest.fn(),
        replaceItems: jest.fn(),
        logSelectedItems: jest.fn(),
        getTemplates: jest.fn(),
        ...overrides.actions,
      },
      focussedField: overrides.focussedField ?? [],
      // @ts-expect-error We only need to mock `form.values`
      form: {
        values: {
          ...overrides.form?.values,
        },
      },
    },
  ];

  function TestComponent() {
    useEditorGlobalKeyboardShortcuts(...editorContext);
    return <span>TestComponent</span>;
  }

  return {
    ...render(<TestComponent />, {
      wrapper,
    }),
    editorContext: editorContext[0],
  };
}

test.each(["INPUT", "TEXTAREA", "SELECT"])(
  "no action should be invoked when event came from %s element",
  (tagName) => {
    const { editorContext } = renderTestComponent();

    fireEvent.keyDown(window.document.body, {
      target: {
        get() {
          return tagName;
        },
      },
    });

    Object.values(editorContext.actions).forEach((action) => {
      expect(action).not.toHaveBeenCalled();
    });
  }
);

test.each([
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "Delete",
  "Backspace",
])(
  "no action should be invoked when no field is selected and %s key was pressed",
  (key) => {
    const { editorContext } = renderTestComponent();

    fireEvent.keyDown(window.document.body, { key });

    Object.values(editorContext.actions).forEach((action) => {
      expect(action).not.toHaveBeenCalled();
    });
  }
);

test.each(["Enter", "A", "Space"])(
  "no action should be invoked when field is selected and not global shortcut was pressed",
  (key) => {
    const { editorContext } = renderTestComponent({
      focussedField: ["test"],
    });

    fireEvent.keyDown(window.document.body, { key });

    Object.values(editorContext.actions).forEach((action) => {
      expect(action).not.toHaveBeenCalled();
    });
  }
);

test('logs selected component config when "l" key is pressed', () => {
  const { editorContext } = renderTestComponent({
    focussedField: ["data.0"],
  });

  fireEvent.keyDown(window.document.body, { key: "l" });

  expect(editorContext.actions.logSelectedItems).toHaveBeenCalledTimes(1);
});

describe("remove", () => {
  it.each(["Delete", "Backspace"])(
    "removes field using %s key",
    (removeKey) => {
      const { editorContext } = renderTestComponent({
        focussedField: ["data.0"],
      });

      fireEvent.keyDown(window.document.body, { key: removeKey });

      expect(editorContext.actions.removeItems).toHaveBeenCalledTimes(1);
      expect(editorContext.actions.removeItems).toHaveBeenNthCalledWith(1, [
        "data.0",
      ]);
    }
  );
});

describe("move up", () => {
  const MOVE_UP_KEYS = ["ArrowUp", "ArrowLeft"] as const;

  it.each(MOVE_UP_KEYS)("moves up single element using %s key", (moveUpKey) => {
    const { editorContext } = renderTestComponent({
      focussedField: ["data.2"],
    });

    fireEvent.keyDown(window.document.body, { key: moveUpKey });

    expect(editorContext.actions.moveItems).toHaveBeenCalledTimes(1);
    expect(editorContext.actions.moveItems).toHaveBeenNthCalledWith(
      1,
      ["data.2"],
      "top"
    );
  });

  it.each(MOVE_UP_KEYS)(
    "moves up multiple element using %s key",
    (moveUpKey) => {
      const { editorContext } = renderTestComponent({
        focussedField: ["data.2", "data.1"],
      });

      fireEvent.keyDown(window.document.body, { key: moveUpKey });

      expect(editorContext.actions.moveItems).toHaveBeenCalledTimes(1);
      expect(editorContext.actions.moveItems).toHaveBeenNthCalledWith(
        1,
        ["data.2", "data.1"],
        "top"
      );
    }
  );
});

describe("move down", () => {
  const MOVE_DOWN_KEYS = ["ArrowDown", "ArrowRight"] as const;

  it.each(MOVE_DOWN_KEYS)(
    "moves down single element using %s key",
    (moveDownKey) => {
      const { editorContext } = renderTestComponent({
        focussedField: ["data.0"],
      });

      fireEvent.keyDown(window.document.body, { key: moveDownKey });

      expect(editorContext.actions.moveItems).toHaveBeenCalledTimes(1);
      expect(editorContext.actions.moveItems).toHaveBeenNthCalledWith(
        1,
        ["data.0"],
        "bottom"
      );
    }
  );

  it.each(MOVE_DOWN_KEYS)(
    "moves down multiple elements using %s key",
    (moveDownKey) => {
      const { editorContext } = renderTestComponent({
        focussedField: ["data.0", "data.1"],
      });

      fireEvent.keyDown(window.document.body, { key: moveDownKey });

      expect(editorContext.actions.moveItems).toHaveBeenCalledTimes(1);
      expect(editorContext.actions.moveItems).toHaveBeenNthCalledWith(
        1,
        ["data.0", "data.1"],
        "bottom"
      );
    }
  );
});

describe("copy", () => {
  it("Should not handle when no focussed fields", () => {
    renderTestComponent({
      focussedField: [],
    });

    const setData = jest.fn();

    jest
      .spyOn(window, "frameElement", "get")
      .mockReturnValue(document.createElement("iframe"));

    const copyEvent = createEvent.copy(window.document.body, {
      clipboardData: {
        setData,
      },
    });

    fireEvent(window.document.body, copyEvent);

    expect(setData).not.toHaveBeenCalled();
  });

  it("Should not handle when no outside iframe", () => {
    renderTestComponent({
      focussedField: ["data.0"],
    });

    const setData = jest.fn();

    const copyEvent = createEvent.copy(window.document.body, {
      clipboardData: {
        setData,
      },
    });

    jest.spyOn(window, "frameElement", "get").mockReturnValue(null);

    fireEvent(window.document.body, copyEvent);

    expect(setData).not.toHaveBeenCalled();
  });

  it("Should not handle copy event when inside richtext", () => {
    renderTestComponent({
      focussedField: ["data.0"],
    });

    const setData = jest.fn();

    jest
      .spyOn(window, "frameElement", "get")
      .mockReturnValue(document.createElement("iframe"));

    const fakeRichText = document.createElement("DIV");
    fakeRichText.setAttribute("tabindex", "-1");
    fakeRichText.setAttribute("role", "textbox");

    const span = document.createElement("SPAN");
    fakeRichText.appendChild(span);

    window.document.body.appendChild(fakeRichText);

    const copyEvent = createEvent.copy(span, {
      clipboardData: {
        setData,
      },
    });
    fakeRichText.focus();
    fireEvent(span, copyEvent);
    fakeRichText.remove();
    expect(setData).not.toHaveBeenCalled();
  });

  it.each`
    tag
    ${"input"}
    ${"select"}
    ${"textarea"}
  `("Should not handle copy event focused on $tag", ({ tag }) => {
    renderTestComponent({
      focussedField: ["data.0"],
    });

    const setData = jest.fn();

    jest
      .spyOn(window, "frameElement", "get")
      .mockReturnValue(document.createElement("iframe"));

    const element = document.createElement(tag);

    window.document.body.appendChild(element);

    const copyEvent = createEvent.copy(element, {
      clipboardData: {
        setData,
      },
    });

    fireEvent(element, copyEvent);

    expect(setData).not.toHaveBeenCalled();
  });

  it("Should handle copy", () => {
    const expectedData: ComponentConfig = { _template: "$component" };

    renderTestComponent({
      focussedField: ["data.0"],
      form: new Form({
        id: "",
        label: "",
        onSubmit() {},
        initialValues: {
          data: [expectedData],
        },
      }),
    });

    const setData = jest.fn();

    jest
      .spyOn(window, "frameElement", "get")
      .mockReturnValue(document.createElement("iframe"));

    const copyEvent = createEvent.copy(document.body, {
      clipboardData: {
        setData,
      },
    });

    fireEvent(document.body, copyEvent);

    expect(setData).toHaveBeenCalledWith(
      "text/x-shopstory",
      expect.stringMatching(JSON.stringify([expectedData]))
    );
  });
});

describe("cut", () => {
  it.each`
    focussedField           | data                           | expectedFormat        | expectedPayload
    ${["data.0"]}           | ${{ _template: "$component" }} | ${"text/x-shopstory"} | ${JSON.stringify([{ _template: "$component" }])}
    ${["data.0", "data.2"]} | ${{ _template: "$component" }} | ${"text/x-shopstory"} | ${JSON.stringify([{ _template: "$component" }, { _template: "$component" }])}
  `(
    "Should set serialized configs on clipbaordData and call cutAction",
    ({ focussedField, data, expectedFormat, expectedPayload }) => {
      const { editorContext } = renderTestComponent({
        focussedField,
        form: new Form({
          id: "",
          label: "",
          onSubmit() {},
          initialValues: {},
        }),
      });

      focussedField.forEach((focusedField: string) => {
        dotNotationSet(editorContext.form.values, focusedField, data);
      });

      const setData = jest.fn();

      jest
        .spyOn(window, "frameElement", "get")
        .mockReturnValue(document.createElement("iframe"));

      const cutEvent = createEvent.cut(window.document.body, {
        clipboardData: {
          setData,
        },
      });

      fireEvent(window.document.body, cutEvent);

      expect(setData).toHaveBeenCalledWith(
        expectedFormat,
        expect.stringMatching(expectedPayload)
      );
      expect(editorContext.actions.removeItems).toHaveBeenCalledWith(
        focussedField
      );
    }
  );
});

describe("paste", () => {
  it.each`
    focussedField           | data                 | expectedData
    ${["data.0"]}           | ${[{ value: 1337 }]} | ${[{ value: 1337 }]}
    ${["data.0", "data.2"]} | ${{ value: 3.14 }}   | ${[{ value: 3.14 }]}
  `(
    "Should call pasteAction with data from clipboard event",
    ({ focussedField, data, expectedData }) => {
      const { editorContext } = renderTestComponent({
        focussedField,
      });

      const getData = jest.fn().mockReturnValue(JSON.stringify(data));

      jest
        .spyOn(window, "frameElement", "get")
        .mockReturnValue(document.createElement("iframe"));

      const pasteEvent = createEvent.paste(window.document.body, {
        clipboardData: {
          getData,
        },
      });

      fireEvent(window.document.body, pasteEvent);

      expect(getData).toHaveBeenCalledWith("text/x-shopstory");
      expect(editorContext.actions.pasteItems).toHaveBeenCalledWith(
        expectedData
      );
    }
  );

  it.each`
    focussedField           | data
    ${["data.0"]}           | ${""}
    ${["data.0", "data.2"]} | ${null}
    ${["data.0", "data.2"]} | ${undefined}
  `(
    "Should NOT call pasteAction with empty data $data",
    ({ focussedField, data }) => {
      const { editorContext } = renderTestComponent({
        focussedField,
      });

      const getData = jest.fn().mockReturnValue(data);

      jest
        .spyOn(window, "frameElement", "get")
        .mockReturnValue(document.createElement("iframe"));

      const pasteEvent = createEvent.paste(window.document.body, {
        clipboardData: {
          getData,
        },
      });

      fireEvent(window.document.body, pasteEvent);

      expect(getData).toHaveBeenCalledWith("text/x-shopstory");
      expect(editorContext.actions.pasteItems).not.toHaveBeenCalled();
    }
  );

  it.each`
    focussedField           | data
    ${["data.0", "data.2"]} | ${"Not a valid JSON"}
    ${["data.0", "data.2"]} | ${"'[1, 2, 3, 4, ]'"}
    ${["data.0", "data.2"]} | ${'{"foo" : 1, }'}
  `(
    "Should NOT call pasteAction when data is not valid JSON ($data)",
    ({ focussedField, data }) => {
      const { editorContext } = renderTestComponent({
        focussedField,
      });

      const getData = jest.fn().mockReturnValue(data);

      jest
        .spyOn(window, "frameElement", "get")
        .mockReturnValue(document.createElement("iframe"));

      const pasteEvent = createEvent.paste(window.document.body, {
        clipboardData: {
          getData,
        },
      });

      fireEvent(window.document.body, pasteEvent);

      expect(getData).toHaveBeenCalledWith("text/x-shopstory");
      expect(editorContext.actions.pasteItems).not.toHaveBeenCalled();
    }
  );
});
