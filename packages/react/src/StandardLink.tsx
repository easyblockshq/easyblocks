import React from "react";
import { LinkProviderProps } from "./types";

const StandardLinkProvider = (props: LinkProviderProps) => {
  const { Component, componentProps, values } = props;
  return (
    <Component
      {...componentProps}
      href={values.url}
      target={values.shouldOpenInNewWindow ? "_blank" : undefined}
    />
  );
};

export { StandardLinkProvider };
