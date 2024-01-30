import { ReactElement } from "react";
import { NoCodeComponentProps } from "../../types";

function PanelCard({
  HeaderStack,
  Items,
  Buttons,
  isEditable,
}: NoCodeComponentProps) {
  return (
    <div className="flex flex-col gap-4 p-4 border border-neutral-300 rounded-lg">
      <div className="flex justify-between gap-4">
        <div className="grow">
          <HeaderStack.type {...HeaderStack.props} />
        </div>
        {isEditable && (
          <div className="shrink-0">
            <Buttons.type {...Buttons.props} />
          </div>
        )}
      </div>

      {(Items as Array<ReactElement>).map((Item, index) => {
        return <Item.type {...Item.props} key={index} />;
      })}
    </div>
  );
}

export { PanelCard };
