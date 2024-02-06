function Code({ children, Wrapper }: Record<string, any>) {
  return <Wrapper.type {...Wrapper.props}>{children}</Wrapper.type>;
}

export { Code };
