import {
  Alignment,
  compileBox,
  duplicateConfig,
  getBoxStyles,
  getDevicesWidths,
  responsiveValueFill,
  RichTextChangedEvent,
} from "@easyblocks/app-utils";
import {
  Devices,
  getFallbackForLocale,
  ResponsiveValue,
} from "@easyblocks/core";
import { deepClone, deepCompare, dotNotationGet } from "@easyblocks/utils";
import throttle from "lodash/throttle";
import React, {
  cloneElement,
  CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  BaseSelection,
  createEditor,
  Descendant,
  Editor,
  NodeEntry,
  Range,
  Text as SlateText,
  Transforms,
} from "slate";
import type {
  RenderElementProps,
  RenderLeafProps,
  RenderPlaceholderProps,
} from "slate-react";
import { Editable, ReactEditor, Slate, withReact } from "slate-react";
import { CompiledShopstoryComponentProps } from "../../types";
import type { RichTextComponentConfig } from "./$richText";
import {
  RICH_TEXT_CONFIG_SYNC_THROTTLE_TIMEOUT,
  RICH_TEXT_FOCUSED_FIELDS_SYNC_THROTTLE_TIMEOUT,
} from "./$richText.constants";
import { BlockElement } from "./$richText.types";
import { RichTextBlockElementCompiledComponentConfig } from "./$richTextBlockElement/$richTextBlockElement";
import { getAbsoluteRichTextPartPath } from "./getAbsoluteRichTextPartPath";
import { updateSelection } from "./richTextEditorActions";
import { convertEditorValueToRichTextElements } from "./utils/convertEditorValueToRichTextElements";
import { convertRichTextElementsToEditorValue } from "./utils/convertRichTextElementsToEditorValue";
import { createTemporaryEditor } from "./utils/createTemporaryEditor";
import { extractElementsFromCompiledComponents } from "./utils/extractElementsFromCompiledComponents";
import { extractTextPartsFromCompiledComponents } from "./utils/extractTextPartsFromCompiledComponents";
import { getEditorSelectionFromFocusedFields } from "./utils/getEditorSelectionFromFocusedFields";
import { getFocusedFieldsFromSlateSelection } from "./utils/getFocusedFieldsFromSlateSelection";
import { getFocusedRichTextPartsConfigPaths } from "./utils/getFocusedRichTextPartsConfigPaths";
import { getRichTextComponentConfigFragment } from "./utils/getRichTextComponentConfigFragment";
import { isElementInlineWrapperElement } from "./utils/isElementInlineWrapperElement";
import { NORMALIZED_IDS_TO_IDS, withShopstory } from "./withShopstory";

function mapAlignmentToFlexAlignment(align: Alignment) {
  if (align === "center") {
    return "center";
  }

  if (align === "right") {
    return "flex-end";
  }

  return "flex-start";
}

interface RichTextProps {
  __fromEditor: {
    path: string;
    components: {
      elements: Array<
        React.ReactElement<{
          compiled: RichTextBlockElementCompiledComponentConfig;
        }>
      >;
    };
    props: {
      align: ResponsiveValue<Alignment>;
    };
    runtime: CompiledShopstoryComponentProps["__fromEditor"]["runtime"];
  };
}

