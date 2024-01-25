import { parsePath } from "./parsePath";

const form = {
  values: {
    _component: "$Root",
    cards: [
      {
        _component: "$Child0",
        nestedCards: [
          {
            _component: "$ChildNested0",
          },
          {
            _component: "$ChildNested1",
          },
        ],
      },
      {
        _component: "$Child1",
      },
      {
        _component: "$Child2",
      },
    ],
    card1: {
      _component: "$Child1",
      nestedCard: {
        _component: "$ChildNested0",
      },
    },
    card2: {
      _component: "$Child2",
    },
    localisedCards: {
      en: [
        {
          _component: "$EnglishCard1",
        },
        {
          _component: "$EnglishCard2",
        },
      ],
      pl: [
        {
          _component: "$PolishCard1",
        },
      ],
    },
    testRichText: {
      _component: "@easyblocks/rich-text",
      elements: {
        en: [
          {
            _component: "@easyblocks/rich-text-block-element",
            elements: [
              {
                _component: "@easyblocks/rich-text-line-element",
                elements: [
                  {
                    _component: "@easyblocks/rich-text-part",
                    value: "Lorem ipsum",
                  },
                ],
              },
            ],
          },
        ],
      },
    },
  },
};

describe("parsePath", () => {
  test("empty path works", () => {
    expect(parsePath("", form as any)).toEqual({
      templateId: "$Root",
    });
  });

  test("standard component paths work", () => {
    expect(parsePath("cards.0", form as any)).toEqual({
      templateId: "$Child0",
      index: 0,
      parent: {
        templateId: "$Root",
        fieldName: "cards",
        path: "",
      },
    });

    expect(parsePath("cards.0.nestedCards.0", form as any)).toEqual({
      templateId: "$ChildNested0",
      index: 0,
      parent: {
        templateId: "$Child0",
        fieldName: "nestedCards",
        path: "cards.0",
      },
    });

    expect(parsePath("cards.0.nestedCards.1", form as any)).toEqual({
      templateId: "$ChildNested1",
      index: 1,
      parent: {
        templateId: "$Child0",
        fieldName: "nestedCards",
        path: "cards.0",
      },
    });

    expect(parsePath("cards.1", form as any)).toEqual({
      templateId: "$Child1",
      index: 1,
      parent: {
        templateId: "$Root",
        fieldName: "cards",
        path: "",
      },
    });
  });

  test("standard field paths work", () => {
    expect(parsePath("cards.0.field", form as any)).toEqual({
      templateId: "$Child0",
      index: 0,
      fieldName: "field",
      parent: {
        templateId: "$Root",
        fieldName: "cards",
        path: "",
      },
    });

    expect(parsePath("cards.0.nestedCards.0.field", form as any)).toEqual({
      templateId: "$ChildNested0",
      index: 0,
      fieldName: "field",
      parent: {
        templateId: "$Child0",
        fieldName: "nestedCards",
        path: "cards.0",
      },
    });

    expect(parsePath("cards.0.nestedCards.1.field", form as any)).toEqual({
      templateId: "$ChildNested1",
      index: 1,
      fieldName: "field",
      parent: {
        templateId: "$Child0",
        fieldName: "nestedCards",
        path: "cards.0",
      },
    });

    expect(parsePath("cards.1.field", form as any)).toEqual({
      templateId: "$Child1",
      index: 1,
      fieldName: "field",
      parent: {
        templateId: "$Root",
        fieldName: "cards",
        path: "",
      },
    });
  });

  test("non-indexed nested paths work", () => {
    expect(parsePath("card1", form as any)).toEqual({
      templateId: "$Child1",
      index: undefined,
      parent: {
        templateId: "$Root",
        fieldName: "card1",
        path: "",
      },
    });

    expect(parsePath("card1.nestedCard", form as any)).toEqual({
      templateId: "$ChildNested0",
      index: undefined,
      parent: {
        templateId: "$Child1",
        fieldName: "nestedCard",
        path: "card1",
      },
    });
  });

  test("localised paths work", () => {
    expect(parsePath("localisedCards.en.0", form as any)).toEqual({
      templateId: "$EnglishCard1",
      index: 0,
      parent: {
        templateId: "$Root",
        fieldName: "localisedCards",
        path: "",
      },
    });

    expect(parsePath("localisedCards.en.1", form as any)).toEqual({
      templateId: "$EnglishCard2",
      index: 1,
      parent: {
        templateId: "$Root",
        fieldName: "localisedCards",
        path: "",
      },
    });

    expect(parsePath("localisedCards.pl.0", form as any)).toEqual({
      templateId: "$PolishCard1",
      index: 0,
      parent: {
        templateId: "$Root",
        fieldName: "localisedCards",
        path: "",
      },
    });
  });

  test("rich text part selection paths work", () => {
    expect(
      parsePath(
        "testRichText.elements.en.0.elements.0.elements.0.{0,6}",
        form as any
      )
    ).toEqual({
      templateId: "@easyblocks/rich-text-part",
      index: 0,
      parent: {
        templateId: "@easyblocks/rich-text-line-element",
        fieldName: "elements",
        path: "testRichText.elements.en.0.elements.0",
      },
    });
  });
});
