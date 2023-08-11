import { ConfigComponent } from "@easyblocks/core";
import { uniqueId } from "@easyblocks/utils";

function generateDefaultTraceId(config: ConfigComponent) {
  return `${config._template}-${uniqueId().slice(0, 8)}`;
}

export { generateDefaultTraceId };
