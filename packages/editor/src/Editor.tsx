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
  CompilationContextType,
  ComponentPickerOpenedEvent,
  InternalComponentDefinition,
  ItemInsertedEvent,
  ItemMovedEvent,
  componentPickerClosed,
  duplicateConfig,
  findComponentDefinitionById,
  parsePath,
  traverseComponents,
} from "@easyblocks/core/_internals";
import { Colors, Fonts, useToaster } from "@easyblocks/design-system";
import { dotNotationGet, uniqueId, useForceRerender } from "@easyblocks/utils";
import throttle from "lodash.throttle";
import React, {
  ComponentType,
  memo,
  useCallback,
  useEffect,
  useRef,
  useMemo,
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
import { useEditorHistory, EditorHistoryChange } from "./useEditorHistory";
import { checkLocalesCorrectness } from "./utils/locales/checkLocalesCorrectness";
import { removeLocalizedFlag } from "./utils/locales/removeLocalizedFlag";
import { TemplatePicker } from "./TemplatePicker";

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

const noop = () => {};

interface EditorProps {
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
  pickers?: Record<string, TemplatePicker>;
}

export const Editor = memo(EditorBackendInitializer);

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
  }, [props.documentId, props.config.backend.documents]);

  if (!enabled) {
    return <AuthenticationScreen>Loading...</AuthenticationScreen>;
  }

  if (error) {
    return (
      <DataSaverRoot>
        <DataSaverOverlay />
        <DataSaverModal>{error}</DataSaverModal>
      </DataSaverRoot>
    );
  }

  return <EditorWrapper {...props} document={document} />;
}

interface EditorWrapperProps extends EditorProps {
  document: Document | null;
}

const EditorWrapper = memo((props: EditorWrapperProps) => {
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

  const locale = useMemo(() => {
    // very important to check locales correctness, circular references etc. Other functions
    checkLocalesCorrectness(props.config.locales);
    return props.locale ?? getDefaultLocale(props.config.locales).code;
  }, [props.locale, props.config.locales]);

  const rootTemplateEntry = useMemo(() => {
    return props.rootTemplateId
      ? props.config.templates?.find((t) => t.id === props.rootTemplateId)
          ?.entry
      : null;
  }, [props.rootTemplateId, props.config.templates]);

  const rootComponentId = props.document
    ? props.document.entry._component
    : rootTemplateEntry?._component ?? props.rootComponentId;

  const compilationContext = useMemo(() => {
    return createCompilationContext(
      props.config,
      { locale },
      rootComponentId as string
    );
  }, [locale, props.config, rootComponentId]);

  const initialEntry = useMemo(() => {
    return props.document
      ? adaptRemoteConfig(props.document.entry, compilationContext)
      : normalize(
          rootTemplateEntry ?? {
            _id: uniqueId(),
            _component: rootComponentId as string,
          },
          compilationContext
        );
  }, [compilationContext, props.document, rootComponentId, rootTemplateEntry]);

  return (
    <EditorContent
      {...props}
      compilationContext={compilationContext}
      initialDocument={props.document}
      initialEntry={initialEntry}
    />
  );
});

