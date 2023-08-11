import "@radix-ui/themes/styles.css";
import { Container, Flex, Theme } from "@radix-ui/themes";
import { ReactNode } from "react";
import { LogoutButton } from "./logout-button";
import StyledComponentsRegistry from "./styled-components-registry";

function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <StyledComponentsRegistry>
          <Theme>
            <Container>
              <Flex justify="end">
                <LogoutButton />
              </Flex>
              {props.children}
            </Container>
          </Theme>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}

export default RootLayout;
