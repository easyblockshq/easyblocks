import { RichTextBlockElementComponentConfig } from "../$richTextBlockElement/$richTextBlockElement";
import { convertEditorValueToRichTextElements } from "./convertEditorValueToRichTextElements";

test("converts paragraph element with single line of text", () => {
  const expectedRichTextElements: Array<RichTextBlockElementComponentConfig> = [
    {
      _id: "1",
      _component: "@easyblocks/rich-text-block-element",
      elements: [
        {
          _id: "1.1",
          _component: "@easyblocks/rich-text-line-element",
          elements: [
            {
              _id: "1.1.1",
              _component: "@easyblocks/rich-text-part",
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
                  ref: "body",
                  value: {
                    fontFamily: "sans-serif",
                  },
                },
              },
              value: "Lorem ipsum",
              TextWrapper: [],
            },
          ],
        },
      ],
      type: "paragraph",
    },
  ];

  expect(
    convertEditorValueToRichTextElements([
      {
        children: [
          {
            children: [
              {
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
                    ref: "body",
                    value: {
                      fontFamily: "sans-serif",
                    },
                  },
                },
                id: "1.1.1",
                text: "Lorem ipsum",
                TextWrapper: [],
              },
            ],
            id: "1.1",
            type: "text-line",
          },
        ],
        id: "1",
        type: "paragraph",
      },
    ])
  ).toEqual(expectedRichTextElements);
});
