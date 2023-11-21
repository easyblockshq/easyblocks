import { NoCodeComponentDefinition, box } from "@easyblocks/core";

export const heroBannerNoCodeDefinition: NoCodeComponentDefinition = {
  id: "HeroBanner",
  label: "Hero Banner v2 NEW",
  type: "section",
  schema: [
    {
      prop: "testSpace",
      type: "space",
    },
    {
      prop: "testColor",
      type: "color",
    },
  ],
  styles: (values: any) => {
    return {
      Container: box({
        backgroundColor: values.testColor,
        padding: values.testSpace,
      }),
    };
  },
};
