import { nonNullable } from "@easyblocks/utils";
import { BaseRange, Editor, Node, Range, Text, Transforms } from "slate";
import { SetNonNullable } from "type-fest";
import { RichTextComponentConfig } from "./$richText";
import { BlockElement } from "./$richText.types";
import { RichTextPartComponentConfig } from "./$richTextPart/$richTextPart";
import { convertEditorValueToRichTextElements } from "./utils/convertEditorValueToRichTextElements";
import { getFocusedRichTextPartsConfigPaths } from "./utils/getFocusedRichTextPartsConfigPaths";

type SelectedEditor = SetNonNullable<Editor, "selection">;

function isEditorSelection(editor: Editor): editor is SelectedEditor {
  return editor.selection !== null;
}

function updateSelection<
  T extends keyof Omit<
    RichTextPartComponentConfig,
    "$$$refs" | "_id" | "_template" | "value"
  >
>(
  editor: Editor,
  key: T,
  ...values: Array<RichTextPartComponentConfig[T]>
):
  | {
      elements: RichTextComponentConfig["elements"][string];
      focusedRichTextParts: Array<string>;
    }
  | undefined {
  if (!isEditorSelection(editor)) {
    return;
  }

  const isSelectionCollapsed = Range.isCollapsed(editor.selection);

  if (values.length === 1) {
    if (key === "TextWrapper" && isSelectionCollapsed) {
      expandCurrentSelectionToWholeTextPart(editor);
    }

    // If `values` contains one element, we want to apply this value to all text nodes.
    Editor.addMark(editor, key, values[0]);

    if (key === "TextWrapper") {
      if (values[0].length > 0) {
        const firstSelectedNodeEntry = Node.first(
          editor,
          editor.selection.anchor.path
        );

        const lastSelectedNodeEntry = Node.last(
          editor,
          editor.selection.focus.path
        );

        if (Text.isText(firstSelectedNodeEntry[0])) {
          const firstSelectedNode = firstSelectedNodeEntry[0];
          const lastSelectedNode = lastSelectedNodeEntry[0];

          if (firstSelectedNode !== lastSelectedNode) {
            Transforms.setNodes(
              editor,
              {
                color: firstSelectedNode.color,
                font: firstSelectedNode.font,
              },
              {
                match: Text.isText,
              }
            );
          }
        }
      }
    }
  } else {
    // If `values` contains multiple values, we want to update each selected text node separately with its
    // corresponding value. To do that, we need to obtain selection range for each selected text node
    // and apply correct value.
    const selectedTextNodeEntries = Array.from(
      Editor.nodes<Text>(editor, {
        match: Text.isText,
      })
    );

    const selectedTextNodesRanges = selectedTextNodeEntries
      .map(([, textNodePath]) => {
        return Range.intersection(
          editor.selection,
          Editor.range(editor, textNodePath)
        );
      })
      .filter<BaseRange>(nonNullable());

    Editor.withoutNormalizing(editor, () => {
      selectedTextNodesRanges.reverse().forEach((range, index) => {
        Transforms.setNodes(
          editor,
          {
            [key]: values[index],
          },
          {
            at: range,
            match: Text.isText,
            split: true,
          }
        );
      });
    });
  }

  const richTextElements = convertEditorValueToRichTextElements(
    editor.children as Array<BlockElement>
  );

  const newFocusedRichTextParts = getFocusedRichTextPartsConfigPaths(editor);

  return {
    elements: richTextElements,
    focusedRichTextParts: newFocusedRichTextParts,
  };
}

export { updateSelection };

function expandCurrentSelectionToWholeTextPart(editor: Editor) {
  const textPartPath = Editor.path(editor, editor.selection!.anchor.path);

  Transforms.setSelection(editor, {
    anchor: Editor.start(editor, textPartPath),
    focus: Editor.end(editor, textPartPath),
  });
}
