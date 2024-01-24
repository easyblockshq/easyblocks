type ContainerProps = {
  children: React.ReactNode;
};

export function Container(props: ContainerProps) {
  return <div className="px-5 max-w-5xl mx-auto">{props.children}</div>;
}
