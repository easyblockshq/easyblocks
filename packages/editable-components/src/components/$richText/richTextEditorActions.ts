import {
  Component$$$SchemaProp,
  isSchemaPropAction,
  isSchemaPropActionTextModifier,
  isSchemaPropTextModifier,
  isTemplate,
  EditorContextType,
} from "@easyblocks/app-utils";
import { SchemaProp } from "@easyblocks/core";
import { nonNullable, uniqueId } from "@easyblocks/utils";
import {
  BaseRange,
  Editor,
  Node,
  NodeMatch,
  Path,
  Range,
  Text,
  Transforms,
} from "slate";
import { SetNonNullable } from "type-fest";
import { StandardActionStylesConfig } from "../../textModifiers/actionTextModifier";
import { RichTextComponentConfig } from "./$richText";
import { BlockElement, InlineWrapperElement } from "./$richText.types";
import { convertEditorValueToRichTextElements } from "./utils/convertEditorValueToRichTextElements";
import { getFocusedRichTextPartsConfigPaths } from "./utils/getFocusedRichTextPartsConfigPaths";
import { isElementInlineWrapperElement } from "./utils/isElementInlineWrapperElement";

type SelectedEditor = SetNonNullable<Editor, "selection">;

function isEditorSelection(editor: Editor): editor is SelectedEditor {
  return editor.selection !== null;
}

function updateSelection(
  editor: Editor,
  editorContext: EditorContextType,
  key: string,
  schemaProp: SchemaProp | Component$$$SchemaProp,
  ...values: Array<unknown>
):
  | {
      elements: RichTextComponentConfig["elements"][string];
      focusedRichTextParts: Array<string>;
    }
  | undefined {
  if (!isEditorSelection(editor)) {
    return;
  }

  if (
    isSchemaPropAction(schemaProp) ||
    isSchemaPropActionTextModifier(schemaProp) ||
    isSchemaPropTextModifier(schemaProp)
  ) {
    if (
      updateInlineWrapper(editor, editorContext, key, schemaProp, ...values)
    ) {
      return;
    }
  } else {
    if (values.length === 1) {
      // If `values` contains one element, we want to apply this value to all text nodes.
      Editor.addMark(editor, key, values[0]);
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

function updateInlineWrapper(
  editor: SelectedEditor,
  editorContext: EditorContextType,
  key: string,
  schemaProp: SchemaProp | Component$$$SchemaProp,
  ...values: Array<any>
): true | void {
  const isSelectionCollapsed = Range.isCollapsed(editor.selection);

  // Each time we perform any transform, the current `editor.selection` is going to change according to
  // last transformation that was applied. `rangeRef` allows us to track how given selection has changed
  // in response to all the transformation and apply it after we've finished.
  const selectionRef = Editor.rangeRef(editor, editor.selection, {
    affinity: "inward",
  });

  const isSingleValueUpdate = values.length === 1;

  if (isSingleValueUpdate) {
    const configValue = values[0];
    const isAddingOrUpdatingConfigValue = configValue.length === 1;

    if (isAddingOrUpdatingConfigValue) {
      if (isSelectionCollapsed) {
        if (
          !isSchemaPropAction(schemaProp) ||
          (isSchemaPropAction(schemaProp) && schemaProp.prop.startsWith("$"))
        ) {
          return true;
        }

        expandCurrentSelectionToWholeWrapperElement(editor);
        // Update selection ref manually because selection changes not made by transformations don't update ref.
        selectionRef.current = editor.selection;
      }

      const defaultActionTextModifier: StandardActionStylesConfig | undefined =
        editorContext.actions
          .getTemplates(["actionTextModifier"])
          .filter(isTemplate)
          .find((template) => template.isDefaultTextModifier)?.config as
          | StandardActionStylesConfig
          | undefined;

      if (!defaultActionTextModifier) {
        throw new Error("There is no default action text modifier defined!!!");
      }

      const selectedTextNodesOutsideInlineWrapperElements = Array.from(
        Editor.nodes<Text>(editor, {
          match: (n, p) =>
            Text.isText(n) &&
            n.text !== "" &&
            notNestedWithinElementOfType(
              editor,
              p,
              isElementInlineWrapperElement
            )(),
        })
      );

      const selectedInlineWrapperElementsRanges =
        getRangesForSelectedElementsOfType(
          editor,
          isElementInlineWrapperElement
        );

      Editor.withoutNormalizing(editor, () => {
        if (selectedInlineWrapperElementsRanges.length > 0) {
          selectedInlineWrapperElementsRanges.reverse().forEach((range) => {
            splitNodesByRange(editor, {
              range,
              match: isElementInlineWrapperElement,
            });
          });

          if (isSchemaPropAction(schemaProp)) {
            const currentActionTextModifier = Array.from(
              Editor.nodes<InlineWrapperElement>(editor, {
                match: isElementInlineWrapperElement,
              })
            )[0]?.[0].actionTextModifier;

            Transforms.setNodes(
              editor,
              {
                [key]: configValue,
                actionTextModifier: currentActionTextModifier ?? [
                  defaultActionTextModifier,
                ],
                textModifier: [],
              },
              {
                match: isElementInlineWrapperElement,
                at: selectionRef.current!,
              }
            );
          } else if (isSchemaPropTextModifier(schemaProp)) {
            Transforms.setNodes(
              editor,
              {
                [key]: configValue,
                action: [],
                actionTextModifier: [],
              },
              {
                match: isElementInlineWrapperElement,
                at: selectionRef.current!,
              }
            );
          } else if (isSchemaPropActionTextModifier(schemaProp)) {
            Transforms.setNodes(
              editor,
              {
                [key]: configValue,
              },
              {
                match: isElementInlineWrapperElement,
                at: selectionRef.current!,
              }
            );
          } else {
            throw new Error("Unhandled schema prop type");
          }
        }

        if (selectedTextNodesOutsideInlineWrapperElements.length > 0) {
          const wrapOptions: Parameters<(typeof Transforms)["wrapNodes"]>["2"] =
            {
              split: true,
              match: (n, p) =>
                Text.isText(n) &&
                n.text !== "" &&
                !isElementInlineWrapperElement(Node.parent(editor, p)),
              at: selectionRef.current!,
            };

          if (isSchemaPropAction(schemaProp)) {
            Transforms.wrapNodes(
              editor,
              {
                type: "inline-wrapper",
                children: [],
                id: uniqueId(),
                action: configValue,
                actionTextModifier: [defaultActionTextModifier],
                textModifier: [],
              },
              wrapOptions
            );
          } else if (isSchemaPropTextModifier(schemaProp)) {
            Transforms.wrapNodes(
              editor,
              {
                type: "inline-wrapper",
                children: [],
                id: uniqueId(),
                action: [],
                actionTextModifier: [],
                textModifier: configValue,
              },
              wrapOptions
            );
          } else {
            throw new Error("Unhandled schema prop type");
          }
        }
      });
    } else {
      // If we set `action` to an empty array and the current selection is collapsed we expand the selection
      // to the whole wrapper element because we can't remove action from single character. Users are going to
      // expect removing action from the whole element.
      if (isSelectionCollapsed) {
        if (isSchemaPropTextModifier(schemaProp)) {
          return true;
        }

        expandCurrentSelectionToWholeWrapperElement(editor);
        // Update selection ref manually because selection changes not made by transformations don't update ref.
        selectionRef.current = editor.selection;
      }

      const selectedActionElementsRanges = getRangesForSelectedElementsOfType(
        editor,
        isElementInlineWrapperElement
      );

      Editor.withoutNormalizing(editor, () => {
        selectedActionElementsRanges.reverse().forEach((range) => {
          splitNodesByRange(editor, {
            range,
            match: isElementInlineWrapperElement,
          });
        });

        Transforms.unwrapNodes(editor, {
          match: isElementInlineWrapperElement,
          at: selectionRef.current!,
        });
      });
    }

    const currentSelection = selectionRef.unref();

    if (currentSelection) {
      Transforms.select(editor, currentSelection);
    }
  }
}

function expandCurrentSelectionToWholeWrapperElement(editor: Editor) {
  const wrapperElement = Editor.above(editor, {
    match: isElementInlineWrapperElement,
  });

  // This should never happen because the text nodes are always put into the wrapper element but just in case if
  // something would go wrong we just bail out update.
  if (!wrapperElement) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "Trying to set, update or remove a wrapper from text element that isn't inside of wrapper element. This should never happen and your config is probably incorrect."
      );
    }

    return;
  }

  const [, path] = wrapperElement;

  Transforms.setSelection(editor, {
    anchor: Editor.start(editor, path),
    focus: Editor.end(editor, path),
  });
}

