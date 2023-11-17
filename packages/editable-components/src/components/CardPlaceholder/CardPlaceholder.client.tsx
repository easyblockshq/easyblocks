import React, { ReactElement } from "react";

function CardPlaceholder(
  props: { value: string | undefined } & Record<string, ReactElement>
) {
  const {
    Root,
    ImageContainer,
    TextContainer,
    AspectRatioMaker,
    value = "",
  } = props;
  return (
    <Root.type {...Root.props}>
      <AspectRatioMaker.type {...AspectRatioMaker.props}>
        <ImageContainer.type {...ImageContainer.props}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: "40%", height: "50%" }}
            viewBox="0 0 150 110"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M20 10C14.4772 10 10 14.4772 10 20V90C10 95.523 14.4772 100 20 100H130C135.523 100 140 95.523 140 90V20C140 14.4772 135.523 10 130 10H20ZM0 20C0 8.9543 8.95431 0 20 0H130C141.046 0 150 8.9543 150 20V90C150 101.046 141.046 110 130 110H20C8.95431 110 0 101.046 0 90V20ZM20 22.5C20 21.1193 21.1193 20 22.5 20H47.5C48.8807 20 50 21.1193 50 22.5V37.5454C50 38.9261 48.8807 40.0454 47.5 40.0454H22.5C21.1193 40.0454 20 38.9261 20 37.5454V22.5ZM121.01 55.8421C121.01 70.2073 109.365 81.853 94.9998 81.853C80.6346 81.853 68.9893 70.2073 68.9893 55.8421C68.9893 41.4769 80.6346 29.8315 94.9998 29.8315C109.365 29.8315 121.01 41.4769 121.01 55.8421ZM131.01 55.8421C131.01 75.7302 114.888 91.853 94.9998 91.853C75.1117 91.853 58.9893 75.7302 58.9893 55.8421C58.9893 35.954 75.1117 19.8315 94.9998 19.8315C114.888 19.8315 131.01 35.954 131.01 55.8421Z"
              fill="currentColor"
            />
          </svg>
        </ImageContainer.type>
      </AspectRatioMaker.type>
      <TextContainer.type {...TextContainer.props}>{value}</TextContainer.type>
    </Root.type>
  );
}

export default CardPlaceholder;
