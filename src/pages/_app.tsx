import "../styles/globals.css";
import { AppProps } from "next/app";
import { ThemeProvider } from "@/provider";
import { Toaster } from "sonner";


function MyApp({ Component, pageProps }: AppProps) {


  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      themes={['light', 'dark', 'system', 'dimmed', 'neon' , 'sepia', 'solarized']}
      disableTransitionOnChange
    >

        <Component {...pageProps} />
       <Toaster />
    </ThemeProvider>
  );
}

export default MyApp;
