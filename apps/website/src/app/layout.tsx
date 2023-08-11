import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Menu } from "@/components/Menu/Menu";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Easyblocks | The no-code framework",
  description:
    "A complete developer toolkit to add a custom visual page builder to your product. Open-source blocks, flexible editor and no-code framework.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-9DJ1VQDL25"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
      window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'G-9DJ1VQDL25');
      `,
          }}
        ></script>
      </head>
      <body className={inter.className}>
        <Menu />

        <main className={"page-container"}>{children}</main>
      </body>
    </html>
  );
}
