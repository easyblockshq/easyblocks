import type { ReactElement, ReactNode, Ref } from "react";
import React from "react";

function Button(
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

  const triggerElement = (
    <ButtonRoot.type {...ButtonRoot.props}>
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

export { Button };
