// A universal wrapper for button components that takes into account the Action

import React from "react";
import { ActionTriggerType } from "./types";

export function createButtonComponent<OwnProps>(
  TriggerComponent: ActionTriggerType<OwnProps>
) {
  return ({ Action, ...props }: any) => {
    if (Action) {
      return (
        <Action.type
          {...Action.props}
          trigger={<TriggerComponent {...props} />}
        />
      );
    }

    return <TriggerComponent {...props} />;
  };
}
