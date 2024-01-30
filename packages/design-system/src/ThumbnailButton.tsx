import styled from "styled-components";
import * as React from "react";

import { ButtonGhost } from "./buttons";
import { Icons } from "./icons";
import { Typography } from "./Typography";

export type ColorThumbnail = {
  type: "color";
  color: string;
};

export type ImageThumbnail = {
  type: "image";
  src: string;
};

export type IconThumbnail = {
  type: "icon";
  icon: "link" | "grid_3x3";
};

export type ThumbnailType = ColorThumbnail | ImageThumbnail | IconThumbnail;

export type ThumbnailButtonProps = {
  onClick?: () => void;
  label: string;
  description?: string;
  thumbnail?: ThumbnailType;
  disabled?: boolean;
};

const Preview = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: -1px;

  width: 32px;
  height: 32px;

  border: 1px solid #e5e5e5;
  border-radius: 2px;

  position: relative;
  min-width: 0; // important!!! Makes flex shrink items freely
`;

const PreviewImage = styled.img`
  display: block;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`;

interface SolidColorPreviewProps {
  color: string;
}

const SolidColorPreview = styled.div<SolidColorPreviewProps>`
  width: 100%;
  height: 100%;
  background-color: ${({ color }) => color};
`;

const ContentRoot = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
`;

const Labels = styled.div`
  flex: 1 0;
  overflow: hidden;
  min-width: 0; // important!!! Makes flex shrink items freely
  display: grid;
`;

export function ThumbnailButton({
  onClick,
  label,
  description,
  thumbnail,
  disabled,
}: ThumbnailButtonProps) {
  let preview: JSX.Element;

  if (thumbnail?.type === "image") {
    preview = <PreviewImage src={thumbnail.src} aria-hidden="true" />;
  } else if (thumbnail?.type === "color") {
    preview = <SolidColorPreview color={thumbnail.color} />;
  } else if (thumbnail?.type === "icon") {
    const ComponentIcon =
      thumbnail.icon === "link"
        ? Icons.Link
        : thumbnail.icon === "grid_3x3"
        ? Icons.Grid3x3
        : Icons.Link;
    preview = <ComponentIcon size={16} />;
  } else {
    preview = <SolidColorPreview color={"transparent"} />;
  }

  const content = (
    <ContentRoot>
      <Preview>{preview}</Preview>
      <Labels>
        <Typography variant="label" isTruncated>
          {label}
        </Typography>
        {description && (
          <Typography variant="body" color="black40" isTruncated>
            {description}
          </Typography>
        )}
      </Labels>
    </ContentRoot>
  );

  if (disabled) {
    return <ContentRoot>{content}</ContentRoot>;
  }

  return (
    <div style={{ display: "grid", width: "100%" }}>
      <ButtonGhost onClick={onClick} height={"32px"} noPadding={true}>
        {content}
      </ButtonGhost>
    </div>
  );
}
