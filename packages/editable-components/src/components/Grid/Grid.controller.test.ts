import { DeviceRange } from "@easyblocks/core";
import { spacingToPx } from "@easyblocks/app-utils";
import { gridController } from "./Grid.controller";
import { GridCompiledValues } from "./Grid.types";

const basicStyles: GridCompiledValues = {
  edgeLeft: true,
  edgeRight: true,
  edgeLeftMargin: "100px",
  edgeRightMargin: "100px",

  variant: "grid",
  numberOfItems: "4",
  Cards: [],
  fractionalItemWidth: "1.5",
  rowGap: "10px",
  columnGap: "24px",
  verticalAlign: "top",
  showSliderControls: true,
  shouldSliderItemsBeVisibleOnMargin: true,
  gridMainObjectAspectRatio: "1:1",
  LeftArrow: [],
  leftArrowPlacement: "inside",
  leftArrowOffset: "0px",
  RightArrow: [],
  rightArrowPlacement: "inside",
  rightArrowOffset: "0px",
  maxWidth: null,
  escapeMargin: false,

  borderEnabled: false,
  borderColor: "black",
  borderTop: "1",
  borderBottom: "1",
  borderLeft: "1",
  borderRight: "1",
  borderInner: "1",

  paddingLeft: "0px",
  paddingRight: "0px",
  paddingTop: "0px",
  paddingBottom: "0px",
};

const device: DeviceRange = {
  id: "xl",
  w: 1920,
  h: 800,
  breakpoint: 1900,
};

describe("Grid controller", () => {
  describe("no max width", () => {
    test("escapeMargin = false", () => {
      const result = gridController(
        {
          ...basicStyles,
          escapeMargin: false,
          maxWidth: null,
        },
        1920,
        device
      );

      expect(result.cssAbsoluteLeftPosition).toBe("100px");
      expect(result.cssAbsoluteRightPosition).toBe("100px");

      expect(result.itemsVisible).toBe(4);
      expect(result.$widthItem).toBeCloseTo((1920 - 2 * 100 - 3 * 24) / 4);
      expect(result.$width).toBeCloseTo(1920 - 2 * 100);
    });

    test("escapeMargin = true", () => {
      const result = gridController(
        {
          ...basicStyles,
          escapeMargin: true,
          maxWidth: null,
        },
        1920,
        device
      );

      expect(result.cssAbsoluteLeftPosition).toBe("0px");
      expect(result.cssAbsoluteRightPosition).toBe("0px");
      expect(result.itemsVisible).toBe(4);
      expect(result.$widthItem).toBeCloseTo((1920 - 3 * 24) / 4);
      expect(result.$width).toBeCloseTo(1920);
    });
  });

  describe("max width", () => {
    test("escapeMargin = false, max width larger than container", () => {
      const result = gridController(
        {
          ...basicStyles,
          escapeMargin: false,
          maxWidth: 2000,
        },
        1920,
        device
      );

      /**
       * When we set max width then WITHIN A SINGLE RESOLUTION RANGE (like all resolutions in xl or lg) it can have max width applied or not
       */
      expect(spacingToPx(result.cssAbsoluteLeftPosition, 1920)).toBe(100);
      expect(spacingToPx(result.cssAbsoluteLeftPosition, 500)).toBe(100);
      expect(spacingToPx(result.cssAbsoluteLeftPosition, 3000)).toBe(
        (3000 - 2000) / 2
      );

      expect(spacingToPx(result.cssAbsoluteRightPosition, 1920)).toBe(100);
      expect(spacingToPx(result.cssAbsoluteRightPosition, 500)).toBe(100);
      expect(spacingToPx(result.cssAbsoluteRightPosition, 3000)).toBe(
        (3000 - 2000) / 2
      );

      expect(result.itemsVisible).toBe(4);
      expect(result.$widthItem).toBeCloseTo((1920 - 2 * 100 - 3 * 24) / 4);
      expect(result.$width).toBeCloseTo(1920 - 2 * 100);
    });

    test("escapeMargin = false, max width larger than container", () => {
      const result = gridController(
        {
          ...basicStyles,
          escapeMargin: false,
          maxWidth: 800,
        },
        1920,
        device
      );

      expect(spacingToPx(result.cssAbsoluteLeftPosition, 800)).toBe(100);
      expect(spacingToPx(result.cssAbsoluteLeftPosition, 3000)).toBe(
        (3000 - 800) / 2
      );

      expect(spacingToPx(result.cssAbsoluteRightPosition, 800)).toBe(100);
      expect(spacingToPx(result.cssAbsoluteRightPosition, 3000)).toBe(
        (3000 - 800) / 2
      );

      expect(result.itemsVisible).toBe(4);
      expect(result.$widthItem).toBeCloseTo((800 - 3 * 24) / 4);
      expect(result.$width).toBeCloseTo(800);
    });

    test("escapeMargin = true, max width larger than container", () => {
      const result = gridController(
        {
          ...basicStyles,
          escapeMargin: true,
          maxWidth: 2000,
        },
        1920,
        device
      );

      /**
       * When we set max width then WITHIN A SINGLE RESOLUTION RANGE (like all resolutions in xl or lg) it can have max width applied or not
       */
      expect(spacingToPx(result.cssAbsoluteLeftPosition, 1920)).toBe(0);
      expect(spacingToPx(result.cssAbsoluteLeftPosition, 500)).toBe(0);
      expect(spacingToPx(result.cssAbsoluteLeftPosition, 3000)).toBe(
        (3000 - 2000) / 2
      );

      expect(spacingToPx(result.cssAbsoluteRightPosition, 1920)).toBe(0);
      expect(spacingToPx(result.cssAbsoluteRightPosition, 500)).toBe(0);
      expect(spacingToPx(result.cssAbsoluteRightPosition, 3000)).toBe(
        (3000 - 2000) / 2
      );

      expect(result.itemsVisible).toBe(4);
      expect(result.$widthItem).toBeCloseTo((1920 - 3 * 24) / 4);
      expect(result.$width).toBeCloseTo(1920);
    });

    test("escapeMargin = true, max width larger than container", () => {
      const result = gridController(
        {
          ...basicStyles,
          escapeMargin: true,
          maxWidth: 800,
        },
        1920,
        device
      );

      expect(spacingToPx(result.cssAbsoluteLeftPosition, 500)).toBe(0);
      expect(spacingToPx(result.cssAbsoluteLeftPosition, 3000)).toBe(
        (3000 - 800) / 2
      );

      expect(spacingToPx(result.cssAbsoluteRightPosition, 500)).toBe(0);
      expect(spacingToPx(result.cssAbsoluteRightPosition, 3000)).toBe(
        (3000 - 800) / 2
      );

      expect(result.itemsVisible).toBe(4);
      expect(result.$widthItem).toBeCloseTo((800 - 3 * 24) / 4);
      expect(result.$width).toBeCloseTo(800);
    });
  });
});
