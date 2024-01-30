import { Colors, Typography } from "@easyblocks/design-system";
import { ReactNode } from "react";

const Color: React.FC<{ color: string; children: ReactNode }> = ({
  color,
  children,
}) => {
  return (
    <div>
      <div style={{ marginBottom: "8px" }}>
        {/* @ts-ignore */}
        <Typography variant={"body"}>{children}</Typography>
      </div>
      <div
        style={{
          width: "50px",
          height: "50px",
          background: color,
          border: "1px dashed black",
        }}
      ></div>
    </div>
  );
};

export function ColorStories() {
  return (
    <div>
      <Typography variant={"label"}>Colors</Typography>
      <br />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        <Color color={Colors.black5}>black5</Color>
        <Color color={Colors.black10}>black10</Color>
        <Color color={Colors.black20}>black20</Color>
        <Color color={Colors.black40}>black40</Color>
        <Color color={Colors.blue}>blue</Color>
        <Color color={Colors.blue10}>blue10</Color>
        <Color color={Colors.blue20}>blue20</Color>
        <Color color={Colors.blue50}>blue50</Color>
        <Color color={Colors.blue60}>blue60</Color>
        <Color color={Colors.blue70}>blue70</Color>
        <Color color={Colors.focus}>focus</Color>
        <Color color={Colors.purple}>purple</Color>
        <Color color={Colors.red}>red</Color>
      </div>
    </div>
  );
}
