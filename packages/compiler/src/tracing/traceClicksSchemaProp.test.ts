import { traceClicksSchemaProp } from "./traceClicksSchemaProp";

describe("traceClicksSchemaProp", () => {
  it("Should return traceClicks schema prop", () => {
    const schema = traceClicksSchemaProp();

    expect(schema).toEqual({
      prop: "traceClicks",
      type: "boolean",
      label: "Trace clicks",
      group: "Analytics",
      visible: expect.any(Function),
    });
  });
});
