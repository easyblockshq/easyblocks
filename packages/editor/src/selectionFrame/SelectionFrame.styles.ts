import styled from "styled-components";

interface WrapperProps {
  isFullHeight: boolean;
}

const Wrapper = styled.div<WrapperProps>`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: grid;
  place-items: ${(props) => (props.isFullHeight ? "flex-start" : "center")};
  pointer-events: none;
`;

type FrameWrapperProps = {
  width: number;
  height: number;
  scaleFactor: number;
  isFullHeight: boolean;
};

const FrameWrapper = styled.div.attrs<FrameWrapperProps>(
  ({ width, height, scaleFactor }) => {
    return {
      style: {
        width,
        height,
        transform: `scale(${scaleFactor})`,
      },
    };
  }
)`
  position: relative;
  z-index: 1;

  display: grid;
  place-items: center;

  transform-origin: ${(props) => (props.isFullHeight ? "top left" : "left")};
`;

export { Wrapper, FrameWrapper };
