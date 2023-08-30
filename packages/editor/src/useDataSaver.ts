import {
  configMap,
  splitConfigIntoSingleLocaleConfigs,
} from "@easyblocks/app-utils";
import {
  ComponentConfig,
  DocumentWithResolvedConfigDTO,
  EditorLauncherProps,
  LocalisedDocument,
  PreviewMetadata,
  UnresolvedResourceNonEmpty,
} from "@easyblocks/core";
import { deepClone, deepCompare, sleep } from "@easyblocks/utils";
import { useEffect, useRef, useState } from "react";
import { EditorContextType } from "./EditorContext";
import { getAllExternals } from "./getAllExternals";
import { getExternalsForSave } from "./getExternalsForSave";
import { useApiClient } from "./infrastructure/ApiClientProvider";
import { TextExternal, TextExternalMap } from "./types";
import { getConfigSnapshot } from "./utils/config/getConfigSnapshot";
import { addLocalizedFlag } from "./utils/locales/addLocalizedFlag";
import { removeLocalizedFlag } from "./utils/locales/removeLocalizedFlag";

/*
 * RULES OF DATA SAVER
 * --
 * 1. Newly added items (not yet saved) must have ids starting with "local."
 * 2. The order of save operation is always "create/update texts", "save config", "remove unnecessary items"
 * 3. If there's ANYTHING wrong with create/update texts, config is not saved and the save/update operations are ignored.
 * 4. If there's ANYTHING wrong with remove, we ignore it.
 *
 */

async function syncAddedAndModified(
  previousConfig: ComponentConfig,
  newConfig: ComponentConfig,
  editorContext: EditorContextType
): Promise<{ [id: string]: TextExternal }> {
  // If text CRUD not there then this function does nothing.
  const { create, update } = editorContext?.text ?? {};

  if (!create || !update) {
    return {};
  }

  const previousTextExternals = getAllExternals(
    previousConfig,
    editorContext
  ).filter((x) => x.type === "text");

  const currentTextExternals = getAllExternals(newConfig, editorContext).filter(
    (x) => x.type === "text"
  );

  const stagedForAdd: TextExternal[] = [];
  const stagedForUpdate: TextExternal[] = [];

  currentTextExternals.forEach((currentTextExternal) => {
    const currentExternal =
      currentTextExternal.value as UnresolvedResourceNonEmpty; // value is always non-empty for a string

    // If newly added
    if (currentExternal.id.startsWith("local.")) {
      stagedForAdd.push({
        id: currentTextExternal.value.id!,
        value: currentExternal.value!, // never undefined
      });
    } else {
      const previousTextExternal = previousTextExternals.find(
        (x) => x.value.id === currentTextExternal.value.id
      );

      if (!previousTextExternal) {
        throw new Error("unreachable");
      }

      const previousExternal =
        previousTextExternal.value as UnresolvedResourceNonEmpty;

      // was changed!
      if (currentExternal.value !== previousExternal.value) {
        stagedForUpdate.push({
          id: currentExternal.id,
          value: currentExternal.value!, // never undefined
        });
      }
    }
  });

  if (stagedForAdd.length === 0 && stagedForUpdate.length === 0) {
    return {};
  }

  const addResults =
    stagedForAdd.length === 0
      ? {}
      : await create(stagedForAdd, editorContext.contextParams);

  const updateResults =
    stagedForUpdate.length === 0
      ? {}
      : await update(stagedForUpdate, editorContext.contextParams);

  /**
   * VALIDATION!!! All the ids that were requested must be in the response
   */

  let isValid = true;
  stagedForAdd.forEach((entry) => {
    const result = addResults[entry.id];

    // Requested ID must be in the response object
    if (!result) {
      isValid = false;
    }
    // Response ID must be string and can't start with "local."
    else if (typeof result.id !== "string" || result.id.startsWith("local.")) {
      isValid = false;
    }

    // result.value = result.value?.toString() || null; // force string for value if defined
  });

  stagedForUpdate.forEach((entry) => {
    const result = updateResults[entry.id];
    if (!result) {
      isValid = false;
    } else if (
      typeof result.id !== "string" ||
      result.id.startsWith("local.")
    ) {
      isValid = false;
    }

    // result.value = result.value?.toString() || null; // force string for value if defined
  });

  if (!isValid) {
    throw new Error("incorrect data from update / create operations");
  }

  const results = {
    ...addResults,
    ...updateResults,
  };

  return results;
}

