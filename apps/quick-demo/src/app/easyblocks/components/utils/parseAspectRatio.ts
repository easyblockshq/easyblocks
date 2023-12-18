const sizeMap: { [key: string]: number } = {
  none: 0.00001,
  landscape: 0.7,
  portrait: 1.32,
  square: 1,
  panoramic: 0.5,
};

export function parseAspectRatio(aspectRatio: string): number {
  if (sizeMap[aspectRatio]) {
    return sizeMap[aspectRatio];
  }

  const split = aspectRatio.split(":");

  if (split.length < 2) {
    return 1;
  }

  const result = parseInt(split[1]) / parseInt(split[0]);

  if (isNaN(result)) {
    return 1;
  }

  return result;
}

export function getPaddingBottomAndHeightFromAspectRatio(
  aspectRatio: string,
  naturalAspectRatio?: number
) {
  const aspectRatioFieldValue = aspectRatio || "16:9";

  let paddingBottom = "100%";
  let height = "auto";

  if (aspectRatio === "100vh") {
    height = "100vh";
    paddingBottom = "auto";
  } else {
    const aspectRatio =
      aspectRatioFieldValue === "natural"
        ? 1 / (naturalAspectRatio || 1.5)
        : parseAspectRatio(aspectRatioFieldValue);
    paddingBottom = `${aspectRatio * 100}%`;
  }

  return {
    paddingBottom,
    height,
  };
}
