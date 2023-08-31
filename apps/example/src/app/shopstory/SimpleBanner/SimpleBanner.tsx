import React from "react";
import Image from "next/image";
import mountainImage from "./mountain-8187621_1280.jpg";

export function SimpleBanner(props: any) {
  const { Root, Stack, Cover, Title, Description } =
    props.__fromEditor.components;

  return (
    <Root.type {...Root.props}>
      <Cover.type {...Cover.props}>
        <Image
          src={mountainImage}
          alt={"some pic"}
          style={{ width: "100%", height: "auto" }}
        />
      </Cover.type>
      <Stack.type {...Stack.props}>
        <Title.type {...Title.props}>Hello world</Title.type>
        <Description.type {...Description.props}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </Description.type>
      </Stack.type>
    </Root.type>
  );
}
