import { AnyTemplate, isTemplate } from "@easyblocks/app-utils";
import { CompiledShopstoryComponentConfig, Template } from "@easyblocks/core";
import {
  CustomComponentSymbol,
  SSButtonGhostColor,
  SSColors,
  SSFonts,
  SSIcons,
  SSModal,
} from "@easyblocks/design-system";
import React, { useRef } from "react";
import styled from "styled-components";
import { getComponentConfigPreviewImageURL } from "./configComponentPreview";
import { EditorContextType, useEditorContext } from "./EditorContext";
import { getComponentLabelFromTemplate } from "./utils/getComponentLabelFromTemplate";
import { TemplatePicker } from "./TemplatePicker";

export type CompiledEntryParentContext = {
  parent: CompiledShopstoryComponentConfig;
  fieldName: string;
};

type Mode = "large" | "large-3";

type VisualProps = {
  mode: Mode;
};

/**
 * CARD
 */

const CardRoot = styled.div`
  &:hover {
    outline: 1px solid ${SSColors.black10};
    outline-offset: 8px;
  }

  .editButton {
    opacity: 0;
  }

  &:hover {
    .editButton {
      opacity: 1;
    }
  }
`;

const ImageContainer = styled.div<VisualProps>`
  position: relative;
  background-color: ${SSColors.black10};
  margin-bottom: 8px;
  padding-bottom: ${(p) => (p.mode === "large-3" ? "90%" : "60%")};
  cursor: pointer;
`;

const CardImg = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 24px;
  box-sizing: border-box;
`;

const CardImgPlaceholder = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CardFooter = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
`;

const CardLabelContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const CardLabelTemplateName = styled.div`
  ${SSFonts.body};
  color: black;
`;

const Title = styled.div`
  ${SSFonts.label}
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: center;
  margin-bottom: 24px;
`;

const Message = styled.div`
  padding-top: 32px;
  ${SSFonts.body};
`;

type SectionCardProps = {
  template: AnyTemplate;
  onSelect: () => void;
  mode: Mode;
};

const TemplateLabelRoot = styled.div`
  display: flex;
  flex-direction: row;
  gap: 6px;
  align-items: center;
`;

const TemplateLabelTitle = styled.div<{ custom?: boolean }>`
  ${SSFonts.body};
  line-height: 1;
  color: ${(p) => (p.custom ? SSColors.purple : SSColors.black40)};
`;

function TemplateLabel(props: { label: string; custom?: boolean }) {
  return (
    <TemplateLabelRoot>
      {props.custom && <CustomComponentSymbol />}
      <TemplateLabelTitle custom={props.custom}>
        {props.label}
      </TemplateLabelTitle>
    </TemplateLabelRoot>
  );
}

function getTemplatePreviewImage(
  template: AnyTemplate,
  editorContext: EditorContextType
): string | undefined {
  if (!isTemplate(template)) {
    return;
  }

  // template.previewImage is always most important and overrides other sources of preview
  if (template.thumbnail) {
    return template.thumbnail;
  }

  // TODO: not only access token is important here but also information if user is authorised (access token correct)
  if (!editorContext.project) {
    return;
  }

  return;

  // if (template.configId) {
  //   return getComponentConfigPreviewImageURL({
  //     configId: template.configId,
  //     contextParams: editorContext.contextParams,
  //     locales: editorContext.locales,
  //     project: editorContext.project,
  //   });
  // }
}

const SectionCard: React.FC<SectionCardProps> = ({
  template,
  onSelect,
  mode,
}) => {
  const imageRef = useRef(null);
  const editorContext = useEditorContext();

  const isCustom =
    isTemplate(template) && !template.config._template.startsWith("$");

  const previewImage = getTemplatePreviewImage(template, editorContext);

  return (
    <CardRoot>
      <ImageContainer ref={imageRef} onClick={onSelect} mode={mode}>
        {previewImage && <CardImg src={previewImage} />}
        {!previewImage && (
          <CardImgPlaceholder>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M8.18102 5.39789L6.89683 10.3512L7.86482 10.6022L9.14901 5.64885L8.18102 5.39789Z"
                fill={SSColors.black20}
              />
              <path
                d="M9.38171 6.1215L11.1837 7.92352L9.38172 9.72549L10.0888 10.4326L12.5979 7.92353L10.0888 5.4144L9.38171 6.1215Z"
                fill={SSColors.black20}
              />
              <path
                d="M6.54828 6.11507L4.80393 7.92352L6.54828 9.73192L5.82854 10.4262L3.41455 7.92353L5.82853 5.42083L6.54828 6.11507Z"
                fill={SSColors.black20}
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M2 3C2 2.44772 2.44772 2 3 2H13C13.5523 2 14 2.44772 14 3V13C14 13.5523 13.5523 14 13 14H3C2.44772 14 2 13.5523 2 13V3ZM3 3H13V13H3L3 3Z"
                fill={SSColors.black20}
              />
            </svg>
          </CardImgPlaceholder>
        )}
      </ImageContainer>

      <CardFooter>
        <CardLabelContainer>
          <>
            {template.label && (
              <>
                <CardLabelTemplateName>{template.label}</CardLabelTemplateName>
                {/*<div*/}
                {/*  style={{*/}
                {/*    lineHeight: 1,*/}
                {/*    color: SSColors.black40,*/}
                {/*    paddingTop: 2,*/}
                {/*  }}*/}
                {/*>*/}
                {/*  &nbsp;&nbsp;·&nbsp;&nbsp;*/}
                {/*</div>*/}
              </>
            )}
            {/*<TemplateLabel*/}
            {/*  label={getComponentLabelFromTemplate(template, editorContext)}*/}
            {/*  custom={isCustom}*/}
            {/*/>*/}
          </>
        </CardLabelContainer>

        <div></div>

        {isTemplate(template) && template.isUserDefined && (
          <SSButtonGhostColor
            className={"editButton"}
            onClick={() => {
              editorContext.actions.openTemplateModal({
                mode: "edit",
                template: template as Template,
              });
            }}
          >
            Edit
          </SSButtonGhostColor>
        )}
      </CardFooter>
    </CardRoot>
  );
};

