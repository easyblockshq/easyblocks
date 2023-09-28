"use client";
import { Widget, WidgetComponentProps } from "@easyblocks/core";
import {
  IconButtonPrimary,
  Menu,
  MenuContent,
  MenuItem,
  MenuTrigger,
  SSButtonDanger,
  SSButtonGhost,
  SSButtonPrimary,
  SSButtonSecondary,
  SSColors,
  SSFonts,
  SSIcons,
  SSModal,
  SSModalContext,
  Stack,
  ThumbnailButton,
  Typography,
  useToaster,
} from "@easyblocks/design-system";
import { useApiClient, useEditorContext } from "@easyblocks/editor";
import React, { useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";
import { mediaAdapter } from "./mediaAdapter";

const ModalRoot = styled.div<{ areChildrenPointerEventsDisabled: boolean }>`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  height: 100%;
  padding: 16px;

  ${({ areChildrenPointerEventsDisabled }) =>
    areChildrenPointerEventsDisabled &&
    css`
      & > * {
        pointer-events: none;
      }
    `}
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

export type Media = {
  id: string;
  title: string;
  url: string;
  mimeType: string;
  isVideo: boolean;
  thumbnail?: string;
  width?: number;
  height?: number;
};

export type MediaFetcher = () => Promise<Media[]>;

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
  onRemove: (item: Media) => void;
  mediaType: "image" | "video";
}) {
  const { onRemove } = props;

  const [containerElement] = useState<HTMLElement | null>(() => {
    return document.querySelector("#modalContainer");
  });

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
                  css={`
                    position: absolute;
                    top: 0px;
                    left: 0px;
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                  `}
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
              css={`
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                gap: 16px;
                margin-top: 12px;
              `}
            >
              <CardTitle>{item.title}</CardTitle>
              <Menu>
                <MenuTrigger>
                  <SSButtonGhost
                    css={`
                      flex-shrink: 0;
                    `}
                    icon={SSIcons.ThreeDotsHorizontal}
                    hideLabel
                  />
                </MenuTrigger>
                <MenuContent container={containerElement}>
                  <MenuItem
                    onClick={(event) => {
                      event.stopPropagation();
                      onRemove(item);
                    }}
                  >
                    <Typography color="white">Delete</Typography>
                  </MenuItem>
                </MenuContent>
              </Menu>
            </div>
          </Card>
        ))}
      </GridRoot>
    </div>
  );
}

const Component = (
  props: WidgetComponentProps & {
    mediaType: "image" | "video";
  }
) => {
  const { id, mediaType } = props;
  const apiClient = useApiClient();
  const editorContext = useEditorContext();
  const toaster = useToaster();
  const [isOpen, setOpen] = useState(false);
  const [items, setItems] = useState<Media[] | null>(null);
  const [fetchingAssetsStatus, setFetchingAssetsStatus] = useState<
    "loading" | "success" | "error"
  >("loading");
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [assetToRemove, setAssetToRemove] = useState<Media | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);
  const assetFileInput = useRef<HTMLInputElement>(null);
  const draggingCount = useRef(0);

  const selectedItem = items && items.find((item) => item.id === id);

  async function fetchAssets() {
    setFetchingAssetsStatus("loading");
    apiClient.assets
      .getAssets({ projectId: editorContext.project.id, type: mediaType })
      .then((assets) => {
        const items = assets.map(mediaAdapter);
        setItems(items);
        setFetchingAssetsStatus("success");
      })
      .catch((error) => {
        console.error(error);
        setFetchingAssetsStatus("error");
      });
  }

  useEffect(() => {
    fetchAssets();
  }, []);

  let label = "Pick media";

  if (selectedItem?.isVideo) {
    label = "Video";
  } else if (selectedItem?.mimeType === "image/svg+xml") {
    label = "SVG";
  } else if (selectedItem) {
    label = "Image";
  }

  const acceptedUploadFileTypes =
    mediaType === "video"
      ? ["mp4", "webm"].map((extension) => `video/${extension}`).join(",")
      : ["jpg", "jpeg", "png", "webp", "gif", "avif", "svg+xml"]
          .map((extension) => `image/${extension}`)
          .join(",");

  async function handleFileUpload(file: File) {
    setIsUploading(true);

    const formData = new FormData();
    formData.set("file", file);

    try {
      await apiClient.assets.uploadAsset({
        projectId: editorContext.project.id,
        asset: file,
      });

      fetchAssets();
    } catch (error) {
      console.error(error);
      toaster.error(`File upload for file ${file.name} failed`);
    } finally {
      setIsUploading(false);
    }
  }

  const inputFileElement = (
    <input
      type="file"
      onChange={(event) => {
        if (event.target.files) {
          handleFileUpload(event.target.files[0]);
        }
      }}
      value=""
      ref={assetFileInput}
      accept={acceptedUploadFileTypes}
      css={`
        position: absolute;
        overflow: hidden;
        width: 0;
        height: 0;
      `}
    />
  );

  return (
    <div>
      {fetchingAssetsStatus === "loading" && items === null && (
        <ThumbnailButton label={"Loading..."} disabled={true} />
      )}

      {(fetchingAssetsStatus === "success" ||
        fetchingAssetsStatus === "error" ||
        items !== null) && (
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
      )}

      <SSModal
        title="Media"
        isOpen={isOpen}
        onRequestClose={() => {
          setOpen(false);
          setIsDraggingOver(false);
        }}
        mode={"center-huge"}
        headerLine={true}
      >
        <ModalRoot
          areChildrenPointerEventsDisabled={isDraggingOver}
          onDragEnter={() => {
            draggingCount.current++;
            if (!isDraggingOver) {
              setIsDraggingOver(true);
            }
          }}
          onDragOver={(event) => {
            event.preventDefault();
          }}
          onDrop={(event) => {
            event.preventDefault();

            setIsDraggingOver(false);
            draggingCount.current = 0;

            if (event.dataTransfer.items.length > 0) {
              const item = event.dataTransfer.items[0];
              if (
                item.kind === "file" &&
                acceptedUploadFileTypes.includes(item.type)
              ) {
                const file = item.getAsFile();

                if (file) {
                  handleFileUpload(file);
                }
              }
            }
          }}
          onDragLeave={() => {
            draggingCount.current--;

            if (draggingCount.current > 0) {
              return;
            }

            setIsDraggingOver(false);
          }}
        >
          <div
            css={`
              display: flex;
              align-items: center;
            `}
          >
            {items !== null && items.length > 0 && (
              <SSButtonPrimary
                component="label"
                icon={SSIcons.Add}
                isLoading={isUploading}
              >
                Upload asset
                {inputFileElement}
              </SSButtonPrimary>
            )}
          </div>

          <CardsGroup
            onSelect={(item) => {
              props.onChange(item.id);
              setOpen(false);
            }}
            onRemove={(item) => {
              setAssetToRemove(item);
            }}
            items={items ?? []}
            mediaType={mediaType}
          />

          {fetchingAssetsStatus === "error" && (
            <div
              css={`
                display: grid;
                place-items: center;
                flex-grow: 1;
                flex-shrink: 0;
              `}
            >
              <Typography>Failed to fetch assets</Typography>
            </div>
          )}

          {items !== null && items.length === 0 && (
            <div
              css={`
                display: grid;
                place-items: center;
                flex-grow: 1;
                flex-shrink: 0;
              `}
            >
              <div
                css={`
                  @media (hover: hover) {
                    cursor: pointer;
                  }
                `}
                onClick={() => {
                  assetFileInput.current?.click();
                }}
              >
                <Stack
                  gap={24}
                  css={`
                    align-items: center;
                  `}
                >
                  <IconButtonPrimary icon={SSIcons.Add} variant="large" />
                  <Typography color="blue50">
                    Upload your first asset
                  </Typography>
                </Stack>
                {inputFileElement}
              </div>
            </div>
          )}

          <SSModalContext.Provider
            value={() => {
              return document.querySelector("#modalContainer");
            }}
          >
            {assetToRemove !== null && (
              <SSModal
                isOpen
                mode="center-small"
                title="Remove asset"
                onRequestClose={() => {
                  setAssetToRemove(null);
                }}
              >
                <form
                  onSubmit={async (event) => {
                    event.preventDefault();

                    setIsRemoving(true);

                    try {
                      await apiClient.assets.removeAsset({
                        projectId: editorContext.project.id,
                        assetId: assetToRemove.id,
                      });

                      if (selectedItem?.id === assetToRemove.id) {
                        props.onChange(null);
                      }

                      fetchAssets();
                      setAssetToRemove(null);
                    } catch (error) {
                      console.error(error);
                      toaster.error(
                        `Failed to remove asset ${assetToRemove.title}`
                      );
                    } finally {
                      setIsRemoving(false);
                    }
                  }}
                >
                  <Stack gap={24}>
                    <Typography>
                      This will permanently delete the asset{" "}
                      {assetToRemove.title}
                    </Typography>
                    <SSButtonDanger
                      type="submit"
                      variant="large"
                      isLoading={isRemoving}
                    >
                      Delete asset
                    </SSButtonDanger>
                  </Stack>
                </form>
              </SSModal>
            )}
          </SSModalContext.Provider>
        </ModalRoot>

        {isDraggingOver && (
          <Cover>
            <Typography
              color="white"
              css={`
                font-size: 24px;
              `}
            >
              Drop file to upload
            </Typography>
          </Cover>
        )}
      </SSModal>

      {id !== null && (
        <div
          style={{
            marginTop: "12px",
            display: "flex",
            flexDirection: "row",
            gap: "8px",
          }}
        >
          <SSButtonSecondary
            onClick={() => {
              props.onChange(null);
            }}
          >
            Clear
          </SSButtonSecondary>
        </div>
      )}
    </div>
  );
};

export function mockMediaPicker(key: "image" | "video"): Widget["component"] {
  return ({ onChange, id }) => {
    return <Component id={id} onChange={onChange} mediaType={key} key={key} />;
  };
}
