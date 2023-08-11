import { testCompilationContext } from "../../test-utils";
import styles from "./BannerCard2.styles";
import { BannerCard2CompiledValues } from "./BannerCard2.types";

const basicBannerValues: BannerCard2CompiledValues = {
  cornerRadius: "0px",
  mode: "basic",
  sideModeWidth: "50%",
  backgroundModePosition: "top-left",
  backgroundModePaddingLeft: "100px",
  backgroundModePaddingRight: "100px",
  backgroundModePaddingTop: "100px",
  backgroundModePaddingBottom: "100px",
  backgroundModeEdgeMarginProtection: true,
  action: [],
  gridBaseLineHeight: "400px",
  edgeLeft: false,
  edgeRight: false,
  edgeLeftMargin: null,
  edgeRightMargin: null,
  Card1: [],
  Card2: [],
};

function runStyles(extraValues: any) {
  return styles(
    { ...basicBannerValues, ...extraValues },
    {
      $width: 1920,
      $widthAuto: false,
      compilationContext: testCompilationContext,
      device: {
        ...testCompilationContext.devices.find((device) => device.id === "b4")!,
        w: 1920,
      },
    }
  );
}

describe("Bannercard2 Cards parameters", () => {
  describe("in none mode", () => {
    test("no edge margins", () => {
      const compiled = runStyles({
        mode: "none",
      });

      expect(compiled.Card1).toMatchObject({
        $width: 1920,
        $widthAuto: false,
        edgeLeft: false,
        edgeLeftMargin: null,
        edgeRight: false,
        edgeRightMargin: null,
        edgeTop: false,
        edgeBottom: false,
        useExternalPaddingTop: false,
        useExternalPaddingBottom: false,
        useExternalPaddingLeft: false,
        useExternalPaddingRight: false,
      });
    });

    test("edge margins", () => {
      const compiled = runStyles({
        mode: "none",
        edgeLeft: true,
        edgeLeftMargin: "100px",
        edgeRight: true,
        edgeRightMargin: "200px",
      });

      expect(compiled.Card1).toMatchObject({
        $width: 1920,
        $widthAuto: false,
        edgeLeft: true,
        edgeLeftMargin: "100px",
        edgeRight: true,
        edgeRightMargin: "200px",
        edgeTop: false,
        edgeBottom: false,
        useExternalPaddingTop: false,
        useExternalPaddingBottom: false,
        useExternalPaddingLeft: false,
        useExternalPaddingRight: false,
      });
    });
  });

  describe("in background mode", () => {
    test("no edge margins", () => {
      const compiled = runStyles({
        mode: "background",
      });

      expect(compiled.Card1).toMatchObject({
        $width: 1920,
        $widthAuto: false,
        edgeLeft: true,
        edgeLeftMargin: null,
        edgeRight: true,
        edgeRightMargin: null,
        edgeTop: true,
        edgeBottom: true,
        useExternalPaddingTop: false,
        useExternalPaddingBottom: false,
        useExternalPaddingLeft: false,
        useExternalPaddingRight: false,
        hideBackground: true,
      });

      expect(compiled.Card2).toMatchObject({
        $width: 1920,
        $widthAuto: false,
        edgeLeft: false,
        edgeLeftMargin: null,
        edgeRight: false,
        edgeRightMargin: null,
        edgeTop: false,
        edgeBottom: false,
        useExternalPaddingTop: false,
        useExternalPaddingBottom: false,
        useExternalPaddingLeft: false,
        useExternalPaddingRight: false,
        hideContent: true,
      });
    });

    test("edge margins", () => {
      const compiled = runStyles({
        mode: "background",
        edgeLeft: true,
        edgeLeftMargin: "100px",
        edgeRight: true,
        edgeRightMargin: "200px",
      });

      expect(compiled.Card1).toMatchObject({
        $width: 1920,
        $widthAuto: false,
        edgeLeft: true,
        edgeLeftMargin: "100px",
        edgeRight: true,
        edgeRightMargin: "200px",
        edgeTop: true,
        edgeBottom: true,
        useExternalPaddingTop: false,
        useExternalPaddingBottom: false,
        useExternalPaddingLeft: false,
        useExternalPaddingRight: false,
        hideBackground: true,
      });

      expect(compiled.Card2).toMatchObject({
        $width: 1920,
        $widthAuto: false,
        edgeLeft: false,
        edgeLeftMargin: null,
        edgeRight: false,
        edgeRightMargin: null,
        edgeTop: false,
        edgeBottom: false,
        useExternalPaddingTop: false,
        useExternalPaddingBottom: false,
        useExternalPaddingLeft: false,
        useExternalPaddingRight: false,
        hideContent: true,
      });
    });
  });

  describe("in top / bottom mode", () => {
    test("no edge margins", () => {
      const compiled = runStyles({ mode: "top" });

      const result = {
        $width: 1920,
        $widthAuto: false,
        edgeLeft: false,
        edgeLeftMargin: null,
        edgeRight: false,
        edgeRightMargin: null,
        edgeTop: false,
        edgeBottom: false,
        useExternalPaddingTop: false,
        useExternalPaddingBottom: false,
        useExternalPaddingLeft: false,
        useExternalPaddingRight: false,
      };

      expect(compiled.Card1).toMatchObject({
        ...result,
        useExternalPaddingLeft: true,
        useExternalPaddingRight: true,
        edgeTop: true,
        edgeBottom: true,
        edgeLeft: true,
        edgeRight: true,
      });

      expect(compiled.Card2).toMatchObject(result);
    });

    test("edge margins", () => {
      const compiled = runStyles({
        mode: "bottom",
        edgeLeft: true,
        edgeLeftMargin: "100px",
        edgeRight: true,
        edgeRightMargin: "200px",
      });

      const result = {
        $width: 1920,
        $widthAuto: false,
        edgeLeft: true,
        edgeLeftMargin: "100px",
        edgeRight: true,
        edgeRightMargin: "200px",
        edgeTop: false,
        edgeBottom: false,
        useExternalPaddingTop: false,
        useExternalPaddingBottom: false,
        useExternalPaddingLeft: false,
        useExternalPaddingRight: false,
      };

      expect(compiled.Card1).toMatchObject({
        ...result,
        useExternalPaddingLeft: true,
        useExternalPaddingRight: true,
        edgeTop: true,
        edgeBottom: true,
        edgeLeft: true,
        edgeRight: true,
      });

      expect(compiled.Card2).toMatchObject(result);
    });
  });

  describe("in left / right mode", () => {
    test("no edge margins", () => {
      const compiled = runStyles({ mode: "left" });

      const card1Result = {
        $width: 1920 / 2,
        $widthAuto: false,
        edgeLeft: true,
        edgeLeftMargin: null,
        edgeRight: false,
        edgeRightMargin: null,
        edgeTop: true,
        edgeBottom: true,
        useExternalPaddingTop: true,
        useExternalPaddingBottom: true,
        useExternalPaddingLeft: false,
        useExternalPaddingRight: false,
      };

      expect(compiled.Card1).toMatchObject(card1Result);

      expect(compiled.Card2).toMatchObject({
        ...card1Result,
        edgeRight: true,
        edgeLeft: false,
      });
    });

    test("edge margins", () => {
      const compiled = runStyles({
        mode: "right",
        edgeLeft: true,
        edgeLeftMargin: "100px",
        edgeRight: true,
        edgeRightMargin: "200px",
      });

      const card1Result = {
        $width: 1920 / 2,
        $widthAuto: false,
        edgeLeft: true,
        edgeLeftMargin: "100px",
        edgeRight: true,
        edgeRightMargin: null,
        edgeTop: true,
        edgeBottom: true,
        useExternalPaddingTop: true,
        useExternalPaddingBottom: true,
        useExternalPaddingLeft: false,
        useExternalPaddingRight: false,
      };

      expect(compiled.Card1).toMatchObject(card1Result);

      expect(compiled.Card2).toMatchObject({
        ...card1Result,
        edgeLeftMargin: null,
        edgeRightMargin: "200px",
      });
    });

    test("irregular width", () => {
      const compiled = runStyles({ mode: "left", sideModeWidth: "40%" });
      expect(compiled.Card1.$width).toBe(1920 * 0.6);
      expect(compiled.Card2.$width).toBe(1920 * 0.4);
      expect(compiled.Card1.$widthAuto).toBe(false);
      expect(compiled.Card2.$widthAuto).toBe(false);
    });
  });

  describe("in background mode", () => {
    test("edge margin protection", () => {
      const compiled = runStyles({
        mode: "background-separate-stack",
        backgroundModePaddingLeft: "300px",
        backgroundModePaddingRight: "300px",
        backgroundModeEdgeMarginProtection: true,
        edgeLeft: true,
        edgeLeftMargin: "100px",
        edgeRight: true,
        edgeRightMargin: "200px",
      });

      expect(compiled.Card1).toMatchObject({
        $width: 1920 - 100 - 200,
        $widthAuto: true,
        edgeLeft: false,
        edgeLeftMargin: null,
        edgeRight: false,
        edgeRightMargin: null,
        useExternalPaddingTop: false,
        useExternalPaddingBottom: false,
        useExternalPaddingLeft: false,
        useExternalPaddingRight: false,
      });

      expect(compiled.Card2).toMatchObject({
        $width: 1920,
        $widthAuto: false,
        edgeLeft: true,
        edgeLeftMargin: "100px",
        edgeRight: true,
        edgeRightMargin: "200px",
        useExternalPaddingTop: false,
        useExternalPaddingBottom: false,
        useExternalPaddingLeft: false,
        useExternalPaddingRight: false,
      });
    });
    test("no edge margin protection", () => {
      const compiled = runStyles({
        mode: "background-separate-stack",
        backgroundModePaddingLeft: "300px",
        backgroundModePaddingRight: "400px",
        backgroundModeEdgeMarginProtection: false,
        edgeLeft: true,
        edgeLeftMargin: "100px",
        edgeRight: true,
        edgeRightMargin: "200px",
      });

      expect(compiled.Card1).toMatchObject({
        $width: 1920 - 300 - 400,
        $widthAuto: true,
        edgeLeft: false,
        edgeLeftMargin: null,
        edgeRight: false,
        edgeRightMargin: null,
        useExternalPaddingTop: false,
        useExternalPaddingBottom: false,
        useExternalPaddingLeft: false,
        useExternalPaddingRight: false,
      });

      expect(compiled.Card2).toMatchObject({
        $width: 1920,
        $widthAuto: false,
        edgeLeft: true,
        edgeLeftMargin: "100px",
        edgeRight: true,
        edgeRightMargin: "200px",
        useExternalPaddingTop: false,
        useExternalPaddingBottom: false,
        useExternalPaddingLeft: false,
        useExternalPaddingRight: false,
      });
    });
  });
});
