"use client";

import {
  builtinEditableComponents,
  builtinEditableComponentsDefinitions,
} from "@easyblocks/editable-components";
import { Canvas, ShopstoryProvider } from "@easyblocks/react";
import { accessToken } from "../lib/apiClient";

export default function ShopstoryCanvas() {
  return (
    <ShopstoryProvider components={builtinEditableComponents()}>
      <Canvas
        config={{
          accessToken,
          locales: [
            {
              code: "en-US",
              isDefault: true,
            },
            {
              code: "de-DE",
              fallback: "en-US",
            },
          ],
          rootContainers: {
            content: {
              defaultConfig: {
                _template: "$RootSections",
                data: [],
              },
            },
          },
          components: builtinEditableComponentsDefinitions,
        }}
      />
    </ShopstoryProvider>
  );
}
