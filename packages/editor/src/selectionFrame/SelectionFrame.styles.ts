import styled from "styled-components";

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: grid;
  place-items: center;
  pointer-events: none;
`;

type FrameWrapperProps = {
  width: number;
  height: number;
  scaleFactor: number;
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

  transform-origin: left;
`;

export { Wrapper, FrameWrapper };
