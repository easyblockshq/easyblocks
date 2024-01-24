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

describe("@easyblocks/rich-text-part", () => {
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
        _template: "@easyblocks/rich-text-part",
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
        TextWrapper: [],
      })
    );
  });
});

describe("@easyblocks/rich-text-line-element", () => {
  test("builds", () => {
    expect(
      buildRichTextLineElementComponentConfig({
        elements: [],
      })
    ).toEqual(
      expect.objectContaining<RichTextLineElementComponentConfig>({
        _id: expect.any(String),
        _template: "@easyblocks/rich-text-line-element",
        elements: [],
      })
    );
  });
});

describe("@easyblocks/rich-text-block-element", () => {
  test.each(RICH_TEXT_BLOCK_ELEMENT_TYPES)(
    "builds block element of type %s",
    (type) => {
      expect(buildRichTextBlockElementComponentConfig(type, [])).toEqual(
        expect.objectContaining<RichTextBlockElementComponentConfig>({
          _id: expect.any(String),
          _template: "@easyblocks/rich-text-block-element",
          elements: [],
          type,
        })
      );
    }
  );
});

describe("@easyblocks/rich-text", () => {
  test("builds with defaults", () => {
    expect(
      buildRichTextComponentConfig({
        locale: "en",
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
        _template: "@easyblocks/rich-text",
        accessibilityRole: "div",
        elements: {
          en: [],
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
        locale: "en",
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
      locale: "en",
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
