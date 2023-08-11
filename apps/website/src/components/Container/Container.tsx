import React from "react";
import styles from "./Container.module.css";

type ContainerProps = {
  children?: React.ReactNode;
};
export const Container: React.FC<ContainerProps> = ({ children }) => {
  return (
    <div className={styles.root}>
      <div className={styles.inner}>{children}</div>
    </div>
  );
};
