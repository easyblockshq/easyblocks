import React, { HTMLProps, ReactElement } from "react";

function Icon(props: {
  IconWrapper: ReactElement<HTMLProps<HTMLDivElement>>;
  icon: string;
}) {
  const { IconWrapper, icon } = props;

  return (
    <IconWrapper.type
      {...IconWrapper.props}
      dangerouslySetInnerHTML={{
        __html: icon,
      }}
    />
  );
}

export default Icon;
