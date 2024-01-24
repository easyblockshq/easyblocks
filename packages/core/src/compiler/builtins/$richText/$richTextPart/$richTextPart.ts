import { RichTextEditingFunction } from "../$richText.types";
import {
  AnyEditingField,
  CompiledComponentConfig,
  CompiledComponentConfigBase,
  NoCodeComponentEntry,
  NoCodeComponentDefinition,
} from "../../../../types";
import { findPathOfFirstAncestorOfType } from "../../../parsePath";
import { EditableComponentToComponentConfig } from "../../../types";
import { RichTextPartValues, richTextPartStyles } from "./$richTextPart.styles";

const editing: RichTextEditingFunction = ({
  editingInfo,
  __SECRET_INTERNALS__,
}) => {
  if (!__SECRET_INTERNALS__) {
    throw new Error("Missing __SECRET_INTERNALS__");
  }

  const { pathPrefix, editorContext } = __SECRET_INTERNALS__;
  const resultFields: Array<AnyEditingField> = [];

  const richTextPath = findPathOfFirstAncestorOfType(
    pathPrefix,
    "@easyblocks/rich-text",
    editorContext.form
  );

  const richTextBlockPath = findPathOfFirstAncestorOfType(
    pathPrefix,
    "@easyblocks/rich-text-block-element",
    editorContext.form
  );

  resultFields.push(
    {
      type: "fields",
      path: richTextPath,
      filters: {
        group: ["Size", "Margins"],
      },
    },
    {
      type: "field",
      path: `${richTextPath}.align`,
    },
    ...editingInfo.fields,
    {
      type: "field",
      path: `${richTextBlockPath}.type`,
    },
    {
      type: "field",
      path: `${richTextPath}.isListStyleAuto`,
    },
    {
      type: "field",
      path: `${richTextPath}.mainFont`,
    },
    {
      type: "field",
      path: `${richTextPath}.mainColor`,
    },
    {
      type: "fields",
      path: richTextPath,
      filters: {
        group: ["Accessibility and SEO"],
      },
    }
  );

  return {
    fields: resultFields,
  };
};

const richTextPartEditableComponent: NoCodeComponentDefinition<RichTextPartValues> =
  {
    id: "@easyblocks/rich-text-part",
    label: "Text",
    schema: [
      {
        prop: "value",
        type: "string",
        visible: false,
        group: "Text",
      },
      {
        prop: "font",
        label: "Style",
        type: "font",
        group: "Text",
      },
      {
        prop: "color",
        label: "Color",
        type: "color",
        group: "Text",
      },
      {
        prop: "TextWrapper",
        label: "Text Wrapper",
        type: "component",
        noInline: true,
        accepts: ["@easyblocks/text-wrapper"],
        visible: true,
        group: "Text Wrapper",
        isLabelHidden: true,
      },
    ],
    editing,
    styles: richTextPartStyles,
  };

type RichTextPartComponentConfig = EditableComponentToComponentConfig<
  typeof richTextPartEditableComponent
> & {
  value: string;
  color: Record<string, any>;
  font: Record<string, any>;
  TextWrapper: [NoCodeComponentEntry] | [];
};

type RichTextPartCompiledComponentConfig = CompiledComponentConfigBase<
  RichTextPartComponentConfig["_template"],
  {
    value: string;
    color: Record<string, any>;
    font: Record<string, any>;
  }
> & {
  styled: NonNullable<ReturnType<typeof richTextPartStyles>["styled"]>;
  components: {
    Text: Record<string, any>;
    TextWrapper: Array<CompiledComponentConfig>;
  };
};

export { richTextPartEditableComponent };
export type {
  RichTextPartCompiledComponentConfig,
  RichTextPartComponentConfig,
};
