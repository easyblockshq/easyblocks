import { traceImpressionsSchemaProp } from "./traceImpressionsSchemaProp";

describe("traceImpressions", () => {
  it("Should return traceClicks schema prop", () => {
    const schema = traceImpressionsSchemaProp();

    expect(schema).toEqual({
      prop: "traceImpressions",
      type: "boolean",
      label: "Trace Impressions",
      group: "Analytics",
    });
  });
});
