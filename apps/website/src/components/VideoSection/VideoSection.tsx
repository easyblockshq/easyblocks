import React from "react";
import styles from "./VideoSection.module.css";
import { Container } from "@/components/Container/Container";

type VideoSectionProps = {};
export const VideoSection: React.FC<VideoSectionProps> = () => {
  return (
    <Container>
      <div className={styles.root}>
        <iframe
          src="https://player.vimeo.com/video/852308356?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          style={{
            position: "absolute",
            top: "-2px",
            left: "-2px",
            width: "calc(100% + 4px)",
            height: "calc(100% + 4px)",
          }}
          title="Easyblocks_Video"
        ></iframe>
      </div>
      <script src="https://player.vimeo.com/api/player.js"></script>
    </Container>
  );
};
