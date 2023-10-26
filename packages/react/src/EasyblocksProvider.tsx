"use client";
import React, { createContext, ReactNode, useContext } from "react";
import { ImageProps, StandardImage } from "./StandardImage";
import { ActionHandler, LinkProvider, EasyblocksButton } from "./types";
import { easyblocksStitchesInstances } from "./ssr";
import { createStitches } from "@stitches/core";
import { resop } from "./resop";
import { EventSink } from "@easyblocks/core";

type EasyblocksContextState = {
  actions?: { [name: string]: ActionHandler };
  components?: {
    [name: string]:
      | React.ComponentType<any>
      | { client: React.ComponentType<any>; editor?: React.ComponentType<any> };
  };
  buttons?: { [name: string]: EasyblocksButton<any> };
  links?: {
    [name: string]:
      | LinkProvider
      | {
          action?: ActionHandler;
          provider: LinkProvider;
        };
  };
  Image?: React.ComponentType<ImageProps>;
  eventSink?: EventSink;
  stitches?: any;
};

export type EasyblocksProviderContextValue =
  Required<EasyblocksContextState> & {
    resop: typeof resop;
  };
const EasyblocksProviderContext =
  createContext<EasyblocksProviderContextValue | null>(null);

function createEasyblocksProviderContextValue(
  props: EasyblocksContextState = {}
): EasyblocksProviderContextValue {
  // Let's load stitches instance
  if (easyblocksStitchesInstances.length === 0) {
    if (props.stitches) {
      easyblocksStitchesInstances.push(props.stitches);
    } else {
      easyblocksStitchesInstances.push(createStitches({}));
    }
  }

  return {
    components: props.components ?? {},
    buttons: props.buttons ?? {},
    actions: props.actions ?? {},
    links: props.links ?? {},
    Image: props.Image ?? StandardImage,
    eventSink: props.eventSink ?? function () {},
    stitches: easyblocksStitchesInstances[0],
    resop,
  };
}

export type EasyblocksProviderProps = {
  children: ReactNode;
} & EasyblocksContextState;

function EasyblocksProvider(props: EasyblocksProviderProps) {
  return (
    <EasyblocksProviderContext.Provider
      value={createEasyblocksProviderContextValue(props)}
    >
      {props.children}
    </EasyblocksProviderContext.Provider>
  );
}

function useEasyblocksProviderContext() {
  const context = useContext(EasyblocksProviderContext);

  if (context === null) {
    throw new Error(`Missing <${EasyblocksProvider.name} />`);
  }

  return context;
}

export { EasyblocksProvider, useEasyblocksProviderContext };
