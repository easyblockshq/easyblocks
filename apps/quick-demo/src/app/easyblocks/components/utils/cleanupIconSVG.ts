/**
 * Cleans up SVG string, assumes that input string is correct XML
 * - removes style, width, height
 * - changes all the stroke / fill to the currentColor (icons are unicolor)
 * @param svg
 */

import { XMLParser, XMLBuilder } from "fast-xml-parser";

function transformStrokeAndFill(obj: Record<string, any>) {
  for (const key in obj) {
    const val = obj[key];

    if (
      (key === "@_stroke" || key === "@_fill") &&
      val !== "none" &&
      val !== "transparent"
    ) {
      obj[key] = "currentColor";
    } else if (typeof val === "object" && val !== null) {
      transformStrokeAndFill(val);
    }
  }
}

export function cleanupIconSVG(svgString: string): string {
  const parser = new XMLParser({ ignoreAttributes: false });
  const svg = parser.parse(svgString);

  if (Object.keys(svg).length !== 1) {
    throw new Error("input is wrong XML");
  }

  const rootKey = Object.keys(svg)[0];

  if (rootKey.toLowerCase() !== "svg") {
    throw new Error("SVG root node must be svg");
  }

  delete svg[rootKey]["@_style"];
  delete svg[rootKey]["@_width"];
  delete svg[rootKey]["@_height"];

  transformStrokeAndFill(svg);

  const builder = new XMLBuilder({ ignoreAttributes: false });
  return builder.build(svg);
}
