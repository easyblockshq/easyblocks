import { SchemaProp } from "@easyblocks/core";

function traceImpressionsSchemaProp(): SchemaProp {
  return {
    prop: "traceImpressions",
    type: "boolean",
    label: "Trace Impressions",
    group: "Analytics",
  };
}

export { traceImpressionsSchemaProp };
