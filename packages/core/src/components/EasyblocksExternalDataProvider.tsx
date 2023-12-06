"use client";
import React, { createContext, useContext } from "react";
import { ExternalData } from "../types";

const EasyblocksExternalDataContext = createContext<ExternalData | null>(null);

function useEasyblocksExternalData() {
  const context = useContext(EasyblocksExternalDataContext);

  if (!context) {
    throw new Error(
      "useEasyblocksExternalData must be used within a EasyblocksExternalDataProvider"
    );
  }

  return context;
}

function EasyblocksExternalDataProvider({
  children,
  externalData,
}: {
  children: React.ReactNode;
  externalData: ExternalData;
}) {
  return (
    <EasyblocksExternalDataContext.Provider value={externalData}>
      {children}
    </EasyblocksExternalDataContext.Provider>
  );
}

export { EasyblocksExternalDataProvider, useEasyblocksExternalData };
