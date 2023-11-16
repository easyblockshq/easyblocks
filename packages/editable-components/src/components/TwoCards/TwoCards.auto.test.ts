import { Devices, TrulyResponsiveValue } from "@easyblocks/core";
import { responsiveValueForceGet } from "@easyblocks/app-utils";
import { testCompilationContext } from "../../test-utils";
import { twoCardsAuto } from "./TwoCards.auto";
import { TWO_CARDS_COL_NUM } from "./twoCardsConstants";

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
    isMain: true,
  },
  {
    id: "b5",
    w: 2250,
    h: 2250,
    breakpoint: null,
  },
];

const widths: TrulyResponsiveValue<number> = {
  $res: true,
  b1: 250,
  b2: 750,
  b3: 1250,
  b4: 1750,
  b5: 2250,
};

const runtimeContext = {
  ...testCompilationContext,
  devices,
};

function getBreakpointValues(result: any) {
  const b1 = parseInt(responsiveValueForceGet(result, "b1"));
  const b2 = parseInt(responsiveValueForceGet(result, "b2"));
  const b3 = parseInt(responsiveValueForceGet(result, "b3"));
  const b4 = parseInt(responsiveValueForceGet(result, "b4"));
  const b5 = parseInt(responsiveValueForceGet(result, "b5"));

  return { b1, b2, b3, b4, b5 };
}

