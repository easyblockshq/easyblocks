import { Theme } from "@easyblocks/core";

const MASTER_FONT_FAMILY = "-apple-system, BlinkMacSystemFont, sans-serif";

const arrowLeftIcon: Theme["icons"]["key"] = {
  type: "dev",
  // label: "Arrow left",
  value: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="red" width="100px" height="100px"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>`,
};

const arrowRightIcon: Theme["icons"]["key"] = {
  type: "dev",
  // label: "Arrow right",
  value: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z"/></svg>`,
};
// export const chevronLeftIcon: Theme["icons"]["key"] = {
//   type: "dev",
//   // label: "Arrow left",
//   value: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="red" width="100px" height="100px"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>`,
// };
//
// export const chevronRightIcon: Theme["icons"]["key"] = {
//   type: "dev",
//   // label: "Arrow right",
//   value: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 15" fill="currentColor"><path d="M0.220635 0.208548C0.514814 -0.0695159 0.991773 -0.0695159 1.28595 0.208548L9 7.5L1.28595 14.7915C0.991773 15.0695 0.514814 15.0695 0.220635 14.7915C-0.0735449 14.5134 -0.0735449 14.0626 0.220635 13.7845L6.86937 7.5L0.220635 1.2155C-0.0735449 0.937441 -0.0735449 0.486611 0.220635 0.208548Z" fill="currentColor"/></svg>`,
// };

const playIcon: Theme["icons"]["key"] = {
  type: "dev",
  // label: "Play",
  value: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" /></svg>`,
};

const pauseIcon: Theme["icons"]["key"] = {
  type: "dev",
  // label: "Pause",
  value: `<svg style="width:24px;height:24px" viewBox="0 0 24 24"><path fill="currentColor" d="M14,19H18V5H14M6,19H10V5H6V19Z" /></svg>`,
};

const muteIcon: Theme["icons"]["key"] = {
  type: "dev",
  // label: "Mute",
  value: `<svg viewBox="0 0 24 24">
    <path fill="currentColor" d="M12,4L9.91,6.09L12,8.18M4.27,3L3,4.27L7.73,9H3V15H7L12,20V13.27L16.25,17.53C15.58,18.04 14.83,18.46 14,18.7V20.77C15.38,20.45 16.63,19.82 17.68,18.96L19.73,21L21,19.73L12,10.73M19,12C19,12.94 18.8,13.82 18.46,14.64L19.97,16.15C20.62,14.91 21,13.5 21,12C21,7.72 18,4.14 14,3.23V5.29C16.89,6.15 19,8.83 19,12M16.5,12C16.5,10.23 15.5,8.71 14,7.97V10.18L16.45,12.63C16.5,12.43 16.5,12.21 16.5,12Z" />
</svg>`,
};

const unmuteIcon: Theme["icons"]["key"] = {
  type: "dev",
  // label: "Unmute",
  value: `<svg viewBox="0 0 24 24">
    <path fill="currentColor" d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z" />
</svg>`,
};

