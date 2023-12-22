import { NoCodeComponentDefinition } from "@easyblocks/core";

import { bannerCardDefinition } from "@/app/easyblocks/components/BannerCard/BannerCard.definition";
import {
  sectionWrapperEditing,
  sectionWrapperSchemaProps,
  sectionWrapperStyles,
  SectionWrapperValues,
} from "@/app/easyblocks/components/utils/sectionWrapper/SectionWrapper";

export const bannerSectionDefinition: NoCodeComponentDefinition<
  Record<string, any> & SectionWrapperValues
> = {
  id: "BannerSection",
  label: "Banner Section",
  type: "section",
  schema: [
    ...sectionWrapperSchemaProps.margins,
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
      values,
      params,
      device,
      isEditing,
    });

    return {
      styled: {
        ...sectionStyles.styled,
        ...bannerCardStyles.styled,
      },
      components: {
        ...sectionStyles.components,
        ...bannerCardStyles.components,
      },
    };
  },
  editing: ({ editingInfo, values, params }) => {
    const sectionEditingInfo = sectionWrapperEditing({
      editingInfo,
      values,
      params,
    });

    const bannerCardEditing = bannerCardDefinition.editing!({
      editingInfo,
      values,
      params,
    });

    return {
      ...editingInfo,
      components: {
        ...sectionEditingInfo.components,
        ...bannerCardEditing.components,
      },
    };
  },
};
