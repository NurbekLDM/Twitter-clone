'use client'
import React from "react";
import Head from "next/head";
import { useSession } from "next-auth/react";
import LoginForm from "@/components/user/Login";
import MenuSection from "@/components/menu/menu";
import Recomendation from "@/components/recomendation/recomendation";
import  NewPostForm  from "@/components/post/NewPostForm";

export default function HomePage() {
    const {data: session, status} = useSession();
    console.log(session);

    if(status === "loading") {
        return <div>Loading...</div>
    }
    
    if(!session){
        return <LoginForm />
    }

    return (
       <div suppressHydrationWarning>
        <Head>
            <title>Home Page</title>
            <meta name="description" content="Twitter clone app home page" />
       </Head>


        <div className="flex mt-8 justify-center mx-auto"> 
            <Recomendation />
        </div>

        <div>
            <NewPostForm />
        </div>

        <div className="fixed sm:left-1/3 bottom-5 sm:bottom-6">
                <MenuSection  />
                </div>
         
         </div>
    )
}

