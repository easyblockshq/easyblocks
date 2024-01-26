import React from "react";
import styled from "styled-components";

const IconContainer = styled.div.withConfig({
  shouldForwardProp(prop) {
    return !["size", "isStroke"].includes(prop);
  },
})<IconProps>`
  svg {
    width: ${(p) => (p.size || 16) + "px"};
    height: ${(p) => (p.size || 16) + "px"};
    display: block;
  }

  ${(p) =>
    p.isStroke
      ? `
    svg > [stroke] {
      stroke: currentColor;
    }
    
    svg > [fill] {
      fill: none;
    }
    
  `
      : `
  
    svg > [stroke] {
      fill: none;
    }
    
    svg > [fill] {
      fill: currentColor;
    }
    
  `}
`;

type IconProps = {
  size?: number;
  isStroke?: boolean;
};

export type Icon = React.ComponentType<IconProps>;

function createIcon(svg: JSX.Element, isStroke = false): Icon {
  return (props: IconProps) => {
    return (
      <IconContainer {...props} isStroke={isStroke}>
        {svg}
      </IconContainer>
    );
  };
}

const Dropdown = createIcon(
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8.35355 10.0606L8.70711 9.70709L11.7071 6.70709L11 5.99998L8.35355 8.64643L5.70711 5.99998L5 6.70709L8 9.70709L8.35355 10.0606Z"
      fill="black"
    />
  </svg>
);

const MaxHeight = createIcon(
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14 2H2.5V1H14V2ZM8.54545 2.82172L8.88332 3.13142L11.0651 5.13142L10.3894 5.86858L9.04545 4.63662V10.8634L10.3894 9.63142L11.0651 10.3686L8.88332 12.3686L8.54545 12.6783L8.20759 12.3686L8.54545 12L8.20758 12.3686L8.20753 12.3685L8.20735 12.3684L8.20663 12.3677L8.20375 12.3651L8.19245 12.3547L8.14879 12.3147L7.9865 12.1659L7.4362 11.6615L6.02577 10.3686L6.7015 9.63142L8.04545 10.8634V4.63662L6.7015 5.86858L6.02577 5.13142L8.20759 3.13142L8.54545 2.82172ZM8.54545 15H2.5V14H8.54545H14V15H8.54545Z"
      fill="black"
    />
  </svg>
);

const Add = createIcon(
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M8 2V14M2 8H14" stroke="black" />
  </svg>,
  true
);

const AlignLeft = createIcon(
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M1 3H15V4H1V3ZM1 7H9V8H1V7ZM11 11H1V12H11V11Z" fill="black" />
  </svg>
);

const AlignCenter = createIcon(
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M1 3H15V4H1V3ZM4 7H12V8H4V7ZM13 11H3V12H13V11Z" fill="black" />
  </svg>
);

const AlignRight = createIcon(
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M1 3H15V4H1V3ZM7 7H15V8H7V7ZM15 11H5V12H15V11Z" fill="black" />
  </svg>
);

const Close = createIcon(
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7.76732 7.06025L12.2584 2.56918L12.9655 3.27629L8.47443 7.76735L12.9655 12.2584L12.2584 12.9655L7.76732 8.47446L3.2763 12.9655L2.56919 12.2584L7.06021 7.76735L2.56919 3.27637L3.2763 2.56926L7.76732 7.06025Z"
      fill="black"
    />
  </svg>
);

const Desktop = createIcon(
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10 13H6V12H10V13Z"
      fill="black"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14 3H2V10H14V3ZM1 2V11H15V2H1Z"
      fill="black"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11 13L5 13V12L11 12V13Z"
      fill="black"
    />
  </svg>
);

const Mobile = createIcon(
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10 2H6C5.44772 2 5 2.44772 5 3V13C5 13.5523 5.44772 14 6 14H10C10.5523 14 11 13.5523 11 13V3C11 2.44772 10.5523 2 10 2ZM6 1C4.89543 1 4 1.89543 4 3V13C4 14.1046 4.89543 15 6 15H10C11.1046 15 12 14.1046 12 13V3C12 1.89543 11.1046 1 10 1H6Z"
      fill="black"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10 13H6V12H10V13Z"
      fill="black"
    />
  </svg>
);

