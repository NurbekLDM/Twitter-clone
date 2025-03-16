import "../styles/globals.css";
import { ReactNode } from "react";
import { ThemeProvider } from "@/provider";
import Head from "next/head";
import MenuSection from "./menu/menu";

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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
         <main> {children} </main>


        </ThemeProvider>
      </body>
    </html>
  );
}