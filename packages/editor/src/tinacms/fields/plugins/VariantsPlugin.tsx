import {
  Component$$$SchemaProp,
  Form,
  FormApi,
  InternalField,
  Variants$$$SchemaProp,
} from "@easyblocks/app-utils";
import {
  ComponentFixedSchemaProp,
  ComponentSchemaProp,
  ConfigComponent,
} from "@easyblocks/core";
import {
  SSButtonGhostColor,
  SSColors,
  SSFonts,
  SSIcons,
} from "@easyblocks/design-system";
import React from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import styled, { css } from "styled-components";
import { useEditorContext } from "../../../EditorContext";
import { FieldMixedValue } from "../../../types";
import { FieldRenderProps } from "../../form-builder";
import { TrashIcon } from "../../icons";

interface VariantsDefinition extends InternalField {
  component: "variant";
  schemaProp:
    | ComponentSchemaProp
    | ComponentFixedSchemaProp
    | Component$$$SchemaProp
    | Variants$$$SchemaProp;
}

interface VariantsProps
  extends FieldRenderProps<ConfigComponent[] | FieldMixedValue> {
  field: VariantsDefinition;
  form: FormApi;
  tinaForm: Form;
}

const VariantsList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  list-style: none;
  padding: 0;
  margin: 1rem;
`;

const VariantListItem = styled.li<{ isActive: boolean }>`
  padding: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 0.25rem;
  border: 1px solid
    ${(props) => (props.isActive ? SSColors.blue50 : SSColors.black10)};
`;

const VariantItem: React.FC<{
  id: string;
  index: number;
  isActive: boolean;
  onClick: React.MouseEventHandler<HTMLLIElement>;
  children: React.ReactNode;
}> = ({ id, index, isActive, onClick, children }) => {
  return (
    <Draggable draggableId={id} key={id} index={index}>
      {(draggableProvided) => (
        <VariantListItem
          isActive={isActive}
          onClick={onClick}
          ref={draggableProvided.innerRef}
          {...draggableProvided.draggableProps}
          {...draggableProvided.dragHandleProps}
        >
          {children}
        </VariantListItem>
      )}
    </Draggable>
  );
};

const isVariant = (
  config: any
): config is { _id: string; _variantGroupId: string } => {
  return config !== null || "_variantGroupId" in (config ?? {});
};

const VariantsComponent = ({ field, input }: VariantsProps) => {
  const { variantsManager } = useEditorContext();

  if (!variantsManager) {
    return null;
  }

  const {
    getVariantsGroup,
    reorderVariant,
    selectVariant,
    removeVariant,
    openAddVariantModal,
    openEditVariantModal,
  } = variantsManager;

  const currentVariant: ConfigComponent | null = (() => {
    if (field.schemaProp.type === "variants$$$") {
      return input.value || null;
    } else {
      // @ts-ignore it's safe
      return input.value[0] || null;
    }
  })();

  if (!isVariant(currentVariant)) {
    return null;
  }

  const variantGroupId = currentVariant._variantGroupId;

  const variants = getVariantsGroup(variantGroupId);

  const path = Array.isArray(field.name) ? field.name[0] : field.name;

  return (
    <>
      {variants.length > 0 && (
        <DragDropContext
          onDragEnd={(result) => {
            reorderVariant(
              variantGroupId,
              result.source.index,
              result?.destination?.index
            );
          }}
        >
          <Droppable droppableId="variants">
            {(provided) => (
              <VariantsList
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {variants.map(({ variantId, name, description }, index) => (
                  <VariantItem
                    key={variantId}
                    id={variantId}
                    index={index}
                    isActive={currentVariant._id === variantId}
                    onClick={() => {
                      selectVariant(variantId, path);
                    }}
                  >
                    <VariantInfo title={`${name} - ${description}`}>
                      <VariantName>{name}</VariantName>
                      {description && (
                        <VariantDescription>{description}</VariantDescription>
                      )}
                    </VariantInfo>
                    <VariantActions>
                      <SSButtonGhostColor
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          openEditVariantModal(variantId, variantGroupId, path);
                        }}
                      >
                        Edit
                      </SSButtonGhostColor>
                      <SSButtonGhostColor
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          removeVariant(variantId, variantGroupId, path);
                        }}
                      >
                        <TrashIcon />
                      </SSButtonGhostColor>
                    </VariantActions>
                  </VariantItem>
                ))}
                {provided.placeholder}
              </VariantsList>
            )}
          </Droppable>
        </DragDropContext>
      )}
      <AddVariant>
        <SSButtonGhostColor
          onClick={() => {
            openAddVariantModal(currentVariant, path);
          }}
        >
          <SSIcons.Add /> Add Variant
        </SSButtonGhostColor>
      </AddVariant>
    </>
  );
};

const VariantInfo = styled.div`
  flex: 1 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const VariantDescription = styled.div`
  ${SSFonts.body}
  color: ${SSColors.black40};
  text-overflow: ellipsis;
  overflow: hidden;
`;

const VariantName = styled.span<{ error?: boolean }>`
  flex: 1 1 auto;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: all 85ms ease-out;
  text-align: left;

  ${SSFonts.label};

  ${(props) =>
    props.error &&
    css`
      color: var(--tina-color-error) !important;
    `};
`;

const VariantActions = styled.div`
  flex: 0 0;
  display: flex;
`;

const AddVariant = styled.div`
  margin: 1rem;
`;

export const VariantsPlugin = {
  __type: "variant",
  name: "variant",
  Component: VariantsComponent,
};
