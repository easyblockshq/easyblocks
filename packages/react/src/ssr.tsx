import React from "react";

export const shopstoryStitchesInstances: any[] = [];

export function addShopstoryStitchesInstance(instance: any) {
  shopstoryStitchesInstances.push(instance);
}

export function shopstoryGetCssText() {
  return shopstoryStitchesInstances
    .map((stitches) => stitches.getCssText())
    .join(" ");
}

export function shopstoryGetStyleTag() {
  return (
    <style
      id="stitches"
      dangerouslySetInnerHTML={{ __html: shopstoryGetCssText() }}
    />
  );
}
