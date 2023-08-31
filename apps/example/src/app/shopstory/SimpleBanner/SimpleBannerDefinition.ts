import { styled } from "@easyblocks/core";

export const simpleBannerDefinition = {
  id: "SimpleBanner",
  tags: ["section"],
  styles: (values: any, { $width }: { $width: number }) => {
    return {
      Test: styled({
        width: "400px",
        height: "400px",
        background: "red",
      }),
    };
  },
  schema: [
    {
      prop: "containerMargin",
      label: "Container",
      type: "space",
      prefix: "containerMargin",
    },
    {
      prop: "gap",
      label: "Gap",
      type: "space",
    },
  ],
};
