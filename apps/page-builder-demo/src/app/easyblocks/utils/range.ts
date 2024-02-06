function range(start: number, end: number): Array<number> {
  const itemsCount = start === end ? 1 : end - start + 1;

  return Array.from({ length: itemsCount }, (_, index) => {
    return start + index;
  });
}

export { range };
