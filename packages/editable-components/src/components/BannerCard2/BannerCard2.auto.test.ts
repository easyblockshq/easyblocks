import { ConfigComponent, Devices } from "@easyblocks/core";
import {
  CompilationContextType,
  getDevicesWidths,
} from "@easyblocks/core/_internals";
import { testCompilationContext } from "../../test-utils";
import { bannerCard2Auto } from "./BannerCard2.auto";

const devices: Devices = [
  {
    id: "b1",
    w: 250,
    h: 250,
    breakpoint: 500,
  },
  {
    id: "b2",
    w: 750,
    h: 750,
    breakpoint: 1000,
  },
  {
    id: "b3",
    w: 1250,
    h: 1250,
    breakpoint: 1500,
  },
  {
    id: "b4",
    w: 1750,
    h: 1750,
    breakpoint: 2000,
  },
  {
    id: "b5",
    w: 2250,
    h: 2250,
    breakpoint: null,
  },
];

const compilationContext: CompilationContextType = {
  ...testCompilationContext,
  devices,
};

const deviceWidths = getDevicesWidths(devices);

describe("BannerCard2 auto", () => {
  const example: ConfigComponent = {
    _template: "$BannerCard",
  };

  test("doesn't make any changes when value is defined", () => {
    expect(
      bannerCard2Auto(
        {
          _template: "$BannerCard",
          mode: {
            $res: true,
            b1: "left",
            b4: "left",
          },
        },
        compilationContext,
        deviceWidths
      ).mode
    ).toEqual({
      $res: true,
      b1: "left",
      b2: "left",
      b3: "left",
      b4: "left",
      b5: "left",
    });
  });

  test("doesn't make any changes when value is not defined but higher breakpoint is not left/right", () => {
    expect(
      bannerCard2Auto(
        {
          _template: "$BannerCard",
          mode: {
            $res: true,
            b4: "background",
          },
        },
        compilationContext,
        deviceWidths
      ).mode
    ).toEqual({
      $res: true,
      b1: "background",
      b2: "background",
      b3: "background",
      b4: "background",
      b5: "background",
    });
  });

  test("sets value to top for b1 when higher breakpoint is left/right", () => {
    expect(
      bannerCard2Auto(
        {
          _template: "$BannerCard",
          mode: {
            $res: true,
            b4: "left",
          },
        },
        compilationContext,
        deviceWidths
      ).mode
    ).toEqual({
      $res: true,
      b1: "top",
      b2: "top",
      b3: "left",
      b4: "left",
      b5: "left",
    });
  });
});
