import { SchemaProp } from "@easyblocks/core";

function traceClicksSchemaProp(): SchemaProp {
  return {
    prop: "traceClicks",
    type: "boolean",
    label: "Trace clicks",
    group: "Analytics",
    visible: (values) => {
      if (values.noAction) {
        return false;
      }

      if (Array.isArray(values.action)) {
        return true;
      }

      return false;
    },
  };
}

export { traceClicksSchemaProp };
