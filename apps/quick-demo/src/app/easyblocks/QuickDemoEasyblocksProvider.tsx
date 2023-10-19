"use client";
import { builtinEditableComponents } from "@easyblocks/editable-components";
import { EasyblocksProvider } from "@easyblocks/react";
import { ProductCard } from "@/components/ProductCard/ProductCard";
import React, { ReactElement } from "react";

const $Link = (props: any) => {
  const TriggerElement = props.trigger;
  const { url, shouldOpenInNewWindow } = props.__fromEditor.props;

  return (
    <TriggerElement.type
      {...TriggerElement.props}
      as={"a"}
      href={url}
      target={shouldOpenInNewWindow ? "_blank" : undefined}
    />
  );
};

const $AlertAction = (props: any) => {
  const TriggerElement = props.trigger;
  const { text } = props.__fromEditor.props;

  return (
    <TriggerElement.type
      {...TriggerElement.props}
      as={"button"}
      onClick={() => {
        alert(text);
      }}
    />
  );
};

export const QuickDemoEasyblocksProvider: React.FC<{
  children?: React.ReactNode;
}> = ({ children }) => {
  return (
    <EasyblocksProvider
      components={{
        ...builtinEditableComponents(),
        ProductCard,
        $Link,
        $AlertAction,
      }}
    >
      {children}
    </EasyblocksProvider>
  );
};
