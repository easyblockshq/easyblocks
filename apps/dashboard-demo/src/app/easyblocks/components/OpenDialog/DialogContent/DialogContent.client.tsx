import { NoCodeActionComponentProps } from "../../types";

function DialogContent({ Root, Content }: NoCodeActionComponentProps) {
  return (
    <Root.type {...Root.props}>
      <Content.type {...Content.props} />
    </Root.type>
  );
}

export { DialogContent };
