"use client";

import React, { createContext, ReactNode, useContext } from "react";
import { CompilationMetadata, Renderer } from "../types";
import { stitchesRenderer } from "../stitches/stitches_runtime";

const EasyblocksMetadataContext = createContext<
  | (CompilationMetadata & {
      renderer: Renderer;
    })
  | undefined
>(undefined);

type EasyblocksMetadataProviderProps = {
  children: ReactNode;
  meta: CompilationMetadata;
  renderer?: Renderer;
};

const EasyblocksMetadataProvider: React.FC<EasyblocksMetadataProviderProps> = ({
  meta,
  children,
  renderer,
}) => {
  return (
    <EasyblocksMetadataContext.Provider
      value={{
        ...meta,
        renderer: renderer ?? stitchesRenderer,
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
