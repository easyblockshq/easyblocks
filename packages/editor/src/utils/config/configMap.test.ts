import { NoCodeComponentEntry } from "@easyblocks/core";
import {
  CompilationContextType,
  createTestCompilationContext,
  // @ts-ignore
} from "@easyblocks/core/_internals";
import { configMap } from "./configMap";

function createCard(color: string) {
  return {
    _component: "Card",
    color: color,
    image: {
      $res: true,
      b4: {
        externalId: "unresolved card image id",
        widgetId: "image_widget",
      },
    },
  };
}

const whiteCard = createCard("#fff");
const redCard = createCard("red");
const blueCard = createCard("blue");

const testCompilationContext = createTestCompilationContext();

describe("configMap", () => {
  const config: NoCodeComponentEntry = {
    _id: "123",
    _component: "$Root",
    image: {
      $res: true,
      b4: {
        externalId: "unresolved id",
        widgetId: "image_widget",
      },
    },
    margin: {
      $res: true,
      b4: 24,
    },
    text: {
      value: "Lorem ipsum",
    },
    Card: [createCard("#fff")],
    LocalisedCards: {
      en: [redCard, blueCard],
      pl: [whiteCard],
    },
  };

  const compilationContext: CompilationContextType = {
    ...testCompilationContext,
    definitions: {
      components: [
        {
          id: "$Root",
          tags: ["section"],
          styles: null,
          schema: [
            {
              prop: "margin",
              type: "space",
            },
            {
              prop: "image",
              type: "image",
            },
            {
              prop: "text",
              type: "text",
            },
            {
              prop: "Card",
              type: "component",
              accepts: ["card"],
            },
            {
              prop: "LocalisedCards",
              type: "component-collection-localised",
              accepts: ["card"],
            },
          ],
        },
        {
          id: "Card",
          tags: ["card"],
          styles: null,
          schema: [
            {
              prop: "color",
              type: "color",
            },
            {
              prop: "image",
              type: "image",
            },
          ],
        },
      ],
      links: [],
      actions: [],
      textModifiers: [],
    },
  };

  test("properly maps", () => {
    const mappedConfig = configMap(
      config,
      compilationContext,
      ({ value, schemaProp, path }) => {
        if (schemaProp.type === "image") {
          return {
            id: value.externalId,
            value: value.externalId,
            path,
          };
        } else if (schemaProp.type === "text") {
          return {
            id: "blabla",
            value: value.value,
            path,
          };
        }

        return value;
      }
    );

    expect(mappedConfig).toEqual({
      _id: "123",
      _component: "$Root",
      image: {
        $res: true,
        b4: {
          id: "unresolved id",
          value: "unresolved id",
          path: "image.b4",
        },
      },
      margin: {
        $res: true,
        b4: 24,
      },
      text: {
        id: "blabla",
        value: "Lorem ipsum",
        path: "text",
      },
      Card: [
        {
          _component: "Card",
          color: "#fff",
          image: {
            $res: true,
            b4: {
              id: "unresolved card image id",
              value: "unresolved card image id",
              path: "Card.0.image.b4",
            },
          },
        },
      ],
      LocalisedCards: {
        en: [
          {
            _component: "Card",
            color: "red",
            image: {
              $res: true,
              b4: {
                id: "unresolved card image id",
                value: "unresolved card image id",
                path: "LocalisedCards.en.0.image.b4",
              },
            },
          },
          {
            _component: "Card",
            color: "blue",
            image: {
              $res: true,
              b4: {
                id: "unresolved card image id",
                value: "unresolved card image id",
                path: "LocalisedCards.en.1.image.b4",
              },
            },
          },
        ],
        pl: [
          {
            _component: "Card",
            color: "#fff",
            image: {
              $res: true,
              b4: {
                id: "unresolved card image id",
                value: "unresolved card image id",
                path: "LocalisedCards.pl.0.image.b4",
              },
            },
          },
        ],
      },
    });
  });

  test("properly maps component schema props", () => {
    const config: NoCodeComponentEntry = {
      _id: "123",
      _component: "$Root",
      image: {
        externalId: null,
        widgetId: "image_widget",
      },
      margin: {
        $res: true,
        b4: 24,
      },
      text: {
        id: "local.123",
        value: "Lorem ipsum",
      },
      Card: [createCard("#fff")],
      LocalisedCards: {
        en: [redCard, blueCard],
        pl: [whiteCard],
      },
    };

    const mappedConfig = configMap(
      config,
      compilationContext,
      ({ value, schemaProp, path }) => {
        if (schemaProp.type === "component-collection-localised") {
          return {
            plReversed: [...value.pl].reverse(),
            enReversed: [...value.en].reverse(),
          };
        }
        if (schemaProp.type === "color") {
          return "!" + value;
        }
        return value;
      }
    );

    expect(mappedConfig).toEqual({
      ...config,
      Card: [{ ...whiteCard, color: "!#fff" }],
      LocalisedCards: {
        enReversed: [
          { ...blueCard, color: "!blue" },
          { ...blueCard, color: "!red" },
        ],
        plReversed: [{ ...whiteCard, color: "!#fff" }],
      },
    });
  });

  test("creates new instance of component objects", () => {
    const mappedConfig = configMap(config, compilationContext, ({ value }) => {
      return value;
    });

    expect(mappedConfig).not.toBe(config);
    expect(mappedConfig.Card === config.Card).toBe(false);
    expect(mappedConfig.Card[0] === config.Card[0]).toBe(false);
  });

  test("undefined subcomponents don't crash the function, undefined is preserved", () => {
    const mappedConfig = configMap(
      { ...config, Card: undefined },
      compilationContext,
      ({ value }) => {
        return value;
      }
    );

    expect(mappedConfig.Card).toEqual(undefined);
  });

  test("don't throw when mapping through locales of component-collection-localised containing fallback", () => {
    const testCaseComponentConfig = { ...compilationContext };
    testCaseComponentConfig.contextParams.locale = "pl";

    const testCaseConfig = { ...config };
    testCaseConfig.LocalisedCards.__fallback = true;

    expect(() =>
      configMap(config, compilationContext, jest.fn())
    ).not.toThrow();
  });
});
