import styled from "styled-components";
import { SSColors } from "./colors";

const DEFAULT_SIZE = 6;
export const CustomComponentSymbol = styled.div<{ size?: number }>`
  width: ${(p) => p.size ?? DEFAULT_SIZE}px;
  height: ${(p) => p.size ?? DEFAULT_SIZE}px;
  background: ${SSColors.purple};
  transform: rotate(45deg);
`;
