import { ReactElement } from "react";
import { NoCodeComponentProps } from "../../types";

function AppShellSidebar({ Items }: NoCodeComponentProps) {
  return (
    <div className="w-56 px-2 py-3 border-r border-gray-200 flex flex-col items-stretch">
      {(Items as Array<ReactElement>).map((Item, index) => {
        return <Item.type {...Item.props} key={index} />;
      })}
    </div>
  );
}

export { AppShellSidebar };
