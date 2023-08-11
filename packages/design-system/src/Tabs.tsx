import { Root, List, Trigger, TabsContent } from "@radix-ui/react-tabs";
import React from "react";
import { SSColors } from "./colors";
import { Typography } from "./Typography";

function Tabs(props: {
  children: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Root
      css={`
        width: 100%;
      `}
      value={props.value}
      onValueChange={(value) => props.onChange(value)}
    >
      {props.children}
    </Root>
  );
}

function TabList(props: {
  children: React.ReactNode;
  action: React.ReactNode;
}) {
  return (
    <div
      css={`
        display: flex;
        width: 100%;
        justify-content: space-between;
      `}
    >
      <List
        css={`
          display: flex;
          flex-wrap: nowrap;
          gap: 36px;
          min-height: 36px;
        `}
      >
        {props.children}
      </List>
      {props.action}
    </div>
  );
}

function Tab(props: { children: React.ReactNode; value: string }) {
  return (
    <Typography
      component={Trigger}
      value={props.value}
      css={`
        padding: 0;
        margin: 0;
        border: 0;
        background: transparent;

        @media (hover: hover) {
          cursor: pointer;
        }

        &[data-state="active"] {
          font-weight: bold;
        }

        &[data-state="inactive"] {
          color: ${SSColors.black500};
        }
      `}
    >
      {props.children}
    </Typography>
  );
}

function TabPanel(props: { children: React.ReactNode; value: string }) {
  return <TabsContent value={props.value}>{props.children}</TabsContent>;
}

export { Tabs, TabList, Tab, TabPanel };
