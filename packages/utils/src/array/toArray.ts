// eslint-disable-next-line @typescript-eslint/ban-types
function toArray<T extends {}>(scalarOrCollection: T | Array<T>): Array<T> {
  if (Array.isArray(scalarOrCollection)) {
    return scalarOrCollection;
  }

  return [scalarOrCollection];
}

export { toArray };
