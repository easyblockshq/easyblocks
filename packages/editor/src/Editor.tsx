import {
  CompilationCache,
  CompilationMetadata,
  Config,
  DeviceRange,
  Document,
  ExternalData,
  FetchOutputResources,
  InlineTypeWidgetComponentProps,
  NoCodeComponentEntry,
  NonEmptyRenderableContent,
  Template,
  TokenTypeWidgetComponentProps,
  WidgetComponentProps,
  buildEntry,
  compileInternal,
  createCompilationContext,
  findExternals,
  getDefaultLocale,
  mergeCompilationMeta,
  normalize,
  normalizeInput,
  responsiveValueGet,
  validate,
} from "@easyblocks/core";
import {
  ChangeResponsiveEvent,
  CompilationContextType,
  ComponentPickerOpenedEvent,
  ItemInsertedEvent,
  ItemMovedEvent,
  RedoEvent,
  SetFocussedFieldEvent,
  UndoEvent,
  componentPickerClosed,
  duplicateConfig,
  findComponentDefinitionById,
  parsePath,
  traverseComponents,
} from "@easyblocks/core/_internals";
import { Colors, Fonts, useToaster } from "@easyblocks/design-system";
import {
  assertDefined,
  dotNotationGet,
  uniqueId,
  useForceRerender,
} from "@easyblocks/utils";
import throttle from "lodash.throttle";
import React, {
  ComponentType,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Modal from "react-modal";
import styled from "styled-components";
import { ConfigAfterAutoContext } from "./ConfigAfterAutoContext";
import { ExternalDataChangeHandler } from "./EasyblocksEditorProps";
import { EditorContext, EditorContextType } from "./EditorContext";
import { EditorExternalDataProvider } from "./EditorExternalDataProvider";
import { EditorIframe } from "./EditorIframe";
import { EditorSidebar } from "./EditorSidebar";
import { EditorTopBar, TOP_BAR_HEIGHT } from "./EditorTopBar";
import { ModalPicker } from "./ModalPicker";
import { TemplateModal } from "./TemplateModal";
import {
  duplicateItems,
  logItems,
  moveItems,
  pasteItems,
  removeItems,
  replaceItems,
} from "./editorActions";
import { Form } from "./form";
import { destinationResolver } from "./paste/destinationResolver";
import { pasteManager } from "./paste/manager";
import { SelectionFrame } from "./selectionFrame/SelectionFrame";
import { getTemplates } from "./templates/getTemplates";
import { useForm } from "./tinacms/react-core";
import {
  ActionsType,
  OpenComponentPickerConfig,
  OpenTemplateModalAction,
} from "./types";
import { useDataSaver } from "./useDataSaver";
import { useEditorGlobalKeyboardShortcuts } from "./useEditorGlobalKeyboardShortcuts";
import { useEditorHistory } from "./useEditorHistory";
import { checkLocalesCorrectness } from "./utils/locales/checkLocalesCorrectness";
import { removeLocalizedFlag } from "./utils/locales/removeLocalizedFlag";

const ContentContainer = styled.div`
  position: relative;
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
`;

const SidebarAndContentContainer = styled.div<{ height: "100vh" | "100%" }>`
  height: ${(props) => `calc(${props.height} - ${TOP_BAR_HEIGHT}px)`};
  width: 100%;
  background: #fafafa;
  display: flex;
  flex-direction: row;
  align-items: stretch;
`;

const SidebarContainer = styled.div`
  flex: 0 0 240px;
  background: ${Colors.white};
  border-left: 1px solid ${Colors.black100};
  box-sizing: border-box;

  > * {
    box-sizing: border-box;
  }

  overflow-y: auto;
`;

const DataSaverRoot = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 100000;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const DataSaverOverlay = styled.div`
  z-index: -1;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.25);
`;

const DataSaverModal = styled.div`
  background: white;
  padding: 32px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  ${Fonts.body}
  font-size: 16px;
`;

const AuthenticationScreen = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 24px;
  text-align: center;
  ${Fonts.bodyLarge}
`;

type EditorProps = {
  config: Config;
  locale?: string;
  readOnly: boolean;
  documentId: string | null;
  rootComponentId: string | null;
  rootTemplateId: string | null;
  save?: (document: Document) => Promise<void>;
  onClose?: () => void;
  externalData: FetchOutputResources;
  onExternalDataChange: ExternalDataChangeHandler;
  widgets?: Record<
    string,
    | ComponentType<WidgetComponentProps<any>>
    | ComponentType<InlineTypeWidgetComponentProps<any>>
    | ComponentType<TokenTypeWidgetComponentProps<any>>
  >;
  components?: Record<string, ComponentType<any>>;
};

export const Editor = EditorBackendInitializer;

function EditorBackendInitializer(props: EditorProps) {
  const [enabled, setEnabled] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [document, setDocument] = useState<Document | null>(null);

  useEffect(() => {
    async function run() {
      try {
        if (props.documentId) {
          const document = await props.config.backend.documents.get({
            id: props.documentId,
          });

          if (!document) {
            throw new Error(
              `Can't fetch document with id: ${props.documentId}`
            );
          }

          setDocument(document);
        }
      } catch (error) {
        console.error(error);
        setError(
          `Backend initialization error, check out console for more details.`
        );
        return;
      }

      setEnabled(true);
    }

    run();
  }, []);

  if (!enabled) {
    return <AuthenticationScreen>Loading...</AuthenticationScreen>;
  }

  if (error) {
    return (
      <DataSaverRoot>
        <DataSaverOverlay></DataSaverOverlay>
        <DataSaverModal>{error}</DataSaverModal>
      </DataSaverRoot>
    );
  }

  return <EditorWrapper {...props} document={document} />;
}

