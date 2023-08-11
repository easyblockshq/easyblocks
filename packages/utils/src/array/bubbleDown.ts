function bubbleDown<T>(matcher: (item: T) => boolean, items: T[]) {
  const originalOrder: T[] = [];
  const bubbledDown: T[] = [];

  items.forEach((item) => {
    if (matcher(item)) {
      bubbledDown.push(item);
    } else {
      originalOrder.push(item);
    }
  });

  return [...originalOrder, ...bubbledDown];
}

export { bubbleDown };
