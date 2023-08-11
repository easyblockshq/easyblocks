function toArray<T>(scalarOrCollection: T | Array<T>): Array<T> {
  if (Array.isArray(scalarOrCollection)) {
    return scalarOrCollection;
  }

  return [scalarOrCollection];
}

export { toArray };
