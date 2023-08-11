/** @jsx globalThis.__SHOPSTORY_REACT_SCOPE__.createElement */
import { CompiledShopstoryComponentProps } from "../../types";
import { InlineTextarea } from "./InlineTextarea";

type TextProps = CompiledShopstoryComponentProps<
  "$text",
  never,
  ReturnType<typeof import("./$text.styles")["default"]>
>;

const $text = (props: TextProps) => {
  const {
    components: { Text },
    path,
  } = props.__fromEditor;

  return (
    <Text as={"div"}>
      <InlineTextarea
        path={path}
        placeholder={"Here goes text content"}
        stitches={props.__fromEditor.runtime.stitches}
      />
    </Text>
  );
};

export default $text;
