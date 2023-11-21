import React, { CSSProperties, FC } from "react";
import { ComponentDefinitionShared } from "@easyblocks/core";

type MissingComponentType = "BUTTON" | "CARD" | "SECTION";

const rootStyles: CSSProperties = {
  position: "relative",
  width: "100%",
};

const ratioStyles: (props: {
  type?: MissingComponentType;
}) => CSSProperties = ({ type }) => {
  return {
    paddingBottom: (() => {
      if (type === "SECTION") {
        return "50%";
      }
      if (type === "CARD") {
        return "133%";
      }
      return "auto";
    })(),

    display: type === "BUTTON" ? "none" : "block",
    height: type === "BUTTON" ? "50px" : "auto",
  };
};

const contentStyles: (props: {
  type?: MissingComponentType;
  error?: boolean;
}) => CSSProperties = ({ type, error }) => {
  return {
    position: type === "CARD" || type === "SECTION" ? "absolute" : "static",
    boxSizing: "border-box",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "#fafafa",
    color: error ? "red" : "grey",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "sans-serif",
    textAlign: "center",
    fontSize: "14px",
    minHeight: "40px",
    padding: type === "CARD" || type === "SECTION" ? "32px" : "0.5em 0.5em",
  };
};

type MissingComponentBuilderProps = {
  component?: ComponentDefinitionShared;
  children?: React.ReactNode;
  error?: boolean;
};

type MissingComponentBuilderComponent = FC<MissingComponentBuilderProps>;

function MissingComponent({
  component,
  children,
  error,
}: MissingComponentBuilderProps) {
  const isButton =
    component?.type === "button" ||
    (Array.isArray(component?.type) && component?.type.includes("button"));
  const isSection =
    component?.type === "section" ||
    (Array.isArray(component?.type) && component?.type.includes("section"));
  const isCard =
    component?.type === "card" ||
    (Array.isArray(component?.type) && component?.type.includes("card"));

  let type: MissingComponentType | undefined;

  if (isSection) {
    type = "SECTION";
  } else if (isCard) {
    type = "CARD";
  } else if (isButton) {
    type = "BUTTON";
  }

  return (
    <div style={rootStyles}>
      <div style={ratioStyles({ type })} />
      <div style={contentStyles({ type, error })}>{children}</div>
    </div>
  );
}

export default MissingComponent;
export type {
  MissingComponentType,
  MissingComponentBuilderProps,
  MissingComponentBuilderComponent,
};
