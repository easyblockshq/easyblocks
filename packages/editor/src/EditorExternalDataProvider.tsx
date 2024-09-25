import React, { createContext, ReactNode, useContext, memo } from "react";

import type { ExternalData } from "@easyblocks/core";

const ExternalDataContext = createContext<ExternalData>({});

interface EditorExternalDataProviderProps {
  children: ReactNode;
  externalData: ExternalData;
}

export const EditorExternalDataProvider = memo(
  ({ children, externalData }: EditorExternalDataProviderProps) => {
    return (
      <ExternalDataContext.Provider value={externalData}>
        {children}
      </ExternalDataContext.Provider>
    );
  }
);

export function useEditorExternalData() {
  return useContext(ExternalDataContext);
}
