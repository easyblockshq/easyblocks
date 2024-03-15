import { Colors } from "@easyblocks/design-system";
import React, { useState } from "react";
import styled, { css } from "styled-components";
import { TOP_BAR_HEIGHT } from "./EditorTopBar";
import { ExtraKeys, useWindowKeyDown } from "./useWindowKeyDown";

interface EditorIframeWrapperProps {
  onEditorHistoryRedo: () => void;
  onEditorHistoryUndo: () => void;
  width: number;
  height: number;
  scaleFactor: number | null;
  containerRef: React.RefObject<HTMLDivElement>;
  margin: number;
  size: "fixed" | "fit-screen" | "fit-h-screen";
}

function EditorIframe({
  onEditorHistoryRedo,
  onEditorHistoryUndo,
  width,
  height,
  scaleFactor,
  containerRef,
  margin,
  size,
}: EditorIframeWrapperProps) {
  const [isIframeReady, setIframeReady] = useState(false);

  const handleIframeLoaded = () => {
    setIframeReady(true);
  };

  useWindowKeyDown("z", onEditorHistoryUndo, {
    extraKeys: [ExtraKeys.META_KEY],
    isDisabled: !isIframeReady,
  });

  useWindowKeyDown("z", onEditorHistoryRedo, {
    extraKeys: [ExtraKeys.META_KEY, ExtraKeys.SHIFT_KEY],
    isDisabled: !isIframeReady,
  });

  useWindowKeyDown("z", onEditorHistoryUndo, {
    extraKeys: [ExtraKeys.CTRL_KEY],
    isDisabled: !isIframeReady,
  });

  useWindowKeyDown("y", onEditorHistoryRedo, {
    extraKeys: [ExtraKeys.CTRL_KEY],
    isDisabled: !isIframeReady,
  });

  const isFitScreenSize = size === "fit-screen";

  return (
    <IframeContainer ref={containerRef}>
      <IframeInnerContainer isFitScreen={isFitScreenSize}>
        <Iframe
          id="shopstory-canvas"
          src={window.location.href}
          onLoad={handleIframeLoaded}
          scaleFactor={scaleFactor}
          isFitScreenHeightSize={size === "fit-h-screen"}
          margin={margin}
          style={{
            // These properties will change a lot during resizing, so we don't pass it to styled component to prevent
            // class name recalculations
            width: isFitScreenSize ? "100%" : width,
            height: isFitScreenSize ? "100%" : height,
            transform: scaleFactor === null ? "none" : `scale(${scaleFactor})`,
          }}
        />
      </IframeInnerContainer>
    </IframeContainer>
  );
}

export { EditorIframe };

const IframeContainer = styled.div`
  position: relative;
  flex: 1 1 auto;
  background: ${Colors.black100};
`;

type IframeInnerContainerProps = {
  isFitScreen: boolean;
};
const IframeInnerContainer = styled.div<IframeInnerContainerProps>`
  position: absolute; // absolute to prevent grid container having effect on parent div width (div can be oversized)
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  display: grid;

  ${(props) =>
    !props.isFitScreen &&
    css`
      justify-content: center;
      align-items: center;
    `}
`;

type IframeProps = {
  scaleFactor: number | null;
  isFitScreenHeightSize: boolean;
  margin: number;
};

const Iframe = styled.iframe<IframeProps>`
  background: white;
  border: none;
  max-height: ${(props) =>
    props.isFitScreenHeightSize
      ? "none"
      : `calc(100vh - ${TOP_BAR_HEIGHT}px - ${props.margin ?? 0}px)`};
  overflow-y: scroll;
  transform-origin: ${(props) =>
    props.isFitScreenHeightSize && props.scaleFactor !== null
      ? "top center"
      : "center"};
`;
