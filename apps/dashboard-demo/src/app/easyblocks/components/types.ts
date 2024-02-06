import { NoCodeComponentProps } from "@easyblocks/core";

export type NoCodeActionComponentProps = Record<string, any>;

export type ActionTriggerType<OwnProps> = React.FC<
  {
    href?: string;
    target?: string;
    as?: "div" | "a" | "button";
    onClick?: any;
  } & OwnProps &
    NoCodeComponentProps
>;

export type ActionWrapperType<OwnProps> = React.FC<
  {
    trigger: ReturnType<ActionTriggerType<{}>>;
  } & OwnProps &
    NoCodeComponentProps
>;
