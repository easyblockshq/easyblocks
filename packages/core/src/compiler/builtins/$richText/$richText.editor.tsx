"use client";
import { deepClone, deepCompare, dotNotationGet } from "@easyblocks/utils";
import throttle from "lodash/throttle";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { flushSync } from "react-dom";
import {
  BaseRange,
  Descendant,
  Editor,
  NodeEntry,
  Range,
  Text,
  Transforms,
  createEditor,
} from "slate";
import type {
  RenderElementProps,
  RenderLeafProps,
  RenderPlaceholderProps,
} from "slate-react";
import { Editable, ReactEditor, Slate, withReact } from "slate-react";
import { Box } from "../../../components/Box/Box";
import {
  ComponentBuilder,
  InternalNoCodeComponentProps,
} from "../../../components/ComponentBuilder/ComponentBuilder";
import { RichTextChangedEvent } from "../../../events";
import { getFallbackForLocale } from "../../../locales";
import { responsiveValueFill } from "../../../responsiveness";
import { Devices, ResponsiveValue } from "../../../types";
import { compileBox, getBoxStyles } from "../../box";
import { getDevicesWidths } from "../../devices";
import { duplicateConfig } from "../../duplicateConfig";
import type { RichTextComponentConfig } from "./$richText";
import {
  RICH_TEXT_CONFIG_SYNC_THROTTLE_TIMEOUT,
  RICH_TEXT_FOCUSED_FIELDS_SYNC_THROTTLE_TIMEOUT,
} from "./$richText.constants";
import { Alignment, BlockElement } from "./$richText.types";
import { RichTextBlockElementCompiledComponentConfig } from "./$richTextBlockElement/$richTextBlockElement";
import { RichTextPartComponentConfig } from "./$richTextPart/$richTextPart";
import { RichTextPartClient } from "./$richTextPart/$richTextPart.client";
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
import { NORMALIZED_IDS_TO_IDS, withEasyblocks } from "./withEasyblocks";
import { useEasyblocksCanvasContext } from "../../../_internals";

interface RichTextProps extends InternalNoCodeComponentProps {
  elements: Array<
    React.ReactElement<{
      compiled: RichTextBlockElementCompiledComponentConfig;
    }>
  >;
  align: ResponsiveValue<Alignment>;
}

