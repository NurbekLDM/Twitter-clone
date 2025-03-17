import { useState, useEffect } from 'react';
import { ChevronRight, UserPlus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import MenuSection from '@/components/menu/menu';
import { Skeleton } from "@/components/ui/skeleton";
import Image from 'next/image';
import Post, { PostProps } from '@/components/post/Post';

// Sample data for posts converted to match your PostProps interface
const POSTS: PostProps[] = [
  {
    id: 1,
    username: "jesschen",
    fullName: "Jessica Chen",
    profilePicture: "https://i.pravatar.cc/150?img=1",
    content: "Just discovered a fantastic new design tool that streamlines my workflow. Anyone else tried it yet? #DesignTools #UXDesign",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80",
    timestamp: "2h ago",
    likes: 245,
    comments: 32,
    reposts: 18,
  },
  {
    id: 2,
    username: "alexm",
    fullName: "Alex Morgan",
    profilePicture: "https://i.pravatar.cc/150?img=2",
    content: "The new iPhone update has some really interesting accessibility features. Super impressed by how technology is becoming more inclusive.",
    timestamp: "5h ago",
    likes: 189,
    comments: 23,
    reposts: 7,
  },
  {
    id: 3,
    username: "sarahj",
    fullName: "Sarah Johnson",
    profilePicture: "https://i.pravatar.cc/150?img=3",
    content: "Just finished a 10km run through the city. The sunrise over the skyline was absolutely breathtaking! 🏃‍♀️ #MorningRun #FitnessGoals",
    image: "https://images.unsplash.com/photo-1506631698645-c61e11b87378?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    timestamp: "7h ago",
    likes: 412,
    comments: 47,
    reposts: 29,
  },
  {
    id: 4,
    username: "davidk",
    fullName: "David Kim",
    profilePicture: "https://i.pravatar.cc/150?img=4",
    content: "Working on a new project that combines AI and sustainable energy. Excited to share more details soon! #AI #CleanEnergy #Innovation",
    timestamp: "10h ago",
    likes: 327,
    comments: 54,
    reposts: 41,
  },
  {
    id: 5,
    username: "emmaw",
    fullName: "Emma Wilson",
    profilePicture: "https://i.pravatar.cc/150?img=5",
    content: "Finally got tickets to that concert I've been waiting for! Anyone else going to be there? #MusicFestival #WeekendPlans",
    timestamp: "12h ago",
    likes: 156,
    comments: 19,
    reposts: 5,
  },
  {
    id: 6,
    username: "michaelb",
    fullName: "Michael Brown",
    profilePicture: "https://i.pravatar.cc/150?img=6",
    content: "Just published my first article on medium about my journey into coding. Link in bio if you're interested! #Coding #TechJourney #WebDevelopment",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    timestamp: "1d ago",
    likes: 289,
    comments: 38,
    reposts: 27,
  }
];

// Sample data for recommended accounts
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
  },
  {
    id: 104,
    name: "Health & Wellness",
    username: "healthplus",
    avatar: "https://i.pravatar.cc/150?img=10",
    bio: "Tips and insights for a balanced, healthy lifestyle",
    following: false
  },
  {
    id: 105,
    name: "Travel Nomad",
    username: "travelnomad",
    avatar: "https://i.pravatar.cc/150?img=11",
    bio: "Documenting adventures around the world",
    following: false
  }
];

// Ko'rish uchun ishlatiladigan qo'shimcha object
interface LikedPosts {
  [key: number]: boolean;
}

const PostsPage = () => {
  const [posts, setPosts] = useState<PostProps[]>([]);
  const [recommendedAccounts, setRecommendedAccounts] = useState<typeof RECOMMENDED_ACCOUNTS>([]);
  const [loading, setLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState<LikedPosts>({});

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setPosts(POSTS);
      setRecommendedAccounts(RECOMMENDED_ACCOUNTS);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Bu funksiya Post komponentidan chaqiriladi va yangilangan ma'lumotlarni qaytaradi
  const handleLike = (postId: number) => {
    // Avval likedPosts holatini yangilash
    setLikedPosts(prev => {
      const isLiked = !prev[postId];
      return { ...prev, [postId]: isLiked };
    });
    
    // Keyin posts holatini yangilash
    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id === postId) {
          // Aniq raqamli qiymat qaytaramiz
          const currentLikes = post.likes || 0; // Agar likes undefined bo'lsa, 0 ni ishlatamiz
          const newLikes = likedPosts[postId] ? currentLikes - 1 : currentLikes + 1;
          
          return {
            ...post,
            likes: newLikes
          };
        }
        return post;
      })
    );
  };

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
              Array(3).fill(0).map((_, index) => (
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
              <div className="space-y-4">
                {posts.map((post, index) => (
                  <div key={post.id} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                    <Post 
                      {...post} 
                    />
                  </div>
                ))}
              </div>
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
        </main>
      </div>
      <div className="fixed sm:left-1/3 bottom-5 sm:bottom-6">
        <MenuSection />
      </div>
    </div>
  );
};

export default PostsPage;