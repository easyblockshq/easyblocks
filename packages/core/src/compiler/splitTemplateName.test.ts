import { splitTemplateName } from "./splitTemplateName";

describe("splitTemplateName", () => {
  test("works with no ref", () => {
    expect(splitTemplateName("MyCard")).toEqual({ name: "MyCard" });
    expect(splitTemplateName("$Grid")).toEqual({ name: "$Grid" });
  });

  test("works with non-local ref", () => {
    expect(splitTemplateName("MyCard$$$ref1")).toEqual({
      name: "MyCard",
      ref: "ref1",
      isRefLocal: false,
    });
    expect(splitTemplateName("$Grid$$$refblabla")).toEqual({
      name: "$Grid",
      ref: "refblabla",
      isRefLocal: false,
    });
  });

  test("works with local ref", () => {
    expect(splitTemplateName("MyCard$$$local.ref1")).toEqual({
      name: "MyCard",
      ref: "ref1",
      isRefLocal: true,
    });
    expect(splitTemplateName("$Grid$$$local.refblabla")).toEqual({
      name: "$Grid",
      ref: "refblabla",
      isRefLocal: true,
    });
  });
});
