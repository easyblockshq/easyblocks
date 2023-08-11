import { ConfigComponent } from "./types";

export function isComponentConfig(value: any): value is ConfigComponent {
  return (
    typeof value === "object" &&
    typeof value?._template === "string" &&
    typeof value?._id === "string"
  );
}
