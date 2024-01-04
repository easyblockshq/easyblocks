import React, { useContext } from "react";
import { ComponentConfig } from "@easyblocks/core";

export const ConfigAfterAutoContext =
  React.createContext<ComponentConfig | null>(null);

export function useConfigAfterAuto() {
  const configAfterAutoContext = useContext(ConfigAfterAutoContext);

  if (!configAfterAutoContext) {
    throw new Error("CompiledConfigContext is required for Responsive field");
  }

  return configAfterAutoContext;
}
