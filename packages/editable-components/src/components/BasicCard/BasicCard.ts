import {
  BooleanSchemaProp,
  ComponentSchemaProp,
  NoCodeComponentDefinition,
  SchemaProp,
  StringTokenSchemaProp,
} from "@easyblocks/core";
import { borderSchemaProps } from "../../borderHelpers";
import { EdgeCompiledValues } from "../../common.types";
import {
  arePaddingFieldsSeparate,
  basicCardController,
} from "./BasicCard.controller";
import basicCardStyles from "./BasicCard.styles";
import { BasicCardCompiledValues } from "./BasicCard.types";

export const basicCardDefinition: NoCodeComponentDefinition<
  BasicCardCompiledValues,
  EdgeCompiledValues & Record<string, any>
> = {
  id: "$BasicCard",
  label: "Banner Stack",
  pasteSlots: ["Stack"],
  styles: basicCardStyles,
  editing: ({ values, params, editingInfo }) => {
    const { paddingFields, hideContent, noBorders, enableContent, ignoreSize } =
      basicCardController({ values, params });

    const fields = Object.fromEntries(
      editingInfo.fields.map((f) => [f.path, f])
    );

    if (/*noBackground || */ ignoreSize) {
      fields.size.visible = false;
    }

    fields.paddingLeft.visible = false;
    fields.paddingRight.visible = false;
    fields.paddingTop.visible = false;
    fields.paddingBottom.visible = false;
    fields.paddingTopExternal.visible = false;
    fields.paddingBottomExternal.visible = false;
    fields.paddingLeftExternal.visible = false;
    fields.paddingRightExternal.visible = false;

    fields.cornerRadius.visible = !noBorders;
    borderSchemaProps("whatever").forEach((schemaProp) => {
      if (noBorders) {
        fields[schemaProp.prop].visible = false;
      }
    });

    if (arePaddingFieldsSeparate(paddingFields.vertical)) {
      if (paddingFields.vertical.start === "internal") {
        fields.paddingTop.visible = true;
      } else if (paddingFields.vertical.start === "external") {
        fields.paddingTopExternal.visible = true;
      }

      if (paddingFields.vertical.end === "internal") {
        fields.paddingBottom.visible = true;
      } else if (paddingFields.vertical.end === "external") {
        fields.paddingBottomExternal.visible = true;
      }
    } else {
      if (paddingFields.vertical.both === "internal") {
        fields.paddingTop.visible = true;
        fields.paddingTop.label = "Padding vertical";
      } else if (paddingFields.vertical.both === "external") {
        fields.paddingTopExternal.visible = true;
        fields.paddingTopExternal.label = "Padding vertical";
      }
    }

    if (arePaddingFieldsSeparate(paddingFields.horizontal)) {
      if (paddingFields.horizontal.start === "internal") {
        fields.paddingLeft.visible = true;
      } else if (paddingFields.horizontal.start === "external") {
        fields.paddingLeftExternal.visible = true;
      }

      if (paddingFields.horizontal.end === "internal") {
        fields.paddingRight.visible = true;
      } else if (paddingFields.horizontal.end === "external") {
        fields.paddingRightExternal.visible = true;
      }
    } else {
      if (paddingFields.horizontal.both === "internal") {
        fields.paddingLeft.visible = true;
        fields.paddingLeft.label = "Padding horizontal";
      } else if (paddingFields.horizontal.both === "external") {
        fields.paddingLeftExternal.visible = true;
        fields.paddingLeftExternal.label = "Padding horizontal";
      }
    }

    const myFields = [...editingInfo.fields];

    // If hideContent, we must hide the switch
    if (hideContent) {
      fields.enableContent.visible = false;
    }

    if (hideContent || !enableContent) {
      editingInfo.fields.forEach((field) => {
        if (field.group === "Stack" && field.path !== "enableContent") {
          field.visible = false;
        }
      });
    }

    return {
      fields: myFields,
      components: {
        Background: {
          selectable: false,
        },
        Stack: {
          selectable: false,
        },
      },
    };
  },
  schema: [
    {
      prop: "size", // main image size
      label: "Size",
      type: "stringToken",
      params: {
        tokenId: "aspectRatios",
        extraValues: [
          { value: "fit-background", label: "Fit Background" },
          { value: "fit-content", label: "Fit content" },
        ],
      },
      group: "General",
    },
    {
      prop: "Background",
      label: "Background",
      type: "component",
      accepts: ["$backgroundColor", "$image", "$video", "$vimeoPlayer"],
      visible: true,
      group: "Background",
    },

    ...borderSchemaProps("Border and shadow"),

    {
      prop: "cornerRadius",
      label: "Corner radius",
      type: "select",
      responsive: true,
      params: {
        options: Array.from(Array(30).keys()).map((x) => x.toString()),
      },
      group: "Border and shadow",
    },

    {
      prop: "enableContent",
      label: "Visible",
      type: "boolean",
      defaultValue: true,
      group: "Stack",
      visible: false,
    },

    {
      prop: "position",
      label: "Position",
      type: "position",
      group: "Stack",
    },

    // Standard offsets
    {
      prop: "paddingLeft",
      label: "Padding left",
      type: "space",
      group: "Stack",
      defaultValue: {
        value: "24px",
        ref: "24",
      },
    },
    {
      prop: "paddingRight",
      label: "Padding right",
      type: "space",
      group: "Stack",
      defaultValue: {
        value: "24px",
        ref: "24",
      },
    },
    {
      prop: "paddingTop",
      label: "Padding top",
      type: "space",
      group: "Stack",
      defaultValue: {
        value: "24px",
        ref: "24",
      },
    },
    {
      prop: "paddingBottom",
      label: "Padding bottom",
      type: "space",
      group: "Stack",
      defaultValue: {
        value: "24px",
        ref: "24",
      },
    },
    {
      prop: "paddingLeftExternal",
      label: "Padding left",
      type: "space",
      group: "Stack",
      defaultValue: {
        value: "0px",
        ref: "0",
      },
    },
    {
      prop: "paddingRightExternal",
      label: "Padding right",
      type: "space",
      group: "Stack",
      defaultValue: {
        value: "0px",
        ref: "0",
      },
    },
    {
      prop: "paddingTopExternal",
      label: "Padding top",
      type: "space",
      group: "Stack",
      defaultValue: {
        value: "0px",
        ref: "0",
      },
    },
    {
      prop: "paddingBottomExternal",
      label: "Padding bottom",
      type: "space",
      group: "Stack",
      defaultValue: {
        value: "0px",
        ref: "0",
      },
    },

    {
      prop: "edgeMarginProtection",
      label: "Snap to container margin",
      type: "boolean",
      responsive: true,
      defaultValue: true,
      group: "Stack",
    },

    // {
    //   prop: "edgeMargin",
    //   label: "Edge margin",
    //   type: "space",
    //   extraValues: ["edge"],
    //   group: "Properties",
    // },

    {
      prop: "Stack",
      label: "Stack",
      type: "component",
      accepts: ["$stack"],
      required: true,
    },
  ],
};

