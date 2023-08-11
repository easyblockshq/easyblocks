import { Audience, Devices, Locale } from "@easyblocks/core";
import {
  SSButtonGhost,
  SSButtonPrimary,
  SSColors,
  SSFonts,
  SSIcons,
  SSSelect,
} from "@easyblocks/design-system";
import { useUser } from "@supabase/auth-helpers-react";
import React, { useRef } from "react";
import styled from "styled-components";
import { useOnClickNTimes } from "./useOnClickNTimes";
import { AudiencePicker } from "./variants";

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

const Heading = styled.div`
  ${SSFonts.body};
  user-select: none;
`;

export const EditorTopBar: React.FC<{
  title: string;
  saveLabel: string;
  onClose?: () => void;
  onIsEditingChange: () => void;
  // handleSetMode: (mode: "config" | "mapping" | "master" | "library") => void;
  onBreakpointChange: (breakpoint: string) => void;
  devices: Devices;
  breakpointIndex: string;
  isEditing: boolean;
  onUndo: () => void;
  onRedo: () => void;
  locales: Locale[];
  locale: string;
  onLocaleChange: (locale: string) => void;
  allAudiences?: Audience[];
  audiences?: string[];
  onAudienceChange?: (audienceId: string) => void;
  isFullScreen: boolean;
  setFullScreen: (x: boolean) => void;
  onAdminModeChange: (x: boolean) => void;
  isPlayground: boolean;
}> = ({
  title,
  onClose,
  onBreakpointChange,
  devices,
  breakpointIndex,
  onIsEditingChange,
  isEditing,
  onUndo,
  onRedo,
  allAudiences = [],
  audiences = [],
  onAudienceChange = () => {},
  isFullScreen,
  setFullScreen,
  onAdminModeChange,
  isPlayground,
}) => {
  const headingRef = useRef<HTMLDivElement>(null);

  useOnClickNTimes(headingRef, 5, () => {
    onAdminModeChange(true);
  });

  const user = useUser();

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

      <Heading ref={headingRef}>
        {title}
        {isPlayground && " (Playground Mode)"}
        {!isPlayground && user !== null && (
          <span
            css={`
              color: ${SSColors.black40};
            `}
          >
            {" "}
            ({user.email})
          </span>
        )}
      </Heading>

      <TopBarRight>
        <AudiencePicker
          allAudiences={allAudiences}
          audiences={audiences}
          onAudienceChange={onAudienceChange}
        />

        <SSSelect
          value={
            !isEditing && isFullScreen ? "__fullscreen__" : breakpointIndex
          }
          onChange={(e: any) => {
            const val = e.target.value;

            if (!isEditing) {
              const isFullscreen = val === "__fullscreen__";
              setFullScreen(isFullscreen);
              if (!isFullscreen) {
                onBreakpointChange(val);
              }
            } else {
              onBreakpointChange(val);
            }
          }}
        >
          {devices
            .filter((device) => !device.hidden)
            .map((device) => (
              <option key={device.id} value={device.id}>
                {device.label || device.id}
              </option>
            ))}

          {!isEditing && (
            <option key={"__fullscreen__"} value={"__fullscreen__"}>
              Fit screen
            </option>
          )}
        </SSSelect>

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
