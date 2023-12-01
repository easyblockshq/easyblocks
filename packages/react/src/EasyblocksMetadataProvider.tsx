"use client";

import { CompilationMetadata } from "@easyblocks/core";
// @ts-expect-error
import { createStitches } from "@stitches/core";
import React, { createContext, ReactNode, useContext } from "react";
import { easyblocksStitchesInstances } from "./ssr";

const EasyblocksMetadataContext = createContext<
  (CompilationMetadata & { stitches: any }) | undefined
>(undefined);

export type EasyblocksMetadataProviderProps = {
  children: ReactNode;
  meta: CompilationMetadata;
};

const EasyblocksMetadataProvider: React.FC<EasyblocksMetadataProviderProps> = ({
  meta,
  children,
}) => {
  // Let's load stitches instance
  if (easyblocksStitchesInstances.length === 0) {
    easyblocksStitchesInstances.push(createStitches({}));
  }

  return (
    <EasyblocksMetadataContext.Provider
      value={{
        ...meta,
        stitches: easyblocksStitchesInstances[0],
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