const Drag = createIcon(
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7 3H5V5H7V3ZM7 7H5V9H7V7ZM5 11H7V13H5V11ZM11 3H9V5H11V3ZM9 7H11V9H9V7ZM11 11H9V13H11V11Z"
      fill="black"
      fillOpacity="0.8"
    />
  </svg>
);

const ArrowDown = createIcon(
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M8 12L8 2.5M8 12L5 9M8 12L11 9" stroke="black" />
  </svg>,
  true
);

const ArrowRight = createIcon(
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 8L2.5 8M12 8L9 11M12 8L9 5" stroke="black" />
  </svg>,
  true
);

const Master = createIcon(
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5.75417 5.29515L8.04931 3L10.3445 5.29515L8.04931 7.59029L5.75417 5.29515Z"
      fill="black"
    />
    <path
      d="M5.75417 10.8035L8.04931 8.50835L10.3445 10.8035L8.04931 13.0986L5.75417 10.8035Z"
      fill="black"
    />
    <path
      d="M3 8.04933L5.29515 5.75418L7.59029 8.04933L5.29515 10.3445L3 8.04933Z"
      fill="black"
    />
    <path
      d="M8.50835 8.04933L10.8035 5.75418L13.0986 8.04933L10.8035 10.3445L8.50835 8.04933Z"
      fill="black"
    />
  </svg>
);

const Redo = createIcon(
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12.0858 6.35355L9.43934 9L10.1464 9.70711L13.6464 6.20711L14 5.85355L13.6464 5.5L10.1464 2L9.43934 2.70711L12.0858 5.35355H8.29289C4.71675 5.35355 1.79289 8.27741 1.79289 11.8536L1.79289 13.3536H2.79289L2.79289 11.8536C2.79289 8.8297 5.26904 6.35355 8.29289 6.35355H12.0858Z"
      fill="black"
    />
  </svg>
);

const Undo = createIcon(
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3.91421 6.35355L6.56066 9L5.85355 9.70711L2.35355 6.20711L2 5.85355L2.35355 5.5L5.85355 2L6.56066 2.70711L3.91421 5.35355H7.70711C11.2832 5.35355 14.2071 8.27741 14.2071 11.8536L14.2071 13.3536H13.2071L13.2071 11.8536C13.2071 8.8297 10.731 6.35355 7.70711 6.35355H3.91421Z"
      fill="black"
    />
  </svg>
);
const Remove = createIcon(
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14 8.5H2V7.5H14V8.5Z"
      fill="black"
      fillOpacity="0.8"
    />
  </svg>
);
const ChevronRight = createIcon(
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10.0607 8.64645L9.70711 8.29289L6.70711 5.29289L6 6L8.64645 8.64645L6 11.2929L6.70711 12L9.70711 9L10.0607 8.64645Z"
      fill="black"
    />
  </svg>
);

const Back = createIcon(
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M10.5 3L6 7.5L10.5 12" stroke="black" />
  </svg>,
  true
);

const Share = createIcon(
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.35355 0.646461L8 0.292908L7.64645 0.646461L4.64645 3.64646L5.35355 4.35357L7.5 2.20712L7.5 10.5H8.5L8.5 2.20712L10.6464 4.35357L11.3536 3.64646L8.35355 0.646461ZM3 5.50001C2.72386 5.50001 2.5 5.72387 2.5 6.00001V15C2.5 15.2762 2.72386 15.5 3 15.5H13C13.2761 15.5 13.5 15.2762 13.5 15V6.00001C13.5 5.72387 13.2761 5.50001 13 5.50001H10.5V6.50001H12.5V14.5H3.5V6.50001H5.5V5.50001H3Z"
      fill="black"
    />
  </svg>
);

