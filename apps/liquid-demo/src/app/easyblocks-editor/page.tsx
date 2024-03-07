"use client";

import { EasyblocksEditor } from "@easyblocks/editor";
import { Config, EasyblocksBackend } from "@easyblocks/core";
import React, { ReactElement } from "react";
import { Liquid } from "liquidjs";
import { Parser, ProcessNodeDefinitions } from "html-to-react";

if (!process.env.NEXT_PUBLIC_EASYBLOCKS_ACCESS_TOKEN) {
  throw new Error("Missing NEXT_PUBLIC_EASYBLOCKS_ACCESS_TOKEN");
}

const easyblocksConfig: Config = {
  backend: new EasyblocksBackend({
    accessToken: process.env.NEXT_PUBLIC_EASYBLOCKS_ACCESS_TOKEN,
  }),
  locales: [
    {
      code: "en-US",
      isDefault: true,
    },
    {
      code: "de-DE",
      fallback: "en-US",
    },
  ],
  components: [
    {
      id: "DummyBanner",
      label: "DummyBanner",
      schema: [
        {
          prop: "backgroundColor",
          label: "Background Color",
          type: "color",
          defaultValue: {
            tokenId: "coral",
          },
        },
        {
          prop: "padding",
          label: "Pading",
          type: "space",
          defaultValue: {
            tokenId: "16",
          },
        },
        {
          prop: "extraText",
          label: "Extra Text",
          type: "string",
          defaultValue: "Some text edited in sidebar",
        },
        {
          prop: "Title",
          type: "component",
          required: true,
          accepts: ["@easyblocks/rich-text"],
        },
      ],
      styles: ({ values }) => {
        return {
          styled: {
            Root: {
              backgroundColor: values.backgroundColor,
              padding: values.padding,
            },
          },
        };
      },
    },
  ],
  tokens: {
    colors: [
      {
        id: "black",
        label: "Black",
        value: "#000000",
        isDefault: true,
      },
      {
        id: "white",
        label: "White",
        value: "#ffffff",
      },
      {
        id: "coral",
        label: "Coral",
        value: "#E9967A",
      },
      {
        id: "green",
        label: "Green",
        value: "#8FBC8F",
      },
      {
        id: "purple",
        label: "Purple",
        value: "#483D8B",
      },
    ],
    fonts: [
      {
        id: "body",
        label: "Body",
        value: {
          fontSize: 18,
          lineHeight: 1.8,
          fontFamily: "sans-serif",
        },
        isDefault: true,
      },
      {
        id: "heading",
        label: "Heading",
        value: {
          fontSize: 24,
          fontFamily: "sans-serif",
          lineHeight: 1.2,
          fontWeight: 700,
        },
      },
    ],
    space: [
      {
        id: "0",
        label: "0",
        value: "0px",
        isDefault: true,
      },
      {
        id: "1",
        label: "1",
        value: "1px",
      },
      {
        id: "2",
        label: "2",
        value: "2px",
      },
      {
        id: "4",
        label: "4",
        value: "4px",
      },
      {
        id: "6",
        label: "6",
        value: "6px",
      },
      {
        id: "8",
        label: "8",
        value: "8px",
      },
      {
        id: "12",
        label: "12",
        value: "12px",
      },
      {
        id: "16",
        label: "16",
        value: "16px",
      },
      {
        id: "24",
        label: "24",
        value: "24px",
      },
      {
        id: "32",
        label: "32",
        value: "32px",
      },
      {
        id: "48",
        label: "48",
        value: "48px",
      },
      {
        id: "64",
        label: "64",
        value: "64px",
      },
      {
        id: "96",
        label: "96",
        value: "96px",
      },
      {
        id: "128",
        label: "128",
        value: "128px",
      },
      {
        id: "160",
        label: "160",
        value: "160px",
      },
    ],
  },
  hideCloseButton: true,
};

const DummyBanner = createLiquidComponent(`
<div style="border: 2px solid black">
  <component.Root>
      <div>
        <component.Title />
      </div>
      <p>{{ extraText }}</p>
  </component.Root>
</div>
`);

export default function EeasyblocksEditorPage() {
  return (
    <EasyblocksEditor config={easyblocksConfig} components={{ DummyBanner }} />
  );
}

function createLiquidComponent(liquidTemplate: string) {
  return (props: any) => {
    const engine = React.useRef(new Liquid()).current;
    // @ts-ignore
    const parser = React.useRef(new Parser()).current;
    const processNodeDefinitions = React.useRef(
      // @ts-ignore
      new ProcessNodeDefinitions()
    ).current;

    const isValidNode = function () {
      return true;
    };

    const processingInstructions = [
      {
        shouldProcessNode: function (node: any) {
          const isComponent =
            typeof node.name === "string" && node.name.startsWith("component.");
          return isComponent;
        },
        processNode: (node: any, children: any, index: any) => {
          const liquidElement = processNodeDefinitions.processDefaultNode(
            node,
            children,
            index
          );

          const componentId = liquidElement.type.split(".")[1];

          let element;
          for (let key in props) {
            if (key.toLocaleLowerCase() === componentId) {
              element = props[key];
              break;
            }
          }

          const processedElement = {
            ...liquidElement,
            type: element.type,
            props: {
              ...element.props,
              ...liquidElement.props,
            },
          };

          return processedElement;
        },
      },
      {
        // Anything else
        shouldProcessNode: function (node: any) {
          return true;
        },
        processNode: processNodeDefinitions.processDefaultNode,
      },
    ];

    const html = engine.parseAndRenderSync(liquidTemplate, props);
    return parser.parseWithInstructions(
      html,
      isValidNode,
      processingInstructions
    );
  };
}
