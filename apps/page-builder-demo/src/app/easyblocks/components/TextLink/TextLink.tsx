import { NoCodeComponentProps } from "@easyblocks/core";

function TextLink({
  Link,
  url,
  shouldOpenInNewWindow,
  children,
  __easyblocks,
}: NoCodeComponentProps & Record<string, any>) {
  return (
    <Link.type
      {...Link.props}
      href={url}
      target={shouldOpenInNewWindow ? "_blank" : undefined}
      style={{
        backgroundColor: __easyblocks.isSelected ? "#ffff56" : undefined,
      }}
    >
      {children}
    </Link.type>
  );
}

export { TextLink };
