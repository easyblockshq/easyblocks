export type ImageLoaderProps = {
  width: number;
  src: string;
  height?: number;
  crop?: "center" | "top" | "bottom" | "left" | "right";
  quality?: number;
  imageExtension?: string;
};

export const shopifyImageLoader = (props: ImageLoaderProps): string => {
  const { width, height, src, crop } = props;

  let extension = ".jpg";
  if (src.includes(".png")) {
    extension = ".png";
  }

  const _src = src.split(extension);
  let _options = "";

  if (width && height) {
    _options = _options + `_${width}x${height}`;
  } else {
    if (width) {
      _options = _options + `_${width}x`;
    }
    if (height) {
      _options = _options + `_x${height}`;
    }
  }

  if (crop) {
    // top, center, bottom, left, right
    _options = _options + `_crop_${crop}`;
  }

  _src[0] = _src[0] + _options;

  return _src.join(extension);
};
