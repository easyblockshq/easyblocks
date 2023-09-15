"use client";

import { Metadata } from "@easyblocks/core";
import React, { createContext, ReactNode, useContext } from "react";
import ReactDOM from "react-dom";
import createElement from "./createElement";
import { useEasyblocksProviderContext } from "./EasyblocksProvider";

const EasyblocksMetadataContext = createContext<
  | (Metadata & {
      easyblocksProviderContext: ReturnType<
        typeof useEasyblocksProviderContext
      >;
    })
  | undefined
>(undefined);

export type EasyblocksMetadataProviderProps = {
  children: ReactNode;
  meta: Metadata;
};

const EasyblocksMetadataProvider: React.FC<EasyblocksMetadataProviderProps> = ({
  meta,
  children,
}) => {
  const easyblocksProviderContext = useEasyblocksProviderContext();

  // Let's load required external references
  globalThis.__SHOPSTORY_REACT_SCOPE__ =
    globalThis.__SHOPSTORY_REACT_SCOPE__ ?? {
      React,
      ReactDOM,
      createElement,
    };

  return (
    <EasyblocksMetadataContext.Provider
      value={{
        ...meta,
        vars: meta.vars,
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
