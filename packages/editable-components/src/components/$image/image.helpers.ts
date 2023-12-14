import {
  Devices,
  ResponsiveValue,
  responsiveValueFill,
  responsiveValueMap,
} from "@easyblocks/core";
import {
  compileBox,
  getBoxStyles,
  getDevicesWidths,
} from "@easyblocks/core/_internals";
import { ReactElement } from "react";
import { getPaddingBottomAndHeightFromAspectRatio } from "../../parseAspectRatio";
import { CompiledNoCodeComponentProps, ImageSrc, VideoSrc } from "../../types";

export type ImageProps = CompiledNoCodeComponentProps<
  "$image",
  {
    image: ResponsiveValue<ImageSrc | undefined>;
    aspectRatio: ResponsiveValue<string>;
    gridBaseLineHeight: ResponsiveValue<string>;
  },
  Record<string, never>
> & {
  Wrapper: ReactElement;
  AspectRatioMaker: ReactElement;
  ImageWrapper: ReactElement;
};

export function getAspectRatioClassName(
  responsiveImage: ResponsiveValue<ImageSrc | VideoSrc | undefined>,
  aspectRatio: ImageProps["aspectRatio"],
  gridBaseLineHeight: ImageProps["gridBaseLineHeight"],
  devices: Devices,
  stitches: any,
  resop: any
) {
  const naturalAspectRatio = responsiveValueMap(responsiveImage, (image) => {
    return image?.aspectRatio ?? null; // null is important because it means it's defined
  });

  const input: Record<string, any> = {
    naturalAspectRatio,
    aspectRatio,
    gridBaseLineHeight,
  };

  // Let's make all values filled  (this is what resop expects now)
  for (const key in input) {
    input[key] = responsiveValueFill(
      input[key],
      devices,
      getDevicesWidths(devices)
    );
  }

  const aspectRatioStyles = resop(
    input,
    ({ naturalAspectRatio, aspectRatio, gridBaseLineHeight }: any) => {
      return getPaddingBottomAndHeightFromAspectRatio(
        aspectRatio,
        naturalAspectRatio ?? undefined,
        gridBaseLineHeight
      );
    },
    devices
  );

  const compiledBox = compileBox(aspectRatioStyles, devices);

  const stylesObject = getBoxStyles(
    JSON.parse(JSON.stringify(compiledBox)),
    devices
  );
  const styles = stitches.css(stylesObject);

  return styles().className;
}

export function getWrapperClassName(devices: Devices, stitches: any) {
  const wrapperStyles = {
    opacity: 1,
  };

  const compiledBox = compileBox(wrapperStyles, devices);
  const stylesObject = getBoxStyles(
    JSON.parse(JSON.stringify(compiledBox)),
    devices
  );
  const styles = stitches.css(stylesObject);

  return styles().className;
}
