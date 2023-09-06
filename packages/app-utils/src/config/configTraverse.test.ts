import { ComponentConfig } from "@easyblocks/core";
import { testCompilationContext } from "../test-utils";
import type { CompilationContextType } from "../types";
import { configTraverse } from "./configTraverse";

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
      links: [],
      actions: [],
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
              type: "resource",
              resourceType: "image",
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
              type: "resource",
              resourceType: "image",
            },
          ],
        },
      ],
      textModifiers: [],
    },
  };

  configTraverse(config, compilationContext, callback);

  expect(callback).toHaveBeenCalledTimes(13);

  // The order of invocation is determined by schemas defined within compilation context
  expect(callback).toHaveBeenNthCalledWith(1, {
    path: "margin",
    value: {
      $res: true,
      b4: 24,
    },
    schemaProp: {
      prop: "margin",
      type: "space",
    },
  });
  expect(callback).toHaveBeenNthCalledWith(2, {
    path: "image",
    value: {
      $res: true,
      b4: {
        id: "unresolved id",
      },
    },
    schemaProp: {
      prop: "image",
      type: "resource",
      resourceType: "image",
    },
  });
  expect(callback).toHaveBeenNthCalledWith(3, {
    path: "text",
    value: {
      value: "Lorem ipsum",
    },
    schemaProp: {
      prop: "text",
      type: "text",
    },
  });

  expect(callback).toHaveBeenNthCalledWith(4, {
    path: "Card",
    schemaProp: { componentTypes: ["card"], prop: "Card", type: "component" },
    value: [whiteCard],
  });

  expect(callback).toHaveBeenNthCalledWith(5, {
    path: "Card.0.color",
    value: whiteCard.color,
    schemaProp: {
      prop: "color",
      type: "color",
    },
  });

  expect(callback).toHaveBeenNthCalledWith(6, {
    path: "Card.0.image",
    value: whiteCard.image,
    schemaProp: {
      prop: "image",
      type: "resource",
      resourceType: "image",
    },
  });

  expect(callback).toHaveBeenNthCalledWith(7, {
    path: "LocalisedCards",
    schemaProp: {
      prop: "LocalisedCards",
      type: "component-collection-localised",
      componentTypes: ["card"],
    },
    value: {
      en: [redCard, blueCard],
      pl: [whiteCard],
    },
  });

  expect(callback).toHaveBeenNthCalledWith(8, {
    path: "LocalisedCards.en.0.color",
    value: redCard.color,
    schemaProp: {
      prop: "color",
      type: "color",
    },
  });

  expect(callback).toHaveBeenNthCalledWith(9, {
    path: "LocalisedCards.en.0.image",
    value: redCard.image,
    schemaProp: {
      prop: "image",
      type: "resource",
      resourceType: "image",
    },
  });

  expect(callback).toHaveBeenNthCalledWith(10, {
    path: "LocalisedCards.en.1.color",
    value: blueCard.color,
    schemaProp: {
      prop: "color",
      type: "color",
    },
  });

  expect(callback).toHaveBeenNthCalledWith(11, {
    path: "LocalisedCards.en.1.image",
    value: blueCard.image,
    schemaProp: {
      prop: "image",
      type: "resource",
      resourceType: "image",
    },
  });

  expect(callback).toHaveBeenNthCalledWith(12, {
    path: "LocalisedCards.pl.0.color",
    value: whiteCard.color,
    schemaProp: {
      prop: "color",
      type: "color",
    },
  });

  expect(callback).toHaveBeenNthCalledWith(13, {
    path: "LocalisedCards.pl.0.image",
    value: whiteCard.image,
    schemaProp: {
      prop: "image",
      type: "resource",
      resourceType: "image",
    },
  });
});
