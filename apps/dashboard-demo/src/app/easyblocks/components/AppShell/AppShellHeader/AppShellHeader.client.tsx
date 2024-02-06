import { NoCodeComponentProps } from "../../types";
import Image from "next/image";
import snailImg from "./NicePng_snail-png_1032036.png";

function LogoType() {
  return (
    <div className="flex flex-row items-center gap-2">
      <Image src={snailImg} alt="Picture of the author" width={24} />
      <div className="text-md font-bold">Snailsforce</div>
    </div>
  );
}

function AppShellHeader({ Items, Root }: NoCodeComponentProps) {
  return (
    <header className="h-[60px] w-full p-4 border-b border-gray-200 flex flex-row gap-6 items-center">
      <LogoType />

      <Root.type {...Root.props}>
        {Items.map((Item: React.ReactElement) => (
          <Item.type {...Item.props} />
        ))}
      </Root.type>
    </header>
  );
}

export { AppShellHeader };
