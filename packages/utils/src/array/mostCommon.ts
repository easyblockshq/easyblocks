function mostCommon<
  Value extends boolean | string | number | Record<string, any>
>(collection: Array<Value>): Value {
  const repetitionsCount: Map<boolean | string | number, number> = new Map();

  collection.forEach((value) => {
    const currentItemKey = getKeyForValue(value);
    const currentItemRepetitionsCount = repetitionsCount.get(currentItemKey);
    if (currentItemRepetitionsCount === undefined) {
      repetitionsCount.set(currentItemKey, 0);
      return;
    }

    repetitionsCount.set(currentItemKey, currentItemRepetitionsCount + 1);
  });

  const repetitionsCountEntries = Array.from(repetitionsCount);

  const [mostCommonValue] = repetitionsCountEntries.reduce(
    (currentMostCommonEntry, currentEntry) => {
      if (currentEntry[1] > currentMostCommonEntry[1]) {
        return currentEntry;
      }

      return currentMostCommonEntry;
    }
  );

  if (typeof mostCommonValue === "string") {
    try {
      const unwrappedValue: Record<string, any> = JSON.parse(mostCommonValue);
      if (typeof unwrappedValue === "object") {
        return unwrappedValue as Value;
      }
    } catch {
      return mostCommonValue as Value;
    }
  }

  return mostCommonValue as Value;
}

function getKeyForValue<
  Value extends boolean | string | number | Record<string, any>
>(value: Value): boolean | string | number {
  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return value;
}

export { mostCommon };
