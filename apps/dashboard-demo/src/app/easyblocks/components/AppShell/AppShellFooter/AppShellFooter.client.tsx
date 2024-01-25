import { NoCodeComponentProps } from "../../types";

function AppShellFooter({ Items }: NoCodeComponentProps) {
  return (
    <footer className="h-[80px] w-full p-4 border-t border-gray-200">
      <Items.type {...Items.props} />
    </footer>
  );
}

export { AppShellFooter };
