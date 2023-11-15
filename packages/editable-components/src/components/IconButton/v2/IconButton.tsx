import React, { ReactElement, MouseEventHandler } from "react";

function IconButton(props: {
  ButtonRoot: ReactElement;
  symbol: ReactElement;
  IconWrapper: ReactElement;
  forwardedRef: any;
  as: string;
  onClick: MouseEventHandler;
  href: string;
  target: string;
}) {
  const { ButtonRoot, symbol: Symbol, IconWrapper } = props;

  const buttonProps: Record<string, any> = {
    // dangerouslySetInnerHTML: { __html: props.icon },
    ref: props.forwardedRef,
  };

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

  return (
    <ButtonRoot.type {...ButtonRoot.props} {...buttonProps}>
      <IconWrapper.type {...IconWrapper.props}>
        <Symbol.type {...Symbol.props} />
      </IconWrapper.type>
    </ButtonRoot.type>
  );
}

export default IconButton;
