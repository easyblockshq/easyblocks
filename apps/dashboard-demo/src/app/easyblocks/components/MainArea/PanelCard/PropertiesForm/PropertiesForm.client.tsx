import { ReactElement } from "react";
import { NoCodeComponentProps } from "../../../types";

function PropertiesForm({ Fields, Action, Buttons }: NoCodeComponentProps) {
  const formElement = (
    <form>
      {(Fields as Array<ReactElement>).map((Field, index) => {
        return <Field.type key={index} {...Field.props} />;
      })}
      <div className="flex justify-end mt-4">
        <Buttons.type {...Buttons.props} />
      </div>
    </form>
  );

  if (Action) {
    return <Action.type {...Action.props} target={formElement} />;
  }

  return formElement;
}

export { PropertiesForm };
