import { Colors } from "@easyblocks/design-system";
import React, { useState } from "react";
import styled, { css } from "styled-components";

interface EditorIframeWrapperProps {
  width: number;
  height: number;
  transform: string;
  containerRef: React.RefObject<HTMLDivElement>;
}

function EditorIframe({
  width,
  height,
  transform,
  containerRef,
}: EditorIframeWrapperProps) {
  const [isIframeReady, setIframeReady] = useState(false);

  const handleIframeLoaded = () => {
    setIframeReady(true);
  };

  return (
    <IframeContainer ref={containerRef}>
      <IframeInnerContainer>
        <Iframe
          id="shopstory-canvas"
          src={window.location.href}
          onLoad={handleIframeLoaded}
          style={{
            // These properties will change a lot during resizing, so we don't pass it to styled component to prevent
            // class name recalculations
            width,
            height,
            transform,
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

const IframeInnerContainer = styled.div`
  position: absolute; // absolute to prevent grid container having effect on parent div width (div can be oversized)
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: grid;
  justify-content: center;
  align-items: center;
`;

const Iframe = styled.iframe`
  background: white;
  border: none;
  transform-origin: center;
`;
