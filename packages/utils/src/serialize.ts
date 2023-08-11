function serialize(value: unknown) {
  if (value instanceof Error) {
    return JSON.parse(JSON.stringify(value, Object.getOwnPropertyNames(value)));
  }

  return JSON.parse(JSON.stringify(value));
}

export { serialize };
