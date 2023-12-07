import { isConfigPathRichTextPart } from "./isConfigPathRichTextPart";

test.each([
  [".elements.en.0.elements.0.elements.0", true],
  [".elements.en-US.0.elements.0.elements.1", true],
  [".elements.pl-.elements.0.elements.1", false],
  [".elements.en.0.elements.0.elements.0.{3,4}", true],
  [".elements.en-GB.0.elements.0.elements.0.{3,4}", true],
  [".elements.en-GB.0.elements.0.elements.0.", false],
  [".elements.en_GB.0.elements.0.elements.0", true],
])(
  "returns if given path is valid rich text part path",
  (configPath, expected) => {
    expect(isConfigPathRichTextPart(configPath)).toBe(expected);
  }
);
