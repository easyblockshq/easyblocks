import React, { useContext } from "react";
import { NoCodeComponentEntry } from "@easyblocks/core";

export const ConfigAfterAutoContext =
  React.createContext<NoCodeComponentEntry | null>(null);

export function useConfigAfterAuto() {
  const configAfterAutoContext = useContext(ConfigAfterAutoContext);

  if (!configAfterAutoContext) {
    throw new Error("CompiledConfigContext is required for Responsive field");
  }

  return configAfterAutoContext;
}
