import React from "react";
import styles from "./ParagraphSection.module.css";
import { Container } from "@/components/Container/Container";

export const ParagraphSection: React.FC = () => {
  return (
    <Container>
      <div className={styles.root}>
        <div className={`${styles.header} font-mono-16`}>
          Editor + Framework = Flexibility
        </div>
        <div className={`${styles.text} font-body`}>
          If you need a visual page builder in your product, developing a good
          one from scratch would require years of work. That's where Easyblocks
          comes in. We provide an ultra-customizable, off-the-shelf visual
          builder that accelerates your project 100x.
          <br />
          <br />
          Easyblocks is not just an embeddable editor, it's a framework. Thanks
          to a novel <u>no-code components</u> architecture you get
          framework-level flexibility while maintaining extreme simplicity for
          end-users.
          <br />
          <br />
          With Easyblocks you can avoid reinventing the wheel and seamlessly
          integrate a robust, user-friendly visual page builder into your
          product.
        </div>
      </div>
    </Container>
  );
};
