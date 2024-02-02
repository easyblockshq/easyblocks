function TextLink({
  Link,
  url,
  shouldOpenInNewWindow,
  children,
}: Record<string, any>) {
  return (
    <Link.type
      {...Link.props}
      href={url}
      target={shouldOpenInNewWindow ? "_blank" : undefined}
    >
      {children}
    </Link.type>
  );
}

export { TextLink };
