"use client";
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
        {children}
      </div>
    </div>
  );
}

export default AuthPageLayout;
