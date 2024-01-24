import { NoCodeComponentEntry, Document } from "@easyblocks/core";
import { deepClone, deepCompare, sleep } from "@easyblocks/utils";
import { useEffect, useRef, useState } from "react";
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
  const [initialConfigInCaseOfMissingDocument] = useState<NoCodeComponentEntry>(
    deepClone(editorContext.form.values)
  );
  const onTickRef = useRef<() => Promise<void>>(() => Promise.resolve());

  const onTick = async () => {
    console.log("---");
    console.log("tick");

    // Playground mode is a special case, we don't want to save anything
    if (editorContext.readOnly) {
      console.log("read only -> bye");
      return;
    }

    const localConfig = editorContext.form.values;
    const localConfigSnapshot = getConfigSnapshot(localConfig);

    const previousConfig = remoteDocument.current
      ? remoteDocument.current.entry
      : initialConfigInCaseOfMissingDocument;
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
      await editorContext.save(remoteDocument.current!);
    }

    // New document
    if (remoteDocument.current === null) {
      console.log("New document");

      // There must be at least one change in order to create a new document, we're not storing empty temporary documents
      if (isConfigTheSame) {
        console.log("no change -> bye");
        return;
      }

      console.log("change detected! -> create");

      const newDocument = await editorContext.backend.documents.create({
        entry: configToSaveWithLocalisedFlag,
      });

      remoteDocument.current = {
        ...newDocument,
        // @ts-ignore
        config: {
          config: configToSaveWithLocalisedFlag,
        },
      };

      await runSaveCallback();
    }
    // Document update
    else {
      console.log("Existing document");

      const latestDocument = await editorContext.backend.documents.get({
        id: remoteDocument.current.id,
      });

      const latestRemoteDocumentVersion = latestDocument.version ?? -1;

      const isNewerDocumentVersionAvailable =
        remoteDocument.current.version < latestRemoteDocumentVersion;

      // Newer version of document is available
      if (isNewerDocumentVersionAvailable) {
        console.log("new remote version detected, updating");

        if (!latestDocument) {
          throw new Error("unexpected error");
        }

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
          console.log("there were local changes -> notify");

          editorContext.actions.notify(
            "Remote changes detected, local changes have been overwritten."
          );
        }

        return;
      }
      // No remote change occurred
      else {
        if (isConfigTheSame) {
          console.log("no local changes -> bye");
          // Let's do nothing, no remote and local change
        } else {
          console.log("updating the document", remoteDocument.current.id);

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
