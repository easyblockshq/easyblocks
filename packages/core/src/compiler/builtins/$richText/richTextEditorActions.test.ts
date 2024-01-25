// import { uniqueId } from "@easyblocks/utils";
import { createEditor, Editor, Transforms } from "slate";
import { withReact } from "slate-react";
import {
  buildRichTextBlockElementComponentConfig,
  buildRichTextLineElementComponentConfig,
  buildRichTextPartComponentConfig,
} from "./builders";
import { updateSelection } from "./richTextEditorActions";
import { convertRichTextElementsToEditorValue } from "./utils/convertRichTextElementsToEditorValue";
import { withEasyblocks } from "./withEasyblocks";

describe("updateSelection", () => {
  it("updates color of selected part of text part", () => {
    const editorState = convertRichTextElementsToEditorValue([
      buildRichTextBlockElementComponentConfig("paragraph", [
        buildRichTextLineElementComponentConfig({
          elements: [
            buildRichTextPartComponentConfig({
              color: {
                $res: true,
                xl: "black",
              },
              font: {},
              value: "Lorem ipsum",
            }),
          ],
        }),
      ]),
    ]);

    const { editor } = setup(editorState, {
      anchor: {
        path: [0, 0, 0],
        offset: 0,
      },
      focus: {
        path: [0, 0, 0],
        offset: 5,
      },
    });

    const result = updateSelection(editor, "color", {
      $res: true,
      xl: "red",
    });

    expect(result?.elements).toEqual([
      configContaining("@easyblocks/rich-text-block-element", {
        type: "paragraph",
        elements: [
          configContaining("@easyblocks/rich-text-line-element", {
            elements: [
              configContaining("@easyblocks/rich-text-part", {
                value: "Lorem",
                color: {
                  $res: true,
                  xl: "red",
                },
              }),
              configContaining("@easyblocks/rich-text-part", {
                value: " ipsum",
                color: {
                  $res: true,
                  xl: "black",
                },
              }),
            ],
          }),
        ],
      }),
    ]);

    expect(result?.focusedRichTextParts).toEqual(["0.elements.0.elements.0"]);
  });

  it("updates font of selected part of text part", () => {
    const editorState = convertRichTextElementsToEditorValue([
      buildRichTextBlockElementComponentConfig("paragraph", [
        buildRichTextLineElementComponentConfig({
          elements: [
            buildRichTextPartComponentConfig({
              color: {
                $res: true,
                xl: "black",
              },
              font: {
                $res: true,
                xl: "Arial",
              },
              value: "Lorem ipsum",
            }),
          ],
        }),
      ]),
    ]);

    const { editor } = setup(editorState, {
      anchor: {
        path: [0, 0, 0],
        offset: 0,
      },
      focus: {
        path: [0, 0, 0],
        offset: 5,
      },
    });

    const result = updateSelection(editor, "font", {
      $res: true,
      xl: "Comic Sans",
    });

    expect(result?.elements).toEqual([
      configContaining("@easyblocks/rich-text-block-element", {
        type: "paragraph",
        elements: [
          configContaining("@easyblocks/rich-text-line-element", {
            elements: [
              configContaining("@easyblocks/rich-text-part", {
                value: "Lorem",
                font: {
                  $res: true,
                  xl: "Comic Sans",
                },
              }),
              configContaining("@easyblocks/rich-text-part", {
                value: " ipsum",
                font: {
                  $res: true,
                  xl: "Arial",
                },
              }),
            ],
          }),
        ],
      }),
    ]);

    expect(result?.focusedRichTextParts).toEqual(["0.elements.0.elements.0"]);
  });

  // describe("action", () => {
  //   it("wraps selected part of text with inline-wrapper element when setting action", () => {
  //     const editorState = convertRichTextElementsToEditorValue([
  //       buildRichTextBlockElementComponentConfig("paragraph", [
  //         buildRichTextLineElementComponentConfig({
  //           elements: [
  //             buildRichTextPartComponentConfig({
  //               color: {
  //                 $res: true,
  //                 xl: "black",
  //               },
  //               font: {},
  //               value: "Lorem ipsum",
  //             }),
  //           ],
  //         }),
  //       ]),
  //     ]);

  //     const { editor } = setup(editorState, {
  //       anchor: {
  //         path: [0, 0, 0],
  //         offset: 0,
  //       },
  //       focus: {
  //         path: [0, 0, 0],
  //         offset: 5,
  //       },
  //     });

  //     const result = updateSelection(
  //       editor,
  //       "action",
  //       { prop: "action", type: "component", accepts: ["action"] },
  //       [
  //         {
  //           _component: "$SomeAction",
  //         },
  //       ]
  //     );

  //     expect(result?.elements).toEqual([
  //       configContaining("@easyblocks/rich-text-block-element", {
  //         type: "paragraph",
  //         elements: [
  //           configContaining("@easyblocks/rich-text-line-element", {
  //             elements: [
  //               emptyTextPartConfig(),
  //               configContaining(
  //                 "@easyblocks/rich-text-inline-wrapper-element",
  //                 {
  //                   elements: [
  //                     configContaining("@easyblocks/rich-text-part", {
  //                       value: "Lorem",
  //                     }),
  //                   ],
  //                   action: [
  //                     {
  //                       _component: "$SomeAction",
  //                     },
  //                   ],
  //                   actionTextModifier: actionTextModifierConfig(),
  //                   textModifier: [],
  //                 }
  //               ),
  //               configContaining("@easyblocks/rich-text-part", {
  //                 value: " ipsum",
  //               }),
  //             ],
  //           }),
  //         ],
  //       }),
  //     ]);

  //     expect(result?.focusedRichTextParts).toEqual([
  //       "0.elements.0.elements.1.elements.0",
  //     ]);
  //   });

  //   it("splits selected text fragment of inline-wrapper when updating action", () => {
  //     const editorState = convertRichTextElementsToEditorValue([
  //       buildRichTextBlockElementComponentConfig("paragraph", [
  //         buildRichTextLineElementComponentConfig({
  //           elements: [
  //             buildRichTextPartComponentConfig({
  //               color: {
  //                 $res: true,
  //                 xl: "black",
  //               },
  //               font: {},
  //               value: "",
  //             }),
  //             buildRichTextInlineWrapperElementComponentConfig({
  //               elements: [
  //                 buildRichTextPartComponentConfig({
  //                   color: {
  //                     $res: true,
  //                     xl: "black",
  //                   },
  //                   font: {},
  //                   value: "Lorem ipsum",
  //                 }),
  //               ],
  //               action: [
  //                 {
  //                   _component: "$SomeAction",
  //                   _id: uniqueId(),
  //                 },
  //               ],
  //               actionTextModifier: [
  //                 {
  //                   _component: "$StandardActionStyles",
  //                 },
  //               ],
  //             }),
  //             buildRichTextPartComponentConfig({
  //               color: {
  //                 $res: true,
  //                 xl: "black",
  //               },
  //               font: {},
  //               value: "",
  //             }),
  //           ],
  //         }),
  //       ]),
  //     ]);

  //     const { editor } = setup(editorState, {
  //       anchor: {
  //         path: [0, 0, 1, 0],
  //         offset: 0,
  //       },
  //       focus: {
  //         path: [0, 0, 1, 0],
  //         offset: 5,
  //       },
  //     });

  //     const result = updateSelection(
  //       editor,
  //       "action",
  //       { prop: "action", type: "component", accepts: ["action"] },
  //       [
  //         {
  //           _component: "$SomeOtherAction",
  //           _id: uniqueId(),
  //         },
  //       ]
  //     );

  //     expect(result?.elements).toEqual([
  //       configContaining("@easyblocks/rich-text-block-element", {
  //         type: "paragraph",
  //         elements: [
  //           configContaining("@easyblocks/rich-text-line-element", {
  //             elements: [
  //               emptyTextPartConfig(),
  //               configContaining(
  //                 "@easyblocks/rich-text-inline-wrapper-element",
  //                 {
  //                   elements: [
  //                     configContaining("@easyblocks/rich-text-part", {
  //                       value: "Lorem",
  //                     }),
  //                   ],
  //                   action: [
  //                     expect.objectContaining({
  //                       _component: "$SomeOtherAction",
  //                     }),
  //                   ],
  //                   actionTextModifier: actionTextModifierConfig(),
  //                   textModifier: [],
  //                 }
  //               ),
  //               emptyTextPartConfig(),
  //               configContaining(
  //                 "@easyblocks/rich-text-inline-wrapper-element",
  //                 {
  //                   elements: [
  //                     configContaining("@easyblocks/rich-text-part", {
  //                       value: " ipsum",
  //                     }),
  //                   ],
  //                   action: [
  //                     expect.objectContaining({
  //                       _component: "$SomeAction",
  //                     }),
  //                   ],
  //                   actionTextModifier: actionTextModifierConfig(),
  //                   textModifier: [],
  //                 }
  //               ),
  //               emptyTextPartConfig(),
  //             ],
  //           }),
  //         ],
  //       }),
  //     ]);

  //     expect(result?.focusedRichTextParts).toEqual([
  //       "0.elements.0.elements.1.elements.0",
  //     ]);
  //   });

  //   it("updates action of inline-wrapper if selection is placed within wrapper and is collapsed", () => {
  //     const editorState = convertRichTextElementsToEditorValue([
  //       buildRichTextBlockElementComponentConfig("paragraph", [
  //         buildRichTextLineElementComponentConfig({
  //           elements: [
  //             buildRichTextInlineWrapperElementComponentConfig({
  //               elements: [
  //                 buildRichTextPartComponentConfig({
  //                   color: {
  //                     $res: true,
  //                     xl: "black",
  //                   },
  //                   font: {},
  //                   value: "Lorem ipsum",
  //                 }),
  //               ],
  //               action: [
  //                 {
  //                   _component: "$SomeAction",
  //                 },
  //               ],
  //               actionTextModifier: [
  //                 {
  //                   _component: "$StandardActionStyles",
  //                 },
  //               ],
  //             }),
  //           ],
  //         }),
  //       ]),
  //     ]);

  //     const { editor } = setup(editorState, {
  //       anchor: {
  //         path: [0, 0, 0, 0],
  //         offset: 5,
  //       },
  //       focus: {
  //         path: [0, 0, 0, 0],
  //         offset: 5,
  //       },
  //     });

  //     const result = updateSelection(
  //       editor,
  //       "action",
  //       { prop: "action", type: "component", accepts: ["action"] },
  //       [
  //         {
  //           _component: "$SomeOtherAction",
  //         },
  //       ]
  //     );

  //     expect(result?.elements).toEqual([
  //       configContaining("@easyblocks/rich-text-block-element", {
  //         type: "paragraph",
  //         elements: [
  //           configContaining("@easyblocks/rich-text-line-element", {
  //             elements: [
  //               emptyTextPartConfig(),
  //               configContaining(
  //                 "@easyblocks/rich-text-inline-wrapper-element",
  //                 {
  //                   elements: [
  //                     configContaining("@easyblocks/rich-text-part", {
  //                       value: "Lorem ipsum",
  //                     }),
  //                   ],
  //                   action: [
  //                     expect.objectContaining({
  //                       _component: "$SomeOtherAction",
  //                     }),
  //                   ],
  //                   actionTextModifier: actionTextModifierConfig(),
  //                   textModifier: [],
  //                 }
  //               ),
  //               emptyTextPartConfig(),
  //             ],
  //           }),
  //         ],
  //       }),
  //     ]);

  //     expect(result?.focusedRichTextParts).toEqual([
  //       "0.elements.0.elements.1.elements.0",
  //     ]);
  //   });

  //   it("doesn't remove action if the selection is placed within wrapper and is collapsed", () => {
  //     const editorState = convertRichTextElementsToEditorValue([
  //       buildRichTextBlockElementComponentConfig("paragraph", [
  //         buildRichTextLineElementComponentConfig({
  //           elements: [
  //             buildRichTextPartComponentConfig({
  //               color: {
  //                 $res: true,
  //                 xl: "black",
  //               },
  //               font: {},
  //               value: "Lorem ipsum",
  //             }),
  //           ],
  //         }),
  //       ]),
  //     ]);

  //     const { editor } = setup(editorState, {
  //       anchor: {
  //         path: [0, 0, 0],
  //         offset: 5,
  //       },
  //       focus: {
  //         path: [0, 0, 0],
  //         offset: 5,
  //       },
  //     });

  //     const result = updateSelection(
  //       editor,
  //       "action",
  //       { prop: "$action", type: "component", accepts: ["action"] },
  //       [
  //         {
  //           _component: "$SomeAction",
  //           _id: "xxx",
  //         },
  //       ]
  //     );

  //     expect(result).toBeUndefined();
  //   });

  //   it("unwraps selected text part from inline-wrapper element when removing action", () => {
  //     const editorState = convertRichTextElementsToEditorValue([
  //       buildRichTextBlockElementComponentConfig("paragraph", [
  //         buildRichTextLineElementComponentConfig({
  //           elements: [
  //             buildRichTextInlineWrapperElementComponentConfig({
  //               action: [
  //                 {
  //                   _component: "$SomeAction",
  //                   _id: "xxx",
  //                 },
  //               ],
  //               actionTextModifier: [
  //                 {
  //                   _component: "$StandardActionStyles",
  //                 },
  //               ],
  //               elements: [
  //                 buildRichTextPartComponentConfig({
  //                   color: {
  //                     $res: true,
  //                     xl: "black",
  //                   },
  //                   font: {},
  //                   value: "Lorem ipsum",
  //                 }),
  //               ],
  //             }),
  //           ],
  //         }),
  //       ]),
  //     ]);

  //     const { editor } = setup(editorState, {
  //       anchor: {
  //         path: [0, 0, 0, 0],
  //         offset: 3,
  //       },
  //       focus: {
  //         path: [0, 0, 0, 0],
  //         offset: 8,
  //       },
  //     });

  //     const result = updateSelection(
  //       editor,
  //       "action",
  //       { prop: "action", type: "component", accepts: ["action"] },
  //       []
  //     );

  //     expect(result?.elements).toEqual([
  //       configContaining("@easyblocks/rich-text-block-element", {
  //         type: "paragraph",
  //         elements: [
  //           configContaining("@easyblocks/rich-text-line-element", {
  //             elements: [
  //               emptyTextPartConfig(),
  //               configContaining(
  //                 "@easyblocks/rich-text-inline-wrapper-element",
  //                 {
  //                   elements: [
  //                     configContaining("@easyblocks/rich-text-part", {
  //                       value: "Lor",
  //                     }),
  //                   ],
  //                   action: [
  //                     {
  //                       _component: "$SomeAction",
  //                       _id: "xxx",
  //                     },
  //                   ],
  //                   actionTextModifier: actionTextModifierConfig(),
  //                   textModifier: [],
  //                 }
  //               ),
  //               configContaining("@easyblocks/rich-text-part", {
  //                 value: "em ip",
  //               }),
  //               configContaining(
  //                 "@easyblocks/rich-text-inline-wrapper-element",
  //                 {
  //                   elements: [
  //                     configContaining("@easyblocks/rich-text-part", {
  //                       value: "sum",
  //                     }),
  //                   ],
  //                   action: [
  //                     {
  //                       _component: "$SomeAction",
  //                       _id: "xxx",
  //                     },
  //                   ],
  //                   actionTextModifier: actionTextModifierConfig(),
  //                   textModifier: [],
  //                 }
  //               ),
  //               emptyTextPartConfig(),
  //             ],
  //           }),
  //         ],
  //       }),
  //     ]);

  //     expect(result?.focusedRichTextParts).toEqual(["0.elements.0.elements.2"]);
  //   });

  //   it("unwraps whole text from inline-wrapper element when removing action and selection is collapsed", () => {
  //     const editorState = convertRichTextElementsToEditorValue([
  //       buildRichTextBlockElementComponentConfig("paragraph", [
  //         buildRichTextLineElementComponentConfig({
  //           elements: [
  //             buildRichTextInlineWrapperElementComponentConfig({
  //               action: [
  //                 {
  //                   _component: "$SomeAction",
  //                   _id: "xxx",
  //                 },
  //               ],
  //               elements: [
  //                 buildRichTextPartComponentConfig({
  //                   color: {
  //                     $res: true,
  //                     xl: "black",
  //                   },
  //                   font: {},
  //                   value: "Lorem ipsum",
  //                 }),
  //               ],
  //             }),
  //           ],
  //         }),
  //       ]),
  //     ]);

  //     const { editor } = setup(editorState, {
  //       anchor: {
  //         path: [0, 0, 0, 0],
  //         offset: 3,
  //       },
  //       focus: {
  //         path: [0, 0, 0, 0],
  //         offset: 3,
  //       },
  //     });

  //     const result = updateSelection(
  //       editor,
  //       "action",
  //       { prop: "action", type: "component", accepts: ["action"] },
  //       []
  //     );

  //     expect(result?.elements).toEqual([
  //       configContaining("@easyblocks/rich-text-block-element", {
  //         type: "paragraph",
  //         elements: [
  //           configContaining("@easyblocks/rich-text-line-element", {
  //             elements: [
  //               configContaining("@easyblocks/rich-text-part", {
  //                 value: "Lorem ipsum",
  //               }),
  //             ],
  //           }),
  //         ],
  //       }),
  //     ]);

  //     expect(result?.focusedRichTextParts).toEqual(["0.elements.0.elements.0"]);
  //   });

  //   test("updates font of empty text nodes when updating text of inline wrapper", () => {
  //     const editorState = convertRichTextElementsToEditorValue([
  //       buildRichTextBlockElementComponentConfig("paragraph", [
  //         buildRichTextLineElementComponentConfig({
  //           elements: [
  //             buildRichTextPartComponentConfig({
  //               color: {
  //                 $res: true,
  //                 xl: "black",
  //               },
  //               font: {
  //                 $res: true,
  //                 xl: {
  //                   fontFamily: "fontFamily1",
  //                 },
  //               },
  //               value: "Lorem ",
  //             }),
  //             buildRichTextInlineWrapperElementComponentConfig({
  //               action: [
  //                 {
  //                   _component: "$SomeAction",
  //                   _id: "xxx",
  //                 },
  //               ],
  //               elements: [
  //                 buildRichTextPartComponentConfig({
  //                   color: {
  //                     $res: true,
  //                     xl: "black",
  //                   },
  //                   font: {
  //                     $res: true,
  //                     xl: {
  //                       fontFamily: "fontFamily2",
  //                     },
  //                   },
  //                   value: "ipsum",
  //                 }),
  //               ],
  //             }),
  //           ],
  //         }),
  //       ]),
  //     ]);

  //     const { editor } = setup(editorState, {
  //       anchor: {
  //         path: [0, 0, 0],
  //         offset: 0,
  //       },
  //       focus: {
  //         path: [0, 0, 1, 0],
  //         offset: 5,
  //       },
  //     });

  //     const result = updateSelection(
  //       editor,
  //       "font",
  //       { prop: "font", type: "font" },
  //       {
  //         $res: true,
  //         xl: {
  //           fontFamily: "fontFamily3",
  //         },
  //       }
  //     );

  //     expect(result?.elements).toEqual([
  //       configContaining("@easyblocks/rich-text-block-element", {
  //         type: "paragraph",
  //         elements: [
  //           configContaining("@easyblocks/rich-text-line-element", {
  //             elements: [
  //               configContaining("@easyblocks/rich-text-part", {
  //                 value: "Lorem ",
  //                 font: {
  //                   $res: true,
  //                   xl: {
  //                     fontFamily: "fontFamily3",
  //                   },
  //                 },
  //               }),
  //               configContaining(
  //                 "@easyblocks/rich-text-inline-wrapper-element",
  //                 {
  //                   elements: [
  //                     configContaining("@easyblocks/rich-text-part", {
  //                       value: "ipsum",
  //                       font: {
  //                         $res: true,
  //                         xl: {
  //                           fontFamily: "fontFamily3",
  //                         },
  //                       },
  //                     }),
  //                   ],
  //                 }
  //               ),
  //               configContaining("@easyblocks/rich-text-part", {
  //                 value: "",
  //                 font: {
  //                   $res: true,
  //                   xl: {
  //                     fontFamily: "fontFamily3",
  //                   },
  //                 },
  //               }),
  //             ],
  //           }),
  //         ],
  //       }),
  //     ]);
  //   });
  // });
});

function setup(
  editorState: Editor["children"],
  editorSelection: NonNullable<Editor["selection"]>
) {
  const editor = withEasyblocks(withReact(createEditor()));
  editor.children = editorState;
  Transforms.select(editor, editorSelection);

  return {
    editor: editor,
  };
}

function emptyTextPartConfig() {
  return configContaining("@easyblocks/rich-text-part", {
    value: "",
  });
}

function actionTextModifierConfig() {
  return [
    expect.objectContaining({
      _component: "$StandardActionStyles",
    }),
  ];
}

function configContaining(id: string, props: Record<string, unknown>) {
  return expect.objectContaining({
    _component: id,
    _id: expect.any(String),
    ...props,
  });
}
