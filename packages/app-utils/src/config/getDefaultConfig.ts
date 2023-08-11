import { ComponentConfig, EditorLauncherProps } from "@easyblocks/core";
import { uniqueId } from "@easyblocks/utils";

export function getDefaultConfig(
  rootContainer?: EditorLauncherProps["rootContainer"]
): ComponentConfig {
  if (rootContainer === "grid") {
    const rootGridConfig: ComponentConfig = {
      _id: uniqueId(),
      _template: "$RootGrid",
      data: [
        {
          _template: "$Grid",
          containerMargin: { ref: "grid.containerMargin" },
          Component: [
            {
              _template: "$GridCard",
              numberOfItems: { ref: "grid" },
              columnGap: { ref: "grid.horizontalGap" },
              rowGap: { ref: "grid.verticalGap" },
              Cards: [],
            },
          ],
        },
      ],
    };

    return rootGridConfig;
  }

  return {
    _id: uniqueId(),
    _template: "$RootSections",
    data: [],
  };
}
