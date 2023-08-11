import React from "react";
import styles from "./EarlyAccessSection.module.css";
import { Container } from "@/components/Container/Container";
import { ArrowRightIcon } from "@/components/icons/ArrowRightIcon/ArrowRightIcon";

export const EarlyAccessSection: React.FC = () => {
  return (
    <div className={styles.root} id={"section-early-access"}>
      <Container>
        <div className={styles.innerRoot}>
          <div className={styles.textContainer}>
            <div className={`font-72`}>Get early access</div>
            <div className={`${styles.title} font-body-large`}>
              We’re currently in a private alpha stage. If you want to play with
              Easyblocks leave your email below.
            </div>

            <form style={{ width: "100%" }}>
              <div className={styles.emailContainer}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 16 17"
                  fill="none"
                >
                  <path
                    d="M2.66659 2.78223H13.3333C14.0666 2.78223 14.6666 3.38223 14.6666 4.11556V12.1156C14.6666 12.8489 14.0666 13.4489 13.3333 13.4489H2.66659C1.93325 13.4489 1.33325 12.8489 1.33325 12.1156V4.11556C1.33325 3.38223 1.93325 2.78223 2.66659 2.78223Z"
                    stroke="white"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14.6666 4.11548L7.99992 8.78214L1.33325 4.11548"
                    stroke="white"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                <input
                  className={styles.emailInput}
                  name={"email"}
                  type={"email"}
                  required={true}
                  placeholder={"Enter your email..."}
                />
                <button type={"submit"} className={styles.submitButton}>
                  <ArrowRightIcon />
                </button>
              </div>
            </form>
          </div>
        </div>
      </Container>
    </div>
  );
};
