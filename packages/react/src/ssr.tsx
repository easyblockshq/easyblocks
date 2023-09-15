import React from "react";

export const easyblocksStitchesInstances: any[] = [];

export function addEasyblocksStitchesInstance(instance: any) {
  easyblocksStitchesInstances.push(instance);
}

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