const EditorWrapper = memo(
  (props: EditorProps & { document: Document | null }) => {
    if (!props.document) {
      if (props.rootTemplateId) {
        if (props.rootComponentId) {
          throw new Error(
            "You can't pass both 'rootContainer' and 'rootTemplate' parameters to the editor"
          );
        }

        const template = props.config.templates?.find(
          (template) => template.id === props.rootTemplateId
        );

        if (!template) {
          throw new Error(
            `The template given in "rootTemplate" ("${props.rootTemplateId}") doesn't exist in Config.templates`
          );
        }
      } else {
        if (props.rootComponentId === null) {
          throw new Error(
            "When you create a new document you must pass a 'rootContainer' or 'rootTemplate' parameter to the editor"
          );
        }

        if (
          !props.config.components?.find(
            (component) => component.id === props.rootComponentId
          )
        ) {
          throw new Error(
            `The component given in rootContainer ("${props.rootComponentId}") doesn't exist in Config.components`
          );
        }
      }
    }

    // Locales
    if (!props.config.locales) {
      throw new Error("Required property Config.locales is empty");
    }

    checkLocalesCorrectness(props.config.locales); // very important to check locales correctness, circular references etc. Other functions
    const locale = props.locale ?? getDefaultLocale(props.config.locales).code;

    const rootTemplateEntry = props.rootTemplateId
      ? props.config.templates?.find((t) => t.id === props.rootTemplateId)
          ?.entry
      : null;

    const rootComponentId = props.document
      ? props.document.entry._component
      : rootTemplateEntry?._component ?? props.rootComponentId;

    const compilationContext = createCompilationContext(
      props.config,
      {
        locale,
      },
      rootComponentId!
    );

    const initialEntry = props.document
      ? adaptRemoteConfig(props.document.entry, compilationContext)
      : normalize(
          rootTemplateEntry ?? {
            _id: uniqueId(),
            _component: rootComponentId!,
          },
          compilationContext
        );

    return (
      <EditorContent
        {...props}
        compilationContext={compilationContext}
        initialDocument={props.document}
        initialEntry={initialEntry}
      />
    );
  }
);

type EditorContentProps = EditorProps & {
  compilationContext: CompilationContextType;
  initialDocument: Document | null;
  initialEntry: NoCodeComponentEntry;
  heightMode?: "viewport" | "full";
};

function parseExternalDataId(externalDataId: string): {
  configId: string;
  fieldName: string;
  breakpointIndex: string | undefined;
} {
  const [configId, fieldName, breakpointIndex] = externalDataId.split(".");

  return {
    configId,
    fieldName,
    breakpointIndex,
  };
}

