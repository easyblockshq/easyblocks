import { normalize } from "@easyblocks/compiler";
import { schemas } from "@easyblocks/editable-components";
import {
  buttonLabelSchemaProp,
  buttonOptionalIconSchemaProp,
} from "@easyblocks/app-utils";
import { changeComponentConfig } from "./changeComponentConfig";
import { EditorContextType } from "./EditorContext";
import { testEditorContext } from "./utils/tests";

const editorContext: EditorContextType = {
  ...testEditorContext,
  templates: {
    ...testEditorContext.templates,
    symbol: [
      {
        label: "Icon",
        config: {
          _template: "$icon",
          icon: {
            ref: "my-icon",
          },
          color: {
            $res: true,
            xl: {
              ref: "black",
              value: "black",
            },
          },
        },
      },
    ],
  },
  definitions: {
    components: [
      ...schemas,
      {
        id: "MyButton",
        tags: ["button"],
        schema: [
          buttonLabelSchemaProp,
          buttonOptionalIconSchemaProp,
          {
            prop: "selectProp",
            type: "select",
            options: ["one", "two", "three"],
          },
        ],
      },
      {
        id: "MyCard",
        tags: ["card"],
        schema: [
          {
            prop: "cardSelectProp",
            type: "select",
            options: ["one", "two", "three"],
          },
        ],
      },
    ],
    actions: [],
    links: [],
    textModifiers: [],
  },
};

const card1 = normalize(
  { _template: "MyCard", cardSelectProp: "one" },
  editorContext
);
const card2 = normalize(
  { _template: "MyCard", cardSelectProp: "two" },
  editorContext
);

const icon1 = normalize(
  {
    _template: "$icon",
    icon: { value: "plus" },
    color: { $res: true, b4: { value: "red" } },
  },
  editorContext
);
icon1.traceId = expect.any(String);

const icon2 = normalize(
  {
    _template: "$icon",
    icon: { value: "minus" },
    color: { $res: true, b4: { value: "green" } },
  },
  editorContext
);
icon2.traceId = expect.any(String);

const label1 = { id: "123", value: "label1" };
const label2 = { id: "456", value: "label2" };
const label3 = { id: "444", value: "label3" };
const label4 = { id: "555", value: "label4" };

const iconButton1 = normalize(
  {
    _template: "$IconButton",
    symbolSize: "40",
    buttonSize: "40",
    background: "circle",
    label: label1,
    symbol: [icon1],
  },
  editorContext
);
const iconButton2 = normalize(
  {
    _template: "$IconButton",
    symbolSize: "32",
    buttonSize: "32",
    background: "square",
    label: label2,
    symbol: [icon2],
  },
  editorContext
);

const MyButton1 = normalize(
  { _template: "MyButton", selectProp: "one", label: label3, symbol: [icon1] },
  editorContext
);
const MyButton2 = normalize(
  { _template: "MyButton", selectProp: "two", label: label4, symbol: [icon2] },
  editorContext
);

describe("changeComponentConfig", () => {
  describe("buttons", () => {
    test("changing to $IconButton preserves label and icon", () => {
      expect(
        changeComponentConfig(iconButton1, iconButton2, editorContext)
      ).toEqual({
        ...iconButton2,
        label: label1,
        symbol: [{ ...icon1 }],
      });
      expect(
        changeComponentConfig(iconButton2, iconButton1, editorContext)
      ).toEqual({
        ...iconButton1,
        label: label2,
        symbol: [{ ...icon2 }],
      });
      expect(
        changeComponentConfig(MyButton1, iconButton2, editorContext)
      ).toEqual({
        ...iconButton2,
        label: label3,
        symbol: [{ ...icon1 }],
      });
      expect(
        changeComponentConfig(MyButton2, iconButton1, editorContext)
      ).toEqual({
        ...iconButton1,
        label: label4,
        symbol: [{ ...icon2 }],
      });
    });

    test("changing to custom button preserves label and icon", () => {
      expect(
        changeComponentConfig(MyButton1, MyButton2, editorContext)
      ).toEqual({
        ...MyButton2,
        label: MyButton1.label,
        symbol: [{ ...MyButton1.symbol[0] }],
      });
      expect(
        changeComponentConfig(MyButton2, MyButton1, editorContext)
      ).toEqual({
        ...MyButton1,
        label: MyButton2.label,
        symbol: [{ ...MyButton2.symbol[0] }],
      });
      expect(
        changeComponentConfig(iconButton1, MyButton2, editorContext)
      ).toEqual({
        ...MyButton2,
        label: iconButton1.label,
        symbol: [{ ...iconButton1.symbol[0] }],
      });
      expect(
        changeComponentConfig(iconButton2, MyButton1, editorContext)
      ).toEqual({
        ...MyButton1,
        label: iconButton2.label,
        symbol: [{ ...iconButton2.symbol[0] }],
      });
    });

    test("changing to $IconButton sets default icon if component didn't have icon", () => {
      const result = changeComponentConfig(
        { ...MyButton1, symbol: [] },
        iconButton2,
        editorContext
      );
      expect(result).toMatchObject({
        ...iconButton2,
        label: label3,
        symbol: [expect.objectContaining({ _template: "$icon" })],
      });
    });
  });

  describe("other components", () => {
    test("is identity", () => {
      expect(changeComponentConfig(card1, card2, editorContext)).toEqual(card2);
      expect(changeComponentConfig(card2, card1, editorContext)).toEqual(card1);
    });
  });
});
