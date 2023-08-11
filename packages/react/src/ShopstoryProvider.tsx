"use client";
import React, { createContext, ReactNode, useContext } from "react";
import { ImageProps, StandardImage } from "./StandardImage";
import { StandardLinkProvider } from "./StandardLink";
import { ActionHandler, LinkProvider, ShopstoryButton } from "./types";
import { shopstoryStitchesInstances } from "./ssr";
import { createStitches } from "@stitches/core";
import { resop } from "./resop";
import { EventSink } from "@easyblocks/core";

type ShopstoryContextState = {
  actions?: { [name: string]: ActionHandler };
  components?: {
    [name: string]:
      | React.ComponentType<any>
      | { client: React.ComponentType<any>; editor?: React.ComponentType<any> };
  };
  buttons?: { [name: string]: ShopstoryButton<any> };
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

export type ShopstoryProviderContextValue = Required<ShopstoryContextState> & {
  resop: typeof resop;
};
const ShopstoryProviderContext =
  createContext<ShopstoryProviderContextValue | null>(null);
ShopstoryProviderContext.displayName = "Shopstory";

function createShopstoryProviderContextValue(
  props: ShopstoryContextState = {}
): ShopstoryProviderContextValue {
  // Let's load stitches instance
  if (shopstoryStitchesInstances.length === 0) {
    if (props.stitches) {
      shopstoryStitchesInstances.push(props.stitches);
    } else {
      shopstoryStitchesInstances.push(createStitches({}));
    }
  }

  return {
    components: props.components ?? {},
    buttons: props.buttons ?? {},
    actions: props.actions ?? {},
    links: {
      ...props.links,
      $StandardLink: StandardLinkProvider,
    },
    Image: props.Image ?? StandardImage,
    eventSink: props.eventSink ?? function () {},
    stitches: shopstoryStitchesInstances[0],
    resop,
  };
}

export type ShopstoryProviderProps = {
  children: ReactNode;
} & ShopstoryContextState;

const ShopstoryProvider: React.FC<ShopstoryProviderProps> = (props) => {
  return (
    <ShopstoryProviderContext.Provider
      value={createShopstoryProviderContextValue(props)}
    >
      {props.children}
    </ShopstoryProviderContext.Provider>
  );
};

function useShopstoryProviderContext() {
  const context = useContext(ShopstoryProviderContext);

  if (context === null) {
    throw new Error("Missing <ShopstoryProvider />");
  }

  return context;
}

export { ShopstoryProvider, useShopstoryProviderContext };
