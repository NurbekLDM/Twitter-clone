'use client'
import { useState, useEffect } from 'react';
import { 
  Heart, MessageCircle, Clock, Calendar, History as HistoryIcon, User
} from 'lucide-react';
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Image from 'next/image';
import MenuSection from "@/components/menu/menu";

// Sample data for user history
const USER_HISTORY = {
  likes: [
    {
      id: 1,
      post: {
        id: 2,
        content: "The new iPhone update has some really interesting accessibility features. Super impressed by how technology is becoming more inclusive.",
        timestamp: "5h",
      },
      actionDate: "2024-03-15T14:30:00"
    },
    {
      id: 2,
      post: {
        id: 5,
        content: "Finally got tickets to that concert I've been waiting for! Anyone else going to be there? #MusicFestival #WeekendPlans",
        timestamp: "12h",
      },
      actionDate: "2024-03-14T09:15:00"
    },
    {
      id: 3,
      post: {
        id: 1,
        content: "Just discovered a fantastic new design tool that streamlines my workflow. Anyone else tried it yet? #DesignTools #UXDesign",
        timestamp: "2h",
      },
      actionDate: "2024-03-13T18:45:00"
    }
  ],
  comments: [
    {
      id: 1,
      post: {
        id: 3,
        author: {
          name: "Sarah Johnson",
          username: "sarahj",
          avatar: "https://i.pravatar.cc/150?img=3",
        },
        content: "Just finished a 10km run through the city. The sunrise over the skyline was absolutely breathtaking! 🏃‍♀️ #MorningRun #FitnessGoals",
        timestamp: "7h",
      },
      comment: "That's impressive! Which route did you take?",
      actionDate: "2024-03-16T08:20:00"
    },
    {
      id: 2,
      post: {
        id: 6,
        author: {
          name: "Michael Brown",
          username: "michaelb",
          avatar: "https://i.pravatar.cc/150?img=6",
        },
        content: "Just published my first article on medium about my journey into coding. Link in bio if you're interested! #Coding #TechJourney #WebDevelopment",
        timestamp: "1d",
      },
      comment: "Great article! Looking forward to more content from you.",
      actionDate: "2024-03-15T16:10:00"
    }
  ]
};

const History = () => {
  const [userHistory, setUserHistory] = useState<typeof USER_HISTORY | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setUserHistory(USER_HISTORY);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md py-3 border-b border-border mb-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
            
              <h1 className="text-2xl font-bold">Activity History</h1>
            </div>
            
          </div>
        </header>

        <main className="animate-slide-up">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="w-full mb-6">
              <TabsTrigger value="all" className="flex-1">
                <HistoryIcon className="h-4 w-4 mr-2" />
                All Activity
              </TabsTrigger>
              <TabsTrigger value="likes" className="flex-1">
                <Heart className="h-4 w-4 mr-2" />
                Likes
              </TabsTrigger>
              <TabsTrigger value="comments" className="flex-1">
                <MessageCircle className="h-4 w-4 mr-2" />
                Comments
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <div className="space-y-1">
                <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  Your Recent Activity
                </h2>
                
                {loading ? (
                  // Skeleton loading for all activities
                  <ActivitySkeleton count={5} />
                ) : (
                  <div className="space-y-1">
                    {[...userHistory?.comments || [], ...userHistory?.likes || []]
                      .sort((a, b) => new Date(b.actionDate).getTime() - new Date(a.actionDate).getTime())
                      .map((activity) => {
                        const isComment = 'comment' in activity;
                        return (
                          <ActivityCard 
                            key={`${isComment ? 'comment' : 'like'}-${activity.id}`}
                            activity={activity}
                            type={isComment ? 'comment' : 'like'}
                            formatDate={formatDate}
                          />
                        );
                      })
                    }
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="likes">
              <div className="space-y-1">
                <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
                  <Heart className="h-5 w-5 text-red-500" />
                  Posts You Liked
                </h2>
                
                {loading ? (
                  // Skeleton loading for likes
                  <ActivitySkeleton count={3} />
                ) : (
                  <div className="space-y-1">
                    {userHistory?.likes.map((like) => (
                      <ActivityCard 
                        key={`like-${like.id}`}
                        activity={like}
                        type="like"
                        formatDate={formatDate}
                      />
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="comments">
              <div className="space-y-1">
                <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
                  <MessageCircle className="h-5 w-5 text-blue-500" />
                  Your Comments
                </h2>
                
                {loading ? (
                  // Skeleton loading for comments
                  <ActivitySkeleton count={2} />
                ) : (
                  <div className="space-y-1">
                    {userHistory?.comments.map((comment) => (
                      <ActivityCard 
                        key={`comment-${comment.id}`}
                        activity={comment}
                        type="comment"
                        formatDate={formatDate}
                      />
                    ))}
                  </div>
                )}
              </div>
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

// Activity Card Component
interface ActivityCardProps {
  activity: any;
  type: 'like' | 'comment';
  formatDate: (date: string) => string;
}

const ActivityCard = ({ activity, type, formatDate }: ActivityCardProps) => {
  return (
    <Card className="p-4 hover:bg-accent/10 transition-colors animate-fade-in">
      <div className="flex items-start gap-3">
        <div className="mt-1">
          {type === 'like' ? (
            <Badge className="rounded-full bg-red-100 text-red-500 hover:bg-red-100 p-1.5">
              <Heart className="h-3.5 w-3.5 fill-current" />
            </Badge>
          ) : (
            <Badge className="rounded-full bg-blue-100 text-blue-500 hover:bg-blue-100 p-1.5">
              <MessageCircle className="h-3.5 w-3.5" />
            </Badge>
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium">You {type === 'like' ? 'liked' : 'commented on'} a post </span>
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{activity.post.content}</p>
          
          {type === 'comment' && (
            <div className="px-3 py-2 bg-muted/30 rounded-md mb-2 text-sm">
              <p className="italic">"{activity.comment}"</p>
            </div>
          )}
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span>{formatDate(activity.actionDate)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

// Skeleton component for loading
const ActivitySkeleton = ({ count = 3 }: { count?: number }) => {
  return (
    <div className="space-y-3">
      {Array(count).fill(0).map((_, index) => (
        <Card key={index} className="p-4">
          <div className="flex items-start gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-3 w-full mb-2" />
              <Skeleton className="h-3 w-1/2 mb-2" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default History;