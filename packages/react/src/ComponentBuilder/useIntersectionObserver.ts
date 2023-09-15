import { useEffect, useRef } from "react";
import { thresholdOfHalfTheViewportHeight } from "./thresholdOfHalfTheViewportHeight";

function useIntersectionObserver<T extends Element>(
  callback: IntersectionObserverCallback,
  init?: IntersectionObserverInit
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const threshold = thresholdOfHalfTheViewportHeight(ref.current);

    const observer = new IntersectionObserver(callback, {
      ...init,
      threshold,
    });
    observer.observe(ref.current);

    return () => {
      if (!ref.current) {
        return;
      }
      observer.unobserve(ref.current);
    };
  }, []);

  return ref;
}

export { useIntersectionObserver };