const Reset = createIcon(
  <svg width="17" height="16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <mask id="a" fill="#fff">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="m1.751 6.349 2.287 2.858 3.381-2.255-.555-.832-2.618 1.746-1.714-2.142-.78.625Z"
      />
      <path d="M13.858 8a4.56 4.56 0 0 1-4.56 4.56h-.042v1h.042A5.56 5.56 0 1 0 3.754 8.42c.039-.036.077-.079.115-.127l.876-.044A4.56 4.56 0 1 1 13.859 8Z" />
    </mask>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="m1.751 6.349 2.287 2.858 3.381-2.255-.555-.832-2.618 1.746-1.714-2.142-.78.625Z"
      fill="#000"
    />
    <path
      d="M13.858 8a4.56 4.56 0 0 1-4.56 4.56h-.042v1h.042A5.56 5.56 0 1 0 3.754 8.42c.039-.036.077-.079.115-.127l.876-.044A4.56 4.56 0 1 1 13.859 8Z"
      fill="#000"
    />
    <path
      d="m1.751 6.349-.624-.781-.781.625.624.78.781-.624Zm2.287 2.858-.781.624.572.716.763-.508-.554-.832Zm3.381-2.255.555.832.832-.554-.555-.832-.832.554Zm-.555-.832.832-.554-.554-.832-.832.554.554.832ZM4.246 7.866l-.781.625.573.716.762-.509-.554-.832ZM2.532 5.724l.781-.625-.625-.78-.78.624.624.781Zm6.724 6.836.01-1-1.01-.01v1.01h1Zm0 1h-1v.993l.993.007.007-1ZM3.754 8.42l-.998.074.154 2.06 1.52-1.398-.676-.736Zm.115-.127-.05-1-.46.024-.282.365.792.61Zm.876-.044.05.998 1.002-.05-.054-1.002-.998.054Zm1.287-1.573.555.832 1.664-1.11-.555-.831-1.664 1.109ZM4.8 8.698 7.42 6.952l-1.11-1.664-2.618 1.746 1.11 1.664Zm-3.049-2.35 1.714 2.143 1.562-1.25L3.313 5.1 1.751 6.35Zm.625.782.78-.625-1.249-1.562-.78.625L2.376 7.13Zm2.442 1.452L2.532 5.724.97 6.974 3.257 9.83l1.561-1.249ZM6.864 6.12 3.483 8.375l1.11 1.664 3.38-2.255L6.865 6.12Zm2.434 7.44A5.56 5.56 0 0 0 14.858 8h-2a3.56 3.56 0 0 1-3.56 3.56v2Zm-.051 0h.051v-2h-.033l-.018 2Zm1.01 0v-1h-2v1h2Zm-1.008 1h.05v-2h-.035l-.015 2Zm.05 0A6.56 6.56 0 0 0 15.858 8h-2a4.56 4.56 0 0 1-4.56 4.56v2ZM15.858 8a6.56 6.56 0 0 0-6.56-6.56v2A4.56 4.56 0 0 1 13.858 8h2Zm-6.56-6.56A6.56 6.56 0 0 0 2.738 8h2a4.56 4.56 0 0 1 4.56-4.56v-2ZM2.738 8c0 .166.005.33.017.493l1.995-.149A4.639 4.639 0 0 1 4.738 8h-2Zm.338-.319c-.007.009-.007.008 0 .001L4.43 9.155c.086-.079.162-.164.23-.253L3.078 7.681Zm1.617-.432-.875.044.1 1.997.876-.044-.1-1.997ZM3.738 8c0 .1.003.201.008.301l1.997-.107A3.629 3.629 0 0 1 5.738 8h-2Zm5.56-5.56A5.56 5.56 0 0 0 3.738 8h2a3.56 3.56 0 0 1 3.56-3.56v-2ZM14.858 8a5.56 5.56 0 0 0-5.56-5.56v2A3.56 3.56 0 0 1 12.858 8h2Z"
      fill="#000"
      mask="url(#a)"
    />
  </svg>
);

const Grid3x3 = createIcon(
  <svg
    width="16"
    height="17"
    viewBox="0 0 16 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3 3.34674H5V5.34674H3V3.34674ZM3 7.34674H5V9.34674H3V7.34674ZM5 11.3467H3V13.3467H5V11.3467ZM7 3.34674H9V5.34674H7V3.34674ZM9 7.34674H7V9.34674H9V7.34674ZM7 11.3467H9V13.3467H7V11.3467ZM13 3.34674H11V5.34674H13V3.34674ZM11 7.34674H13V9.34674H11V7.34674ZM13 11.3467H11V13.3467H13V11.3467Z"
      fill="black"
    />
  </svg>
);

const ChevronLeft = createIcon(
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M10.5 3L6 7.5L10.5 12" stroke="black" />
  </svg>
);