function useBuiltContent(
  editorContext: EditorContextType,
  config: Config,
  rawContent: NoCodeComponentEntry,
  externalData: ExternalData,
  onExternalDataChange: ExternalDataChangeHandler
): NonEmptyRenderableContent & {
  meta: CompilationMetadata;
} {
  const buildEntryResult = useRef<ReturnType<typeof buildEntry>>();

  // cached inputs (needed to calculated "inputChanged")
  const inputRawContent = useRef<NoCodeComponentEntry>();
  const inputIsEditing = useRef<boolean>();
  const inputBreakpointIndex = useRef<string>();

  const inputChanged =
    inputRawContent.current !== rawContent ||
    inputIsEditing.current !== editorContext.isEditing ||
    inputBreakpointIndex.current !== editorContext.breakpointIndex;

  if (!buildEntryResult.current || inputChanged) {
    /*
     * Why do we merge meta instead of overriding?
     * It might seem redundant. We could only take the newest meta and re-render, right?
     *
     * The problem is when we have nested Shopstory content.
     * The first call "buildSync" only compiles 1 level deep, doesn't compile deeper nested items.
     * Deeper nested items are compiled only when fetch is finished.
     *
     * Because of that, when we switch isEditing from true to false following thing will happen:
     * 1. We'll get only Metadata from 1 level compile.
     * 2. Shopstory Editor will try to re-render everything.
     * 3. It will remember old RenderableContent in the resources.
     * 4. But the metadata from old RenderableContent is not yet added.
     * 5. This will cause errors because there won't be enough definitions in the metadata.
     *
     * The solution is merging. Metadata code + definitions is growing incrementally in the editor.
     * There is no performance overhead of this operation and we might be sure that any definitions
     * that were added at any point will be available later.
     *
     */

    buildEntryResult.current = buildEntry({
      entry: rawContent,
      config,
      locale: editorContext.contextParams.locale,
      externalData,
      compiler: {
        findExternals,
        validate,
        compile: (content) => {
          let resultMeta: CompilationMetadata = {
            vars: {
              devices: editorContext.devices,
              locale: editorContext.contextParams.locale,
              definitions: {
                actions: [],
                components: [],
                links: [],
                textModifiers: [],
              },
            },
          };

          const normalizedContent = normalizeInput(content);

          const { meta, ...rest } = compileInternal(
            normalizedContent,
            editorContext,
            editorContext.compilationCache
          );

          resultMeta = mergeCompilationMeta(resultMeta, meta);

          return {
            ...rest,
            meta: resultMeta,
          };
        },
      },
      isExternalDataChanged(externalDataValue, defaultIsExternalDataChanged) {
        // When editing, we consider external data to be changed in more ways.
        const storedExternalData = externalData[externalDataValue.id];

        // If external data for given id is already stored, but now the external id is empty it means that the user
        // has removed that external value and thus the user of editor has to remove it from its external data.
        if (storedExternalData && externalDataValue.externalId === null) {
          return true;
        }

        // If external data for given is is already stored, but now the external id is different it means that the user
        // has changed the selected external value and thus the user of editor has to update it in its external data.
        if (
          storedExternalData &&
          externalDataValue.externalId &&
          inputRawContent.current
        ) {
          const { breakpointIndex, configId, fieldName } = parseExternalDataId(
            externalDataValue.id
          );

          const config = findConfigById(
            inputRawContent.current,
            editorContext,
            configId === "$" ? inputRawContent.current._id : configId
          );

          if (!config) {
            return false;
          }

          const value = breakpointIndex
            ? responsiveValueGet(config[fieldName], breakpointIndex)
            : config[fieldName];

          const hasExternalIdChanged =
            value === undefined || value.id !== externalDataValue.externalId;

          return hasExternalIdChanged;
        }

        return defaultIsExternalDataChanged(externalDataValue);
      },
    });

    if (Object.keys(buildEntryResult.current.externalData).length > 0) {
      onExternalDataChange(
        buildEntryResult.current.externalData,
        editorContext.contextParams
      );
    }
  }

  inputRawContent.current = rawContent;
  inputIsEditing.current = editorContext.isEditing;
  inputBreakpointIndex.current = editorContext.breakpointIndex;

  return {
    renderableContent: (buildEntryResult.current as NonEmptyRenderableContent)
      .renderableContent,
    configAfterAuto: (buildEntryResult.current as NonEmptyRenderableContent)
      .configAfterAuto,
    meta: buildEntryResult.current.meta,
  };
}

