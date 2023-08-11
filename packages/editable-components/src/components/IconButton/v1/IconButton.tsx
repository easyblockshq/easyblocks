/** @jsx globalThis.__SHOPSTORY_REACT_SCOPE__.createElement */

function IconButton(props: any) {
  const {
    ButtonRoot,
    symbol: Symbol,
    IconWrapper,
  } = props.__fromEditor.components;

  const buttonProps: Record<string, any> = {
    ref: props.forwardedRef,
  };

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
      <IconWrapper>
        <Symbol />
      </IconWrapper>
    </ButtonRoot>
  );
}

export default IconButton;
