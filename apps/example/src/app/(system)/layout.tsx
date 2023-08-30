import "../globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ACME Software",
  description: "ACME Software using Easyblocks",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className={"border-b border-gray-300"}>
          <header className="container mx-auto">
            <div className="flex justify-between items-center py-4">
              <div>
                <a className="text-lg leading-none font-medium">
                  ACME Company Software
                </a>
              </div>
              <div className="text-right leading-none">
                John Doe - john.doe@acme.com
              </div>
            </div>
          </header>
        </div>
        <main className="container mx-auto mt-16">{children}</main>
      </body>
    </html>
  );
}
