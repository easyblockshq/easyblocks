import {
  parseFocusedRichTextPartConfigPath,
  ParseRichTextPartConfigPathResult,
} from "./parseRichTextPartConfigPath";

const testCases: Array<[string, ParseRichTextPartConfigPathResult]> = [
  ["0.elements.0.elements.0", { path: [0, 0, 0], range: null }],
  ["0.elements.0.elements.0.{0,5}", { path: [0, 0, 0], range: [0, 5] }],

  ["0.elements.0.elements.0.elements.0", { path: [0, 0, 0, 0], range: null }],
  [
    "0.elements.0.elements.0.elements.0.{1,3}",
    { path: [0, 0, 0, 0], range: [1, 3] },
  ],
];

test.each(testCases)(
  "parses $richTextPart config path %s",
  (path, expectedResult) => {
    expect(parseFocusedRichTextPartConfigPath(path)).toEqual(expectedResult);
  }
);

test("throws error on invalid $richTextPart config path", () => {
  expect(() => parseFocusedRichTextPartConfigPath("invalid path")).toThrowError(
    "Invalid $richTextPart config path"
  );
});
