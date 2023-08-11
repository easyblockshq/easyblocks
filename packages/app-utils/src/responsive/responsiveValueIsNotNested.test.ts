import { responsiveValueIsNotNested } from "./responsiveValueIsNotNested";

describe("isResponsiveValueNotNested", () => {
  test("true for scalar", () => {
    expect(responsiveValueIsNotNested(10)).toBe(true);
    expect(responsiveValueIsNotNested("abc")).toBe(true);
  });

  test("true for simple responsive", () => {
    expect(responsiveValueIsNotNested({ $res: true, b1: 50, b2: 60 })).toBe(
      true
    );
    expect(
      responsiveValueIsNotNested({ $res: true, b1: "abc", b5: "bbb" })
    ).toBe(true);
  });

  test("false for nested responsive", () => {
    expect(
      responsiveValueIsNotNested({
        $res: true,
        b1: 50,
        b2: { $res: true, b1: 50, b2: 60 },
      })
    ).toBe(false);
    expect(
      responsiveValueIsNotNested({
        $res: true,
        b1: { $res: true, b1: "abc", b5: "bbb" },
        b5: "bbb",
      })
    ).toBe(false);
  });
});
