import {
  NoCodeComponentDefinition,
  SchemaProp,
  EditingField,
} from "@easyblocks/core";

import { toStartEnd } from "@/app/easyblocks/components/utils/toStartEnd";
import { bordersEditing } from "@/app/easyblocks/components/utils/borders";
import { getFieldProvider } from "@/app/easyblocks/components/utils/getFieldProvider";
import { bannerCardDefinition } from "@/app/easyblocks/components/BannerCard/BannerCard.definition";
import {
  sectionWrapperEditing,
  sectionWrapperSchemaProps,
  sectionWrapperStyles,
  SectionWrapperValues,
} from "@/app/easyblocks/components/utils/sectionWrapper";

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

    return {
      styled: {
        ...sectionStyles.styled,
      },
      components: {
        ...sectionStyles.components,
      },
    };
  },
  editing: ({ editingInfo, values, params }) => {
    const sectionEditingInfo = sectionWrapperEditing({
      editingInfo,
      values,
      params,
    });

    return {
      ...editingInfo,
      components: {
        ...sectionEditingInfo.components,
        Stack: {
          selectable: false,
        },
      },
    };
  },
};

type PaddingMode = "standard" | "noFill" | "none";

function calculateBannerCardStuff(values: Record<string, any>) {
  const { enableFill, enableBorder, coverPosition } = values;

  const [stackAlign, stackJustify] = values.stackPosition.split("-");

  const isNaked =
    !enableFill && !enableBorder && coverPosition !== "background";

  const paddingModes = {
    left: "standard" as PaddingMode,
    right: "standard" as PaddingMode,
    top: "standard" as PaddingMode,
    bottom: "standard" as PaddingMode,
    internal: "standard" as PaddingMode,
  };

  if (coverPosition === "hide") {
    paddingModes.left = isNaked ? "none" : "standard";
    paddingModes.right = isNaked ? "none" : "standard";
    paddingModes.top = isNaked ? "none" : "standard";
    paddingModes.bottom = isNaked ? "none" : "standard";
    paddingModes.internal = "none";
  } else if (coverPosition === "left" || coverPosition === "right") {
    paddingModes.left = isNaked ? "none" : "standard";
    paddingModes.right = isNaked ? "none" : "standard";
    paddingModes.top = isNaked ? "noFill" : "standard";
    paddingModes.bottom = isNaked ? "noFill" : "standard";
    paddingModes.internal = "standard";
  } else if (coverPosition === "top" || coverPosition === "bottom") {
    paddingModes.left = isNaked ? "noFill" : "standard";
    paddingModes.right = isNaked ? "noFill" : "standard";
    paddingModes.top = isNaked ? "none" : "standard";
    paddingModes.bottom = isNaked ? "none" : "standard";
    paddingModes.internal = "standard";
  } else if (coverPosition === "background") {
    paddingModes.left = "standard";
    paddingModes.right = "standard";
    paddingModes.top = "standard";
    paddingModes.bottom = "standard";
    paddingModes.internal = "none";
  }

  return {
    isNaked,
    paddingModes,
    stackAlign,
    stackJustify,
  };
}

function calculatePadding(
  padding: string,
  noFillPadding: string,
  paddingMode: PaddingMode
) {
  if (paddingMode === "none") {
    return "0";
  } else if (paddingMode === "noFill") {
    return noFillPadding;
  } else {
    return padding;
  }
}

export function paddingSchemaProp(
  prop: string,
  label: string,
  group: string
): SchemaProp {
  return {
    prop,
    label,
    group,
    type: "space",
    defaultValue: {
      ref: "16",
      value: "16px",
    },
  };
}