function calculateViewportRelatedStuff(
  viewport: string,
  devices: DeviceRange[],
  mainBreakpointIndex: string,
  availableSize?: { width: number; height: number }
) {
  let activeDevice: DeviceRange;

  // Calculate active device
  if (viewport === "fit-screen") {
    if (!availableSize) {
      activeDevice = devices.find(
        (device) => device.id === mainBreakpointIndex
      )!;
    } else {
      const matchingDevice = getMatchingDevice(devices, availableSize.width);
      if (!matchingDevice) {
        throw new Error("can't find matching device");
      }

      activeDevice = matchingDevice;
    }
  } else {
    activeDevice = devices.find((device) => device.id === viewport)!;
  }

  const activeDeviceindex = devices.findIndex(
    (device) => device.id === activeDevice.id
  );

  // Calculate width, height and scale
  let width, height: number;
  let scaleFactor: number | null = null;
  let offsetY: number = 0;

  if (!availableSize) {
    // lack of available size (first render) should wait until size is available to perform calculations
    width = 0;
    height = 0;
  } else {
    if (viewport === "fit-screen") {
      width = availableSize.width;
      height = availableSize.height;
    } else {
      const smallestNonScaledWidth =
        activeDeviceindex === 0
          ? 0
          : devices[activeDeviceindex - 1].breakpoint!;

      width = activeDevice.w;
      height =
        activeDevice.h === null
          ? availableSize.height
          : Math.min(activeDevice.h, availableSize.height);

      if (activeDevice.w <= availableSize.width) {
        // fits
      } else if (smallestNonScaledWidth <= availableSize.width) {
        // fits currently selected device range
        width = availableSize.width;
      } else {
        // we must scale
        scaleFactor = availableSize.width / activeDevice.w;

        if (activeDevice.h === null) {
          height = availableSize.height / scaleFactor;
          offsetY = (availableSize.height - height) / 2;
        }
      }
    }
  }

  return {
    breakpointIndex: activeDevice.id,
    iframeSize: {
      width,
      height,
      transform:
        scaleFactor === null
          ? "none"
          : `translateY(${offsetY}px) scale(${scaleFactor})`,
    },
  };
}

function useRerenderOnResize() {
  const { forceRerender } = useForceRerender();

  useEffect(() => {
    const listener = throttle(() => {
      forceRerender();
    }, 100);

    window.addEventListener("resize", listener);

    return () => {
      window.removeEventListener("resize", listener);
    };
  });
}