async function syncRemove(
  previousConfig: ComponentConfig,
  newConfig: ComponentConfig,
  editorContext: EditorContextType
): Promise<void> {
  const { remove } = editorContext?.text ?? {};
  // If text CRUD not there then this function does nothing.
  if (!remove) {
    return Promise.resolve();
  }

  const previousTextExternals = getAllExternals(
    previousConfig,
    editorContext
  ).filter((x) => x.type === "text");
  const currentTextExternals = getAllExternals(newConfig, editorContext).filter(
    (x) => x.type === "text"
  );

  const stagedForRemove: string[] = [];

  previousTextExternals.forEach((previousTextExternal) => {
    // If can't find previous in new, it means it's removed;
    if (
      !currentTextExternals.find(
        (x) => x.value.id === previousTextExternal.value.id
      )
    ) {
      stagedForRemove.push(previousTextExternal.value.id!);
    }
  });

  if (stagedForRemove.length === 0) {
    return;
  }

  await remove(stagedForRemove);
}

function updateConfigExternals(
  config: ComponentConfig,
  textExternalMap: TextExternalMap,
  editorContext: EditorContextType
): ComponentConfig {
  return configMap(config, editorContext, ({ value, schemaProp }) => {
    if (schemaProp.type !== "text") {
      return value;
    }

    const mapEntry = textExternalMap[value.id];

    if (!mapEntry) {
      return value;
    }

    return {
      id: mapEntry.id, // we take new id (potentially was changed from temporary to real)
    };
  });
}

/**
 * useDataSaver works in a realm of SINGLE CONFIG.
 * @param initialDocument
 * Data saver will use this document as a starting point. It can be `null` if there is no document yet.
 * Data saver will perform first save when any local change is detected.
 * @param uniqueSourceIdentifier
 * Unique identifier of the source of the document. In most cases it's going to be a combination of
 * values that uniquely identify entry in the CMS. It can be `undefined` if we're running in non-CMS environment.
 */
