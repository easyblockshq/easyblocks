import { EditorContextType } from "@easyblocks/app-utils";
import { uniqueId } from "@easyblocks/utils";
import { createEditor, Editor, Transforms } from "slate";
import { withReact } from "slate-react";
import {
  buildRichTextBlockElementComponentConfig,
  buildRichTextInlineWrapperElementComponentConfig,
  buildRichTextLineElementComponentConfig,
  buildRichTextParagraphBlockElementComponentConfig,
  buildRichTextPartComponentConfig,
} from "./builders";
import { updateSelection } from "./richTextEditorActions";
import { convertRichTextElementsToEditorValue } from "./utils/convertRichTextElementsToEditorValue";
import { withShopstory } from "./withShopstory";

const testEditorContext = {
  actions: {
    getTemplates() {
      return [
        {
          config: {
            _template: "$StandardActionStyles",
          },
          isDefaultTextModifier: true,
        },
      ];
    },
  },
} as unknown as EditorContextType;

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

    const result = updateSelection(
      editor,
      testEditorContext,
      "color",
      { prop: "color", type: "color" },
      {
        $res: true,
        xl: "red",
      }
    );

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

    const result = updateSelection(
      editor,
      testEditorContext,
      "font",
      { prop: "font", type: "font" },
      {
        $res: true,
        xl: "Comic Sans",
      }
    );

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

  describe("action", () => {
    it("wraps selected part of text with inline-wrapper element when setting action", () => {
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

      const result = updateSelection(
        editor,
        testEditorContext,
        "action",
        { prop: "action", type: "component", accepts: ["action"] },
        [
          {
            _template: "$SomeAction",
          },
        ]
      );

      expect(result?.elements).toEqual([
        configContaining("@easyblocks/rich-text-block-element", {
          type: "paragraph",
          elements: [
            configContaining("@easyblocks/rich-text-line-element", {
              elements: [
                emptyTextPartConfig(),
                configContaining(
                  "@easyblocks/rich-text-inline-wrapper-element",
                  {
                    elements: [
                      configContaining("@easyblocks/rich-text-part", {
                        value: "Lorem",
                      }),
                    ],
                    action: [
                      {
                        _template: "$SomeAction",
                      },
                    ],
                    actionTextModifier: actionTextModifierConfig(),
                    textModifier: [],
                  }
                ),
                configContaining("@easyblocks/rich-text-part", {
                  value: " ipsum",
                }),
              ],
            }),
          ],
        }),
      ]);

      expect(result?.focusedRichTextParts).toEqual([
        "0.elements.0.elements.1.elements.0",
      ]);
    });

    it("splits selected text fragment of inline-wrapper when updating action", () => {
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
                value: "",
              }),
              buildRichTextInlineWrapperElementComponentConfig({
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
                action: [
                  {
                    _template: "$SomeAction",
                    _id: uniqueId(),
                  },
                ],
                actionTextModifier: [
                  {
                    _template: "$StandardActionStyles",
                  },
                ],
              }),
              buildRichTextPartComponentConfig({
                color: {
                  $res: true,
                  xl: "black",
                },
                font: {},
                value: "",
              }),
            ],
          }),
        ]),
      ]);

      const { editor } = setup(editorState, {
        anchor: {
          path: [0, 0, 1, 0],
          offset: 0,
        },
        focus: {
          path: [0, 0, 1, 0],
          offset: 5,
        },
      });

      const result = updateSelection(
        editor,
        testEditorContext,
        "action",
        { prop: "action", type: "component", accepts: ["action"] },
        [
          {
            _template: "$SomeOtherAction",
            _id: uniqueId(),
          },
        ]
      );

      expect(result?.elements).toEqual([
        configContaining("@easyblocks/rich-text-block-element", {
          type: "paragraph",
          elements: [
            configContaining("@easyblocks/rich-text-line-element", {
              elements: [
                emptyTextPartConfig(),
                configContaining(
                  "@easyblocks/rich-text-inline-wrapper-element",
                  {
                    elements: [
                      configContaining("@easyblocks/rich-text-part", {
                        value: "Lorem",
                      }),
                    ],
                    action: [
                      expect.objectContaining({
                        _template: "$SomeOtherAction",
                      }),
                    ],
                    actionTextModifier: actionTextModifierConfig(),
                    textModifier: [],
                  }
                ),
                emptyTextPartConfig(),
                configContaining(
                  "@easyblocks/rich-text-inline-wrapper-element",
                  {
                    elements: [
                      configContaining("@easyblocks/rich-text-part", {
                        value: " ipsum",
                      }),
                    ],
                    action: [
                      expect.objectContaining({
                        _template: "$SomeAction",
                      }),
                    ],
                    actionTextModifier: actionTextModifierConfig(),
                    textModifier: [],
                  }
                ),
                emptyTextPartConfig(),
              ],
            }),
          ],
        }),
      ]);

      expect(result?.focusedRichTextParts).toEqual([
        "0.elements.0.elements.1.elements.0",
      ]);
    });

    it("updates action of inline-wrapper if selection is placed within wrapper and is collapsed", () => {
      const editorState = convertRichTextElementsToEditorValue([
        buildRichTextBlockElementComponentConfig("paragraph", [
          buildRichTextLineElementComponentConfig({
            elements: [
              buildRichTextInlineWrapperElementComponentConfig({
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
                action: [
                  {
                    _template: "$SomeAction",
                  },
                ],
                actionTextModifier: [
                  {
                    _template: "$StandardActionStyles",
                  },
                ],
              }),
            ],
          }),
        ]),
      ]);

      const { editor } = setup(editorState, {
        anchor: {
          path: [0, 0, 0, 0],
          offset: 5,
        },
        focus: {
          path: [0, 0, 0, 0],
          offset: 5,
        },
      });

      const result = updateSelection(
        editor,
        testEditorContext,
        "action",
        { prop: "action", type: "component", accepts: ["action"] },
        [
          {
            _template: "$SomeOtherAction",
          },
        ]
      );

      expect(result?.elements).toEqual([
        configContaining("@easyblocks/rich-text-block-element", {
          type: "paragraph",
          elements: [
            configContaining("@easyblocks/rich-text-line-element", {
              elements: [
                emptyTextPartConfig(),
                configContaining(
                  "@easyblocks/rich-text-inline-wrapper-element",
                  {
                    elements: [
                      configContaining("@easyblocks/rich-text-part", {
                        value: "Lorem ipsum",
                      }),
                    ],
                    action: [
                      expect.objectContaining({
                        _template: "$SomeOtherAction",
                      }),
                    ],
                    actionTextModifier: actionTextModifierConfig(),
                    textModifier: [],
                  }
                ),
                emptyTextPartConfig(),
              ],
            }),
          ],
        }),
      ]);

      expect(result?.focusedRichTextParts).toEqual([
        "0.elements.0.elements.1.elements.0",
      ]);
    });

    it("doesn't remove action if the selection is placed within wrapper and is collapsed", () => {
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
          offset: 5,
        },
        focus: {
          path: [0, 0, 0],
          offset: 5,
        },
      });

      const result = updateSelection(
        editor,
        testEditorContext,
        "action",
        { prop: "$action", type: "component", accepts: ["action"] },
        [
          {
            _template: "$SomeAction",
            _id: "xxx",
          },
        ]
      );

      expect(result).toBeUndefined();
    });

    it("unwraps selected text part from inline-wrapper element when removing action", () => {
      const editorState = convertRichTextElementsToEditorValue([
        buildRichTextBlockElementComponentConfig("paragraph", [
          buildRichTextLineElementComponentConfig({
            elements: [
              buildRichTextInlineWrapperElementComponentConfig({
                action: [
                  {
                    _template: "$SomeAction",
                    _id: "xxx",
                  },
                ],
                actionTextModifier: [
                  {
                    _template: "$StandardActionStyles",
                  },
                ],
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
            ],
          }),
        ]),
      ]);

      const { editor } = setup(editorState, {
        anchor: {
          path: [0, 0, 0, 0],
          offset: 3,
        },
        focus: {
          path: [0, 0, 0, 0],
          offset: 8,
        },
      });

      const result = updateSelection(
        editor,
        testEditorContext,
        "action",
        { prop: "action", type: "component", accepts: ["action"] },
        []
      );

      expect(result?.elements).toEqual([
        configContaining("@easyblocks/rich-text-block-element", {
          type: "paragraph",
          elements: [
            configContaining("@easyblocks/rich-text-line-element", {
              elements: [
                emptyTextPartConfig(),
                configContaining(
                  "@easyblocks/rich-text-inline-wrapper-element",
                  {
                    elements: [
                      configContaining("@easyblocks/rich-text-part", {
                        value: "Lor",
                      }),
                    ],
                    action: [
                      {
                        _template: "$SomeAction",
                        _id: "xxx",
                      },
                    ],
                    actionTextModifier: actionTextModifierConfig(),
                    textModifier: [],
                  }
                ),
                configContaining("@easyblocks/rich-text-part", {
                  value: "em ip",
                }),
                configContaining(
                  "@easyblocks/rich-text-inline-wrapper-element",
                  {
                    elements: [
                      configContaining("@easyblocks/rich-text-part", {
                        value: "sum",
                      }),
                    ],
                    action: [
                      {
                        _template: "$SomeAction",
                        _id: "xxx",
                      },
                    ],
                    actionTextModifier: actionTextModifierConfig(),
                    textModifier: [],
                  }
                ),
                emptyTextPartConfig(),
              ],
            }),
          ],
        }),
      ]);

      expect(result?.focusedRichTextParts).toEqual(["0.elements.0.elements.2"]);
    });

    it("unwraps whole text from inline-wrapper element when removing action and selection is collapsed", () => {
      const editorState = convertRichTextElementsToEditorValue([
        buildRichTextBlockElementComponentConfig("paragraph", [
          buildRichTextLineElementComponentConfig({
            elements: [
              buildRichTextInlineWrapperElementComponentConfig({
                action: [
                  {
                    _template: "$SomeAction",
                    _id: "xxx",
                  },
                ],
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
            ],
          }),
        ]),
      ]);

      const { editor } = setup(editorState, {
        anchor: {
          path: [0, 0, 0, 0],
          offset: 3,
        },
        focus: {
          path: [0, 0, 0, 0],
          offset: 3,
        },
      });

      const result = updateSelection(
        editor,
        testEditorContext,
        "action",
        { prop: "action", type: "component", accepts: ["action"] },
        []
      );

      expect(result?.elements).toEqual([
        configContaining("@easyblocks/rich-text-block-element", {
          type: "paragraph",
          elements: [
            configContaining("@easyblocks/rich-text-line-element", {
              elements: [
                configContaining("@easyblocks/rich-text-part", {
                  value: "Lorem ipsum",
                }),
              ],
            }),
          ],
        }),
      ]);

      expect(result?.focusedRichTextParts).toEqual(["0.elements.0.elements.0"]);
    });

    test("updates font of empty text nodes when updating text of inline wrapper", () => {
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
                  xl: {
                    fontFamily: "fontFamily1",
                  },
                },
                value: "Lorem ",
              }),
              buildRichTextInlineWrapperElementComponentConfig({
                action: [
                  {
                    _template: "$SomeAction",
                    _id: "xxx",
                  },
                ],
                elements: [
                  buildRichTextPartComponentConfig({
                    color: {
                      $res: true,
                      xl: "black",
                    },
                    font: {
                      $res: true,
                      xl: {
                        fontFamily: "fontFamily2",
                      },
                    },
                    value: "ipsum",
                  }),
                ],
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
          path: [0, 0, 1, 0],
          offset: 5,
        },
      });

      const result = updateSelection(
        editor,
        testEditorContext,
        "font",
        { prop: "font", type: "font" },
        {
          $res: true,
          xl: {
            fontFamily: "fontFamily3",
          },
        }
      );

      expect(result?.elements).toEqual([
        configContaining("@easyblocks/rich-text-block-element", {
          type: "paragraph",
          elements: [
            configContaining("@easyblocks/rich-text-line-element", {
              elements: [
                configContaining("@easyblocks/rich-text-part", {
                  value: "Lorem ",
                  font: {
                    $res: true,
                    xl: {
                      fontFamily: "fontFamily3",
                    },
                  },
                }),
                configContaining(
                  "@easyblocks/rich-text-inline-wrapper-element",
                  {
                    elements: [
                      configContaining("@easyblocks/rich-text-part", {
                        value: "ipsum",
                        font: {
                          $res: true,
                          xl: {
                            fontFamily: "fontFamily3",
                          },
                        },
                      }),
                    ],
                  }
                ),
                configContaining("@easyblocks/rich-text-part", {
                  value: "",
                  font: {
                    $res: true,
                    xl: {
                      fontFamily: "fontFamily3",
                    },
                  },
                }),
              ],
            }),
          ],
        }),
      ]);
    });
  });

  describe("text modifier", () => {
    it("wraps selected part of text with inline-wrapper element when setting text modifier", () => {
      const editorState = convertRichTextElementsToEditorValue([
        buildRichTextParagraphBlockElementComponentConfig({
          elements: [
            buildRichTextLineElementComponentConfig({
              elements: [
                buildRichTextPartComponentConfig({
                  color: {},
                  font: {},
                  value: "Lorem ipsum",
                }),
              ],
            }),
          ],
        }),
      ]);

      const { editor } = setup(editorState, {
        anchor: {
          path: [0, 0, 0],
          offset: 5,
        },
        focus: {
          path: [0, 0, 0],
          offset: 8,
        },
      });

      const result = updateSelection(
        editor,
        testEditorContext,
        "textModifier",
        {
          prop: "textModifier",
          type: "component",
          accepts: ["textModifier"],
        },
        [{ _template: "$TestTextModifier" }]
      );

      expect(result?.elements).toEqual([
        configContaining("@easyblocks/rich-text-block-element", {
          type: "paragraph",
          elements: [
            configContaining("@easyblocks/rich-text-line-element", {
              elements: [
                configContaining("@easyblocks/rich-text-part", {
                  value: "Lorem",
                }),
                configContaining(
                  "@easyblocks/rich-text-inline-wrapper-element",
                  {
                    elements: [
                      configContaining("@easyblocks/rich-text-part", {
                        value: " ip",
                      }),
                    ],
                    textModifier: [
                      {
                        _template: "$TestTextModifier",
                      },
                    ],
                    action: [],
                    actionTextModifier: [],
                  }
                ),
                configContaining("@easyblocks/rich-text-part", {
                  value: "sum",
                }),
              ],
            }),
          ],
        }),
      ]);

      expect(result?.focusedRichTextParts).toEqual([
        "0.elements.0.elements.1.elements.0",
      ]);
    });

    it("splits selected text fragment of inline-wrapper when updating action", () => {
      const editorState = convertRichTextElementsToEditorValue([
        buildRichTextBlockElementComponentConfig("paragraph", [
          buildRichTextLineElementComponentConfig({
            elements: [
              buildRichTextInlineWrapperElementComponentConfig({
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
                textModifier: [
                  {
                    _template: "$SomeTextModifier",
                  },
                ],
              }),
            ],
          }),
        ]),
      ]);

      const { editor } = setup(editorState, {
        anchor: {
          path: [0, 0, 0, 0],
          offset: 0,
        },
        focus: {
          path: [0, 0, 0, 0],
          offset: 5,
        },
      });

      const result = updateSelection(
        editor,
        testEditorContext,
        "textModifier",
        {
          prop: "textModifier",
          type: "component",
          accepts: ["textModifier"],
        },
        [
          {
            _template: "$SomeOtherTextModifier",
          },
        ]
      );

      expect(result?.elements).toEqual([
        configContaining("@easyblocks/rich-text-block-element", {
          type: "paragraph",
          elements: [
            configContaining("@easyblocks/rich-text-line-element", {
              elements: [
                emptyTextPartConfig(),
                configContaining(
                  "@easyblocks/rich-text-inline-wrapper-element",
                  {
                    elements: [
                      configContaining("@easyblocks/rich-text-part", {
                        value: "Lorem",
                      }),
                    ],
                    textModifier: [
                      {
                        _template: "$SomeOtherTextModifier",
                      },
                    ],
                    action: [],
                    actionTextModifier: [],
                  }
                ),
                emptyTextPartConfig(),
                configContaining(
                  "@easyblocks/rich-text-inline-wrapper-element",
                  {
                    elements: [
                      configContaining("@easyblocks/rich-text-part", {
                        value: " ipsum",
                      }),
                    ],
                    textModifier: [
                      {
                        _template: "$SomeTextModifier",
                      },
                    ],
                    action: [],
                    actionTextModifier: [],
                  }
                ),
                emptyTextPartConfig(),
              ],
            }),
          ],
        }),
      ]);

      expect(result?.focusedRichTextParts).toEqual([
        "0.elements.0.elements.1.elements.0",
      ]);
    });

    it("unwraps selected text part from inline-wrapper element when removing text modifier", () => {
      const editorState = convertRichTextElementsToEditorValue([
        buildRichTextParagraphBlockElementComponentConfig({
          elements: [
            buildRichTextLineElementComponentConfig({
              elements: [
                buildRichTextInlineWrapperElementComponentConfig({
                  textModifier: [
                    {
                      _template: "$TestTextModifier",
                      _id: expect.any(String),
                    },
                  ],
                  elements: [
                    buildRichTextPartComponentConfig({
                      color: {},
                      font: {},
                      value: "Lorem ipsum",
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ]);

      const { editor } = setup(editorState, {
        anchor: {
          path: [0, 0, 0, 0],
          offset: 5,
        },
        focus: {
          path: [0, 0, 0, 0],
          offset: 8,
        },
      });

      const result = updateSelection(
        editor,
        testEditorContext,
        "textModifier",
        {
          prop: "textModifier",
          type: "component",
          accepts: ["textModifier"],
        },
        []
      );

      expect(result?.elements).toEqual([
        configContaining("@easyblocks/rich-text-block-element", {
          type: "paragraph",
          elements: [
            configContaining("@easyblocks/rich-text-line-element", {
              elements: [
                emptyTextPartConfig(),
                configContaining(
                  "@easyblocks/rich-text-inline-wrapper-element",
                  {
                    elements: [
                      configContaining("@easyblocks/rich-text-part", {
                        value: "Lorem",
                      }),
                    ],
                    textModifier: [
                      {
                        _template: "$TestTextModifier",
                        _id: expect.any(String),
                      },
                    ],
                  }
                ),
                configContaining("@easyblocks/rich-text-part", {
                  value: " ip",
                }),
                configContaining(
                  "@easyblocks/rich-text-inline-wrapper-element",
                  {
                    elements: [
                      configContaining("@easyblocks/rich-text-part", {
                        value: "sum",
                      }),
                    ],
                    textModifier: [
                      {
                        _template: "$TestTextModifier",
                        _id: expect.any(String),
                      },
                    ],
                  }
                ),
                emptyTextPartConfig(),
              ],
            }),
          ],
        }),
      ]);

      expect(result?.focusedRichTextParts).toEqual(["0.elements.0.elements.2"]);
    });

    it("doesn't update text modifier if the selection is placed within wrapper and is collapsed", () => {
      const editorState = convertRichTextElementsToEditorValue([
        buildRichTextParagraphBlockElementComponentConfig({
          elements: [
            buildRichTextLineElementComponentConfig({
              elements: [
                buildRichTextInlineWrapperElementComponentConfig({
                  textModifier: [
                    {
                      _template: "$TestTextModifier",
                      _id: expect.any(String),
                    },
                  ],
                  elements: [
                    buildRichTextPartComponentConfig({
                      color: {},
                      font: {},
                      value: "Lorem ipsum",
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ]);

      const { editor } = setup(editorState, {
        anchor: {
          path: [0, 0, 0, 0],
          offset: 5,
        },
        focus: {
          path: [0, 0, 0, 0],
          offset: 5,
        },
      });

      const result = updateSelection(
        editor,
        testEditorContext,
        "textModifier",
        {
          prop: "textModifier",
          type: "component",
          accepts: ["textModifier"],
        },
        [
          {
            _template: "$SomeOtherTextModifier",
          },
        ]
      );

      expect(result).toBeUndefined();
    });

    it("doesn't remove text modifier if the selection is placed within wrapper and is collapsed", () => {
      const editorState = convertRichTextElementsToEditorValue([
        buildRichTextParagraphBlockElementComponentConfig({
          elements: [
            buildRichTextLineElementComponentConfig({
              elements: [
                buildRichTextInlineWrapperElementComponentConfig({
                  textModifier: [
                    {
                      _template: "$TestTextModifier",
                      _id: expect.any(String),
                    },
                  ],
                  elements: [
                    buildRichTextPartComponentConfig({
                      color: {},
                      font: {},
                      value: "Lorem ipsum",
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ]);

      const { editor } = setup(editorState, {
        anchor: {
          path: [0, 0, 0, 0],
          offset: 5,
        },
        focus: {
          path: [0, 0, 0, 0],
          offset: 5,
        },
      });

      const result = updateSelection(
        editor,
        testEditorContext,
        "textModifier",
        {
          prop: "textModifier",
          type: "component",
          accepts: ["textModifier"],
        },
        []
      );

      expect(result).toBeUndefined();
    });
  });
});

function setup(
  editorState: Editor["children"],
  editorSelection: NonNullable<Editor["selection"]>
) {
  const editor = withShopstory(withReact(createEditor()));
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
      _template: "$StandardActionStyles",
    }),
  ];
}

function configContaining(id: string, props: Record<string, unknown>) {
  return expect.objectContaining({
    _template: id,
    _id: expect.any(String),
    ...props,
  });
}
