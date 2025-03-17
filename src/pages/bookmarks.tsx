import { useState, useEffect } from 'react';
import { 
  Heart, MessageCircle, Repeat2,  MoreHorizontal, 
  Check, BookmarkMinus, Bookmark 
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import MenuSection from "@/components/menu/menu";
import Image from 'next/image';

// Sample data for bookmarked posts
const BOOKMARKED_POSTS = [
  {
    id: 1,
    author: {
      name: "Jessica Chen",
      username: "jesschen",
      avatar: "https://i.pravatar.cc/150?img=1",
      verified: true
    },
    content: "Just discovered a fantastic new design tool that streamlines my workflow. Anyone else tried it yet? #DesignTools #UXDesign",
    timestamp: "2h",
    stats: {
      likes: 245,
      comments: 32,
      retweets: 18
    },
    liked: true,
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&w=2072&q=80",
    bookmarkedOn: "Today at 10:30 AM"
  },
  {
    id: 3,
    author: {
      name: "Sarah Johnson",
      username: "sarahj",
      avatar: "https://i.pravatar.cc/150?img=3",
      verified: true
    },
    content: "Just finished a 10km run through the city. The sunrise over the skyline was absolutely breathtaking! 🏃‍♀️ #MorningRun #FitnessGoals",
    timestamp: "7h",
    stats: {
      likes: 412,
      comments: 47,
      retweets: 29
    },
    liked: false,
    image: "https://images.unsplash.com/photo-1506631698645-c61e11b87378?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    bookmarkedOn: "Yesterday at 3:45 PM"
  },
  {
    id: 5,
    author: {
      name: "Emma Wilson",
      username: "emmaw",
      avatar: "https://i.pravatar.cc/150?img=5",
      verified: true
    },
    content: "Finally got tickets to that concert I've been waiting for! Anyone else going to be there? #MusicFestival #WeekendPlans",
    timestamp: "12h",
    stats: {
      likes: 156,
      comments: 19,
      retweets: 5
    },
    liked: true,
    bookmarkedOn: "2 days ago"
  },
  {
    id: 6,
    author: {
      name: "Michael Brown",
      username: "michaelb",
      avatar: "https://i.pravatar.cc/150?img=6",
      verified: false
    },
    content: "Just published my first article on medium about my journey into coding. Link in bio if you're interested! #Coding #TechJourney #WebDevelopment",
    timestamp: "1d",
    stats: {
      likes: 289,
      comments: 38,
      retweets: 27
    },
    liked: false,
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    bookmarkedOn: "Last week"
  }
];

const BookmarksPage = () => {
  const [bookmarkedPosts, setBookmarkedPosts] = useState<typeof BOOKMARKED_POSTS>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setBookmarkedPosts(BOOKMARKED_POSTS);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleRemoveBookmark = (postId: number) => {
    setBookmarkedPosts(prev => prev.filter(post => post.id !== postId));
    toast({
      title: "Removed from bookmarks",
      description: "Post has been removed from your bookmarks",
      duration: 3000,
    });
  };

  const handleLike = (postId: number) => {
    setBookmarkedPosts(posts => posts.map(post => {
      if (post.id === postId) {
        const newLikedStatus = !post.liked;
        return {
          ...post,
          liked: newLikedStatus,
          stats: {
            ...post.stats,
            likes: newLikedStatus ? post.stats.likes + 1 : post.stats.likes - 1
          }
        };
      }
      return post;
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md py-3 border-b border-border animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              
              <h1 className="text-2xl font-bold">Bookmarks</h1>
            </div>
          </div>
        </header>
        
        <main className="mt-6 animate-slide-up">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="all">All Bookmarks</TabsTrigger>
              <TabsTrigger value="recent">Recently Added</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-0">
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
              ) : bookmarkedPosts.length > 0 ? (
                <div className="space-y-4">
                  {bookmarkedPosts.map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <Card className="overflow-hidden transition-all duration-300 hover:shadow-md relative group">
                        <div className="absolute top-2 right-2 z-10">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <Button
                              variant="secondary"
                              size="sm"
                              className="rounded-full bg-background/80 backdrop-blur-sm shadow-sm"
                              onClick={() => handleRemoveBookmark(post.id)}
                            >
                              <BookmarkMinus className="h-4 w-4 mr-1 text-muted-foreground" />
                              Remove
                            </Button>
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="flex items-start gap-3">
                            <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                              <Image
                                  width={40}
                                    height={40}
                                src={post.author.avatar} 
                                alt={post.author.name}
                                className="object-cover transition-transform duration-300"
                                loading="lazy"
                              />
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="flex items-center gap-1">
                                    <p className="font-semibold">{post.author.name}</p>
                                    {post.author.verified && (
                                      <Badge variant="secondary" className="h-4 w-4 p-0 ml-0.5 bg-primary/10 text-primary">
                                        <Check className="h-3 w-3" />
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-muted-foreground">@{post.author.username} • {post.timestamp}</p>
                                </div>
                                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </div>
                              <p className="mt-2 text-balance">{post.content}</p>
                              {post.image && (
                                <div className="mt-3 rounded-lg overflow-hidden bg-muted">
                                  <Image
                                    width={300}
                                    height={300} 
                                    src={post.image} 
                                    alt="Post attachment" 
                                    className="w-full h-auto object-cover transition-opacity duration-500 hover:opacity-95"
                                    loading="lazy"
                                  />
                                </div>
                              )}
                              <div className="flex justify-between mt-4">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-muted-foreground hover:text-primary hover:bg-primary/10"
                                >
                                  <MessageCircle className="h-4 w-4 mr-1" />
                                  <span>{post.stats.comments}</span>
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-muted-foreground hover:text-green-500 hover:bg-green-500/10"
                                >
                                  <Repeat2 className="h-4 w-4 mr-1" />
                                  <span>{post.stats.retweets}</span>
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className={`hover:bg-red-500/10 ${post.liked ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'}`}
                                  onClick={() => handleLike(post.id)}
                                >
                                  <Heart className={`h-4 w-4 mr-1 ${post.liked ? 'fill-current' : ''}`} />
                                  <span>{post.stats.likes}</span>
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-primary fill-primary"
                                  onClick={() => handleRemoveBookmark(post.id)}
                                >
                                  <Bookmark className="h-4 w-4 mr-1 fill-current" />
                                </Button>
                              </div>
                              <div className="mt-3 pt-3 border-t border-border">
                                <p className="text-xs text-muted-foreground">
                                  Bookmarked: {post.bookmarkedOn}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Bookmark className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-medium mb-2">No bookmarks yet</h3>
                  <p className="text-muted-foreground max-w-sm mx-auto mb-6">
                    When you bookmark posts, they'll appear here for easy access later.
                  </p>
                </div>
              )}
            </TabsContent>
            <TabsContent value="recent" className="mt-0">
              {loading ? (
                // Same skeleton as above
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
                  {/* Filter to show only recent bookmarks (last 2 days) */}
                  {bookmarkedPosts
                    .filter(post => post.bookmarkedOn.includes("Today") || post.bookmarkedOn.includes("Yesterday"))
                    .map((post, index) => (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <Card className="overflow-hidden transition-all duration-300 hover:shadow-md relative group">
                          <div className="absolute top-2 right-2 z-10">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <Button
                                variant="secondary"
                                size="sm"
                                className="rounded-full bg-background/80 backdrop-blur-sm shadow-sm"
                                onClick={() => handleRemoveBookmark(post.id)}
                              >
                                <BookmarkMinus className="h-4 w-4 mr-1 text-muted-foreground" />
                                Remove
                              </Button>
                            </div>
                          </div>
                          <div className="p-4">
                            <div className="flex items-start gap-3">
                              <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                                <Image
                                    width={40}
                                    height={40} 
                                  src={post.author.avatar} 
                                  alt={post.author.name}
                                  className="object-cover transition-transform duration-300"
                                  loading="lazy"
                                />
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <div className="flex items-center gap-1">
                                      <p className="font-semibold">{post.author.name}</p>
                                      {post.author.verified && (
                                        <Badge variant="secondary" className="h-4 w-4 p-0 ml-0.5 bg-primary/10 text-primary">
                                          <Check className="h-3 w-3" />
                                        </Badge>
                                      )}
                                    </div>
                                    <p className="text-sm text-muted-foreground">@{post.author.username} • {post.timestamp}</p>
                                  </div>
                                  <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </div>
                                <p className="mt-2 text-balance">{post.content}</p>
                                {post.image && (
                                  <div className="mt-3 rounded-lg overflow-hidden bg-muted">
                                    <Image
                                    width={300}
                                    height={300} 
                                      src={post.image} 
                                      alt="Post attachment" 
                                      className="w-full h-auto object-cover transition-opacity duration-500 hover:opacity-95"
                                      loading="lazy"
                                    />
                                  </div>
                                )}
                                <div className="flex justify-between mt-4">
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-muted-foreground hover:text-primary hover:bg-primary/10"
                                  >
                                    <MessageCircle className="h-4 w-4 mr-1" />
                                    <span>{post.stats.comments}</span>
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-muted-foreground hover:text-green-500 hover:bg-green-500/10"
                                  >
                                    <Repeat2 className="h-4 w-4 mr-1" />
                                    <span>{post.stats.retweets}</span>
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className={`hover:bg-red-500/10 ${post.liked ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'}`}
                                    onClick={() => handleLike(post.id)}
                                  >
                                    <Heart className={`h-4 w-4 mr-1 ${post.liked ? 'fill-current' : ''}`} />
                                    <span>{post.stats.likes}</span>
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-primary fill-primary"
                                    onClick={() => handleRemoveBookmark(post.id)}
                                  >
                                    <Bookmark className="h-4 w-4 mr-1 fill-current" />
                                  </Button>
                                </div>
                                <div className="mt-3 pt-3 border-t border-border">
                                  <p className="text-xs text-muted-foreground">
                                    Bookmarked: {post.bookmarkedOn}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  {bookmarkedPosts.filter(post => post.bookmarkedOn.includes("Today") || post.bookmarkedOn.includes("Yesterday")).length === 0 && (
                    <div className="text-center py-16">
                      <Bookmark className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-medium mb-2">No recent bookmarks</h3>
                      <p className="text-muted-foreground max-w-sm mx-auto mb-6">
                        You haven't added any bookmarks in the last 48 hours.
                      </p>
                      
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>
      <div className="fixed sm:left-1/3 bottom-5 sm:bottom-6">
        <MenuSection />
      </div>
    </div>
  );
};

export default BookmarksPage;