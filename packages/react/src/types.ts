import type { ChangedExternalData, ContextParams } from "@easyblocks/core";

export type ActionHandler = (values: object, eventInfo: any) => void;

export type EasyblocksButtonProps = {
  as?: "button" | "a";
  label?: string;
  symbol?: React.ReactElement;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  [key: string]: any;
};

export type EasyblocksButton<T> = React.ComponentType<
  T & EasyblocksButtonProps
>;

export type LinkProviderProps = {
  Component: EasyblocksButton<any>;
  componentProps: {
    as: "a";
    onClick: (event: React.MouseEvent<HTMLElement>) => void;
    [key: string]: any;
  };
  values: { [key: string]: any };
};

export type LinkProvider = React.ComponentType<LinkProviderProps>;

export type ShopstoryLink = LinkProvider;

export type ExternalDataChangeHandler = (
  externalData: ChangedExternalData,
  contextParams: ContextParams
) => void;
