export function dotNotationGet(obj: any, path: string) {
  if (path === "") {
    return obj;
  }

  return path.split(".").reduce((acc, curVal) => {
    if (!acc) {
      return acc;
    }

    if (Array.isArray(acc)) {
      return acc[Number(curVal)];
    }

    return acc[curVal];
  }, obj);
}
