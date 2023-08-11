import {
  AnyTemplate,
  CompilationContextType,
  componentPickerClosed,
  ComponentPickerOpenedEvent,
  configMap,
  duplicateConfig,
  findComponentDefinitionById,
  ItemInsertedEvent,
  normalizeNonDocumentCmsInput,
  useEditorGlobalKeyboardShortcuts,
} from "@easyblocks/app-utils";
import {
  CompilationCache,
  compileInternal,
  createCompilationContext,
  findResources,
  normalize,
  normalizeInput,
  validate,
} from "@easyblocks/compiler";
import {
  Audience,
  CompilationMetadata,
  ComponentConfig,
  Config,
  ConfigComponent,
  ContextParams,
  DocumentWithResolvedConfigDTO,
  EditorLauncherProps,
  ExternalReference,
  getLauncherPlugin,
  IApiClient,
  isDocument,
  isRawContentRemote,
  Locale,
  LocalisedDocument,
  LocalisedRawContent,
  Metadata,
  NonEmptyRenderableContent,
  RawContent,
  RawContentFull,
  RawContentLocal,
  RenderableContent,
  ShopstoryClient,
} from "@easyblocks/core";
import {
  SSButtonPrimary,
  SSColors,
  SSFonts,
  useToaster,
} from "@easyblocks/design-system";
import { entries, nonNullable, useForceRerender } from "@easyblocks/utils";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
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
import { EditorSidebar } from "./EditorSidebar";
import { EditorTopBar, TOP_BAR_HEIGHT } from "./EditorTopBar";
import { fillGridConfigWithPlaceholders } from "./fillGridConfigWithPlaceholders";
import { StorageProvider } from "./infrastructure/StorageContext";
import { ModalPicker } from "./ModalPicker";
import { destinationResolver } from "./paste/destinationResolver";
import { pasteManager } from "./paste/manager";
import { SelectionFrame } from "./selectionFrame/SelectionFrame";
import { getTemplates } from "./templates/getTemplates";
import { TinaProvider } from "./tinacms";
import { useForm, usePlugin } from "./tinacms/react-core";
import {
  ActionsType,
  CMSInput,
  OpenComponentPickerConfig,
  OpenTemplateModalAction,
  VariantsRepository,
} from "./types";
import { useDataSaver } from "./useDataSaver";
import { useEditorHistory } from "./useEditorHistory";
import { checkLocalesCorrectness } from "./utils/locales/checkLocalesCorrectness";
import { mergeSingleLocaleConfigsIntoConfig } from "./utils/locales/mergeConfigs";
import { removeLocalizedFlag } from "./utils/locales/removeLocalizedFlag";
import {
  addVariant,
  editVariant,
  getAudiencesForVariantsGroup,
  getVariant,
  mapToVariant,
  removeVariant,
  reorderVariant,
  selectVariant,
  storeVariant,
} from "./variants";
import { AudienceModal } from "./variants/AudienceModal";
import { firstMatchingVariantFor } from "./variants/matchers";

import { mergeCompilationMeta } from "@easyblocks/app-utils";
import { useSession } from "@supabase/auth-helpers-react";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { AuthModal } from "./auth/AuthModal";
import { Dashboard } from "./dashboard/Dashboard";
import { EditorIframe } from "./EditorIframe";
import {
  ApiClientProvider,
  useApiClient,
} from "./infrastructure/ApiClientProvider";
import { createApiClient } from "./infrastructure/createApiClient";
import { ProjectsApiService } from "./infrastructure/projectsApiService";
import { supabaseClient } from "./infrastructure/supabaseClient";
import { TemplateModal } from "./TemplateModal";

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
};

