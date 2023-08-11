import React from "react";
import styled, { keyframes } from "styled-components";

const rotationKeyframes = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const LoaderWrapper = styled.div`
  width: 12px;
  height: 12px;
  border: 2px solid currentColor;
  border-bottom-color: transparent;
  border-radius: 50%;
  animation: ${rotationKeyframes} 1s linear infinite;
`;

function Loader() {
  return <LoaderWrapper />;
}

export { Loader };
