import { Devices } from "@easyblocks/core";
import {
  CompilationContextType,
  getDevicesWidths,
  responsiveValueForceGet,
} from "@easyblocks/app-utils";
import { testCompilationContext } from "../../test-utils";
import { gridAuto } from "./Grid.auto";

const devices: Devices = [
  {
    id: "b1",
    w: 100,
    h: 100,
    breakpoint: 150,
  },
  {
    id: "b2",
    w: 200,
    h: 200,
    breakpoint: 250,
  },
  {
    id: "b3",
    w: 300,
    h: 300,
    breakpoint: 350,
  },
  {
    id: "b4",
    w: 400,
    h: 400,
    breakpoint: 450,
  },
  {
    id: "b5",
    w: 500,
    h: 500,
    breakpoint: null,
  },
];

const widths = getDevicesWidths(devices);

const compilationContext: CompilationContextType = {
  ...testCompilationContext,
  devices,
};

function numberOfItemsToken(numberOfItems: number) {
  return {
    ref: numberOfItems.toString(),
    value: numberOfItems.toString(),
  };
}

const NUMBER_OF_ITEMS_1 = numberOfItemsToken(1);
const NUMBER_OF_ITEMS_2 = numberOfItemsToken(2);
const NUMBER_OF_ITEMS_3 = numberOfItemsToken(3);
const NUMBER_OF_ITEMS_4 = numberOfItemsToken(4);
const NUMBER_OF_ITEMS_5 = numberOfItemsToken(5);
const NUMBER_OF_ITEMS_6 = numberOfItemsToken(6);

