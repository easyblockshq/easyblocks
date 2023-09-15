import { EventType } from "@easyblocks/core";
import React, { ComponentType } from "react";
import { thresholdOfHalfTheViewportHeight } from "./thresholdOfHalfTheViewportHeight";
import { useIntersectionObserver } from "./useIntersectionObserver";

function withImpressionTracking<T extends Record<string, unknown>>(
  {
    callback,
    root,
  }: {
    callback: (type: EventType) => void;
    root?: Element | Document | null;
  },
  Component?: ComponentType<T>
) {
  return (props: T) => {
    const ref = useIntersectionObserver<HTMLDivElement>(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (
            entry.intersectionRatio >=
            thresholdOfHalfTheViewportHeight(entry.target)
          ) {
            callback("impression");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root,
      }
    );

    return Component ? (
      <div style={{ display: "grid" }} ref={ref}>
        <Component {...props} />
      </div>
    ) : null;
  };
}

export { withImpressionTracking };
