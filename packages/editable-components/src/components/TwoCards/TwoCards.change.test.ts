import { twoCardsChange } from "./TwoCards.change";

describe("TwoCards change", () => {
  describe.each([
    [true, true],
    [true, false],
    [false, true],
    [false, false],
  ])(
    "changing widths for side-by-side, collapse defined: %p, widths defined: %p",
    (collapseDefined, widthsDefined) => {
      const closestDefinedValues = {
        card1Width: "12",
        card2Width: "7",
        collapse: false,
      };

      const values = {
        card1Width: widthsDefined ? closestDefinedValues.card1Width : undefined,
        card2Width: widthsDefined ? closestDefinedValues.card2Width : undefined,
        collapse: collapseDefined ? false : undefined,
      };

      test("decreasing card1Width doesn't change card2Width", () => {
        expect(
          twoCardsChange({
            fieldName: "card1Width",
            value: "10",
            closestDefinedValue: "10",
            values,
            closestDefinedValues,
          })
        ).toEqual({
          collapse: values.collapse,
          card1Width: "10",
          card2Width: "7",
        });
      });

      test("decreasing card2Width doesn't change card1Width", () => {
        expect(
          twoCardsChange({
            fieldName: "card2Width",
            value: "4",
            closestDefinedValue: "4",
            values,
            closestDefinedValues,
          })
        ).toEqual({
          collapse: values.collapse,
          card1Width: "12",
          card2Width: "4",
        });
      });

      test("increasing card1Width doesn't change card2Width when there is space", () => {
        expect(
          twoCardsChange({
            fieldName: "card1Width",
            value: "13",
            closestDefinedValue: "13",
            values,
            closestDefinedValues,
          })
        ).toEqual({
          collapse: values.collapse,
          card1Width: "13",
          card2Width: "7",
        });
      });

      test("increasing card1Width decreases card2Width when there is no space", () => {
        expect(
          twoCardsChange({
            fieldName: "card1Width",
            value: "20",
            closestDefinedValue: "20",
            values,
            closestDefinedValues,
          })
        ).toEqual({
          collapse: values.collapse,
          card1Width: "20",
          card2Width: "4",
        });
      });

      test("increasing card2Width doesn't change card1Width when there is space", () => {
        expect(
          twoCardsChange({
            fieldName: "card2Width",
            value: "8",
            closestDefinedValue: "8",
            values,
            closestDefinedValues,
          })
        ).toEqual({
          collapse: values.collapse,
          card1Width: "12",
          card2Width: "8",
        });
      });

      test("increasing card2Width decreases card2Width when there is no space", () => {
        expect(
          twoCardsChange({
            fieldName: "card2Width",
            value: "15",
            closestDefinedValue: "15",
            values,
            closestDefinedValues,
          })
        ).toEqual({
          collapse: values.collapse,
          card1Width: "9",
          card2Width: "15",
        });
      });

      test("resetting card2Width should reset card1Width", () => {
        expect(
          twoCardsChange({
            fieldName: "card2Width",
            value: undefined,
            closestDefinedValue: "15",
            values,
            closestDefinedValues,
          })
        ).toEqual({
          collapse: values.collapse,
          card1Width: undefined,
          card2Width: undefined,
        });
      });

      test("resetting card1Width should reset card2Width", () => {
        expect(
          twoCardsChange({
            fieldName: "card1Width",
            value: undefined,
            closestDefinedValue: "9",
            values,
            closestDefinedValues,
          })
        ).toEqual({
          collapse: values.collapse,
          card1Width: undefined,
          card2Width: undefined,
        });
      });
    }
  );

  describe.each([
    [true, true],
    [true, false],
    [false, true],
    [false, false],
  ])(
    "changing widths for collapsed, collapse defined: %p, widths defined: %p",
    (collapseDefined, widthsDefined) => {
      const closestDefinedValues = {
        card1Width: "12",
        card2Width: "7",
        collapse: true,
      };

      const values = {
        card1Width: widthsDefined ? closestDefinedValues.card1Width : undefined,
        card2Width: widthsDefined ? closestDefinedValues.card2Width : undefined,
        collapse: collapseDefined ? false : undefined,
      };

      test("decreasing card1Width doesn't change card2Width", () => {
        expect(
          twoCardsChange({
            fieldName: "card1Width",
            value: "10",
            closestDefinedValue: "10",
            values,
            closestDefinedValues,
          })
        ).toEqual({
          collapse: values.collapse,
          card1Width: "10",
          card2Width: "7",
        });
      });

      test("decreasing card2Width doesn't change card1Width", () => {
        expect(
          twoCardsChange({
            fieldName: "card2Width",
            value: "4",
            closestDefinedValue: "4",
            values,
            closestDefinedValues,
          })
        ).toEqual({
          collapse: values.collapse,
          card1Width: "12",
          card2Width: "4",
        });
      });

      test("increasing card1Width doesn't change card2Width when there is space", () => {
        expect(
          twoCardsChange({
            fieldName: "card1Width",
            value: "13",
            closestDefinedValue: "13",
            values,
            closestDefinedValues,
          })
        ).toEqual({
          collapse: values.collapse,
          card1Width: "13",
          card2Width: "7",
        });
      });

      test("increasing card1Width decreases card2Width when there is no space", () => {
        expect(
          twoCardsChange({
            fieldName: "card1Width",
            value: "20",
            closestDefinedValue: "20",
            values,
            closestDefinedValues,
          })
        ).toEqual({
          collapse: values.collapse,
          card1Width: "20",
          card2Width: "7",
        });
      });

      test("increasing card2Width doesn't change card1Width when there is space", () => {
        expect(
          twoCardsChange({
            fieldName: "card2Width",
            value: "8",
            closestDefinedValue: "8",
            values,
            closestDefinedValues,
          })
        ).toEqual({
          collapse: values.collapse,
          card1Width: "12",
          card2Width: "8",
        });
      });

      test("increasing card2Width decreases card2Width when there is no space", () => {
        expect(
          twoCardsChange({
            fieldName: "card2Width",
            value: "15",
            closestDefinedValue: "15",
            values,
            closestDefinedValues,
          })
        ).toEqual({
          collapse: values.collapse,
          card1Width: "12",
          card2Width: "15",
        });
      });

      test("resetting card2Width should reset card1Width", () => {
        expect(
          twoCardsChange({
            fieldName: "card2Width",
            value: undefined,
            closestDefinedValue: "12",
            values,
            closestDefinedValues,
          })
        ).toEqual({
          collapse: values.collapse,
          card1Width: undefined,
          card2Width: undefined,
        });
      });

      test("resetting card1Width should reset card2Width", () => {
        expect(
          twoCardsChange({
            fieldName: "card1Width",
            value: undefined,
            closestDefinedValue: "15",
            values,
            closestDefinedValues,
          })
        ).toEqual({
          collapse: values.collapse,
          card1Width: undefined,
          card2Width: undefined,
        });
      });
    }
  );

  describe("changing from collapsed to side-by-side", () => {
    test.each([
      [true, true, true],
      [true, true, false],
      [true, false, true],
      [true, false, false],
      [false, true, true],
      [false, true, false],
      [false, false, true],
      [false, false, false],
    ])(
      "should work, collapse before defined: %p, collapse after defined: %p, widths defined: %p",
      (collapseBeforeDefined, collapseAfterDefined, widthsDefined) => {
        const closestDefinedValues = {
          card1Width: "15",
          card2Width: "15",
          collapse: true,
        };

        const collapseBefore = collapseBeforeDefined ? true : undefined;
        const collapseAfter = collapseAfterDefined ? false : undefined;

        const values = {
          card1Width: widthsDefined
            ? closestDefinedValues.card1Width
            : undefined,
          card2Width: widthsDefined
            ? closestDefinedValues.card2Width
            : undefined,
          collapse: collapseBefore,
        };

        const result = twoCardsChange({
          fieldName: "collapse",
          value: collapseAfter,
          closestDefinedValue: false,
          values,
          closestDefinedValues: closestDefinedValues,
        });

        if (widthsDefined) {
          expect(result).toEqual({
            card1Width: "15",
            card2Width: "9",
            collapse: collapseAfter,
          });
        } else {
          expect(result).toEqual({
            collapse: collapseAfter,
          });
        }
      }
    );
  });
});