describe("TwoCards auto", () => {
  const verticalOffset = {
    $res: true,
    b4: "0",
  };

  const verticalGap = {
    $res: true,
    b4: {
      ref: "0",
      value: 0,
    },
  };

  describe("`collapse` property", () => {
    const card1Width = {
      $res: true,
      b4: "7",
    };

    const card2Width = {
      $res: true,
      b4: "10",
    };
    test("is set to 'true' for lower resolutions when main breakpoint is 'false'", () => {
      const result = twoCardsAuto({
        values: {
          collapse: {
            $res: true,
            b4: false,
          },
          card1Width,
          card2Width,
          verticalOffset,
          verticalGap,
        },
        params: {},
        devices: devices,
      });

      expect(result.collapse).toEqual({
        $res: true,
        b1: true,
        b2: true,
        b3: false,
        b4: false,
        b5: false,
      });
    });

    test("is set to 'true' for lower resolutions when any higher breakpoint is 'false', even if even higher are 'false'", () => {
      const result = twoCardsAuto({
        values: {
          collapse: {
            $res: true,
            b2: false,
            b3: true,
          },
          card1Width,
          card2Width,
          verticalOffset,
          verticalGap,
        },
        params: {},
        devices,
      });

      expect(result.collapse).toEqual({
        $res: true,
        b1: true,
        b2: false,
        b3: true,
        b4: true,
        b5: true,
      });
    });

    test("is not changed when on higher breakpoints it's already `true`", () => {
      const result = twoCardsAuto({
        values: {
          collapse: {
            $res: true,
            b4: true,
          },
          card1Width,
          card2Width,
          verticalOffset,
          verticalGap,
        },
        params: {},
        devices,
      });

      expect(result.collapse).toEqual({
        $res: true,
        b1: true,
        b2: true,
        b3: true,
        b4: true,
        b5: true,
      });
    });
  });

  function widthForMain(num: number) {
    return {
      $res: true,
      b4: num.toString(),
    };
  }

  function widthForB2andB4(b2val: number, b4val: number) {
    return {
      $res: true,
      b2: b2val.toString(),
      b4: b4val.toString(),
    };
  }

  describe("widths", () => {
    describe("when section is collapsed in all breakpoints (rare but possible)", () => {
      const collapse = {
        $res: true,
        b4: true,
      };

      test("full widths are preserved", () => {
        const result = twoCardsAuto({
          values: {
            collapse,
            card1Width: widthForMain(TWO_CARDS_COL_NUM),
            card2Width: widthForMain(TWO_CARDS_COL_NUM),
            verticalOffset,
            verticalGap,
          },
          params: {},
          devices,
        });

        const colNum = TWO_CARDS_COL_NUM.toString();
        const expectedWidth = {
          $res: true,
          b1: colNum,
          b2: colNum,
          b3: colNum,
          b4: colNum,
          b5: colNum,
        };

        expect(result.card1Width).toEqual(expectedWidth);
        expect(result.card2Width).toEqual(expectedWidth);
      });

      test("widths are properly scaled down when 1 breakpoint is set", () => {
        const result = twoCardsAuto({
          values: {
            collapse,
            card1Width: widthForMain(10),
            card2Width: widthForMain(16),
            verticalOffset,
            verticalGap,
          },
          params: {},
          devices,
        });

        expect(result.card1Width.b5).toEqual("10");
        expect(result.card1Width.b4).toEqual("10");

        const card1 = getBreakpointValues(result.card1Width);
        expect(card1.b1).toEqual(TWO_CARDS_COL_NUM);
        expect(card1.b2).toBeGreaterThanOrEqual(13);
        expect(card1.b3).toBeGreaterThanOrEqual(11);
        expect(card1.b4).toEqual(10);
        expect(card1.b5).toEqual(10);

        const card2 = getBreakpointValues(result.card2Width);
        expect(card2.b1).toEqual(TWO_CARDS_COL_NUM);
        expect(card2.b2).toBeGreaterThanOrEqual(19);
        expect(card2.b3).toBeGreaterThanOrEqual(17);
        expect(card2.b4).toEqual(16);
        expect(card2.b5).toEqual(16);
      });

      test("widths are properly scaled down when 2 breakpoints are set and lower bigger or equal than higher", () => {
        const result = twoCardsAuto({
          values: {
            collapse,
            card1Width: widthForB2andB4(10, 10),
            card2Width: widthForB2andB4(17, 16),
            verticalOffset,
            verticalGap,
          },
          params: {},
          devices,
        });

        const card1 = getBreakpointValues(result.card1Width);
        expect(card1.b1).toEqual(TWO_CARDS_COL_NUM);
        expect(card1.b2).toEqual(10);
        expect(card1.b3).toEqual(10);
        expect(card1.b4).toEqual(10);
        expect(card1.b5).toEqual(10);

        const card2 = getBreakpointValues(result.card2Width);
        expect(card2.b1).toEqual(TWO_CARDS_COL_NUM);
        expect(card2.b2).toBe(17);
        expect(card2.b3 === 16 || card2.b3 === 17).toBe(true);
        expect(card2.b4).toEqual(16);
        expect(card2.b5).toEqual(16);
      });

      test("widths are properly scaled down when 2 breakpoints are set and higher breakpoint larger than lower (super rare)", () => {
        const result = twoCardsAuto({
          values: {
            collapse,
            card1Width: widthForB2andB4(10, 14),
            card2Width: widthForB2andB4(5, 10),
            verticalOffset,
            verticalGap,
          },
          params: {},
          devices,
        });

        const card1 = getBreakpointValues(result.card1Width);
        expect(card1.b1).toEqual(TWO_CARDS_COL_NUM);
        expect(card1.b2).toEqual(10);
        expect(card1.b3).toEqual(12); // linear!
        expect(card1.b4).toEqual(14);
        expect(card1.b5).toEqual(14);

        const card2 = getBreakpointValues(result.card2Width);
        expect(card2.b1).toEqual(TWO_CARDS_COL_NUM);
        expect(card2.b2).toEqual(5);
        expect(card2.b3).toEqual(8); // linear, rounding with Math.round
        expect(card2.b4).toEqual(10);
        expect(card2.b5).toEqual(10);
      });
    });

    describe("when section is uncollapsed in all breakpoints ", () => {
      const collapse = {
        $res: true,
        b1: false,
        b2: false,
        b3: false,
        b4: false,
      };

      describe("widths with 0 gap", () => {
        describe("for 1 defined breakpoint", () => {
          test("equal widths", () => {
            const result = twoCardsAuto({
              values: {
                collapse,
                card1Width: widthForMain(12),
                card2Width: widthForMain(12),
                verticalOffset,
                verticalGap,
              },
              params: {},
              devices,
            });

            const expectedWidth = {
              $res: true,
              b1: "12",
              b2: "12",
              b3: "12",
              b4: "12",
              b5: "12",
            };
            expect(result.card1Width).toEqual(expectedWidth);
            expect(result.card2Width).toEqual(expectedWidth);
          });

          test("unequal widths", () => {
            const result = twoCardsAuto({
              values: {
                collapse,
                card1Width: widthForMain(10),
                card2Width: widthForMain(14),
                verticalOffset,
                verticalGap,
              },
              params: {},
              devices,
            });

            expect(result.card1Width).toEqual({
              $res: true,
              b1: "10",
              b2: "10",
              b3: "10",
              b4: "10",
              b5: "10",
            });
            expect(result.card2Width).toEqual({
              $res: true,
              b1: "14",
              b2: "14",
              b3: "14",
              b4: "14",
              b5: "14",
            });
          });
        });

        describe("for 2 defined breakpoints", () => {
          test("works", () => {
            const result = twoCardsAuto({
              values: {
                collapse,
                card1Width: widthForB2andB4(10, 12),
                card2Width: widthForB2andB4(14, 10),
                verticalOffset,
                verticalGap,
              },
              params: {},
              devices,
            });
            const card1 = getBreakpointValues(result.card1Width);
            expect(card1.b1).toBeGreaterThanOrEqual(10);
            expect(card1.b2).toBeGreaterThanOrEqual(10);
            expect(card1.b3 === 10 || card1.b3 === 11 || card1.b3 === 12).toBe(
              true
            );
            expect(card1.b4).toEqual(12);
            expect(card1.b5).toEqual(12);

            const card2 = getBreakpointValues(result.card2Width);
            expect(card2.b1).toBeGreaterThanOrEqual(14);
            expect(card2.b2).toBeGreaterThanOrEqual(14);
            expect(card1.b3 >= 10 && card1.b3 <= 14).toBe(true);
            expect(card2.b4).toEqual(10);
            expect(card2.b5).toEqual(10);
          });
        });
      });

      describe("widths with non-0 gap", () => {
        describe("for 1 defined breakpoint", () => {
          test("6 and 8", () => {
            const result = twoCardsAuto({
              values: {
                collapse,
                card1Width: widthForMain(6),
                card2Width: widthForMain(8),
                verticalOffset,
                verticalGap,
              },
              params: {},
              devices,
            });

            const card1 = getBreakpointValues(result.card1Width);
            expect(card1.b1).toBeGreaterThanOrEqual(10);
            expect(card1.b2).toBeGreaterThanOrEqual(9);
            expect(card1.b3).toBeGreaterThanOrEqual(7);
            expect(card1.b4).toEqual(6);
            expect(card1.b5).toEqual(6);

            const card2 = getBreakpointValues(result.card2Width);
            expect(card2.b1).toBeGreaterThanOrEqual(11);
            expect(card2.b2).toBeGreaterThanOrEqual(10);
            expect(card2.b3).toBeGreaterThanOrEqual(9);
            expect(card2.b4).toEqual(8);
            expect(card2.b5).toEqual(8);
          });

          test("10 and 10", () => {
            const result = twoCardsAuto({
              values: {
                collapse,
                card1Width: widthForMain(10),
                card2Width: widthForMain(10),
                verticalOffset,
                verticalGap,
              },
              params: {},
              devices,
            });

            const card1 = getBreakpointValues(result.card1Width);
            expect(card1.b1).toBeGreaterThanOrEqual(11);
            expect(card1.b2).toBeGreaterThanOrEqual(11);
            expect(card1.b3).toBeGreaterThanOrEqual(10);
            expect(card1.b4).toEqual(10);
            expect(card1.b5).toEqual(10);

            const card2 = getBreakpointValues(result.card2Width);
            expect(card2.b1).toBeGreaterThanOrEqual(11);
            expect(card2.b2).toBeGreaterThanOrEqual(11);
            expect(card2.b3).toBeGreaterThanOrEqual(10);
            expect(card2.b4).toEqual(10);
            expect(card2.b5).toEqual(10);
          });

          test.each([
            [2, 2],
            [5, 5],
            [8, 8],
            [10, 10],
            [12, 12],
          ])(
            "equal widths (%p / %p) are never unequal by auto",
            (width1, width2) => {
              const result = twoCardsAuto({
                values: {
                  collapse,
                  card1Width: widthForMain(width1),
                  card2Width: widthForMain(width2),
                  verticalOffset,
                  verticalGap,
                },
                params: {},
                devices,
              });

              const card1 = getBreakpointValues(result.card1Width);
              const card2 = getBreakpointValues(result.card2Width);

              // we need to check equality of columns (they must always stay equal!)
              expect(card2.b1).toEqual(card1.b1);
              expect(card2.b2).toEqual(card1.b2);
              expect(card2.b3).toEqual(card1.b3);
              expect(card2.b4).toEqual(card1.b4);
              expect(card2.b5).toEqual(card1.b5);
            }
          );
        });

        describe("for 2 defined breakpoints", () => {
          test("lower width > higher width", () => {
            const result = twoCardsAuto({
              values: {
                collapse,
                card1Width: widthForB2andB4(8, 7),
                card2Width: widthForB2andB4(12, 2),
                verticalOffset,
                verticalGap,
              },
              params: {},
              devices,
            });

            const card1 = getBreakpointValues(result.card1Width);
            expect(card1.b1).toBeGreaterThanOrEqual(8);
            expect(card1.b2).toEqual(8);
            expect(card1.b3).toEqual(8);
            expect(card1.b4).toEqual(7);
            expect(card1.b5).toEqual(7);

            const card2 = getBreakpointValues(result.card2Width);
            expect(card2.b1).toBeGreaterThanOrEqual(12);
            expect(card2.b2).toEqual(12);
            expect(card2.b3).toEqual(7);
            expect(card2.b4).toEqual(2);
            expect(card2.b5).toEqual(2);
          });

          test("higher width > lower width", () => {
            const result = twoCardsAuto({
              values: {
                collapse,
                card1Width: widthForB2andB4(7, 8),
                card2Width: widthForB2andB4(2, 12),
                verticalOffset,
                verticalGap,
              },
              params: {},
              devices,
            });

            const card1 = getBreakpointValues(result.card1Width);
            expect(card1.b1).toBeGreaterThanOrEqual(7);
            expect(card1.b2).toEqual(7);
            expect(card1.b3).toEqual(8);
            expect(card1.b4).toEqual(8);
            expect(card1.b5).toEqual(8);

            const card2 = getBreakpointValues(result.card2Width);
            expect(card2.b1).toBeGreaterThanOrEqual(2);
            expect(card2.b2).toEqual(2);
            expect(card2.b3).toEqual(7);
            expect(card2.b4).toEqual(12);
            expect(card2.b5).toEqual(12);
          });

          test("zero gap", () => {
            const result = twoCardsAuto({
              values: {
                collapse,
                card1Width: widthForB2andB4(16, 13),
                card2Width: widthForB2andB4(8, 11),
                verticalOffset,
                verticalGap,
              },
              params: {},
              devices,
            });

            const card1 = getBreakpointValues(result.card1Width);
            expect(card1.b1).toBeGreaterThanOrEqual(16);
            expect(card1.b2).toEqual(16);
            expect(card1.b3).toEqual(14);
            expect(card1.b4).toEqual(13);
            expect(card1.b5).toEqual(13);

            const card2 = getBreakpointValues(result.card2Width);
            expect(card2.b1).toBeGreaterThanOrEqual(8);
            expect(card2.b2).toEqual(8);
            expect(card2.b3).toEqual(10);
            expect(card2.b4).toEqual(11);
            expect(card2.b5).toEqual(11);
          });

          test.each([
            [
              [6, 6],
              [2, 2],
            ],
            [
              [12, 12],
              [10, 10],
            ],
            [
              [11, 11],
              [3, 3],
            ],
            [
              [2, 2],
              [6, 6],
            ],
            [
              [10, 10],
              [12, 12],
            ],
            [
              [3, 3],
              [11, 11],
            ],
          ])(
            "equal widths (%p / %p) are never unequal by auto",
            ([lowerWidth1, lowerWidth2], [higherWidth1, higherWidth2]) => {
              const result = twoCardsAuto({
                values: {
                  collapse,
                  card1Width: widthForB2andB4(lowerWidth1, higherWidth1),
                  card2Width: widthForB2andB4(lowerWidth2, higherWidth2),
                  verticalOffset,
                  verticalGap,
                },
                params: {},
                devices,
              });

              const card1 = getBreakpointValues(result.card1Width);
              const card2 = getBreakpointValues(result.card2Width);

              // we need to check equality of columns (they must always stay equal!)
              expect(card2.b1).toEqual(card1.b1);
              expect(card2.b2).toEqual(card1.b2);
              expect(card2.b3).toEqual(card1.b3);
              expect(card2.b4).toEqual(card1.b4);
              expect(card2.b5).toEqual(card1.b5);
            }
          );
        });
      });
    });
  });

  describe("when section get collapsed on lower breakpoints", () => {
    const collapse = {
      $res: true,
      b4: false,
    };

    describe("for 1 breakpoint defined", () => {
      test("12, 12", () => {
        const result = twoCardsAuto({
          values: {
            collapse,
            card1Width: widthForMain(12),
            card2Width: widthForMain(12),
            verticalOffset,
            verticalGap,
          },
          params: {},
          devices,
        });

        const card1 = getBreakpointValues(result.card1Width);
        expect(card1.b1).toEqual(TWO_CARDS_COL_NUM);
        expect(card1.b2).toBeGreaterThanOrEqual(16); // must be significantly bigger than 12
        expect(card1.b3).toEqual(12);
        expect(card1.b4).toEqual(12);
        expect(card1.b5).toEqual(12);

        const card2 = getBreakpointValues(result.card2Width);
        expect(card2.b1).toEqual(TWO_CARDS_COL_NUM);
        expect(card2.b2).toBeGreaterThanOrEqual(16); // must be significantly bigger than 12
        expect(card2.b3).toEqual(12);
        expect(card2.b4).toEqual(12);
        expect(card2.b5).toEqual(12);
      });

      test("10, 7", () => {
        const result = twoCardsAuto({
          values: {
            collapse,
            card1Width: widthForMain(10),
            card2Width: widthForMain(7),
            verticalOffset,
            verticalGap,
          },
          params: {},
          devices,
        });

        const card1 = getBreakpointValues(result.card1Width);
        expect(card1.b1).toEqual(TWO_CARDS_COL_NUM);
        expect(card1.b2).toBeGreaterThanOrEqual(13); // must be significantly bigger than 10
        expect(card1.b3).toBeGreaterThanOrEqual(11);
        expect(card1.b4).toEqual(10);
        expect(card1.b5).toEqual(10);

        const card2 = getBreakpointValues(result.card2Width);
        expect(card2.b1).toEqual(TWO_CARDS_COL_NUM);
        expect(card2.b2).toBeGreaterThanOrEqual(12); // must be significantly bigger than 7
        expect(card2.b3).toBeGreaterThanOrEqual(8);
        expect(card2.b4).toEqual(7);
        expect(card2.b5).toEqual(7);
      });

      test.each([
        [2, 2],
        [5, 5],
        [8, 8],
        [10, 10],
        [12, 12],
      ])(
        "equal widths (%p / %p) are never unequal by auto",
        (width1, width2) => {
          const result = twoCardsAuto({
            values: {
              collapse,
              card1Width: widthForMain(width1),
              card2Width: widthForMain(width2),
              verticalOffset,
              verticalGap,
            },
            params: {},
            devices,
          });

          const card1 = getBreakpointValues(result.card1Width);
          const card2 = getBreakpointValues(result.card2Width);

          // we need to check equality of columns (they must always stay equal!)
          expect(card2.b1).toEqual(card1.b1);
          expect(card2.b2).toEqual(card1.b2);
          expect(card2.b3).toEqual(card1.b3);
          expect(card2.b4).toEqual(card1.b4);
          expect(card2.b5).toEqual(card1.b5);
        }
      );
    });
  });
});
