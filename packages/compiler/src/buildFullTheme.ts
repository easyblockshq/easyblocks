import { defaultTheme } from "@easyblocks/app-utils";
import type { Theme } from "@easyblocks/core";

export function buildFullTheme(theme: Theme): Theme {
  const userFonts = theme.fonts || {};
  const userAspectRatios = theme.aspectRatios || {};
  const userContainerWidths = theme.containerWidths || {};
  const userBoxShadows = theme.boxShadows || {};

  // We spread values from default theme because we want to prevent overriding master tokens by our users
  return {
    space: {
      ...theme.space,
      ...defaultTheme.space,
      // This token is an exception and need to be handled manually.
      "containerMargin.default":
        theme.space?.["containerMargin.default"] ??
        defaultTheme.space["containerMargin.default"],
    },
    colors: {
      ...theme.colors,
      ...defaultTheme.colors,
    },
    fonts: {
      ...userFonts,
      ...defaultTheme.fonts,
    },
    icons: {
      ...theme.icons,
      ...defaultTheme.icons,
    },
    numberOfItemsInRow: {
      ...theme.numberOfItemsInRow,
      ...defaultTheme.numberOfItemsInRow,
    },
    aspectRatios: {
      ...userAspectRatios,
      ...defaultTheme.aspectRatios,
    },
    containerWidths: {
      ...userContainerWidths,
      ...defaultTheme.containerWidths,
    },
    boxShadows: {
      ...defaultTheme.boxShadows,
      ...userBoxShadows,
    },
  };
}
