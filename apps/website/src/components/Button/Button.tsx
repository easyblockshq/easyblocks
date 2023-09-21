import React from "react";
import styles from "./Button.module.css";

interface CommonButtonProps {
  as?: "button" | "a";
  children: string;
  icon?: React.ReactElement;
}

type ButtonSpecificProps = CommonButtonProps & {
  as: "button";
} & React.HTMLAttributes<HTMLButtonElement>;

type AnchorSpecificProps = CommonButtonProps & {
  as: "a";
} & React.AnchorHTMLAttributes<HTMLAnchorElement>;

export type ButtonProps = ButtonSpecificProps | AnchorSpecificProps;

export const Button: React.FC<ButtonProps> = ({
  children,
  icon,
  as = "button",
  ...props
}) => {
  const Component: React.ElementType = as;

  return (
    // @ts-ignore
    <Component className={styles.button} {...props}>
      <div className={`font-body ${styles.label}`}>{children}</div>
      <div>{icon}</div>
    </Component>
  );
};