export function useDataSaver(
  initialDocument: DocumentWithResolvedConfigDTO | null,
  uniqueSourceIdentifier: string | undefined,
  editorContext: EditorContextType
) {
  const remoteDocument = useRef<DocumentWithResolvedConfigDTO | null>(
    getInitialDocument(initialDocument, uniqueSourceIdentifier)
  );
  /**
   * This state variable is going to be used ONLY for comparison with local config in case of missing document.
   * It's not going to change at any time during the lifecycle of this hook.
   */
  const [initialConfigInCaseOfMissingDocument] = useState<ComponentConfig>(
    deepClone(editorContext.form.values)
  );
  const onTickRef = useRef<() => Promise<void>>(() => Promise.resolve());
  const isSavedCalledAtLeastOnce = useRef<boolean>(false);
  const apiClient = useApiClient();

  const onTick = async () => {
    const localConfig = editorContext.form.values;
    const localConfigSnapshot = getConfigSnapshot(localConfig);
    const previousConfig = remoteDocument.current
      ? remoteDocument.current.config.config
      : initialConfigInCaseOfMissingDocument;
    const previousConfigSnapshot = getConfigSnapshot(previousConfig);

    const isConfigTheSame = deepCompare(
      localConfigSnapshot,
      previousConfigSnapshot
    );

    if (!editorContext.isPlayground && remoteDocument.current !== null) {
      if (!editorContext.project) {
        throw new Error(
          "Trying to fetch document without project. This is an unexpected error."
        );
      }

      const latestRemoteDocumentVersion =
        (
          await apiClient.documents.getDocumentById({
            documentId: remoteDocument.current.id,
            projectId: editorContext.project.id,
            format: "versionOnly",
          })
        )?.version ?? -1;

      const isNewerDocumentVersionAvailable =
        remoteDocument.current.version < latestRemoteDocumentVersion;

      if (isConfigTheSame && isNewerDocumentVersionAvailable) {
        const latestDocument = await apiClient.documents.getDocumentById({
          documentId: remoteDocument.current.id,
          projectId: editorContext.project!.id,
        });

        if (latestDocument) {
          const latestConfig = removeLocalizedFlag(
            latestDocument.config.config,
            editorContext
          );

          editorContext.actions.runChange(() => {
            editorContext.form.change("", latestConfig);
            return [];
          });

          remoteDocument.current = latestDocument;
          return;
        }
      }
    }

    //If config didn't change, let's ignore auto-save!
    if (isConfigTheSame && isSavedCalledAtLeastOnce.current) {
      return;
    }

    isSavedCalledAtLeastOnce.current = true;

    let externalsMap: { [id: string]: TextExternal };

    try {
      externalsMap = await syncAddedAndModified(
        previousConfig,
        localConfig,
        editorContext
      );
    } catch (error) {
      console.warn("Unsuccessful add / update operations, error below");
      console.warn(error);
      // if sync unsuccessful, we do nothing.
      return;
    }

    // Edge case. If this is first save, configs are the same (init config and first-save config) AND there are no tmp ids inside, let's ignore saving.
    if (Object.keys(externalsMap).length === 0 && isConfigTheSame) {
      return;
    }

    const configToSave = updateConfigExternals(
      localConfigSnapshot,
      externalsMap,
      editorContext
    );

    try {
      const externalReferences = getExternalsForSave(
        configToSave,
        editorContext
      );

      // Adding __localized flag here but eventually we want to send compialtionContext to the
      // API and all the work related with localized text will be handled on the server
      const configToSaveWithLocalisedFlag = addLocalizedFlag(
        configToSave,
        editorContext
      );

      // When running in playground mode, don't save the config to our backend
      if (!editorContext.isPlayground) {
        const project = editorContext.project;

        if (!project) {
          throw new Error(
            "Trying to save data to backend without project. This is an unexpected error."
          );
        }

        if (remoteDocument.current) {
          const updatedDocument = await apiClient.documents.updateDocument({
            documentId: remoteDocument.current.id,
            projectId: project.id,
            config: configToSaveWithLocalisedFlag,
            version: remoteDocument.current.version,
            uniqueSourceIdentifier,
          });

          remoteDocument.current.config.config = configToSave;
          remoteDocument.current.version = updatedDocument.version;
        } else {
          const source =
            editorContext.launcher?.id ??
            new URLSearchParams(window.location.search).get("source");

          if (!source) {
            throw new Error(
              "Trying to save data to backend without source. This is an unexpected error."
            );
          }

          const newDocument = await apiClient.documents.createDocument({
            title: "Untitled",
            config: configToSaveWithLocalisedFlag,
            source,
            uniqueSourceIdentifier,
            projectId: project.id,
            rootContainer: editorContext.rootContainer,
          });

          remoteDocument.current = {
            ...newDocument,
            // @ts-ignore
            config: {
              config: configToSave,
            },
          };
        }
      }

      const documentData = {
        id: editorContext.isPlayground
          ? "playground-document"
          : remoteDocument.current!.id,
        version: editorContext.isPlayground
          ? 0
          : remoteDocument.current!.version,
        updatedAt: new Date().getTime(),
        projectId: editorContext.project
          ? editorContext.project.id
          : "playground",
      };

      // const configAfterSplit = splitConfigIntoSingleLocaleConfigs(
      //   configToSaveWithLocalisedFlag,
      //   editorContext.locales
      // );
      //
      // const localisedDocument: LocalisedDocument = {};
      // const previewData = getPreviewData(
      //   configToSaveWithLocalisedFlag,
      //   editorContext.rootContainer
      // );
      //
      // editorContext.locales.forEach((locale) => {
      //   localisedDocument[locale.code] = {
      //     documentId: editorContext.isPlayground
      //       ? "playground-document"
      //       : remoteDocument.current!.id,
      //     config: configAfterSplit[locale.code],
      //     preview: previewData,
      //     projectId: editorContext.project
      //       ? editorContext.project.id
      //       : "playground",
      //     rootContainer: editorContext.rootContainer,
      //   };
      // });

      await editorContext.save(documentData);

      if (Object.keys(externalsMap).length > 0) {
        const newFormValues = updateConfigExternals(
          editorContext.form.values,
          externalsMap,
          editorContext
        );
        editorContext.form.change("", newFormValues);
      }

      await syncRemove(
        previousConfigSnapshot,
        localConfigSnapshot,
        editorContext
      );
    } catch (error) {
      if (error instanceof Error) {
        const isNewerDocumentVersionAvailable =
          error.message === "Document version mismatch";

        const isDocumentForGivenUniqueSourceIdentifierAlreadyPresent =
          error.message.startsWith("Document with unique_source_identifier");

        if (
          isNewerDocumentVersionAvailable ||
          isDocumentForGivenUniqueSourceIdentifierAlreadyPresent
        ) {
          if (!remoteDocument.current && !uniqueSourceIdentifier) {
            throw new Error(
              "Unique source identifier can't be undefined if document is not present"
            );
          }

          const getLatestDocument = remoteDocument.current
            ? apiClient.documents.getDocumentById({
                documentId: remoteDocument.current.id,
                projectId: editorContext.project!.id,
              })
            : apiClient.documents.getDocumentByUniqueSourceIdentifier({
                uniqueSourceIdentifier: uniqueSourceIdentifier!,
                projectId: editorContext.project!.id,
              });

          const latestDocument = await getLatestDocument;

          if (!latestDocument) {
            throw new Error("Document not found");
          }

          remoteDocument.current = latestDocument;

          const latestConfig = removeLocalizedFlag(
            latestDocument.config.config,
            editorContext
          );

          editorContext.actions.runChange(() => {
            editorContext.form.change("", latestConfig);

            return [];
          });

          editorContext.actions.notify(
            "Remote changes detected, local changes have been overwritten."
          );

          return;
        }
      }

      console.log(error);
      // We can safely ignore this. The worst case scenario is that there will be "zombie text nodes" in Contentful
      console.warn("Error while saving config or removing items");
    }
  };

  // We're keeping this in ref, because of setInterval keeping initial closure
  onTickRef.current = onTick;

  const inProgress = useRef<boolean>(false);
  const wasSaveNowCalled = useRef<boolean>(false);

  useEffect(() => {
    const interval = setInterval(() => {
      // We ignore ticks when previous requests are in progress
      if (inProgress.current || wasSaveNowCalled.current) {
        return;
      }

      inProgress.current = true;
      onTickRef.current().finally(() => {
        inProgress.current = false;
      });
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return {
    saveNow: async () => {
      wasSaveNowCalled.current = true;

      // Wait until inProgress is false
      while (true) {
        if (inProgress.current) {
          console.debug("waiting...");
          await sleep(500);
        } else {
          break;
        }
      }

      console.debug("Last save!");
      await onTick();
    },
  };
}

function getPreviewData(
  config: ComponentConfig,
  rootContainer: Exclude<EditorLauncherProps["rootContainer"], undefined>
): PreviewMetadata {
  if (rootContainer === "grid") {
    const extraCardsCount = config.data[0].Component[0].Cards.filter(
      (x: ComponentConfig) => x._template !== "$Placeholder"
    ).length;

    return {
      mode: "grid",
      extraCardsCount,
    };
  }

  return {
    mode: rootContainer,
    sectionsCount: config.data.length,
  };
}

function getInitialDocument(
  document: DocumentWithResolvedConfigDTO | null,
  uniqueSourceIdentifier?: string
) {
  if (!document) {
    return null;
  }

  // If unique source identifier of initial document for which we've opened the editor is different than the one
  // given by launcher plugin it probably means that this document is the result of duplicating entry in CMS.
  // In this case we treat it like there is no initial document and save new document after first change.
  if (
    uniqueSourceIdentifier &&
    document.unique_source_identifier !== uniqueSourceIdentifier
  ) {
    return null;
  }

  return document;
}
