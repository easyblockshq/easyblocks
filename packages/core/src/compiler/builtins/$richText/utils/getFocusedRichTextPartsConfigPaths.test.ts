import * as Slate from "slate";
import { getFocusedRichTextPartsConfigPaths } from "./getFocusedRichTextPartsConfigPaths";

jest.spyOn(Slate.Range, "isBackward").mockReturnValue(false);

test("returns empty array when selection is null", () => {
  const { editor } = setup();

  expect(getFocusedRichTextPartsConfigPaths(editor)).toEqual([]);
});

test("returns single focused field when only one text node is selected", () => {
  const { editor, mockSelection, mockSelectedNodes } = setup();

  mockSelection({
    anchor: {
      offset: 0,
      path: [0, 0, 0],
    },
    focus: {
      offset: 5,
      path: [0, 0, 0],
    },
  });

  const { mockReset } = mockSelectedNodes([
    [{ text: "Lorem" } as Slate.Text, [0, 0, 0]],
  ]);

  expect(getFocusedRichTextPartsConfigPaths(editor)).toEqual([
    "0.elements.0.elements.0",
  ]);

  mockReset();
});

test("returns single focused field when only one text node is partially selected", () => {
  const { editor, mockSelection, mockSelectedNodes } = setup();

  mockSelection({
    anchor: {
      offset: 2,
      path: [0, 0, 0],
    },
    focus: {
      offset: 5,
      path: [0, 0, 0],
    },
  });

  const { mockReset } = mockSelectedNodes([
    [{ text: "Lorem" } as Slate.Text, [0, 0, 0]],
  ]);

  expect(getFocusedRichTextPartsConfigPaths(editor)).toEqual([
    "0.elements.0.elements.0.{2,5}",
  ]);

  mockReset();
});

test("returns multiple focused fields when multiple text nodes are selected", () => {
  const { editor, mockSelection, mockSelectedNodes } = setup();

  mockSelection({
    anchor: {
      offset: 0,
      path: [0, 0, 0],
    },
    focus: {
      offset: 4,
      path: [0, 0, 4],
    },
  });

  const { mockReset } = mockSelectedNodes([
    [{ text: "Lorem " } as Slate.Text, [0, 0, 0]],
    [{ text: "ipsum " } as Slate.Text, [0, 0, 1]],
    [{ text: "dolor " } as Slate.Text, [0, 0, 2]],
    [{ text: "sit " } as Slate.Text, [0, 0, 3]],
    [{ text: "amet" } as Slate.Text, [0, 0, 4]],
  ]);

  expect(getFocusedRichTextPartsConfigPaths(editor)).toEqual([
    "0.elements.0.elements.0",
    "0.elements.0.elements.1",
    "0.elements.0.elements.2",
    "0.elements.0.elements.3",
    "0.elements.0.elements.4",
  ]);

  mockReset();
});

test("returns multiple focused fields when multiple text nodes are selected and some are only partially selected", () => {
  const { editor, mockSelection, mockSelectedNodes } = setup();

  mockSelection({
    anchor: {
      offset: 3,
      path: [0, 0, 1],
    },
    focus: {
      offset: 3,
      path: [0, 0, 3],
    },
  });

  const { mockReset } = mockSelectedNodes([
    [{ text: "ipsum " } as Slate.Text, [0, 0, 1]],
    [{ text: "dolor " } as Slate.Text, [0, 0, 2]],
    [{ text: "sit " } as Slate.Text, [0, 0, 3]],
  ]);

  expect(getFocusedRichTextPartsConfigPaths(editor)).toEqual([
    "0.elements.0.elements.1.{3,6}",
    "0.elements.0.elements.2",
    "0.elements.0.elements.3.{0,3}",
  ]);

  mockReset();
});

function setup() {
  const editor = {
    children: [],
    selection: null,
  } as unknown as Slate.Editor;

  function mockSelection(selection: Slate.BaseSelection) {
    editor.selection = selection;
  }

  function mockSelectedNodes(nodes: Array<Slate.NodeEntry<Slate.Text>>) {
    function* nodesGenerator() {
      let index = 0;
      while (nodes[index]) {
        yield nodes[index++];
      }
    }

    return jest.spyOn(Slate.Editor, "nodes").mockImplementation(nodesGenerator);
  }

  return {
    editor,
    mockSelectedNodes,
    mockSelection,
  };
}
