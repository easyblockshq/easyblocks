/** @jsx globalThis.__SHOPSTORY_REACT_SCOPE__.createElement */

function Icon(props: any) {
  const { IconWrapper } = props.__fromEditor.components;

  return (
    <IconWrapper
      dangerouslySetInnerHTML={{
        __html: props.__fromEditor.props.icon,
      }}
    />
  );
}

export default Icon;
