import React, { useEffect, useRef } from "react";
import { wrapFieldsWithMeta } from "../wrapFieldWithMeta";

type SVGPickerProps = {
  min: number;
  max: number;
  step?: number;
};

function transformStrokeAndFill(node: Element) {
  const fill = node.getAttribute("fill");
  const stroke = node.getAttribute("stroke");

  if (fill && fill !== "none") {
    node.setAttribute("fill", "currentColor");
  }
  if (stroke && stroke !== "none") {
    node.setAttribute("stroke", "currentColor");
  }

  Array.from(node.children).forEach((child) => transformStrokeAndFill(child));
}

const SVGPicker = wrapFieldsWithMeta<any, SVGPickerProps>(
  ({ input, meta, field }) => {
    const svgString = input.value.value;
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      function readFileAsString() {
        // @ts-ignore
        const files = this.files;
        if (files.length === 0) {
          return;
        }

        const reader = new FileReader();
        reader.onload = function (event) {
          // @ts-ignore to explore
          const trimmed = event.target?.result.trim();

          const emptyDiv = document.createElement("div");
          emptyDiv.innerHTML = trimmed;
          const svg = emptyDiv.children[0];

          svg.removeAttribute("width");
          svg.removeAttribute("height");

          svg.setAttribute(
            "style",
            "position: absolute; width: 100%;height: 100%;"
          );

          transformStrokeAndFill(svg);

          if (svg.tagName.toLowerCase() !== "svg") {
            alert("incorrect file");
            return;
          }

          input.onChange({
            value: emptyDiv.innerHTML,
          });
        };
        reader.readAsText(files[0]);
      }

      inputRef.current!.addEventListener("change", readFileAsString);

      return () => {
        inputRef.current!.removeEventListener("change", readFileAsString);
      };
    }, []);

    return (
      <div>
        <div
          style={{
            width: 24,
            height: 24,
            position: "relative",
            color: "black",
            marginBottom: 16,
          }}
        >
          <div dangerouslySetInnerHTML={{ __html: svgString }} />
        </div>

        <input type="file" id="upload" accept={".svg"} ref={inputRef} />
      </div>
    );
  }
);

export const SVGPickerFieldPlugin = {
  __type: "field",
  name: "icon",
  Component: SVGPicker,
};
