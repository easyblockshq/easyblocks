/**
 * `Object.keys` is badly typed for its reasons and this function just fixes it.
 * https://stackoverflow.com/questions/55012174/why-doesnt-object-keys-return-a-keyof-type-in-typescript
 */
function keys<T extends object>(o: T): Array<keyof T> {
  return Object.keys(o) as unknown as Array<keyof T>;
}

export { keys };
