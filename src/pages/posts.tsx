import { useState, useEffect } from "react";
import { ChevronRight, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import MenuSection from "@/components/menu/menu";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Posts from "@/components/post/Posts";
import  authService  from "@/actions/user.action";





const PostsPage = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);


  useEffect(() => {
    const timer = setTimeout(() => {
   
      const getUsers = async () => {
        try {
          const response = await authService.getRecommendedUsers();
          
          const shuffled = response.data.sort(() => 0.5 - Math.random());
          const recommendedUsers = shuffled.slice(0, 5);        
          setUsers(recommendedUsers);
          console.log("Recommended users:", recommendedUsers);
  
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      }
      getUsers();

      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);

  }, []);

  const handleFollow = async (userId) => {
        try {
          const response = await authService.followUser({ followingId: userId });
          console.log("Follow user response:", response);

        } catch (error) {
          console.log("Error following user:", error);
        }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleUnfollow = async (followingId) => {
    try {
      const response = await authService.unfollowUser(followingId);
      console.log("Unfollow user response:", response);

    } catch (error) {
      console.log("Error unfollowing user:", error);
  }
}


  return (
    <div className="min-h-screen  bg-background">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md py-3 border-b border-border animate-fade-in">
          <h1 className="text-2xl font-bold text-center">Posts</h1>
        </header>

        <main className="mt-6 flex flex-col md:flex-row gap-6">
          {/* Posts Feed Section */}
          <section className="flex-grow order-2 md:order-1 animate-slide-up">
            {loading ? (
              // Skeleton loading state
              Array(3)
                .fill(0)
                .map((_, index) => (
                  <Card key={index} className="mb-4 overflow-hidden p-4">
                    <div className="flex items-start gap-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <Skeleton className="h-4 w-24 mb-1" />
                            <Skeleton className="h-3 w-16" />
                          </div>
                          <Skeleton className="h-6 w-6 rounded-full" />
                        </div>
                        <Skeleton className="h-4 w-full mt-3" />
                        <Skeleton className="h-4 w-3/4 mt-2" />
                        <Skeleton className="h-[150px] w-full mt-3 rounded-lg" />
                        <div className="flex justify-between mt-4">
                          <Skeleton className="h-6 w-20" />
                          <Skeleton className="h-6 w-20" />
                          <Skeleton className="h-6 w-20" />
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
            ) : (
              
                    <Posts />
              
          
            )}
          </section>

          {/* Recommended Accounts Sidebar */}
          <aside className="md:w-72 lg:w-80 md:sticky md:top-16 self-start order-1 md:order-2 animate-fade-in">
            <Card className="overflow-hidden">
              <div className="p-4 bg-secondary/40">
                <h2 className="font-semibold">Recommended for you</h2>
              </div>
              {loading ? (
                <div className="p-4 space-y-4">
                  {Array(3)
                    .fill(0)
                    .map((_, index) => (
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
                  {users.map((account, index) => (
                    <div
                      key={account.id}
                      className="p-4 hover:bg-muted/50 transition-colors duration-200 animate-fade-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                          <Image
                            src={account.profile_picture}
                            width={40}
                            height={40}
                            alt={account.name}
                            className="object-cover transition-transform duration-300 hover:scale-105"
                            loading="lazy"
                          />
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-1">
                            <p className="font-semibold">{account.full_name}</p>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            @{account.username}
                          </p>
                        </div>
                        <Button
                          variant={account.following ? "secondary" : "default"}
                          size="sm"
                          className={`rounded-full transition-all duration-300 ${
                            account.following
                              ? "bg-primary/10 text-primary hover:bg-primary/20"
                              : ""
                          }`}
                          onClick={() => handleFollow(account.id)}
                        >
                          {account.following ? (
                            "Following"
                          ) : (
                            <>
                              <UserPlus className="h-3 w-3 mr-1" />
                              Follow
                            </>
                          )}
                        </Button>
                      </div>
                      <p className="text-sm mt-2 text-muted-foreground">
                        {account.bio}
                      </p>
                    </div>
                  ))}
                  <div className="p-4">
                    <Button
                      variant="ghost"
                      className="w-full justify-between text-primary"
                    >
                      Show more
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </aside>
        </main>
      </div>
      <div className="fixed sm:left-1/3 bottom-5 sm:bottom-6">
        <MenuSection />
      </div>
    </div>
  );
};


export default PostsPage;
