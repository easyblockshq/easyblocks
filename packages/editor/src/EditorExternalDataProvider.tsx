import { ExternalData } from "@easyblocks/core";
import React, { createContext, ReactNode, useContext } from "react";

const ExternalDataContext = createContext<ExternalData>({});

function EditorExternalDataProvider({
  children,
  externalData,
}: {
  children: ReactNode;
  externalData: ExternalData;
}) {
  return (
    <ExternalDataContext.Provider value={externalData}>
      {children}
    </ExternalDataContext.Provider>
  );
}

function useEditorExternalData() {
  return useContext(ExternalDataContext);
}

export { EditorExternalDataProvider, useEditorExternalData };
