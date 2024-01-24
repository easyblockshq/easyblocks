import { useState } from "react";
import Link from "next/link";
import { FileTextIcon, LockClosedIcon } from "@radix-ui/react-icons";

type ProjectCardProps = {
  link: string;
  title: string;
  documentsCount: number;
  // tokensCount: number,
};

export function ProjectCard(props: ProjectCardProps) {
  const [isHovered, setHovered] = useState(false);

  return (
    <Link
      href={props.link}
      className="border border-slate-200 rounded-md p-3 h-28  flex flex-col hover:bg-slate-50 cursor-pointer"
      onMouseOver={() => {
        setHovered(true);
      }}
      onMouseOut={() => {
        setHovered(false);
      }}
    >
      <div className="flex flex-row gap-1 items-center mb-2">
        <div className="text-md font-semibold">{props.title}</div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className={`w-3 h-3 inline text-center ${isHovered ? "" : "hidden"}`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
          />
        </svg>
      </div>

      <div className="flex flex-row gap-3">
        <div className="text-sm text-slate-500 flex flex-row gap-1 items-center">
          <FileTextIcon /> {props.documentsCount} documents
        </div>
        {/* <div className="text-sm text-slate-500 flex flex-row gap-1 items-center"><LockClosedIcon /> {props.tokensCount} tokens</div> */}
      </div>
    </Link>
  );
}
