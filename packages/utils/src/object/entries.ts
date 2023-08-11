type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];

/**
 * `Object.entries` is badly typed for its reasons and this function just fixes it.
 * https://stackoverflow.com/questions/55012174/why-doesnt-object-keys-return-a-keyof-type-in-typescript
 */
function entries<T extends object>(o: T): Entries<T> {
  return Object.entries(o) as Entries<T>;
}

export { entries };
