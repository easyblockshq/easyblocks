"use client";
import {
  CompiledShopstoryComponentConfig,
  Metadata,
  RenderableContent,
} from "@easyblocks/core";
import { deepClone, uniqueId } from "@easyblocks/utils";
import React, { useEffect } from "react";
import {
  ShopstoryMetadataProvider,
  useShopstoryMetadata,
} from "./ShopstoryMetadataProvider";
import { shopstoryGetCssText, shopstoryGetStyleTag } from "./ssr";

export type ShopstoryProps = {
  content: RenderableContent;
  meta?: Metadata;
};

export const Shopstory: React.FC<ShopstoryProps> = ({ content, meta }) => {
  const metaFromContext = useShopstoryMetadata();

  if (metaFromContext) {
    return <ShopstoryInternal content={content} />;
  } else {
    if (!meta) {
      throw new Error(
        "No metadata for <Shopstory /> component. You can provide it via 'meta' prop or via <ShopstoryMetadataProvider> context"
      );
    }

    return (
      <ShopstoryMetadataProvider meta={meta}>
        <ShopstoryInternal content={content} />
      </ShopstoryMetadataProvider>
    );
  }
};

const ShopstoryInternal: React.FC<ShopstoryProps> = ({ content }) => {
  const meta = useShopstoryMetadata();

  if (content.renderableContent === null) {
    throw new Error(
      "Content for Shopstory component is empty. Did you forget to invoke `fetch` on ShopstoryClient?"
    );
  }

  if (!meta) {
    throw new Error(
      `<Shopstory> component requires <ShopstoryMetadataProvider> to be defined`
    );
  }

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--shopstory-viewport-width",
      `calc(100vw - ${
        window.innerWidth - document.documentElement.clientWidth
      }px)`
    );
  });

  const ComponentBuilder = meta.code.ComponentBuilder;

  return (
    <ComponentBuilder
      compiled={content.renderableContent}
      path={""}
      meta={meta}
    />
  );
};

export type ShopstoryGridProps = {
  content: RenderableContent;
  cards: React.ReactElement[];
  meta?: Metadata;
};

export const ShopstoryGrid: React.FC<ShopstoryGridProps> = ({
  content,
  cards,
  meta,
}) => {
  let currentIndex = 0;

  if (!content?.renderableContent) {
    return null;
  }

  const contentCopy = deepClone(content.renderableContent);

  if (!("components" in contentCopy)) {
    return null;
  }

  const Component = contentCopy.components.data[0].components
    .Component[0] as CompiledShopstoryComponentConfig;

  // replace placeholders with cards
  Component.components.Cards.forEach((compiledCard: any) => {
    if (compiledCard._template === "$Placeholder") {
      if (!cards[currentIndex]) {
        return;
      }

      compiledCard._template = "REPLACE_ME";
      compiledCard.element = cards[currentIndex];
      currentIndex++;
    }
  });

  // remove placeholders that were not replaced
  Component.components.Cards = Component.components.Cards.filter(
    (x: any) => x._template !== "$Placeholder"
  );

  let firstPlaceholderIndex = Component.components.Cards.findIndex(
    (x: any) => x._template === "REPLACE_ME"
  );

  /**
   * Very important.
   *
   * When compile got "null" (no grid defined) then there are no placeholders. If there are no placeholders then firstPlaceholderIndex will be -1. In that case, we must take first item container (placeholder one).
   */
  if (firstPlaceholderIndex === -1) {
    firstPlaceholderIndex = 0;
  }

  const placeholderStyled = {
    itemContainer: Component.styled.itemContainers[firstPlaceholderIndex],
    itemInnerContainer:
      Component.styled.itemInnerContainers[firstPlaceholderIndex],
    verticalLine: {
      display: "none",
      __isBox: true,
    },
    horizontalLine: {
      display: "none",
      __isBox: true,
    },
  };

  // add the cards when number is bigger than number of placeholders
  for (currentIndex; currentIndex < cards.length; currentIndex++) {
    Component.components.Cards.push({
      _template: "REPLACE_ME",
      _id: uniqueId(),
      // @ts-expect-error This is a special case. Only REPLACE_ME Card component contains `element` property.
      element: cards[currentIndex],
    });

    Component.styled.itemContainers.push(placeholderStyled.itemContainer);
    Component.styled.itemInnerContainers.push(
      placeholderStyled.itemInnerContainer
    );
    Component.styled.verticalLines.push(placeholderStyled.verticalLine);
    Component.styled.horizontalLines.push(placeholderStyled.horizontalLine);
  }

  // This is temporary. If special cards are AFTER grid items, we just remove them. It's valuable in case of filtering etc. Later we must have good logic of handling this.
  for (let i = Component.components.Cards.length - 1; i >= 0; i--) {
    if (Component.components.Cards[i]._template !== "REPLACE_ME") {
      Component.components.Cards.pop();
    } else {
      break;
    }
  }

  return <Shopstory content={{ renderableContent: contentCopy }} meta={meta} />;
};

export { shopstoryGetStyleTag, shopstoryGetCssText };
