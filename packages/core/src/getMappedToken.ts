import { RefValue, ThemeRefValue } from "./types";

export function getMappedToken<T>(
  tokenId: string,
  themeValues: { [key: string]: ThemeRefValue<T> }
): RefValue<T> | undefined {
  if (!tokenId.startsWith("$")) {
    return undefined;
  }

  let mappedValue: RefValue<T> | undefined = undefined;

  Object.entries(themeValues).forEach(([themeTokenId, themeValue]) => {
    if (!themeValue.mapTo) {
      return;
    }

    const mapToArray =
      typeof themeValue.mapTo === "string"
        ? [themeValue.mapTo]
        : themeValue.mapTo;

    if (mapToArray.includes(tokenId)) {
      mappedValue = {
        ref: themeTokenId,
        value: themeValue.value,
      };
    }
  });

  return mappedValue;
}
