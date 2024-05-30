import { useEffect } from "react";

export enum ExtraKeys {
  ALT_KEY = "altKey",
  CTRL_KEY = "ctrlKey",
  META_KEY = "metaKey",
  SHIFT_KEY = "shiftKey",
}

const actionKeys: ExtraKeys[] = [
  ExtraKeys.ALT_KEY,
  ExtraKeys.CTRL_KEY,
  ExtraKeys.META_KEY,
  ExtraKeys.SHIFT_KEY,
];

interface GlobalKeyDownConfig {
  extraKeys: ExtraKeys[];
  isDisabled: boolean;
}

export const useWindowKeyDown = (
  key: string,
  callback: (...args: unknown[]) => any,
  { extraKeys, isDisabled }: GlobalKeyDownConfig = {
    extraKeys: [],
    isDisabled: false,
  }
) => {
  const downHandler = (event: KeyboardEvent) => {
    const isExtraKeysPressed = extraKeys.every((k) => event[k]);
    const extraKeysSet = new Set([...extraKeys]);

    const isOtherExtraKeysPressed = actionKeys
      .filter((k) => !extraKeysSet.has(k))
      .some((k) => event[k]);

    if (event.key === key && isExtraKeysPressed && !isOtherExtraKeysPressed) {
      event.preventDefault();
      callback();
    }
  };

  useEffect(() => {
    if (!isDisabled) {
      document.body.addEventListener("keydown", downHandler);

      window.addEventListener("keydown", downHandler);
      return () => {
        window.removeEventListener("keydown", downHandler);
      };
    }
  }, [isDisabled]);
};
