import { ComponentDefinitionShared } from "@easyblocks/core";
import { addTracingSchema } from "./addTracingSchema";

describe("addTracingSchema", () => {
  it("Should NOT add any tracing schema if definition tagged with 'notrace'", () => {
    const before = {
      id: "",
      tags: ["notrace"],
      schema: [],
    };

    const expected = {
      id: "",
      tags: ["notrace"],
      schema: [],
    };

    const after = addTracingSchema(before);

    expect(after).toEqual(expected);
  });

  it("Should NOT add any tracing schema if it already exist", () => {
    const before: ComponentDefinitionShared = {
      id: "",
      tags: ["item"],
      schema: [
        {
          prop: "traceId",
          type: "string",
        },
        {
          prop: "traceClicks",
          type: "boolean",
        },
        {
          prop: "traceImpressions",
          type: "boolean",
        },
      ],
    };

    const expected: ComponentDefinitionShared = {
      id: "",
      tags: ["item"],
      schema: [
        {
          prop: "traceId",
          type: "string",
        },
        {
          prop: "traceClicks",
          type: "boolean",
        },
        {
          prop: "traceImpressions",
          type: "boolean",
        },
      ],
    };

    const after = addTracingSchema(before);

    expect(after).toEqual(expected);
  });

  it("Should ADD traceId schema to definitions schemas", () => {
    const before: ComponentDefinitionShared = {
      id: "",
      tags: ["item"],
      schema: [
        {
          prop: "traceClicks",
          type: "boolean",
        },
        {
          prop: "traceImpressions",
          type: "boolean",
        },
      ],
    };

    const expected: ComponentDefinitionShared = {
      id: "",
      tags: ["item"],
      schema: [
        {
          prop: "traceClicks",
          type: "boolean",
        },
        {
          prop: "traceImpressions",
          type: "boolean",
        },
        {
          prop: "traceId",
          type: "string",
          label: "Trace Id",
          group: "Analytics",
          normalize: expect.anything(),
        },
      ],
    };

    const after = addTracingSchema(before);

    expect(after).toEqual(expected);
  });

  it("Should ADD traceClicks schema to definitions schemas", () => {
    const before: ComponentDefinitionShared = {
      id: "",
      tags: ["item"],
      schema: [
        {
          prop: "traceId",
          type: "string",
        },
        {
          prop: "traceImpressions",
          type: "boolean",
        },
      ],
    };

    const expected: ComponentDefinitionShared = {
      id: "",
      tags: ["item"],
      schema: [
        {
          prop: "traceId",
          type: "string",
        },
        {
          prop: "traceImpressions",
          type: "boolean",
        },
        {
          prop: "traceClicks",
          type: "boolean",
          label: "Trace clicks",
          group: "Analytics",
          visible: expect.any(Function),
        },
      ],
    };

    const after = addTracingSchema(before);

    expect(after).toEqual(expected);
  });

  it("Should ADD traceImpressions schema to definitions schemas", () => {
    const before: ComponentDefinitionShared = {
      id: "",
      tags: ["item"],
      schema: [
        {
          prop: "traceId",
          type: "string",
        },
        {
          prop: "traceClicks",
          type: "boolean",
        },
      ],
    };

    const expected: ComponentDefinitionShared = {
      id: "",
      tags: ["item"],
      schema: [
        {
          prop: "traceId",
          type: "string",
        },
        {
          prop: "traceClicks",
          type: "boolean",
        },
        {
          prop: "traceImpressions",
          type: "boolean",
          label: "Trace Impressions",
          group: "Analytics",
        },
      ],
    };

    const after = addTracingSchema(before);

    expect(after).toEqual(expected);
  });
});
