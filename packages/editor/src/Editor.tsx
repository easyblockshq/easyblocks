import {
  componentPickerClosed,
  ComponentPickerOpenedEvent,
  Form,
  ItemInsertedEvent,
  ItemMovedEvent,
  useEditorGlobalKeyboardShortcuts,
} from "@easyblocks/app-utils";
import {
  buildEntry,
  CompilationCache,
  CompilationMetadata,
  compileInternal,
  ComponentConfig,
  Config,
  ConfigComponent,
  ContextParams,
  createCompilationContext,
  DocumentWithResolvedConfigDTO,
  EditorLauncherProps,
  ExternalData,
  ExternalDataChangeHandler,
  ExternalReference,
  FetchOutputResources,
  findExternals,
  IApiClient,
  Locale,
  LocalisedDocument,
  mergeCompilationMeta,
  NonEmptyRenderableContent,
  normalize,
  normalizeInput,
  responsiveValueGet,
  Template,
  validate,
  WidgetComponentProps,
} from "@easyblocks/core";
import {
  CompilationContextType,
  duplicateConfig,
  findComponentDefinitionById,
  parsePath,
  traverseComponents,
} from "@easyblocks/core/_internals";
import { SSColors, SSFonts, useToaster } from "@easyblocks/design-system";
import { assertDefined, dotNotationGet, raiseError } from "@easyblocks/utils";
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
import {
  duplicateItems,
  logItems,
  moveItems,
  pasteItems,
  removeItems,
  replaceItems,
} from "./editorActions";
import { EditorContext, EditorContextType } from "./EditorContext";
import { EditorExternalDataProvider } from "./EditorExternalDataProvider";
import { EditorIframe } from "./EditorIframe";
import { EditorSidebar } from "./EditorSidebar";
import { EditorTopBar, TOP_BAR_HEIGHT } from "./EditorTopBar";
import {
  ApiClientProvider,
  useApiClient,
} from "./infrastructure/ApiClientProvider";
import { createApiClient } from "./infrastructure/createApiClient";
import { ProjectsApiService } from "./infrastructure/projectsApiService";
import { ModalPicker } from "./ModalPicker";
import { destinationResolver } from "./paste/destinationResolver";
import { pasteManager } from "./paste/manager";
import { SelectionFrame } from "./selectionFrame/SelectionFrame";
import { documentDataWidgetFactory } from "./sidebar/DocumentDataWidget";
import { TemplateModal } from "./TemplateModal";
import { getTemplates } from "./templates/getTemplates";
import { TinaProvider } from "./tinacms";
import { useForm, usePlugin } from "./tinacms/react-core";
import {
  ActionsType,
  CMSInput,
  OpenComponentPickerConfig,
  OpenTemplateModalAction,
} from "./types";
import { useDataSaver } from "./useDataSaver";
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
  background: ${SSColors.white};
  border-left: 1px solid ${SSColors.black100};
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
  ${SSFonts.body}
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
  ${SSFonts.bodyLarge}
