import {
  Colors,
  Fonts,
  Modal,
  ThumbnailButton,
} from "@easyblocks/design-system";
import React, { useState } from "react";
import type { Media } from "./Media";
import { MOCK_ASSETS } from "./mockAssets";

function CardsGroup(props: {
  items: Media[];
  onSelect: (item: Media) => void;
  mediaType: "image" | "video";
}) {
  return (
    <div style={{ marginTop: "40px" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gridColumnGap: "30px",
          gridRowGap: "30px",
        }}
      >
        {props.items.map((item) => (
          <div
            onClick={() => {
              props.onSelect(item);
            }}
            key={item.id}
            className="cursor-pointer outline-offset-8 outline-1 hover:outline hover:outline-neutral-400"
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
              <div style={{ ...Fonts.body, wordBreak: "break-word" }}>
                {item.title}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export const MediaPicker: React.FC<{
  id: string | null;
  onChange: (id: string) => void;
  mediaType: "video" | "image";
}> = ({ onChange, id, mediaType }) => {
  const [isOpen, setOpen] = useState(false);

  const selectedItem = MOCK_ASSETS.find((item) => item.id === id);

  let label = "Pick media";

  if (selectedItem?.isVideo) {
    label = "Video";
  } else if (selectedItem?.mimeType === "image/svg+xml") {
    label = "SVG";
  } else if (selectedItem) {
    label = "Image";
  }

  return (
    <div className="w-full">
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

      <Modal
        title="Media"
        isOpen={isOpen}
        onRequestClose={() => {
          setOpen(false);
        }}
        mode={"center-huge"}
        headerLine={true}
      >
        <div className="flex flex-col h-max p-6">
          <CardsGroup
            onSelect={(item) => {
              onChange(item.id);
              setOpen(false);
            }}
            items={MOCK_ASSETS.filter(
              (a) => a.isVideo === (mediaType === "video")
            )}
            mediaType={mediaType}
          />
        </div>
      </Modal>
    </div>
  );
};
