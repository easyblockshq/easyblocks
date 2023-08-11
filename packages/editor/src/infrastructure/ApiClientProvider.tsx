import React, { createContext, ReactNode, useContext } from "react";
import type { IApiClient } from "@easyblocks/core";

const ApiClientContext = createContext<IApiClient | undefined>(undefined);

function ApiClientProvider(props: {
  apiClient: IApiClient;
  children: ReactNode;
}) {
  return (
    <ApiClientContext.Provider value={props.apiClient}>
      {props.children}
    </ApiClientContext.Provider>
  );
}

function useApiClient() {
  const apiClient = useContext(ApiClientContext);

  if (apiClient === undefined) {
    throw new Error("useApiClient must be used within a ApiClientProvider");
  }

  return apiClient;
}

export { ApiClientProvider, useApiClient };
