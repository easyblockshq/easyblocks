export function pxValueNormalize(from: number, to: number) {
  return (x: string) => {
    const num = parseInt(x);
    if (isNaN(num)) {
      return null;
    }

    if (num < from || num > to) {
      return null;
    }

    return num.toString();
  };
}
