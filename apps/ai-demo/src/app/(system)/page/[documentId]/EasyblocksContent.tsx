"use client";
import { Easyblocks } from "@easyblocks/react";
import { ComponentPropsWithoutRef } from "react";

function EasyblocksContent({
  renderableDocument,
  externalData,
}: ComponentPropsWithoutRef<typeof Easyblocks>) {
  return (
    <Easyblocks
      renderableDocument={renderableDocument}
      externalData={externalData}
    />
  );
}

export { EasyblocksContent };
