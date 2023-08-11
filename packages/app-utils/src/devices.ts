import { Devices, TrulyResponsiveValue } from "@easyblocks/core";

export function getDevicesWidths(
  devices: Devices
): TrulyResponsiveValue<number> {
  const widths: TrulyResponsiveValue<number> = { $res: true };
  devices.forEach((device) => {
    widths[device.id] = device.w;
  });
  return widths;
}

export const DEFAULT_DEVICES: Devices = [
  // de facto all vertical phones have max 414px
  // de facto all horizontal phones start with 620px (end with ~900, almost all below 915) -> vertical tablet resolutions
  // most people don't use horizontal phones anyway
  // no one uses such tiny resolutions on other devices
  // we obviously need phone resolution
  // we introduce "pro forma" resolution (568 - 767px) which is "some horizontal phones". It's here mostly because there is such resolution in bootstrap, tailwind etc.
  // personally I think we could have one resolution that covers all horizontal phones and tablets (620 - 996). But it would break naming that is "commonly understood" by devs (xs phone, sm horizontal phone, md tablet). sm is mostly dead, should be covered by md
  {
    id: "xs",
    w: 375,
    h: 667,
    breakpoint: 568,
    label: "Mobile",
  },
  {
    id: "sm",
    w: 667,
    h: 375,
    breakpoint: 768,
    label: "Mobile SM h",
    hidden: true,
  },
  {
    id: "md",
    w: 768,
    h: 1024,
    breakpoint: 992,
    label: "Tablet",
  },
  {
    id: "lg",
    w: 1024,
    h: 768,
    breakpoint: 1280,
    label: "TabletH",
    hidden: true,
  },
  {
    id: "xl",
    w: 1366,
    h: 768,
    breakpoint: 1600,
    label: "Desktop",
    isMain: true,
  },
  {
    id: "2xl",
    w: 1920,
    h: 920,
    label: "Large desktop",
    breakpoint: null,
    // hidden: true,
  },
];
