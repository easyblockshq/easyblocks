function includesAny<T>(a: T[], b: T[]) {
  return a.some((i) => b.includes(i));
}

export { includesAny };
