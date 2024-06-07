"use client";

import { createStitches } from "@stitches/core";
import React, { createContext, ReactNode, useContext } from "react";
import { easyblocksStitchesInstances } from "./ssr";
import { CompilationMetadata } from "../types";
import { buildBoxes } from "./Box/Box";

const EasyblocksMetadataContext = createContext<
  (CompilationMetadata & { transformProps: any }) | undefined
>(undefined);

type EasyblocksMetadataProviderProps = {
  children: ReactNode;
  meta: CompilationMetadata;
  transformProps?: any;
};

function defaultTransportProps(props: any, meta: any) {
  const { __styled, ...originalProps } = props;

  const newProps: { [key: string]: any } = buildBoxes(
    props.__styled,
    "",
    {},
    meta
  );

  return {
    ...originalProps,
    ...newProps,
  };
}

const EasyblocksMetadataProvider: React.FC<EasyblocksMetadataProviderProps> = ({
  meta,
  children,
  transformProps,
}) => {
  // Let's load stitches instance
  if (easyblocksStitchesInstances.length === 0) {
    easyblocksStitchesInstances.push(createStitches({}));
  }

  return (
    <EasyblocksMetadataContext.Provider
      value={{
        ...meta,
        transformProps: transformProps ?? defaultTransportProps,
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
