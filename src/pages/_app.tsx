import "../styles/globals.css";
import { AppProps } from "next/app";
import { ThemeProvider } from "@/provider";



function MyApp({ Component, pageProps }: AppProps) {


  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >

        <Component {...pageProps} />

    </ThemeProvider>
  );
}

export default MyApp;
