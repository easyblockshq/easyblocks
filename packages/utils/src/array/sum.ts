function sum(elements: Array<number>): number {
  return elements.reduce((sum, element) => sum + element, 0);
}

export { sum };
