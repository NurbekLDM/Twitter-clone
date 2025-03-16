import React from "react";
import '@/styles/globals.css';
import Head from "next/head";
import Background from "@/components/background";



export default function FirstPage() {
    


    return (
       <div className="max-h-screen overflow-hidden" suppressHydrationWarning>
        <Head>
            <meta name="description" content="Twitter clone app home page" />
       </Head>
      <div className="bg-transparent">
        <Background />
        </div>

         </div>
    )
}

