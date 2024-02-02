"use client";
import { Easyblocks, easyblocksGetStyleTag } from "@easyblocks/core";
import { useServerInsertedHTML } from "next/navigation";
import { ComponentPropsWithoutRef } from "react";

function EasyblocksContent({
  renderableDocument,
  externalData,
  components,
}: ComponentPropsWithoutRef<typeof Easyblocks>) {
  useServerInsertedHTML(() => {
    return easyblocksGetStyleTag();
  });

  return (
    <Easyblocks
      renderableDocument={renderableDocument}
      externalData={externalData}
      components={components}
    />
  );
}

export { EasyblocksContent };
