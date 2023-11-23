"use client";
import { ProductCard } from "@/components/ProductCard/ProductCard";
import { builtinEditableComponents } from "@easyblocks/editable-components";

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

const components = {
  ...builtinEditableComponents(),
  ProductCard,
  $Link,
  $AlertAction,
};

export { components };
