import { generateDefaultTraceId } from "./generateDefaultTraceId";

describe("generateDefaultTraceId", () => {
  it.each`
    template    | expectedId
    ${"Button"} | ${"Button"}
    ${"Grid"}   | ${"Grid"}
    ${"Text"}   | ${"Text"}
  `(
    "Given template=$template Should return id of the following structure of $expectedId-xxxxxxxx ",
    ({ template, expectedId }) => {
      const id = generateDefaultTraceId({ _template: template });
      expect(id).toMatch(new RegExp(`^${expectedId}-.{8}$`));
    }
  );
});
