import React from "react";
import styled, { keyframes } from "styled-components";
import { SSColors } from "./colors";

const rotationKeyframes = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const LoaderWrapper = styled.div`
  width: 10px;
  height: 10px;
  border: 2px solid ${SSColors.black40};
  border-bottom-color: transparent;
  border-radius: 50%;
  animation: ${rotationKeyframes} 1s linear infinite;
`;

type LoaderProps = {
  className?: string;
};

function Loader({ className }: LoaderProps) {
  return <LoaderWrapper className={className} />;
}

export { Loader };