/**
 * MODAL
 */

const ModalRoot = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 200px 1fr;
`;

const ModalGridRoot = styled.div<VisualProps>`
  display: grid;
  grid-template-columns: ${(p) =>
    p.mode === "large-3" ? "1fr 1fr 1fr" : "1fr 1fr"};
  grid-column-gap: 16px;
  grid-row-gap: 30px;
`;

type SectionPickerModalProps = {
  isOpen: boolean;
  onClose?: () => void;
  parentContext?: CompiledEntryParentContext;
  noRefs?: boolean;
  componentTypes: string[];
};

const Sidebar = styled.div`
  overflow-y: hidden;
  overflow-x: hidden;
  border-right: 1px solid ${SSColors.black5};
  height: 100%;
`;

const SidebarContent = styled.div`
  padding: 24px 4px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SidebarButton = styled.button`
  all: unset;
  height: 38px;
  ${SSFonts.body}
  display: flex;
  padding-left: 16px;
  align-items: center;
  &:hover {
    background: ${SSColors.black5};
  }
  cursor: pointer;
`;

const GridRoot = styled.div`
  padding: 0px 16px;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
`;

export const SectionPickerModal: TemplatePicker<{ mode?: Mode }> = ({
  isOpen,
  onClose,
  templates,
  mode = "large",
}) => {
  const templateGroups = templates;

  // > = {};
  //
  // const NO_CATEGORY_LABEL = "-- NO CATEGORY --";
  // (templates ?? []).forEach((template) => {
  //   const groupName = template.group ?? NO_CATEGORY_LABEL;
  //   if (!templateGroups[groupName]) {
  //     templateGroups[groupName] = {
  //       templates: [],
  //     };
  //   }
  //
  //   if (isTemplate(template) && template.isGroupEmptyTemplate) {
  //     templateGroups[groupName].empty = template;
  //   } else {
  //     templateGroups[groupName].templates.push(template);
  //   }
  // });
  //
  // // Let's move no category to the bottom
  // const noCategoryGroup = templateGroups[NO_CATEGORY_LABEL];
  // if (noCategoryGroup) {
  //   delete templateGroups[NO_CATEGORY_LABEL];
  //   templateGroups[NO_CATEGORY_LABEL] = noCategoryGroup;
  // }

  const gridRootRef = useRef<HTMLDivElement>(null);

  const templateSelected = (template: Template) => {
    if (onClose) {
      onClose(template);
    }
  };

  return (
    <SSModal
      noPadding={true}
      title={"Pick section"}
      isOpen={isOpen}
      onRequestClose={() => {
        if (onClose) {
          onClose();
        }
      }}
      mode={"center-huge"}
      headerLine={true}
    >
      <ModalRoot>
        <Sidebar>
          {templateGroups && (
            <SidebarContent>
              {Object.entries(templateGroups).map(
                ([
                  componentId,
                  {
                    component: { label },
                  },
                ]) => (
                  <SidebarButton
                    key={`sectionPicker__group__${componentId}`}
                    onClick={() => {
                      const groupNode = document.getElementById(
                        `sectionPicker__group__${componentId}`
                      );
                      const groupOffsetTop = groupNode!.offsetTop;
                      gridRootRef.current!.scrollTo({
                        top: groupOffsetTop,
                        behavior: "smooth",
                      });
                    }}
                  >
                    {label ?? componentId}
                  </SidebarButton>
                )
              )}
            </SidebarContent>
          )}
        </Sidebar>
        <GridRoot ref={gridRootRef}>
          {templates === undefined && <Message>Loading...</Message>}

          {templateGroups &&
            Object.entries(templateGroups).map(
              (
                [
                  componentId,
                  {
                    component: { label },
                    templates,
                  },
                ],
                index
              ) => (
                <div
                  style={{ paddingTop: "32px", paddingBottom: "32px" }}
                  id={`sectionPicker__group__${componentId}`}
                  key={`sectionPicker__group__${componentId}`}
                >
                  <TitleContainer>
                    <Title>{label ?? componentId}</Title>
                    {/*{groupTemplates.empty && (*/}
                    {/*  <SSButtonGhostColor*/}
                    {/*    icon={SSIcons.Add}*/}
                    {/*    onClick={() => {*/}
                    {/*      templateSelected(groupTemplates.empty!);*/}
                    {/*    }}*/}
                    {/*  >*/}
                    {/*    Add empty*/}
                    {/*  </SSButtonGhostColor>*/}
                    {/*)}*/}
                  </TitleContainer>
                  <ModalGridRoot mode={mode}>
                    {templates.map((template, index) => (
                      <SectionCard
                        key={index}
                        template={template}
                        onSelect={() => {
                          templateSelected(template);
                        }}
                        mode={mode}
                      />
                    ))}
                  </ModalGridRoot>
                </div>
              )
            )}
        </GridRoot>
      </ModalRoot>
    </SSModal>
  );
};
