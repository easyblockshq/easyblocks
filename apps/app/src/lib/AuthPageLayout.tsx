import { Flex } from "@radix-ui/themes";
import { ReactNode } from "react";

function AuthPageLayout({ children }: { children: ReactNode }) {
  return (
    <div
      css={`
        position: fixed;
        inset: 0;
        display: grid;
        place-items: center;
      `}
    >
      <div
        css={`
          max-width: 332px;
          width: 100%;
          color: #000;
          font-size: 16px;
        `}
      >
        <Flex justify={"center"}>
          <svg
            width="88"
            height="88"
            viewBox="0 0 256 256"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_203_128)">
              <path d="M256 0H0V256H256V0Z" fill="black" />
              <path
                d="M40 116.297C40 100.669 54.2118 88 71.7432 88H184.257C201.789 88 216 100.669 216 116.297V139.703C216 155.33 201.789 168 184.257 168H71.7432C54.2119 168 40 155.33 40 139.703V116.297Z"
                stroke="url(#paint0_linear_203_128)"
                stroke-width="16"
              />
            </g>
            <defs>
              <linearGradient
                id="paint0_linear_203_128"
                x1="128"
                y1="177.431"
                x2="128"
                y2="16.5672"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#98F7A7" />
                <stop offset="1" stop-color="#98F7A7" stop-opacity="0" />
              </linearGradient>
              <clipPath id="clip0_203_128">
                <rect width="256" height="256" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </Flex>

        {children}
      </div>
    </div>
  );
}

export { AuthPageLayout };
