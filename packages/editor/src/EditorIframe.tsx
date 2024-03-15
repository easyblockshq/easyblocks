import { Colors } from "@easyblocks/design-system";
import React, { forwardRef, useState } from "react";
import styled, { css } from "styled-components";
import { TOP_BAR_HEIGHT } from "./EditorTopBar";
import { useWindowKeyDown, ExtraKeys } from "./useWindowKeyDown";

interface EditorIframeWrapperProps {
  onEditorHistoryRedo: () => void;
  onEditorHistoryUndo: () => void;
  width: number;
  height: number;
  scaleFactor: number | null | undefined;
  containerRef: React.RefObject<HTMLDivElement>;
  isFitScreen: boolean;
  margin: number;
}

const EditorIframe = forwardRef<HTMLIFrameElement, EditorIframeWrapperProps>(
  (
    {
      onEditorHistoryRedo,
      onEditorHistoryUndo,
      width,
      height,
      scaleFactor,
      isFitScreen,
      containerRef,
      margin,
    },
    ref
  ) => {
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

    return (
      <IframeContainer ref={containerRef}>
        {scaleFactor !== undefined && (
          <IframeInnerContainer isFitScreen={isFitScreen}>
            <Iframe
              id="shopstory-canvas"
              ref={ref}
              style={{
                width: isFitScreen ? "100%" : width,
                height: isFitScreen ? "100%" : height,
              }}
              onLoad={handleIframeLoaded}
              scaleFactor={scaleFactor}
              src={window.location.href}
              margin={margin}
            />
          </IframeInnerContainer>
        )}
      </IframeContainer>
    );
  }
);

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
  margin: number;
};

const Iframe = styled.iframe<IframeProps>`
  background: white;
  border: none;
  max-height: ${(props) =>
    `calc(100vh - ${TOP_BAR_HEIGHT}px - ${props.margin ?? 0}px)`};
  overflow-y: scroll;
  transform: ${(props) =>
    props.scaleFactor === null ? "none" : `scale(${props.scaleFactor})`};
`;
