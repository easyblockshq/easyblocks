import { useState } from "react";
import { isEqual } from "lodash";

const useMemoizedState = <T>(initialValue: T): [T, (val: T) => void] => {
  const [state, _setState] = useState<T>(initialValue);

  const setState = (newState: T) => {
    _setState((prev) => {
      if (!isEqual(newState, prev)) {
        return newState;
      } else {
        return prev;
      }
    });
  };

  return [state, setState];
};

export default useMemoizedState;