function RichText(props: RichTextProps) {
  const { editorContext } = window.parent.editorWindowAPI;

  const {
    actions,
    contextParams,
    form,
    focussedField,
    locales,
    setFocussedField,
  } = editorContext;

  const { path } = props.__fromEditor;
  const { Box, resop, stitches } = props.__fromEditor.runtime;

  let richTextConfig: RichTextComponentConfig = dotNotationGet(
    form.values,
    path
  );

  const [editor] = useState(() => withShopstory(withReact(createEditor())));

  const localizedRichTextElements =
    richTextConfig.elements[contextParams.locale];

  const fallbackRichTextElements = getFallbackForLocale(
    richTextConfig.elements,
    contextParams.locale,
    locales
  );

  const richTextElements =
    localizedRichTextElements ?? fallbackRichTextElements;

  const richTextElementsConfigPath = `${path}.elements.${contextParams.locale}`;

  const [editorValue, setEditorValue] = useState(() =>
    convertRichTextElementsToEditorValue(richTextElements)
  );

  // If rich text has no value, we initialize it with default config by updating it during first render
  // This is only possible when we open entry for non main locale without fallback, this is total edge case
  if (richTextElements.length === 0 && !fallbackRichTextElements) {
    // We only want to show rich text for default config within this component, we don't want to update raw content
    // To prevent implicit update of raw content we make a deep copy.
    richTextConfig = deepClone(richTextConfig);
    richTextConfig.elements[contextParams.locale] =
      convertEditorValueToRichTextElements(editorValue);
  }

  /**
   * Controls the visibility of decoration imitating browser selection of
   * the selected text after the user has blurred the content editable element.
   */
  const [isDecorationActive, setIsDecorationActive] = useState(false);
  /**
   * Keeps track what caused last change to editor value.
   * This is used in two cases:
   * - text-only changes of editable content shouldn't trigger update of `editor.children` ("text-input")
   * - changes from outside of editable content shouldn't trigger writing to editor's history within change callback ("external")
   */
  const lastChangeReason = useRef<"external" | "text-input" | "paste">(
    "text-input"
  );
  const [isEnabled, setIsEnabled] = useState(false);
  const previousRichTextComponentConfig = useRef<RichTextComponentConfig>();

  const isConfigChanged = !isConfigEqual(
    previousRichTextComponentConfig.current,
    richTextConfig
  );

  if (previousRichTextComponentConfig.current && isConfigChanged) {
    if (lastChangeReason.current !== "paste") {
      lastChangeReason.current = "external";
    }

    previousRichTextComponentConfig.current = richTextConfig;
    const nextEditorValue =
      convertRichTextElementsToEditorValue(richTextElements);
    // React bails out the render if state setter function is invoked within render.
    // Doing it makes Slate always up-to date with the latest config if it's changed from outside.
    // https://reactjs.org/docs/hooks-faq.html#how-do-i-implement-getderivedstatefromprops
    setEditorValue(nextEditorValue);
    editor.children = nextEditorValue;

    const editorSelection = getEditorSelectionFromFocusedFields(
      focussedField,
      form
    );

    // Slate gives us two methods to update its selection:
    // - `setSelection` updates current selection, so `editor.selection` must be not null
    // - `select` sets the selection, so `editor.selection` must be null
    if (editorSelection !== null && editor.selection !== null) {
      Transforms.setSelection(editor, editorSelection);
    } else if (editorSelection !== null && editor.selection === null) {
      Transforms.select(editor, editorSelection);
    } else {
      Transforms.deselect(editor);
    }
  }

  useEffect(() => {
    // We set previous value of rich text only once, then we manually assign it when needed.
    previousRichTextComponentConfig.current = richTextConfig;
  }, []);

  useEffect(
    // Component is blurred when the user selects other component in editor. This is different from blurring content editable.
    // Content editable can be blurred, but the component can remain active ex. we select some text within content editable
    // and want to update its color from the sidebar.
    function handleRichTextBlur() {
      const isRichTextActive = focussedField.some((focusedField) =>
        focusedField.startsWith(path)
      );

      if (!isRichTextActive && isEnabled) {
        setIsEnabled(false);
      }

      if (!editor.selection) {
        return;
      }

      if (!isRichTextActive) {
        Transforms.deselect(editor);

        const isSlateValueEmpty = isEditorValueEmpty(
          editor.children as Array<BlockElement>
        );

        // When value for current locale is empty we want to show value from fallback value instead of placeholder
        // if the fallback value is present.
        if (isSlateValueEmpty && fallbackRichTextElements !== undefined) {
          const nextRichTextElement = deepClone(richTextConfig);
          delete nextRichTextElement.elements[contextParams.locale];
          editor.children = convertRichTextElementsToEditorValue(
            fallbackRichTextElements
          );
          form.change(path, nextRichTextElement);
        }
      }
    },
    [focussedField, isEnabled]
  );

  useEffect(() => {
    // If editor has been refocused and it was blurred earlier we have to disable the decoration to show only browser selection
    if (ReactEditor.isFocused(editor) && isDecorationActive) {
      setIsDecorationActive(false);
    }
  });

  useEffect(() => {
    function handleRichTextChanged(event: RichTextChangedEvent) {
      if (!editor.selection) {
        return;
      }

      if (event.data.type === "@shopstory-editor/rich-text-changed") {
        const { payload } = event.data;
        const { editorContext } = window.parent.editorWindowAPI;

        // Slate is an uncontrolled component and we don't have an easy access to control it.
        // It keeps its state internally and on each change we convert this state to our Shopstory format.
        // This works great because changing content of editable element is easy, we append or remove things.
        // When we change the color/font of selected text there are many questions:
        // - is the current selection partial or does it span everything?
        // - how to split text chunks when selection is partial?
        // - how to update selection?
        //
        // `Editor.addMark` method automatically will split (or not) text chunks, update selection etc.
        // It will just do all the painful things. After the Slate do its job, we take its current state after the update
        // and convert it to Shopstory config and correct focused fields.
        const temporaryEditor = createTemporaryEditor(editor);

        const updateSelectionResult = updateSelection(
          temporaryEditor,
          editorContext,
          payload.prop,
          payload.schemaProp,
          ...payload.values
        );

        if (!updateSelectionResult) {
          return;
        }

        actions.runChange(() => {
          const newRichTextElement: RichTextComponentConfig = {
            ...richTextConfig,
            elements: {
              ...richTextConfig.elements,
              [editorContext.contextParams.locale]:
                updateSelectionResult.elements,
            },
          };

          form.change(path, newRichTextElement);

          const newFocusedFields =
            updateSelectionResult.focusedRichTextParts.map(
              (focusedRichTextPart) =>
                getAbsoluteRichTextPartPath(
                  focusedRichTextPart,
                  path,
                  editorContext.contextParams.locale
                )
            );

          return newFocusedFields;
        });
      }
    }

    window.addEventListener("message", handleRichTextChanged);

    return () => {
      window.removeEventListener("message", handleRichTextChanged);
    };
  }, [richTextConfig, path]);

  const decorate = createTextSelectionDecorator(editor, { isDecorationActive });
  const Elements = extractElementsFromCompiledComponents(props.__fromEditor);

  function renderElement({
    attributes,
    children,
    element,
  }: RenderElementProps) {
    const Element = Elements.find(
      (Element) =>
        Element._id === element.id ||
        NORMALIZED_IDS_TO_IDS.get(element.id) === Element._id
    );

    if (!Element) {
      // This can only happen if the current locale has no value and has no fallback
      if (Elements.length === 0) {
        if (element.type === "list-item") {
          return (
            <div {...attributes}>
              <div>{children}</div>
            </div>
          );
        }

        return <div {...attributes}>{children}</div>;
      }

      throw new Error("Missing element");
    }

    const compiledStyles = (() => {
      if (Element._template === "$richTextBlockElement") {
        if (Element.props.type === "bulleted-list") {
          return Element.styled.BulletedList;
        } else if (Element.props.type === "numbered-list") {
          return Element.styled.NumberedList;
        } else if (Element.props.type === "paragraph") {
          return Element.styled.Paragraph;
        }
      } else if (Element._template === "$richTextLineElement") {
        if (element.type === "text-line") {
          return Element.styled.TextLine;
        } else if (element.type === "list-item") {
          return Element.styled.ListItem;
        }
      } else if (Element._template === "$richTextInlineWrapperElement") {
        return Element.styled.Link;
      }
    })();

    if (compiledStyles === undefined) {
      throw new Error("Unknown element type");
    }

    const ElementComponent = (
      <Box
        __compiled={compiledStyles}
        devices={props.__fromEditor.runtime.devices}
        stitches={props.__fromEditor.runtime.stitches}
      />
    );

    return cloneElement(
      ElementComponent,
      {
        ...attributes,
        // Element annotation for easier debugging
        ...(process.env.NODE_ENV === "development" && {
          "data-shopstory-element-type": element.type,
          "data-shopstory-id": element.id,
        }),
      },
      element.type === "list-item" ? <div>{children}</div> : children
    );
  }

  const TextParts = extractTextPartsFromCompiledComponents(props.__fromEditor);

  function renderLeaf({ attributes, children, leaf }: RenderLeafProps) {
    let TextPart = TextParts.find((TextPart) => {
      return TextPart._id === leaf.id;
    });

    if (!TextPart) {
      TextPart = TextParts.find((TextPart) => {
        return NORMALIZED_IDS_TO_IDS.get(leaf.id) === TextPart._id;
      });
    }

    if (!TextPart) {
      // This can only happen if the current locale has no value and has no fallback
      if (TextParts.length === 0) {
        return <span {...attributes}>{children}</span>;
      }

      throw new Error("Missing part");
    }

    const TextPartComponent = (
      <Box
        __compiled={TextPart.styled.Text}
        devices={props.__fromEditor.runtime.devices}
        stitches={props.__fromEditor.runtime.stitches}
      />
    );

    const style: CSSProperties = {
      // Fixes bug in Chrome and Edge (Chromium based) where user cannot place selection on text node
      // if the inline element is at the end of line.
      // https://github.com/ianstormtaylor/slate/issues/4704#issuecomment-1006696364
      paddingRight: "0.001em",
    };

    if (leaf.isHighlighted) {
      style.backgroundColor =
        leaf.highlightType === "text" ? "#B4D5FE" : "#ffff56";
    }

    return cloneElement(
      TextPartComponent,
      {
        ...attributes,
        style,
        // Element annotation for easier debugging
        ...(process.env.NODE_ENV === "development" && {
          "data-shopstory-element-type": "text",
          "data-shopstory-id": leaf.id,
        }),
      },
      children
    );
  }

  // Setting `display: flex` for element's aligning on `Editable` component makes default styles
  // of placeholder insufficient thus they require to explicitly set `top` and `left`.
  function renderPlaceholder({ attributes, children }: RenderPlaceholderProps) {
    return (
      <span
        {...attributes}
        style={{
          ...attributes.style,
          top: 0,
          left: 0,
        }}
      >
        {children}
      </span>
    );
  }

  const scheduleConfigSync = useCallback(
    throttle((nextValue: Array<BlockElement>) => {
      setEditorValue(nextValue);
      const nextElements = convertEditorValueToRichTextElements(nextValue);

      actions.runChange(() => {
        const newRichTextElement: RichTextComponentConfig = {
          ...richTextConfig,
          elements: {
            ...richTextConfig.elements,
            [editorContext.contextParams.locale]: nextElements,
          },
        };

        form.change(path, newRichTextElement);
        previousRichTextComponentConfig.current = newRichTextElement;

        if (editor.selection) {
          const nextFocusedFields = getFocusedFieldsFromSlateSelection(
            editor,
            path,
            contextParams.locale
          );

          return nextFocusedFields;
        }
      });
    }, RICH_TEXT_CONFIG_SYNC_THROTTLE_TIMEOUT),
    [isConfigChanged, editorContext.contextParams.locale]
  );

  const scheduleFocusedFieldsChange = useCallback(
    // Slate internally throttles the invocation of DOMSelectionChange for performance reasons.
    // We also throttle update of our focused fields state for the same reason.
    // This gives us a good balance between perf and showing updated fields within the sidebar.
    throttle((focusedFields: Parameters<typeof setFocussedField>[0]) => {
      setFocussedField(focusedFields);
    }, RICH_TEXT_FOCUSED_FIELDS_SYNC_THROTTLE_TIMEOUT),
    [setFocussedField]
  );

  function handleEditableChange(value: Array<Descendant>): void {
    if (!isEnabled) {
      return;
    }

    // Editor's value can be changed from outside ex. sidebar or history undo/redo. If the last reason for change
    // was "external", we skip this change. In case we would like to start typing immediately after undo/redo we
    // set last change reason to `text-input`.
    if (
      lastChangeReason.current === "external" ||
      lastChangeReason.current === "paste"
    ) {
      lastChangeReason.current = "text-input";
      return;
    }

    const isValueSame = deepCompare(value, editorValue);

    // Slate runs `onChange` callback on any change, even when the text haven't changed.
    // If value haven't changed, it must be a selection change.
    if (isValueSame) {
      const nextFocusedFields = getFocusedFieldsFromSlateSelection(
        editor,
        path,
        contextParams.locale
      );

      if (nextFocusedFields) {
        scheduleFocusedFieldsChange(nextFocusedFields);
      }

      return;
    }

    lastChangeReason.current = "text-input";
    scheduleConfigSync(value as Array<BlockElement>);
  }

  function handleEditableFocus(): void {
    if (!isEnabled) {
      return;
    }

    lastChangeReason.current = "text-input";

    // When value for current locale is empty we present the value from fallback.
    // If user focuses editable element, we present the value of fallback unless it's also empty.
    if (!localizedRichTextElements) {
      let nextSlateValue = editor.children;
      let nextRichTextComponentConfig: RichTextComponentConfig;

      if (fallbackRichTextElements) {
        nextRichTextComponentConfig = richTextConfig;
        const fallbackFirstTextPart =
          fallbackRichTextElements[0].elements[0].elements[0];

        // Keep only one line element with single empty rich text
        nextRichTextComponentConfig.elements[contextParams.locale] = [
          {
            ...fallbackRichTextElements[0],
            elements: [
              {
                ...fallbackRichTextElements[0].elements[0],
                elements: [
                  {
                    ...fallbackFirstTextPart,
                    value: "",
                  },
                ],
              },
            ],
          },
        ];

        nextSlateValue = convertRichTextElementsToEditorValue(
          nextRichTextComponentConfig.elements[contextParams.locale]
        );

        editor.children = nextSlateValue;

        Transforms.select(editor, {
          anchor: Editor.start(editor, []),
          focus: Editor.start(editor, []),
        });

        form.change(path, nextRichTextComponentConfig);
      } else {
        // If current and fallback value is missing we have:
        // - empty Slate value
        // - empty config within component-collection-localised
        // We will build next $richText component config based on current Slate value
        nextRichTextComponentConfig = richTextConfig;
        nextRichTextComponentConfig.elements[contextParams.locale] =
          convertEditorValueToRichTextElements(
            editor.children as Array<BlockElement>
          );
        form.change(path, nextRichTextComponentConfig);
      }

      previousRichTextComponentConfig.current = nextRichTextComponentConfig;

      if (editor.selection) {
        const nextFocusedFields = getFocusedRichTextPartsConfigPaths(
          editor
        ).map((richTextPartPath) =>
          getAbsoluteRichTextPartPath(
            richTextPartPath,
            path,
            contextParams.locale
          )
        );

        setFocussedField(nextFocusedFields);
      }
    }
  }

  function handleEditableBlur(): void {
    lastChangeReason.current = "external";
    setIsDecorationActive(true);
  }

  // When copying content from content editable, Slate will copy HTML content of selected nodes
  // and this is not what we want. Instead we set clipboard data to contain selected content
  // in form of rich text editable component config.
  function handleEditableCopy(event: React.ClipboardEvent) {
    const selectedRichTextComponentConfig = getRichTextComponentConfigFragment(
      richTextConfig,
      editorContext
    );

    event.clipboardData.setData(
      "text/x-shopstory",
      JSON.stringify(selectedRichTextComponentConfig)
    );
  }

  function handleEditablePaste(event: React.ClipboardEvent) {
    const selectedRichTextComponentConfigClipboardData =
      event.clipboardData.getData("text/x-shopstory");

    if (selectedRichTextComponentConfigClipboardData) {
      const selectedRichTextComponentConfig: RichTextComponentConfig =
        JSON.parse(selectedRichTextComponentConfigClipboardData);

      // Preventing the default action will also prevent Slate from handling this event on his own.
      event.preventDefault();

      const nextSlateValue = convertRichTextElementsToEditorValue(
        duplicateConfig(selectedRichTextComponentConfig, editorContext)
          .elements[contextParams.locale]
      );

      const temporaryEditor = createTemporaryEditor(editor);
      Editor.insertFragment(temporaryEditor, nextSlateValue);
      const nextElements = convertEditorValueToRichTextElements(
        temporaryEditor.children as Array<BlockElement>
      );

      actions.runChange(() => {
        form.change(richTextElementsConfigPath, nextElements);

        const nextFocusedFields = getFocusedFieldsFromSlateSelection(
          temporaryEditor,
          path,
          contextParams.locale
        );

        return nextFocusedFields;
      });

      lastChangeReason.current = "paste";
    } else if (
      // Slate only handles pasting only if the clipboardData contains text/plain type.
      // When copying text from the Contentful's rich text editor, the clipboardData contains
      // more than one type, so we have to handle this case manually.
      event.clipboardData.types.length > 1 &&
      event.clipboardData.types.some((type) => type === "text/plain")
    ) {
      Editor.insertText(editor, event.clipboardData.getData("text/plain"));
      event.preventDefault();
    }
  }

  const contentEditableClassName = useMemo(() => {
    const responsiveAlignmentStyles = mapResponsiveAlignmentToStyles(
      props.__fromEditor.props.align,
      { devices: editorContext.devices, resop }
    );

    const isFallbackValueShown =
      localizedRichTextElements === undefined &&
      fallbackRichTextElements !== undefined;

    // When we make a selection of text within editable container and then blur
    // sometimes the browser selection changes and shows incorrectly selected chunks.
    const getStyles = stitches.css({
      display: "flex",
      ...responsiveAlignmentStyles,
      cursor: !isEnabled ? "inherit" : "text",
      "& *": {
        pointerEvents: isEnabled ? "auto" : "none",
      },
      "& *::selection": {
        backgroundColor: "#b4d5fe",
      },
      ...(isDecorationActive && {
        "& *::selection": {
          backgroundColor: "transparent",
        },
      }),
      ...(isFallbackValueShown && {
        opacity: 0.5,
      }),
      // Remove any text decoration from slate nodes that are elements. We only need text decoration on text elements.
      "[data-slate-node]": {
        textDecoration: "none",
      },
    });

    return getStyles().className;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    props.__fromEditor.props.align,
    isDecorationActive,
    localizedRichTextElements,
    fallbackRichTextElements,
    isEnabled,
  ]);

  const selectionBeforeEnabling = useRef<BaseSelection>(null);

  return (
    <Slate editor={editor} value={editorValue} onChange={handleEditableChange}>
      <div
      // onDoubleClick={() => {
      //   // if (isEnabled) {
      //   //   return;
      //   // }

      //   setIsEnabled(true);
      // }}
      // onMouseDown={(event) => {
      //   if (isEnabled) {
      //     event.stopPropagation();
      //   }
      // }}
      >
        {/* this wrapper div prevents from Chrome bug where "pointer-events: none" on contenteditable is ignored*/}
        <Editable
          className={contentEditableClassName}
          placeholder="Here goes text content"
          decorate={decorate}
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          renderPlaceholder={renderPlaceholder}
          onFocus={handleEditableFocus}
          onBlur={handleEditableBlur}
          onCopy={handleEditableCopy}
          onPaste={handleEditablePaste}
          onMouseDown={(event) => {
            if (isEnabled) {
              event.stopPropagation();
              return;
            }

            if (event.detail === 1) {
              JSON.stringify(editor.selection, null, 2);
              selectionBeforeEnabling.current = editor.selection;
            }

            if (event.detail === 2) {
              event.preventDefault();
              setIsEnabled(true);
            }
          }}
          readOnly={!isEnabled}
        />
      </div>
    </Slate>
  );
}

