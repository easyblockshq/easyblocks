import React from "react";
import styles from "./BigTextSection.module.css";
import { Container } from "@/components/Container/Container";

type BigTextSectionProps = {
  text?: string;
};
export const BigTextSection: React.FC<BigTextSectionProps> = ({ text }) => {
  return (
    <Container>
      <div className={`${styles.root} font-40`}>{text}</div>
    </Container>
  );
};