const EditorContent = ({
  compilationContext,
  heightMode = "viewport",
  initialDocument,
  initialEntry,
  externalData,
  ...props
}: EditorContentProps) => {
  const [currentViewport, setCurrentViewport] = useState<string>(
    compilationContext.mainBreakpointIndex
  ); // "{ breakpoint }" or "fit-screen"

  const iframeContainerRef = useRef<HTMLDivElement>(null);
  const availableSize = iframeContainerRef.current
    ? {
        width: iframeContainerRef.current.clientWidth,
        height: iframeContainerRef.current.clientHeight,
      }
    : undefined;

  const { breakpointIndex, iframeSize } = calculateViewportRelatedStuff(
    currentViewport,
    compilationContext.devices,
    compilationContext.mainBreakpointIndex,
    availableSize
  );

  useRerenderOnResize(); // re-render on resize (recalculates viewport size, active breakpoint for fit-screen etc);

  const compilationCache = useRef(new CompilationCache());
  const [isEditing, setEditing] = useState(true);
  const [componentPickerData, setComponentPickerData] = useState<
    | {
        promiseResolve: (config: NoCodeComponentEntry | undefined) => void;
        config: OpenComponentPickerConfig;
      }
    | undefined
  >(undefined);
  const [focussedField, setFocussedField] = useState<Array<string>>([]);

  const handleSetFocussedField = React.useRef(
    (field: Array<string> | string) => {
      const nextFocusedField = Array.isArray(field) ? field : [field];
      setFocussedField(nextFocusedField);
    }
  ).current;

  const handleSetEditing = useCallback(() => {
    compilationCache.current.clear();
    setEditing(!isEditing);
  }, [isEditing]);

  const closeComponentPickerModal = (config?: NoCodeComponentEntry) => {
    setComponentPickerData(undefined);
    componentPickerData!.promiseResolve(config);
  };

  const sidebarNodeRef = useRef<HTMLDivElement | null>(null);

  const [editableData, form] = useForm({
    id: "easyblocks-editor",
    label: "Edit entry",
    fields: [],
    initialValues: initialEntry,
    onSubmit: async () => {},
  });

  const { undo, redo, push } = useEditorHistory({
    onChange: ({ config, focusedField }) => {
      setFocussedField(focusedField);
      form.finalForm.change("", config);
    },
  });

  const [templates, setTemplates] = useState<Template[] | undefined>(undefined);

  const [openTemplateModalAction, setOpenTemplateModalAction] = useState<
    OpenTemplateModalAction | undefined
  >(undefined);

  const { notify } = useToaster();

  const actions: ActionsType = {
    openTemplateModal: setOpenTemplateModalAction,
    notify: (message) => {
      notify(message);
    },
    openComponentPicker: function (config) {
      return new Promise((resolve) => {
        setComponentPickerData({
          promiseResolve: resolve,
          config,
        });
      });
    },
    replaceItems: (paths, newConfig) => {
      actions.runChange(() => {
        replaceItems(paths, newConfig, editorContext);
      });
    },
    moveItems: (fieldNames, direction) => {
      actions.runChange(() => {
        return moveItems(form, fieldNames, direction);
      });
    },
    removeItems: (fieldNames) => {
      actions.runChange(() => {
        return removeItems(form, fieldNames, editorContext);
      });
    },
    insertItem: ({ name, index, block }) => {
      actions.runChange(() => {
        form.mutators.insert(
          name,
          index,
          duplicateConfig(block, compilationContext)
        );

        return [`${name}.${index}`];
      });
    },
    duplicateItems: (fieldNames) => {
      actions.runChange(() => {
        return duplicateItems(form, fieldNames, compilationContext);
      });
    },
    pasteItems: (what) => {
      actions.runChange(() =>
        pasteItems({
          what,
          where: focussedField,
          resolveDestination: destinationResolver({
            form,
            context: compilationContext,
          }),
          pasteCommand: pasteManager(),
        })
      );
    },
    runChange: (configChangeCallback) => {
      let fieldsToFocus!: Array<string>;

      // When multiple fields are selected, the update could probably invoke `form.change` multiple times.
      // To avoid multiple rerenders, we batch them to trigger single update.
      form.finalForm.batch(() => {
        // This shallow copy of `focussedField` array is SUPER IMPORTANT!
        // Here is why...
        //
        // We invoke `configChangeCallback`, but since we are in batch, changes made to form state won't notify
        // any listeners that there were any changes. This means `window.editorWindowAPI.onUpdate` won't be invoked.
        //
        // Next, update of `focussedField` is going to be queued up. React's heuristics will treat this update
        // as update with high priority and synchronously rerender. `EditorContent` is going to rerender with updated
        // `focussedField` state, but also with updated `editableData` because it's a result of **getter**!
        // `useEffect` that is responsible for invoking `window.editorWindowAPI.onUpdate` will receive new dependencies,
        // save them as the the latest, but it won't be immediately invoked after component have returned.
        // Then the batch ends and all form listeners are going to be notified. `EditorContent` will rerender again,
        // but `editableData` and `focussedField` are the same! `useEffect` will be invoked again, it will compare its dependencies
        // and finds that the haven't changed.
        //
        // Making a shallow copy of `focussedField` will make the second invocation of `useEffect` different from the first
        // triggered by calling `setFocussedField`.
        fieldsToFocus = configChangeCallback() ?? [...focussedField];

        push({
          config: form.values,
          focussedField: fieldsToFocus,
        });

        setFocussedField(fieldsToFocus);
      });
    },
    logSelectedItems: () => {
      logItems(editorContext.form, focussedField);
    },
  };

  const [isAdminMode, setAdminMode] = useState(false);

  const syncTemplates = () => {
    getTemplates(editorContext, (props.config.templates as any) ?? []).then(
      (newTemplates) => {
        setTemplates(newTemplates);
      }
    );
  };

  useEffect(() => {
    syncTemplates();
  }, [props.config.components, props.config.templates]);

  const editorTypes: EditorContextType["types"] = Object.fromEntries(
    Object.entries(compilationContext.types).map(
      ([typeName, typeDefinition]) => {
        return [
          typeName,
          {
            ...typeDefinition,
            ...(typeDefinition.type === "external"
              ? {
                  widgets: typeDefinition.widgets.map((w) => {
                    return {
                      ...w,
                      component: props.widgets?.[w.id] as any,
                    };
                  }),
                }
              : typeDefinition.widget
              ? {
                  widget: {
                    ...typeDefinition.widget,
                    component: props.widgets?.[typeDefinition.widget.id] as any,
                  },
                }
              : {}),
          },
        ];
      }
    )
  );

  const editorContext: EditorContextType = {
    ...compilationContext,
    backend: props.config.backend,
    types: editorTypes,
    isAdminMode,
    templates,
    syncTemplates,
    breakpointIndex,
    focussedField,
    form,
    setFocussedField: handleSetFocussedField,
    isEditing,
    actions,
    save: async (documentData) => {
      window.postMessage({
        type: "@easyblocks/content-saved",
        document: documentData,
      });
    },
    compilationCache: compilationCache.current,
    readOnly: props.readOnly,
    disableCustomTemplates: props.config.disableCustomTemplates ?? false,
    rootComponent: findComponentDefinitionById(
      initialEntry._component,
      compilationContext
    )!,
    components: props.components ?? {},
  };

  const { configAfterAuto, renderableContent, meta } = useBuiltContent(
    editorContext,
    props.config,
    editableData,
    externalData,
    props.onExternalDataChange
  );

  editorContext.compiledComponentConfig = renderableContent;
  editorContext.configAfterAuto = configAfterAuto;

  console.debug("editable data", editableData);
  console.debug("focused field", focussedField);
  console.debug("meta", meta);
  console.debug("compiled config", {
    configAfterAuto,
    renderableContent,
  });
  console.debug("external data", externalData);

  window.editorWindowAPI = window.editorWindowAPI || {};
  window.editorWindowAPI.editorContext = editorContext;
  window.editorWindowAPI.meta = meta;
  window.editorWindowAPI.compiled = renderableContent;
  window.editorWindowAPI.externalData = externalData;

  useEffect(() => {
    push({
      config: initialEntry,
      focussedField: [],
    });
  }, []);

  useEffect(() => {
    sendCanvasData();
    if (window.editorWindowAPI.onUpdate) {
      window.editorWindowAPI.onUpdate();
    }
  }, [
    renderableContent,
    focussedField,
    isEditing,
    currentViewport,
    externalData,
  ]);

  useEffect(() => {
    function handleEditorEvents(
      event:
        | ComponentPickerOpenedEvent
        | ItemInsertedEvent
        | ItemMovedEvent
        | ChangeResponsiveEvent
        | SetFocussedFieldEvent
        | UndoEvent
        | RedoEvent
    ) {
      if (event.data.type === "@easyblocks-editor/focus-field") {
        handleSetFocussedField(event.data.payload.target);
      }

      if (event.data.type === "@easyblocks-editor/change-responsive") {
        setCurrentViewport(event.data.payload.device);
      }

      if (event.data.type === "@easyblocks-editor/undo") {
        undo();
      }

      if (event.data.type === "@easyblocks-editor/redo") {
        redo();
      }

      if (event.data.type === "@easyblocks-editor/component-picker-opened") {
        actions
          .openComponentPicker({ path: event.data.payload.path })
          .then((config) => {
            const shopstoryCanvasIframe = window.document.getElementById(
              "shopstory-canvas"
            ) as HTMLIFrameElement | undefined;

            shopstoryCanvasIframe?.contentWindow?.postMessage(
              componentPickerClosed(config)
            );
          });
      }

      if (event.data.type === "@easyblocks-editor/item-inserted") {
        actions.insertItem(event.data.payload);
      }

      if (event.data.type === "@easyblocks-editor/item-moved") {
        const { fromPath, toPath, placement } = event.data.payload;

        const fromPathParseResult = parsePath(fromPath, editorContext.form);
        const toPathParseResult = parsePath(toPath, editorContext.form);

        if (
          !fromPathParseResult.parent ||
          !toPathParseResult.parent ||
          fromPathParseResult.index === undefined ||
          toPathParseResult === undefined
        ) {
          return;
        }

        if (fromPathParseResult.parent.path === toPathParseResult.parent.path) {
          const pathToMove = `${
            fromPathParseResult.parent.path
              ? fromPathParseResult.parent.path + "."
              : ""
          }${fromPathParseResult.parent.fieldName}`;

          actions.runChange(() => {
            form.mutators.move(
              pathToMove,
              fromPathParseResult.index,
              toPathParseResult.index
            );

            return [toPath];
          });
        } else {
          // TODO: We should reuse logic of pasting items here, but we need to handle the case of pasting into placeholder (empty array)
          const isToPathPlaceholder = toPathParseResult.fieldName !== undefined;

          const insertionPath = `${
            toPathParseResult.parent.path === ""
              ? ""
              : toPathParseResult.parent.path + "."
          }${toPathParseResult.parent.fieldName}${
            isToPathPlaceholder
              ? `.${toPathParseResult.index}.${toPathParseResult.fieldName}`
              : ""
          }`;

          actions.runChange(() => {
            const newConfig = duplicateConfig(
              dotNotationGet(form.values, fromPath),
              editorContext
            );

            const insertionIndex = calculateInsertionIndex(
              fromPath,
              toPath,
              placement,
              form
            );

            form.mutators.insert(insertionPath, insertionIndex, newConfig);

            actions.removeItems([fromPath]);

            return [
              isToPathPlaceholder
                ? `${insertionPath}.0`
                : `${insertionPath}.${insertionIndex}`,
            ];
          });
        }
      }
    }

    window.addEventListener("message", handleEditorEvents);

    return () => window.removeEventListener("message", handleEditorEvents);
  }, []);

  const shopstoryCanvasIframe = window.document.getElementById(
    "shopstory-canvas"
  ) as HTMLIFrameElement | undefined;

  const sendCanvasData = () => {
    shopstoryCanvasIframe?.contentWindow?.postMessage(
      {
        type: "@easyblocks/canvas-data",
        data: JSON.stringify({
          compiled: renderableContent,
          meta,
          externalData,
          formValues: form.values,
          definitions: editorContext.definitions,
          locale: editorContext.contextParams.locale,
          locales: editorContext.locales,
          isEditing,
          devices: editorContext.devices,
          focussedField,
        }),
      },
      "*"
    );
  };

  const [isDataSaverOverlayOpen, setDataSaverOverlayOpen] = useState(false);

  useEditorGlobalKeyboardShortcuts(editorContext, shopstoryCanvasIframe);

  const { saveNow } = useDataSaver(initialDocument, editorContext);

  const appHeight = heightMode === "viewport" ? "100vh" : "100%";

  useEffect(() => {
    Modal.setAppElement("#shopstory-app");
  }, []);

  return (
    <div id={"shopstory-app"} style={{ height: appHeight, overflow: "hidden" }}>
      {isDataSaverOverlayOpen && (
        <DataSaverRoot>
          <DataSaverOverlay></DataSaverOverlay>

          <DataSaverModal>
            Saving data, please do not close the window...
          </DataSaverModal>
        </DataSaverRoot>
      )}
      <EditorContext.Provider value={editorContext}>
        <ConfigAfterAutoContext.Provider value={configAfterAuto}>
          <EditorExternalDataProvider externalData={externalData}>
            <div id="rootContainer" />
            <EditorTopBar
              onUndo={undo}
              onRedo={redo}
              onClose={() => {
                setDataSaverOverlayOpen(true);
                saveNow().finally(() => {
                  setDataSaverOverlayOpen(false);

                  window.postMessage(
                    {
                      type: "@easyblocks/closed",
                    },
                    "*"
                  );

                  if (props.onClose) {
                    props.onClose();
                  }
                });
              }}
              devices={compilationContext.devices}
              viewport={currentViewport}
              onViewportChange={setCurrentViewport}
              onIsEditingChange={handleSetEditing}
              isEditing={isEditing}
              saveLabel={"Save"}
              locale={compilationContext.contextParams.locale}
              locales={editorContext.locales}
              onLocaleChange={() => {}}
              onAdminModeChange={(val) => {
                setAdminMode(val);
              }}
              hideCloseButton={props.config.hideCloseButton ?? false}
              readOnly={editorContext.readOnly}
            />
            <SidebarAndContentContainer height={appHeight}>
              <ContentContainer
                onClick={() => {
                  setFocussedField([]);
                }}
              >
                <EditorIframe
                  onEditorHistoryUndo={undo}
                  onEditorHistoryRedo={redo}
                  width={iframeSize.width}
                  height={iframeSize.height}
                  transform={iframeSize.transform}
                  containerRef={iframeContainerRef}
                />
                {isEditing && (
                  <SelectionFrame
                    width={iframeSize.width}
                    height={iframeSize.height}
                    transform={iframeSize.transform}
                  />
                )}
              </ContentContainer>
              {isEditing && (
                <SidebarContainer ref={sidebarNodeRef}>
                  <EditorSidebar focussedField={focussedField} form={form} />
                </SidebarContainer>
              )}
              {componentPickerData && (
                <ModalPicker
                  onClose={closeComponentPickerModal}
                  config={componentPickerData.config}
                />
              )}
            </SidebarAndContentContainer>

            {openTemplateModalAction && (
              <TemplateModal
                action={openTemplateModalAction}
                onClose={() => {
                  setOpenTemplateModalAction(undefined);
                }}
                backend={editorContext.backend}
              />
            )}
          </EditorExternalDataProvider>
        </ConfigAfterAutoContext.Provider>
      </EditorContext.Provider>
    </div>
  );
};

