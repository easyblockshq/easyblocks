import { useSession } from "@supabase/auth-helpers-react";
import React, { useContext, useMemo } from "react";
import { createApiStorage } from "../../../core/src/infrastructure/api";
import { Storage } from "./Storage";

const StorageContext = React.createContext<Storage>({
  getConfig: async () => Promise.resolve(null),
  getConfigForLocale: async () => Promise.resolve(null),
  saveConfig: async () => Promise.resolve({ id: "" }),
});

function useStorage() {
  return useContext(StorageContext);
}

function StorageProvider({
  children,
  accessToken,
}: {
  children: React.ReactNode;
  accessToken?: string;
}) {
  const session = useSession();

  const storage = useMemo(
    () =>
      createApiStorage({
        accessToken,
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      }),
    [accessToken, session?.access_token]
  );

  return (
    <StorageContext.Provider value={storage}>
      {children}
    </StorageContext.Provider>
  );
}

export { StorageProvider, StorageContext, useStorage };
