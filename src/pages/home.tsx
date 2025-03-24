'use client'
import React ,{useState, useEffect} from "react";
import Head from "next/head";
import { useSession } from "next-auth/react";
import LoginForm from "@/components/user/Login";
import MenuSection from "@/components/menu/menu";
import Recomendation from "@/components/recomendation/recomendation";
import  NewPostForm  from "@/components/post/NewPostForm";
import { ChevronRight, UserPlus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Image from 'next/image';
import Cookies from "js-cookie";

const RECOMMENDED_ACCOUNTS = [
    {
      id: 101,
      name: "Tech Insights",
      username: "techinsights",
      avatar: "https://i.pravatar.cc/150?img=7",
      bio: "Daily updates on the latest tech news and innovations",
      following: false
    },
    {
      id: 102,
      name: "Design Matters",
      username: "designmatters",
      avatar: "https://i.pravatar.cc/150?img=8",
      bio: "Exploring the intersection of design, technology, and creativity",
      following: true
    },
    {
      id: 103,
      name: "Future Finance",
      username: "futurefinance",
      avatar: "https://i.pravatar.cc/150?img=9",
      bio: "Analyzing trends in fintech, cryptocurrency, and digital banking",
      following: false
    }
  ];


export default function HomePage() {
      const [recommendedAccounts, setRecommendedAccounts] = useState<typeof RECOMMENDED_ACCOUNTS>([]);
      const [loading, setLoading] = useState(true);

      useEffect(() => {
        // Simulate loading data
        const timer = setTimeout(() => {
          setRecommendedAccounts(RECOMMENDED_ACCOUNTS);
          setLoading(false);
        }, 1000);
    
        return () => clearTimeout(timer);
      }, []);

      const token = Cookies.get("token");
      console.log("Token:", token);
  
      const handleFollow = (accountId: number) => {
          setRecommendedAccounts(accounts => accounts.map(account => {
            if (account.id === accountId) {
              return {
                ...account,
                following: !account.following
              };
            }
            return account;
          }));
        };

    const {data: session, status} = useSession();
    console.log(session);

    if(status === "loading") {
        return <div>Loading...</div>
    }
    

    if(!session & !token){
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

        <div className="flex flex-row items-center justify-center gap-2">
            <NewPostForm  />

            <aside className="md:w-72 hidden lg:w-80 sm:block fixed right-5 top-5 self-start order-1 md:order-2 animate-fade-in">
            <Card className="overflow-hidden">
              <div className="p-4 bg-secondary/40">
                <h2 className="font-semibold">Recommended for you</h2>
              </div>
              {loading ? (
                <div className="p-4 space-y-4">
                  {Array(3).fill(0).map((_, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-24 mb-1" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                      <Skeleton className="h-8 w-16 rounded-full" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {recommendedAccounts.map((account, index) => (
                    <div 
                      key={account.id} 
                      className="p-4 hover:bg-muted/50 transition-colors duration-200 animate-fade-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                          <Image 
                            src={account.avatar} 
                            width={40}
                            height={40}
                            alt={account.name} 
                            className="object-cover transition-transform duration-300 hover:scale-105"
                            loading="lazy"
                          />
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-1">
                            <p className="font-semibold">{account.name}</p>
                          </div>
                          <p className="text-sm text-muted-foreground">@{account.username}</p>
                        </div>
                        <Button 
                          variant={account.following ? "secondary" : "default"}
                          size="sm" 
                          className={`rounded-full transition-all duration-300 ${account.following ? 'bg-primary/10 text-primary hover:bg-primary/20' : ''}`}
                          onClick={() => handleFollow(account.id)}
                        >
                          {account.following ? 'Following' : (
                            <>
                              <UserPlus className="h-3 w-3 mr-1" />
                              Follow
                            </>
                          )}
                        </Button>
                      </div>
                      <p className="text-sm mt-2 text-muted-foreground">{account.bio}</p>
                    </div>
                  ))}
                  <div className="p-4">
                    <Button variant="ghost" className="w-full justify-between text-primary">
                      Show more
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </aside>
        </div>

        <div className="fixed sm:left-1/3 bottom-5 sm:bottom-6">
                <MenuSection  />
                </div>
         
         </div>
    )
}

