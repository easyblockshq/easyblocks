/** @jsx globalThis.__SHOPSTORY_REACT_SCOPE__.createElement */
import { dotNotationGet } from "@easyblocks/utils";
import type { CompiledShopstoryComponentProps } from "../../types";
import { InlineTextarea } from "./InlineTextarea";

type TextProps = CompiledShopstoryComponentProps<
  "$text",
  {
    value: string | undefined;
  },
  ReturnType<typeof import("./$text.styles")["default"]>
>;

function TextEditor(props: TextProps) {
  const {
    components: { Text },
    path,
    props: { value },
  } = props.__fromEditor;

  const { form } = window.parent.editorWindowAPI.editorContext;
  const valuePath = `${path}.value`;
  const configValue = dotNotationGet(form.values, valuePath);
  const isLocalTextReference = configValue.id?.startsWith("local.");

  return (
    <Text as={"div"}>
      {isLocalTextReference ? (
        <InlineTextarea
          path={path}
          placeholder={"Here goes text content"}
          stitches={props.__fromEditor.runtime.stitches}
        />
      ) : (
        value ?? <span>&nbsp;</span>
      )}
    </Text>
  );
}

export default TextEditor;
