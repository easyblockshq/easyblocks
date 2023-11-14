import {
  Component$$$SchemaProp,
  findComponentDefinition,
  Form,
  FormApi,
  InternalField,
  isConfigPathRichTextPart,
} from "@easyblocks/app-utils";
import { ComponentSchemaProp, ConfigComponent } from "@easyblocks/core";
import {
  SSButtonGhost,
  SSColors,
  SSFonts,
  SSIcons,
  ThumbnailButton,
  ThumbnailType,
  Typography,
} from "@easyblocks/design-system";
import { dotNotationGet, toArray } from "@easyblocks/utils";
import React from "react";
import ReactDOM from "react-dom";
import styled, { css } from "styled-components";
import { buildTinaFields } from "../../../buildTinaFields";
import { useEditorContext } from "../../../EditorContext";
import { useEditorExternalData } from "../../../EditorExternalDataProvider";
import { SidebarFooter } from "../../../SidebarFooter";
import { FieldMixedValue } from "../../../types";
import { FieldRenderProps, FieldsBuilder } from "../../form-builder";
import { mergeCommonFields } from "../../form-builder/utils/mergeCommonFields";
import { isMixedFieldValue } from "../components/isMixedFieldValue";
import { GroupPanel, PanelBody } from "./GroupFieldPlugin";

export interface BlocksFieldDefinition extends InternalField {
  component: "ss-block";
  schemaProp: ComponentSchemaProp | Component$$$SchemaProp;
}

interface BlockFieldProps
  extends FieldRenderProps<ConfigComponent[] | FieldMixedValue> {
  field: BlocksFieldDefinition;
  form: FormApi;
  tinaForm: Form;
  isLabelHidden?: boolean;
}

const BlockField = ({ field, input, isLabelHidden }: BlockFieldProps) => {
  const [isSubcomponentPanelExpanded, setIsSubcomponentPanelExpanded] =
    React.useState(false);
  const editorContext = useEditorContext();
  const { actions } = editorContext;
  const { openComponentPicker } = actions;
  const isMixed = isMixedFieldValue(input.value);

  const config: ConfigComponent | null = (() => {
    if (isMixed) {
      return null;
    }

    // @ts-expect-error We can safely ignore the error since we know the value is not mixed
    return input.value[0] || null;
  })();

  const normalizedName = toArray(field.name);
  // Let's create paths
  const paths = normalizedName.map((x) => `${x}.0`);
  const componentPickerPath = normalizedName[0];

  return (
    <>
      {!isLabelHidden && (
        <div
          css={css`
            display: flex;
            align-items: center;
            padding: 4px 16px;
            min-height: 28px;
          `}
        >
          <Typography>{field.label || field.name}</Typography>
        </div>
      )}
      <div
        css={css`
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 4px 16px;
        `}
      >
        {config !== null && (
          <>
            <div style={{ flex: "1 1 auto", minWidth: 0 }}>
              <SubComponentPanelButton
                paths={paths}
                isExpanded={isSubcomponentPanelExpanded}
                onExpand={() => {
                  setIsSubcomponentPanelExpanded(true);
                }}
                onCollapse={() => {
                  setIsSubcomponentPanelExpanded(false);
                }}
              />
            </div>
            {!field.schemaProp.required && (
              <div style={{ flex: "0 0 auto", minWidth: 0 }}>
                <SSButtonGhost
                  onClick={() => {
                    if (
                      editorContext.focussedField.some(isConfigPathRichTextPart)
                    ) {
                      input.onChange([]);
                    } else {
                      actions.removeItems(paths);
                    }
                  }}
                  icon={SSIcons.Remove}
                  aria-label="Remove"
                />
              </div>
            )}
          </>
        )}

        {config === null &&
          (isMixed ? (
            <ThumbnailButton label={"Mixed"} disabled={true} />
          ) : (
            <AddButton
              onAdd={() => {
                openComponentPicker({ path: componentPickerPath }).then(
                  (newConfig) => {
                    if (newConfig) {
                      if (
                        editorContext.focussedField.some(
                          isConfigPathRichTextPart
                        )
                      ) {
                        input.onChange([newConfig]);
                      } else {
                        actions.replaceItems(paths, newConfig);
                      }

                      setIsSubcomponentPanelExpanded(true);
                    }
                  }
                );
              }}
            />
          ))}
      </div>
    </>
  );
};

