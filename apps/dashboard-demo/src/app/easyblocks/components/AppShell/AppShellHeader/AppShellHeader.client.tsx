import { NoCodeComponentProps } from "../../types";

function AppShellHeader({ Items }: NoCodeComponentProps) {
  return (
    <header className="h-[80px] w-full p-4 border-b border-gray-200">
      <Items.type {...Items.props} />
    </header>
  );
}

export { AppShellHeader };