function adaptRemoteConfig(
  config: NoCodeComponentEntry,
  compilationContext: CompilationContextType
) {
  const withoutLocalizedFlag = removeLocalizedFlag(config, compilationContext);
  const normalized = normalize(withoutLocalizedFlag, compilationContext);
  return normalized;
}

function calculateInsertionIndex(
  fromPath: string,
  toPath: string,
  placement: "before" | "after" | undefined,
  form: Form
) {
  const mostCommonPath = getMostCommonSubPath(fromPath, toPath);
  const mostCommonPathParseResult = parsePath(mostCommonPath ?? "", form);
  const toPathParseResult = parsePath(toPath, form);
  const toPathNoCodeEntry = dotNotationGet(form.values, toPath);

  if (toPathNoCodeEntry.length === 0) {
    return 0;
  }

  // If there is no index in common path, it means that we're moving items between two sections
  if (mostCommonPathParseResult.index === undefined) {
    const fromPathRootSectionIndex = +fromPath.split(".")[1];
    const toPathRootSectionIndex = +toPath.split(".")[1];

    if (fromPathRootSectionIndex > toPathRootSectionIndex) {
      if (placement) {
        if (placement === "before") {
          return toPathParseResult.index!;
        }

        return toPathParseResult.index! + 1;
      }

      return toPathParseResult.index!;
    }

    if (placement) {
      if (placement === "before") {
        return toPathParseResult.index!;
      }

      return toPathParseResult.index! + 1;
    }

    return toPathParseResult.index! + 1;
  }

  return toPathParseResult.index! + 1;
}