// Slate has a bug and doesn't correctly split nodes if the `at` is a range. When not specified it fallbacks
// to `editor.selection` which is also a range. To workaround it, we split node two times, using anchor and focus
// point. We start from the focus point to not reorder elements before the range.
function splitNodesByRange(
  editor: Editor,
  {
    range,
    match,
  }: {
    range: BaseRange;
    match: NodeMatch<Node>;
  }
) {
  Editor.withoutNormalizing(editor, () => {
    const rangeStartPathRef = Editor.pathRef(editor, range.anchor.path, {
      affinity: "backward",
    });
    const rangeEndPathRef = Editor.pathRef(editor, range.focus.path, {
      affinity: "forward",
    });

    Transforms.splitNodes(editor, {
      at: range.focus,
      match,
    });

    Transforms.splitNodes(editor, {
      at: range.anchor,
      match,
    });

    if (rangeStartPathRef.current && rangeEndPathRef.current) {
      const nextNodeFromStart = Editor.next(editor, {
        at: Editor.parent(editor, rangeStartPathRef.current)[1],
      });
      const previousNodeFromStart = Editor.previous(editor, {
        at: Editor.parent(editor, rangeEndPathRef.current)[1],
      });

      if (nextNodeFromStart && previousNodeFromStart) {
        Transforms.setSelection(editor, {
          anchor: Editor.start(editor, nextNodeFromStart[1]),
          focus: Editor.end(editor, previousNodeFromStart[1]),
        });
      }
    }

    rangeStartPathRef.unref();
    rangeEndPathRef.unref();
  });
}

function getRangesForSelectedElementsOfType(
  editor: SelectedEditor,
  matcher: (node: Node) => boolean
): Array<BaseRange> {
  const selectedElements = Array.from(
    Editor.nodes<InlineWrapperElement>(editor, {
      match: matcher,
    })
  );

  const selectedElementsRanges = selectedElements
    .map(([, path]) => {
      return Range.intersection(editor.selection, Editor.range(editor, path));
    })
    .filter<BaseRange>(nonNullable());

  return selectedElementsRanges;
}

function notNestedWithinElementOfType(
  editor: Editor,
  path: Path,
  match: (node: Node) => boolean
) {
  return () => {
    const parentPath = Path.parent(path);
    const parentNode = Node.get(editor, parentPath);

    return !match(parentNode);
  };
}
