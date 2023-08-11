import { ConfigComponentIdentifier } from "@easyblocks/core";

export function isComponentConfigIdentifier(
  value: any
): value is ConfigComponentIdentifier {
  const isNotNull = typeof value !== null;
  const isObject = typeof value === "object";
  const idIsAString = typeof value?.id === "string";

  return isNotNull && isObject && idIsAString;
}
