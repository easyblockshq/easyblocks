import { NoCodeComponentProps } from "../types";
import NextImage from "next/image";

function Image({ image }: NoCodeComponentProps) {
  return (
    <div className="relative bg-neutral-100 aspect-square w-full">
      {image && <NextImage src={image} alt="Image" fill />}
    </div>
  );
}

export { Image };
