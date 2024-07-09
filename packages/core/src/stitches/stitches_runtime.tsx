import React from "react";
import { createStitches } from "@stitches/core";

const easyblocksStitchesInstances: any[] = [];

export function easyblocksGetCssText() {
  return easyblocksStitchesInstances
    .map((stitches) => stitches.getCssText())
    .join(" ");
}

export function easyblocksGetStyleTag() {
  return (
    <style
      id="stitches"
      dangerouslySetInnerHTML={{ __html: easyblocksGetCssText() }}
    />
  );
}

export function getStitchesInstance() {
  if (easyblocksStitchesInstances.length === 0) {
    easyblocksStitchesInstances.push(createStitches({}));
  }

  return easyblocksStitchesInstances[0];
}
