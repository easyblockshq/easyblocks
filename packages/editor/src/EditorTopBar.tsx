import { Devices, Locale } from "@easyblocks/core";
import {
  ButtonGhost,
  Colors,
  Fonts,
  Icons,
  Toggle,
  ToggleGroup,
  ToggleGroupItem,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  Typography,
} from "@easyblocks/design-system";
import React, { ReactNode, useRef, useCallback, memo } from "react";
import styled from "styled-components";
import { useOnClickNTimes } from "./useOnClickNTimes";

export const TOP_BAR_HEIGHT = 40;

const TopBar = styled.div`
  position: relative;
  box-sizing: border-box;
  background-color: white;
  border-bottom: 1px solid #eaeaea;
  padding: 0 64px;
  min-height: ${TOP_BAR_HEIGHT}px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const Label = styled.div`
  background: ${Colors.purple};
  height: 24px;
  ${Fonts.label}
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: 12px;
  padding-right: 12px;
  border-radius: 12px;
  color: white;
`;

const TopBarLeft = styled.div`
  position: absolute;
  top: 0;
  left: 4px;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
`;

const TopBarRight = styled.div`
  position: absolute;
  top: 0;
  right: 8px;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
`;

const TopBarCenter = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

interface EditorTopBarProps {
  saveLabel: string;
  onClose?: () => void;
  onIsEditingChange: () => void;
  viewport: string;
  onViewportChange: (viewport: string) => void;
  devices: Devices;
  isEditing: boolean;
  onUndo: () => void;
  onRedo: () => void;
  locales: Locale[];
  locale: string;
  onLocaleChange: (locale: string) => void;
  onAdminModeChange: (x: boolean) => void;
  hideCloseButton: boolean;
  readOnly: boolean;
}

export const EditorTopBar = memo(
  ({
    onClose,
    onViewportChange,
    devices,
    viewport,
    onIsEditingChange,
    isEditing,
    onUndo,
    onRedo,
    onAdminModeChange,
    hideCloseButton,
    readOnly,
  }: EditorTopBarProps): JSX.Element => {
    const headingRef = useRef<HTMLDivElement>(null);

    const onAdminModeChangeCallback = useCallback(() => {
      onAdminModeChange(true);
    }, [onAdminModeChange]);

    useOnClickNTimes(headingRef, 5, onAdminModeChangeCallback);

    return (
      <TopBar ref={headingRef}>
        <TopBarLeft>
          {!hideCloseButton && (
            <>
              <ButtonGhost
                icon={Icons.Close}
                hideLabel
                onClick={() => {
                  if (onClose) {
                    onClose();
                  }
                }}
              >
                Close
              </ButtonGhost>

              <div
                style={{ height: "100%", background: Colors.black10, width: 1 }}
              />
            </>
          )}

          <ButtonGhost
            icon={Icons.Undo}
            hideLabel
            onClick={() => {
              onUndo();
            }}
          >
            Undo
          </ButtonGhost>

          <ButtonGhost
            icon={Icons.Redo}
            hideLabel
            onClick={() => {
              onRedo();
            }}
          >
            Redo
          </ButtonGhost>

          {readOnly && <Label>Read-Only</Label>}
        </TopBarLeft>

        <TopBarCenter>
          <DeviceSwitch
            devices={devices}
            deviceId={viewport}
            onDeviceChange={onViewportChange}
          />
        </TopBarCenter>

        <TopBarRight>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "6px",
              alignItems: "center",
            }}
          >
            <Typography
              variant={"body"}
              component="label"
              htmlFor="easyblocks-edit-mode-button"
            >
              Edit mode
            </Typography>{" "}
            <Toggle
              name="easyblocks-edit-mode-button"
              checked={isEditing}
              onChange={() => {
                onIsEditingChange();
              }}
            />
          </div>
        </TopBarRight>
      </TopBar>
    );
  }
);

const DEVICE_ID_TO_ICON: Record<
  Devices[number]["id"] | "fit-screen",
  ReactNode
> = {
  xs: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 2.51691H6C5.44772 2.51691 5 2.96463 5 3.51691L5.00005 12.483C5.00005 13.0353 5.44777 13.483 6.00005 13.483H10.0001C10.5523 13.483 11.0001 13.0353 11.0001 12.483L11 3.51691C11 2.96463 10.5523 2.51691 10 2.51691ZM6 1.51691C4.89543 1.51691 4 2.41234 4 3.51691L4.00005 12.483C4.00005 13.5876 4.89548 14.483 6.00005 14.483H10.0001C11.1046 14.483 12.0001 13.5876 12.0001 12.483L12 3.51691C12 2.41234 11.1046 1.51691 10 1.51691H6Z"
        fill="black"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.99548 12.5H7.00452V11.5H8.99548V12.5Z"
        fill="black"
      />
    </svg>
  ),
  sm: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.51694 6.00005L2.51694 10C2.51694 10.5523 2.96466 11 3.51694 11L12.4831 11C13.0353 11 13.4831 10.5523 13.4831 9.99999L13.4831 5.99999C13.4831 5.44771 13.0353 4.99999 12.4831 4.99999L3.51694 5.00005C2.96466 5.00005 2.51694 5.44776 2.51694 6.00005ZM1.51694 10C1.51694 11.1046 2.41238 12 3.51694 12L12.4831 12C13.5876 12 14.4831 11.1046 14.4831 9.99999L14.4831 5.99999C14.4831 4.89542 13.5876 3.99999 12.4831 3.99999L3.51694 4.00005C2.41237 4.00005 1.51694 4.89548 1.51694 6.00005L1.51694 10Z"
        fill="black"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.5 7.00452L12.5 8.99548L11.5 8.99548L11.5 7.00452L12.5 7.00452Z"
        fill="black"
      />
    </svg>
  ),
  md: (
    <svg
      width="16"
      height="18"
      viewBox="0 0 16 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.4918 1.97229L3.50793 1.9723C2.95565 1.9723 2.50793 2.42001 2.50793 2.9723L2.50797 15.0277C2.50797 15.58 2.95569 16.0277 3.50797 16.0277L12.4918 16.0277C13.0441 16.0277 13.4918 15.58 13.4918 15.0277L13.4918 2.97229C13.4918 2.42001 13.0441 1.97229 12.4918 1.97229ZM3.50793 0.972299C2.40337 0.972299 1.50793 1.86773 1.50793 2.9723L1.50797 15.0277C1.50797 16.1323 2.4034 17.0277 3.50797 17.0277L12.4918 17.0277C13.5964 17.0277 14.4918 16.1323 14.4918 15.0277L14.4918 2.97229C14.4918 1.86772 13.5964 0.97229 12.4918 0.97229L3.50793 0.972299Z"
        fill="black"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 14.9777H6V13.9777H10V14.9777Z"
        fill="black"
      />
    </svg>
  ),
  lg: (
    <svg
      width="18"
      height="16"
      viewBox="0 0 18 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.97229 3.50815L1.9723 12.492C1.9723 13.0443 2.42001 13.492 2.9723 13.492L15.0277 13.492C15.58 13.492 16.0277 13.0443 16.0277 12.492L16.0277 3.50812C16.0277 2.95583 15.58 2.50812 15.0277 2.50812L2.97229 2.50815C2.42 2.50815 1.97229 2.95587 1.97229 3.50815ZM0.972299 12.492C0.972299 13.5966 1.86773 14.492 2.9723 14.492L15.0277 14.492C16.1323 14.492 17.0277 13.5965 17.0277 12.492L17.0277 3.50812C17.0277 2.40355 16.1323 1.50812 15.0277 1.50812L2.97229 1.50815C1.86772 1.50815 0.97229 2.40359 0.97229 3.50815L0.972299 12.492Z"
        fill="black"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.9778 6L14.9778 10L13.9778 10L13.9778 6L14.9778 6Z"
        fill="black"
      />
    </svg>
  ),
  xl: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.5111 13.0004L1.48889 13.0004L1.48889 12.0004L14.5111 12.0004V13.0004Z"
        fill="black"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.5828 3.99961H3.41723V9.91598H12.5828V3.99961ZM2.5 2.99961V10.916H13.5V2.99961H2.5Z"
        fill="black"
      />
    </svg>
  ),
  "2xl": (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14 3.00213H2V10.9979H14V3.00213ZM1 2.00213V11.9979H15V2.00213H1Z"
        fill="black"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11 13.9979L5 13.9979V12.9979L11 12.9979V13.9979Z"
        fill="black"
      />
    </svg>
  ),
  "fit-screen": (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14.2872 7.97504L12.2872 5.79322M14.2872 7.97504C14.2872 7.97504 13.0683 9.30481 12.2872 10.1569M14.2872 7.97504L10.0372 7.97504"
        stroke="black"
      />
      <path
        d="M1.79272 7.97503L3.79272 10.1568M1.79272 7.97503C1.79272 7.97503 3.01168 6.64527 3.79272 5.79321M1.79272 7.97503L6.04272 7.97503"
        stroke="black"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.96777 2.52881H12.0323V4.49858H13.0323V1.52881H2.96777V4.49858H3.96777V2.52881ZM3.96777 11.5014H2.96777V14.4712H13.0323V11.5014H12.0323V13.4712H3.96777V11.5014Z"
        fill="black"
      />
    </svg>
  ),
};

interface DeviceSwitchProps {
  devices: Devices;
  deviceId: string;
  onDeviceChange: (deviceId: string) => void;
}

const DeviceSwitch = memo<DeviceSwitchProps>(
  ({ deviceId, devices, onDeviceChange }) => {
    const onChange = useCallback(
      (deviceId: string): void => {
        if (deviceId === "") {
          return;
        }

        onDeviceChange(deviceId);
      },
      [onDeviceChange]
    );

    return (
      <ToggleGroup value={deviceId} onChange={onChange}>
        {devices.map((d) => {
          if (d.hidden) {
            return null;
          }

          return (
            <Tooltip key={d.id}>
              <TooltipTrigger>
                <ToggleGroupItem value={d.id}>
                  {DEVICE_ID_TO_ICON[d.id]}
                </ToggleGroupItem>
              </TooltipTrigger>

              <TooltipContent>
                <Typography color="white">{d.label ?? d.id}</Typography>
              </TooltipContent>
            </Tooltip>
          );
        })}

        <Tooltip>
          <TooltipTrigger>
            <ToggleGroupItem value="fit-screen">
              {DEVICE_ID_TO_ICON["fit-screen"]}
            </ToggleGroupItem>
          </TooltipTrigger>

          <TooltipContent>
            <Typography color="white">Fit screen</Typography>
          </TooltipContent>
        </Tooltip>
      </ToggleGroup>
    );
  }
);