function getMostCommonSubPath(path1: string, path2: string) {
  const fromPathParts = path1.split(".");
  const toPathParts = path2.split(".");

  let mostCommonPathParts: Array<string> | undefined = undefined;

  for (let i = 0; i < Math.min(fromPathParts.length, toPathParts.length); i++) {
    const currentFromPathPart = fromPathParts[i];
    const currentToPathPart = toPathParts[i];

    if (currentFromPathPart !== currentToPathPart) {
      break;
    }

    if (!mostCommonPathParts) {
      mostCommonPathParts = [currentFromPathPart];
      continue;
    }

    mostCommonPathParts.push(currentFromPathPart);
  }

  return mostCommonPathParts?.join(".");
}

function findConfigById(
  config: NoCodeComponentEntry,
  context: CompilationContextType,
  configId: string
): NoCodeComponentEntry | undefined {
  let foundConfig: NoCodeComponentEntry | undefined;

  traverseComponents(config, context, ({ componentConfig }) => {
    if (foundConfig) {
      return;
    }

    if (componentConfig._id === configId) {
      foundConfig = componentConfig;
    }
  });

  return foundConfig;
}

function getMatchingDevice(devices: Array<DeviceRange>, width: number) {
  const highestDevice = devices.find((d) => d.breakpoint === null);

  const visibleDevices = devices.filter(
    (d) => !d.hidden && d.breakpoint !== null
  );

  for (let i = 0; i < visibleDevices.length; i++) {
    const currentDevice = visibleDevices[i];

    if (currentDevice.breakpoint! > width) {
      return currentDevice;
    }
  }

  if (highestDevice) {
    return highestDevice;
  }

  return null;
}
