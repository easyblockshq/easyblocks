/** @jsx globalThis.__SHOPSTORY_REACT_SCOPE__.createElement */
import type { ForwardRefRenderFunction, ReactNode, Ref } from "react";

function StandardButton(
  props: {
    __fromEditor: {
      components: {
        ButtonRoot: ForwardRefRenderFunction<
          HTMLButtonElement,
          { children: ReactNode }
        >;
      };
      props: {
        label: string | undefined;
      };
    };
    forwardedRef: Ref<HTMLButtonElement>;
  } & Record<string, any>
) {
  const { ButtonRoot } = props.__fromEditor.components;

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

  return (
    <ButtonRoot {...buttonProps}>
      <div>{props.__fromEditor.props.label ?? ""}</div>
    </ButtonRoot>
  );
}

export default StandardButton;
