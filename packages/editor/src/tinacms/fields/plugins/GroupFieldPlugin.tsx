import { InternalField } from "@easyblocks/app-utils";
import { Field } from "@easyblocks/core";
import { SSButtonGhostColor, SSIcons } from "@easyblocks/design-system";
import React, { ReactNode } from "react";
import styled, { css, keyframes } from "styled-components";

export interface GroupFieldDefinititon extends InternalField {
  component: "group";
  fields: Field[];
}

type SSPanelHeaderProps = {
  onClick: () => void;
  children: ReactNode;
};

export const SSPanelHeader: React.FC<SSPanelHeaderProps> = (props) => {
  return (
    <div
      style={{
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 6,
        position: "relative",
        background: "white",
      }}
    >
      <div style={{ width: 150 }}>
        <SSButtonGhostColor icon={SSIcons.Back} onClick={props.onClick}>
          {props.children}
        </SSButtonGhostColor>
      </div>
    </div>
  );
};

export const PanelBody = styled.div`
  background: white;
  position: relative;
  height: 100%;
  overflow-y: auto;
`;

const GroupPanelKeyframes = keyframes`
  0% {
    transform: translate3d( 100%, 0, 0 );
  }
  100% {
    transform: translate3d( 0, 0, 0 );
  }
`;

export const GroupPanel = styled.div<{ isExpanded: boolean }>`
  position: absolute;
  width: 100%;
  top: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;
  /* z-index: var(--tina-z-index-1); */
  pointer-events: ${(p) => (p.isExpanded ? "all" : "none")};

  > * {
    ${(p) =>
      p.isExpanded &&
      css`
        animation-name: ${GroupPanelKeyframes};
        animation-duration: 150ms;
        animation-delay: 0ms;
        animation-iteration-count: 1;
        animation-timing-function: ease-out;
        animation-fill-mode: backwards;
      `};

    ${(p) =>
      !p.isExpanded &&
      css`
        transition: transform 150ms ease-out;
        transform: translate3d(100%, 0, 0);
      `};
  }
`;
