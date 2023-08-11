const thresholdOfHalfTheViewportHeight = (element: Element) => {
  const elementHeight = element.getBoundingClientRect().height;
  if (elementHeight === 0) {
    return 0;
  }

  const halfTheViewport = window.innerHeight / 2;
  const threshold = Math.round((halfTheViewport * 100) / elementHeight) / 100;

  return Math.max(0, Math.min(threshold, 0.5));
};

export { thresholdOfHalfTheViewportHeight };