export const defaultTheme: Theme = {
  space: {
    0: { value: "0px", type: "dev" },
    1: { value: "1px", type: "dev" },
    2: { value: "2px", type: "dev" },
    4: { value: "4px", type: "dev" },
    6: { value: "6px", type: "dev" },
    8: { value: "8px", type: "dev" },
    12: { value: "12px", type: "dev" },
    16: { value: "16px", type: "dev" },
    24: { value: "24px", type: "dev" },
    32: { value: "32px", type: "dev" },
    48: { value: "48px", type: "dev" },
    64: { value: "64px", type: "dev" },
    96: { value: "96px", type: "dev" },
    128: { value: "128px", type: "dev" },
    160: { value: "160px", type: "dev" },
    "containerMargin.default": {
      value: {
        $res: true,
        xl: "5vw",
      },
      type: "dev",
    },
  },
  colors: {
    // $dark: { value: "black", type: "dev" },
    // $light: { value: "white", type: "dev" },
    // $backgroundDark: { value: "#363636", type: "dev" },
    // $backgroundLight: { value: "#F2F2F2", type: "dev" },
    // transparent: { value: "transparent", type: "dev" },
  },
  fonts: {
    // $body: {
    //   value: {
    //     fontFamily: MASTER_FONT_FAMILY,
    //     fontSize: 20,
    //     fontWeight: 400,
    //     lineHeight: 1.2,
    //     "@xs": {
    //       fontSize: 18,
    //     },
    //   },
    //   type: "dev",
    // },
    // "$body.bold": {
    //   value: {
    //     fontFamily: MASTER_FONT_FAMILY,
    //     fontSize: 20,
    //     fontWeight: 500,
    //     lineHeight: 1.2,
    //     "@xs": {
    //       fontSize: 18,
    //     },
    //   },
    //   type: "dev",
    // },
    // $body2: {
    //   value: {
    //     fontFamily: MASTER_FONT_FAMILY,
    //     fontSize: 16,
    //     fontWeight: 400,
    //     lineHeight: 1.2,
    //   },
    //   type: "dev",
    // },
    // "$body2.bold": {
    //   value: {
    //     fontFamily: MASTER_FONT_FAMILY,
    //     fontSize: 16,
    //     fontWeight: 500,
    //     lineHeight: 1.2,
    //   },
    //   type: "dev",
    // },
    // $heading1: {
    //   value: {
    //     fontFamily: MASTER_FONT_FAMILY,
    //     fontSize: 64,
    //     fontWeight: 500,
    //     lineHeight: 1.2,
    //     "@xs": {
    //       fontSize: 36,
    //     },
    //   },
    //   type: "dev",
    // },
    // $heading2: {
    //   value: {
    //     fontFamily: MASTER_FONT_FAMILY,
    //     fontSize: 48,
    //     fontWeight: 500,
    //     lineHeight: 1.2,
    //     "@xs": {
    //       fontSize: 32,
    //     },
    //   },
    //   type: "dev",
    // },
    // $heading3: {
    //   value: {
    //     fontFamily: MASTER_FONT_FAMILY,
    //     fontSize: 32,
    //     fontWeight: 500,
    //     lineHeight: 1.2,
    //     "@xs": {
    //       fontSize: 28,
    //     },
    //   },
    //   type: "dev",
    // },
    // $heading4: {
    //   value: {
    //     fontFamily: MASTER_FONT_FAMILY,
    //     fontSize: 24,
    //     fontWeight: 500,
    //     lineHeight: 1.2,
    //   },
    //   type: "dev",
    // },
  },
  icons: {
    $sliderLeft: {
      ...arrowLeftIcon,
    },
    $sliderRight: {
      ...arrowRightIcon,
    },
    $play: {
      ...playIcon,
    },
    $pause: {
      ...pauseIcon,
    },
    $mute: {
      ...muteIcon,
    },
    $unmute: {
      ...unmuteIcon,
    },
  },
  aspectRatios: {
    $panoramic: {
      value: "2:1",
      type: "dev",
      // label: "Panoramic",
    },
    $landscape: {
      value: "16:9",
      type: "dev",
      // label: "Landscape",
    },
    $portrait: {
      value: "4:5",
      type: "dev",
      // label: "Portrait",
    },
    $square: {
      value: "1:1",
      type: "dev",
      // label: "Square",
    },
    $gridMainObjectDefault: {
      value: "4:5",
      type: "dev",

      // label: "Grid main object default",
    },
  },
  numberOfItemsInRow: {
    "1": { value: "1", type: "dev" },
    "2": { value: "2", type: "dev" },
    "3": { value: "3", type: "dev" },
    "4": { value: "4", type: "dev" },
    "5": { value: "5", type: "dev" },
    "6": { value: "6", type: "dev" },
  },
  containerWidths: {
    none: { value: "none", type: "dev" },
  },
  boxShadows: {
    none: { value: "none", type: "dev" },
    // $sm: {
    //   value: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    //   type: "dev",
    // },
    // $md: {
    //   value: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    //   type: "dev",
    // },
    // $lg: {
    //   value: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    //   type: "dev",
    // },
    // $xl: {
    //   value: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    //   type: "dev",
    // },
    // $2xl: {
    //   value: "0 25px 50px -12px rgb(0 0 0 / 0.25)",
    //   type: "dev",
    // },
  },
};
