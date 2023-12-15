"use client";
import { useRef, useState } from "react";

function useForceRerender() {
  const [, setDummyState] = useState({});

  const forceRerender = useRef(() => {
    setDummyState({});
  }).current;

  return { forceRerender };
}

export { useForceRerender };
