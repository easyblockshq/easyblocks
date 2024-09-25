"use client";
import { useCallback, useState } from "react";

function useForceRerender() {
  const [, setDummyState] = useState({});

  const forceRerender = useCallback(() => {
    setDummyState({});
  }, []);

  return { forceRerender };
}

export { useForceRerender };
