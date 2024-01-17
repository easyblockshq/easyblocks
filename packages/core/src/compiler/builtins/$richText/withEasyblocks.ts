import { deepCompare, keys, uniqueId } from "@easyblocks/utils";
import {
  Editor,
  NodeEntry,
  Range,
  Element as SlateElement,
  Node as SlateNode,
  Text,
  Transforms,
} from "slate";
import { RichTextBlockElementType } from "./$richTextBlockElement/$richTextBlockElement";

type ComparableText = Pick<Text, "color" | "font">;

/**
 * Tracks which ids were used during current normalization run
 */
const USED_IDS = new Set<string>();

/**
 * Keeps track what was the previous id before generating the unique id. This is needed because Slate rerenders before
 * our config updates and it wouldn't know which compiled component to render.
 */
export const NORMALIZED_IDS_TO_IDS = new Map<string, string>();

function withEasyblocks(editor: Editor): Editor {
  const { insertText, normalizeNode } = editor;

  editor.insertText = (text) => {
    // Verify if the current selection is placed at the end of an inline element. If yes, set the selection to start of
    // the next element before adding new text. This allows to break out from the inline element if it's placed at the end of line.
    if (editor.selection && Range.isCollapsed(editor.selection)) {
      const selectedNodeParent = Editor.parent(
        editor,
        editor.selection.focus.path
      );

      if (selectedNodeParent) {
        const [parentNode, parentNodePath] = selectedNodeParent;

        if (SlateElement.isElement(parentNode) && editor.isInline(parentNode)) {
          const isCursorSetAtTheEnd = Editor.isEnd(
            editor,
            editor.selection.focus,
            parentNodePath
          );

          const nodePointAfterInlineElement = Editor.after(
            editor,
            parentNodePath
          );

          if (isCursorSetAtTheEnd && nodePointAfterInlineElement) {
            Transforms.setSelection(editor, {
              anchor: nodePointAfterInlineElement,
              focus: nodePointAfterInlineElement,
            });
          }
        }
      }
    }

    insertText(text);
  };

  editor.normalizeNode = (entry) => {
    // When copying text content from content editable element, Slate wraps pasted content into top most element.
    // We need to unwrap each block element that is nested within another block element.
    if (unwrapBlockElementsNestedWithinBlockElement(editor, entry)) {
      return;
    }

    // if (
    //   (() => {
    //     const [node, path] = entry;

    //     if (
    //       SlateElement.isElement(node) &&
    //       (node.type === "text-line" || node.type === "list-item")
    //     ) {
    //       let currentTextChildWithAction: Text | null = null;

    //       for (const [childNode] of SlateNode.texts(editor, {
    //         from: path,
    //         to: path,
    //       })) {
    //         if (childNode.action.length > 0 && !currentTextChildWithAction) {
    //           if (currentTextChildWithAction === null) {
    //             currentTextChildWithAction = childNode;
    //             continue;
    //           }
    //         }

    //         if (childNode.action.length > 0 && currentTextChildWithAction) {
    //           Transforms.setNodes(editor, {
    //             color: currentTextChildWithAction.color,
    //             font: currentTextChildWithAction.font,
    //           });

    //           return true;
    //         } else {
    //           currentTextChildWithAction = null;
    //         }
    //       }
    //     }

    //     return false;
    //   })()
    // ) {
    //   return;
    // }

    // Slate by default compares text elements and merges them, but to compare them it uses strict equality comparison algorithm.
    // We need to compare them using our own algorithm.
    if (mergeVisuallyTheSameOrEmptyTextNodes(editor, entry)) {
      return;
    }

    // if (normalizeEmptyTextNodesAfterInlineElements(editor, entry)) {
    //   return;
    // }

    // Rich text and its elements contains collections. Each item of collection should have unique id.
    if (updateNonUniqueIds(editor, entry)) {
      return;
    }

    // Slate normalizes fields from deepest to lowest. The lowest element is editor element which has empty path.
    if (entry[1].length === 0) {
      USED_IDS.clear();
    }

    normalizeNode(entry);
  };

  return editor;
}

export { withEasyblocks };

function unwrapBlockElementsNestedWithinBlockElement(
  editor: Editor,
  entry: NodeEntry<SlateNode>
): boolean {
  const [node, path] = entry;

  if (
    SlateElement.isElement(node) &&
    // This cast is fine since `RichTextBlockElementType` overlaps with type of `node.type`.
    ["bulleted-list", "numbered-list", "paragraph"].includes(
      node.type as RichTextBlockElementType
    )
  ) {
    const nodeParent = SlateNode.parent(editor, path);

    if (SlateElement.isElement(nodeParent)) {
      if (nodeParent.type === node.type) {
        Transforms.unwrapNodes(editor, { at: path });
        return true;
      }

      // For now there is only one case where block element can be nested within block element of different type,
      // it can happen while pasting content from one $richText to another. We want to keep the type of pasted content
      // so instead of unwrapping nodes, we lift them one level up.
      if (
        nodeParent.type !== node.type &&
        ["bulleted-list", "numbered-list", "paragraph"].includes(
          nodeParent.type as RichTextBlockElementType
        )
      ) {
        Transforms.liftNodes(editor, { at: path });
        return true;
      }
    }
  }

  return false;
}

