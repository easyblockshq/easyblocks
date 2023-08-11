function last<T extends Array<any>>(collection: T): T[number] {
  return collection[collection.length - 1];
}

export { last };
