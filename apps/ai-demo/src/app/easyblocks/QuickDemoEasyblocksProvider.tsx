"use client";
import React from "react";
import { ProductCard } from "@/components/ProductCard/ProductCard";
import { builtinEditableComponents } from "@easyblocks/editable-components";
import { EasyblocksProvider } from "@easyblocks/react";
import { HeroBannerWithCover } from "@/app/easyblocks/noCodeComponents/HeroBannerWithCover/HeroBannerWithCover";
import { CoverCard } from "@/app/easyblocks/noCodeComponents/CoverCard/CoverCard";

const $Link = (props: any) => {
  const { url, shouldOpenInNewWindow, trigger: TriggerElement } = props;

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
  const { text, trigger: TriggerElement } = props;

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
        HeroBannerWithCover,
        CoverCard,
      }}
    >
      {children}
    </EasyblocksProvider>
  );
};
