import Link from "next/link";

export default function MainPage() {
  return (
    <div className={"container mx-auto"}>
      <h2 className={"text-2xl mb-16"}>Hello</h2>

      <Link
        href={`/entries`}
        className={"underline text-blue-500 hover:opacity-70"}
      >
        System entries
      </Link>
    </div>
  );
}