`;

type EditorContainerProps = {
  config: Config;
  contextParams: ContextParams;
  locales: Locale[];
  mode: "app" | "playground";
  documentId: string | null;
  rootContainer: NonNullable<EditorLauncherProps["rootContainer"]>;
  configs?: CMSInput;
  save?: (
    contentPiece: CMSInput,
    externals: ExternalReference[]
  ) => Promise<void>;
  onClose?: () => void;
  container?: HTMLElement;
  heightMode?: "viewport" | "parent";
  canvasUrl?: string;
  externalData: FetchOutputResources;
  onExternalDataChange: ExternalDataChangeHandler;
  widgets?: Record<string, ComponentType<WidgetComponentProps>>;
};

function EditorContainer(props: EditorContainerProps) {
  const [enabled, setEnabled] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [project, setProject] = useState<
    EditorContextType["project"] | undefined
  >(undefined);
  const [apiClient] = useState(() => createApiClient(props.config.accessToken));

  const isPlayground = props.mode === "playground";

  useEffect(() => {
    async function handleAccessTokenAuthorization() {
      if (enabled) {
        return;
      }

      const projectsApiService = new ProjectsApiService(apiClient);
      const projects = await projectsApiService.getProjects();

      if (projects.length === 0) {
        setError(
          "Authorization error. Have you provided a correct access token?"
        );
        return;
      }

      if (projects[0].tokens.length > 0) {
        setProject({
          ...projects[0],
          token: projects[0].tokens[0],
        });
      }

      setEnabled(true);
    }

    if (isPlayground) {
      console.debug(`Opening Shopstory in playground mode.`);
    } else {
      console.debug(
        `Opening Shopstory with access token: ${props.config.accessToken}`
      );
    }

    handleAccessTokenAuthorization();
  }, [apiClient, enabled, isPlayground, props.config.accessToken]);

  if (!enabled || !project) {
    return <AuthenticationScreen>Loading...</AuthenticationScreen>;
  }

  if (error) {
    return <AuthenticationScreen>{error}</AuthenticationScreen>;
  }

  return (
    <ApiClientProvider apiClient={apiClient}>
      <Editor
        {...props}
        locales={props.locales}
        contextParams={props.contextParams}
        documentId={props.documentId}
        isPlayground={isPlayground}
        rootContainer={props.rootContainer}
        project={project}
        isEnabled={enabled}
      />
    </ApiClientProvider>
  );
}

export type EditorProps = {
  configs?: CMSInput;
  save?: (
    localisedDocument: LocalisedDocument,
    externals: ExternalReference[]
  ) => Promise<void>;
  locales: Locale[];
  config: Config;
  contextParams: ContextParams;
  onClose?: () => void;
  rootContainer: NonNullable<EditorLauncherProps["rootContainer"]>;
  container?: HTMLElement;
  heightMode?: "viewport" | "parent";
  canvasUrl?: string;
  isEnabled: boolean;
  project: EditorContextType["project"];
  uniqueSourceIdentifier?: string;
  isPlayground: boolean;
  documentId: string | null;
  externalData: ExternalData;
  onExternalDataChange: ExternalDataChangeHandler;
  widgets?: Record<string, ComponentType<WidgetComponentProps>>;
};

const Editor = memo((props: EditorProps) => {
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [resolvedInput, setResolvedInput] = useState<{
    config: ComponentConfig;
    document: DocumentWithResolvedConfigDTO | null;
  } | null>(null);
  const apiClient = useApiClient();

  const compilationContext = createCompilationContext(
    props.config,
    props.contextParams,
    props.rootContainer
  );

  useEffect(() => {
    (async () => {
      if (!props.isEnabled) {
        return;
      }

      try {
        const resolvedInput = props.documentId
          ? await resolveDocumentId(
              props.documentId,
              props.project,
              apiClient,
              compilationContext
            )
          : getDefaultInput({
              rootContainer: props.rootContainer,
              compilationContext,
            });

        setResolvedInput(resolvedInput);
      } catch (error) {
        console.error(error);

        if (error instanceof Error) {
          setFetchError(error.message);
        }
      }
    })();
  }, [props.isEnabled, props.configs]);

  // Validation of locales, thanks to this we're sure that locales are properly set up
  if (!props.locales.find((l) => l.code === props.contextParams.locale)) {
    throw new Error(
      `Can't open editor with this locale: ${props.contextParams.locale}`
    );
  }

  checkLocalesCorrectness(props.locales); // very important to check locales correctness, circular references etc. Other functions

  if (fetchError) {
    return (
      <DataSaverRoot>
        <DataSaverOverlay></DataSaverOverlay>
        <DataSaverModal>{fetchError}</DataSaverModal>
      </DataSaverRoot>
    );
  }

  return resolvedInput === null || !props.isEnabled ? null : (
    <TinaProvider>
      <EditorContent
        {...props}
        compilationContext={compilationContext}
        initialDocument={resolvedInput.document}
        initialConfig={resolvedInput.config}
      />
    </TinaProvider>
  );
});