interface EditorContentProps extends EditorProps {
  compilationContext: CompilationContextType;
  initialDocument: Document | null;
  initialEntry: NoCodeComponentEntry;
  heightMode?: "viewport" | "full";
}

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
  const buildEntryResult = useMemo<ReturnType<typeof buildEntry>>(() => {
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
    return buildEntry({
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
        if (storedExternalData && externalDataValue.externalId && rawContent) {
          const { breakpointIndex, configId, fieldName } = parseExternalDataId(
            externalDataValue.id
          );

          const config = findConfigById(
            rawContent,
            editorContext,
            configId === "$" ? rawContent._id : configId
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
  }, [config, editorContext, externalData, rawContent]);

  useEffect(() => {
    if (Object.keys(buildEntryResult.externalData).length > 0) {
      onExternalDataChange(
        buildEntryResult.externalData,
        editorContext.contextParams
      );
    }
  }, [
    buildEntryResult.externalData,
    editorContext.contextParams,
    onExternalDataChange,
  ]);

  return buildEntryResult;
}

function calculateViewportRelatedStuff(
  viewport: string,
  devices: DeviceRange[],
  mainBreakpointIndex: string,
  availableSize?: { width: number; height: number }
) {
  let activeDevice: DeviceRange | undefined;

  // Calculate active device
  if (viewport === "fit-screen") {
    if (!availableSize) {
      activeDevice = devices.find(
        (device) => device.id === mainBreakpointIndex
      );
    } else {
      const matchingDevice = getMatchingDevice(devices, availableSize.width);
      if (!matchingDevice) {
        throw new Error("can't find matching device");
      }

      activeDevice = matchingDevice;
    }
  } else {
    activeDevice = devices.find((device) => device.id === viewport);
  }

  if (activeDevice === undefined) {
    throw new Error("can't find active device");
  }

  const activeDeviceIndex = devices.findIndex(
    (device) => device.id === activeDevice.id
  );

  // Calculate width, height and scale
  let width: number, height: number;
  let scaleFactor: number = Number.NaN;
  let offsetY = 0;

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
        activeDeviceIndex === 0
          ? 0
          : devices[activeDeviceIndex - 1].breakpoint ?? 0;

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
      transform: Number.isFinite(scaleFactor)
        ? `translateY(${offsetY}px) scale(${scaleFactor})`
        : "none",
    },
  };
}

function useRerenderOnIframeResize(iframe?: HTMLIFrameElement | null) {
  const { forceRerender } = useForceRerender();

  const resizeObserver = useMemo(
    () =>
      new ResizeObserver(
        throttle(() => {
          forceRerender();
        }, 100)
      ),
    [forceRerender]
  );

  useEffect(() => {
    if (!iframe) {
      return () => {};
    }

    resizeObserver.observe(iframe);

    return () => {
      resizeObserver.unobserve(iframe);
    };
  }, [iframe, resizeObserver]);
}

const EditorContent = memo(
  ({
    compilationContext,
    heightMode = "viewport",
    initialDocument,
    initialEntry,
    externalData,
    config,
    onClose,
    ...props
  }: EditorContentProps) => {
    const [currentViewport, setCurrentViewport] = useState<string>(
      compilationContext.mainBreakpointIndex
    ); // "{ breakpoint }" or "fit-screen"

    const iframeContainerRef = useRef<HTMLIFrameElement>(null);

    const availableWidth = iframeContainerRef.current?.clientWidth;
    const availableHeight = iframeContainerRef.current?.clientHeight;

    const { breakpointIndex, iframeSize } = useMemo(() => {
      const availableSize =
        typeof availableWidth === "number" &&
        typeof availableHeight === "number"
          ? { width: availableWidth, height: availableHeight }
          : undefined;

      return calculateViewportRelatedStuff(
        currentViewport,
        compilationContext.devices,
        compilationContext.mainBreakpointIndex,
        availableSize
      );
    }, [
      currentViewport,
      availableWidth,
      availableHeight,
      compilationContext.mainBreakpointIndex,
      compilationContext.devices,
    ]);

    // re-render on resize (recalculates viewport size, active breakpoint for fit-screen etc);
    useRerenderOnIframeResize(iframeContainerRef.current);

    const compilationCache = useMemo(() => new CompilationCache(), []);
    const [isEditing, setEditing] = useState(true);

    const [componentPickerData, setComponentPickerData] = useState<
      | {
          promiseResolve: (config: NoCodeComponentEntry | undefined) => void;
          config: OpenComponentPickerConfig;
        }
      | undefined
    >(undefined);

    const [focussedField, setFocussedField] = useState<string[]>([]);

    const handleSetFocussedField = useCallback((field: string[] | string) => {
      const nextFocusedField = Array.isArray(field) ? field : [field];
      setFocussedField(nextFocusedField);
    }, []);

    const onFocussedFieldClear = useCallback(() => {
      setFocussedField([]);
    }, []);

    const handleSetEditing = useCallback(() => {
      compilationCache.clear();
      setEditing((isEditing) => !isEditing);
    }, [compilationCache]);

    const closeComponentPickerModal = useCallback(
      (config?: NoCodeComponentEntry) => {
        setComponentPickerData(undefined);
        componentPickerData?.promiseResolve(config);
      },
      [componentPickerData]
    );

    const sidebarNodeRef = useRef<HTMLDivElement | null>(null);

    const [editableData, form] = useForm({
      id: "easyblocks-editor",
      label: "Edit entry",
      fields: [],
      initialValues: initialEntry,
      onSubmit: async () => {},
    });

    const onHistoryChange = useCallback(
      ({ config, focusedField }: EditorHistoryChange) => {
        setFocussedField(focusedField);
        form.finalForm.change("", config);
      },
      [form]
    );

    const { undo, redo, push } = useEditorHistory({
      onChange: onHistoryChange,
    });

    const [templates, setTemplates] = useState<Template[] | undefined>(
      undefined
    );

    const [openTemplateModalAction, setOpenTemplateModalAction] = useState<
      OpenTemplateModalAction | undefined
    >(undefined);

    const onTemplateModalClose = useCallback(() => {
      setOpenTemplateModalAction(undefined);
    }, []);

    const editorContextRef = useRef<EditorContextType | undefined>(undefined);

    const { notify } = useToaster();

    const actions: ActionsType = useMemo<ActionsType>(
      () => ({
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
            if (editorContextRef.current) {
              replaceItems(paths, newConfig, editorContextRef.current);
            }
          });
        },
        moveItems: (fieldNames, direction) => {
          actions.runChange(() => {
            return moveItems(form, fieldNames, direction);
          });
        },
        removeItems: (fieldNames) => {
          actions.runChange(() => {
            if (editorContextRef.current) {
              removeItems(form, fieldNames, editorContextRef.current);
            }
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
          actions.runChange(() => {
            setFocussedField((focussedField) => {
              pasteItems({
                what,
                where: focussedField,
                resolveDestination: destinationResolver({
                  form,
                  context: compilationContext,
                }),
                pasteCommand: pasteManager(),
              });

              return focussedField;
            });
          });
        },
        runChange: (configChangeCallback) => {
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
            setFocussedField((focussedField) => {
              const fieldsToFocus = configChangeCallback() ?? [
                ...focussedField,
              ];

              push({
                config: form.values,
                focussedField: fieldsToFocus,
              });

              return fieldsToFocus;
            });
          });
        },
        logSelectedItems: () => {
          setFocussedField((focussedField) => {
            if (editorContextRef.current) {
              logItems(editorContextRef.current.form, focussedField);
            }

            return focussedField;
          });
        },
      }),
      [compilationContext, form, notify, push]
    );

    const [isAdminMode, setAdminMode] = useState(false);

    const onAdminModeChange = useCallback((adminMode: boolean) => {
      setAdminMode(adminMode);
    }, []);

    const syncTemplates = useCallback(() => {
      getTemplates(
        editorContextRef.current as EditorContextType,
        (config.templates as any[]) ?? []
      ).then((newTemplates) => {
        setTemplates(newTemplates);
      });
    }, [config.templates]);

    useEffect(() => {
      syncTemplates();
    }, [syncTemplates]);

    const editorContext = useMemo<EditorContextType>(() => {
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
                        component: props.widgets?.[
                          typeDefinition.widget.id
                        ] as any,
                      },
                    }
                  : undefined),
              },
            ];
          }
        )
      );

      const editorContext: EditorContextType = {
        ...compilationContext,
        backend: config.backend,
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
        compilationCache: compilationCache,
        readOnly: props.readOnly,
        disableCustomTemplates: config.disableCustomTemplates ?? false,
        rootComponent: findComponentDefinitionById(
          initialEntry._component,
          compilationContext
        ) as InternalComponentDefinition,
        components: props.components ?? {},
      };

      editorContextRef.current = editorContext;

      return editorContext;
    }, [
      actions,
      breakpointIndex,
      compilationCache,
      compilationContext,
      focussedField,
      form,
      handleSetFocussedField,
      initialEntry._component,
      isAdminMode,
      isEditing,
      props.components,
      config.backend,
      config.disableCustomTemplates,
      props.readOnly,
      props.widgets,
      syncTemplates,
      templates,
    ]);

    const { configAfterAuto, renderableContent, meta } = useBuiltContent(
      editorContext,
      config,
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
        event: ComponentPickerOpenedEvent | ItemInsertedEvent | ItemMovedEvent
      ) {
        switch (event.data.type) {
          case "@easyblocks-editor/component-picker-opened": {
            actions
              .openComponentPicker({ path: event.data.payload.path })
              .then((config) => {
                const shopstoryCanvasIframe = window.document.getElementById(
                  "shopstory-canvas"
                ) as HTMLIFrameElement | null;

                shopstoryCanvasIframe?.contentWindow?.postMessage(
                  componentPickerClosed(config),
                  "*"
                );
              });

            break;
          }

          case "@easyblocks-editor/item-inserted": {
            actions.insertItem(event.data.payload);
            break;
          }

          case "@easyblocks-editor/item-moved": {
            const { fromPath, toPath, placement } = event.data.payload;
            const editorContext = editorContextRef.current as EditorContextType;

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

            if (
              fromPathParseResult.parent.path === toPathParseResult.parent.path
            ) {
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
              const isToPathPlaceholder =
                toPathParseResult.fieldName !== undefined;

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

            break;
          }

          default:
            break;
        }
      }

      window.addEventListener("message", handleEditorEvents);

      return () => {
        window.removeEventListener("message", handleEditorEvents);
      };
    }, [actions, form]);

    const [isDataSaverOverlayOpen, setDataSaverOverlayOpen] = useState(false);

    useEditorGlobalKeyboardShortcuts(editorContext);

    const { saveNow } = useDataSaver(initialDocument, editorContext);

    const onTopBarClose = useCallback(() => {
      setDataSaverOverlayOpen(true);
      saveNow().finally(() => {
        setDataSaverOverlayOpen(false);

        window.postMessage(
          {
            type: "@easyblocks/closed",
          },
          "*"
        );

        if (onClose) {
          onClose();
        }
      });
    }, [saveNow, onClose]);

    const appHeight = heightMode === "viewport" ? "100vh" : "100%";

    useEffect(() => {
      Modal.setAppElement("#shopstory-app");
    }, []);

    return (
      <div id="shopstory-app" style={{ height: appHeight, overflow: "hidden" }}>
        {isDataSaverOverlayOpen && (
          <DataSaverRoot>
            <DataSaverOverlay />

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
                onClose={onTopBarClose}
                devices={compilationContext.devices}
                viewport={currentViewport}
                onViewportChange={setCurrentViewport}
                onIsEditingChange={handleSetEditing}
                isEditing={isEditing}
                saveLabel="Save"
                locale={compilationContext.contextParams.locale}
                locales={editorContext.locales}
                onLocaleChange={noop}
                onAdminModeChange={onAdminModeChange}
                hideCloseButton={config.hideCloseButton ?? false}
                readOnly={editorContext.readOnly}
              />

              <SidebarAndContentContainer height={appHeight}>
                <ContentContainer onClick={onFocussedFieldClear}>
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
                    pickers={props.pickers}
                  />
                )}
              </SidebarAndContentContainer>

              {openTemplateModalAction && (
                <TemplateModal
                  action={openTemplateModalAction}
                  onClose={onTemplateModalClose}
                  backend={editorContext.backend}
                />
              )}
            </EditorExternalDataProvider>
          </ConfigAfterAutoContext.Provider>
        </EditorContext.Provider>
      </div>
    );
  }
);

