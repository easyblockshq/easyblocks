import { RefObject, useEffect, useRef } from "react";

export function useOnClickNTimes(
  ref: RefObject<HTMLElement | undefined>,
  count: number,
  event: () => void
): void {
  const counterRef = useRef<number>(0);
  const timerRef = useRef<any>();

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    ref.current?.addEventListener("click", () => {
      clearTimeout(timerRef.current);

      counterRef.current++;

      if (counterRef.current === count) {
        event();
        counterRef.current = 0;
      }

      timerRef.current = setTimeout(() => {
        counterRef.current = 0;
      }, 300);
    });
  }, []);
}
