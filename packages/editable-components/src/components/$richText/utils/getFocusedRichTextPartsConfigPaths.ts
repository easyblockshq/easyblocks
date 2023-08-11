import { Editor, Path, Range, Text } from "slate";

function getFocusedRichTextPartsConfigPaths(editor: Editor) {
  if (editor.selection !== null) {
    const isBackward = Range.isBackward(editor.selection);
    const anchorProperty = isBackward ? "focus" : "anchor";
    const focusProperty = isBackward ? "anchor" : "focus";
    const anchor = editor.selection[anchorProperty];
    const focus = editor.selection[focusProperty];

    const selectedTextNodes = Array.from(
      Editor.nodes<Text>(editor, {
        match: Text.isText,
      })
    );

    if (selectedTextNodes.length === 1) {
      const range = {
        start: anchor.offset,
        end: focus.offset,
      };

      const [textNode, textPath] = selectedTextNodes[0];

      return [buildFocusedRichTextPartConfigPath(textNode, textPath, range)];
    }

    const focusedRichTextPartsConfigPaths = selectedTextNodes
      .map(([textNode, textPath], textEntryIndex) => {
        if (textNode.text === "") {
          return null;
        }

        let range: { start: number; end: number } | null = null;

        if (textEntryIndex === 0) {
          range = {
            start: anchor.offset,
            end: textNode.text.length,
          };
        }

        if (textEntryIndex === selectedTextNodes.length - 1) {
          range = {
            start: 0,
            end: focus.offset,
          };
        }

        return buildFocusedRichTextPartConfigPath(textNode, textPath, range);
      })
      .filter<string>((configPath): configPath is string => {
        return configPath !== null;
      });

    return focusedRichTextPartsConfigPaths;
  }

  return [];
}

function buildFocusedRichTextPartConfigPath(
  textNode: Text,
  path: Path,
  range: { start: number; end: number } | null
) {
  let focusedRichTextPartConfigPath = path.join(".elements.");

  if (
    range !== null &&
    (isPartialSelection(range, textNode) || isCaretSelection(range))
  ) {
    focusedRichTextPartConfigPath += `.{${range.start},${range.end}}`;
  }

  return focusedRichTextPartConfigPath;
}

function isPartialSelection(
  range: { start: number; end: number },
  textNode: Text
) {
  return range.end - range.start !== textNode.text.length;
}

function isCaretSelection(range: { start: number; end: number }) {
  return range.end - range.start === 0;
}

export { getFocusedRichTextPartsConfigPaths };
