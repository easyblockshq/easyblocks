"use client";

import { Theme } from "@radix-ui/themes";
import type { ReactNode } from "react";

function AppProviders({ children }: { children: ReactNode }) {
  return <Theme id="radix-root">{children}</Theme>;
}

export { AppProviders };