function adaptRemoteConfig(
  config: NoCodeComponentEntry,
  compilationContext: CompilationContextType
): NoCodeComponentEntry {
  const withoutLocalizedFlag = removeLocalizedFlag(config, compilationContext);
  const normalized = normalize(withoutLocalizedFlag, compilationContext);
  return normalized;
}

function calculateInsertionIndex(
  fromPath: string,
  toPath: string,
  placement: "before" | "after" | undefined,
  form: Form
): number {
  const mostCommonPath = getMostCommonSubPath(fromPath, toPath);
  const mostCommonPathParseResult = parsePath(mostCommonPath, form);
  const toPathParseResult = parsePath(toPath, form);
  const toPathNoCodeEntry = dotNotationGet(form.values, toPath);

  if (toPathNoCodeEntry.length === 0 || toPathParseResult.index === undefined) {
    return 0;
  }

  // If there is no index in common path, it means that we're moving items between two sections
  if (mostCommonPathParseResult.index === undefined) {
    const fromPathRootSectionIndex = Number(fromPath.split(".")[1]);
    const toPathRootSectionIndex = Number(toPath.split(".")[1]);

    if (fromPathRootSectionIndex > toPathRootSectionIndex) {
      if (placement) {
        if (placement === "before") {
          return toPathParseResult.index;
        }

        return toPathParseResult.index + 1;
      }

      return toPathParseResult.index;
    }

    if (placement) {
      if (placement === "before") {
        return toPathParseResult.index;
      }

      return toPathParseResult.index + 1;
    }

    return toPathParseResult.index + 1;
  }

  return toPathParseResult.index + 1;
}

function getMostCommonSubPath(path1: string, path2: string): string {
  const fromPathParts = path1.split(".");
  const toPathParts = path2.split(".");
  const length = Math.min(fromPathParts.length, toPathParts.length);

  const mostCommonPathParts: string[] = [];

  for (let i = 0; i < length; ++i) {
    const currentFromPathPart = fromPathParts[i];
    const currentToPathPart = toPathParts[i];

    if (currentFromPathPart !== currentToPathPart) {
      break;
    }

    mostCommonPathParts.push(currentFromPathPart);
  }

  return mostCommonPathParts.join(".");
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

function getMatchingDevice(
  devices: Array<DeviceRange>,
  width: number
): DeviceRange | null {
  const highestDevice = devices.find((d) => d.breakpoint === null);

  const visibleDevices = devices.filter(
    (d) => !d.hidden && d.breakpoint !== null
  );

  for (let i = 0; i < visibleDevices.length; i++) {
    const currentDevice = visibleDevices[i];

    if ((currentDevice.breakpoint ?? 0) > width) {
      return currentDevice;
    }
  }

  if (highestDevice) {
    return highestDevice;
  }

  return null;
}
