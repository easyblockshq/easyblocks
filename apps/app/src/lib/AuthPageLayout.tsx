import { Logotype } from "@/components/Logotype";
import { Flex } from "@radix-ui/themes";
import { ReactNode } from "react";

function AuthPageLayout({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <div
      css={`
        position: fixed;
        inset: 0;
        display: grid;
        place-items: center;
      `}
    >
      <div className="w-96 flex flex-col gap-5">
        <div className="self-center">
          <Logotype />
        </div>

        <div className={"border border-slate-200 rounded-lg p-5"}>
          <h1 className="text-xl font-semibold text-center pt-6 pb-9">
            {title}
          </h1>
          {children}
        </div>
      </div>
    </div>
  );
}

export { AuthPageLayout };
