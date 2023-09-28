import { SSColors, SSFonts } from "@easyblocks/design-system";
import React, { FC } from "react";

export type PlaceholderProps = {
  onClick: () => void;
  width?: number;
  height: number;
  autoWidth?: boolean;
  label: string;
  meta: any;
};

function Placeholder(props: PlaceholderProps) {
  const stitches = props.meta.easyblocksProviderContext.stitches;
  const styles: Record<string, any> = {};

  if (props.width) {
    const aspectRatio = props.height / props.width;
    styles.paddingBottom = `${aspectRatio * 100}%`;
  } else {
    styles.height = `${props.height}px`;
  }

  const rootClassName = stitches.css({
    border: `1px dashed ${SSColors.blue50}`,
    position: "relative",
    width: `${props.autoWidth ? "auto" : props.width + "px"}`,
    height: "auto",
    transition: "all 0.1s",
  });

  const contentClassName = stitches.css({
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    color: SSColors.blue50,
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    ...SSFonts.body,
    "&:hover": {
      backgroundColor: SSColors.blue10,
    },
  });

  const content = (
    <div
      className={contentClassName()}
      onClick={(event) => {
        event.stopPropagation();
        props.onClick();
      }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M8 2V14M2 8H14" stroke={SSColors.blue50} />
      </svg>
      &nbsp;&nbsp;{props.label}
    </div>
  );

  return (
    <div className={rootClassName()}>
      <div
        style={{
          position: "relative",
          width: "100%",
          ...styles,
        }}
      ></div>
      {content}
    </div>
  );
}

type TypePlaceholderComponentBuilderProps = {
  type: string;
  onClick: () => void;
  meta: any;
};

type PlaceholderBuilderComponent = FC<TypePlaceholderComponentBuilderProps>;

export default function TypePlaceholder(
  props: TypePlaceholderComponentBuilderProps
) {
  const { type } = props;

  let placeholderWidth: number | undefined = undefined;
  let placeholderHeight: number;
  let placeholderLabel: string;
  let autoWidth = true;

  if (type === "section") {
    placeholderWidth = 1920;
    placeholderHeight = 600;
    placeholderLabel = "Add section";
  } else if (type === "card") {
    placeholderWidth = 420;
    placeholderHeight = 600;
    placeholderLabel = "Add card";
  } else if (type === "button") {
    placeholderWidth = 250;
    placeholderHeight = 50;
    placeholderLabel = "Add button";
    autoWidth = false;
  } else if (type === "item") {
    // placeholderWidth = 250;
    placeholderHeight = 50;
    placeholderLabel = "Add item";
  } else if (type === "image") {
    placeholderWidth = 250;
    placeholderHeight = 250;
    placeholderLabel = "Add image / video / solid color";
  } else if (type === "icon") {
    placeholderWidth = 50;
    placeholderHeight = 50;
    placeholderLabel = "Pick icon";
  } else {
    throw new Error("error, bad type: '" + type + "'");
  }

  return (
    <Placeholder
      width={placeholderWidth}
      height={placeholderHeight}
      autoWidth={autoWidth}
      label={placeholderLabel}
      onClick={props.onClick}
      meta={props.meta}
    />
  );
}

export type {
  TypePlaceholderComponentBuilderProps,
  PlaceholderBuilderComponent,
};
