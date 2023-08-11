function deepClone<T>(source: T): T {
  return JSON.parse(JSON.stringify(source)) as T;
}

export { deepClone };
