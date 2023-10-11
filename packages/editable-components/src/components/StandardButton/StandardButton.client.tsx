/** @jsx globalThis.__SHOPSTORY_REACT_SCOPE__.createElement */
import type {
  ForwardRefRenderFunction,
  ReactElement,
  ReactNode,
  Ref,
} from "react";

function StandardButton(
  props: {
    __fromEditor: {
      components: {
        ButtonRoot: ForwardRefRenderFunction<
          HTMLButtonElement,
          { children: ReactNode }
        >;
        IconWrapper: any;
        Action: ReactElement;
      };
      props: {
        label: string | undefined;
        icon: string;
        variant: "label" | "icon" | "label-icon";
      };
    };
    forwardedRef: Ref<HTMLButtonElement>;
  } & Record<string, any>
) {
  const { ButtonRoot, IconWrapper, Action } = props.__fromEditor.components;
  const variant = props.__fromEditor.props.variant;

  // Every Shopstory button is just a component that must have props and ref passed.
  const buttonProps: Record<string, any> = {
    // dangerouslySetInnerHTML: {__html: props.configProps.icon },
    ref: props.forwardedRef,
  };

  // TODO: pass through button-related props -> do "spread" later -> there's duplication in IconButton too, do sth with it
  for (const key in props) {
    if (
      key === "as" ||
      key === "onClick" ||
      key === "href" ||
      key === "target"
    ) {
      buttonProps[key] = props[key];
    }
  }

  const triggerElement = (
    <ButtonRoot {...buttonProps}>
      {variant !== "icon" && <div>{props.__fromEditor.props.label ?? ""}</div>}
      {variant !== "label" && (
        <IconWrapper
          dangerouslySetInnerHTML={{
            __html: props.__fromEditor.props.icon,
          }}
        />
      )}
    </ButtonRoot>
  );

  if (Action) {
    return <Action.type {...Action.props} trigger={triggerElement} />;
  }
  return triggerElement;
}

export default StandardButton;
