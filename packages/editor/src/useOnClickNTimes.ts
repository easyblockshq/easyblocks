import { RefObject, useEffect, useRef } from "react";

export function useOnClickNTimes(
  ref: RefObject<HTMLElement | undefined>,
  count: number,
  event: () => void
): void {
  const counterRef = useRef<number>(0);
  const timerRef = useRef<any>(null);

  const { current } = ref;

  useEffect(() => {
    if (!current) {
      return () => {};
    }

    function onClick() {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }

      counterRef.current += 1;

      if (counterRef.current === count) {
        counterRef.current = 0;
        event();
      }

      timerRef.current = setTimeout(() => {
        counterRef.current = 0;
        timerRef.current = null;
      }, 300);
    }

    current.addEventListener("click", onClick);

    return () => {
      current.removeEventListener("click", onClick);
    };
  }, [current, count, event]);
}
