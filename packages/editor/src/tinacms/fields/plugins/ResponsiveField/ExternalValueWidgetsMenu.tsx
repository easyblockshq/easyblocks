import { ResourceDefinition } from "@easyblocks/core";
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuTrigger,
  SSButtonGhost,
  SSIcons,
  Typography,
} from "@easyblocks/design-system";
import React, { useState } from "react";
import { FieldLabelIconWrapper } from "../wrapFieldWithMeta";

export function ExternalValueWidgetsMenu({
  selectedWidgetId,
  widgets,
  onChange,
  icon,
}: {
  selectedWidgetId: string | undefined;
  widgets: Array<ResourceDefinition["widgets"][number]>;
  onChange: (widgetId: string) => void;
  icon?: string;
}) {
  const [internalSelectedWidgetId, setInternalSelectedWidgetId] = useState<
    string | undefined
  >(() => {
    if (selectedWidgetId !== undefined) {
      return selectedWidgetId;
    }

    return widgets[0]?.id;
  });

  const isControlled = selectedWidgetId !== undefined;

  const widgetId = isControlled ? selectedWidgetId : internalSelectedWidgetId;

  function handleWidgetIdChange(widgetId: string) {
    if (isControlled) {
      setInternalSelectedWidgetId(widgetId);
    }

    onChange(widgetId);
  }

  const selectedWidget = widgets.find((v) => v.id === widgetId);

  return (
    <Menu>
      <FieldLabelIconWrapper>
        <MenuTrigger>
          <SSButtonGhost>
            {icon !== undefined && (
              <span
                css={`
                  display: flex;
                  margin-left: 8px;

                  svg {
                    width: 14px;
                    height: 14px;
                    flex-shrink: 0;
                  }
                `}
                dangerouslySetInnerHTML={{ __html: icon }}
              ></span>
            )}
            {selectedWidget
              ? selectedWidget.label ?? selectedWidget.id
              : "Select widget"}
            <SSIcons.ChevronDown size={16} />
          </SSButtonGhost>
        </MenuTrigger>
      </FieldLabelIconWrapper>
      <MenuContent>
        {widgets.map((widget) => {
          return (
            <MenuItem
              key={widget.id}
              onClick={() => {
                if (widget.id === selectedWidgetId) {
                  return;
                }

                handleWidgetIdChange(widget.id);
              }}
            >
              <Typography
                color={
                  selectedWidget && selectedWidget.id === widget.id
                    ? "black20"
                    : "white"
                }
              >
                {widget.label ?? widget.id}
              </Typography>
            </MenuItem>
          );
        })}
      </MenuContent>
    </Menu>
  );
}
