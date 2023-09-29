/** @jsx globalThis.__SHOPSTORY_REACT_SCOPE__.createElement */
import type { ExternalValueProp } from "@easyblocks/core";
import type { CompiledShopstoryComponentProps } from "../../types";
import { InlineTextarea } from "./InlineTextarea";

type TextProps = CompiledShopstoryComponentProps<
  "$text",
  {
    value: string | ExternalValueProp<string>;
  },
  ReturnType<typeof import("./$text.styles")["default"]>
>;

function TextEditor(props: TextProps) {
  const {
    components: { Text },
    path,
    props: { value },
  } = props.__fromEditor;

  return (
    <Text as={"div"}>
      {value !== null && typeof value === "object" ? (
        value.value
      ) : (
        <InlineTextarea
          path={path}
          placeholder={"Here goes text content"}
          stitches={props.__fromEditor.runtime.stitches}
        />
      )}
    </Text>
  );
}

export default TextEditor;
