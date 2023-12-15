import { ImageSrc } from "@easyblocks/editable-components";
import { Placeholder } from "./Placeholder";

type ImageRendererProps = {
  image: ImageSrc | undefined;
};

function ImageRenderer({ image }: ImageRendererProps) {
  if (!image) {
    return <Placeholder />;
  }

  const { srcset, alt } = image;

  return (
    <img
      src={srcset[0].url}
      alt={alt}
      style={{
        display: "block",
        maxWidth: "100%",
        maxHeight: "100%",
        minWidth: "100%",
        minHeight: "100%",
      }}
    />
  );
}

export { ImageRenderer };