const Link = createIcon(
  <svg
    width="16"
    height="17"
    viewBox="0 0 16 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10 5.34674V6.63245H11V5.34674C11 3.68989 9.65685 2.34674 8 2.34674C6.34315 2.34674 5 3.68989 5 5.34674V6.63245H6V5.34674C6 4.24217 6.89543 3.34674 8 3.34674C9.10457 3.34674 10 4.24217 10 5.34674ZM10 10.061H11V11.3467C11 13.0036 9.65685 14.3467 8 14.3467C6.34315 14.3467 5 13.0036 5 11.3467V10.061H6V11.3467C6 12.4513 6.89543 13.3467 8 13.3467C9.10457 13.3467 10 12.4513 10 11.3467V10.061ZM7.5 5.77531V10.9182H8.5V5.77531H7.5Z"
      fill="black"
    />
  </svg>
);

const MarginBottom = createIcon(
  <svg
    width="16"
    height="17"
    viewBox="0 0 16 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14 15.3467H2V14.3467H14V15.3467Z"
      fill="black"
    />
    <rect x="4.5" y="4.84674" width="7" height="7" stroke="black" />
  </svg>
);

const MarginHorizontal = createIcon(
  <svg
    width="16"
    height="17"
    viewBox="0 0 16 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0.999999 14.3467L1 2.34674L2 2.34674L2 14.3467L0.999999 14.3467Z"
      fill="black"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14 14.3467L14 2.34674L15 2.34674L15 14.3467L14 14.3467Z"
      fill="black"
    />
    <rect x="4.5" y="4.84674" width="7" height="7" stroke="black" />
  </svg>
);

const MarginTop = createIcon(
  <svg
    width="16"
    height="17"
    viewBox="0 0 16 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14 2.34674H2V1.34674H14V2.34674Z"
      fill="black"
    />
    <rect x="4.5" y="4.84674" width="7" height="7" stroke="black" />
  </svg>
);

const CornerRadius = createIcon(
  <svg
    width="16"
    height="17"
    viewBox="0 0 16 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14 3.34674H10C6.13401 3.34674 3 6.48075 3 10.3467V14.3467H2V10.3467C2 5.92846 5.58172 2.34674 10 2.34674H14V3.34674Z"
      fill="black"
    />
  </svg>
);

const ThreeDotsHorizontal = createIcon(
  <svg
    width="17"
    height="17"
    viewBox="0 0 17 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3.80444 8.47266C3.80444 7.92037 4.25216 7.47266 4.80444 7.47266C5.35673 7.47266 5.80444 7.92037 5.80444 8.47266C5.80444 9.02494 5.35673 9.47266 4.80444 9.47266C4.25216 9.47266 3.80444 9.02494 3.80444 8.47266ZM7.80444 8.47266C7.80444 7.92037 8.25216 7.47266 8.80444 7.47266C9.35673 7.47266 9.80444 7.92037 9.80444 8.47266C9.80444 9.02494 9.35673 9.47266 8.80444 9.47266C8.25216 9.47266 7.80444 9.02494 7.80444 8.47266ZM12.8044 7.47266C12.2522 7.47266 11.8044 7.92037 11.8044 8.47266C11.8044 9.02494 12.2522 9.47266 12.8044 9.47266C13.3567 9.47266 13.8044 9.02494 13.8044 8.47266C13.8044 7.92037 13.3567 7.47266 12.8044 7.47266Z"
      fill="black"
    />
  </svg>
);

const OpenInNew = createIcon(
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="24"
    viewBox="0 -960 960 960"
    width="24"
  >
    <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h560v-280h80v280q0 33-23.5 56.5T760-120H200Zm188-212-56-56 372-372H560v-80h280v280h-80v-144L388-332Z" />
  </svg>
);

export const Icons = {
  Dropdown,
  MaxHeight,
  Add,
  AlignLeft,
  AlignRight,
  AlignCenter,
  Close,
  Desktop,
  Mobile,
  Drag,
  ArrowDown,
  ArrowRight,
  Master,
  ChevronDown: Dropdown,
  ChevronRight,
  ChevronLeft,
  Back,
  Redo,
  Undo,
  Remove,
  Share,
  Reset,
  Grid3x3,
  Link,
  MarginBottom,
  MarginHorizontal,
  MarginTop,
  CornerRadius,
  ThreeDotsHorizontal,
  OpenInNew,
};
