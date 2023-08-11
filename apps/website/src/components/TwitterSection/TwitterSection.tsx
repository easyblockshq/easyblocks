import React from "react";
import styles from "./TwitterSection.module.css";

export const TwitterSection: React.FC = () => {
  return (
    <div className={styles.root}>
      <a
        href="https://twitter.com/ardabrowski?ref_src=twsrc%5Etfw"
        className="twitter-follow-button"
        data-show-count="false"
      >
        Follow @ardabrowski
      </a>
      <script
        async
        src="https://platform.twitter.com/widgets.js"
        charSet="utf-8"
      ></script>

      {/*<div style={{width: 16, height: 16, background: "white"}}></div>*/}
      {/*<div>Follow us on Twitter</div>*/}
    </div>
  );
};
