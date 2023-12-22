export function parseAspectRatio(aspectRatio: string): number {
  const error = new Error(`wrong input to parseAspectRatio: ${aspectRatio}`);

  const split = aspectRatio.split(":");
  const val1 = parseInt(split[0]);
  const val2 = parseInt(split[1]);

  if (isNaN(val1) || isNaN(val2)) {
    throw error;
  }

  const result = val2 / val1;

  if (isNaN(result)) {
    throw error;
  }

  return result;
}

export function getPaddingBottomFromAspectRatio(aspectRatio: string) {
  return `${parseAspectRatio(aspectRatio) * 100}%`;
}