function RichTextEditor(props: RichTextProps) {
  // const { editorContext } = (window.parent as any).editorWindowAPI;

  const canvasContext = useEasyblocksCanvasContext();

  if (!canvasContext) {
    return null;
  }

  const { formValues, locales, locale, focussedField, definitions } =
    canvasContext;

  // const {
  //   actions,
  //   contextParams,
  //   form,
  //   focussedField,
  //   locales,
  //   setFocussedField,
  // } = editorContext;

  const setFocussedField = (field: Array<string> | string) => {
    window.parent.postMessage(
      {
        type: "@easyblocks-editor/focus",
        payload: {
          target: field,
        },
      },
      "*"
    );
  };

  const {
    __easyblocks: {
      path,
      runtime: { resop, stitches, devices },
    },
    align,
  } = props;

  let richTextConfig: RichTextComponentConfig = dotNotationGet(
    formValues,
    path
  );

  const [editor] = useState(() => withEasyblocks(withReact(createEditor())));

  const localizedRichTextElements = richTextConfig.elements[locale];

  const fallbackRichTextElements = getFallbackForLocale(
    richTextConfig.elements,
    locale,
    locales
  );

  const richTextElements =
    localizedRichTextElements ?? fallbackRichTextElements;

  const richTextElementsConfigPath = `${path}.elements.${locale}`;

  const [editorValue, setEditorValue] = useState(() =>
    convertRichTextElementsToEditorValue(richTextElements)
  );

  // If rich text has no value, we initialize it with default config by updating it during first render
  // This is only possible when we open entry for non main locale without fallback, this is total edge case
  if (richTextElements.length === 0 && !fallbackRichTextElements) {
    // We only want to show rich text for default config within this component, we don't want to update raw content
    // To prevent implicit update of raw content we make a deep copy.
    richTextConfig = deepClone(richTextConfig);
    richTextConfig.elements[locale] =
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

  /**
   * Whether the content editable is enabled or not. We enable it through double click.
   */
  const [isEnabled, setIsEnabled] = useState(false);
  const previousRichTextComponentConfig = useRef<RichTextComponentConfig>();
  const currentSelectionRef = useRef<BaseRange | null>(null);

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
    // React bails out the render if state setter function is invoked during the render phase.
    // Doing it makes Slate always up-to date with the latest config if it's changed from outside.
    // https://reactjs.org/docs/hooks-faq.html#how-do-i-implement-getderivedstatefromprops
    setEditorValue(nextEditorValue);
    editor.children = nextEditorValue;

    if (isEnabled) {
      const newEditorSelection = getEditorSelectionFromFocusedFields(
        focussedField,
        formValues
      );

      if (isDecorationActive) {
        currentSelectionRef.current = newEditorSelection;
      } else {
        // Slate gives us two methods to update its selection:
        // - `setSelection` updates current selection, so `editor.selection` must be not null
        // - `select` sets the selection, so `editor.selection` must be null
        if (newEditorSelection !== null && editor.selection !== null) {
          Transforms.setSelection(editor, newEditorSelection);
        } else if (newEditorSelection !== null && editor.selection === null) {
          Transforms.select(editor, newEditorSelection);
        } else {
          Transforms.deselect(editor);
        }
      }
    }
  }

  useLayoutEffect(() => {
    if (
      isDecorationActive &&
      currentSelectionRef.current !== null &&
      !Range.isCollapsed(currentSelectionRef.current)
    ) {
      splitStringNodes(editor, currentSelectionRef.current);

      return () => {
        unwrapStringNodesContent(editor);
      };
    }
  }, [editor, isDecorationActive, richTextConfig]);

  const isRichTextActive = focussedField.some((focusedField: any) =>
    focusedField.startsWith(path)
  );

  useLayoutEffect(() => {
    // When rich text becomes inactive we want to restore all original [data-slate-string] nodes
    // by removing all span wrappers that we added to show the mocked browser selection.
    if (!isRichTextActive) {
      unwrapStringNodesContent(editor);
    }
  }, [editor, isRichTextActive]);

  useEffect(() => {
    // We set previous value of rich text only once, then we manually assign it when needed.
    previousRichTextComponentConfig.current = richTextConfig;
  }, []);

  useEffect(
    // Component is blurred when the user selects other component in editor. This is different from blurring content editable.
    // Content editable can be blurred, but the component can remain active ex. when we select some text within content editable
    // and want to update its color from the sidebar.
    function handleRichTextBlur() {
      if (!isRichTextActive && isEnabled) {
        // editor.children = deepClone(editorValue);
        setIsEnabled(false);
        currentSelectionRef.current = null;
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
          delete nextRichTextElement.elements[locale];
          editor.children = convertRichTextElementsToEditorValue(
            fallbackRichTextElements
          );
          // form.change(path, nextRichTextElement);

          window.parent.postMessage(
            {
              type: "@easyblocks-editor/form-change",
              payload: {
                key: path,
                value: nextRichTextElement,
              },
            },
            "*"
          );
        }
      }
    },
    [focussedField, isEnabled, isRichTextActive]
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

      if (event.data.type === "@easyblocks-editor/rich-text-changed") {
        const { payload } = event.data;
        // Slate is an uncontrolled component and we don't have an easy access to control it.
        // It keeps its state internally and on each change we convert this state to our format.
        // This works great because changing content of editable element is easy, we append or remove things.
        // When we change the color/font of selected text there are many questions:
        // - is the current selection partial or does it span everything?
        // - how to split text chunks when selection is partial?
        // - how to update selection?
        //
        // `Editor.addMark` method automatically will split (or not) text chunks, update selection etc.
        // It will just do all the painful things. After the Slate do its job, we take its current state after the update
        // and convert it to entry and correct focused fields.
        const temporaryEditor = createTemporaryEditor(editor);

        const updateSelectionResult = updateSelection(
          temporaryEditor,
          payload.prop,
          ...payload.values
        );

        if (!updateSelectionResult) {
          return;
        }

        currentSelectionRef.current = temporaryEditor.selection;

        // actions.runChange(() => {
        //   const newRichTextElement: RichTextComponentConfig = {
        //     ...richTextConfig,
        //     elements: {
        //       ...richTextConfig.elements,
        //       [locale]: updateSelectionResult.elements,
        //     },
        //   };

        //   form.change(path, newRichTextElement);

        //   const newFocusedFields =
        //     updateSelectionResult.focusedRichTextParts.map(
        //       (focusedRichTextPart) =>
        //         getAbsoluteRichTextPartPath(focusedRichTextPart, path, locale)
        //     );

        //   return newFocusedFields;
        // });

        const newRichTextElement: RichTextComponentConfig = {
          ...richTextConfig,
          elements: {
            ...richTextConfig.elements,
            [locale]: updateSelectionResult.elements,
          },
        };

        const newFocusedFields = updateSelectionResult.focusedRichTextParts.map(
          (focusedRichTextPart) =>
            getAbsoluteRichTextPartPath(focusedRichTextPart, path, locale)
        );

        window.parent.postMessage(
          {
            type: "@easyblocks-editor/form-change",
            payload: {
              key: path,
              value: newRichTextElement,
              focussedField: newFocusedFields,
            },
          },
          "*"
        );
      }
    }

    window.addEventListener("message", handleRichTextChanged);

    return () => {
      window.removeEventListener("message", handleRichTextChanged);
    };
  }, [richTextConfig, path]);

  const decorate = createTextSelectionDecorator(editor);
  const Elements = extractElementsFromCompiledComponents(props);

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
      if (Element._component === "@easyblocks/rich-text-block-element") {
        if (Element.props.type === "bulleted-list") {
          return Element.styled.BulletedList;
        } else if (Element.props.type === "numbered-list") {
          return Element.styled.NumberedList;
        } else if (Element.props.type === "paragraph") {
          return Element.styled.Paragraph;
        }
      } else if (Element._component === "@easyblocks/rich-text-line-element") {
        if (element.type === "text-line") {
          return Element.styled.TextLine;
        } else if (element.type === "list-item") {
          return Element.styled.ListItem;
        }
      }
    })();

    if (compiledStyles === undefined) {
      throw new Error("Unknown element type");
    }

    return (
      <Box
        __compiled={compiledStyles}
        devices={devices}
        stitches={stitches}
        {...attributes}
        // Element annotation for easier debugging
        {...(process.env.NODE_ENV === "development" && {
          "data-shopstory-element-type": element.type,
          "data-shopstory-id": element.id,
        })}
      >
        {element.type === "list-item" ? <div>{children}</div> : children}
      </Box>
    );
  }

  const TextParts = extractTextPartsFromCompiledComponents(props);

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
      <RichTextPartClient
        value={children}
        Text={
          <Box
            __compiled={TextPart.styled.Text}
            devices={devices}
            stitches={stitches}
            {...attributes}
          />
        }
        TextWrapper={
          TextPart.components.TextWrapper[0] ? (
            <ComponentBuilder
              compiled={TextPart.components.TextWrapper[0]}
              path={path}
              components={definitions.components}
              passedProps={{
                __isSelected:
                  leaf.isHighlighted && leaf.highlightType === "textWrapper",
              }}
            />
          ) : undefined
        }
      />
    );

    return TextPartComponent;
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

      // actions.runChange(() => {
      //   const newRichTextElement: RichTextComponentConfig = {
      //     ...richTextConfig,
      //     elements: {
      //       ...richTextConfig.elements,
      //       [locale]: nextElements,
      //     },
      //   };

      //   form.change(path, newRichTextElement);
      //   previousRichTextComponentConfig.current = newRichTextElement;

      //   if (editor.selection) {
      //     const nextFocusedFields = getFocusedFieldsFromSlateSelection(
      //       editor,
      //       path,
      //       locale
      //     );

      //     return nextFocusedFields;
      //   }
      // });

      const newRichTextElement: RichTextComponentConfig = {
        ...richTextConfig,
        elements: {
          ...richTextConfig.elements,
          [locale]: nextElements,
        },
      };

      previousRichTextComponentConfig.current = newRichTextElement;

      window.parent.postMessage(
        {
          type: "@easyblocks-editor/form-change",
          payload: {
            key: path,
            value: newRichTextElement,
            ...(editor.selection
              ? {
                  focussedField: getFocusedFieldsFromSlateSelection(
                    editor,
                    path,
                    locale
                  ),
                }
              : {}),
          },
        },
        "*"
      );
    }, RICH_TEXT_CONFIG_SYNC_THROTTLE_TIMEOUT),
    [isConfigChanged, locale]
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
        locale
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
        nextRichTextComponentConfig.elements[locale] = [
          {
            ...fallbackRichTextElements[0],
            elements: [
              {
                ...fallbackRichTextElements[0].elements[0],
                elements: [
                  {
                    ...fallbackFirstTextPart,
                    value: "",
                  } as RichTextPartComponentConfig,
                ],
              },
            ],
          },
        ];

        nextSlateValue = convertRichTextElementsToEditorValue(
          nextRichTextComponentConfig.elements[locale]
        );

        editor.children = nextSlateValue;

        Transforms.select(editor, {
          anchor: Editor.start(editor, []),
          focus: Editor.start(editor, []),
        });

        // form.change(path, nextRichTextComponentConfig);

        window.parent.postMessage(
          {
            type: "@easyblocks-editor/form-change",
            payload: {
              key: path,
              value: nextRichTextComponentConfig,
            },
          },
          "*"
        );
      } else {
        // If current and fallback value is missing we have:
        // - empty Slate value
        // - empty config within component-collection-localised
        // We will build next $richText component config based on current Slate value
        nextRichTextComponentConfig = richTextConfig;
        nextRichTextComponentConfig.elements[locale] =
          convertEditorValueToRichTextElements(
            editor.children as Array<BlockElement>
          );
        // form.change(path, nextRichTextComponentConfig);
        window.parent.postMessage(
          {
            type: "@easyblocks-editor/form-change",
            payload: {
              key: path,
              value: nextRichTextComponentConfig,
            },
          },
          "*"
        );
      }

      previousRichTextComponentConfig.current = nextRichTextComponentConfig;

      if (editor.selection) {
        const nextFocusedFields = getFocusedRichTextPartsConfigPaths(
          editor
        ).map((richTextPartPath) =>
          getAbsoluteRichTextPartPath(richTextPartPath, path, locale)
        );

        setFocussedField(nextFocusedFields);
      }
    }

    if (isDecorationActive) {
      const root = ReactEditor.findDocumentOrShadowRoot(editor);
      const slateStringElements = root.querySelectorAll("[data-slate-string]");
      slateStringElements.forEach((element) => {
        element.replaceChildren(document.createTextNode(element.textContent!));
      });
    }
  }

  useEffect(() => {
    function saveLatestSelection() {
      const root = ReactEditor.findDocumentOrShadowRoot(editor);
      const selection = (root as Document).getSelection();

      if (selection && selection.type === "Range") {
        currentSelectionRef.current = ReactEditor.toSlateRange(
          editor,
          selection,
          { exactMatch: false, suppressThrow: true }
        );
      } else {
        currentSelectionRef.current = null;
      }
    }

    const throttledSaveLatestSelection = throttle(saveLatestSelection, 100);

    if (isEnabled) {
      window.document.addEventListener(
        "selectionchange",
        throttledSaveLatestSelection
      );

      return () => {
        window.document.removeEventListener(
          "selectionchange",
          throttledSaveLatestSelection
        );
      };
    }
  }, [editor, isEnabled]);

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
      focussedField,
      locale,
      formValues,
      definitions
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
        duplicateConfig(selectedRichTextComponentConfig, definitions).elements[
          locale
        ]
      );

      const temporaryEditor = createTemporaryEditor(editor);
      Editor.insertFragment(temporaryEditor, nextSlateValue);
      const nextElements = convertEditorValueToRichTextElements(
        temporaryEditor.children as Array<BlockElement>
      );

      // actions.runChange(() => {
      //   form.change(richTextElementsConfigPath, nextElements);

      //   const nextFocusedFields = getFocusedFieldsFromSlateSelection(
      //     temporaryEditor,
      //     path,
      //     locale
      //   );

      //   return nextFocusedFields;
      // });

      window.parent.postMessage(
        {
          type: "@easyblocks-editor/form-change",
          payload: {
            key: richTextElementsConfigPath,
            value: nextElements,
            focussedField: getFocusedFieldsFromSlateSelection(
              temporaryEditor,
              path,
              locale
            ),
          },
        },
        "*"
      );

      lastChangeReason.current = "paste";
    } else if (
      // Slate only handles pasting if the clipboardData contains text/plain type.
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
    const responsiveAlignmentStyles = mapResponsiveAlignmentToStyles(align, {
      devices,
      resop,
    });

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
        userSelect: isEnabled ? "auto" : "none",
      },
      "& *::selection": {
        backgroundColor: "#b4d5fe",
      },
      ...(isDecorationActive && {
        "& *::selection": {
          backgroundColor: "transparent",
        },
        "& *[data-easyblocks-rich-text-selection]": {
          backgroundColor: "#b4d5fe",
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
  }, [
    align,
    isDecorationActive,
    localizedRichTextElements,
    fallbackRichTextElements,
    isEnabled,
  ]);

  return (
    <Slate editor={editor} value={editorValue} onChange={handleEditableChange}>
      <div>
        {/* this wrapper div prevents from Chrome bug where "pointer-events: none" on contenteditable is ignored*/}
        <Editable
          className={contentEditableClassName}
          placeholder="Here goes text content"
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          renderPlaceholder={renderPlaceholder}
          decorate={decorate}
          onFocus={handleEditableFocus}
          onBlur={handleEditableBlur}
          onCopy={handleEditableCopy}
          onPaste={handleEditablePaste}
          onMouseDown={(event) => {
            if (isEnabled) {
              event.stopPropagation();
              return;
            }

            if (event.detail === 2) {
              event.preventDefault();

              flushSync(() => {
                setIsEnabled(true);
              });

              ReactEditor.focus(editor);

              if (isEditorValueEmpty(editor.children as Array<BlockElement>)) {
                return;
              }

              const editorSelectionRange = {
                anchor: Editor.start(editor, []),
                focus: Editor.end(editor, []),
              };

              Transforms.setSelection(editor, editorSelectionRange);
              const editorSelectionDOMRange = ReactEditor.toDOMRange(
                editor,
                editorSelectionRange
              );

              window
                .getSelection()
                ?.setBaseAndExtent(
                  editorSelectionDOMRange.startContainer,
                  editorSelectionDOMRange.startOffset,
                  editorSelectionDOMRange.endContainer,
                  editorSelectionDOMRange.endOffset
                );
            }
          }}
          readOnly={!isEnabled}
        />
      </div>
    </Slate>
  );
}

