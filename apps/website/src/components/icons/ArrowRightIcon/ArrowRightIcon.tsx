import React from "react";

export type ArrowRightIconProps = {
  size?: number;
};
export const ArrowRightIcon: React.FC<ArrowRightIconProps> = ({
  size = 24,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={size}
      width={size}
      viewBox="0 -960 960 960"
      style={{ display: "block" }}
    >
      <path
        d="M686-450H160v-60h526L438-758l42-42 320 320-320 320-42-42 248-248Z"
        fill={"currentColor"}
      />
    </svg>
  );
};
