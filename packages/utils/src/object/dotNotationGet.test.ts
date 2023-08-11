import { dotNotationGet } from "./dotNotationGet";

describe("dotNotationGet", () => {
  test("outputs undefined for non-object items", () => {
    expect(dotNotationGet("aaa", "a.b.c")).toBe(undefined);
    expect(dotNotationGet(10, "a.b.c")).toBe(undefined);
  });

  const obj = {
    a: 1,
    b: 2,
    c: {
      a1: 10,
      b1: {
        a2: 100,
        b2: 200,
        c2: 300,
      },
      c1: 30,
    },
    d: [
      4,
      5,
      {
        a2: 6,
        b2: 7,
        c2: 8,
      },
    ],
  };

  test("empty string outputs object", () => {
    expect(dotNotationGet(obj, "")).toEqual(obj);
  });

  test("works with correct paths", () => {
    expect(dotNotationGet(obj, "a")).toBe(1);
    expect(dotNotationGet(obj, "b")).toBe(2);
    expect(dotNotationGet(obj, "c.a1")).toBe(10);
    expect(dotNotationGet(obj, "c.b1")).toEqual({ a2: 100, b2: 200, c2: 300 });
    expect(dotNotationGet(obj, "c.c1")).toBe(30);
    expect(dotNotationGet(obj, "c.b1.a2")).toBe(100);
    expect(dotNotationGet(obj, "c.b1.b2")).toBe(200);
    expect(dotNotationGet(obj, "c.b1.c2")).toBe(300);

    expect(dotNotationGet(obj, "d.0")).toBe(4);
    expect(dotNotationGet(obj, "d.1")).toBe(5);
    expect(dotNotationGet(obj, "d.2")).toEqual({
      a2: 6,
      b2: 7,
      c2: 8,
    });

    expect(dotNotationGet(obj, "d.2.a2")).toBe(6);
    expect(dotNotationGet(obj, "d.2.b2")).toBe(7);
    expect(dotNotationGet(obj, "d.2.c2")).toBe(8);
  });

  test("works with incorrect paths", () => {
    expect(dotNotationGet(obj, "a.x")).toBe(undefined);
    expect(dotNotationGet(obj, "e")).toBe(undefined);
    expect(dotNotationGet(obj, "d.x.y.z")).toBe(undefined);

    expect(dotNotationGet(obj, "c.a1.x")).toBe(undefined);
    expect(dotNotationGet(obj, "c.b1.x")).toEqual(undefined);
    expect(dotNotationGet(obj, "c.c1.x")).toBe(undefined);

    expect(dotNotationGet(obj, "d.4")).toBe(undefined);
    expect(dotNotationGet(obj, "d.x")).toBe(undefined);
    expect(dotNotationGet(obj, "d.1.1")).toBe(undefined);
  });
});
