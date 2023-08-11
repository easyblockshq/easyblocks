function assertDefined<T>(value: T): Exclude<T, undefined> {
  if (value === undefined) {
    throw new Error("Value is undefined");
  }

  return value as Exclude<T, undefined>;
}

function assertNonNullable<T>(value: T): Exclude<T, null> {
  if (value === null) {
    throw new Error("Value is null");
  }

  return value as Exclude<T, null>;
}

export { assertDefined, assertNonNullable };
