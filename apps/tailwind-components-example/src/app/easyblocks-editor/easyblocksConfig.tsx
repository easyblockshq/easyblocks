"use client";
import {
  Config,
  EasyblocksBackend,
  NoCodeComponentDefinition,
} from "@easyblocks/core";

export const easyblocksConfig = ({
  definitions,
}: {
  definitions: NoCodeComponentDefinition[];
}): Config => {
  if (!process.env.NEXT_PUBLIC_EASYBLOCKS_ACCESS_TOKEN) {
    throw new Error("Missing NEXT_PUBLIC_EASYBLOCKS_ACCESS_TOKEN");
  }

  return {
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
    components: definitions,
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
          value: "#ff7f50",
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
};
