import { traceIdSchemaProp } from "./traceIdSchemaProp";

describe("traceIdSchemaProp", () => {
  it("Should return traceId schema prop", () => {
    const schema = traceIdSchemaProp();

    expect(schema).toEqual({
      prop: "traceId",
      type: "string",
      label: "Trace Id",
      group: "Analytics",
      normalize: expect.any(Function),
    });
  });
});
