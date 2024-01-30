import {
  Root,
  Portal,
  Content,
  Item,
  Trigger,
  Separator,
} from "@radix-ui/react-dropdown-menu";
import React from "react";
import { Colors } from "./colors";

function Menu(props: { children: React.ReactNode }) {
  return <Root>{props.children}</Root>;
}

function MenuTrigger(props: { children: React.ReactNode }) {
  return <Trigger asChild>{props.children}</Trigger>;
}

function MenuContent(props: {
  children: React.ReactNode;
  container?: HTMLElement | null;
}) {
  return (
    <Portal container={props.container}>
      <Content
        side="bottom"
        align="start"
        sideOffset={4}
        css={`
          min-width: 200px;
          padding: 0 4px;
          background-color: ${Colors.black800};
          border-radius: 4px;
        `}
      >
        {props.children}
      </Content>
    </Portal>
  );
}

function MenuItem(props: {
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  isDisabled?: boolean;
}) {
  return (
    <Item
      onClick={props.onClick}
      disabled={props.isDisabled}
      css={`
        padding: 10px 8px;

        &:focus {
          background-color: ${Colors.black700};
        }

        @media (hover: hover) {
          &:hover:not([aria-disabled="true"])]) {
            cursor: pointer;
            background-color: ${Colors.black700};
          }
        }
      `}
    >
      {props.children}
    </Item>
  );
}

function MenuSeparator() {
  return (
    <Separator
      css={`
        height: 1px;
        background-color: ${Colors.black700};
      `}
    />
  );
}

export { Menu, MenuTrigger, MenuContent, MenuItem, MenuSeparator };
