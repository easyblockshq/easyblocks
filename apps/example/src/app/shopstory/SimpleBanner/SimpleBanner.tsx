import Image from "next/image";
import mountainImage from "./mountain-8187621_1280.jpg";

export function SimpleBanner(props: any) {
  const { Test } = props.__fromEditor.components;

  return (
    <div style={{ margin: "auto", maxWidth: 1200 }}>
      <div style={{ maxWidth: 500, display: "grid", position: "relative" }}>
        {Test}
        <Image
          src={mountainImage}
          alt={"some pic"}
          style={{ width: "100%", height: "auto" }}
        />
      </div>
    </div>
  );
}
