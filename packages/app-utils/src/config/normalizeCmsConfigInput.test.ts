import {
  LocalisedConfigs,
  LocalisedContentPiece,
  LocalisedRawContent,
  RawContentFull,
  RawContentLocal,
  RawContentRemote,
} from "@easyblocks/core";
import { normalizeNonDocumentCmsInput } from "./normalizeCmsConfigInput";

describe("raw content", () => {
  it("returns unchanged localized raw content", () => {
    const testCmsInput1: LocalisedRawContent = {
      ["en-US"]: {
        content: {
          _template: "$Test",
        },
      },
      ["pl-PL"]: {
        content: {
          _template: "$Test",
        },
      },
    };

    const testCmsInput2: LocalisedRawContent = {
      ["en-US"]: {
        id: "1",
        hash: "x",
        content: {
          _template: "$Test",
        },
      },
      ["pl-PL"]: {
        id: "2",
        hash: "y",
        content: {
          _template: "$Test",
        },
      },
    };

    const testCmsInput3: LocalisedRawContent = {
      ["en-US"]: {
        id: "1",
        hash: "x",
      },
      ["pl-PL"]: {
        id: "2",
        hash: "y",
      },
    };

    expect(normalizeNonDocumentCmsInput(testCmsInput1)).toEqual(testCmsInput1);
    expect(normalizeNonDocumentCmsInput(testCmsInput2)).toEqual(testCmsInput2);
    expect(normalizeNonDocumentCmsInput(testCmsInput3)).toEqual(testCmsInput3);
  });
});

describe("deprecated content piece", () => {
  it("returns raw content", () => {
    const testCmsInput1: LocalisedContentPiece = {
      ["en-US"]: {
        config: {
          _template: "$Test",
        },
      },
      ["pl-PL"]: {
        config: {
          _template: "$Test",
        },
      },
    };

    const testCmsInput2: LocalisedContentPiece = {
      ["en-US"]: {
        id: "1",
        hash: "x",
        config: {
          _template: "$Test",
        },
      },
      ["pl-PL"]: {
        id: "2",
        hash: "y",
        config: {
          _template: "$Test",
        },
      },
    };

    const testCmsInput3: LocalisedContentPiece = {
      ["en-US"]: {
        id: "1",
        hash: "x",
      },
      ["pl-PL"]: {
        id: "2",
        hash: "y",
      },
    };

    expect(normalizeNonDocumentCmsInput(testCmsInput1)).toEqual<
      LocalisedRawContent<RawContentLocal>
    >({
      ["en-US"]: {
        content: {
          _template: "$Test",
        },
      },
      ["pl-PL"]: {
        content: {
          _template: "$Test",
        },
      },
    });

    expect(normalizeNonDocumentCmsInput(testCmsInput2)).toEqual<
      LocalisedRawContent<RawContentFull>
    >({
      ["en-US"]: {
        id: "1",
        hash: "x",
        content: {
          _template: "$Test",
        },
      },
      ["pl-PL"]: {
        id: "2",
        hash: "y",
        content: {
          _template: "$Test",
        },
      },
    });

    expect(normalizeNonDocumentCmsInput(testCmsInput3)).toEqual<
      LocalisedRawContent<RawContentRemote>
    >({
      ["en-US"]: {
        id: "1",
        hash: "x",
      },
      ["pl-PL"]: {
        id: "2",
        hash: "y",
      },
    });
  });
});

describe("deprecated configs", () => {
  it("returns raw content", () => {
    const testCmsInput: LocalisedConfigs = {
      ["en-US"]: {
        _id: "x",
        _template: "$Test",
      },
      ["pl-PL"]: {
        _id: "y",
        _template: "$Test",
      },
    };

    expect(normalizeNonDocumentCmsInput(testCmsInput)).toEqual<
      LocalisedRawContent<RawContentLocal>
    >({
      ["en-US"]: {
        content: {
          _id: "x",
          _template: "$Test",
        },
      },
      ["pl-PL"]: {
        content: {
          _id: "y",
          _template: "$Test",
        },
      },
    });
  });
});
