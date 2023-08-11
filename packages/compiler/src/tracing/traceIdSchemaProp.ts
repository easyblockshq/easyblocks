import { StringSchemaProp } from "@easyblocks/core";

function traceIdSchemaProp(): StringSchemaProp {
  return {
    prop: "traceId",
    type: "string",
    label: "Trace Id",
    group: "Analytics",
    normalize: (x) => {
      if (x.trim() === "") {
        return null;
      }
      return x;
    },
  };
}

export { traceIdSchemaProp };
