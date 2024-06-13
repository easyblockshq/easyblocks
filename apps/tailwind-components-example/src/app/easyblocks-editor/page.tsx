"use client";

import { EasyblocksEditor } from "@easyblocks/editor";
import { ReactElement, useEffect } from "react";
import useMemoizedState from "./useMemomizedState";
import { createTailwindcss } from "@mhsdesign/jit-browser-tailwindcss";
import { easyblocksConfig } from "./easyblocksConfig";
import { NoCodeComponentDefinition } from "@easyblocks/core";
import { tailwind, traverseAndExtractClasses } from "./helpers";

const DummyCollectionDefinition: NoCodeComponentDefinition = {
  id: "DummyCollection",
  label: "DummyCollection",
  schema: [],
  styles: ({ values }) => {
    return {
      props: {
        tw: {
          Root: ``,
        },
      },
    };
  },
};

const DummyBannerDefinition: NoCodeComponentDefinition = {
  id: "DummyBanner",
  label: "DummyBanner",
  schema: [
    {
      prop: "backgroundColor",
      label: "Background Color",
      type: "color",
      defaultValue: {
        tokenId: "white",
      },
    },
    {
      prop: "padding",
      label: "Pading",
      type: "space",
    },
    {
      prop: "Title",
      type: "component",
      required: true,
      accepts: ["@easyblocks/rich-text"],
    },
    {
      prop: "DummyCollection",
      type: "component-collection",
      accepts: ["DummyCollection"],
      itemFields: [
        {
          prop: "backgroundColorDummyCollection",
          label: "Background Color Dummy Collection",
          type: "color",
          defaultValue: {
            tokenId: "white",
          },
        },
      ],
    },
  ],
  styles: ({ values }) => {
    const DummyCollectionStyles = values.DummyCollection.map(
      (dc: any) => `bg-[${dc.backgroundColorDummyCollection}]`
    );

    return {
      props: {
        tw: {
          Root: `bg-[${values.backgroundColor}] p-[${values.padding}]`,
          DummyCollectionOuterStyle:
            DummyCollectionStyles.length > 0
              ? DummyCollectionStyles
              : [undefined],
        },
      },
    };
  },
};

function DummyBanner(props: {
  Root: ReactElement;
  Title: ReactElement;
  DummyCollection: Array<ReactElement>;
  DummyCollectionOuterStyle: Array<ReactElement>;
}) {
  const {
    Root,
    Title,
    DummyCollection,
    DummyCollectionOuterStyle: dummyCollectionOuterStyle,
  } = props;

  return (
    <Root.type {...Root.props}>
      <Title.type {...Title.props} />
      {DummyCollection.map((DummyComponent, index) => {
        const DummyCollectionOuterStyle = dummyCollectionOuterStyle[index];

        return (
          <DummyCollectionOuterStyle.type
            {...DummyCollectionOuterStyle.props}
            key={index}
          >
            <DummyComponent.type {...DummyComponent.props} key={index} />
          </DummyCollectionOuterStyle.type>
        );
      })}
    </Root.type>
  );
}

function DummyCollection(props: { Root: ReactElement }) {
  const { Root } = props;

  return <Root.type {...Root.props}>This is a collection</Root.type>;
}

export default function EasyblocksEditorPage() {
  const [css, setCss] = useMemoizedState<string>("");

  useEffect(() => {
    console.log("CSS Updated");
  }, [css]);

  useEffect(() => {
    const renderTailwindCss = (eventType: string) => {
      if (eventType === "renderableContent" || eventType === "meta") {
        const createTailwind = async () => {
          const stringForTailwind = traverseAndExtractClasses(
            window.parent.editorWindowAPI?.compiled
          );
          const generatedCss = await tailwind.generateStylesFromContent(
            `
              /* without the "@tailwind base;" */
              @tailwind base;
              @tailwind components;
              @tailwind utilities;
            `,
            [stringForTailwind]
          );
          setCss(generatedCss);
        };
        createTailwind();
      }
    };

    // poll for the editor window api to be ready
    const interval = setInterval(() => {
      if (window.parent.editorWindowAPI && window.parent != window.self) {
        clearInterval(interval);
        window.parent.editorWindowAPI.subscribe(renderTailwindCss);
        renderTailwindCss("renderableContent"); // trigger the first time
      }
    }, 100);
  }, []);

  return (
    <div>
      <style jsx global>
        {`
          ${css}
        `}
      </style>
      <EasyblocksEditor
        config={easyblocksConfig({
          definitions: [DummyBannerDefinition, DummyCollectionDefinition],
        })}
        components={{ DummyBanner, DummyCollection }}
      />
    </div>
  );
}
