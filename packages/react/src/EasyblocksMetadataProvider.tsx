"use client";

import { CompilationMetadata } from "@easyblocks/core";
import React, { createContext, ReactNode, useContext } from "react";
import { useEasyblocksProviderContext } from "./EasyblocksProvider";

const EasyblocksMetadataContext = createContext<
  | (CompilationMetadata & {
      easyblocksProviderContext: ReturnType<
        typeof useEasyblocksProviderContext
      >;
    })
  | undefined
>(undefined);

export type EasyblocksMetadataProviderProps = {
  children: ReactNode;
  meta: CompilationMetadata;
};

const EasyblocksMetadataProvider: React.FC<EasyblocksMetadataProviderProps> = ({
  meta,
  children,
}) => {
  const easyblocksProviderContext = useEasyblocksProviderContext();

  return (
    <EasyblocksMetadataContext.Provider
      value={{
        ...meta,
        easyblocksProviderContext,
      }}
    >
      {children}
    </EasyblocksMetadataContext.Provider>
  );
};

function useEasyblocksMetadata() {
  const context = useContext(EasyblocksMetadataContext);

  if (!context) {
    throw new Error(
      "useEasyblocksMetadata must be used within a EasyblocksMetadataProvider"
    );
  }

  return context;
}

export { EasyblocksMetadataProvider, useEasyblocksMetadata };
