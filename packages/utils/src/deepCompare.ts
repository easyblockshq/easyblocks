function deepCompare(...objectsToCompare: Array<Record<string, any>>): boolean {
  for (let index = 0; index < objectsToCompare.length - 1; index++) {
    const currentObject = sortObject(objectsToCompare[index]);
    const nextObject = sortObject(objectsToCompare[index + 1]);

    const areObjectsHashesEqual =
      JSON.stringify(currentObject) === JSON.stringify(nextObject);

    if (!areObjectsHashesEqual) {
      return false;
    }
  }

  return true;
}

function sortObject(value: unknown) {
  if (typeof value !== "object") {
    return value;
  }

  if (Array.isArray(value)) {
    return [...value].sort();
  }

  if (value === null) {
    return null;
  }

  const sortedObject: Record<string, any> = {};
  const objectKeys = Object.keys(value).sort();

  objectKeys.forEach((key) => {
    sortedObject[key] = sortObject((value as Record<string, any>)[key]);
  });

  return sortedObject;
}

export { deepCompare, sortObject };
