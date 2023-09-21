import {
  compileBox,
  getBoxStyles,
  getDevicesWidths,
  ResolvedResourceProp,
  responsiveValueFill,
  responsiveValueMap,
} from "@easyblocks/app-utils";
import { Devices, ImageSrc, ResponsiveValue, VideoSrc } from "@easyblocks/core";
import { getPaddingBottomAndHeightFromAspectRatio } from "../../parseAspectRatio";
import { CompiledShopstoryComponentProps } from "../../types";

type Resop = typeof import("@easyblocks/app-utils").resop2;

export type ImageProps = CompiledShopstoryComponentProps<
  "$image",
  {
    image: ResponsiveValue<ResolvedResourceProp<ImageSrc>> | null;
    aspectRatio: ResponsiveValue<string>;
    gridBaseLineHeight: ResponsiveValue<string>;
  },
  ReturnType<typeof import("./$image.styles")["default"]>
>;

export function getAspectRatioClassName(
  responsiveImage: ResponsiveValue<
    ResolvedResourceProp<ImageSrc | VideoSrc>
  > | null,
  aspectRatio: ImageProps["__fromEditor"]["props"]["aspectRatio"],
  gridBaseLineHeight: ImageProps["__fromEditor"]["props"]["gridBaseLineHeight"],
  devices: Devices,
  stitches: any,
  resop: Resop
) {
  const naturalAspectRatio = responsiveValueMap(responsiveImage, (image) => {
    return image?.value?.aspectRatio ?? null; // null is important because it means it's defined
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
    ({ naturalAspectRatio, aspectRatio, gridBaseLineHeight }) => {
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
