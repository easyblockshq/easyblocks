import { Devices, Locale } from "@easyblocks/core";
import {
  SSButtonGhost,
  SSButtonPrimary,
  SSColors,
  SSIcons,
  ToggleGroup,
  ToggleGroupItem,
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
    <TopBar ref={headingRef}>
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

      <TopBarCenter>
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
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      width={20}
      height={20}
    >
      <path
        fill="#000"
        strokeMiterlimit="10"
        strokeWidth="1"
        d="M63.063 0H26.937a5.098 5.098 0 00-5.098 5.098v79.803a5.098 5.098 0 005.098 5.098h36.126a5.098 5.098 0 005.098-5.098V5.098A5.098 5.098 0 0063.063 0zM38.596 4.419h12.809a.5.5 0 010 1H38.596a.5.5 0 010-1zM45 87.304a2.291 2.291 0 110-4.583 2.291 2.291 0 010 4.583zM65.161 80H24.839V9.374h40.323V80z"
        transform="matrix(2.81 0 0 2.81 1.407 1.407)"
      ></path>
    </svg>
  ),
  sm: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      width={20}
      height={20}
      style={{ transform: "rotate(-90deg)" }}
    >
      <path
        fill="#000"
        strokeMiterlimit="10"
        strokeWidth="1"
        d="M63.063 0H26.937a5.098 5.098 0 00-5.098 5.098v79.803a5.098 5.098 0 005.098 5.098h36.126a5.098 5.098 0 005.098-5.098V5.098A5.098 5.098 0 0063.063 0zM38.596 4.419h12.809a.5.5 0 010 1H38.596a.5.5 0 010-1zM45 87.304a2.291 2.291 0 110-4.583 2.291 2.291 0 010 4.583zM65.161 80H24.839V9.374h40.323V80z"
        transform="matrix(2.81 0 0 2.81 1.407 1.407)"
      ></path>
    </svg>
  ),
  md: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      width={20}
      height={20}
    >
      <g fill="#000" strokeMiterlimit="10" strokeWidth="1">
        <path
          d="M16.819 88.339a3.382 3.382 0 01-3.377-3.378V5.039a3.38 3.38 0 013.377-3.377H73.18a3.382 3.382 0 013.378 3.377v79.922a3.383 3.383 0 01-3.378 3.378H16.819zM45 79.447a4.431 4.431 0 00-4.427 4.426A4.432 4.432 0 0045 88.3a4.431 4.431 0 004.427-4.427A4.432 4.432 0 0045 79.447zM16.819 1.963a3.08 3.08 0 00-3.076 3.076v74.048h62.512V5.039a3.079 3.079 0 00-3.075-3.076H16.819z"
          transform="matrix(2.81 0 0 2.81 1.407 1.407)"
        ></path>
        <path
          d="M74.897 80.749v4.212a1.74 1.74 0 01-1.716 1.716H50.403c.437-.84.685-1.793.685-2.804 0-1.141-.316-2.21-.864-3.124h24.673m-35.121 0a6.048 6.048 0 00-.864 3.124c0 1.01.247 1.964.685 2.804H16.819a1.74 1.74 0 01-1.716-1.716v-4.212h24.673M73.181 0H16.819c-2.771 0-5.039 2.268-5.039 5.039v79.922c0 2.771 2.268 5.039 5.039 5.039H73.18c2.771 0 5.039-2.268 5.039-5.039V5.039C78.22 2.268 75.952 0 73.181 0zM15.405 77.426V5.039c0-.766.648-1.414 1.414-1.414H73.18c.766 0 1.414.647 1.414 1.414v72.387H15.405zM45 86.639a2.765 2.765 0 110-5.53 2.765 2.765 0 010 5.53z"
          transform="matrix(2.81 0 0 2.81 1.407 1.407)"
        ></path>
      </g>
    </svg>
  ),
  lg: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      width={20}
      height={20}
      style={{ transform: "rotate(-90deg)" }}
    >
      <g fill="#000" strokeMiterlimit="10" strokeWidth="1">
        <path
          d="M16.819 88.339a3.382 3.382 0 01-3.377-3.378V5.039a3.38 3.38 0 013.377-3.377H73.18a3.382 3.382 0 013.378 3.377v79.922a3.383 3.383 0 01-3.378 3.378H16.819zM45 79.447a4.431 4.431 0 00-4.427 4.426A4.432 4.432 0 0045 88.3a4.431 4.431 0 004.427-4.427A4.432 4.432 0 0045 79.447zM16.819 1.963a3.08 3.08 0 00-3.076 3.076v74.048h62.512V5.039a3.079 3.079 0 00-3.075-3.076H16.819z"
          transform="matrix(2.81 0 0 2.81 1.407 1.407)"
        ></path>
        <path
          d="M74.897 80.749v4.212a1.74 1.74 0 01-1.716 1.716H50.403c.437-.84.685-1.793.685-2.804 0-1.141-.316-2.21-.864-3.124h24.673m-35.121 0a6.048 6.048 0 00-.864 3.124c0 1.01.247 1.964.685 2.804H16.819a1.74 1.74 0 01-1.716-1.716v-4.212h24.673M73.181 0H16.819c-2.771 0-5.039 2.268-5.039 5.039v79.922c0 2.771 2.268 5.039 5.039 5.039H73.18c2.771 0 5.039-2.268 5.039-5.039V5.039C78.22 2.268 75.952 0 73.181 0zM15.405 77.426V5.039c0-.766.648-1.414 1.414-1.414H73.18c.766 0 1.414.647 1.414 1.414v72.387H15.405zM45 86.639a2.765 2.765 0 110-5.53 2.765 2.765 0 010 5.53z"
          transform="matrix(2.81 0 0 2.81 1.407 1.407)"
        ></path>
      </g>
    </svg>
  ),
  xl: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      width={20}
      height={20}
    >
      <g fill="#000" strokeMiterlimit="10" strokeWidth="1">
        <path
          d="M82.27 17.847a.27.27 0 01.27.27v46.165H7.459V18.117a.27.27 0 01.27-.27H82.27m0-3.083H7.73a3.353 3.353 0 00-3.353 3.353v49.247h81.246V18.117a3.353 3.353 0 00-3.353-3.353zM88.293 70.108a3.42 3.42 0 01-3.421 3.421H5.128a3.42 3.42 0 01-3.421-3.421"
          transform="matrix(2.81 0 0 2.81 1.407 1.407)"
        ></path>
        <path
          d="M84.872 75.236H5.128A5.134 5.134 0 010 70.107h3.414c0 .946.769 1.715 1.714 1.715h79.744c.946 0 1.715-.769 1.715-1.715H90a5.135 5.135 0 01-5.128 5.129z"
          transform="matrix(2.81 0 0 2.81 1.407 1.407)"
        ></path>
      </g>
    </svg>
  ),
  "2xl": (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      width={20}
      height={20}
    >
      <path
        fill="#000"
        fillRule="evenodd"
        strokeMiterlimit="10"
        strokeWidth="1"
        d="M87.238 10.93H2.762A2.763 2.763 0 000 13.692v52.744a2.763 2.763 0 002.762 2.762h31.695c-.614 2.901-1.848 5.803-3.703 8.704a.9.9 0 00.76 1.385H58.487a.9.9 0 00.76-1.385c-1.856-2.901-3.089-5.803-3.703-8.704h31.695a2.763 2.763 0 002.762-2.762V13.692a2.764 2.764 0 00-2.763-2.762zm-.238 3v43.292H3V13.93h84z"
        transform="matrix(2.81 0 0 2.81 1.407 1.407)"
      ></path>
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
            {DEVICE_ID_TO_ICON[d.id]}
          </ToggleGroupItem>
        );
      })}
      {isFitScreenEnabled && (
        <ToggleGroupItem value="fit-screen">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            width={20}
            height={20}
          >
            <path d="M13.28 7.78l3.22-3.22v2.69a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.69l-3.22 3.22a.75.75 0 001.06 1.06zM2 17.25v-4.5a.75.75 0 011.5 0v2.69l3.22-3.22a.75.75 0 011.06 1.06L4.56 16.5h2.69a.75.75 0 010 1.5h-4.5a.747.747 0 01-.75-.75zM12.22 13.28l3.22 3.22h-2.69a.75.75 0 000 1.5h4.5a.747.747 0 00.75-.75v-4.5a.75.75 0 00-1.5 0v2.69l-3.22-3.22a.75.75 0 10-1.06 1.06zM3.5 4.56l3.22 3.22a.75.75 0 001.06-1.06L4.56 3.5h2.69a.75.75 0 000-1.5h-4.5a.75.75 0 00-.75.75v4.5a.75.75 0 001.5 0V4.56z" />
          </svg>
        </ToggleGroupItem>
      )}
    </ToggleGroup>
  );
}
