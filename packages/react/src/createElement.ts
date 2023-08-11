import React from "react";

function createElement(type: any, props: any, ...children: any) {
  // SUPER IMPORTANT!!!
  if (React.isValidElement(type)) {
    const oldPassedProps = (type as any).props.passedProps || {};
    return React.cloneElement(
      type,
      { passedProps: { ...oldPassedProps, ...props }, key: props?.key } as any,
      ...children
    );
  }

  return React.createElement(type, props, ...children);
}

export default createElement;
