import { ReactNode } from "react";
import { NoCodeComponentProps } from "../../../../types";

function PropertyTextItem({ property, variant }: NoCodeComponentProps) {
  return (
    <PropertyItem variant={variant}>
      <PropertyItemLabel>{property.label}</PropertyItemLabel>
      <div
        className={`${
          variant === "stacked" ? "mt-1 " : ""
        }text-sm text-gray-700`}
      >
        {property.value}
      </div>
    </PropertyItem>
  );
}

function PropertyBooleanItem({ property, variant }: NoCodeComponentProps) {
  return (
    <PropertyItem variant={variant}>
      <PropertyItemLabel>{property.label}</PropertyItemLabel>
      <div
        className={`${
          variant === "stacked" ? "mt-1 " : ""
        }text-sm text-gray-700`}
      >
        {property.value ? "Yes" : "No"}
      </div>
    </PropertyItem>
  );
}

function PropertyDateItem({ property, variant }: NoCodeComponentProps) {
  return (
    <PropertyItem variant={variant}>
      <PropertyItemLabel>{property.label}</PropertyItemLabel>
      <div
        className={`${
          variant === "stacked" ? "mt-1 " : ""
        }text-sm text-gray-700`}
      >
        {new Date(property.value).toLocaleDateString("en", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })}
      </div>
    </PropertyItem>
  );
}

export { PropertyTextItem, PropertyBooleanItem, PropertyDateItem };

function PropertyItem(props: { variant: string; children: ReactNode }) {
  return (
    <div
      className={`flex ${
        props.variant === "stacked" ? "flex-col" : "flex-row items-center gap-2"
      }`}
    >
      {props.children}
    </div>
  );
}

function PropertyItemLabel(props: { children: ReactNode }) {
  return (
    <div className="text-sm font-medium text-gray-900">{props.children}</div>
  );
}
