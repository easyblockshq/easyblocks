import { Devices, Locale } from "@easyblocks/core";
import {
  SSButtonGhost,
  SSButtonPrimary,
  SSColors,
  SSIcons,
  ToggleGroup,
  ToggleGroupItem,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  Typography,
} from "@easyblocks/design-system";
import React, { ReactNode, useRef } from "react";
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
  gap: 8px;
`;

const TopBarCenter = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export const EditorTopBar: React.FC<{
  saveLabel: string;
  onClose?: () => void;
  onIsEditingChange: () => void;
  onBreakpointChange: (breakpoint: string) => void;
  devices: Devices;
  breakpointIndex: string;
  isEditing: boolean;
  onUndo: () => void;
  onRedo: () => void;
  locales: Locale[];
  locale: string;
  onLocaleChange: (locale: string) => void;
  isFullScreen: boolean;
  setFullScreen: (x: boolean) => void;
  onAdminModeChange: (x: boolean) => void;
}> = ({
  onClose,
  onBreakpointChange,
  devices,
  breakpointIndex,
  onIsEditingChange,
  isEditing,
  onUndo,
  onRedo,
  isFullScreen,
  setFullScreen,
  onAdminModeChange,
}) => {
  const headingRef = useRef<HTMLDivElement>(null);

  useOnClickNTimes(headingRef, 5, () => {
    onAdminModeChange(true);
  });

  return (
    <TopBar>
      <TopBarLeft>
        <SSButtonGhost
          icon={SSIcons.Close}
          hideLabel
          onClick={() => {
            if (onClose) {
              onClose();
            }
          }}
        >
          Close
        </SSButtonGhost>
        <div
          style={{ height: "100%", background: SSColors.black10, width: 1 }}
        />
        <SSButtonGhost
          icon={SSIcons.Undo}
          hideLabel
          onClick={() => {
            onUndo();
          }}
        >
          Undo
        </SSButtonGhost>
        <SSButtonGhost
          icon={SSIcons.Redo}
          hideLabel
          onClick={() => {
            onRedo();
          }}
        >
          Redo
        </SSButtonGhost>
      </TopBarLeft>

      <TopBarCenter ref={headingRef}>
        <DeviceSwitch
          devices={devices}
          deviceId={isFullScreen ? "fit-screen" : breakpointIndex}
          onDeviceChange={(deviceId) => {
            if (deviceId === "fit-screen") {
              setFullScreen(true);
              return;
            }

            setFullScreen(false);
            onBreakpointChange(deviceId);
          }}
          isFitScreenEnabled={!isEditing}
        />
      </TopBarCenter>

      <TopBarRight>
        <SSButtonPrimary
          onClick={() => {
            onIsEditingChange();
          }}
        >
          {isEditing ? "Preview" : "Edit"}
        </SSButtonPrimary>

        {/*<SSSelect*/}
        {/*    value={locale}*/}
        {/*    onChange={onLocaleChange}*/}
        {/*>*/}
        {/*  {locales.map((locale) => (*/}
        {/*      <option key={locale.id} value={locale.id}>*/}
        {/*        {locale.id}*/}
        {/*      </option>*/}
        {/*  ))}*/}
        {/*</SSSelect>*/}
      </TopBarRight>
    </TopBar>
  );
};

const DEVICE_ID_TO_ICON: Record<Devices[number]["id"], ReactNode> = {
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
        d="M9.5022 12.5H6.49756V11.5H9.5022V12.5Z"
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
        d="M12.5 6.4978L12.5 9.50244L11.5 9.50244L11.5 6.4978L12.5 6.4978Z"
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
        d="M11.4461 1.97226H4.55383C4.00155 1.97226 3.55383 2.41997 3.55383 2.97226L3.55387 15.0277C3.55387 15.58 4.00159 16.0277 4.55387 16.0277H11.4462C11.9985 16.0277 12.4462 15.58 12.4462 15.0277L12.4462 2.97226C12.4462 2.41997 11.9984 1.97226 11.4461 1.97226ZM4.55383 0.97226C3.44926 0.97226 2.55383 1.86769 2.55383 2.97226L2.55387 15.0277C2.55387 16.1323 3.4493 17.0277 4.55387 17.0277H11.4462C12.5508 17.0277 13.4462 16.1323 13.4462 15.0277L13.4461 2.97226C13.4461 1.86769 12.5507 0.97226 11.4461 0.97226H4.55383Z"
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
        d="M1.97229 4.55388L1.97229 11.4462C1.97229 11.9985 2.42001 12.4462 2.97229 12.4462L15.0277 12.4462C15.58 12.4462 16.0277 11.9984 16.0277 11.4462L16.0277 4.55384C16.0277 4.00156 15.58 3.55384 15.0277 3.55384L2.97229 3.55388C2.42 3.55388 1.97229 4.0016 1.97229 4.55388ZM0.97229 11.4462C0.97229 12.5508 1.86772 13.4462 2.97229 13.4462L15.0277 13.4462C16.1323 13.4462 17.0277 12.5507 17.0277 11.4462L17.0277 4.55384C17.0277 3.44927 16.1323 2.55384 15.0277 2.55384L2.97229 2.55388C1.86772 2.55388 0.97229 3.44931 0.97229 4.55388L0.97229 11.4462Z"
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
};

function DeviceSwitch({
  deviceId,
  devices,
  onDeviceChange,
  isFitScreenEnabled,
}: {
  devices: Devices;
  deviceId: string;
  onDeviceChange: (deviceId: string) => void;
  isFitScreenEnabled: boolean;
}) {
  return (
    <ToggleGroup
      value={deviceId}
      onChange={(deviceId) => {
        if (deviceId === "") {
          return;
        }

        onDeviceChange(deviceId);
      }}
    >
      {devices.map((d) => {
        if (d.hidden) {
          return null;
        }

        return (
          <ToggleGroupItem value={d.id} key={d.id}>
            <Tooltip>
              <TooltipTrigger>{DEVICE_ID_TO_ICON[d.id]}</TooltipTrigger>

              <TooltipContent>
                <Typography color="white">{d.label ?? d.id}</Typography>
              </TooltipContent>
            </Tooltip>
          </ToggleGroupItem>
        );
      })}
      {isFitScreenEnabled && (
        <ToggleGroupItem value="fit-screen">
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
        </ToggleGroupItem>
      )}
    </ToggleGroup>
  );
}
