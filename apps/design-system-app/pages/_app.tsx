import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SSModalStyles } from "@easyblocks/design-system";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div>
      <Component {...pageProps} />
      <div
        id={"modalContainer"}
        style={{ position: "fixed", top: 0, left: 0, zIndex: 1000 }}
      ></div>
      {/* @ts-ignore */}
      <SSModalStyles />
    </div>
  );
}