// Let's build basic background card schema
const basicBackgroundCardSchema: SchemaProp[] = [...basicCardDefinition.schema];

// extra values don't have "fit-background"
const sizeSchemaPropIndex = basicBackgroundCardSchema.findIndex(
  (schemaProp) => schemaProp.prop === "size"
);

basicBackgroundCardSchema[sizeSchemaPropIndex] = {
  ...basicBackgroundCardSchema[sizeSchemaPropIndex],
  params: {
    ...(basicBackgroundCardSchema[sizeSchemaPropIndex] as StringTokenSchemaProp)
      .params,
    extraValues: [{ value: "fit-background", label: "Fit Background" }],
  },
} as StringTokenSchemaProp;

// sizeSchemaProp.extraValues = ["grid-baseline", "fit-background"];

// background is required
const backgroundSchemaPropIndex = basicBackgroundCardSchema.findIndex(
  (schemaProp) => schemaProp.prop === "Background"
);

basicBackgroundCardSchema[backgroundSchemaPropIndex] = {
  ...basicBackgroundCardSchema[backgroundSchemaPropIndex],
  required: true,
} as ComponentSchemaProp;

// enable content
const enableContentSchemaPropIndex = basicBackgroundCardSchema.findIndex(
  (schemaProp) => schemaProp.prop === "enableContent"
);

basicBackgroundCardSchema[enableContentSchemaPropIndex] = {
  ...basicBackgroundCardSchema[enableContentSchemaPropIndex],
  visible: true,
  defaultValue: true,
} as BooleanSchemaProp;

export const basicBackgroundCardDefinition: NoCodeComponentDefinition<
  BasicCardCompiledValues,
  EdgeCompiledValues & Record<string, any>
> = {
  ...basicCardDefinition,
  id: "$BasicCardBackground",
  schema: basicBackgroundCardSchema,
  label: "Banner cover",
};