export { RichTextEditor };
export type { RichTextProps };

function isEditorValueEmpty(editorValue: Array<BlockElement>) {
  return (
    editorValue.length === 1 &&
    editorValue[0].children.length === 1 &&
    editorValue[0].children[0].children.length === 1 &&
    Text.isText(editorValue[0].children[0].children[0]) &&
    editorValue[0].children[0].children[0].text === ""
  );
}

function isConfigEqual(newConfig: any, oldConfig: any) {
  return deepCompare(newConfig, oldConfig);
}

function mapResponsiveAlignmentToStyles(
  align: ResponsiveValue<Alignment>,
  { devices, resop }: { devices: Devices; resop: any }
) {
  function mapAlignmentToFlexAlignment(align: Alignment) {
    if (align === "center") {
      return "center";
    }

    if (align === "right") {
      return "flex-end";
    }

    return "flex-start";
  }

  const responsiveStyles = resop(
    {
      align: responsiveValueFill(align, devices, getDevicesWidths(devices)),
    },
    (values: any) => {
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

function createTextSelectionDecorator(editor: Editor) {
  return ([node, path]: NodeEntry) => {
    const decorations: Array<Range> = [];

    if (
      Text.isText(node) &&
      editor.selection !== null &&
      node.TextWrapper.length > 0 &&
      Range.isCollapsed(editor.selection)
    ) {
      const textRange = Editor.range(editor, path);
      const intersection = Range.intersection(editor.selection, textRange);

      if (intersection !== null) {
        const range = {
          isHighlighted: true,
          highlightType: "textWrapper",
          ...textRange,
        };

        decorations.push(range);
      }
    }

    return decorations;
  };
}

function splitStringNodes(editor: Editor, selection: BaseRange) {
  const nodes = Editor.nodes(editor, {
    at: selection,
    match: Text.isText,
  });

  const domNodes = Array.from(nodes).map(([node]) => {
    const domNode = ReactEditor.toDOMNode(editor, node);

    return domNode;
  });

  if (domNodes.length === 1) {
    const slateString = domNodes[0].querySelector("[data-slate-string]");
    const textContent = slateString!.textContent!;
    const newChild = document.createDocumentFragment();

    // Selection made within whole text node
    if (
      textContent.length === selection.focus.offset - selection.anchor.offset ||
      textContent.length === selection.anchor.offset - selection.focus.offset
    ) {
      const selectedTextNode = document.createElement("span");
      selectedTextNode.textContent = textContent;
      selectedTextNode.dataset.easyblocksRichTextSelection = "true";
      newChild.appendChild(selectedTextNode);
      slateString!.replaceChildren(newChild);
    } else {
      const selectedTextNode = document.createElement("span");
      selectedTextNode.textContent = textContent.slice(
        selection.anchor.offset,
        selection.focus.offset
      );
      selectedTextNode.dataset.easyblocksRichTextSelection = "true";
      newChild.appendChild(
        document.createTextNode(textContent.slice(0, selection.anchor.offset))
      );
      newChild.appendChild(selectedTextNode);
      newChild.appendChild(
        document.createTextNode(textContent.slice(selection.focus.offset))
      );
      slateString!.replaceChildren(newChild);
    }

    return;
  }

  domNodes.forEach((node, index) => {
    const slateString = node.querySelector("[data-slate-string]");

    if (slateString) {
      const textContent = slateString.textContent!;
      const newChild = document.createDocumentFragment();

      if (index === 0) {
        newChild.appendChild(
          document.createTextNode(
            slateString.textContent!.slice(0, selection.anchor.offset)
          )
        );
        const selectedTextNode = document.createElement("span");
        selectedTextNode.textContent = textContent.slice(
          selection.anchor.offset
        );
        selectedTextNode.dataset.easyblocksRichTextSelection = "true";
        newChild.appendChild(selectedTextNode);

        slateString.replaceChildren(newChild);
      } else if (index === domNodes.length - 1) {
        const selectedTextNode = document.createElement("span");
        selectedTextNode.textContent = textContent.slice(
          0,
          selection.focus.offset
        );
        selectedTextNode.dataset.easyblocksRichTextSelection = "true";
        newChild.appendChild(selectedTextNode);
        newChild.appendChild(
          document.createTextNode(textContent.slice(selection.focus.offset))
        );
        slateString.replaceChildren(newChild);
      } else {
        const selectedTextNode = document.createElement("span");
        selectedTextNode.textContent = textContent;
        selectedTextNode.dataset.easyblocksRichTextSelection = "true";
        newChild.appendChild(selectedTextNode);
        slateString.replaceChildren(newChild);
      }
    }
  });
}

function unwrapStringNodesContent(editor: Editor) {
  const root = ReactEditor.findDocumentOrShadowRoot(editor);
  const slateStringElements = root.querySelectorAll("[data-slate-string]");
  slateStringElements.forEach((element) => {
    element.replaceChildren(document.createTextNode(element.textContent!));
  });
}
