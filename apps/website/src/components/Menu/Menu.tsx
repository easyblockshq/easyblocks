import React from "react";
import styles from "./Menu.module.css";
import { Container } from "@/components/Container/Container";
import { Logo } from "@/components/Logo/Logo";
import { ArrowRightIcon } from "@/components/icons/ArrowRightIcon/ArrowRightIcon";
import { Button } from "@/components/Button/Button";

type MenuProps = {};

export const Menu: React.FC<MenuProps> = () => {
  return (
    <div className={styles.root}>
      <Container>
        <div className={styles.inner}>
          <Logo />
          <div>
            <Button
              as={"a"}
              href={"#section-early-access"}
              icon={<ArrowRightIcon size={20} />}
            >
              Early access
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
};
