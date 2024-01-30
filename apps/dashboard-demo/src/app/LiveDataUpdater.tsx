"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// This component reloads external data every 5 seconds
export function LiveDataUpdater() {
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh();
    }, 5 * 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return null;
}
