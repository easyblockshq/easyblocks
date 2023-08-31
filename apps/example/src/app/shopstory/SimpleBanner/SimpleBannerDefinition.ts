import { styled } from "@easyblocks/core";

export const simpleBannerDefinition = {
  id: "SimpleBanner",
  tags: ["section"],
  schema: [
    {
      prop: "containerMargin",
      label: "Container",
      type: "space",
      prefix: "containerMargin",
    },
    {
      prop: "coverPosition",
      label: "Cover position",
      type: "select$",
      options: ["left", "right", "top", "bottom"],
    },
    {
      prop: "gap",
      label: "Gap from cover",
      type: "space",
    },
    {
      prop: "extraPadding",
      label: "Padding",
      type: "space",
    },
    {
      prop: "backgroundEnabled",
      label: "Enabled",
      type: "boolean$",
      group: "Background",
    },
    {
      prop: "backgroundColor",
      label: "Color",
      type: "color",
      group: "Background",
      visible: (values: any) => {
        return values.backgroundEnabled;
      },
    },
  ],
  styles: (values: any) => {
    const isOrderInverted =
      values.coverPosition === "right" || values.coverPosition === "bottom";
    const isStacked =
      values.coverPosition === "top" || values.coverPosition === "bottom";

    const coverPositionToPaddingsMap: {
      [coverPosition: string]: {
        paddingRight?: string | number;
        paddingLeft?: string | number;
        paddingTop?: string | number;
        paddingBottom?: string | number;
      };
    } = {
      right: {
        paddingRight: values.gap,
        paddingLeft: values.backgroundEnabled ? values.gap : 0,
        paddingTop: values.extraPadding,
        paddingBottom: values.extraPadding,
      },
      left: {
        paddingRight: values.backgroundEnabled ? values.gap : 0,
        paddingLeft: values.gap,
        paddingTop: values.extraPadding,
        paddingBottom: values.extraPadding,
      },
      top: {
        paddingRight: values.extraPadding,
        paddingLeft: values.extraPadding,
        paddingTop: values.gap,
        paddingBottom: values.backgroundEnabled ? values.gap : 0,
      },
      bottom: {
        paddingRight: values.extraPadding,
        paddingLeft: values.extraPadding,
        paddingTop: values.backgroundEnabled ? values.gap : 0,
        paddingBottom: values.gap,
      },
    };

    return {
      Root: styled({
        position: "relative",
        margin: `0 ${values.containerMargin}`,
        display: "grid",
        gridTemplateColumns: isStacked ? "1fr" : "1fr 1fr",
        backgroundColor: values.backgroundEnabled
          ? values.backgroundColor
          : "transparent",
      }),
      Cover: styled({
        display: "grid",
        order: isOrderInverted ? 1 : 0,
      }),
      Stack: styled({
        maxWidth: 500,
        order: isOrderInverted ? 0 : 1,
        ...coverPositionToPaddingsMap[values.coverPosition],
      }),
      Title: styled({
        fontFamily: "sans-serif",
        fontSize: 36,
        marginBottom: 16,
      }),
      Description: styled({
        fontFamily: "sans-serif",
        fontSize: 16,
      }),
    };
  },
};
