import { FieldMixedValue } from "../../../types";

function isMixedFieldValue(value: unknown): value is FieldMixedValue {
  return (
    typeof value === "object" &&
    value !== null &&
    "__mixed__" in value &&
    (value as FieldMixedValue).__mixed__
  );
}

export { isMixedFieldValue };
