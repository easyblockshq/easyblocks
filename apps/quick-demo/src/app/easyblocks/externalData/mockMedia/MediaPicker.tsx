"use client";
import {
  SSColors,
  SSFonts,
  SSModal,
  ThumbnailButton,
} from "@easyblocks/design-system";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import type { Media } from "./Media";
import { fetchAssetsFromContentful } from "@/app/easyblocks/externalData/mockMedia/fetchAssetsFromContentful";

const ModalRoot = styled.div`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  height: 100%;
  padding: 16px;
`;

const GridRoot = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  grid-column-gap: 30px;
  grid-row-gap: 30px;
`;

const CardTitle = styled.div`
  ${SSFonts.body};
  word-break: break-word;
`;

const Cover = styled.div`
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  font-size: 24px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.3);
  pointer-events: none;
`;

const Card = styled.div`
  &:hover {
    outline: 1px solid ${SSColors.black40};
  }
  outline-offset: 4px;
  cursor: pointer;
`;

function CardsGroup(props: {
  items: Media[];
  onSelect: (item: Media) => void;
  mediaType: "image" | "video";
}) {
  return (
    <div style={{ marginTop: "40px" }}>
      <GridRoot>
        {props.items.map((item) => (
          <Card
            onClick={() => {
              props.onSelect(item);
            }}
            key={item.id}
          >
            <div
              style={{
                paddingBottom: "100%",
                background: "#eaeaea",
                overflow: "hidden",
                position: "relative",
              }}
            >
              {item.thumbnail !== undefined ? (
                <img
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                  src={item.thumbnail}
                />
              ) : item.isVideo ? (
                <svg
                  viewBox="0 0 24 24"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                >
                  <path
                    fill="black"
                    d="M8,5.14V19.14L19,12.14L8,5.14Z"
                    width={48}
                    height={48}
                  />
                </svg>
              ) : null}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "16px",
                marginTop: "12px",
              }}
            >
              <CardTitle>{item.title}</CardTitle>
            </div>
          </Card>
        ))}
      </GridRoot>
    </div>
  );
}

export const MediaPicker: React.FC<{
  id: string | null;
  onChange: (id: string) => void;
  mediaType: "video" | "image";
}> = ({ onChange, id, mediaType }) => {
  const [isOpen, setOpen] = useState(false);
  const [items, setItems] = useState<Media[] | null>(null);

  const selectedItem = items && items.find((item) => item.id === id);

  let label = "Pick media";

  if (selectedItem?.isVideo) {
    label = "Video";
  } else if (selectedItem?.mimeType === "image/svg+xml") {
    label = "SVG";
  } else if (selectedItem) {
    label = "Image";
  }

  useEffect(() => {
    fetchAssetsFromContentful(mediaType).then((assets) => {
      setItems(assets);
    });
  }, []);

  return (
    <div>
      <ThumbnailButton
        onClick={() => {
          setOpen(true);
        }}
        label={label}
        description={selectedItem ? selectedItem.title : undefined}
        thumbnail={
          selectedItem && selectedItem.thumbnail
            ? { type: "image", src: selectedItem.thumbnail }
            : undefined
        }
      />

      <SSModal
        title="Media"
        isOpen={isOpen}
        onRequestClose={() => {
          setOpen(false);
        }}
        mode={"center-huge"}
        headerLine={true}
      >
        <ModalRoot>
          <CardsGroup
            onSelect={(item) => {
              onChange(item.id);
              setOpen(false);
            }}
            items={items ?? []}
            mediaType={mediaType}
          />
        </ModalRoot>
      </SSModal>
    </div>
  );
};
