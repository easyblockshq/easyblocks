export type ActionHandler = (values: object, eventInfo: any) => void;

export type ShopstoryButtonProps = {
  as?: "button" | "a";
  label?: string;
  symbol?: React.ReactElement;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  [key: string]: any;
};

export type ShopstoryButton<T> = React.ComponentType<T & ShopstoryButtonProps>;

export type LinkProviderProps = {
  Component: ShopstoryButton<any>;
  componentProps: {
    as: "a";
    onClick: (event: React.MouseEvent<HTMLElement>) => void;
    [key: string]: any;
  };
  values: { [key: string]: any };
};

export type LinkProvider = React.ComponentType<LinkProviderProps>;

export type ShopstoryLink = LinkProvider;
