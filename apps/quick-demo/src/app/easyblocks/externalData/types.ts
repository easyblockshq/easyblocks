export type ImageSrcSetEntry = {
  w: number;
  h: number;
  url: string;
};

export type ImageSrc = {
  alt: string;
  url: string;
  aspectRatio: number;
  srcset: ImageSrcSetEntry[];
  mimeType: string;
};

export type VideoSrc = {
  alt: string;
  url: string;
  aspectRatio: number;
};
