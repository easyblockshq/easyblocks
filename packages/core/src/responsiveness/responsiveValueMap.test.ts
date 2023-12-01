import { responsiveValueMap } from "./responsiveValueMap";

const numberMapper = (x: number) => x * 5;
const stringMapper = (x: string) => `${x}.${x}`;
const objectMapper = (x: object) => ({ ...x, b: 20 });

describe("responsiveValueMap", () => {
  test("works with scalars", () => {
    expect(responsiveValueMap(10, numberMapper)).toBe(50);
    expect(responsiveValueMap("x", stringMapper)).toBe("x.x");
    expect(responsiveValueMap({ a: 10 }, objectMapper)).toEqual({
      a: 10,
      b: 20,
    });
  });

  test("works with responsive values", () => {
    expect(
      responsiveValueMap({ $res: true as const, b1: 10, b4: 20 }, numberMapper)
    ).toEqual({ $res: true, b1: 50, b4: 100 });
    expect(
      responsiveValueMap(
        { $res: true as const, b2: "x", b4: "y" },
        stringMapper
      )
    ).toEqual({ $res: true, b2: "x.x", b4: "y.y" });
    expect(
      responsiveValueMap(
        { $res: true, b2: { a: 10 }, b4: { a: 20 } },
        objectMapper
      )
    ).toEqual({ $res: true, b2: { a: 10, b: 20 }, b4: { a: 20, b: 20 } });
    expect(
      responsiveValueMap({ $res: true, b2: { a: 10 }, b4: null }, objectMapper)
    ).toEqual({ $res: true, b2: { a: 10, b: 20 }, b4: { b: 20 } });
  });
});
