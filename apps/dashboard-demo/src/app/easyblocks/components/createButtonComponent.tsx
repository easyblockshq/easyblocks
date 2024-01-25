// A universal wrapper for button components that takes into account the Action
export function createButtonComponent(Component: any) {
  // eslint-disable-next-line react/display-name
  return ({ Action, ...props }: Record<string, any>) => {
    if (Action) {
      return (
        <Action.type {...Action.props} trigger={<Component {...props} />} />
      );
    }

    return <Component {...props} />;
  };
}
