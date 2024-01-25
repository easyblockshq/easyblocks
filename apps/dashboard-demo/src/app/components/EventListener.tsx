"use client";
import { useEffect } from "react";
import toast from "react-hot-toast";

function EventListener() {
  useEffect(() => {
    function showToast(event: MessageEvent) {
      if (event.data.type === "triggerEvent") {
        toast(event.data.message);
      }
    }

    window.addEventListener("message", showToast);

    return () => {
      window.removeEventListener("message", showToast);
    };
  }, []);

  return null;
}

export { EventListener };
