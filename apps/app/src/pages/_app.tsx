import { Container, Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Theme>
      <Container>
        <Component {...pageProps} />
      </Container>
    </Theme>
  );
}
