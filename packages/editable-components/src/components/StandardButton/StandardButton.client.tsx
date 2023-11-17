import type { ReactElement, ReactNode, Ref } from "react";
import React from "react";

function StandardButton(
  props: {
    ButtonRoot: ReactElement<{ children: ReactNode }>;
    IconWrapper: ReactElement;
    Action: ReactElement;
    label: string | undefined;
    icon: string;
    variant: "label" | "icon" | "label-icon";
    forwardedRef: Ref<HTMLButtonElement>;
  } & Record<string, any>
) {
  const { ButtonRoot, IconWrapper, Action, variant, icon, label = "" } = props;

  // Every Shopstory button is just a component that must have props and ref passed.
  const buttonProps: Record<string, any> = {
    // dangerouslySetInnerHTML: {__html: props.configProps.icon },
    ref: props.forwardedRef,
  };

  // TODO: pass through button-related props -> do "spread" later -> there's duplication in IconButton too, do sth with it
  for (const key in props) {
    if (
      key === "as" ||
      key === "onClick" ||
      key === "href" ||
      key === "target"
    ) {
      buttonProps[key] = props[key];
    }
  }

  const triggerElement = (
    <ButtonRoot.type {...ButtonRoot.props} {...buttonProps}>
      {variant !== "icon" && <div>{label}</div>}
      {variant !== "label" && (
        <IconWrapper.type
          {...IconWrapper.props}
          dangerouslySetInnerHTML={{
            __html: icon,
          }}
        />
      )}
    </ButtonRoot.type>
  );

  if (Action) {
    return <Action.type {...Action.props} trigger={triggerElement} />;
  }

  return triggerElement;
}

export default StandardButton;