interface AddButtonProps {
  onAdd: () => void;
}

function AddButton({ onAdd }: AddButtonProps) {
  return (
    <SSButtonGhost
      css={css`
        width: 100%;
        padding-left: 0;
      `}
      onClick={onAdd}
      height={"32px"}
      noPadding
    >
      <div
        css={css`
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
        `}
      >
        <div
          css={css`
            display: grid;
            place-items: center;
            width: 32px;
            height: 32px;
            margin-left: -1px;
            border: 1px dashed ${SSColors.black20};
            border-radius: 2px;
          `}
        >
          <SSIcons.Add size={16} />
        </div>
        Add
      </div>
    </SSButtonGhost>
  );
}

interface SubComponentPanelButtonProps {
  paths: string[];
  isExpanded: boolean;
  onExpand: () => void;
  onCollapse: () => void;
}

const SubComponentPanelButton = ({
  paths,
  isExpanded,
  onExpand,
  onCollapse,
}: SubComponentPanelButtonProps) => {
  const sidebarPanelsRoot = document.getElementById("sidebar-panels-root");
  const editorContext = useEditorContext();
  const externalData = useEditorExternalData();

  const config = dotNotationGet(editorContext.form.values, paths[0]);
  const componentDefinition = findComponentDefinition(config, editorContext);
  const label =
    componentDefinition?.label ??
    componentDefinition?.id ??
    `Shopstory can’t find custom component with id: ${config._template} in your project. Please contact your developers to resolve this issue.`;
  const showError = componentDefinition === undefined;

  const sidebarPreview =
    componentDefinition?.getEditorSidebarPreview?.(
      config,
      externalData,
      editorContext
    ) ?? {};

  const defaultThumbnail: ThumbnailType | undefined =
    componentDefinition?.thumbnail
      ? { type: "image", src: componentDefinition.thumbnail }
      : undefined;
  const thumbnail: ThumbnailType | undefined =
    sidebarPreview.thumbnail ?? defaultThumbnail;
  const description: string | undefined = sidebarPreview.description;

  return showError ? (
    <Error>{label}</Error>
  ) : (
    <>
      <ThumbnailButton
        onClick={onExpand}
        label={label}
        description={description}
        thumbnail={thumbnail}
      />

      {sidebarPanelsRoot &&
        ReactDOM.createPortal(
          <Panel
            isExpanded={isExpanded}
            onCollapse={onCollapse}
            paths={paths}
          />,
          sidebarPanelsRoot
        )}
    </>
  );
};

const Error = styled.div`
  ${SSFonts.body}
  padding: 7px 6px 7px;
  color: hsl(0deg 0% 50% / 0.8);
  white-space: normal;
  background: hsl(0deg 100% 50% / 0.2);
  margin-right: 10px;
  border-radius: 2px;
`;

interface PanelProps {
  onCollapse(): void;
  isExpanded: boolean;
  paths: string[];
}

export const PanelContext = React.createContext<
  { onClose: () => void } | undefined
>(undefined);

function Panel({ onCollapse, isExpanded, paths }: PanelProps) {
  const editorContext = useEditorContext();

  const fields: Array<InternalField> = React.useMemo(() => {
    if (!isExpanded) {
      return [];
    }

    const fieldsPerName = toArray(paths).map((path) => {
      return buildTinaFields(path, editorContext);
    });

    const mergedFields = mergeCommonFields({
      fields: fieldsPerName,
    });

    return mergedFields;
  }, [isExpanded, paths]);

  return (
    <PanelContext.Provider
      value={{
        onClose: onCollapse,
      }}
    >
      <GroupPanel isExpanded={isExpanded}>
        <PanelBody>
          {isExpanded ? (
            <div>
              <FieldsBuilder form={editorContext.form} fields={fields} />
              <SidebarFooter paths={paths} />
            </div>
          ) : null}
        </PanelBody>
      </GroupPanel>
    </PanelContext.Provider>
  );
}

export const BlockFieldPlugin = {
  __type: "field",
  name: "ss-block",
  Component: BlockField,
};