type EditorContentProps = EditorProps & {
  compilationContext: CompilationContextType;
  initialDocument: DocumentWithResolvedConfigDTO | null;
  initialConfig: ComponentConfig;
  isPlayground: boolean;
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
  contextParams: ContextParams,
  rawContent: ConfigComponent,
  rootContainer: string,
  externalData: ExternalData,
  onExternalDataChange: ExternalDataChangeHandler
): NonEmptyRenderableContent & {
  meta: CompilationMetadata;
} {
  const buildEntryResult = useRef<ReturnType<typeof buildEntry>>();

  // cached inputs (needed to calculated "inputChanged")
  const inputRawContent = useRef<ConfigComponent>();
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
      contextParams: {
        locale: contextParams.locale,
        rootContainer,
      },
      externalData,
      compiler: {
        findExternals,
        validate,
        compile: (content) => {
          let resultMeta: CompilationMetadata = {
            vars: {
              devices: editorContext.devices,
              locale: contextParams.locale,
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
        contextParams
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

const EditorContent = ({
  compilationContext,
  heightMode = "viewport",
  initialDocument,
  initialConfig,
  uniqueSourceIdentifier,
  isPlayground,
  rootContainer,
  externalData,
  ...props
}: EditorContentProps) => {
  const apiClient = useApiClient();

  const [breakpointIndex, setBreakpointIndex] = useState(
    compilationContext.mainBreakpointIndex
  );
  const compilationCache = useRef(new CompilationCache());
  const [isEditing, setEditing] = useState(true);
  const [componentPickerData, setComponentPickerData] = useState<
    | {
        promiseResolve: (config: ComponentConfig | undefined) => void;
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

  const handleSetBreakpoint = useCallback((breakpoint: string) => {
    setBreakpointIndex(breakpoint);
  }, []);

  const handleSetEditing = useCallback(() => {
    compilationCache.current.clear();
    setEditing(!isEditing);
  }, [isEditing]);

  const closeComponentPickerModal = (config?: ComponentConfig) => {
    setComponentPickerData(undefined);
    componentPickerData!.promiseResolve(config);
  };

  const sidebarNodeRef = useRef<HTMLDivElement | null>(null);

  const [editableData, form] = useForm({
    id: "easyblocks-editor",
    label: "Edit entry",
    fields: [],
    initialValues: initialConfig,
    onSubmit: async () => {},
  });

  const { undo, redo, push } = useEditorHistory({
    onChange: ({ config, focusedField }) => {
      setFocussedField(focusedField);
      form.finalForm.change("", config);
    },
  });

  const isMaster = !!props.config.__masterEnvironment;

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
  const [isFullScreen, setFullScreen] = useState(false);

  useEffect(() => {
    window.editorWindowAPI.externalData = externalData;
    console.debug("external data", window.editorWindowAPI.externalData);
    window.editorWindowAPI.onUpdate?.();
  }, [externalData]);

  const syncTemplates = () => {
    // @ts-expect-error
    getTemplates(editorContext, apiClient, props.config.templates ?? []).then(
      (newTemplates) => {
        setTemplates(newTemplates);
      }
    );
  };

  useEffect(() => {
    syncTemplates();
  }, []);

  const editorTypes: EditorContextType["types"] = Object.fromEntries(
    Object.entries(compilationContext.types).map(
      ([typeName, typeDefinition]) => {
        return [
          typeName,
          {
            widgets: typeDefinition.widgets.map((w) => {
              return {
                ...w,
                component:
                  props.widgets?.[w.id] ??
                  raiseError(`Missing widget component for widget "${w.id}"`),
              };
            }),
          },
        ];
      }
    )
  );

  const editorContext: EditorContextType = {
    ...compilationContext,
    types: editorTypes,
    isAdminMode,
    templates,
    syncTemplates,
    breakpointIndex,
    isMaster,
    focussedField,
    form,
    setFocussedField: handleSetFocussedField,
    isEditing,
    setBreakpointIndex: (newBreakpointIndex) => {
      setBreakpointIndex(newBreakpointIndex);
    },
    actions,
    save: async (documentData) => {
      window.postMessage({
        type: "@easyblocks/content-saved",
        document: documentData,
      });
    },
    text: undefined,
    locales: props.locales,
    resources: [],
    compilationCache: compilationCache.current,
    project: props.project,
    isPlayground,
    activeRootContainer: assertDefined(
      compilationContext.rootContainers.find((r) => r.id === rootContainer)
    ),
    disableCustomTemplates: props.config.disableCustomTemplates ?? false,
    isFullScreen,
  };

  if (editorContext.activeRootContainer.schema) {
    const documentParamsTypes = editorContext.activeRootContainer.schema.map(
      (s) => s.type
    );
    const types = Array.from(
      new Set(["image", "video", "text", ...Object.keys(editorContext.types)])
    ).filter((t) => !documentParamsTypes.includes(t) && editorContext.types[t]);

    types.forEach((builtinExternalType) => {
      // Make sure to add the document data widget to custom types
      if (
        !editorContext.types[builtinExternalType].widgets.some(
          (w) => w.id === "@easyblocks/document-data"
        )
      ) {
        if (!editorContext.types[builtinExternalType]) {
          editorContext.types[builtinExternalType] = {
            widgets: [],
          };
        }

        editorContext.types[builtinExternalType].widgets.push(
          documentDataWidgetFactory({
            type: builtinExternalType,
          })
        );
      }
    });
  }

  const { configAfterAuto, renderableContent, meta } = useBuiltContent(
    editorContext,
    props.config,
    {
      ...props.contextParams,
      isEditing,
    },
    editableData,
    rootContainer,
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

  window.editorWindowAPI = window.editorWindowAPI || {};
  window.editorWindowAPI.editorContext = editorContext;
  window.editorWindowAPI.meta = meta;
  window.editorWindowAPI.compiled = renderableContent;
  window.editorWindowAPI.externalData =
    window.editorWindowAPI.externalData ?? {};

  usePlugin(form);

  useEffect(() => {
    push({
      config: initialConfig,
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
    breakpointIndex,
    isFullScreen,
  ]);

  useEffect(() => {
    function handleEditorEvents(
      event: ComponentPickerOpenedEvent | ItemInsertedEvent | ItemMovedEvent
    ) {
      if (event.data.type === "@shopstory-editor/component-picker-opened") {
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

      if (event.data.type === "@shopstory-editor/item-inserted") {
        actions.insertItem(event.data.payload);
      }

      if (event.data.type === "@shopstory-editor/item-moved") {
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
            let newConfig = duplicateConfig(
              dotNotationGet(form.values, fromPath),
              editorContext
            );

            if (
              !newConfig._itemProps[toPathParseResult.templateId]?.[
                toPathParseResult.fieldName!
              ]
            ) {
              newConfig._itemProps = {
                [toPathParseResult.templateId]: {
                  [toPathParseResult.fieldName!]: {},
                },
              };

              newConfig = normalize(newConfig, editorContext);
            }

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

  useEffect(() => {
    Modal.setAppElement("#shopstory-app");
  }, []);

  const [isDataSaverOverlayOpen, setDataSaverOverlayOpen] = useState(false);

  useEditorGlobalKeyboardShortcuts(editorContext);

  const { saveNow } = useDataSaver(
    initialDocument,
    uniqueSourceIdentifier,
    editorContext
  );

  const { height, scaleFactor, width, iframeContainerRef } = useIframeSize({
    isScalingEnabled: !isFullScreen && isEditing,
    editorContext,
  });

  const [appNodeRef, setAppNodeRef] = useState<HTMLDivElement | null>(null);

  const selectionFrameSize = {
    width,
    height:
      // When rendering in CMS environment, the dialog for Shopstory app could be smaller than current device height
      Math.min(height, (appNodeRef?.clientHeight ?? 0) - TOP_BAR_HEIGHT),
  };

  const appHeight = heightMode === "viewport" ? "100vh" : "100%";

  return (
    <div
      id={"shopstory-app"}
      style={{ height: appHeight, overflow: "hidden" }}
      ref={setAppNodeRef}
    >
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
              breakpointIndex={breakpointIndex}
              onBreakpointChange={handleSetBreakpoint}
              onIsEditingChange={handleSetEditing}
              isEditing={isEditing}
              saveLabel={"Save"}
              locale={compilationContext.contextParams.locale}
              locales={editorContext.locales}
              onLocaleChange={() => {}}
              isFullScreen={isFullScreen}
              setFullScreen={setFullScreen}
              onAdminModeChange={(val) => {
                setAdminMode(val);
              }}
              hideCloseButton={props.config.hideCloseButton ?? false}
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
                  isFullScreen={isFullScreen}
                  isEditing={isEditing}
                  height={height}
                  scaleFactor={scaleFactor}
                  width={width}
                  containerRef={iframeContainerRef}
                  margin={heightMode === "viewport" ? 0 : 100}
                  url={props.canvasUrl}
                />
                {isEditing && (
                  <SelectionFrame
                    {...selectionFrameSize}
                    scaleFactor={scaleFactor}
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
              />
            )}
          </EditorExternalDataProvider>
        </ConfigAfterAutoContext.Provider>
      </EditorContext.Provider>
    </div>
  );
};

export { EditorContainer as Editor, EditorContent };
export type { EditorContentProps };

function useIframeSize({
  isScalingEnabled,
  editorContext,
}: {
  isScalingEnabled: boolean;
  editorContext: EditorContextType;
}) {
  const { breakpointIndex, devices } = editorContext;

  const currentDeviceIndex = devices.findIndex(
    (device) => device.id === breakpointIndex
  )!;
  const currentDevice = devices[currentDeviceIndex];

  const iframeContainerRef = useRef<HTMLDivElement>(null);

  const [scaleFactor, setScaleFactor] = useState<null | number>(null);
  const [displayedWidth, setDisplayedWidth] = useState<number>(currentDevice.w);

  useEffect(() => {
    const updateTransform = () => {
      const availableW = iframeContainerRef.current?.clientWidth ?? 0;
      // viewport smaller than main device resolution
      if (currentDevice.w > availableW && isScalingEnabled) {
        const smallestNonScaledWidth =
          currentDeviceIndex === 0
            ? 0
            : devices[currentDeviceIndex - 1].breakpoint!;

        // viewport still bigger than smallest device resolution
        if (smallestNonScaledWidth <= availableW) {
          setDisplayedWidth(availableW);
          setScaleFactor(null);
        } else {
          setDisplayedWidth(smallestNonScaledWidth);
          setScaleFactor(availableW / smallestNonScaledWidth);
        }
      }
      // viewport bigger than main device resolution
      else {
        setScaleFactor(null);
        setDisplayedWidth(currentDevice.w);
      }
    };

    updateTransform();

    window.addEventListener("resize", updateTransform);

    return () => {
      window.removeEventListener("resize", updateTransform);
    };
  }, [currentDevice.w, currentDeviceIndex, devices, isScalingEnabled]);

  return {
    width: displayedWidth,
    height: currentDevice.h,
    scaleFactor,
    iframeContainerRef,
  };
}

function getDefaultInput({
  rootContainer,
  compilationContext,
}: {
  rootContainer: EditorLauncherProps["rootContainer"];
  compilationContext: CompilationContextType;
}): {
  config: ConfigComponent;
  document: DocumentWithResolvedConfigDTO | null;
} {
  const rootContainerDefaultConfig = compilationContext.rootContainers.find(
    (r) => r.id === rootContainer
  )?.defaultConfig;

  if (!rootContainerDefaultConfig) {
    throw new Error(
      `Missing default config for root container "${rootContainer}"`
    );
  }

  if (
    !findComponentDefinitionById(
      rootContainerDefaultConfig._template,
      compilationContext
    )
  ) {
    throw new Error(
      `Missing definition for root container component "${rootContainerDefaultConfig._template}"`
    );
  }

  const defaultConfig = normalize(
    rootContainerDefaultConfig,
    compilationContext
  );

  return {
    config: defaultConfig,
    document: null,
  };
}

async function resolveDocumentId(
  documentId: string,
  project: EditorProps["project"],
  apiClient: IApiClient,
  compilationContext: CompilationContextType
): Promise<{
  config: ConfigComponent;
  document: DocumentWithResolvedConfigDTO | null;
}> {
  if (!project) {
    throw new Error("Project is required to open editor with remote document");
  }

  const remoteDocument = await apiClient.documents.getDocumentById({
    documentId,
    projectId: project.id,
  });

  if (!remoteDocument) {
    throw new Error(
      `Document with given id doesn't exist for project with id: ${project.id}`
    );
  }

  remoteDocument.config.config = adaptRemoteConfig(
    remoteDocument.config.config,
    compilationContext
  );

  return {
    config: remoteDocument.config.config,
    document: remoteDocument,
  };
}

function adaptRemoteConfig(
  config: ConfigComponent,
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

export function findConfigById(
  config: ComponentConfig,
  context: CompilationContextType,
  configId: string
): ComponentConfig | undefined {
  let foundConfig: ComponentConfig | undefined;

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
