import "../styles/globals.css";
import { ReactNode } from "react";
import Head from "next/head";

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Head>
        <title>Twitter clone</title>
        <meta name="description" content="Twitter clone app" />
      </Head>
      <body>
        <main className="transition-colors duration-300">{children}</main>
      </body>
    </html>
  );
}