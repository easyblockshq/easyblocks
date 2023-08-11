import type { ConfigComponent } from "@easyblocks/core";

const placeholderConfig: ConfigComponent = {
  _template: "$Placeholder",
  _itemProps: {
    $GridCard: {
      Cards: {},
    },
  },
};

const PLACEHOLDERS_NUM = 64;

export function fillGridConfigWithPlaceholders(config: ConfigComponent) {
  if (config._template !== "$RootGrid") {
    throw new Error(
      "fillGridConfigWithPlaceholders must be run with $RootGrid only"
    );
  }

  const cards = config.data[0].Component[0].Cards;

  const placeholderCards = cards.filter(
    (x: ConfigComponent) => x._template === "$Placeholder"
  );

  const numberOfNewPlaceholdersToBeAdded = Math.max(
    0,
    PLACEHOLDERS_NUM - placeholderCards.length
  );

  for (let i = 0; i < numberOfNewPlaceholdersToBeAdded; i++) {
    cards.push(placeholderConfig);
  }
}
