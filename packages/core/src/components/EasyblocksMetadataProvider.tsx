"use client";

import React, { createContext, ReactNode, useContext } from "react";
import { CompilationMetadata } from "../types";
import { generateClassNames } from "../stitches/stitches_runtime";
import { stitchesTransformProps } from "../stitches/stitches_runtime";

const EasyblocksMetadataContext = createContext<
  | (CompilationMetadata & {
      transformProps: (
        props: Record<string, any>,
        meta: CompilationMetadata
      ) => Record<string, any>;
      generateClassNames: (input: any, meta: any) => string;
    })
  | undefined
>(undefined);

type EasyblocksMetadataProviderProps = {
  children: ReactNode;
  meta: CompilationMetadata;
  transformProps?: any;
};

function defaultGenerateClassName(input: any, meta: any) {
  return generateClassNames(input, meta.vars.devices).join(" ");
}

const EasyblocksMetadataProvider: React.FC<EasyblocksMetadataProviderProps> = ({
  meta,
  children,
  transformProps,
}) => {
  return (
    <EasyblocksMetadataContext.Provider
      value={{
        ...meta,
        transformProps: transformProps ?? stitchesTransformProps,
        generateClassNames: defaultGenerateClassName,
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