function updateNonUniqueIds(
  editor: Editor,
  entry: NodeEntry<SlateNode>
): boolean {
  const [node, path] = entry;

  if (Text.isText(node) || SlateElement.isElement(node)) {
    if (USED_IDS.has(node.id)) {
      const newId = uniqueId();
      NORMALIZED_IDS_TO_IDS.set(newId, node.id);
      Transforms.setNodes(
        editor,
        {
          id: newId,
        },
        {
          at: path,
          match: (n) =>
            (Text.isText(n) || SlateElement.isElement(n)) && n.id === node.id,
        }
      );
      return true;
    } else {
      USED_IDS.add(node.id);
    }
  }

  return false;
}

function mergeVisuallyTheSameOrEmptyTextNodes(
  editor: Editor,
  entry: NodeEntry<SlateNode>
): boolean {
  const [node, path] = entry;

  if (
    SlateElement.isElement(node) &&
    (node.type === "text-line" || node.type === "list-item")
  ) {
    const textLineChildren = Array.from(SlateNode.children(editor, path));

    if (textLineChildren.length > 1) {
      for (
        let childIndex = 0;
        childIndex < textLineChildren.length - 1;
        childIndex++
      ) {
        const [currentChildNode, currentChildPath] =
          textLineChildren[childIndex];
        const [nextChildNode, nextChildPath] = textLineChildren[childIndex + 1];

        if (Text.isText(currentChildNode) && Text.isText(nextChildNode)) {
          if (
            compareText(currentChildNode, nextChildNode) ||
            (nextChildNode.text.trim() === "" &&
              childIndex + 1 < textLineChildren.length - 1)
          ) {
            Transforms.mergeNodes(editor, {
              at: nextChildPath,
              match: (node) => Text.isText(node),
            });

            return true;
          }

          // `Transforms.mergeNodes` always merges node/nodes at given position into PREVIOUS node.
          // In this case, we want to merge node at current position into next one.
          if (currentChildNode.text === "" && nextChildNode !== undefined) {
            Transforms.setNodes(
              editor,
              {
                color: nextChildNode.color,
                font: nextChildNode.font,
              },
              {
                at: currentChildPath,
                match: (node) => Text.isText(node),
              }
            );
          }
        }
      }
    }
  }

  return false;
}

// This function might be useful in the future, but right now it's not needed.

// Slate normalization rules states that an inline element cannot be first or last child of block element.
// Slate during its own normalization will add empty Text nodes before or/and after inline element.
// Those Text nodes will be missing properties we add during constructing Slate value based on Shopstory config
// thus it will make compilation error because of missing schema prop values.
// function normalizeEmptyTextNodesAfterInlineElements(
//   editor: Editor,
//   entry: NodeEntry<SlateNode>
// ): boolean {
//   const [node, path] = entry;

//   if (
//     SlateElement.isElement(node) &&
//     (node.type === "text-line" || node.type === "list-item")
//   ) {
//     for (let index = 0; index < node.children.length; index++) {
//       const childNode = node.children[index];
//       const previousNode = node.children[index - 1];
//       const nextNode = node.children[index + 1];

//       if (
//         previousNode &&
//         nextNode &&
//         isElementInlineWrapperElement(previousNode) &&
//         isElementInlineWrapperElement(nextNode)
//       ) {
//         if (Text.isText(childNode) && childNode.text === "") {
//           Transforms.removeNodes(editor, {
//             at: [...path, index],
//           });
//           return true;
//         }
//       }

//       if (
//         childNode &&
//         nextNode &&
//         isElementInlineWrapperElement(childNode) &&
//         isElementInlineWrapperElement(nextNode)
//       ) {
//         const nextNodePath = [...path, index + 1];

//         Transforms.mergeNodes(editor, {
//           at: nextNodePath,
//         });

//         return true;
//       }
//     }
//   }

//   return false;
// }

function filterNonComparableProperties(obj: Text): ComparableText {
  return keys(obj)
    .filter<keyof ComparableText>((key): key is keyof ComparableText =>
      ["color", "font", "textModifier", "action"].includes(key)
    )
    .reduce((filteredObject, currentKey) => {
      filteredObject[currentKey] = obj[currentKey];
      return filteredObject;
    }, {} as ComparableText);
}

function compareText(text1: Text, text2: Text): boolean {
  let areEqual = true;

  const part1Keys = keys(filterNonComparableProperties(text1));
  const part2Keys = keys(filterNonComparableProperties(text2));

  if (part1Keys.length !== part2Keys.length) {
    return false;
  }

  for (let index = 0; index < part1Keys.length; index++) {
    const key = part1Keys[index];
    const part1Value = text1[key];
    const part2Value = text2[key];
    const areValuesEqual = deepCompare(part1Value, part2Value);

    if (!areValuesEqual) {
      areEqual = false;
      break;
    }
  }

  return areEqual;
}
