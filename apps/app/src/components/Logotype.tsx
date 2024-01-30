import { Logo } from "./Logo";

export function Logotype() {
  return (
    <div className="flex flex-row gap-2 items-center">
      <Logo size={28} radius={4} />
      <div className="font-medium">easyblocks</div>
    </div>
  );
}
