import { ReactElement } from "react";
import { NoCodeComponentProps } from "../../../types";

function SubmitButtonAction({
  trigger: Trigger,
}: NoCodeComponentProps & { trigger: ReactElement }) {
  return <Trigger.type {...Trigger.props} type="submit" />;
}

export { SubmitButtonAction };
