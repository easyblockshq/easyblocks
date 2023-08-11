import { isRawContentRemote } from "./checkers";
import { RawContentFull, RawContentLocal, RawContentRemote } from "./types";

describe("raw content remote", () => {
  const validRawContentRemoteItems: Array<RawContentRemote> = [
    {
      id: "1",
      hash: "2",
    },
    {
      id: "1",
      hash: "2",
      projectId: "3",
    },
    {
      id: "1",
      hash: "2",
      preview: {
        mode: "content",
        sectionsCount: 1,
      },
    },
    {
      id: "1",
      hash: "2",
      projectId: "3",
      preview: {
        mode: "content",
        sectionsCount: 1,
      },
    },
  ];

  test.each(validRawContentRemoteItems)(
    "is valid raw content remote",
    (rawContentRemote) => {
      expect(isRawContentRemote(rawContentRemote)).toBe(true);
    }
  );

  const invalidRawContentRemoteItems: Array<RawContentLocal | RawContentFull> =
    [
      {
        id: "1",
        hash: "2",
        content: {
          _template: "$RootSections",
        },
      },
      {
        id: "1",
        content: {
          _template: "$RootSections",
        },
      },
    ];

  test.each(invalidRawContentRemoteItems)(
    "is invalid raw content remote",
    (notRawContentRemote) => {
      expect(isRawContentRemote(notRawContentRemote)).toBe(false);
    }
  );
});
