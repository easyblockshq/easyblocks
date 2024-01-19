import { DeviceRange, NoCodeComponentDefinition } from "@easyblocks/core";

import { bannerCardDefinition } from "@/app/easyblocks/components/BannerCard/BannerCard.definition";
import {
  sectionWrapperCalculateMarginAndMaxWidth,
  sectionWrapperEditing,
  sectionWrapperGetContainerWidths,
  sectionWrapperSchemaProps,
  sectionWrapperStyles,
  SectionWrapperValues,
} from "@/app/easyblocks/components/utils/sectionWrapper/sectionWrapperHelpers";
import { bannerCardAuto } from "@/app/easyblocks/components/BannerCard/BannerCard.auto";

function getBannerCardValues(values: Record<string, any>, device: DeviceRange) {
  const { margin } = sectionWrapperCalculateMarginAndMaxWidth(
    values.containerMargin,
    values.containerMaxWidth,
    device
  );

  return {
    ...values,
    paddingLeft: values.escapeMargin ? margin.css : values.paddingLeft,
    paddingRight: values.escapeMargin ? margin.css : values.paddingRight,
    noFillPaddingLeft: values.escapeMargin
      ? margin.css
      : values.noFillPaddingLeft,
    noFillPaddingRight: values.escapeMargin
      ? margin.css
      : values.noFillPaddingRight,
    forceStandardHorizontalPaddings: !!values.escapeMargin,
  };
}

export const bannerSectionDefinition: NoCodeComponentDefinition<
  Record<string, any> & SectionWrapperValues
> = {
  id: "BannerSection",
  label: "Banner Section",
  type: "section",
  allowSave: true,
  schema: [
    ...sectionWrapperSchemaProps.margins,
    {
      prop: "escapeMargin",
      label: "Escape",
      type: "boolean",
      responsive: true,
      group: "Section margins",
    },
    ...bannerCardDefinition.schema,
    ...sectionWrapperSchemaProps.headerAndBackground,
  ],

  styles: ({ values, params, device, isEditing }) => {
    const sectionStyles = sectionWrapperStyles({
      values,
      params,
      device,
      isEditing,
    });

    const bannerCardStyles = bannerCardDefinition.styles!({
      values: getBannerCardValues(values, device),
      params,
      device,
      isEditing,
    });

    const { margin } = sectionWrapperCalculateMarginAndMaxWidth(
      values.containerMargin,
      values.containerMaxWidth,
      device
    );

    return {
      styled: {
        ...sectionStyles.styled,
        ...bannerCardStyles.styled,
        SectionRoot: {
          position: "relative",
          paddingLeft: values.escapeMargin ? 0 : margin.css,
          paddingRight: values.escapeMargin ? 0 : margin.css,
        },
      },
      components: {
        ...sectionStyles.components,
        ...bannerCardStyles.components,
      },
    };
  },
  editing: ({ editingInfo, values, params, device }) => {
    const sectionEditingInfo = sectionWrapperEditing({
      editingInfo,
      values,
      params,
      device,
    });

    const bannerCardEditing = bannerCardDefinition.editing!({
      editingInfo,
      values: getBannerCardValues(values, device),
      params,
      device,
    });

    return {
      ...editingInfo,
      components: {
        ...sectionEditingInfo.components,
        ...bannerCardEditing.components,
      },
    };
  },
  auto: ({ values, params, devices }) => {
    return bannerCardAuto({
      values,
      params: {
        ...params,
        $width: sectionWrapperGetContainerWidths(values, devices), // let's take width without margins
      },
      devices,
    });
  },
};
