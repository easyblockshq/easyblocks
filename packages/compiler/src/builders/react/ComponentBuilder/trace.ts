import {
  CompiledComponentConfigBase,
  EventSink,
  EventType,
} from "@easyblocks/core";

function trace(source: CompiledComponentConfigBase, sink: EventSink) {
  return function traceImpl(event: EventType) {
    const {
      tracing: { traceClicks, traceImpressions, traceId, type = "item" } = {},
    } = source;

    if (event === "click" && !traceClicks) {
      return;
    }

    if (event === "impression" && !traceImpressions) {
      return;
    }

    const isCustomComponent = !source._template.startsWith("$");

    sink({
      event,
      source: {
        traceId,
        type,
        props: isCustomComponent ? source.props : undefined,
        component: isCustomComponent ? source._template : undefined,
      },
    });
  };
}

export { trace };
