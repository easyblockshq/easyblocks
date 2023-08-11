import { useForceRerender } from "@easyblocks/utils";
import { useEffect } from "react";
import { createResourcesStore } from "@easyblocks/core/src/createResourcesStore";

const resourcesStoreInstance = createResourcesStore();

function useResourcesStore() {
  const { forceRerender } = useForceRerender();

  useEffect(() => {
    const unsubscribe = resourcesStoreInstance.subscribe(() => {
      forceRerender();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return resourcesStoreInstance;
}

export { useResourcesStore };
