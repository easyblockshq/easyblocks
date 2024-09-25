import { useEffect, useRef, useCallback } from "react";
import { NoCodeComponentEntry, Document } from "@easyblocks/core";
import { deepClone, deepCompare } from "@easyblocks/utils";

import { EditorContextType } from "./EditorContext";
import { getConfigSnapshot } from "./utils/config/getConfigSnapshot";
import { addLocalizedFlag } from "./utils/locales/addLocalizedFlag";
import { removeLocalizedFlag } from "./utils/locales/removeLocalizedFlag";

/**
 * useDataSaver works in a realm of SINGLE CONFIG.
 * @param initialDocument
 * Data saver will use this document as a starting point. It can be `null` if there is no document yet.
 * Data saver will perform first save when any local change is detected.
 */
export function useDataSaver(
  initialDocument: Document | null,
  editorContext: EditorContextType
) {
  const remoteDocument = useRef<Document | null>(initialDocument);

  /**
   * This state variable is going to be used ONLY for comparison with local config in case of missing document.
   * It's not going to change at any time during the lifecycle of this hook.
   */
  const initialConfigInCaseOfMissingDocument =
    useRef<NoCodeComponentEntry | null>(null);

  if (initialConfigInCaseOfMissingDocument.current === null) {
    initialConfigInCaseOfMissingDocument.current = deepClone(
      editorContext.form.values
    );
  }

  const editorContextRef = useRef(editorContext);
  editorContextRef.current = editorContext;

  const onTick = useCallback(async () => {
    const { current: editorContext } = editorContextRef;

    // Playground mode is a special case, we don't want to save anything
    if (editorContext.readOnly) {
      return;
    }

    const localConfig = editorContext.form.values;
    const localConfigSnapshot = getConfigSnapshot(localConfig);

    const previousConfig = remoteDocument.current
      ? remoteDocument.current.entry
      : (initialConfigInCaseOfMissingDocument.current as NoCodeComponentEntry);

    const previousConfigSnapshot = getConfigSnapshot(previousConfig);

    const isConfigTheSame = deepCompare(
      localConfigSnapshot,
      previousConfigSnapshot
    );

    const configToSaveWithLocalisedFlag = addLocalizedFlag(
      localConfigSnapshot,
      editorContext
    );

    async function runSaveCallback() {
      if (remoteDocument.current) {
        await editorContext.save(remoteDocument.current);
      }
    }

    // New document
    if (remoteDocument.current === null) {
      console.debug("New document");

      // There must be at least one change in order to create a new document, we're not storing empty temporary documents
      if (isConfigTheSame) {
        console.debug("no change -> bye");
        return;
      }

      console.debug("change detected! -> create");

      const newDocument = await editorContext.backend.documents.create({
        entry: configToSaveWithLocalisedFlag,
      });

      remoteDocument.current = {
        ...newDocument,
      };

      Object.assign(remoteDocument.current, {
        config: {
          config: configToSaveWithLocalisedFlag,
        },
      });

      await runSaveCallback();
    }
    // Document update
    else {
      console.debug("Existing document");

      const latestDocument = await editorContext.backend.documents.get({
        id: remoteDocument.current.id,
      });

      const latestRemoteDocumentVersion = latestDocument.version ?? -1;

      const isNewerDocumentVersionAvailable =
        remoteDocument.current.version < latestRemoteDocumentVersion;

      // Newer version of document is available
      if (isNewerDocumentVersionAvailable) {
        console.debug("new remote version detected, updating");

        const latestConfig = removeLocalizedFlag(
          latestDocument.entry,
          editorContext
        );

        editorContext.actions.runChange(() => {
          editorContext.form.change("", latestConfig);
          return [];
        });

        remoteDocument.current = latestDocument;

        // Notify when local config was modified
        if (!isConfigTheSame) {
          console.debug("there were local changes -> notify");

          editorContext.actions.notify(
            "Remote changes detected, local changes have been overwritten."
          );
        }

        return;
      }
      // No remote change occurred
      else {
        if (isConfigTheSame) {
          console.debug("no local changes -> bye");
          // Let's do nothing, no remote and local change
        } else {
          console.debug("updating the document", remoteDocument.current.id);

          const updatedDocument = await editorContext.backend.documents.update({
            id: remoteDocument.current.id,
            entry: configToSaveWithLocalisedFlag,
            version: remoteDocument.current.version,
          });

          remoteDocument.current.entry = localConfigSnapshot;
          remoteDocument.current.version = updatedDocument.version;

          await runSaveCallback();
        }
      }
    }
  }, []);

  const inProgress = useRef<Promise<void> | null>(null);
  const wasSaveNowCalled = useRef<boolean>(false);

  useEffect(() => {
    const interval = setInterval(() => {
      // We ignore ticks when previous requests are in progress
      if (inProgress.current !== null || wasSaveNowCalled.current) {
        return;
      }

      inProgress.current = onTick().finally(() => {
        inProgress.current = null;
      });
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [onTick]);

  const saveNow = useCallback(async () => {
    wasSaveNowCalled.current = true;

    const { current: promise } = inProgress;

    // Wait until inProgress is resolve
    if (promise) {
      try {
        await promise;
      } catch (err) {
        // noop
      }
    }

    console.debug("Last save!");
    await onTick();
  }, [onTick]);

  return { saveNow };
}
