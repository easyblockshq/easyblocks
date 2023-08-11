"use client";
import { Metadata } from "@easyblocks/core";
import { entries } from "@easyblocks/utils";
import React, {
  ComponentType,
  createContext,
  ReactNode,
  useContext,
} from "react";
import ReactDOM from "react-dom";
import createElement from "./createElement";
import { useShopstoryProviderContext } from "./ShopstoryProvider";

const ShopstoryMetadataContext = createContext<any | undefined>(undefined);

export type ShopstoryMetadataProviderProps = {
  children: ReactNode;
  meta: Metadata;
};

// one instance makes sure that code is evaluated only once per section even if <Shopstory /> is called multiple times
const codeCache = new Map<string, React.ComponentType<any>>();

const ShopstoryMetadataProvider: React.FC<ShopstoryMetadataProviderProps> = ({
  meta,
  children,
}) => {
  const shopstoryProviderContext = useShopstoryProviderContext();

  // Let's load required external references
  globalThis.__SHOPSTORY_REACT_SCOPE__ =
    globalThis.__SHOPSTORY_REACT_SCOPE__ ?? {
      React,
      ReactDOM,
      createElement,
    };

  const evaluatedCode: Record<string, ComponentType> = {};

  // Let's evaluate all the code if necessary
  for (const [componentName, code] of entries(meta.code)) {
    evaluatedCode[componentName] = getEvaluatedComponent(code);
  }

  return (
    <ShopstoryMetadataContext.Provider
      value={{
        ...meta,
        code: evaluatedCode,
        vars: meta.vars,
        shopstoryProviderContext: shopstoryProviderContext,
      }}
    >
      {children}
    </ShopstoryMetadataContext.Provider>
  );
};

function getEvaluatedComponent(code: string) {
  const CachedComponent = codeCache.get(code);

  if (CachedComponent) {
    return CachedComponent;
  } else {
    const Component = eval(code);
    codeCache.set(code, Component);
    return Component;
  }
}

function useShopstoryMetadata() {
  return useContext(ShopstoryMetadataContext);
}

export { ShopstoryMetadataProvider, useShopstoryMetadata };
