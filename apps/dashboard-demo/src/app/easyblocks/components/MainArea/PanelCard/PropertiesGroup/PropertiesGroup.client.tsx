import { ReactElement } from "react";
import { NoCodeComponentProps } from "../../../types";

function PropertiesGroup({ Properties, variant }: NoCodeComponentProps) {
  return (
    <div
      className={`flex flex-col ${
        variant === "stacked" ? "gap-4" : "items-center gap-2"
      }`}
    >
      {(Properties as Array<ReactElement>).map((PropertyItem, index) => {
        return <PropertyItem.type {...PropertyItem.props} key={index} />;
      })}
    </div>
  );
}

export { PropertiesGroup };
