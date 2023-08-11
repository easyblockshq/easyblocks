/** @jsx globalThis.__SHOPSTORY_REACT_SCOPE__.createElement */
import React from "react";

function Playground(props: any) {
  const { Root, Span, ActionElement } = props.__fromEditor.components;
  const testRef = React.useRef<HTMLSpanElement>();

  React.useEffect(() => {
    if (testRef.current) {
      testRef.current.dataset.refTest = "ref test value";
    }
  }, []);

  return (
    <Root>
      <Span data-span-attribute={"span-attribute-value"} ref={testRef}>
        I'm span
      </Span>
      <ActionElement
        data-action-element-attribute={"action-element-attribute-value"}
      >
        I have action
      </ActionElement>
    </Root>
  );
}

export default Playground;
