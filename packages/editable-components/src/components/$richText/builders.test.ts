import { testCompilationContext } from "../../test-utils";
import { RichTextComponentConfig } from "./$richText";
import {
  RichTextBlockElementComponentConfig,
  RICH_TEXT_BLOCK_ELEMENT_TYPES,
} from "./$richTextBlockElement/$richTextBlockElement";
import { RichTextLineElementComponentConfig } from "./$richTextLineElement/$richTextLineElement";
import { RichTextPartComponentConfig } from "./$richTextPart/$richTextPart";
import {
  buildRichTextBlockElementComponentConfig,
  buildRichTextComponentConfig,
  buildRichTextLineElementComponentConfig,
  buildRichTextPartComponentConfig,
} from "./builders";

describe("$richTextPart", () => {
  test("builds", () => {
    expect(
      buildRichTextPartComponentConfig({
        color: {
          $res: true,
          xl: {
            ref: "black",
            value: "black",
          },
        },
        font: {
          $res: true,
          xl: {
            fontFamily: "sans-serif",
          },
        },
        value: "Lorem ipsum",
      })
    ).toEqual(
      expect.objectContaining<RichTextPartComponentConfig>({
        _id: expect.any(String),
        _template: "$richTextPart",
        color: {
          $res: true,
          xl: {
            ref: "black",
            value: "black",
          },
        },
        font: {
          $res: true,
          xl: {
            fontFamily: "sans-serif",
          },
        },
        value: "Lorem ipsum",
      })
    );
  });
});

describe("$richTextLineElement", () => {
  test("builds", () => {
    expect(
      buildRichTextLineElementComponentConfig({
        elements: [],
      })
    ).toEqual(
      expect.objectContaining<RichTextLineElementComponentConfig>({
        _id: expect.any(String),
        _template: "$richTextLineElement",
        elements: [],
      })
    );
  });
});

describe("$richTextBlockElement", () => {
  test.each(RICH_TEXT_BLOCK_ELEMENT_TYPES)(
    "builds block element of type %s",
    (type) => {
      expect(buildRichTextBlockElementComponentConfig(type, [])).toEqual(
        expect.objectContaining<RichTextBlockElementComponentConfig>({
          _id: expect.any(String),
          _template: "$richTextBlockElement",
          elements: [],
          type,
        })
      );
    }
  );
});

describe("$richText", () => {
  test("builds with defaults", () => {
    expect(
      buildRichTextComponentConfig({
        compilationContext: testCompilationContext,
        elements: [],
        mainColor: {
          $res: true,
          b4: {
            ref: "black",
            value: "black",
          },
        },
        mainFont: {
          $res: true,
          b4: {
            fontFamily: "sans-serif",
            fontSize: 16,
          },
        },
      })
    ).toEqual(
      expect.objectContaining<RichTextComponentConfig>({
        _id: expect.any(String),
        _template: "$richText",
        accessibilityRole: "div",
        elements: {
          [testCompilationContext.contextParams.locale]: [],
        },
        isListStyleAuto: true,
        mainColor: {
          $res: true,
          b4: {
            ref: "black",
            value: "black",
          },
        },
        mainFont: {
          $res: true,
          b4: {
            fontFamily: "sans-serif",
            fontSize: 16,
          },
        },
      })
    );
  });

  test.each(["h1"] as const)(
    "builds with accessibilityRole %s",
    (accessibilityRole) => {
      const richTextComponentConfig = buildRichTextComponentConfig({
        accessibilityRole,
        compilationContext: testCompilationContext,
        elements: [],
        mainColor: {
          $res: true,
          b4: {
            ref: "black",
            value: "black",
          },
        },
        mainFont: {
          $res: true,
          b4: {
            fontFamily: "sans-serif",
            fontSize: 16,
          },
        },
      });

      expect(richTextComponentConfig.accessibilityRole).toBe(accessibilityRole);
    }
  );

  test("builds with set isListStyleAuto property", () => {
    const richTextComponentConfig = buildRichTextComponentConfig({
      compilationContext: testCompilationContext,
      elements: [],
      isListStyleAuto: false,
      mainColor: {
        $res: true,
        b4: {
          ref: "black",
          value: "black",
        },
      },
      mainFont: {
        $res: true,
        b4: {
          fontFamily: "sans-serif",
          fontSize: 16,
        },
      },
    });

    expect(richTextComponentConfig.isListStyleAuto).toBe(false);
  });
});
