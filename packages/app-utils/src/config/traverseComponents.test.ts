import { ComponentConfig } from "@easyblocks/core";
import { testCompilationContext } from "../test-utils";
import type { CompilationContextType } from "../types";
import { traverseComponents } from "./traverseComponents";

function createCard(color: string) {
  return {
    _template: "Card",
    color: color,
    image: {
      $res: true,
      b4: {
        id: "unresolved card image id",
      },
    },
  };
}

const whiteCard = createCard("#fff");
const redCard = createCard("red");
const blueCard = createCard("blue");

test("invokes callback for each valid schema prop from config", () => {
  const callback = jest.fn();

  const config: ComponentConfig = {
    _template: "$Root",
    image: {
      $res: true,
      b4: {
        id: "unresolved id",
      },
    },
    margin: {
      $res: true,
      b4: 24,
    },
    text: {
      value: "Lorem ipsum",
    },
    Card: [whiteCard],
    LocalisedCards: {
      en: [redCard, blueCard],
      pl: [whiteCard],
    },
    // This schema isn't valid and shouldn't be processed
    notDefinedSchema: {
      value: "foo",
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
              componentTypes: ["card"],
            },
            {
              prop: "LocalisedCards",
              type: "component-collection-localised",
              componentTypes: ["card"],
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

  traverseComponents(config, compilationContext, callback);

  expect(callback).toHaveBeenCalledTimes(5);

  expect(callback).toHaveBeenNthCalledWith(1, {
    path: "",
    componentConfig: config,
  });

  expect(callback).toHaveBeenNthCalledWith(2, {
    path: "Card.0",
    componentConfig: whiteCard,
  });

  expect(callback).toHaveBeenNthCalledWith(3, {
    path: "LocalisedCards.en.0",
    componentConfig: redCard,
  });

  expect(callback).toHaveBeenNthCalledWith(4, {
    path: "LocalisedCards.en.1",
    componentConfig: blueCard,
  });

  expect(callback).toHaveBeenNthCalledWith(5, {
    path: "LocalisedCards.pl.0",
    componentConfig: whiteCard,
  });
});

test("Should not traverse further when cannot find component definition", () => {
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
              prop: "LocalisedCards",
              type: "component-collection-localised",
              componentTypes: ["card"],
            },
          ],
        },
      ],
      links: [],
      actions: [],
      textModifiers: [],
    },
  };

  const callback = jest.fn();
  const warn = jest.fn();

  jest.spyOn(console, "warn").mockImplementation(warn);

  traverseComponents(
    {
      _template: "$Root",
      LocalisedCards: {
        en: [
          {
            _template: "NOT_DEFINED_COMPONENT",
          },
        ],
      },
    },
    compilationContext,
    callback
  );

  expect(warn).toBeCalledWith(
    "[traverseComponents] Unknown component definition",
    { _template: "NOT_DEFINED_COMPONENT" }
  );
  expect(callback).toBeCalledTimes(1);
  expect(callback).toHaveBeenNthCalledWith(1, {
    componentConfig: {
      _template: "$Root",
      LocalisedCards: {
        en: [
          {
            _template: "NOT_DEFINED_COMPONENT",
          },
        ],
      },
    },
    path: "",
  });
});
