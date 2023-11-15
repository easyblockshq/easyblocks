import React, { ReactElement } from "react";

function Playground(props: {
  Root: ReactElement;
  Span: ReactElement;
  ActionElement: ReactElement;
}) {
  const { Root, Span, ActionElement } = props;
  const testRef = React.useRef<HTMLSpanElement>();

  React.useEffect(() => {
    if (testRef.current) {
      testRef.current.dataset.refTest = "ref test value";
    }
  }, []);

  return (
    <Root.type {...Root.props}>
      <Span.type
        {...Span.props}
        data-span-attribute={"span-attribute-value"}
        ref={testRef}
      >
        I'm span
      </Span.type>
      <ActionElement.type
        {...ActionElement.props}
        data-action-element-attribute={"action-element-attribute-value"}
      >
        I have action
      </ActionElement.type>
    </Root.type>
  );
}

export default Playground;