describe("grid auto", () => {
  const example: Record<string, any> = {
    Cards: [{}, {}, {}, {}],
    numberOfItems: NUMBER_OF_ITEMS_4,
    variant: "grid",
    shouldSliderItemsBeVisibleOnMargin: false,
    fractionalItemWidth: "1",
    edgeLeft: true,
    edgeRight: true,
    edgeLeftMargin: "100px",
    edgeRightMargin: "100px",
    escapeMargin: true,
    maxWidth: null,
  };

  describe("show items on margin", () => {
    test("keeps scalar when scalar", () => {
      expect(
        gridAuto(
          { ...example, shouldSliderItemsBeVisibleOnMargin: true },
          compilationContext,
          widths
        ).shouldSliderItemsBeVisibleOnMargin
      ).toEqual({
        $res: true,
        b1: true,
        b2: true,
        b3: true,
        b4: true,
        b5: true,
      });
      expect(
        gridAuto(
          { ...example, shouldSliderItemsBeVisibleOnMargin: false },
          compilationContext,
          widths
        ).shouldSliderItemsBeVisibleOnMargin
      ).toEqual({
        $res: true,
        b1: false,
        b2: false,
        b3: false,
        b4: false,
        b5: false,
      });
    });

    test("becomes true if not defined but only on xs breakpoint", () => {
      const devicesWithXS = [
        {
          id: "xs",
          w: 50,
          h: 50,
          breakpoint: 75,
        },
        ...devices,
      ];

      const compilationContextWithXS = {
        ...compilationContext,
        devices: devicesWithXS,
      };

      const widthsWithXS = getDevicesWidths(devicesWithXS);

      expect(
        gridAuto(
          {
            ...example,
            shouldSliderItemsBeVisibleOnMargin: { $res: true, b4: false },
          },
          compilationContextWithXS,
          widthsWithXS
        ).shouldSliderItemsBeVisibleOnMargin
      ).toEqual({
        $res: true,
        xs: true,
        b1: false,
        b2: false,
        b3: false,
        b4: false,
        b5: false,
      });

      expect(
        gridAuto(
          {
            ...example,
            shouldSliderItemsBeVisibleOnMargin: { $res: true, b4: true },
          },
          compilationContextWithXS,
          widthsWithXS
        ).shouldSliderItemsBeVisibleOnMargin
      ).toEqual({
        $res: true,
        xs: true,
        b1: true,
        b2: true,
        b3: true,
        b4: true,
        b5: true,
      });
    });
  });

  describe("number of items", () => {
    test("keeps scalar when scalar", () => {
      expect(
        gridAuto(
          { ...example, numberOfItems: NUMBER_OF_ITEMS_4 },
          compilationContext,
          widths
        ).numberOfItems
      ).toEqual({
        $res: true,
        b1: NUMBER_OF_ITEMS_4,
        b2: NUMBER_OF_ITEMS_4,
        b3: NUMBER_OF_ITEMS_4,
        b4: NUMBER_OF_ITEMS_4,
        b5: NUMBER_OF_ITEMS_4,
      });
      expect(
        gridAuto(
          { ...example, numberOfItems: NUMBER_OF_ITEMS_2 },
          compilationContext,
          widths
        ).numberOfItems
      ).toEqual({
        $res: true,
        b1: NUMBER_OF_ITEMS_2,
        b2: NUMBER_OF_ITEMS_2,
        b3: NUMBER_OF_ITEMS_2,
        b4: NUMBER_OF_ITEMS_2,
        b5: NUMBER_OF_ITEMS_2,
      });
    });

    test("1 is always 1", () => {
      expect(
        gridAuto(
          { ...example, numberOfItems: { $res: true, b4: NUMBER_OF_ITEMS_1 } },
          compilationContext,
          widths
        ).numberOfItems
      ).toEqual({
        $res: true,
        b1: NUMBER_OF_ITEMS_1,
        b2: NUMBER_OF_ITEMS_1,
        b3: NUMBER_OF_ITEMS_1,
        b4: NUMBER_OF_ITEMS_1,
        b5: NUMBER_OF_ITEMS_1,
      });
      expect(
        gridAuto(
          {
            ...example,
            numberOfItems: {
              $res: true,
              b1: NUMBER_OF_ITEMS_1,
              b4: NUMBER_OF_ITEMS_1,
            },
          },
          compilationContext,
          widths
        ).numberOfItems
      ).toEqual({
        $res: true,
        b1: NUMBER_OF_ITEMS_1,
        b2: NUMBER_OF_ITEMS_1,
        b3: NUMBER_OF_ITEMS_1,
        b4: NUMBER_OF_ITEMS_1,
        b5: NUMBER_OF_ITEMS_1,
      });
    });

    test("2 on desktop is 1 on mobile", () => {
      const result = gridAuto(
        { ...example, numberOfItems: { $res: true, b4: NUMBER_OF_ITEMS_2 } },
        compilationContext,
        widths
      ).numberOfItems;
      expect(responsiveValueForceGet(result, "b1")).toEqual(NUMBER_OF_ITEMS_1);
      expect(responsiveValueForceGet(result, "b4")).toEqual(NUMBER_OF_ITEMS_2);
      expect(responsiveValueForceGet(result, "b3")).toEqual(NUMBER_OF_ITEMS_2);
    });

    test("[grid - 4 single row] 4 on b4 is 2 on b2, and 2 on b1 (2 is min), never 3!", () => {
      const result = gridAuto(
        { ...example, numberOfItems: { $res: true, b4: NUMBER_OF_ITEMS_4 } },
        compilationContext,
        widths
      ).numberOfItems;

      expect(responsiveValueForceGet(result, "b1")).toEqual(NUMBER_OF_ITEMS_2);
      expect(responsiveValueForceGet(result, "b2")).toEqual(NUMBER_OF_ITEMS_2);

      expect([NUMBER_OF_ITEMS_2, NUMBER_OF_ITEMS_4]).toContainEqual(
        responsiveValueForceGet(result, "b3")
      );

      expect(responsiveValueForceGet(result, "b4")).toEqual(NUMBER_OF_ITEMS_4);
    });

    test("4 on b4 is 2 on b2, and 2 on b1 (2 is min) - for multiple rows", () => {
      const result = gridAuto(
        {
          ...example,
          numberOfItems: { $res: true, b4: NUMBER_OF_ITEMS_4 },
          Cards: [{}, {}, {}, {}, {}, {}, {}, {}],
        },
        compilationContext,
        widths
      ).numberOfItems;
      expect(responsiveValueForceGet(result, "b4")).toEqual(NUMBER_OF_ITEMS_4);
      expect(responsiveValueForceGet(result, "b2")).toEqual(NUMBER_OF_ITEMS_2);
      expect(responsiveValueForceGet(result, "b1")).toEqual(NUMBER_OF_ITEMS_2);
    });

    test("[grid - 3 in a single row] 3 on b4 is 1 on lowest, but never 2", () => {
      const result = gridAuto(
        {
          ...example,
          numberOfItems: { $res: true, b4: NUMBER_OF_ITEMS_3 },
          Cards: [{}, {}, {}],
        },
        compilationContext,
        widths
      ).numberOfItems;

      expect(responsiveValueForceGet(result, "b1")).toEqual(NUMBER_OF_ITEMS_1);

      expect([NUMBER_OF_ITEMS_1, NUMBER_OF_ITEMS_3]).toContainEqual(
        responsiveValueForceGet(result, "b2")
      );

      expect([NUMBER_OF_ITEMS_1, NUMBER_OF_ITEMS_3]).toContainEqual(
        responsiveValueForceGet(result, "b3")
      );

      expect(responsiveValueForceGet(result, "b4")).toEqual(NUMBER_OF_ITEMS_3);
    });

    test("3 on b4 is 1 on lowest, and somewhere in between it is 2", () => {
      const result = gridAuto(
        {
          ...example,
          numberOfItems: { $res: true, b4: NUMBER_OF_ITEMS_3 },
          Cards: [{}, {}, {}, {}, {}, {}],
        },
        compilationContext,
        widths
      ).numberOfItems;

      expect(responsiveValueForceGet(result, "b1")).toEqual(NUMBER_OF_ITEMS_1);
      expect([
        NUMBER_OF_ITEMS_1,
        NUMBER_OF_ITEMS_2,
        NUMBER_OF_ITEMS_3,
      ]).toContainEqual(responsiveValueForceGet(result, "b2"));

      expect([
        NUMBER_OF_ITEMS_1,
        NUMBER_OF_ITEMS_2,
        NUMBER_OF_ITEMS_3,
      ]).toContainEqual(responsiveValueForceGet(result, "b3"));

      expect([
        responsiveValueForceGet(result, "b2"),
        responsiveValueForceGet(result, "b3"),
      ]).toContainEqual(NUMBER_OF_ITEMS_2);

      expect(responsiveValueForceGet(result, "b4")).toEqual(NUMBER_OF_ITEMS_3);
    });

    /**
     * In general slider with n items (n >= 3) can't have n - 1 items. Examples:
     * 1. There's no auto slider with 2 items visible and 3 total.
     * 2. There's no auto slider with 3 items visible and 4 total.
     * 3. etc etc
     */
    test("[slider - 4 items] 4 on b4 is 2 on b2, and 1 on b1, never 3! Also, smallest breakpoint is 2", () => {
      const result = gridAuto(
        {
          ...example,
          variant: "slider",
          numberOfItems: { $res: true, b4: NUMBER_OF_ITEMS_4 },
        },
        compilationContext,
        widths
      ).numberOfItems;

      expect(responsiveValueForceGet(result, "b1")).toEqual(NUMBER_OF_ITEMS_2);
      expect(responsiveValueForceGet(result, "b2")).toEqual(NUMBER_OF_ITEMS_2);
      expect([NUMBER_OF_ITEMS_2, NUMBER_OF_ITEMS_4]).toContainEqual(
        responsiveValueForceGet(result, "b3")
      );

      expect(responsiveValueForceGet(result, "b4")).toEqual(NUMBER_OF_ITEMS_4);
    });

    // test.skip("[slider - 3 items] 3 on b4 is 1 on lowest, but never 2", () => {
    //   const result = gridAuto(
    //     {
    //       ...example,
    //       variant: "slider",
    //       numberOfItems: { $res: true, b4: NUMBER_OF_ITEMS_3 },
    //       Cards: [{}, {}, {}],
    //     },
    //     compilationContext,
    //     widths
    //   ).numberOfItems;
    //
    //   expect(responsiveValueGet(result, "b1", compilationContext.devices)).toBe(
    //     NUMBER_OF_ITEMS_1
    //   );
    //   expect(
    //     [NUMBER_OF_ITEMS_1, NUMBER_OF_ITEMS_3].includes(
    //       responsiveValueGet(result, "b2", compilationContext.devices)
    //     )
    //   ).toBe(true);
    //   expect(
    //     [NUMBER_OF_ITEMS_1, NUMBER_OF_ITEMS_3].includes(
    //       responsiveValueGet(result, "b3", compilationContext.devices)
    //     )
    //   ).toBe(true);
    //   expect(responsiveValueGet(result, "b4", compilationContext.devices)).toBe(
    //     NUMBER_OF_ITEMS_3
    //   );
    //
    //   expect(
    //     responsiveValueGet(result, "b3", compilationContext.devices) !== NUMBER_OF_ITEMS_2 &&
    //       responsiveValueGet(result, "b3", compilationContext.devices) !== NUMBER_OF_ITEMS_2
    //   ).toBe(true);
    // });
  });
});
