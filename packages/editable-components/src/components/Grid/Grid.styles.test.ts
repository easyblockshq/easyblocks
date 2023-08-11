import { testCompilationContext } from "../../test-utils";
import styles from "./Grid.styles";

const basicValues = {
  Cards: [
    { _template: "Card", itemSize: "1x1" },
    { _template: "Card", itemSize: "1x1" },
    { _template: "Card", itemSize: "2x1" },
  ],
  variant: "grid",
  numberOfItems: "4",
  fractionalItemWidth: "1.66",
  columnGap: "10px",
  rowGap: "20px",
  verticalAlign: "center",
  showSliderControls: true,
  shouldSliderItemsBeVisibleOnMargin: true,
  gridMainObjectAspectRatio: "1.5",
  LeftArrow: [{ _template: "Button" }],
  leftArrowPlacement: "center",
  leftArrowOffset: 0,
  RightArrow: [{ _template: "Button" }],
  rightArrowPlacement: "center",
  rightArrowOffset: 0,

  edgeLeft: true,
  edgeLeftMargin: "100px",
  edgeRight: true,
  edgeRightMargin: "200px",
  escapeMargin: false,
};

function runStyles(extraValues: any) {
  const device = testCompilationContext.devices.find(
    (device) => device.id === "b4"
  )!;

  return styles(
    { ...basicValues, ...extraValues },
    {
      $width: 1920,
      $widthAuto: false,
      compilationContext: testCompilationContext,
      device,
    }
  );
}
describe.each(["grid", "slider"])("Grid items parameters (%s)", (mode) => {
  test("margins not escaped", () => {
    const compiled = runStyles({ mode });
    const expectedCardWidth1x1 = (1920 - 200 - 100 - 10 * 3) / 4;
    const expectedCardWidth2x1 = expectedCardWidth1x1 * 2 + 10;

    expect(compiled.Cards.itemProps[0].$width).toBe(expectedCardWidth1x1);
    expect(compiled.Cards.itemProps[0].$widthAuto).toBe(false);

    expect(compiled.Cards.itemProps[1].$width).toBe(expectedCardWidth1x1);
    expect(compiled.Cards.itemProps[1].$widthAuto).toBe(false);

    expect(compiled.Cards.itemProps[2].$width).toBe(expectedCardWidth2x1);
    expect(compiled.Cards.itemProps[2].$widthAuto).toBe(false);
  });

  test("margins escaped", () => {
    const compiled = runStyles({ mode, escapeMargin: true });
    const expectedCardWidth1x1 = (1920 - 10 * 3) / 4;
    const expectedCardWidth2x1 = expectedCardWidth1x1 * 2 + 10;

    expect(compiled.Cards.itemProps[0].$width).toBe(expectedCardWidth1x1);
    expect(compiled.Cards.itemProps[0].$widthAuto).toBe(false);

    expect(compiled.Cards.itemProps[1].$width).toBe(expectedCardWidth1x1);
    expect(compiled.Cards.itemProps[1].$widthAuto).toBe(false);

    expect(compiled.Cards.itemProps[2].$width).toBe(expectedCardWidth2x1);
    expect(compiled.Cards.itemProps[2].$widthAuto).toBe(false);
  });
});
