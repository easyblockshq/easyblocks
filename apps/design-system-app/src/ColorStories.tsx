import { SSColors, Typography } from "@easyblocks/design-system";
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
        <Color color={SSColors.black5}>black5</Color>
        <Color color={SSColors.black10}>black10</Color>
        <Color color={SSColors.black20}>black20</Color>
        <Color color={SSColors.black40}>black40</Color>
        <Color color={SSColors.blue}>blue</Color>
        <Color color={SSColors.blue10}>blue10</Color>
        <Color color={SSColors.blue20}>blue20</Color>
        <Color color={SSColors.blue50}>blue50</Color>
        <Color color={SSColors.blue60}>blue60</Color>
        <Color color={SSColors.blue70}>blue70</Color>
        <Color color={SSColors.focus}>focus</Color>
        <Color color={SSColors.purple}>purple</Color>
        <Color color={SSColors.red}>red</Color>
      </div>
    </div>
  );
}