function EditorContainer(props: EditorContainerProps) {
  const [enabled, setEnabled] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const navigate = useNavigate();
  const session = useSession();
  const location = useLocation();
  const [project, setProject] = useState<
    EditorContextType["project"] | undefined
  >(undefined);
  const [apiClient] = useState(() => createApiClient(props.config.accessToken));

  const compilationContext = createCompilationContext(
    props.config,
    props.contextParams,
    props.rootContainer
  );

  const launcherPlugin = getLauncherPlugin(props.config);
  const isOpenedInCMS = launcherPlugin?.id !== "nocms";
  const isPlayground = props.mode === "playground";

  useEffect(() => {
    async function handleSignedIn() {
      // When coming from other browser tab, the signed in event occurs again.
      // If the user is already authorized we don't need to do anything.
      if (enabled) {
        return;
      }

      if (!props.config.projectId) {
        setError("Authorization error. Missing project ID.");
        return;
      }

      const projectsApiService = new ProjectsApiService(apiClient);
      const project = await projectsApiService.getProjectById(
        props.config.projectId
      );

      if (project === null) {
        setError("Authorization error. You don't have access to this project.");
        return;
      }

      if (project.tokens.length > 0) {
        setProject({
          ...project,
          token: project.tokens[0],
        });
      }

      setEnabled(true);

      if (location.hash === "#/auth") {
        navigate("/");
      }
    }

    function handleSignedOut() {
      setError(undefined);
      setEnabled(false);
      navigate("/auth", {
        state: {
          view: "sign_in",
        },
      });
    }

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
      navigate("/editor" + location.search);
    }

    if (isPlayground) {
      console.debug(`Opening Shopstory in playground mode.`);
      setEnabled(true);
      navigate("/editor" + location.search);
      return;
    }

    if (props.config.accessToken) {
      console.debug(
        `Opening Shopstory with access token: ${props.config.accessToken}`
      );

      handleAccessTokenAuthorization();
    } else {
      console.debug("Opening Shopstory in user authenticated mode.");

      const {
        data: { subscription },
      } = supabaseClient.auth.onAuthStateChange((event, session) => {
        if (event === "INITIAL_SESSION") {
          if (session) {
            handleSignedIn();
          } else {
            navigate("/auth");
          }
        }

        if (event === "SIGNED_IN") {
          handleSignedIn();
        }

        if (event === "SIGNED_OUT") {
          handleSignedOut();
        }

        if (event === "PASSWORD_RECOVERY") {
          navigate("/auth", { state: { view: "password_update" } });
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [enabled, location.hash, navigate]);

  const isShopstoryAccessTokenAuthenticationMethodUsed =
    !!props.config.accessToken;

  if (isShopstoryAccessTokenAuthenticationMethodUsed && !enabled) {
    return <AuthenticationScreen>Authenticating...</AuthenticationScreen>;
  }

  if (error) {
    return (
      <AuthenticationScreen>
        {error}
        {session !== null && (
          <div>
            <SSButtonPrimary
              onClick={() => {
                supabaseClient.auth.signOut();
              }}
            >
              Sign out
            </SSButtonPrimary>
          </div>
        )}
      </AuthenticationScreen>
    );
  }

  /**
   * StorageProvider is a bit legacy, it works only with anon token.
   * That's why even if users logs in with user token, we pass here anonymous token.
   */
  return (
    <StorageProvider accessToken={project?.token}>
      <ApiClientProvider apiClient={apiClient}>
        <Routes>
          <Route
            path="/auth"
            element={isPlayground ? <Navigate to="/" /> : <AuthModal />}
          />
          <Route
            path="/editor"
            element={
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
            }
          />
          {!isOpenedInCMS && project !== undefined && (
            <Route
              path="/"
              element={
                <Dashboard
                  normalizeConfig={(config) =>
                    normalize(config, compilationContext)
                  }
                  project={project}
                  locales={props.locales}
                  contextParams={props.contextParams}
                />
              }
            />
          )}
        </Routes>
      </ApiClientProvider>
    </StorageProvider>
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
};

const Editor = memo((props: EditorProps) => {
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [resolvedInput, setResolvedInput] = useState<{
    config: ComponentConfig;
    document: DocumentWithResolvedConfigDTO | null;
  } | null>(null);
  const apiClient = useApiClient();
  const [searchParams] = useSearchParams();

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

      const documentId = props.documentId ?? searchParams.get("documentId");

      try {
        const resolvedInput = documentId
          ? await resolveDocumentId(
              documentId,
              props.project,
              apiClient,
              compilationContext
            )
          : await resolveCMSInput({
              cmsInput: props.configs,
              rootContainer: props.rootContainer,
              apiClient,
              compilationContext,
            });

        if (props.rootContainer === "grid") {
          fillGridConfigWithPlaceholders(resolvedInput.config);
        }

        setResolvedInput(resolvedInput);
      } catch (error) {
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

function useBuiltContent(
  editorContext: EditorContextType,
  config: Config,
  contextParams: ContextParams,
  rawContent: ConfigComponent,
  rootContainer: EditorLauncherProps["rootContainer"]
): { meta: Metadata; renderableContent: NonEmptyRenderableContent } {
  const shopstoryClient = useRef<ShopstoryClient>(
    new ShopstoryClient(
      {
        ...config,
        projectId: editorContext.project?.id,
        accessToken: config.accessToken ?? editorContext.project?.token,
      },
      contextParams
    )
  ).current;
  const { forceRerender } = useForceRerender();

  shopstoryClient.__applyConfigTransform = false;

  shopstoryClient.injectDependencies({
    findResources,
    validate,
    compile: (items) => {
      let resultMeta: CompilationMetadata = {
        code: {},
        vars: {},
      };

      return {
        items: items.map(({ content, options }) => {
          const normalizedContent = normalizeInput(content, options.mode);

          const { meta, ...rest } = options.nested
            ? compileInternal(normalizedContent, {
                ...editorContext,
                isEditing: false,
              })
            : compileInternal(
                normalizedContent,
                editorContext,
                editorContext.compilationCache
              );

          resultMeta = mergeCompilationMeta(resultMeta, meta);
          return rest;
        }),
        meta: resultMeta,
      };
    },
  });

  // cached inputs (needed to calculated "inputChanged")
  const inputRawContent = useRef<ConfigComponent>();
  const inputIsEditing = useRef<boolean>();
  const inputBreakpointIndex = useRef<string>();

  const inputChanged =
    inputRawContent.current !== rawContent ||
    inputIsEditing.current !== editorContext.isEditing ||
    inputBreakpointIndex.current !== editorContext.breakpointIndex;

  inputRawContent.current = rawContent;
  inputIsEditing.current = editorContext.isEditing;
  inputBreakpointIndex.current = editorContext.breakpointIndex;

  const renderableContent = useRef<RenderableContent>();
  const meta = useRef<Metadata>({
    code: {},
    resources: [],
    vars: {},
  });

  if (inputChanged) {
    /**
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

    const newRenderableContent = shopstoryClient.add(rawContent, {
      rootContainer,
    });
    const newMeta = shopstoryClient.buildSync((newMeta) => {
      meta.current = {
        ...mergeCompilationMeta(meta.current, newMeta),
        resources: newMeta.resources,
      };
      forceRerender();
    });

    renderableContent.current = newRenderableContent;
    meta.current = {
      ...mergeCompilationMeta(meta.current, newMeta),
      resources: newMeta.resources,
    };
  }

  return {
    renderableContent: renderableContent.current as NonEmptyRenderableContent,
    meta: meta.current!,
  };
}

const EditorContent = ({
  compilationContext,
  heightMode = "viewport",
  initialDocument,
  initialConfig,
  uniqueSourceIdentifier,
  isPlayground,
  ...props
}: EditorContentProps) => {
  const apiClient = useApiClient();
  const navigate = useNavigate();

  const [breakpointIndex, setBreakpointIndex] = useState(
    compilationContext.mainBreakpointIndex
  );

  const [editVariantRequest, setEditVariantRequest] = useState<
    { id: string; groupId: string; path: string } | undefined
  >();

  const [addVariantRequest, setAddVariantRequest] = useState<
    { config: ComponentConfig; path: string } | undefined
  >();

  const [allAudiences, setAllAudiences] = useState<Audience[]>([]);
  const [audiences, setAudiences] = useState<string[]>(
    compilationContext.contextParams.audiences ?? []
  );

  const compilationCache = useRef(new CompilationCache());

  const handleAudienceChange = (audienceId: string) => {
    const set = new Set(audiences);
    if (set.has(audienceId)) {
      set.delete(audienceId);
    } else {
      set.add(audienceId);
    }
    setAudiences(Array.from(set));
  };

  useEffect(() => {
    actions.runChange(() => {
      let variantsRepositorySnapshot = form.values._variants ?? {};

      const configMapper = mapToVariant((configComponent) => {
        variantsRepositorySnapshot = storeVariant(
          variantsRepositorySnapshot,
          configComponent
        );
        return getVariant(
          form.values._variants as VariantsRepository,
          firstMatchingVariantFor(audiences),
          configComponent
        );
      });

      const configWithVariantsResolved = configMap(
        form.values,
        editorContext,
        configMapper
      );

      form.finalForm.batch(() => {
        form.change("", configWithVariantsResolved);
        form.change("_variants", variantsRepositorySnapshot);
      });
    });
  }, [audiences]);

  useEffect(() => {
    (async () => {
      try {
        const fetchedAudiences = await props.config.audiences?.();
        setAllAudiences(fetchedAudiences ?? []);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const [isEditing, setEditing] = useState(true);

  const [componentPickerData, setComponentPickerData] = useState<
    | {
        promiseResolve: (config: ComponentConfig | undefined) => void;
        config: OpenComponentPickerConfig;
      }
    | undefined
  >(undefined);
  const [focussedField, setFocussedField] = useState<Array<string>>([]);
  const focusedFieldRef = useRef(focussedField);

  const handleSetFocussedField = React.useRef(
    (field: Array<string> | string) => {
      const nextFocusedField = Array.isArray(field) ? field : [field];
      focusedFieldRef.current = nextFocusedField;
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
    id: "tina-shopstory",
    label: "Edit Page",
    fields: [],
    initialValues: initialConfig,
    onSubmit: async () => {},
  });

  const { undo, redo, push } = useEditorHistory({
    onChange: ({ config, focusedField, audiences }) => {
      setFocussedField(focusedField);
      form.finalForm.change("", config);
      setAudiences(audiences);
    },
  });

  const isMaster = !!props.config.__masterEnvironment;

  const [templates, setTemplates] = useState<
    Record<string, AnyTemplate[]> | undefined
  >(undefined);

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
          audiences,
        });

        setFocussedField(fieldsToFocus);
      });
    },
    logSelectedItems: () => {
      logItems(editorContext.form, focussedField);
    },
    getTemplates(componentTypes) {
      if (!templates) {
        return [];
      }

      return templates[componentTypes[0]] ?? [];
    },
  };

  const [isAdminMode, setAdminMode] = useState(false);

  const syncTemplates = () => {
    getTemplates(
      editorContext,
      apiClient,
      props.config.unstable_templates ?? []
    ).then((newTemplates) => {
      setTemplates(newTemplates);
    });
  };

  useEffect(() => {
    syncTemplates();
  }, []);

  const launcherPlugin = getLauncherPlugin(props.config);

  const editorContext: EditorContextType = {
    ...compilationContext,
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
      handleSetBreakpoint(newBreakpointIndex);
    },
    actions,
    save: async (localisedDocument, externals) => {
      if (props.save) {
        await props.save(localisedDocument, externals);
      } else {
        window.postMessage({
          type: "@shopstory-editor/content-saved",
          payload: {
            localisedDocument,
            references: externals,
          },
        });
      }
    },
    text: undefined,
    locales: props.locales,
    variantsManager: {
      removeVariant: (id, groupId, path) => {
        actions.runChange(() => {
          removeVariant({ form, id, groupId, path });
        });
      },
      selectVariant: (id, path) => {
        actions.runChange(() => {
          selectVariant({ form, id, path });
        });
      },
      reorderVariant: (groupId, sourceIndex, destinationIndex) => {
        actions.runChange(() => {
          reorderVariant(form, groupId, sourceIndex, destinationIndex);
        });
      },
      getVariantsGroup: (groupId) => {
        return getAudiencesForVariantsGroup(
          form.values._variants ?? {},
          allAudiences ?? [],
          groupId
        );
      },
      openAddVariantModal: (config, path) => {
        setAddVariantRequest({ config, path });
      },
      openEditVariantModal: (id, groupId, path) => {
        setEditVariantRequest({ id, groupId, path });
      },
    },
    resources: [],
    compilationCache: compilationCache.current,
    launcher: launcherPlugin
      ? {
          id: launcherPlugin.id,
          icon: launcherPlugin.icon,
        }
      : undefined,
    project: props.project,
    imageVariantsDisplay:
      props.config.imageVariantsDisplay ??
      [
        launcherPlugin && `${launcherPlugin.id}.default`,
        ...(props.config.imageVariants?.map((v) => v.id) ?? []),
      ].filter(nonNullable()),
    videoVariantsDisplay:
      props.config.videoVariantsDisplay ??
      [
        launcherPlugin && `${launcherPlugin.id}.default`,
        ...(props.config.videoVariants?.map((v) => v.id) ?? []),
      ].filter(nonNullable()),
    isPlayground,
  };

  const {
    meta,
    renderableContent: { configAfterAuto, renderableContent },
  } = useBuiltContent(
    editorContext,
    props.config,
    {
      ...props.contextParams,
      isEditing,
    },
    editableData,
    props.rootContainer
  );

  editorContext.resources = meta.resources;
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

  usePlugin(form);

  useEffect(() => {
    push({
      config: initialConfig,
      focussedField: [],
      audiences: compilationContext.contextParams.audiences ?? [],
    });
  }, []);

  useEffect(() => {
    if (window.editorWindowAPI.onUpdate) {
      window.editorWindowAPI.onUpdate();
    }
  }, [renderableContent, meta, focussedField, isEditing, breakpointIndex]);

  useEffect(() => {
    window.addEventListener(
      "message",
      (event: ComponentPickerOpenedEvent | ItemInsertedEvent) => {
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
      }
    );
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

  const [isFullScreen, setFullScreen] = useState(false);

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
  const isDemoProject = props.config.projectId === "demo";

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
          <div id="rootContainer" />
          <EditorTopBar
            onUndo={undo}
            onRedo={redo}
            title={"Shopstory"}
            onClose={() => {
              setDataSaverOverlayOpen(true);
              saveNow().finally(() => {
                setDataSaverOverlayOpen(false);

                if (props.onClose) {
                  props.onClose();
                } else {
                  window.postMessage({
                    type: "@shopstory-editor/closed",
                  });
                }

                if (isDemoProject) {
                  navigate("/");
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
            allAudiences={allAudiences}
            audiences={audiences}
            onAudienceChange={handleAudienceChange}
            isFullScreen={isFullScreen}
            setFullScreen={setFullScreen}
            onAdminModeChange={(val) => {
              setAdminMode(val);
            }}
            isPlayground={editorContext.isPlayground}
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
            {addVariantRequest && (
              <AudienceModal
                onClose={() => {
                  setAddVariantRequest(undefined);
                }}
                onAudienceChange={(audienceId) => {
                  actions.runChange(() => {
                    const { config, path } = addVariantRequest;
                    addVariant({
                      form,
                      context: editorContext,
                      audience: audienceId,
                      variant: config,
                      path,
                    });
                    setAddVariantRequest(undefined);
                  });
                }}
                allAudiences={allAudiences ?? []}
              />
            )}
            {editVariantRequest && (
              <AudienceModal
                onClose={() => {
                  setEditVariantRequest(undefined);
                }}
                onAudienceChange={(newAudience) => {
                  actions.runChange(() => {
                    const { id, groupId, path } = editVariantRequest;
                    editVariant({
                      form,
                      groupId,
                      id,
                      newAudience,
                      path,
                    });
                    setEditVariantRequest(undefined);
                  });
                }}
                allAudiences={allAudiences ?? []}
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
        </ConfigAfterAutoContext.Provider>
      </EditorContext.Provider>
    </div>
  );
};

export type { EditorContentProps };
export { EditorContent, EditorContainer as Editor };

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
  }, [currentDevice.w]);

  return {
    width: displayedWidth,
    height: currentDevice.h,
    scaleFactor,
    iframeContainerRef,
  };
}

async function resolveCMSInput({
  cmsInput,
  rootContainer,
  apiClient,
  compilationContext,
}: {
  cmsInput: CMSInput | undefined;
  rootContainer: EditorLauncherProps["rootContainer"];
  apiClient: IApiClient;
  compilationContext: CompilationContextType;
}): Promise<{
  config: ConfigComponent;
  document: DocumentWithResolvedConfigDTO | null;
}> {
  if (!cmsInput) {
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

  const cmsInputValue = Object.values(cmsInput)[0] as CMSInput[keyof CMSInput];

  if (!isDocument(cmsInputValue)) {
    const localizedRawContent = normalizeNonDocumentCmsInput(
      cmsInput as Exclude<CMSInput, LocalisedDocument>
    );
    const rawContent = Object.values(localizedRawContent)[0] as RawContent;

    if (isRawContentRemote(rawContent)) {
      const remoteConfig = await apiClient.configs.getConfigById({
        configId: rawContent.id,
        projectId: rawContent.projectId,
      });

      if (!remoteConfig) {
        throw new Error(`Config with id ${rawContent.id} doesn't exist`);
      }

      const adaptedConfig = adaptRemoteConfig(
        remoteConfig.config,
        compilationContext
      );

      return {
        config: adaptedConfig,
        document: null,
      };
    }

    const config = mergeSingleLocaleConfigsIntoConfig(
      mapValues(
        localizedRawContent as LocalisedRawContent<
          RawContentFull | RawContentLocal
        >,
        (content) => content.content
      ),
      compilationContext
    );

    if (!config) {
      throw new Error(
        "Got empty config from non empty CMS input. This is unexpected error."
      );
    }

    const normalizedConfig = normalize(config, compilationContext);
    return { config: normalizedConfig, document: null };
  }

  const remoteDocument = await apiClient.documents.getDocumentById({
    documentId: cmsInputValue.documentId,
    projectId: cmsInputValue.projectId,
  });

  if (!remoteDocument) {
    throw new Error(
      `Document with id ${cmsInputValue.documentId} doesn't exist for project with id: ${cmsInputValue.projectId}`
    );
  }

  remoteDocument.config.config = adaptRemoteConfig(
    remoteDocument.config.config,
    compilationContext
  );

  return { config: remoteDocument.config.config, document: remoteDocument };
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

function mapValues<T extends Record<string, unknown>, R>(
  obj: T,
  fn: (value: T[keyof T]) => R
): Record<keyof T, R> {
  return Object.fromEntries(
    entries(obj).map(([key, value]) => [key, fn(value)])
  ) as Record<keyof T, R>;
}
