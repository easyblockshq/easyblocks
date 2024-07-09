"use client";

// import { createStitches } from "@stitches/core";
import React, { createContext, ReactNode, useContext } from "react";
// import { easyblocksStitchesInstances } from "../stitches/stitches_runtime";
import { CompilationMetadata } from "../types";
import { buildBoxes, generateClassNames } from "./Box/Box";
import { getStitchesInstance } from "../stitches/stitches_runtime";

const EasyblocksMetadataContext = createContext<
  | (CompilationMetadata & {
      transformProps: any;
      generateClassNames: (input: any, meta: any) => string;
    })
  | undefined
>(undefined);

type EasyblocksMetadataProviderProps = {
  children: ReactNode;
  meta: CompilationMetadata;
  transformProps?: any;
};

function defaultTransformProps(props: any, meta: any) {
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

function defaultGenerateClassName(input: any, meta: any) {
  return generateClassNames(input, meta.vars.devices).join(" ");
}

const EasyblocksMetadataProvider: React.FC<EasyblocksMetadataProviderProps> = ({
  meta,
  children,
  transformProps,
}) => {
  // Let's load stitches instance
  // if (easyblocksStitchesInstances.length === 0) {
  //   easyblocksStitchesInstances.push(createStitches({}));
  // }

  return (
    <EasyblocksMetadataContext.Provider
      value={{
        ...meta,
        transformProps: transformProps ?? defaultTransformProps,
        generateClassNames: defaultGenerateClassName,
        // stitches: getStitchesInstance() // TODO: remove
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