function isEditorValueEmpty(editorValue: Array<BlockElement>) {
  return (
    editorValue.length === 1 &&
    editorValue[0].children.length === 1 &&
    editorValue[0].children[0].children.length === 1 &&
    SlateText.isText(editorValue[0].children[0].children[0]) &&
    editorValue[0].children[0].children[0].text === ""
  );
}

function isConfigEqual(newConfig: any, oldConfig: any) {
  return deepCompare(newConfig, oldConfig);
}

function mapResponsiveAlignmentToStyles(
  align: ResponsiveValue<Alignment>,
  {
    devices,
    resop,
  }: { devices: Devices; resop: typeof import("@easyblocks/app-utils").resop2 }
) {
  const responsiveStyles = resop(
    {
      align: responsiveValueFill(align, devices, getDevicesWidths(devices)),
    },
    (values) => {
      return {
        justifyContent: mapAlignmentToFlexAlignment(values.align),
        textAlign: values.align,
      };
    },
    devices
  );

  const compiledStyles = compileBox(responsiveStyles, devices);

  return getBoxStyles(compiledStyles, devices);
}

function createTextSelectionDecorator(
  editor: Editor,
  options: {
    isDecorationActive: boolean;
  }
) {
  return ([node, path]: NodeEntry) => {
    const decorations: Array<Range> = [];

    if (
      SlateText.isText(node) &&
      options.isDecorationActive &&
      editor.selection !== null
    ) {
      const intersection = Range.intersection(
        editor.selection,
        Editor.range(editor, path)
      );

      if (intersection !== null) {
        const range = {
          isHighlighted: true,
          highlightType: "text",
          ...intersection,
        };

        decorations.push(range);
      }
    }

    if (
      isElementInlineWrapperElement(node) &&
      node.action.length > 0 &&
      editor.selection !== null &&
      Range.isCollapsed(editor.selection)
    ) {
      const intersection = Range.intersection(
        editor.selection,
        Editor.range(editor, path)
      );

      if (intersection !== null) {
        const range = {
          isHighlighted: true,
          highlightType: "wrapper",
          ...Editor.range(editor, path),
        };

        decorations.push(range);
      }
    }

    return decorations;
  };
}

export default RichText;
export type { RichTextProps };
