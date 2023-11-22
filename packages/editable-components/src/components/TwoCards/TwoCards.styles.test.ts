import { testCompilationContext } from "../../test-utils";
import styles from "./TwoCards.styles";
import { TwoCardsCompiledValues } from "./TwoCards.types";

const basicValues: TwoCardsCompiledValues = {
  Card1: [{ _template: "$Card" }],
  Card2: [{ _template: "$Card" }],

  card1Width: "10",
  card1EscapeMargin: false,

  card2Width: "12",
  card2EscapeMargin: false,

  verticalLayout: "center",
  verticalOffset: "0",
  collapse: false,
  gap: "20px",
  verticalGap: "50px",
};

const basicParams = {
  edgeLeft: true,
  edgeLeftMargin: "100px",
  edgeRight: true,
  edgeRightMargin: "200px",
};

function runStyles(extraValues: any) {
  const device = testCompilationContext.devices.find(
    (device) => device.id === "b4"
  )!;

  return styles({
    values: { ...basicValues, ...extraValues },
    params: { ...basicParams, $width: 1920, $widthAuto: false },
    device: { ...device, w: 1920 },
  });
}
describe("TwoCards styles", () => {
  describe("not collapsed", () => {
    test("margins not escaped", () => {
      const compiled = runStyles({});

      expect(compiled.Card1.$width).toBeCloseTo(((1920 - 100 - 200) * 10) / 24);
      expect(compiled.Card1.$widthAuto).toBe(false);

      expect(compiled.Card2.$width).toBeCloseTo(((1920 - 100 - 200) * 12) / 24);
      expect(compiled.Card2.$widthAuto).toBe(false);
    });

    test("card 1 margin escaped", () => {
      const compiled = runStyles({ card1EscapeMargin: true });

      expect(compiled.Card1.$width).toBeCloseTo(
        ((1920 - 100 - 200) * 10) / 24 + 100
      );
      expect(compiled.Card1.$widthAuto).toBe(false);

      expect(compiled.Card2.$width).toBeCloseTo(((1920 - 100 - 200) * 12) / 24);
      expect(compiled.Card2.$widthAuto).toBe(false);
    });

    test("card 1 + card2 margin escaped", () => {
      const compiled = runStyles({
        card1EscapeMargin: true,
        card2EscapeMargin: true,
      });

      expect(compiled.Card1.$width).toBeCloseTo(
        ((1920 - 100 - 200) * 10) / 24 + 100
      );
      expect(compiled.Card1.$widthAuto).toBe(false);

      expect(compiled.Card2.$width).toBeCloseTo(
        ((1920 - 100 - 200) * 12) / 24 + 200
      );
      expect(compiled.Card2.$widthAuto).toBe(false);
    });

    test("sum of widths = 24, card 1 escaped", () => {
      const compiled = runStyles({
        card1Width: 10,
        card1EscapeMargin: true,
        card2Width: 14,
      });

      expect(compiled.Card1.$width).toBeCloseTo(
        ((1920 - 100 - 200 - 20) * 10) / 24 + 100
      );
      expect(compiled.Card1.$widthAuto).toBe(false);

      expect(compiled.Card2.$width).toBeCloseTo(
        ((1920 - 100 - 200 - 20) * 14) / 24
      );
      expect(compiled.Card2.$widthAuto).toBe(false);
    });

    test("collapse, margins not escaped", () => {
      const compiled = runStyles({ collapse: true });

      expect(compiled.Card1.$width).toBeCloseTo(((1920 - 100 - 200) * 10) / 24);
      expect(compiled.Card1.$widthAuto).toBe(false);

      expect(compiled.Card2.$width).toBeCloseTo(((1920 - 100 - 200) * 12) / 24);
      expect(compiled.Card2.$widthAuto).toBe(false);
    });

    test("collapse, margins escaped", () => {
      const compiled = runStyles({
        collapse: true,
        card1EscapeMargin: true,
        card2EscapeMargin: true,
      });

      expect(compiled.Card1.$width).toBeCloseTo(
        ((1920 - 100 - 200) * 10) / 24 + 100
      );
      expect(compiled.Card1.$widthAuto).toBe(false);

      expect(compiled.Card2.$width).toBeCloseTo(
        ((1920 - 100 - 200) * 12) / 24 + 200
      );
      expect(compiled.Card2.$widthAuto).toBe(false);
    });

    test("collapse, margins escaped, full width", () => {
      const compiled = runStyles({
        collapse: true,
        card1Width: 24,
        card1EscapeMargin: true,
        card2Width: 24,
        card2EscapeMargin: true,
      });

      expect(compiled.Card1.$width).toBeCloseTo(1920);
      expect(compiled.Card1.$widthAuto).toBe(false);

      expect(compiled.Card2.$width).toBeCloseTo(1920);
      expect(compiled.Card2.$widthAuto).toBe(false);
    });
  });
});
